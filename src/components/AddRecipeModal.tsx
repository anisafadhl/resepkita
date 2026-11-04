import React, { useState } from 'react';
import { useRecipes } from '../context/RecipeContext';
import { Recipe } from '../types/recipe';
import { CATEGORIES } from '../data/categories';

interface AddRecipeModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipeToEdit?: Recipe | null;
}

export const AddRecipeModal: React.FC<AddRecipeModalProps> = ({
  isOpen,
  onClose,
  recipeToEdit,
}) => {
  const { createRecipe, updateRecipe, currentUser, showToast } = useRecipes();

  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [category, setCategory] = useState('makanan-berat');
  const [time, setTime] = useState(30);
  const [portion, setPortion] = useState(2);
  const [difficulty, setDifficulty] = useState<'Mudah' | 'Sedang' | 'Sulit'>('Mudah');
  const [tags, setTags] = useState('praktis, lezat');
  const [image, setImage] = useState('');
  const [ingredientsText, setIngredientsText] = useState('');
  const [stepsText, setStepsText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  React.useEffect(() => {
    if (recipeToEdit) {
      setTitle(recipeToEdit.title);
      setDesc(recipeToEdit.desc || '');
      setCategory(recipeToEdit.category || 'makanan-berat');
      setTime(recipeToEdit.time || 30);
      setPortion(recipeToEdit.portionBase || recipeToEdit.portion_base || 2);
      setDifficulty(recipeToEdit.difficulty || 'Mudah');
      setTags(Array.isArray(recipeToEdit.tags) ? recipeToEdit.tags.join(', ') : '');
      setImage(recipeToEdit.image || '');

      const lines = (recipeToEdit.ingredients || []).map((ing) => {
        if (typeof ing === 'string') return ing;
        return `${ing.qty} ${ing.unit} ${ing.name}`.trim();
      });
      setIngredientsText(lines.join('\n'));
      setStepsText((recipeToEdit.steps || []).join('\n'));
    } else {
      setTitle('');
      setDesc('');
      setCategory('makanan-berat');
      setTime(30);
      setPortion(2);
      setDifficulty('Mudah');
      setTags('praktis, lezat');
      setImage('');
      setIngredientsText('');
      setStepsText('');
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

    if (file.size > 2 * 1024 * 1024) {
      showToast('Ukuran gambar maksimal 2MB', true);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      showToast('Judul resep wajib diisi', true);
      return;
    }

    const ingArray = ingredientsText
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean)
      .map((line) => {
        const parts = line.split(' ');
        const num = parseFloat(parts[0]);
        if (!isNaN(num) && parts.length > 2) {
          return {
            qty: num,
            unit: parts[1],
            name: parts.slice(2).join(' '),
          };
        }
        return { qty: 1, unit: 'secukupnya', name: line };
      });

    const stepArray = stepsText
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean);

    const tagArray = tags
      .split(',')
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean);

    setIsSubmitting(true);

    try {
      if (recipeToEdit) {
        await updateRecipe(recipeToEdit.id, {
          title: title.trim(),
          desc: desc.trim(),
          category,
          time: Number(time),
          portionBase: Number(portion),
          difficulty,
          tags: tagArray,
          image: image || recipeToEdit.image,
          ingredients: ingArray,
          steps: stepArray,
        });
        showToast('Resep berhasil diperbarui! 🎉');
      } else {
        await createRecipe({
          title: title.trim(),
          desc: desc.trim(),
          category,
          time: Number(time),
          portionBase: Number(portion),
          difficulty,
          tags: tagArray,
          image:
            image ||
            'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=60',
          ingredients: ingArray,
          steps: stepArray,
          author: currentUser?.name || 'Saya Sendiri',
        });
        showToast('Resep baru berhasil dipublikasikan! 🎉');
      }
      onClose();
    } catch {
      showToast('Terjadi kesalahan saat menyimpan resep.', true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal" role="dialog" aria-modal="true">
      <div className="modal-backdrop" onClick={onClose} />
      <div className="modal-card modal-card-lg">
        <button
          className="modal-close"
          type="button"
          onClick={onClose}
          aria-label="Tutup"
        >
          ×
        </button>

        <div className="modal-head">
          <span className="modal-emoji">🍳</span>
          <div>
            <h2>{recipeToEdit ? 'Edit Resep' : 'Tulis Resep Baru'}</h2>
            <p className="modal-sub">
              Bagikan hidangan lezatmu dengan takaran dan langkah memasak yang jelas.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ marginTop: '18px' }}>
          <label className="field">
            Judul Resep *
            <input
              type="text"
              placeholder="Contoh: Nasi Goreng Spesial"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </label>

          <label className="field">
            Deskripsi Singkat
            <textarea
              rows={2}
              placeholder="Ceritakan sedikit tentang hidangan ini…"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
            />
          </label>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <label className="field">
              Kategori
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {CATEGORIES.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.emoji} {c.nama}
                  </option>
                ))}
              </select>
            </label>

            <label className="field">
              Tingkat Kesulitan
              <select
                value={difficulty}
                onChange={(e) =>
                  setDifficulty(e.target.value as 'Mudah' | 'Sedang' | 'Sulit')
                }
              >
                <option value="Mudah">Mudah</option>
                <option value="Sedang">Sedang</option>
                <option value="Sulit">Sulit</option>
              </select>
            </label>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <label className="field">
              Waktu Memasak (menit)
              <input
                type="number"
                min={1}
                value={time}
                onChange={(e) => setTime(Number(e.target.value))}
              />
            </label>

            <label className="field">
              Porsi (orang)
              <input
                type="number"
                min={1}
                value={portion}
                onChange={(e) => setPortion(Number(e.target.value))}
              />
            </label>
          </div>

          <label className="field">
            Unggah Foto Masakan
            <input
              type="file"
              accept="image/*"
              onChange={handleImageFileChange}
              style={{ padding: '8px' }}
            />
          </label>

          {image && (
            <div style={{ marginBottom: '12px', borderRadius: '12px', overflow: 'hidden', height: '140px' }}>
              <img
                src={image}
                alt="Preview"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
          )}

          <label className="field">
            Bahan-Bahan (1 bahan per baris, contoh: 2 butir telur)
            <textarea
              rows={4}
              placeholder="2 porsi nasi putih dingin&#10;2 butir telur&#10;3 siung bawang merah, iris tipis"
              value={ingredientsText}
              onChange={(e) => setIngredientsText(e.target.value)}
            />
          </label>

          <label className="field">
            Langkah Memasak (1 langkah per baris)
            <textarea
              rows={4}
              placeholder="Tumis bawang merah sampai harum.&#10;Masukkan telur dan orak-arik.&#10;Masukkan nasi lalu bumbui rata."
              value={stepsText}
              onChange={(e) => setStepsText(e.target.value)}
            />
          </label>

          <label className="field">
            Tag (pisahkan koma)
            <input
              type="text"
              placeholder="sarapan, praktis, pedas"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
          </label>

          <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
            <button
              type="button"
              className="btn btn-ghost"
              style={{ flex: 1, justifyContent: 'center' }}
              onClick={onClose}
            >
              Batal
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              style={{ flex: 2, justifyContent: 'center' }}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Menyimpan…' : recipeToEdit ? 'Simpan Perubahan' : 'Terbitkan Resep'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
