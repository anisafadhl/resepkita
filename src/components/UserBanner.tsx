import React from 'react';
import { useRecipes } from '../context/RecipeContext';

interface UserBannerProps {
  onShowMyRecipes: () => void;
}

export const UserBanner: React.FC<UserBannerProps> = ({ onShowMyRecipes }) => {
  const { currentUser, recipes, logout } = useRecipes();

  if (!currentUser) return null;

  const myRecipesCount = recipes.filter(
    r => r.author.toLowerCase() === currentUser.name.toLowerCase() || r.author === 'Saya Sendiri'
  ).length;

  return (
    <div className="mb-6 p-4 bg-white rounded-2xl border border-stone-200 shadow-sm flex items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-brand-500 text-white font-bold flex items-center justify-center text-sm shadow">
          {currentUser.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <div className="text-xs text-stone-500">Halo Koki Hebat!</div>
          <div className="font-bold text-stone-900 text-sm">{currentUser.name}</div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button 
          onClick={onShowMyRecipes} 
          className="px-3 py-1.5 rounded-xl bg-brand-50 text-brand-700 hover:bg-brand-100 text-xs font-bold transition-all cursor-pointer"
        >
          Resep Saya ({myRecipesCount})
        </button>
        <button 
          onClick={logout} 
          className="px-3 py-1.5 rounded-xl bg-stone-100 text-stone-600 hover:bg-rose-50 hover:text-rose-600 text-xs font-bold transition-all cursor-pointer" 
          title="Keluar"
        >
          Keluar
        </button>
      </div>
    </div>
  );
};
