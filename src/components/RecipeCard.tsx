import React from 'react';
import { Star, Clock, Smile, ChevronRight, Bookmark } from 'lucide-react';
import { Recipe } from '../types/recipe';
import { useRecipes } from '../context/RecipeContext';

interface RecipeCardProps {
  recipe: Recipe;
  onSelect: (recipe: Recipe) => void;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, onSelect }) => {
  const { bookmarks, toggleBookmark } = useRecipes();
  const isFav = bookmarks.includes(recipe.id);
  const displayTag = recipe.tags && recipe.tags[0] ? `#${recipe.tags[0]}` : '#resep';

  return (
    <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-sm hover:shadow-lg transition-all flex flex-col group">
      <div 
        className="relative h-52 overflow-hidden cursor-pointer" 
        onClick={() => onSelect(recipe)}
      >
        <img 
          src={recipe.image} 
          alt={recipe.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = 'https://placehold.co/600x400/ea580c/ffffff?text=Resep+Lezat';
          }}
        />
        <div className="absolute top-3.5 left-3.5 bg-white/95 backdrop-blur-md px-3 py-1 rounded-xl text-xs font-bold text-stone-800 shadow-sm capitalize">
          {displayTag}
        </div>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            toggleBookmark(recipe.id);
          }} 
          className={`absolute top-3.5 right-3.5 w-10 h-10 rounded-2xl bg-white/90 hover:bg-white text-stone-700 flex items-center justify-center shadow-md transition-all ${
            isFav ? 'text-brand-600' : ''
          }`}
          title={isFav ? 'Hapus dari Simpanan' : 'Simpan Resep'}
        >
          <Bookmark className={`w-5 h-5 ${isFav ? 'fill-brand-500 text-brand-500' : ''}`} />
        </button>
      </div>

      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs text-amber-500 font-bold mb-1.5">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span>{recipe.rating}</span>
            <span className="text-stone-400 font-medium">({recipe.reviewsCount || recipe.reviews_count || 1} Ulasan)</span>
          </div>
          <h3 
            onClick={() => onSelect(recipe)} 
            className="font-bold text-stone-900 text-lg leading-snug hover:text-brand-600 cursor-pointer mb-2 line-clamp-1"
          >
            {recipe.title}
          </h3>
          <p className="text-xs sm:text-sm text-stone-500 line-clamp-2 mb-4 leading-relaxed">
            {recipe.desc}
          </p>
        </div>

        <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs sm:text-sm">
          <div className="flex items-center gap-3 text-stone-500 font-medium">
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4 text-stone-400" /> {recipe.time} mnt
            </span>
            <span className="flex items-center gap-1">
              <Smile className="w-4 h-4 text-stone-400" /> {recipe.difficulty}
            </span>
          </div>
          <button 
            onClick={() => onSelect(recipe)} 
            className="text-brand-600 font-bold hover:text-brand-700 flex items-center gap-1 text-xs sm:text-sm cursor-pointer"
          >
            Lihat Resep <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
