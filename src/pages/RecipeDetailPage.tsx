import React, { useState } from 'react';
import { ArrowLeft, Bookmark, Sparkles, Clock, Smile, Star, Minus, Plus, Lightbulb, ChefHat } from 'lucide-react';
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
    <div className="max-w-[1600px] w-full mx-auto px-4 sm:px-8 xl:px-12 pt-4 pb-20 animate-in fade-in duration-200">
      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between py-3 mb-4">
        <button 
          onClick={onBack}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white border border-stone-200 text-stone-700 hover:bg-stone-50 text-sm font-bold shadow-sm transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-brand-600" />
          <span>Kembali ke Jelajah Resep</span>
        </button>

        <button 
          onClick={() => toggleBookmark(recipe.id)} 
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl border transition-all cursor-pointer text-sm font-bold shadow-sm ${
            isFav 
              ? 'bg-brand-50 border-brand-300 text-brand-700' 
              : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
          }`}
          title={isFav ? 'Hapus Simpanan' : 'Simpan Resep'}
        >
          <Bookmark className={`w-4 h-4 ${isFav ? 'fill-brand-500 text-brand-500' : 'text-stone-500'}`} />
          <span>{isFav ? 'Tersimpan di Favorit' : 'Simpan Resep'}</span>
        </button>
      </div>

      {/* Main Recipe Grid Layout (2 Kolom Lebar di Desktop) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Kolom Kiri: Hero Card, Ringkasan, Bahan & Porsi (Desktop: 5 dari 12 Kolom) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden">
            {/* Hero Image */}
            <div className="relative h-72 sm:h-84 w-full bg-stone-100">
              <img 
                src={recipe.image || 'https://placehold.co/1000x600/ea580c/ffffff?text=Resep+Lezat'} 
                alt={recipe.title} 
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = 'https://placehold.co/1000x600/ea580c/ffffff?text=Resep+Lezat';
                }}
              />
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                <span className="px-3.5 py-1.5 rounded-xl text-xs font-black uppercase bg-brand-500 text-white shadow-lg">
                  {recipe.tags && recipe.tags[0] ? `#${recipe.tags[0]}` : 'Resep'}
                </span>
                <span className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-white/95 backdrop-blur-md text-stone-800 shadow-lg">
                  {recipe.time} Menit • {recipe.difficulty}
                </span>
              </div>
            </div>

            <div className="p-6">
              <h1 className="text-2xl sm:text-3xl font-black text-stone-900 leading-tight mb-2">
                {recipe.title}
              </h1>
              <div className="flex items-center gap-2 text-xs sm:text-sm text-stone-500 font-medium mb-4">
                <span>Koki: <b className="text-stone-800">{recipe.author}</b></span>
              </div>
              <p className="text-sm text-stone-600 leading-relaxed">
                {recipe.desc}
              </p>

              {/* Stats Bar */}
              <div className="grid grid-cols-3 gap-2 bg-stone-50 p-4 rounded-2xl mt-6 border border-stone-200 text-center">
                <div>
                  <span className="text-[11px] text-stone-400 font-bold block mb-1 flex items-center justify-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-brand-500" /> Waktu
                  </span>
                  <span className="font-extrabold text-stone-800 text-sm">{recipe.time} Mnt</span>
                </div>
                <div className="border-x border-stone-200">
                  <span className="text-[11px] text-stone-400 font-bold block mb-1 flex items-center justify-center gap-1">
                    <Smile className="w-3.5 h-3.5 text-brand-500" /> Kesulitan
                  </span>
                  <span className="font-extrabold text-stone-800 text-sm">{recipe.difficulty}</span>
                </div>
                <div>
                  <span className="text-[11px] text-stone-400 font-bold block mb-1 flex items-center justify-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> Rating
                  </span>
                  <span className="font-extrabold text-stone-800 text-sm">
                    {recipe.rating} ({recipe.reviewsCount || recipe.reviews_count || 1})
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Bahan-Bahan & Kalkulator Porsi Card */}
          <div className="bg-white rounded-3xl border border-stone-200 shadow-sm p-6 sm:p-7">
            <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
              <div>
                <h2 className="text-lg font-black text-stone-900">Bahan yang Dibutuhkan</h2>
                <span className="text-xs text-stone-400 font-medium">Beri centang saat bahan siap</span>
              </div>

              {/* Dynamic Portion Calculator */}
              <div className="flex items-center gap-2 bg-stone-100 px-3 py-1.5 rounded-2xl border border-stone-200 shadow-sm">
                <span className="text-xs font-bold text-stone-500">Porsi:</span>
                <button 
                  onClick={() => setPortion(prev => Math.max(1, prev - 1))} 
                  className="w-7 h-7 rounded-xl bg-white shadow-sm flex items-center justify-center text-stone-700 hover:bg-stone-50 font-black cursor-pointer"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="font-black text-brand-600 text-sm px-1.5">{portion}</span>
                <button 
                  onClick={() => setPortion(prev => Math.min(25, prev + 1))} 
                  className="w-7 h-7 rounded-xl bg-white shadow-sm flex items-center justify-center text-stone-700 hover:bg-stone-50 font-black cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="space-y-2.5">
              {ingredientsList.map((ing, idx) => {
                const scaledQty = Math.round((Number(ing.qty || 0) * multiplier) * 10) / 10;
                return (
                  <label 
                    key={idx} 
                    className="flex items-center justify-between p-3.5 rounded-2xl hover:bg-brand-50/50 border border-stone-200 bg-stone-50/50 transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-3 select-none">
                      <input 
                        type="checkbox" 
                        className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500 border-stone-300 cursor-pointer" 
                      />
                      <span className="font-semibold text-stone-800 text-xs sm:text-sm group-hover:text-brand-900 transition-colors">
                        {ing.name}
                      </span>
                    </div>
                    <span className="font-black text-brand-700 bg-white border border-brand-200 px-2.5 py-0.5 rounded-xl text-xs flex-shrink-0 ml-2">
                      {scaledQty > 0 ? scaledQty : ''} {ing.unit}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
        </div>

        {/* Kolom Kanan: CTA Banner Masak Terpandu, Langkah Memasak, Tips (Desktop: 7 dari 12 Kolom) */}
        <div className="lg:col-span-7 space-y-6">
          {/* CTA Banner: Guided Cooking Mode */}
          <div className="bg-gradient-to-r from-brand-500 via-brand-600 to-amber-500 rounded-3xl p-6 sm:p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl shadow-brand-500/20">
            <div>
              <h3 className="text-xl sm:text-2xl font-black">Siap Mulai Memasak Sekarang?</h3>
              <p className="text-brand-50 text-xs sm:text-sm mt-1 max-w-md">
                Gunakan panduan langkah demi langkah dengan layar penuh & timer dapur terintegrasi.
              </p>
            </div>
            <button 
              onClick={() => onStartCookingMode(recipe)} 
              className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-white text-brand-700 hover:bg-stone-50 font-black text-sm shadow-md transition-all cursor-pointer flex-shrink-0 active:scale-95"
            >
              Mulai Masak Terpandu
            </button>
          </div>

          {/* Langkah-Langkah Pembuatan Card */}
          <div className="bg-white rounded-3xl border border-stone-200 shadow-sm p-6 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-black text-stone-900 mb-6 flex items-center gap-2.5">
              <ChefHat className="w-6 h-6 text-brand-500" />
              <span>Urutan Langkah Pembuatan</span>
            </h2>
            <div className="space-y-4">
              {stepsList.map((step, idx) => (
                <div key={idx} className="flex items-start gap-4 bg-stone-50 p-5 rounded-3xl border border-stone-200">
                  <span className="w-10 h-10 rounded-2xl bg-brand-500 text-white text-sm font-black flex items-center justify-center flex-shrink-0 mt-0.5 shadow-md shadow-brand-500/20">
                    {idx + 1}
                  </span>
                  <p className="text-stone-800 leading-relaxed font-medium text-sm sm:text-base pt-1.5">
                    {step}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Chef's Tips Card */}
          {recipe.tips && (
            <div className="bg-amber-50 border border-amber-200 rounded-3xl p-6 sm:p-7 flex gap-4 items-start shadow-sm">
              <span className="p-3 rounded-2xl bg-amber-100 text-amber-700 flex-shrink-0">
                <Lightbulb className="w-6 h-6" />
              </span>
              <div>
                <h4 className="font-black text-stone-900 text-base mb-1">Tips Rahasia dari Koki:</h4>
                <p className="text-sm text-stone-700 leading-relaxed font-medium">
                  {recipe.tips}
                </p>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
