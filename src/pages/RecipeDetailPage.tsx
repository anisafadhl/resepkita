import React, { useState } from 'react';
import { ArrowLeft, Bookmark, Sparkles, Clock, Smile, Star, Minus, Plus, Lightbulb } from 'lucide-react';
import { Recipe } from '../types/recipe';
import { useRecipes } from '../context/RecipeContext';

interface RecipeDetailPageProps {
  recipe: Recipe;
  onBack: () => void;
  onStartCookingMode: (recipe: Recipe) => void;
}

export const RecipeDetailPage: React.FC<RecipeDetailPageProps> = ({
  recipe,
  onBack,
  onStartCookingMode,
}) => {
  const { bookmarks, toggleBookmark, trackUserInterest } = useRecipes();
  const [portion, setPortion] = useState<number>(recipe.portionBase || recipe.portion_base || 2);

  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (recipe.tags && Array.isArray(recipe.tags)) {
      recipe.tags.forEach(t => trackUserInterest(t));
    }
  }, [recipe]);

  const isFav = bookmarks.includes(recipe.id);
  const basePortion = recipe.portionBase || recipe.portion_base || 2;
  const multiplier = portion / basePortion;

  const ingredientsList = Array.isArray(recipe.ingredients) ? recipe.ingredients : [];
  const stepsList = Array.isArray(recipe.steps) ? recipe.steps : [];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-2 pb-16 animate-in fade-in duration-200">
      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between py-4 mb-2">
        <button 
          onClick={onBack}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white border border-stone-200 text-stone-700 hover:bg-stone-50 text-sm font-bold shadow-sm transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-brand-600" />
          <span>Kembali ke Beranda</span>
        </button>

        <button 
          onClick={() => toggleBookmark(recipe.id)} 
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl border transition-all cursor-pointer text-sm font-bold shadow-sm ${
            isFav 
              ? 'bg-brand-50 border-brand-300 text-brand-700' 
              : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
          }`}
          title={isFav ? 'Hapus Simpanan' : 'Simpan Resep'}
        >
          <Bookmark className={`w-4 h-4 ${isFav ? 'fill-brand-500 text-brand-500' : 'text-stone-500'}`} />
          <span>{isFav ? 'Tersimpan' : 'Simpan Resep'}</span>
        </button>
      </div>

      {/* Main Recipe Article Card */}
      <article className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden">
        {/* Hero Image */}
        <div className="relative h-72 sm:h-96 w-full bg-stone-100">
          <img 
            src={recipe.image || 'https://placehold.co/1000x600/ea580c/ffffff?text=Resep+Lezat'} 
            alt={recipe.title} 
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = 'https://placehold.co/1000x600/ea580c/ffffff?text=Resep+Lezat';
            }}
          />
          <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between">
            <span className="px-4 py-1.5 rounded-xl text-xs font-black uppercase bg-brand-500 text-white shadow-lg">
              {recipe.tags && recipe.tags[0] ? `#${recipe.tags[0]}` : 'Resep'}
            </span>
            <span className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-white/95 backdrop-blur-md text-stone-800 shadow-lg">
              {recipe.time} Menit • {recipe.difficulty}
            </span>
          </div>
        </div>

        {/* Content Container */}
        <div className="p-6 sm:p-10">
          {/* Title & Author */}
          <div className="mb-6">
            <h1 className="text-3xl sm:text-4xl font-black text-stone-900 leading-tight mb-2">
              {recipe.title}
            </h1>
            <div className="flex items-center gap-2 text-sm text-stone-500 font-medium">
              <span>Dibuat oleh: <b className="text-stone-800">{recipe.author}</b></span>
            </div>
          </div>

          <p className="text-base text-stone-600 mb-8 leading-relaxed">
            {recipe.desc}
          </p>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-3 gap-4 bg-stone-50 p-5 rounded-3xl mb-8 border border-stone-200 text-center">
            <div className="flex flex-col items-center">
              <span className="text-xs text-stone-400 font-bold mb-1 flex items-center gap-1">
                <Clock className="w-4 h-4 text-brand-500" /> Waktu Masak
              </span>
              <span className="font-extrabold text-stone-800 text-base sm:text-lg">{recipe.time} Menit</span>
            </div>
            <div className="flex flex-col items-center border-x border-stone-200">
              <span className="text-xs text-stone-400 font-bold mb-1 flex items-center gap-1">
                <Smile className="w-4 h-4 text-brand-500" /> Tingkat Kesulitan
              </span>
              <span className="font-extrabold text-stone-800 text-base sm:text-lg">{recipe.difficulty}</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-xs text-stone-400 font-bold mb-1 flex items-center gap-1">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" /> Penilaian
              </span>
              <span className="font-extrabold text-stone-800 text-base sm:text-lg">
                {recipe.rating} ({recipe.reviewsCount || recipe.reviews_count || 1} Ulasan)
              </span>
            </div>
          </div>

          {/* CTA Banner: Guided Cooking Mode */}
          <div className="mb-10 bg-gradient-to-r from-brand-500 to-amber-500 rounded-3xl p-6 sm:p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl shadow-brand-500/20">
            <div>
              <div className="flex items-center gap-2 text-brand-100 text-xs font-black uppercase tracking-wider mb-1">
                <Sparkles className="w-4 h-4" /> Mode Dapur Khusus
              </div>
              <h3 className="text-xl sm:text-2xl font-black">Siap Mulai Memasak Sekarang?</h3>
              <p className="text-brand-50 text-xs sm:text-sm mt-1 max-w-md">
                Gunakan panduan memasak langkah demi langkah dengan tampilan layar besar & timer dapur.
              </p>
            </div>
            <button 
              onClick={() => onStartCookingMode(recipe)} 
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white text-brand-700 hover:bg-stone-50 font-black text-sm shadow-md transition-all cursor-pointer flex-shrink-0 active:scale-95"
            >
              Mulai Masak Terpandu
            </button>
          </div>

          {/* Ingredients Section */}
          <section className="mb-10">
            <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-stone-900">Bahan-Bahan yang Dibutuhkan</h2>
                <span className="text-xs text-stone-500 font-medium">Beri centang saat bahan sudah siap</span>
              </div>

              {/* Dynamic Portion Calculator */}
              <div className="flex items-center gap-2 bg-stone-100 px-3.5 py-2 rounded-2xl border border-stone-200 shadow-sm">
                <span className="text-xs font-bold text-stone-500 mr-1">Jumlah Porsi:</span>
                <button 
                  onClick={() => setPortion(prev => Math.max(1, prev - 1))} 
                  className="w-8 h-8 rounded-xl bg-white shadow-sm flex items-center justify-center text-stone-700 hover:bg-stone-50 font-black cursor-pointer transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="font-black text-brand-600 text-base px-2">{portion}</span>
                <button 
                  onClick={() => setPortion(prev => Math.min(25, prev + 1))} 
                  className="w-8 h-8 rounded-xl bg-white shadow-sm flex items-center justify-center text-stone-700 hover:bg-stone-50 font-black cursor-pointer transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {ingredientsList.map((ing, idx) => {
                const scaledQty = Math.round((Number(ing.qty || 0) * multiplier) * 10) / 10;
                return (
                  <label 
                    key={idx} 
                    className="flex items-center justify-between p-4 rounded-2xl hover:bg-brand-50/50 border border-stone-200 bg-white transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-3.5 select-none">
                      <input 
                        type="checkbox" 
                        className="w-5 h-5 rounded-lg text-brand-600 focus:ring-brand-500 border-stone-300 cursor-pointer" 
                      />
                      <span className="font-semibold text-stone-800 text-sm group-hover:text-brand-900 transition-colors">
                        {ing.name}
                      </span>
                    </div>
                    <span className="font-black text-brand-700 bg-brand-50 border border-brand-200 px-3 py-1 rounded-xl text-xs sm:text-sm flex-shrink-0 ml-2">
                      {scaledQty > 0 ? scaledQty : ''} {ing.unit}
                    </span>
                  </label>
                );
              })}
            </div>
          </section>

          {/* Cooking Steps Section */}
          <section className="mb-10">
            <h2 className="text-xl sm:text-2xl font-black text-stone-900 mb-4">Langkah-Langkah Pembuatan</h2>
            <div className="space-y-4">
              {stepsList.map((step, idx) => (
                <div key={idx} className="flex items-start gap-4 bg-stone-50 p-5 rounded-3xl border border-stone-200">
                  <span className="w-9 h-9 rounded-2xl bg-brand-500 text-white text-sm font-black flex items-center justify-center flex-shrink-0 mt-0.5 shadow-md shadow-brand-500/20">
                    {idx + 1}
                  </span>
                  <p className="text-stone-800 leading-relaxed font-medium text-sm sm:text-base pt-1">
                    {step}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Chef's Tips */}
          {recipe.tips && (
            <div className="bg-amber-50 border border-amber-200 rounded-3xl p-6 flex gap-4 items-start">
              <span className="p-3 rounded-2xl bg-amber-100 text-amber-700 flex-shrink-0">
                <Lightbulb className="w-6 h-6" />
              </span>
              <div>
                <h4 className="font-black text-stone-900 text-sm sm:text-base mb-1">Tips Rahasia dari Koki:</h4>
                <p className="text-sm text-stone-600 leading-relaxed font-medium">
                  {recipe.tips}
                </p>
              </div>
            </div>
          )}
        </div>
      </article>
    </div>
  );
};
