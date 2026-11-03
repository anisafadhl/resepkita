import React, { useState, useMemo } from 'react';
import { Utensils, Bookmark, TrendingUp, SlidersHorizontal, SearchX } from 'lucide-react';
import { useRecipes } from './context/RecipeContext';
import { Header } from './components/Header';
import { UserBanner } from './components/UserBanner';
import { Recommendations } from './components/Recommendations';
import { RecipeCard } from './components/RecipeCard';
import { RecipeDetailPage } from './pages/RecipeDetailPage';
import { CookingModePage } from './pages/CookingModePage';
import { CreateRecipePage } from './pages/CreateRecipePage';
import { LoginModal } from './components/LoginModal';
import { MobileNav } from './components/MobileNav';
import { Toast } from './components/Toast';
import { Recipe } from './types/recipe';

type ViewMode = 'home' | 'detail' | 'cooking' | 'create';

export const App: React.FC = () => {
  const { recipes, bookmarks, currentUser, showToast } = useRecipes();

  // Navigation & View Mode
  const [viewMode, setViewMode] = useState<ViewMode>('home');
  const [activeTab, setActiveTab] = useState<'explore' | 'bookmarks'>('explore');
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTag, setActiveTag] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [timeFilter, setTimeFilter] = useState('all');

  // Simple Auth Modal (only for login prompt)
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  // Filter recipes logic
  const filteredRecipes = useMemo(() => {
    let list = [...recipes];

    // Simpanan Tab
    if (activeTab === 'bookmarks') {
      list = list.filter(r => bookmarks.includes(r.id));
    }

    // Quick tag
    if (activeTag) {
      const tagLower = activeTag.toLowerCase();
      list = list.filter(r => 
        r.title.toLowerCase().includes(tagLower) ||
        r.tags.some(t => t.toLowerCase().includes(tagLower)) ||
        r.desc.toLowerCase().includes(tagLower)
      );
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(r => 
        r.title.toLowerCase().includes(q) ||
        r.desc.toLowerCase().includes(q) ||
        r.author.toLowerCase().includes(q) ||
        r.tags.some(t => t.toLowerCase().includes(q)) ||
        (Array.isArray(r.ingredients) && r.ingredients.some(ing => ing.name.toLowerCase().includes(q)))
      );
    }

    // Difficulty filter
    if (difficultyFilter !== 'all') {
      list = list.filter(r => r.difficulty === difficultyFilter);
    }

    // Time filter
    if (timeFilter !== 'all') {
      const maxTime = parseInt(timeFilter);
      list = list.filter(r => r.time <= maxTime);
    }

    return list;
  }, [recipes, bookmarks, activeTab, activeTag, searchQuery, difficultyFilter, timeFilter]);

  // Page Transitions
  const handleOpenDetail = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setViewMode('detail');
  };

  const handleStartCooking = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setViewMode('cooking');
  };

  const handleOpenCreateClick = () => {
    if (!currentUser) {
      showToast('Silakan masuk terlebih dahulu untuk menulis resep.');
      setIsLoginOpen(true);
    } else {
      setViewMode('create');
    }
  };

  const handleShowMyRecipes = () => {
    if (!currentUser) return;
    setSearchQuery(currentUser.name);
    setActiveTab('explore');
    setViewMode('home');
    showToast(`Menampilkan kumpulan resep buatan ${currentUser.name}`);
  };

  const handleSelectTab = (tab: 'explore' | 'bookmarks') => {
    setActiveTab(tab);
    setViewMode('home');
  };

  const resetAllFilters = () => {
    setSearchQuery('');
    setActiveTag('');
    setDifficultyFilter('all');
    setTimeFilter('all');
  };

  return (
    <div className="bg-stone-50 text-stone-800 antialiased min-h-screen pb-24 md:pb-12 transition-all">
      <Toast />

      {/* Main Header Navbar */}
      <Header 
        searchQuery={searchQuery}
        setSearchQuery={(q) => {
          setSearchQuery(q);
          if (viewMode !== 'home') setViewMode('home');
        }}
        onOpenLogin={() => setIsLoginOpen(true)}
        onOpenCreate={handleOpenCreateClick}
        onSelectExploreTab={() => {
          setActiveTab('explore');
          setViewMode('home');
        }}
        onShowMyRecipes={handleShowMyRecipes}
      />

      {/* ================= ROUTING / VIEW RENDERING ================= */}
      {viewMode === 'detail' && selectedRecipe && (
        <RecipeDetailPage 
          recipe={selectedRecipe}
          onBack={() => setViewMode('home')}
          onStartCookingMode={handleStartCooking}
        />
      )}

      {viewMode === 'cooking' && selectedRecipe && (
        <CookingModePage 
          recipe={selectedRecipe}
          onBack={() => setViewMode('detail')}
          onFinish={() => {
            showToast('Selamat! Hidangan lezatmu sudah siap disajikan 🍽️');
            setViewMode('detail');
          }}
        />
      )}

      {viewMode === 'create' && (
        <CreateRecipePage 
          onBack={() => setViewMode('home')}
          onSuccess={() => {
            setViewMode('home');
            setActiveTab('explore');
          }}
        />
      )}

      {viewMode === 'home' && (
        <main className="max-w-[1600px] w-full mx-auto px-4 sm:px-8 xl:px-12 pt-6">
          {/* User Logged-in Banner */}
          <UserBanner onShowMyRecipes={handleShowMyRecipes} />

          {/* Smart Recommendations Section */}
          {activeTab === 'explore' && (
            <Recommendations onSelectRecipe={handleOpenDetail} />
          )}

          {/* Tab Navigation */}
          <div className="flex border-b-2 border-stone-200 mb-6 font-semibold text-sm sm:text-base gap-8">
            <button 
              onClick={() => setActiveTab('explore')} 
              className={`pb-3 border-b-4 flex items-center gap-2.5 transition-all cursor-pointer ${
                activeTab === 'explore'
                  ? 'border-brand-500 text-brand-600 font-bold'
                  : 'border-transparent text-stone-500 hover:text-stone-800'
              }`}
            >
              <Utensils className="w-5 h-5" />
              <span>Semua Resep Masakan</span>
            </button>
            
            <button 
              onClick={() => setActiveTab('bookmarks')} 
              className={`pb-3 border-b-4 flex items-center gap-2.5 transition-all cursor-pointer ${
                activeTab === 'bookmarks'
                  ? 'border-brand-500 text-brand-600 font-bold'
                  : 'border-transparent text-stone-500 hover:text-stone-800'
              }`}
            >
              <Bookmark className="w-5 h-5" />
              <span>Resep Simpananku ({bookmarks.length})</span>
            </button>
          </div>

          {/* Filter Section */}
          {activeTab === 'explore' && (
            <div className="mb-6 space-y-4">
              {/* Quick popular tags */}
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 text-xs sm:text-sm">
                <span className="text-stone-400 font-bold text-xs flex-shrink-0 mr-1 flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5 text-brand-500" /> Populer:
                </span>
                
                <button 
                  onClick={() => setActiveTag('')}
                  className={`flex-shrink-0 px-4 py-2 rounded-xl font-bold transition-all cursor-pointer ${
                    activeTag === '' 
                      ? 'bg-brand-500 text-white shadow-md shadow-brand-500/20' 
                      : 'bg-white border border-stone-200 text-stone-700 hover:border-brand-500'
                  }`}
                >
                  Semua Resep
                </button>

                {[
                  { tag: 'manis', label: '🍰 Aneka Manis & Dessert' },
                  { tag: 'gurih', label: '🍲 Aneka Gurih & Lauk' },
                  { tag: 'ayam', label: '🍗 Aneka Ayam' },
                  { tag: 'sayur', label: '🥗 Sayur & Sup Sehat' },
                  { tag: 'pedas', label: '🌶️ Sambal & Pedas' },
                  { tag: 'hemat', label: '💰 Budget Hemat' },
                ].map(({ tag, label }) => (
                  <button
                    key={tag}
                    onClick={() => setActiveTag(tag)}
                    className={`flex-shrink-0 px-4 py-2 rounded-xl font-bold transition-all cursor-pointer ${
                      activeTag === tag
                        ? 'bg-brand-500 text-white shadow-md shadow-brand-500/20'
                        : 'bg-white border border-stone-200 text-stone-700 hover:border-brand-500'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {/* Dropdown filters */}
              <div className="flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm text-stone-600 bg-white p-4 rounded-2xl border border-stone-200 shadow-sm">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-1.5 font-bold text-stone-800">
                    <SlidersHorizontal className="w-4 h-4 text-brand-600" />
                    <span>Urutkan & Saring:</span>
                  </div>
                  <select 
                    value={difficultyFilter}
                    onChange={(e) => setDifficultyFilter(e.target.value)}
                    className="bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs font-semibold focus:ring-2 focus:ring-brand-500 focus:outline-none cursor-pointer"
                  >
                    <option value="all">Semua Kesulitan</option>
                    <option value="Mudah">Mudah & Praktis</option>
                    <option value="Sedang">Sedang</option>
                  </select>
                  <select 
                    value={timeFilter}
                    onChange={(e) => setTimeFilter(e.target.value)}
                    className="bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs font-semibold focus:ring-2 focus:ring-brand-500 focus:outline-none cursor-pointer"
                  >
                    <option value="all">Semua Waktu Masak</option>
                    <option value="20">Kilat (&le; 20 menit)</option>
                    <option value="40">Santai (&le; 40 menit)</option>
                  </select>
                </div>

                <div className="font-bold text-brand-700 bg-brand-50 px-3 py-1 rounded-xl">
                  {filteredRecipes.length} Resep Siap Masak
                </div>
              </div>
            </div>
          )}

          {/* Recipe Cards Grid (Responsive 1/2/3/4 Kolom di Layar Lebar) */}
          {filteredRecipes.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
              {filteredRecipes.map((recipe) => (
                <RecipeCard 
                  key={recipe.id} 
                  recipe={recipe} 
                  onSelect={handleOpenDetail} 
                />
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="text-center py-20 px-4 bg-white rounded-3xl border border-dashed border-stone-300">
              <div className="w-20 h-20 bg-stone-100 text-stone-400 rounded-3xl flex items-center justify-center mx-auto mb-4">
                <SearchX className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold text-stone-800 mb-2">Resep Belum Ditemukan</h3>
              <p className="text-sm text-stone-500 max-w-md mx-auto mb-6">
                Jangan khawatir! Coba ganti kata kunci masakanmu atau klik tombol di bawah untuk menampilkan seluruh daftar resep.
              </p>
              <button 
                onClick={resetAllFilters} 
                className="px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white rounded-2xl text-sm font-bold transition-all shadow-md cursor-pointer"
              >
                Tampilkan Semua Resep
              </button>
            </div>
          )}
        </main>
      )}

      {/* Mobile Bottom Navigation */}
      <MobileNav 
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
        onOpenCreate={handleOpenCreateClick}
        onOpenLogin={() => setIsLoginOpen(true)}
        onShowMyRecipes={handleShowMyRecipes}
      />

      {/* Login Modal */}
      <LoginModal 
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onSuccessLogin={() => setViewMode('create')}
      />
    </div>
  );
};

export default App;
