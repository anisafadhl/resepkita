import React, { useState } from 'react';
import { Recipe } from '../types/recipe';
import { useRecipes } from '../context/RecipeContext';
import { CATEGORIES } from '../data/categories';

interface RecipeDetailViewProps {
  recipe: Recipe;
  onBack: () => void;
  onSelectOtherRecipe: (r: Recipe) => void;
  onEditRecipe: (r: Recipe) => void;
  onDeleteRecipe: (r: Recipe) => void;
}

export const RecipeDetailView: React.FC<RecipeDetailViewProps> = ({
  recipe,
  onBack,
  onEditRecipe,
  onDeleteRecipe,
}) => {
  const { bookmarks, toggleBookmark, currentUser } = useRecipes();
  const [checkedIngredients, setCheckedIngredients] = useState<Record<number, boolean>>({});

  const kat = CATEGORIES.find((c) => c.slug === recipe.category) || {
    slug: 'makanan-berat',
    nama: 'Makanan Berat',
    emoji: '🍛',
    pola: 'dots',
    warna: ['#D64545', '#F08C4B'] as [string, string],
  };

  const isSaved = bookmarks.includes(recipe.id);
  const isAuthor =
    currentUser &&
    (recipe.author.toLowerCase() === currentUser.name.toLowerCase() ||
      recipe.author === 'Pengguna Resep Kita' ||
      recipe.author === 'Saya Sendiri');

  const portion = recipe.portionBase || recipe.portion_base || 2;

  const toggleCheck = (idx: number) => {
    setCheckedIngredients((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  const totalBahan = (recipe.ingredients || []).length;
  const checkedCount = Object.values(checkedIngredients).filter(Boolean).length;
  const progressPercent = totalBahan ? Math.round((checkedCount / totalBahan) * 100) : 0;

  const formatWaktu = (menit: number) => {
    if (menit < 60) return `${menit} menit`;
    const j = Math.floor(menit / 60);
    const m = menit % 60;
    return m ? `${j} jam ${m} menit` : `${j} jam`;
  };

  return (
    <main>
      {/* Breadcrumb Head with Back Button */}
      <section className="page-head" style={{ padding: '24px 0' }}>
        <div className="wrap">
          <ul className="breadcrumb" style={{ margin: 0 }}>
            <li>
              <button
                onClick={onBack}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontWeight: 700,
                  color: 'var(--brand)',
                }}
              >
                ← Kembali
              </button>
            </li>
            <li className="sep">›</li>
            <li>{kat.nama}</li>
            <li className="sep">›</li>
            <li>{recipe.title}</li>
          </ul>
        </div>
      </section>

      <section className="section" style={{ paddingTop: '34px' }}>
        <div className="wrap">
          {/* Banner Hero */}
          <div
            className={`detail-banner pola-${kat.pola}`}
            data-emoji={kat.emoji}
            style={{
              background: `linear-gradient(135deg, ${kat.warna[0]}, ${kat.warna[1]})`,
            }}
          >
            <div className="banner-inner">
              <span className="chip">{kat.nama}</span>
              <h1>{recipe.title}</h1>
              <p>{recipe.desc}</p>

              <div className="banner-meta">
                <div>
                  <span>Waktu</span>
                  {formatWaktu(recipe.time)}
                </div>
                <div>
                  <span>Porsi</span>
                  {portion} orang
                </div>
                <div>
                  <span>Tingkat</span>
                  {recipe.difficulty || 'Mudah'}
                </div>
                <div>
                  <span>Rating</span>★ {recipe.rating || 4.8}
                </div>
              </div>

              <div className="banner-actions">
                <button
                  className="btn btn-light"
                  type="button"
                  onClick={() => toggleBookmark(recipe.id)}
                >
                  🔖 <span>{isSaved ? '✓ Tersimpan' : 'Simpan resep'}</span>
                </button>
                <a className="btn btn-light" href="#langkah">
                  👩‍🍳 Mulai memasak
                </a>
                {isAuthor && (
                  <>
                    <button
                      className="btn btn-light"
                      type="button"
                      onClick={() => onEditRecipe(recipe)}
                    >
                      ✏️ Edit
                    </button>
                    <button
                      className="btn btn-light"
                      type="button"
                      onClick={() => onDeleteRecipe(recipe)}
                    >
                      🗑️ Hapus
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Layout Columns */}
          <div className="detail-layout">
            {/* Left Ingredients Panel */}
            <aside className="panel sticky">
              <div className="panel-head">
                <h2>🧺 Bahan-bahan</h2>
                <span className="bahan-progress">
                  {checkedCount}/{totalBahan} siap
                </span>
              </div>
              <div className="progress">
                <span style={{ width: `${progressPercent}%` }} />
              </div>

              <ul className="bahan-list">
                {(recipe.ingredients || []).map((item, idx) => {
                  const label =
                    typeof item === 'string'
                      ? item
                      : `${item.qty} ${item.unit} ${item.name}`.trim();
                  const isChecked = !!checkedIngredients[idx];

                  return (
                    <li key={idx}>
                      <label className="bahan-item">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleCheck(idx)}
                        />
                        <span className="check">✓</span>
                        <span className="txt">{label}</span>
                      </label>
                    </li>
                  );
                })}
              </ul>

              {recipe.tags && recipe.tags.length > 0 && (
                <div className="tag-list">
                  {recipe.tags.map((t, idx) => (
                    <span key={idx}>#{t}</span>
                  ))}
                </div>
              )}
            </aside>

            {/* Right Steps & Details */}
            <div>
              <div className="info-strip">
                <div>
                  <strong>{formatWaktu(recipe.time)}</strong>
                  <span>Total waktu</span>
                </div>
                <div>
                  <strong>{portion} porsi</strong>
                  <span>Hasil akhir</span>
                </div>
                <div>
                  <strong>{recipe.difficulty || 'Mudah'}</strong>
                  <span>Tingkat kesulitan</span>
                </div>
              </div>

              {recipe.image && (
                <div
                  style={{
                    marginBottom: '32px',
                    borderRadius: '24px',
                    overflow: 'hidden',
                    maxHeight: '400px',
                    border: '1px solid var(--line)',
                  }}
                >
                  <img
                    src={recipe.image}
                    alt={recipe.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
              )}

              <h2 className="section-sub" id="langkah">
                👩‍🍳 Langkah memasak
              </h2>
              <ol className="langkah-list">
                {(recipe.steps || []).map((st, idx) => (
                  <li key={idx}>
                    <p>{st}</p>
                  </li>
                ))}
              </ol>

              <h2 className="section-sub">✅ Catatan dari dapur</h2>
              <div className="panel">
                <p style={{ margin: 0, color: 'var(--ink-soft)' }}>
                  {recipe.tips ||
                    'Siapkan semua bahan sebelum mulai memasak (mise en place) agar prosesnya lebih cepat dan rasa akhirnya konsisten. Jangan lupa cicipi sebelum diangkat, lalu sajikan selagi hangat.'}
                </p>
              </div>

              <p style={{ marginTop: '30px' }}>
                <button className="btn btn-ghost" onClick={onBack}>
                  ← Kembali ke halaman sebelumnya
                </button>
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};
