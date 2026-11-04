import React from 'react';
import { useRecipes } from '../context/RecipeContext';
import { RecipeCard } from '../components/RecipeCard';
import { Recipe } from '../types/recipe';

interface ProfilViewProps {
  onOpenLogin: (mode?: 'login' | 'daftar') => void;
  onOpenCreate: () => void;
  onSelectRecipe: (r: Recipe) => void;
  onEditRecipe: (r: Recipe) => void;
  onDeleteRecipe: (r: Recipe) => void;
  onBrowseCategory: (cat?: string) => void;
}

export const ProfilView: React.FC<ProfilViewProps> = ({
  onOpenLogin,
  onOpenCreate,
  onSelectRecipe,
  onEditRecipe,
  onDeleteRecipe,
  onBrowseCategory,
}) => {
  const { currentUser, recipes, bookmarks, logout } = useRecipes();

  // If user is not logged in: display the exact Login Gate from image
  if (!currentUser) {
    return (
      <main>
        <section className="page-head">
          <div className="wrap">
            <ul className="breadcrumb">
              <li>
                <button onClick={() => onBrowseCategory()}>Beranda</button>
              </li>
              <li className="sep">›</li>
              <li>Profil</li>
            </ul>
            <span className="eyebrow">AKUN &amp; KOLEKSI PRIBADI</span>
            <h1>Profil Kamu</h1>
            <p>
              Masuk atau daftar dulu supaya resep favorit bisa disimpan dan dibuka lagi kapan saja.
            </p>
          </div>
        </section>

        <section className="section">
          <div className="wrap">
            <div className="login-gate">
              <span className="gate-emoji">🔖</span>
              <h2>Masuk untuk menyimpan resep</h2>
              <p>
                Buat akun gratis supaya resep favoritmu tersimpan dan bisa dibuka lagi kapan saja di browser ini.
              </p>
              <div className="gate-actions">
                <button
                  className="btn btn-primary"
                  type="button"
                  onClick={() => onOpenLogin('login')}
                >
                  Masuk
                </button>
                <button
                  className="btn btn-ghost"
                  type="button"
                  onClick={() => onOpenLogin('daftar')}
                >
                  Daftar baru
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
    );
  }

  // When logged in: display Profile Dashboard with user stats, created recipes, and bookmarked recipes
  const savedRecipes = recipes.filter((r) => bookmarks.includes(r.id));
  const myCreatedRecipes = recipes.filter(
    (r) =>
      r.author.toLowerCase() === currentUser.name.toLowerCase() ||
      r.author === 'Pengguna Resep Kita' ||
      r.author === 'Saya Sendiri'
  );
  const initial = currentUser.name.trim().charAt(0).toUpperCase();

  return (
    <main>
      <section className="page-head">
        <div className="wrap">
          <ul className="breadcrumb">
            <li>
              <button onClick={() => onBrowseCategory()}>Beranda</button>
            </li>
            <li className="sep">›</li>
            <li>Profil</li>
          </ul>
          <span className="eyebrow">AKUN &amp; KOLEKSI PRIBADI</span>
          <h1>Profil Kamu</h1>
          <p>
            Kelola resep yang kamu simpan dan resep yang telah kamu bagikan kepada komunitas.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="profil-grid">
            {/* Sidebar User Card */}
            <aside className="panel profil-card">
              <div className="profil-avatar">{initial}</div>
              <h2>{currentUser.name}</h2>
              <p className="email">{currentUser.email || 'Akun Terdaftar'}</p>
              <p className="role-chip">👤 Anggota</p>

              <div className="profil-stats">
                <div>
                  <strong>{savedRecipes.length}</strong>
                  <span>Tersimpan</span>
                </div>
                <div>
                  <strong>{myCreatedRecipes.length}</strong>
                  <span>Resep Saya</span>
                </div>
              </div>

              <div className="profil-actions">
                <button className="btn btn-primary" onClick={onOpenCreate}>
                  + Tulis Resep Baru
                </button>
                <button
                  className="btn btn-ghost"
                  onClick={() => onBrowseCategory()}
                >
                  Cari Resep Lain
                </button>
                <button
                  className="btn btn-ghost btn-danger"
                  type="button"
                  onClick={logout}
                >
                  Keluar dari akun
                </button>
              </div>
            </aside>

            {/* Main Tabs / Grids */}
            <div>
              {/* My Created Recipes */}
              <div className="section-head" style={{ marginBottom: '18px' }}>
                <div>
                  <span className="eyebrow">Karya Dapurmu</span>
                  <h2 className="section-title">Resep Buatan Saya</h2>
                  <p className="section-desc">
                    Koleksi hidangan yang telah kamu tulis dan bagikan.
                  </p>
                </div>
              </div>

              {myCreatedRecipes.length > 0 ? (
                <div
                  className="resep-grid resep-grid-dua"
                  style={{ marginBottom: '44px' }}
                >
                  {myCreatedRecipes.map((r) => (
                    <RecipeCard
                      key={r.id}
                      recipe={r}
                      onSelect={onSelectRecipe}
                      onEdit={onEditRecipe}
                      onDelete={onDeleteRecipe}
                    />
                  ))}
                </div>
              ) : (
                <div className="empty-state" style={{ marginBottom: '44px' }}>
                  <div className="icon">🍲</div>
                  <h3>Belum ada resep yang kamu buat</h3>
                  <p>Mulai bagikan resep rahasia masakan keluargamu hari ini.</p>
                  <p style={{ marginTop: '16px' }}>
                    <button className="btn btn-primary" onClick={onOpenCreate}>
                      Tulis Resep Pertama
                    </button>
                  </p>
                </div>
              )}

              {/* Saved Recipes */}
              <div className="section-head" style={{ marginBottom: '18px' }}>
                <div>
                  <span className="eyebrow">Koleksimu</span>
                  <h2 className="section-title">Resep Tersimpan</h2>
                  <p className="section-desc">
                    Klik 🔖 pada kartu resep untuk menyimpan atau melepasnya dari koleksi.
                  </p>
                </div>
              </div>

              {savedRecipes.length > 0 ? (
                <div className="resep-grid resep-grid-dua">
                  {savedRecipes.map((r) => (
                    <RecipeCard
                      key={r.id}
                      recipe={r}
                      onSelect={onSelectRecipe}
                      onEdit={onEditRecipe}
                      onDelete={onDeleteRecipe}
                    />
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <div className="icon">🧺</div>
                  <h3>Belum ada resep tersimpan</h3>
                  <p>Tekan tombol 🔖 pada resep yang ingin kamu simpan.</p>
                  <p style={{ marginTop: '16px' }}>
                    <button
                      className="btn btn-primary"
                      onClick={() => onBrowseCategory()}
                    >
                      Jelajahi resep
                    </button>
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};
