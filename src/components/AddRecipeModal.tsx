import React, { useState } from 'react';
import { X, Sparkles, Upload } from 'lucide-react';
import { useRecipes } from '../context/RecipeContext';
import { Recipe } from '../types/recipe';

interface AddRecipeModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipeToEdit?: Recipe | null;
}

export const AddRecipeModal: React.FC<AddRecipeModalProps> = ({ isOpen, onClose, recipeToEdit }) => {
  const { createRecipe, updateRecipe, currentUser, showToast } = useRecipes();
  const isEditing = Boolean(recipeToEdit);

  const [title, setTitle] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [time, setTime] = useState('20');
  const [desc, setDesc] = useState('');
  const [ingredientsInput, setIngredientsInput] = useState('');
  const [stepsInput, setStepsInput] = useState('');
  const [imageBase64, setImageBase64] = useState('');
  const [imageFileName, setImageFileName] = useState('');
  const [tips, setTips] = useState('');
  const [submitting, setSubmitting] = useState(false);

  React.useEffect(() => {
    if (recipeToEdit) {
      setTitle(recipeToEdit.title || '');
      setTagsInput(recipeToEdit.tags ? recipeToEdit.tags.join(', ') : '');
      setTime(String(recipeToEdit.time || 20));
      setDesc(recipeToEdit.desc || '');
      const ings = recipeToEdit.ingredients
        ? recipeToEdit.ingredients.map(ing => `${ing.qty > 0 ? ing.qty + ' ' : ''}${ing.unit} ${ing.name}`.trim()).join('\n')
        : '';
      setIngredientsInput(ings);
      setStepsInput(recipeToEdit.steps ? recipeToEdit.steps.join('\n') : '');
      setImageBase64(recipeToEdit.image || '');
      setTips(recipeToEdit.tips || '');
    } else {
      setTitle('');
      setTagsInput('');
      setTime('20');
      setDesc('');
      setIngredientsInput('');
      setStepsInput('');
      setImageBase64('');
      setImageFileName('');
      setTips('');
    }
  }, [recipeToEdit, isOpen]);

  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Harap pilih file gambar (JPG, PNG, WebP)', true);
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showToast('Ukuran foto maksimal 5 MB', true);
      return;
    }

    setImageFileName(file.name);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImageBase64(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

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

    if (isEditing && recipeToEdit) {
      await updateRecipe(recipeToEdit.id, {
        title: title.trim(),
        tags: parsedTags,
        time: duration,
        difficulty: duration > 30 ? 'Sedang' : 'Mudah',
        image: imageBase64 || recipeToEdit.image,
        desc: desc.trim() || 'Resep rumahan lezat buatan komunitas Resep Kita.',
        ingredients: parsedIngredients,
        steps: parsedSteps,
        tips: tips.trim() || 'Masak dengan hati senang agar rasa makanan semakin lezat!',
      });
    } else {
      const newRecipePayload: Omit<Recipe, 'id' | 'rating' | 'reviewsCount'> = {
        title: title.trim(),
        tags: parsedTags,
        time: duration,
        difficulty: duration > 30 ? 'Sedang' : 'Mudah',
        author: currentUser ? currentUser.name : 'Koki Resep Kita',
        image: imageBase64 || 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=700&auto=format&fit=crop&q=80',
        desc: desc.trim() || 'Resep rumahan lezat buatan komunitas Resep Kita.',
        portionBase: 2,
        ingredients: parsedIngredients,
        steps: parsedSteps,
        tips: tips.trim() || 'Masak dengan hati senang agar rasa makanan semakin lezat!',
      };
      await createRecipe(newRecipePayload);
    }

    setSubmitting(false);
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-sm overflow-y-auto flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="bg-white w-full max-w-xl rounded-3xl shadow-2xl p-6 sm:p-8 relative my-8 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose} 
          className="absolute top-5 right-5 text-stone-400 hover:text-stone-600 cursor-pointer"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="mb-6">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-brand-100 text-brand-600">
              <Sparkles className="w-5 h-5" />
            </span>
            <h3 className="text-xl font-black text-stone-900">
              {isEditing ? 'Edit Resep Masakan' : 'Bagikan Resep Masakanmu'}
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Tulisanmu akan menginspirasi ribuan keluarga di rumah.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1.5">Judul Resep *</label>
            <input 
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required 
              placeholder="Contoh: Sayur Asem Segar Jakarta" 
              className="w-full text-sm border border-stone-300 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-brand-500 focus:outline-none bg-stone-50 focus:bg-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5">Kata Kunci / Tag Pencarian</label>
              <input 
                type="text" 
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="Contoh: sayur, asem, pedas, hemat" 
                className="w-full text-sm border border-stone-300 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-brand-500 focus:outline-none bg-stone-50 focus:bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5">Durasi Masak (Menit) *</label>
              <input 
                type="number" 
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required 
                min="5" 
                placeholder="20" 
                className="w-full text-sm border border-stone-300 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-brand-500 focus:outline-none bg-stone-50 focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1.5">Foto Masakan</label>
            {imageBase64 ? (
              <div className="relative rounded-2xl overflow-hidden border border-stone-200 h-40 bg-stone-100 group">
                <img src={imageBase64} alt="Preview" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => setImageBase64('')}
                  className="absolute top-2 right-2 px-3 py-1 rounded-xl bg-rose-600 text-white font-bold text-xs"
                >
                  Ganti
                </button>
              </div>
            ) : (
              <label className="flex items-center gap-3 border border-dashed border-stone-300 rounded-2xl p-4 bg-stone-50 hover:bg-stone-100 cursor-pointer">
                <Upload className="w-5 h-5 text-stone-400" />
                <span className="text-xs text-stone-600 font-semibold">Pilih atau unggah foto masakan</span>
                <input type="file" accept="image/*" onChange={handleImageFileChange} className="hidden" />
              </label>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1.5">Cerita Singkat Resep</label>
            <textarea 
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              rows={2} 
              placeholder="Ceritakan kenapa resep ini enak dan cocok untuk keluarga..." 
              className="w-full text-sm border border-stone-300 rounded-2xl px-4 py-2.5 focus:ring-2 focus:ring-brand-500 focus:outline-none bg-stone-50 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1.5">Bahan-Bahan (Pisahkan dengan koma atau baris baru) *</label>
            <textarea 
              value={ingredientsInput}
              onChange={(e) => setIngredientsInput(e.target.value)}
              rows={3} 
              required 
              placeholder="2 ikat Bayam segar, 1 tongkol Jagung manis, 3 siung Bawang merah..." 
              className="w-full text-sm border border-stone-300 rounded-2xl px-4 py-2.5 focus:ring-2 focus:ring-brand-500 focus:outline-none bg-stone-50 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1.5">Urutan Langkah Memasak (Pisahkan tiap langkah dengan baris baru) *</label>
            <textarea 
              value={stepsInput}
              onChange={(e) => setStepsInput(e.target.value)}
              rows={3} 
              required 
              placeholder="1. Rebus air hingga mendidih&#10;2. Masukkan jagung manis hingga empuk&#10;3. Masukkan sayur dan garam..." 
              className="w-full text-sm border border-stone-300 rounded-2xl px-4 py-2.5 focus:ring-2 focus:ring-brand-500 focus:outline-none bg-stone-50 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1.5">Tips Memasak dari Koki (Opsional)</label>
            <input 
              type="text" 
              value={tips}
              onChange={(e) => setTips(e.target.value)}
              placeholder="Contoh: Gunakan api kecil agar bumbu meresap sempurna" 
              className="w-full text-sm border border-stone-300 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-brand-500 focus:outline-none bg-stone-50 focus:bg-white"
            />
          </div>

          <div className="pt-3 border-t border-stone-200 flex justify-end gap-3">
            <button 
              type="button" 
              onClick={onClose} 
              className="px-5 py-3 rounded-2xl border border-stone-200 text-stone-600 text-xs sm:text-sm font-bold hover:bg-stone-50 cursor-pointer"
            >
              Batal
            </button>
            <button 
              type="submit" 
              disabled={submitting}
              className="px-6 py-3 rounded-2xl bg-brand-500 hover:bg-brand-600 active:scale-95 text-white text-xs sm:text-sm font-bold shadow-md shadow-brand-500/25 transition-all cursor-pointer disabled:opacity-50"
            >
              {submitting ? 'Menyimpan...' : (isEditing ? 'Simpan Perubahan' : 'Simpan & Terbitkan')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
