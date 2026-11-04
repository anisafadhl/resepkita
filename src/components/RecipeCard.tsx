import React from 'react';
import { Recipe } from '../types/recipe';
import { useRecipes } from '../context/RecipeContext';
import { CATEGORIES } from '../data/categories';

interface RecipeCardProps {
  recipe: Recipe;
  rank?: number;
  onSelect: (recipe: Recipe) => void;
  onEdit?: (recipe: Recipe) => void;
  onDelete?: (recipe: Recipe) => void;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({
  recipe,
  rank,
  onSelect,
  onEdit,
  onDelete,
}) => {
  const { bookmarks, toggleBookmark, currentUser } = useRecipes();
  const isSaved = bookmarks.includes(recipe.id);

  const kat = CATEGORIES.find((c) => c.slug === recipe.category) || {
    slug: 'makanan-berat',
    nama: 'Makanan',
    emoji: '🍛',
    pola: 'dots',
    warna: ['#e0592a', '#f7b267'] as [string, string],
  };

  const isAuthor =
    currentUser &&
    (recipe.author.toLowerCase() === currentUser.name.toLowerCase() ||
      recipe.author === 'Pengguna Resep Kita' ||
      recipe.author === 'Saya Sendiri');

  const formatWaktu = (menit: number) => {
    if (menit < 60) return `${menit} menit`;
    const j = Math.floor(menit / 60);
    const m = menit % 60;
    return m ? `${j} jam ${m} mnt` : `${j} jam`;
  };

  const portion = recipe.portionBase || recipe.portion_base || 2;

  return (
    <article className="resep-card">
      {/* Clickable Card Body */}
      <div
        className="resep-link"
        onClick={() => onSelect(recipe)}
        style={{ cursor: 'pointer' }}
      >
        <div
          className={`resep-thumb pola-${kat.pola}`}
          style={{
            background: recipe.image
              ? undefined
              : `linear-gradient(135deg, ${kat.warna[0]}, ${kat.warna[1]})`,
          }}
        >
          {rank ? (
            <span className="rank">#{rank} TRENDING</span>
          ) : (
            <span className="rank">{kat.nama}</span>
          )}

          {recipe.image ? (
            <img
              src={recipe.image}
              alt={recipe.title}
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = 'none';
              }}
            />
          ) : (
            <span style={{ fontSize: '3.5rem' }}>{kat.emoji}</span>
          )}
        </div>

        <div className="resep-body">
          <span
            className="chip"
            style={{
              color: '#fff',
              background: `linear-gradient(135deg, ${kat.warna[0]}, ${kat.warna[1]})`,
            }}
          >
            {kat.nama}
          </span>
          <h3>{recipe.title}</h3>
          <p>{recipe.desc}</p>

          <div className="resep-meta">
            <span className="meta-left">
              <span>⏱ {formatWaktu(recipe.time)}</span>
              <span>🍽 {portion} porsi</span>
            </span>
            <span className="stars">★ {recipe.rating || 4.8}</span>
          </div>
        </div>
      </div>

      {/* Author Edit/Delete buttons if user owns recipe */}
      {isAuthor && (
        <div className="card-owner-actions">
          {onEdit && (
            <button
              className="btn-card-action"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(recipe);
              }}
              title="Edit resep"
              aria-label="Edit"
            >
              ✏️
            </button>
          )}
          {onDelete && (
            <button
              className="btn-card-action"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(recipe);
              }}
              title="Hapus resep"
              aria-label="Hapus"
            >
              🗑️
            </button>
          )}
        </div>
      )}

      {/* Bookmark button */}
      <button
        className={`btn-save ${isSaved ? 'is-saved' : ''}`}
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          toggleBookmark(recipe.id);
        }}
        aria-label={isSaved ? 'Hapus simpanan' : 'Simpan resep'}
        title={isSaved ? 'Tersimpan — klik untuk lepas' : 'Simpan resep'}
      >
        🔖
      </button>
    </article>
  );
};
