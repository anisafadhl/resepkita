import React from 'react';
import { ChefHat, Search, XCircle, PlusCircle, User } from 'lucide-react';
import { useRecipes } from '../context/RecipeContext';

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onOpenLogin: () => void;
  onOpenCreate: () => void;
  onSelectExploreTab: () => void;
  onShowMyRecipes: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  setSearchQuery,
  onOpenLogin,
  onOpenCreate,
  onSelectExploreTab,
  onShowMyRecipes,
}) => {
  const { currentUser } = useRecipes();

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-[1600px] w-full mx-auto px-4 sm:px-8 xl:px-12 h-20 flex items-center justify-between gap-6">
        
        {/* Brand Logo */}
        <button 
          onClick={onSelectExploreTab} 
          className="flex items-center gap-3.5 flex-shrink-0 group text-left cursor-pointer focus:outline-none"
        >
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-amber-500 flex items-center justify-center text-white shadow-lg shadow-brand-500/25 group-hover:scale-105 transition-transform">
            <ChefHat className="w-7 h-7" />
          </div>
          <div>
            <span className="text-2xl font-black bg-gradient-to-r from-brand-600 to-amber-600 bg-clip-text text-transparent block">
              Resep Kita
            </span>
            <span className="hidden sm:block text-xs text-stone-500 font-medium">Teman Masak Rumahan Semua Umur</span>
          </div>
        </button>

        {/* Large Clear Search Input (Expands gracefully on Desktop) */}
        <div className="flex-1 max-w-2xl relative">
          <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari masakan: rendang, kolak, soto, ayam kecap, pancake..." 
            className="w-full bg-stone-100 pl-12 pr-10 py-3 rounded-2xl text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all border border-stone-200"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')} 
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 p-1"
              title="Hapus pencarian"
            >
              <XCircle className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Action Buttons Desktop */}
        <div className="hidden md:flex items-center gap-3">
          <button 
            onClick={onOpenCreate} 
            className="flex items-center gap-2 bg-brand-500 hover:bg-brand-600 active:scale-95 text-white px-5 py-3 rounded-2xl text-sm font-bold shadow-md shadow-brand-500/20 transition-all cursor-pointer"
          >
            <PlusCircle className="w-5 h-5" />
            <span>Bagikan Resep</span>
          </button>

          {/* User Profile / Login Button */}
          {currentUser ? (
            <button
              onClick={onShowMyRecipes}
              className="flex items-center gap-2 bg-stone-100 hover:bg-stone-200 p-1.5 pr-3 rounded-2xl cursor-pointer border border-stone-200 transition-all"
              title="Lihat resep saya"
            >
              <div className="w-8 h-8 rounded-xl bg-brand-500 text-white font-bold flex items-center justify-center text-xs shadow-sm">
                {currentUser.name.charAt(0).toUpperCase()}
              </div>
              <div className="text-left">
                <span className="block text-xs font-bold text-stone-800 leading-tight max-w-[120px] truncate">{currentUser.name}</span>
                <span className="block text-[10px] text-stone-500">Koki Terdaftar</span>
              </div>
            </button>
          ) : (
            <button 
              onClick={onOpenLogin} 
              className="flex items-center gap-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 px-4 py-3 rounded-2xl text-xs font-bold border border-stone-200 transition-all cursor-pointer"
            >
              <User className="w-4 h-4 text-stone-500" />
              <span>Masuk / Daftar</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
