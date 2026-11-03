import React from 'react';
import { Compass, Plus, Bookmark, User } from 'lucide-react';
import { useRecipes } from '../context/RecipeContext';

interface MobileNavProps {
  activeTab: 'explore' | 'bookmarks';
  onSelectTab: (tab: 'explore' | 'bookmarks') => void;
  onOpenCreate: () => void;
  onOpenLogin: () => void;
  onShowMyRecipes: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  activeTab,
  onSelectTab,
  onOpenCreate,
  onOpenLogin,
  onShowMyRecipes,
}) => {
  const { currentUser } = useRecipes();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-stone-200 px-4 py-2 flex items-center justify-around z-40">
      <button 
        onClick={() => onSelectTab('explore')} 
        className={`flex flex-col items-center gap-1 py-1 ${activeTab === 'explore' ? 'text-brand-600 font-bold' : 'text-stone-500'}`}
      >
        <Compass className="w-6 h-6" />
        <span className="text-[11px]">Jelajah</span>
      </button>

      <button 
        onClick={onOpenCreate} 
        className="flex flex-col items-center gap-1 text-stone-500 hover:text-brand-600 py-1"
      >
        <div className="w-11 h-11 rounded-2xl bg-brand-500 text-white flex items-center justify-center -mt-5 shadow-lg shadow-brand-500/30">
          <Plus className="w-6 h-6" />
        </div>
        <span className="text-[11px] font-bold">Tulis</span>
      </button>

      <button 
        onClick={() => onSelectTab('bookmarks')} 
        className={`flex flex-col items-center gap-1 py-1 ${activeTab === 'bookmarks' ? 'text-brand-600 font-bold' : 'text-stone-500'}`}
      >
        <Bookmark className="w-6 h-6" />
        <span className="text-[11px]">Simpanan</span>
      </button>

      <button 
        onClick={currentUser ? onShowMyRecipes : onOpenLogin} 
        className="flex flex-col items-center gap-1 text-stone-500 hover:text-brand-600 py-1"
      >
        <User className="w-6 h-6" />
        <span className="text-[11px] font-bold">{currentUser ? 'Profil' : 'Masuk'}</span>
      </button>
    </nav>
  );
};
