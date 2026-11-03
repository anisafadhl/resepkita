import React, { useState, useMemo } from 'react';
import { Utensils, Bookmark, SlidersHorizontal, SearchX, Plus, Trash2 } from 'lucide-react';
import { useRecipes } from './context/RecipeContext';
import { Header } from './components/Header';
import { UserBanner } from './components/UserBanner';
import { Recommendations } from './components/Recommendations';
import { RecipeCard } from './components/RecipeCard';
import { RecipeDetailPage } from './pages/RecipeDetailPage';
import { CookingModePage } from './pages/CookingModePage';
import { RecipeFormPage } from './pages/RecipeFormPage';
import { LoginModal } from './components/LoginModal';
import { MobileNav } from './components/MobileNav';
import { Toast } from './components/Toast';
import { Recipe } from './types/recipe';

type ViewMode = 'home' | 'detail' | 'cooking' | 'form';

export const App: React.FC = () => {
  const { recipes, bookmarks, currentUser, showToast, deleteRecipe } = useRecipes();

  // Navigation & View Mode
  const [viewMode, setViewMode] = useState<ViewMode>('home');
  const [activeTab, setActiveTab] = useState<'explore' | 'bookmarks' | 'myRecipes'>('explore');
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [recipeToEdit, setRecipeToEdit] = useState<Recipe | null>(null);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [timeFilter, setTimeFilter] = useState('all');

  // Delete confirmation modal state
  const [recipeToDelete, setRecipeToDelete] = useState<Recipe | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Simple Auth Modal
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  // Filter recipes logic
  const filteredRecipes = useMemo(() => {
    let list = [...recipes];

    // Simpanan Tab
    if (activeTab === 'bookmarks') {
      list = list.filter(r => bookmarks.includes(r.id));
    }

    // Resep Saya Tab
    if (activeTab === 'myRecipes' && currentUser) {
      const currentUserName = currentUser.name.toLowerCase();
      list = list.filter(r => 
        r.author.toLowerCase() === currentUserName ||
        r.author === 'Pengguna Resep Kita' ||
        r.author === 'Saya Sendiri'
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
  }, [recipes, bookmarks, activeTab, currentUser, searchQuery, difficultyFilter, timeFilter]);

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
      showToast('Silakan masuk akun terlebih dahulu untuk menulis resep.');
      setIsLoginOpen(true);
    } else {
      setRecipeToEdit(null);
      setViewMode('form');
    }
  };

  const handleOpenEditRecipe = (recipe: Recipe) => {
    setRecipeToEdit(recipe);
    setViewMode('form');
  };

  const handleConfirmDelete = async () => {
    if (!recipeToDelete) return;
    setIsDeleting(true);
    await deleteRecipe(recipeToDelete.id);
    setIsDeleting(false);
    setRecipeToDelete(null);
  };

  const handleShowMyRecipes = () => {
    if (!currentUser) return;
    setActiveTab('myRecipes');
    setSearchQuery('');
    setViewMode('home');
    showToast(`Menampilkan kumpulan resep buatanmu`);
  };

  const handleSelectTab = (tab: 'explore' | 'bookmarks') => {
    setActiveTab(tab);
    setViewMode('home');
  };

  const resetAllFilters = () => {
    setSearchQuery('');
    setDifficultyFilter('all');
    setTimeFilter('all');
  };

  const myRecipesCount = currentUser 
    ? recipes.filter(r => 
        r.author.toLowerCase() === currentUser.name.toLowerCase() || 
        r.author === 'Pengguna Resep Kita' || 
        r.author === 'Saya Sendiri'
      ).length 
    : 0;

  return (
    <div className="bg-stone-50 text-stone-800 antialiased min-h-screen pb-24 md:pb-12 transition-all">
      <Toast />

      {/* Delete Confirmation Modal for Card Delete */}
      {recipeToDelete && (
        <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-stone-200">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mb-4">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-black text-stone-900 mb-2">Hapus Resep Masakan?</h3>
            <p className="text-sm text-stone-500 mb-6 leading-relaxed">
              Resep <b>"{recipeToDelete.title}"</b> akan dihapus secara permanen. Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setRecipeToDelete(null)}
                className="px-5 py-2.5 rounded-2xl border border-stone-200 text-stone-700 font-bold text-sm hover:bg-stone-50 cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="px-5 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-700 active:scale-95 text-white font-bold text-sm shadow-md transition-all cursor-pointer disabled:opacity-50"
              >
                {isDeleting ? 'Menghapus...' : 'Ya, Hapus'}
              </button>
            </div>
          </div>
        </div>
      )}

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
          onEditRecipe={handleOpenEditRecipe}
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

      {viewMode === 'form' && (
        <RecipeFormPage 
          initialRecipe={recipeToEdit}
          onBack={() => setViewMode(selectedRecipe ? 'detail' : 'home')}
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
          <div className="flex border-b-2 border-stone-200 mb-6 font-semibold text-sm sm:text-base gap-8 flex-wrap">
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

            {currentUser && (
              <button 
                onClick={() => setActiveTab('myRecipes')} 
                className={`pb-3 border-b-4 flex items-center gap-2.5 transition-all cursor-pointer ${
                  activeTab === 'myRecipes'
                    ? 'border-brand-500 text-brand-600 font-bold'
                    : 'border-transparent text-stone-500 hover:text-stone-800'
                }`}
              >
                <span>Resep Buatanku ({myRecipesCount})</span>
              </button>
            )}
          </div>

          {/* Filter Section */}
          {activeTab === 'explore' && (
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm text-stone-600 bg-white p-4 rounded-2xl border border-stone-200 shadow-sm">
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
          )}

          {/* My Recipes Banner with Quick Add Action */}
          {activeTab === 'myRecipes' && (
            <div className="mb-6 flex items-center justify-between bg-white p-5 rounded-3xl border border-stone-200 shadow-sm flex-wrap gap-4">
              <div>
                <h3 className="font-black text-stone-900 text-lg">Kelola Resep Buatanmu</h3>
                <p className="text-xs sm:text-sm text-stone-500">
                  Kamu bisa mengedit isi resep, memperbarui bahan & foto, atau menghapusnya kapan saja.
                </p>
              </div>
              <button
                onClick={handleOpenCreateClick}
                className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-sm shadow-md shadow-brand-500/20 cursor-pointer active:scale-95 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Tulis Resep Baru</span>
              </button>
            </div>
          )}

          {/* Recipe Cards Grid */}
          {filteredRecipes.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
              {filteredRecipes.map((recipe) => (
                <RecipeCard 
                  key={recipe.id} 
                  recipe={recipe} 
                  onSelect={handleOpenDetail} 
                  onEdit={handleOpenEditRecipe}
                  onDelete={(r) => setRecipeToDelete(r)}
                />
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="text-center py-20 px-4 bg-white rounded-3xl border border-dashed border-stone-300">
              <div className="w-20 h-20 bg-stone-100 text-stone-400 rounded-3xl flex items-center justify-center mx-auto mb-4">
                <SearchX className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold text-stone-800 mb-2">
                {activeTab === 'myRecipes' ? 'Kamu Belum Menulis Resep' : 'Resep Belum Ditemukan'}
              </h3>
              <p className="text-sm text-stone-500 max-w-md mx-auto mb-6">
                {activeTab === 'myRecipes'
                  ? 'Mulai bagikan hidangan rumahan favorit keluargamu sekarang dengan klik tombol di bawah!'
                  : 'Jangan khawatir! Coba ganti kata kunci masakanmu atau klik tombol di bawah untuk menampilkan seluruh daftar resep.'}
              </p>
              {activeTab === 'myRecipes' ? (
                <button 
                  onClick={handleOpenCreateClick} 
                  className="px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white rounded-2xl text-sm font-bold transition-all shadow-md cursor-pointer"
                >
                  Tulis Resep Pertamamu
                </button>
              ) : (
                <button 
                  onClick={resetAllFilters} 
                  className="px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white rounded-2xl text-sm font-bold transition-all shadow-md cursor-pointer"
                >
                  Tampilkan Semua Resep
                </button>
              )}
            </div>
          )}
        </main>
      )}

      {/* Mobile Bottom Navigation */}
      <MobileNav 
        activeTab={activeTab === 'myRecipes' ? 'explore' : activeTab}
        onSelectTab={handleSelectTab}
        onOpenCreate={handleOpenCreateClick}
        onOpenLogin={() => setIsLoginOpen(true)}
        onShowMyRecipes={handleShowMyRecipes}
      />

      {/* Auth Modal */}
      <LoginModal 
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onSuccessLogin={() => setViewMode('form')}
      />
    </div>
  );
};

export default App;
