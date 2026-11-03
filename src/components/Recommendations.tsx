import React from 'react';
import { Sparkles, RotateCcw, Clock, Star, Bookmark } from 'lucide-react';
import { Recipe } from '../types/recipe';
import { useRecipes } from '../context/RecipeContext';

interface RecommendationsProps {
  onSelectRecipe: (recipe: Recipe) => void;
}

export const Recommendations: React.FC<RecommendationsProps> = ({ onSelectRecipe }) => {
  const { recipes, bookmarks, toggleBookmark, searchHistoryFrequencies, resetPersonalization } = useRecipes();

  // Determine top user interest
  let topTopic = 'semua';
  let highestCount = 0;
  for (const [topic, count] of Object.entries(searchHistoryFrequencies)) {
    if (count > highestCount) {
      highestCount = count;
      topTopic = topic;
    }
  }

  let recommendedList: Recipe[] = [];

  if (highestCount > 1 && topTopic !== 'semua') {
    recommendedList = recipes.filter(r => 
      r.title.toLowerCase().includes(topTopic) || 
      r.tags.some(t => t.toLowerCase().includes(topTopic)) || 
      r.desc.toLowerCase().includes(topTopic)
    );
  }

  // Top up with highest rated recipes if less than 4
  if (recommendedList.length < 4) {
    const topRated = [...recipes].sort((a, b) => b.rating - a.rating);
    topRated.forEach(r => {
      if (!recommendedList.some(item => item.id === r.id)) {
        recommendedList.push(r);
      }
    });
  }

  const topItems = recommendedList.slice(0, 4);

  return (
    <section className="mb-10">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-brand-100 text-brand-600">
              <Sparkles className="w-5 h-5" />
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-stone-900">Rekomendasi Spesial Untukmu</h2>
          </div>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            {highestCount > 1 && topTopic !== 'semua' ? (
              <span>✨ Menyesuaikan seleramu: kamu sering mencari topik <b className="text-brand-600 uppercase">{topTopic}</b></span>
            ) : (
              'Berdasarkan masakan terpopuler & sering dicari oleh komunitas'
            )}
          </p>
        </div>
        <button 
          onClick={resetPersonalization} 
          className="text-xs text-stone-400 hover:text-stone-600 font-medium underline flex items-center gap-1 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Reset Preferensi
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {topItems.map(recipe => {
          const isFav = bookmarks.includes(recipe.id);
          return (
            <div 
              key={recipe.id}
              onClick={() => onSelectRecipe(recipe)} 
              className="bg-gradient-to-br from-amber-500/10 via-brand-50 to-white rounded-3xl p-4 border border-brand-200/60 shadow-sm hover:shadow-md transition-all cursor-pointer flex gap-4 items-center group relative overflow-hidden"
            >
              <div className="relative w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0">
                <img 
                  src={recipe.image} 
                  alt={recipe.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = 'https://placehold.co/400x300/ea580c/ffffff?text=Resep';
                  }}
                />
                <div className="absolute inset-0 bg-black/10"></div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1 text-[11px] text-amber-600 font-black mb-1">
                  <Sparkles className="w-3 h-3" />
                  <span>Pilihan Terbaik</span>
                </div>
                <h4 className="font-bold text-stone-900 text-sm truncate group-hover:text-brand-600 transition-colors">
                  {recipe.title}
                </h4>
                <div className="flex items-center gap-3 text-xs text-stone-500 mt-1 font-medium">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-stone-400" /> {recipe.time}m
                  </span>
                  <span className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> {recipe.rating}
                  </span>
                </div>
              </div>

              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  toggleBookmark(recipe.id);
                }} 
                className="p-1.5 text-stone-400 hover:text-brand-600 transition-colors cursor-pointer" 
                title="Simpan"
              >
                <Bookmark className={`w-4 h-4 ${isFav ? 'fill-brand-500 text-brand-500' : ''}`} />
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
};
