import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Recipe, UserProfile } from '../types/recipe';
import { defaultRecipes } from '../data/defaultRecipes';

interface SupabaseRecipeRow {
  id: string;
  title: string;
  tags: string[];
  time: number;
  difficulty: 'Mudah' | 'Sedang' | 'Sulit';
  author: string;
  author_id?: string;
  rating: number;
  reviews_count: number;
  image: string;
  description: string;
  portion_base: number;
  ingredients: { name: string; qty: number; unit: string }[];
  steps: string[];
  tips?: string;
  created_at?: string;
}

interface RecipeContextType {
  recipes: Recipe[];
  bookmarks: string[];
  currentUser: UserProfile | null;
  loading: boolean;
  isOnlineDatabase: boolean;
  toggleBookmark: (id: string) => void;
  createRecipe: (recipeData: Omit<Recipe, 'id' | 'rating' | 'reviewsCount'>) => Promise<boolean>;
  updateRecipe: (id: string, updatedData: Partial<Recipe>) => Promise<boolean>;
  deleteRecipe: (id: string) => Promise<boolean>;
  setCurrentUser: (user: UserProfile | null) => void;
  logout: () => void;
  toast: { message: string; type: 'success' | 'error' } | null;
  showToast: (message: string, isError?: boolean) => void;
  searchHistoryFrequencies: Record<string, number>;
  trackUserInterest: (keyword: string) => void;
  resetPersonalization: () => void;
}

const RecipeContext = createContext<RecipeContextType | undefined>(undefined);

export const RecipeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [searchHistoryFrequencies, setSearchHistoryFrequencies] = useState<Record<string, number>>({});

  const showToast = (message: string, isError = false) => {
    setToast({ message, type: isError ? 'error' : 'success' });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  // Load local state & Supabase data
  useEffect(() => {
    try {
      const savedBm = localStorage.getItem('resepkita_v2_bookmarks');
      if (savedBm) setBookmarks(JSON.parse(savedBm));

      const savedUser = localStorage.getItem('resepkita_current_user');
      if (savedUser) setCurrentUser(JSON.parse(savedUser));

      const savedFreq = localStorage.getItem('resepkita_search_frequencies');
      if (savedFreq) {
        setSearchHistoryFrequencies(JSON.parse(savedFreq));
      } else {
        setSearchHistoryFrequencies({ 'dessert': 1, 'ayam': 1 });
      }
    } catch (e) {
      console.error('Failed reading localStorage', e);
    }

    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    setLoading(true);
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('recipes')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.warn('Supabase fetch failed, falling back to local storage:', error.message);
          loadLocalRecipes();
        } else if (data && data.length > 0) {
          const mapped: Recipe[] = (data as SupabaseRecipeRow[]).map(item => ({
            id: String(item.id),
            title: item.title,
            tags: item.tags || [],
            time: item.time,
            difficulty: item.difficulty,
            author: item.author,
            author_id: item.author_id,
            rating: item.rating || 5.0,
            reviewsCount: item.reviews_count || 1,
            image: item.image,
            desc: item.description,
            portionBase: item.portion_base || 2,
            ingredients: item.ingredients || [],
            steps: item.steps || [],
            tips: item.tips,
            created_at: item.created_at,
          }));
          setRecipes(mapped);
        } else {
          loadLocalRecipes();
        }
      } catch (err) {
        console.error('Error connecting to Supabase:', err);
        loadLocalRecipes();
      }
    } else {
      loadLocalRecipes();
    }
    setLoading(false);
  };

  const loadLocalRecipes = () => {
    const saved = localStorage.getItem('resepkita_v2_recipes');
    if (saved) {
      try {
        setRecipes(JSON.parse(saved));
        return;
      } catch (e) {
        console.error(e);
      }
    }
    setRecipes([]);
    localStorage.setItem('resepkita_v2_recipes', JSON.stringify([]));
  };

  const toggleBookmark = (id: string) => {
    let next: string[];
    if (bookmarks.includes(id)) {
      next = bookmarks.filter(b => b !== id);
      showToast('Resep dihapus dari simpanan.');
    } else {
      next = [...bookmarks, id];
      showToast('Resep berhasil disimpan ke favoritmu ⭐');
    }
    setBookmarks(next);
    localStorage.setItem('resepkita_v2_bookmarks', JSON.stringify(next));
  };

  const trackUserInterest = (keyword: string) => {
    if (!keyword || keyword.length < 3) return;
    const lower = keyword.toLowerCase().trim();
    const recognizedTopics = ['dessert', 'manis', 'cokelat', 'ayam', 'sayur', 'sup', 'pedas', 'tempe', 'hemat', 'pancake', 'puding'];
    
    setSearchHistoryFrequencies(prev => {
      const updated = { ...prev };
      recognizedTopics.forEach(topic => {
        if (lower.includes(topic)) {
          updated[topic] = (updated[topic] || 0) + 1;
        }
      });
      localStorage.setItem('resepkita_search_frequencies', JSON.stringify(updated));
      return updated;
    });
  };

  const resetPersonalization = () => {
    setSearchHistoryFrequencies({});
    localStorage.removeItem('resepkita_search_frequencies');
    showToast('Preferensi pencarian telah di-reset ke setelan awal.');
  };

  // CREATE
  const createRecipe = async (newRecipeData: Omit<Recipe, 'id' | 'rating' | 'reviewsCount'>): Promise<boolean> => {
    if (isSupabaseConfigured && supabase) {
      try {
        const payload = {
          title: newRecipeData.title,
          tags: newRecipeData.tags,
          time: newRecipeData.time,
          difficulty: newRecipeData.difficulty,
          author: newRecipeData.author,
          rating: 5.0,
          reviews_count: 1,
          image: newRecipeData.image,
          description: newRecipeData.desc,
          portion_base: newRecipeData.portionBase || 2,
          ingredients: newRecipeData.ingredients,
          steps: newRecipeData.steps,
          tips: newRecipeData.tips,
        };

        const { data, error } = await supabase.from('recipes').insert([payload]).select();

        if (error) {
          console.error('Supabase insert error, falling back locally:', error);
          showToast('Gagal simpan ke Supabase, disimpan ke lokal.', true);
        } else if (data && data[0]) {
          const inserted = data[0];
          const newRecipe: Recipe = {
            id: String(inserted.id),
            title: inserted.title,
            tags: inserted.tags,
            time: inserted.time,
            difficulty: inserted.difficulty,
            author: inserted.author,
            rating: inserted.rating,
            reviewsCount: inserted.reviews_count,
            image: inserted.image,
            desc: inserted.description,
            portionBase: inserted.portion_base,
            ingredients: inserted.ingredients,
            steps: inserted.steps,
            tips: inserted.tips,
            created_at: inserted.created_at
          };
          setRecipes(prev => [newRecipe, ...prev]);
          showToast('Resep barumu berhasil diterbitkan ke Supabase! 🎉');
          return true;
        }
      } catch (e) {
        console.error(e);
      }
    }

    // Local fallback
    const localRecipe: Recipe = {
      ...newRecipeData,
      id: 'usr_' + Date.now(),
      rating: 5.0,
      reviewsCount: 1,
    };
    const updated = [localRecipe, ...recipes];
    setRecipes(updated);
    localStorage.setItem('resepkita_v2_recipes', JSON.stringify(updated));
    showToast('Resep barumu berhasil diterbitkan! 🎉');
    return true;
  };

  // UPDATE
  const updateRecipe = async (id: string, updatedData: Partial<Recipe>): Promise<boolean> => {
    if (isSupabaseConfigured && supabase) {
      try {
        const payload: Record<string, any> = {};
        if (updatedData.title !== undefined) payload.title = updatedData.title;
        if (updatedData.tags !== undefined) payload.tags = updatedData.tags;
        if (updatedData.time !== undefined) payload.time = updatedData.time;
        if (updatedData.difficulty !== undefined) payload.difficulty = updatedData.difficulty;
        if (updatedData.image !== undefined) payload.image = updatedData.image;
        if (updatedData.desc !== undefined) payload.description = updatedData.desc;
        if (updatedData.portionBase !== undefined) payload.portion_base = updatedData.portionBase;
        if (updatedData.ingredients !== undefined) payload.ingredients = updatedData.ingredients;
        if (updatedData.steps !== undefined) payload.steps = updatedData.steps;
        if (updatedData.tips !== undefined) payload.tips = updatedData.tips;

        const { error } = await supabase.from('recipes').update(payload).eq('id', id);

        if (error) {
          console.error('Supabase update error:', error);
          showToast('Gagal memperbarui resep di Supabase', true);
        } else {
          setRecipes(prev => prev.map(r => r.id === id ? { ...r, ...updatedData } : r));
          showToast('Resep berhasil diperbarui! ✨');
          return true;
        }
      } catch (e) {
        console.error(e);
      }
    }

    // Local update
    setRecipes(prev => {
      const updated = prev.map(r => r.id === id ? { ...r, ...updatedData } : r);
      localStorage.setItem('resepkita_v2_recipes', JSON.stringify(updated));
      return updated;
    });
    showToast('Resep berhasil diperbarui! ✨');
    return true;
  };

  // DELETE
  const deleteRecipe = async (id: string): Promise<boolean> => {
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.from('recipes').delete().eq('id', id);
        if (error) {
          console.error('Supabase delete error:', error);
          showToast('Gagal menghapus resep di Supabase', true);
        } else {
          setRecipes(prev => prev.filter(r => r.id !== id));
          setBookmarks(prev => prev.filter(b => b !== id));
          showToast('Resep berhasil dihapus.');
          return true;
        }
      } catch (e) {
        console.error(e);
      }
    }

    // Local delete
    setRecipes(prev => {
      const updated = prev.filter(r => r.id !== id);
      localStorage.setItem('resepkita_v2_recipes', JSON.stringify(updated));
      return updated;
    });
    setBookmarks(prev => {
      const updatedBm = prev.filter(b => b !== id);
      localStorage.setItem('resepkita_v2_bookmarks', JSON.stringify(updatedBm));
      return updatedBm;
    });
    showToast('Resep berhasil dihapus.');
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('resepkita_current_user');
    showToast('Kamu telah keluar. Kamu tetap bebas mencari semua resep!');
  };

  const handleSetCurrentUser = (user: UserProfile | null) => {
    setCurrentUser(user);
    if (user) {
      localStorage.setItem('resepkita_current_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('resepkita_current_user');
    }
  };

  return (
    <RecipeContext.Provider
      value={{
        recipes,
        bookmarks,
        currentUser,
        loading,
        isOnlineDatabase: isSupabaseConfigured,
        toggleBookmark,
        createRecipe,
        updateRecipe,
        deleteRecipe,
        setCurrentUser: handleSetCurrentUser,
        logout,
        toast,
        showToast,
        searchHistoryFrequencies,
        trackUserInterest,
        resetPersonalization,
      }}
    >
      {children}
    </RecipeContext.Provider>
  );
};

export const useRecipes = () => {
  const context = useContext(RecipeContext);
  if (!context) {
    throw new Error('useRecipes must be used within a RecipeProvider');
  }
  return context;
};
