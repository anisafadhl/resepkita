import React, { useState } from 'react';
import { ArrowLeft, ChefHat, Upload, X } from 'lucide-react';
import { useRecipes } from '../context/RecipeContext';
import { Recipe } from '../types/recipe';

interface RecipeFormPageProps {
  initialRecipe?: Recipe | null;
  onBack: () => void;
  onSuccess: () => void;
}

export const RecipeFormPage: React.FC<RecipeFormPageProps> = ({
  initialRecipe,
  onBack,
  onSuccess,
}) => {
  const { createRecipe, updateRecipe, currentUser, showToast } = useRecipes();
  const isEditing = Boolean(initialRecipe);

  const [title, setTitle] = useState(initialRecipe?.title || '');
  const [tagsInput, setTagsInput] = useState(initialRecipe?.tags ? initialRecipe.tags.join(', ') : '');
  const [time, setTime] = useState(String(initialRecipe?.time || 20));
  const [desc, setDesc] = useState(initialRecipe?.desc || '');
  
  const initialIngredients = initialRecipe?.ingredients
    ? initialRecipe.ingredients.map(ing => `${ing.qty > 0 ? ing.qty + ' ' : ''}${ing.unit} ${ing.name}`.trim()).join('\n')
    : '';
  const [ingredientsInput, setIngredientsInput] = useState(initialIngredients);
  
  const initialSteps = initialRecipe?.steps ? initialRecipe.steps.join('\n') : '';
  const [stepsInput, setStepsInput] = useState(initialSteps);
  
  const [imageBase64, setImageBase64] = useState(initialRecipe?.image || '');
  const [imageFileName, setImageFileName] = useState('');
  const [tips, setTips] = useState(initialRecipe?.tips || '');
  const [submitting, setSubmitting] = useState(false);

  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

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

  const handleRemoveImage = () => {
    setImageBase64('');
    setImageFileName('');
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

    if (isEditing && initialRecipe) {
      await updateRecipe(initialRecipe.id, {
        title: title.trim(),
        tags: parsedTags,
        time: duration,
        difficulty: duration > 30 ? 'Sedang' : 'Mudah',
        image: imageBase64 || initialRecipe.image,
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
        author: currentUser ? currentUser.name : 'Pengguna Resep Kita',
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
    onSuccess();
  };

  return (
    <div className="max-w-[1600px] w-full mx-auto px-4 sm:px-8 xl:px-12 pt-4 pb-20 animate-in fade-in duration-200">
      {/* Top Bar Navigation */}
      <div className="flex items-center justify-between py-3 mb-6">
        <button 
          onClick={onBack}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white border border-stone-200 text-stone-700 hover:bg-stone-50 text-sm font-bold shadow-sm transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-brand-600" />
          <span>Kembali</span>
        </button>

        <span className="text-sm font-bold text-stone-500">
          Penulis: <b className="text-stone-900">{currentUser?.name || initialRecipe?.author || 'Tamu'}</b>
        </span>
      </div>

      <div className="bg-white rounded-3xl border border-stone-200 shadow-sm p-6 sm:p-12">
        <div className="mb-10 max-w-2xl">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-brand-100 text-brand-600">
              <ChefHat className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-stone-900">
                {isEditing ? 'Perbarui Resep Masakan' : 'Tulis & Terbitkan Resep Baru'}
              </h1>
              <p className="text-sm text-stone-500 mt-1">
                {isEditing 
                  ? 'Ubah informasi bahan atau langkah memasak agar resepmu semakin sempurna.'
                  : 'Karyamu akan langsung tersimpan ke Supabase Cloud dan dinikmati ribuan pengunjung.'}
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Baris 1: Judul Resep & Upload Foto Masakan */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            <div>
              <label className="block text-sm font-black text-stone-800 mb-2">
                Judul Resep Masakan *
              </label>
              <input 
                type="text" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required 
                placeholder="Contoh: Sayur Asem Segar Jakarta / Kue Cubit Lumer" 
                className="w-full text-base border border-stone-300 rounded-2xl px-5 py-3.5 focus:ring-2 focus:ring-brand-500 focus:outline-none bg-stone-50 focus:bg-white transition-all"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                <div>
                  <label className="block text-sm font-black text-stone-800 mb-2">
                    Kategori / Tag Pencarian
                  </label>
                  <input 
                    type="text" 
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    placeholder="Contoh: manis, dessert, kue" 
                    className="w-full text-sm border border-stone-300 rounded-2xl px-4 py-3.5 focus:ring-2 focus:ring-brand-500 focus:outline-none bg-stone-50 focus:bg-white transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-black text-stone-800 mb-2">
                    Durasi Masak (Menit) *
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
            </div>

            {/* Upload Foto Komponen */}
            <div>
              <label className="block text-sm font-black text-stone-800 mb-2">
                Upload Foto Masakan
              </label>
              
              {imageBase64 ? (
                <div className="relative rounded-2xl overflow-hidden border border-stone-200 h-52 bg-stone-100 group">
                  <img 
                    src={imageBase64} 
                    alt="Preview Masakan" 
                    className="w-full h-full object-cover" 
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
                    >
                      <X className="w-4 h-4" />
                      <span>Ganti / Hapus Foto</span>
                    </button>
                  </div>
                  {imageFileName && (
                    <div className="absolute bottom-2 left-2 right-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl text-white text-xs truncate">
                      {imageFileName}
                    </div>
                  )}
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center border-2 border-dashed border-stone-300 hover:border-brand-500 rounded-2xl h-52 bg-stone-50 hover:bg-brand-50/20 cursor-pointer transition-all p-6 text-center group">
                  <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-stone-400 group-hover:text-brand-500 mb-3 border border-stone-200 transition-colors">
                    <Upload className="w-6 h-6" />
                  </div>
                  <span className="text-sm font-bold text-stone-800 group-hover:text-brand-600">
                    Pilih atau tarik foto masakan ke sini
                  </span>
                  <span className="text-xs text-stone-400 mt-1">
                    Mendukung JPG, PNG, atau WebP (Maks. 5 MB)
                  </span>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageFileChange}
                    className="hidden" 
                  />
                </label>
              )}
            </div>
          </div>

          {/* Baris 2: Cerita Singkat Resep */}
          <div>
            <label className="block text-sm font-black text-stone-800 mb-2">
              Cerita Singkat Resep
            </label>
            <textarea 
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              rows={2} 
              placeholder="Ceritakan kelezatan dan keunikan resep ini untuk keluarga..." 
              className="w-full text-sm border border-stone-300 rounded-2xl px-5 py-3 focus:ring-2 focus:ring-brand-500 focus:outline-none bg-stone-50 focus:bg-white transition-all"
            />
          </div>

          {/* Baris 3: Bahan-bahan & Langkah-langkah */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <label className="block text-sm font-black text-stone-800 mb-2">
                Daftar Bahan-Bahan * (Pisahkan per baris)
              </label>
              <textarea 
                value={ingredientsInput}
                onChange={(e) => setIngredientsInput(e.target.value)}
                rows={6} 
                required 
                placeholder="500 gram Daging ayam potong&#10;3 siung Bawang putih cincang&#10;4 sdm Kecap manis gurih..." 
                className="w-full text-sm border border-stone-300 rounded-2xl px-5 py-3.5 focus:ring-2 focus:ring-brand-500 focus:outline-none bg-stone-50 focus:bg-white transition-all font-mono"
              />
            </div>
            <div>
              <label className="block text-sm font-black text-stone-800 mb-2">
                Urutan Langkah Memasak * (Pisahkan per baris)
              </label>
              <textarea 
                value={stepsInput}
                onChange={(e) => setStepsInput(e.target.value)}
                rows={6} 
                required 
                placeholder="1. Tumis bawang hingga harum dan matang&#10;2. Masukkan potongan daging, aduk hingga berubah warna&#10;3. Tuangkan bumbu dan air lalu ungkep..." 
                className="w-full text-sm border border-stone-300 rounded-2xl px-5 py-3.5 focus:ring-2 focus:ring-brand-500 focus:outline-none bg-stone-50 focus:bg-white transition-all font-mono"
              />
            </div>
          </div>

          {/* Baris 4: Tips Rahasia */}
          <div>
            <label className="block text-sm font-black text-stone-800 mb-2">
              Tips Rahasia Sukses dari Dapur (Opsional)
            </label>
            <input 
              type="text" 
              value={tips}
              onChange={(e) => setTips(e.target.value)}
              placeholder="Contoh: Gunakan api kecil saat menumis agar bumbu meresap sempurna" 
              className="w-full text-sm border border-stone-300 rounded-2xl px-5 py-3.5 focus:ring-2 focus:ring-brand-500 focus:outline-none bg-stone-50 focus:bg-white transition-all"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-6 border-t border-stone-200 flex justify-end gap-4">
            <button 
              type="button" 
              onClick={onBack} 
              className="px-8 py-3.5 rounded-2xl border border-stone-200 text-stone-600 text-sm font-bold hover:bg-stone-50 cursor-pointer transition-colors"
            >
              Batal
            </button>
            <button 
              type="submit" 
              disabled={submitting}
              className="px-10 py-3.5 rounded-2xl bg-brand-500 hover:bg-brand-600 active:scale-95 text-white text-sm font-black shadow-lg shadow-brand-500/25 transition-all cursor-pointer disabled:opacity-50"
            >
              {submitting ? 'Menyimpan...' : (isEditing ? 'Simpan Perubahan' : 'Simpan & Terbitkan Resep')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
