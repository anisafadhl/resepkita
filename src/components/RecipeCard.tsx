import React from 'react';
import { Star, Clock, Smile, ChevronRight, Bookmark, Edit3, Trash2 } from 'lucide-react';
import { Recipe } from '../types/recipe';
import { useRecipes } from '../context/RecipeContext';

interface RecipeCardProps {
  recipe: Recipe;
  onSelect: (recipe: Recipe) => void;
  onEdit?: (recipe: Recipe) => void;
  onDelete?: (recipe: Recipe) => void;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, onSelect, onEdit, onDelete }) => {
  const { bookmarks, toggleBookmark, currentUser } = useRecipes();
  const isFav = bookmarks.includes(recipe.id);
  const displayTag = recipe.tags && recipe.tags[0] ? `#${recipe.tags[0]}` : '#resep';

  const isAuthor = currentUser && (
    recipe.author.toLowerCase() === currentUser.name.toLowerCase() ||
    recipe.author === 'Pengguna Resep Kita' ||
    recipe.author === 'Saya Sendiri'
  );

  return (
    <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-sm hover:shadow-lg transition-all flex flex-col group relative">
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

        {/* Action icons container */}
        <div className="absolute top-3.5 right-3.5 flex items-center gap-1.5">
          {/* Quick Edit/Delete buttons on hover for author */}
          {isAuthor && onEdit && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(recipe);
              }}
              className="w-9 h-9 rounded-2xl bg-white/90 hover:bg-white text-stone-700 hover:text-amber-600 flex items-center justify-center shadow-md transition-all cursor-pointer"
              title="Edit resep"
            >
              <Edit3 className="w-4 h-4" />
            </button>
          )}

          {isAuthor && onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(recipe);
              }}
              className="w-9 h-9 rounded-2xl bg-white/90 hover:bg-white text-stone-700 hover:text-rose-600 flex items-center justify-center shadow-md transition-all cursor-pointer"
              title="Hapus resep"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}

          <button 
            onClick={(e) => {
              e.stopPropagation();
              toggleBookmark(recipe.id);
            }} 
            className={`w-9 h-9 rounded-2xl bg-white/90 hover:bg-white text-stone-700 flex items-center justify-center shadow-md transition-all cursor-pointer ${
              isFav ? 'text-brand-600' : ''
            }`}
            title={isFav ? 'Hapus dari Simpanan' : 'Simpan Resep'}
          >
            <Bookmark className={`w-4 h-4 ${isFav ? 'fill-brand-500 text-brand-500' : ''}`} />
          </button>
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between gap-2 text-xs mb-1.5">
            <div className="flex items-center gap-1.5 text-amber-500 font-bold">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span>{recipe.rating}</span>
              <span className="text-stone-400 font-medium">({recipe.reviewsCount || recipe.reviews_count || 1})</span>
            </div>
            {isAuthor && (
              <span className="text-[10px] font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded-full">
                Milikmu
              </span>
            )}
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
