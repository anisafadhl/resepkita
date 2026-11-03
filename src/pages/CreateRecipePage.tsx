import React, { useState } from 'react';
import { ArrowLeft, Sparkles, ChefHat } from 'lucide-react';
import { useRecipes } from '../context/RecipeContext';
import { Recipe } from '../types/recipe';

interface CreateRecipePageProps {
  onBack: () => void;
  onSuccess: () => void;
}

export const CreateRecipePage: React.FC<CreateRecipePageProps> = ({ onBack, onSuccess }) => {
  const { createRecipe, currentUser, showToast } = useRecipes();

  const [title, setTitle] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [time, setTime] = useState('20');
  const [desc, setDesc] = useState('');
  const [ingredientsInput, setIngredientsInput] = useState('');
  const [stepsInput, setStepsInput] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [tips, setTips] = useState('');
  const [submitting, setSubmitting] = useState(false);

  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !ingredientsInput.trim() || !stepsInput.trim()) {
      showToast('Lengkapi isian resep yang berbintang (*)', true);
      return;
    }

    setSubmitting(true);

    const parsedIngredients = ingredientsInput
      .split(/[\n,]+/)
      .map(item => {
        const clean = item.trim();
        return { name: clean, qty: 1, unit: 'secukupnya' };
      })
      .filter(i => i.name.length > 0);

    const parsedSteps = stepsInput
      .split('\n')
      .map(s => s.replace(/^\d+[\.\)]\s*/, '').trim())
      .filter(s => s.length > 0);

    const parsedTags = tagsInput
      ? tagsInput.toLowerCase().split(/[\s,]+/).filter(t => t.length > 1)
      : ['rumahan'];

    const duration = parseInt(time) || 20;

    const newRecipePayload: Omit<Recipe, 'id' | 'rating' | 'reviewsCount'> = {
      title: title.trim(),
      tags: parsedTags,
      time: duration,
      difficulty: duration > 30 ? 'Sedang' : 'Mudah',
      author: currentUser ? currentUser.name : 'Koki Resep Kita',
      image: imageUrl.trim() || 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=700&auto=format&fit=crop&q=80',
      desc: desc.trim() || 'Resep rumahan lezat buatan komunitas Resep Kita.',
      portionBase: 2,
      ingredients: parsedIngredients,
      steps: parsedSteps,
      tips: tips.trim() || 'Masak dengan hati senang agar rasa makanan semakin lezat!',
    };

    await createRecipe(newRecipePayload);
    setSubmitting(false);
    onSuccess();
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-2 pb-20 animate-in fade-in duration-200">
      {/* Top Bar Navigation */}
      <div className="flex items-center justify-between py-4 mb-2">
        <button 
          onClick={onBack}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white border border-stone-200 text-stone-700 hover:bg-stone-50 text-sm font-bold shadow-sm transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-brand-600" />
          <span>Kembali</span>
        </button>

        <span className="text-xs sm:text-sm font-bold text-stone-500">
          Koki: <b className="text-stone-800">{currentUser?.name || 'Tamu'}</b>
        </span>
      </div>

      <div className="bg-white rounded-3xl border border-stone-200 shadow-sm p-6 sm:p-10">
        <div className="mb-8">
          <div className="flex items-center gap-2.5">
            <span className="p-2.5 rounded-2xl bg-brand-100 text-brand-600">
              <ChefHat className="w-6 h-6" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-stone-900">
              Tulis & Bagikan Resep Baru
            </h1>
          </div>
          <p className="text-sm text-stone-500 mt-1.5 ml-1">
            Karyamu akan langsung tersimpan ke cloud Supabase dan dibaca oleh seluruh pecinta masak.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs sm:text-sm font-black text-stone-800 mb-2">
              Judul Resep Masakan *
            </label>
            <input 
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required 
              placeholder="Contoh: Sayur Asem Segar Jakarta / Kue Cubit Lumer" 
              className="w-full text-base border border-stone-300 rounded-2xl px-4 py-3.5 focus:ring-2 focus:ring-brand-500 focus:outline-none bg-stone-50 focus:bg-white transition-all"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs sm:text-sm font-black text-stone-800 mb-2">
                Kategori / Tag (pisahkan koma/spasi)
              </label>
              <input 
                type="text" 
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="Contoh: manis, kue, dessert, praktis" 
                className="w-full text-sm border border-stone-300 rounded-2xl px-4 py-3.5 focus:ring-2 focus:ring-brand-500 focus:outline-none bg-stone-50 focus:bg-white transition-all"
              />
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-black text-stone-800 mb-2">
                Durasi Memasak (Menit) *
              </label>
              <input 
                type="number" 
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required 
                min="5" 
                placeholder="25" 
                className="w-full text-sm border border-stone-300 rounded-2xl px-4 py-3.5 focus:ring-2 focus:ring-brand-500 focus:outline-none bg-stone-50 focus:bg-white transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-black text-stone-800 mb-2">
              URL Foto Masakan (Opsional)
            </label>
            <input 
              type="url" 
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://images.unsplash.com/photo-..." 
              className="w-full text-sm border border-stone-300 rounded-2xl px-4 py-3.5 focus:ring-2 focus:ring-brand-500 focus:outline-none bg-stone-50 focus:bg-white transition-all"
            />
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-black text-stone-800 mb-2">
              Cerita Singkat Resep
            </label>
            <textarea 
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              rows={3} 
              placeholder="Ceritakan rahasia kenikmatan atau kisah di balik hidangan ini..." 
              className="w-full text-sm border border-stone-300 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-brand-500 focus:outline-none bg-stone-50 focus:bg-white transition-all"
            />
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-black text-stone-800 mb-2">
              Daftar Bahan-Bahan * (Tulis per baris atau pisahkan dengan koma)
            </label>
            <textarea 
              value={ingredientsInput}
              onChange={(e) => setIngredientsInput(e.target.value)}
              rows={4} 
              required 
              placeholder="500 gram Daging ayam potong&#10;3 siung Bawang putih cincang&#10;4 sdm Kecap manis gurih..." 
              className="w-full text-sm border border-stone-300 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-brand-500 focus:outline-none bg-stone-50 focus:bg-white transition-all"
            />
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-black text-stone-800 mb-2">
              Urutan Langkah Memasak * (Tulis per baris)
            </label>
            <textarea 
              value={stepsInput}
              onChange={(e) => setStepsInput(e.target.value)}
              rows={5} 
              required 
              placeholder="1. Tumis bawang hingga harum dan matang&#10;2. Masukkan potongan daging, aduk hingga berubah warna&#10;3. Tuangkan bumbu dan air lalu ungkep..." 
              className="w-full text-sm border border-stone-300 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-brand-500 focus:outline-none bg-stone-50 focus:bg-white transition-all"
            />
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-black text-stone-800 mb-2">
              Tips Rahasia dari Koki (Opsional)
            </label>
            <input 
              type="text" 
              value={tips}
              onChange={(e) => setTips(e.target.value)}
              placeholder="Contoh: Ungkep dengan api kecil agar bumbu meresap ke serat daging paling dalam" 
              className="w-full text-sm border border-stone-300 rounded-2xl px-4 py-3.5 focus:ring-2 focus:ring-brand-500 focus:outline-none bg-stone-50 focus:bg-white transition-all"
            />
          </div>

          <div className="pt-6 border-t border-stone-200 flex justify-end gap-3">
            <button 
              type="button" 
              onClick={onBack} 
              className="px-6 py-3.5 rounded-2xl border border-stone-200 text-stone-600 text-sm font-bold hover:bg-stone-50 cursor-pointer transition-colors"
            >
              Batal
            </button>
            <button 
              type="submit" 
              disabled={submitting}
              className="px-8 py-3.5 rounded-2xl bg-brand-500 hover:bg-brand-600 active:scale-95 text-white text-sm font-bold shadow-lg shadow-brand-500/25 transition-all cursor-pointer disabled:opacity-50"
            >
              {submitting ? 'Menerbitkan...' : 'Simpan & Terbitkan Resep'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
