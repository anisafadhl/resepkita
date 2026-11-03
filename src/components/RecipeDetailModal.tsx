import React, { useState } from 'react';
import { X, Bookmark, Volume2, Sparkles, Clock, Smile, Star, Minus, Plus, Lightbulb } from 'lucide-react';
import { Recipe } from '../types/recipe';
import { useRecipes } from '../context/RecipeContext';

interface RecipeDetailModalProps {
  recipe: Recipe | null;
  isOpen: boolean;
  onClose: () => void;
  onStartCookingMode: (recipe: Recipe) => void;
}

export const RecipeDetailModal: React.FC<RecipeDetailModalProps> = ({
  recipe,
  isOpen,
  onClose,
  onStartCookingMode,
}) => {
  const { bookmarks, toggleBookmark, showToast, trackUserInterest } = useRecipes();
  const [portion, setPortion] = useState<number>(2);

  React.useEffect(() => {
    if (recipe) {
      setPortion(recipe.portionBase || recipe.portion_base || 2);
      if (recipe.tags) {
        recipe.tags.forEach(t => trackUserInterest(t));
      }
    }
  }, [recipe]);

  if (!isOpen || !recipe) return null;

  const isFav = bookmarks.includes(recipe.id);
  const basePortion = recipe.portionBase || recipe.portion_base || 2;
  const multiplier = portion / basePortion;

  const handleSpeakSummary = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const mainIngredients = recipe.ingredients.slice(0, 3).map(i => i.name).join(', ');
      const summary = `Resep ${recipe.title}. Waktu masak sekitar ${recipe.time} menit. Tingkat kesulitan ${recipe.difficulty}. Bahan utama adalah ${mainIngredients}.`;
      const utterance = new SpeechSynthesisUtterance(summary);
      utterance.lang = 'id-ID';
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
      showToast('🔊 Membaca ringkasan resep...');
    } else {
      showToast('Fitur suara tidak didukung browser ini.', true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-sm overflow-y-auto flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden relative my-6 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header Image & Floating Buttons */}
        <div className="relative h-64 sm:h-80 w-full bg-stone-100">
          <img 
            src={recipe.image} 
            alt={recipe.title} 
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = 'https://placehold.co/800x600/ea580c/ffffff?text=Resep+Lezat';
            }}
          />
          <button 
            onClick={onClose} 
            className="absolute top-4 right-4 bg-black/60 hover:bg-black/80 text-white w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-lg cursor-pointer" 
            title="Tutup"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
            <span className="px-3.5 py-1.5 rounded-xl text-xs font-black uppercase bg-brand-500 text-white shadow-md">
              {recipe.tags && recipe.tags[0] ? `#${recipe.tags[0]}` : 'Resep'}
            </span>
            <span className="px-3 py-1 rounded-xl text-xs font-bold bg-white/90 backdrop-blur-md text-stone-800 shadow">
              {recipe.time} Menit • {recipe.difficulty}
            </span>
          </div>
        </div>

        <div className="p-6 sm:p-8">
          {/* Title & Bookmark Button */}
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-stone-900 leading-tight mb-2">
                {recipe.title}
              </h2>
              <div className="flex items-center gap-2 text-xs sm:text-sm text-stone-500">
                <span>Resep oleh: <b className="text-stone-800">{recipe.author}</b></span>
              </div>
            </div>
            <button 
              onClick={() => toggleBookmark(recipe.id)} 
              className={`p-3 rounded-2xl border border-stone-200 hover:border-brand-500 hover:bg-brand-50 transition-all cursor-pointer ${
                isFav ? 'bg-brand-50 border-brand-300' : ''
              }`}
              title={isFav ? 'Hapus Simpanan' : 'Simpan Resep'}
            >
              <Bookmark className={`w-6 h-6 ${isFav ? 'fill-brand-500 text-brand-500' : 'text-stone-500'}`} />
            </button>
          </div>

          <p className="text-sm sm:text-base text-stone-600 mb-6 leading-relaxed">
            {recipe.desc}
          </p>

          {/* Key Stats Bar */}
          <div className="grid grid-cols-3 gap-3 bg-stone-50 p-4 rounded-2xl mb-8 border border-stone-200 text-center">
            <div className="flex flex-col items-center">
              <span className="text-xs text-stone-400 font-bold mb-1 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> Waktu
              </span>
              <span className="font-bold text-stone-800 text-sm sm:text-base">{recipe.time} Menit</span>
            </div>
            <div className="flex flex-col items-center border-x border-stone-200">
              <span className="text-xs text-stone-400 font-bold mb-1 flex items-center gap-1">
                <Smile className="w-3.5 h-3.5" /> Kesulitan
              </span>
              <span className="font-bold text-stone-800 text-sm sm:text-base">{recipe.difficulty}</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-xs text-stone-400 font-bold mb-1 flex items-center gap-1">
                <Star className="w-3.5 h-3.5 text-amber-500" /> Penilaian
              </span>
              <span className="font-bold text-stone-800 text-sm sm:text-base">
                {recipe.rating} ({recipe.reviewsCount || recipe.reviews_count || 1})
              </span>
            </div>
          </div>

          {/* Action Row: Guided Cooking Mode & Audio Listen */}
          <div className="flex flex-wrap gap-3 mb-8">
            <button 
              onClick={() => onStartCookingMode(recipe)} 
              className="flex-1 min-w-[200px] flex items-center justify-center gap-2.5 bg-brand-500 hover:bg-brand-600 text-white font-bold py-3.5 px-6 rounded-2xl shadow-md shadow-brand-500/30 transition-all cursor-pointer active:scale-95 text-sm sm:text-base"
            >
              <Sparkles className="w-5 h-5" />
              <span>Mulai Masak Terpandu</span>
            </button>
            <button 
              onClick={handleSpeakSummary} 
              className="flex items-center justify-center gap-2 bg-stone-100 hover:bg-brand-50 text-stone-700 hover:text-brand-600 font-bold py-3.5 px-5 rounded-2xl border border-stone-200 transition-all cursor-pointer text-sm"
              title="Dengarkan ringkasan audio"
            >
              <Volume2 className="w-5 h-5 text-brand-500" />
              <span>Dengarkan</span>
            </button>
          </div>

          {/* INGREDIENTS SECTION WITH PORTION CALCULATOR */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-black text-lg text-stone-900">Bahan-Bahan Diperlukan</h3>
              {/* Dynamic Portion Calculator */}
              <div className="flex items-center gap-2 bg-stone-100 px-3 py-1.5 rounded-2xl border border-stone-200">
                <span className="text-xs font-bold text-stone-500 mr-1">Porsi:</span>
                <button 
                  onClick={() => setPortion(prev => Math.max(1, prev - 1))} 
                  className="w-7 h-7 rounded-xl bg-white shadow-sm flex items-center justify-center text-stone-600 hover:bg-stone-50 font-bold cursor-pointer"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="font-black text-brand-600 text-sm px-1.5">{portion}</span>
                <button 
                  onClick={() => setPortion(prev => Math.min(25, prev + 1))} 
                  className="w-7 h-7 rounded-xl bg-white shadow-sm flex items-center justify-center text-stone-600 hover:bg-stone-50 font-bold cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <ul className="space-y-2.5">
              {recipe.ingredients.map((ing, idx) => {
                const scaledQty = Math.round((ing.qty * multiplier) * 10) / 10;
                return (
                  <li key={idx} className="flex items-center justify-between p-3.5 rounded-2xl hover:bg-stone-50 border border-stone-200 bg-white transition-colors">
                    <label className="flex items-center gap-3.5 cursor-pointer select-none">
                      <input type="checkbox" className="w-5 h-5 rounded text-brand-600 focus:ring-brand-500 border-stone-300" />
                      <span className="font-semibold text-stone-800 text-sm">{ing.name}</span>
                    </label>
                    <span className="font-black text-brand-700 bg-brand-50 border border-brand-200 px-3 py-1 rounded-xl text-xs sm:text-sm">
                      {scaledQty > 0 ? scaledQty : ''} {ing.unit}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* COOKING STEPS LIST */}
          <div className="mb-8">
            <h3 className="font-black text-lg text-stone-900 mb-4">Langkah-Langkah Memasak</h3>
            <ol className="space-y-3">
              {recipe.steps.map((step, idx) => (
                <li key={idx} className="flex items-start gap-3.5 bg-stone-50 p-4 rounded-2xl border border-stone-200">
                  <span className="w-7 h-7 rounded-full bg-brand-500 text-white text-xs font-black flex items-center justify-center flex-shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="text-stone-800 leading-relaxed font-medium text-sm sm:text-base">
                    {step}
                  </span>
                </li>
              ))}
            </ol>
          </div>

          {/* CHEF'S TIP */}
          {recipe.tips && (
            <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-4.5 flex gap-3.5 items-start">
              <span className="p-2 rounded-xl bg-amber-100 text-amber-700 flex-shrink-0">
                <Lightbulb className="w-5 h-5" />
              </span>
              <div>
                <h4 className="font-bold text-stone-900 text-xs sm:text-sm mb-0.5">Tips Sukses dari Koki:</h4>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
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
