import React, { useState } from 'react';
import { useRecipes } from './context/RecipeContext';
import { Header } from './components/Header';
import { RecipeCard } from './components/RecipeCard';
import { LoginModal } from './components/LoginModal';
import { AddRecipeModal } from './components/AddRecipeModal';
import { ProfilView } from './components/ProfilView';
import { RecipeDetailView } from './components/RecipeDetailView';
import { Toast } from './components/Toast';
import { Recipe } from './types/recipe';
import { CATEGORIES, COOKING_TIPS } from './data/categories';

export const App: React.FC = () => {
  const { recipes, deleteRecipe, showToast } = useRecipes();

  // Page Routing State
  const [currentView, setCurrentView] = useState<'home' | 'kategori' | 'profil' | 'detail'>('home');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  // Modal States
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [loginMode, setLoginMode] = useState<'login' | 'daftar'>('login');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [recipeToEdit, setRecipeToEdit] = useState<Recipe | null>(null);
  const [recipeToDelete, setRecipeToDelete] = useState<Recipe | null>(null);

  // Handlers
  const handleOpenLogin = (mode: 'login' | 'daftar' = 'login') => {
    setLoginMode(mode);
    setIsLoginOpen(true);
  };

  const handleOpenCreate = () => {
    setRecipeToEdit(null);
    setIsAddOpen(true);
  };

  const handleSelectRecipe = (r: Recipe) => {
    setSelectedRecipe(r);
    setCurrentView('detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEditRecipe = (r: Recipe) => {
    setRecipeToEdit(r);
    setIsAddOpen(true);
  };

  const handleDeleteRecipe = (r: Recipe) => {
    setRecipeToDelete(r);
  };

  const confirmDeleteRecipe = async () => {
    if (!recipeToDelete) return;
    await deleteRecipe(recipeToDelete.id);
    if (selectedRecipe?.id === recipeToDelete.id) {
      setCurrentView('kategori');
      setSelectedRecipe(null);
    }
    setRecipeToDelete(null);
    showToast('Resep berhasil dihapus.');
  };

  const handleSearchSubmit = (q: string) => {
    setSearchQuery(q);
    setCurrentView('kategori');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectCategory = (catSlug?: string) => {
    setSelectedCategory(catSlug || null);
    setCurrentView('kategori');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Filtered recipes for "kategori" view
  const categoryFilteredRecipes = React.useMemo(() => {
    let list = [...recipes];
    if (selectedCategory) {
      list = list.filter((r) => r.category === selectedCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (r: Recipe) =>
          r.title.toLowerCase().includes(q) ||
          (r.desc && r.desc.toLowerCase().includes(q)) ||
          r.tags?.some((t: string) => t.toLowerCase().includes(q))
      );
    }
    return list;
  }, [recipes, selectedCategory, searchQuery]);

  // Featured Recipe for Hero Card
  const featuredRecipe = recipes[0] || {
    id: 'featured-1',
    title: 'Kopi Susu Gula Aren',
    desc: 'Hanya 10 menit, rasanya seperti kopi kekinian favoritmu.',
    time: 10,
    portionBase: 1,
    rating: 4.9,
    difficulty: 'Mudah',
    author: 'Dapur Rasa',
    category: 'minuman',
    tags: ['kopi', 'minuman'],
    ingredients: [],
    steps: [],
    image: '',
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Toast />

      {/* Header with Navigation and Profile Action */}
      <Header
        currentView={currentView}
        setCurrentView={(view) => {
          setCurrentView(view);
          if (view === 'kategori') setSelectedCategory(null);
        }}
        onOpenLogin={() => handleOpenLogin('login')}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSearchSubmit={handleSearchSubmit}
      />

      {/* VIEW: HOME */}
      {currentView === 'home' && (
        <main>
          {/* ============ HERO ============ */}
          <section className="hero">
            <div className="wrap hero-grid">
              <div>
                <span className="eyebrow">✦ Resep teruji di dapur rumahan</span>
                <h1>
                  <span>Masak enak setiap hari,</span>{' '}
                  <span className="grad">mulai dari yang paling gampang.</span>
                </h1>
                <p className="lead">
                  Panduan resep lengkap dengan takaran bahan dan langkah demi langkah.
                  Pilih kategori, ikuti alurnya, dan sajikan hidangan favorit keluarga hari ini juga.
                </p>

                <form
                  className="search-box"
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSearchSubmit(searchQuery);
                  }}
                  role="search"
                >
                  <input
                    type="search"
                    placeholder="Cari resep, misal: nasi goreng, kopi…"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    aria-label="Cari resep"
                  />
                  <button type="submit">Cari</button>
                </form>

                <div className="hero-actions" style={{ marginTop: '20px' }}>
                  <a className="btn btn-primary" href="#kategori">
                    Jelajahi Kategori →
                  </a>
                  <a className="btn btn-ghost" href="#tren">
                    Lihat yang Tren
                  </a>
                </div>

                <div className="hero-stats">
                  <div>
                    <strong>{recipes.length || 20}</strong>
                    <span>Resep terpilih</span>
                  </div>
                  <div>
                    <strong>4</strong>
                    <span>Kategori utama</span>
                  </div>
                  <div>
                    <strong>4.8★</strong>
                    <span>Rata-rata rating</span>
                  </div>
                </div>
              </div>

              {/* Hero Card */}
              <aside
                className="hero-card"
                onClick={() => handleSelectRecipe(featuredRecipe)}
              >
                <span className="badge-soft">Resep paling dicari hari ini</span>
                <h3>{featuredRecipe.title}</h3>
                <p>{featuredRecipe.desc}</p>
                <div className="meta">
                  <span>⏱ {featuredRecipe.time} menit</span>
                  <span>🥤 {featuredRecipe.portionBase || 1} porsi</span>
                  <span>★ {featuredRecipe.rating || 4.9}</span>
                </div>
              </aside>
            </div>
          </section>

          {/* ============ KATEGORI ============ */}
          <section className="section" id="kategori">
            <div className="wrap">
              <div className="section-head">
                <div>
                  <span className="eyebrow">Langkah 1 · Pilih kategori</span>
                  <h2 className="section-title">Mau masak yang seperti apa?</h2>
                  <p className="section-desc">
                    Empat kategori utama yang disusun agar kamu cepat menemukan resep sesuai kebutuhan,
                    dari hidangan berat sampai pendamping minum kopi.
                  </p>
                </div>
                <button
                  className="btn btn-ghost"
                  onClick={() => handleSelectCategory()}
                >
                  Lihat semua resep →
                </button>
              </div>

              <div className="kategori-grid">
                {CATEGORIES.map((k) => {
                  const count = recipes.filter((r: Recipe) => r.category === k.slug).length;
                  return (
                    <button
                      key={k.slug}
                      className={`kategori-card pola-${k.pola}`}
                      style={{
                        background: `linear-gradient(135deg, ${k.warna[0]}, ${k.warna[1]})`,
                      }}
                      data-emoji={k.emoji}
                      onClick={() => handleSelectCategory(k.slug)}
                    >
                      <span className="k-label">{k.label}</span>
                      <div>
                        <h3>{k.nama}</h3>
                        <p>{k.deskripsi}</p>
                        <div className="k-bottom">
                          <span>{count} resep</span>
                          <span className="k-arrow">→</span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </section>

          {/* ============ REKOMENDASI TREN ============ */}
          <section className="section section-alt" id="tren">
            <div className="wrap">
              <div className="section-head">
                <div>
                  <span className="eyebrow">Langkah 2 · Rekomendasi tren</span>
                  <h2 className="section-title">Resep yang sedang banyak dicari</h2>
                  <p className="section-desc">
                    Diperbarui berdasarkan resep dengan rating tertinggi dan paling sering dibuka minggu ini.
                  </p>
                </div>
                <button
                  className="btn btn-ghost"
                  onClick={() => handleSelectCategory()}
                >
                  Semua resep →
                </button>
              </div>

              {recipes.length > 0 ? (
                <div className="resep-grid">
                  {recipes.slice(0, 8).map((r: Recipe, i: number) => (
                    <RecipeCard
                      key={r.id}
                      recipe={r}
                      rank={i + 1}
                      onSelect={handleSelectRecipe}
                      onEdit={handleEditRecipe}
                      onDelete={handleDeleteRecipe}
                    />
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <div className="icon">🍲</div>
                  <h3>Belum ada resep yang tersedia</h3>
                  <p>Mulai tambahkan resep masakan pertamamu sekarang.</p>
                  <p style={{ marginTop: '16px' }}>
                    <button className="btn btn-primary" onClick={handleOpenCreate}>
                      + Tulis Resep Baru
                    </button>
                  </p>
                </div>
              )}
            </div>
          </section>

          {/* ============ TIPS ============ */}
          <section className="section" id="tips">
            <div className="wrap">
              <div className="section-head">
                <div>
                  <span className="eyebrow">Langkah 3 · Sebelum mulai</span>
                  <h2 className="section-title">Tiga tips masak yang selalu berhasil</h2>
                  <p className="section-desc">
                    Kebiasaan kecil ini membuat hasil masakanmu jauh lebih konsisten.
                  </p>
                </div>
              </div>
              <div className="tips-grid">
                {COOKING_TIPS.map((tip, idx) => (
                  <article key={idx} className="tip-card">
                    <strong>
                      {tip.icon} {tip.judul}
                    </strong>
                    <p>{tip.isi}</p>
                  </article>
                ))}
              </div>
            </div>
          </section>
        </main>
      )}

      {/* VIEW: KATEGORI / SEMUA RESEP */}
      {currentView === 'kategori' && (
        <main>
          <section className="page-head">
            <div className="wrap">
              <ul className="breadcrumb">
                <li>
                  <button onClick={() => setCurrentView('home')}>Beranda</button>
                </li>
                <li className="sep">›</li>
                <li>Semua Resep</li>
                {selectedCategory && (
                  <>
                    <li className="sep">›</li>
                    <li>
                      {CATEGORIES.find((c) => c.slug === selectedCategory)?.nama}
                    </li>
                  </>
                )}
              </ul>

              <span className="eyebrow">
                {selectedCategory
                  ? CATEGORIES.find((c) => c.slug === selectedCategory)?.label
                  : 'Semua Resep'}
              </span>
              <h1>
                {selectedCategory
                  ? `${CATEGORIES.find((c) => c.slug === selectedCategory)?.emoji} ${CATEGORIES.find((c) => c.slug === selectedCategory)?.nama}`
                  : 'Semua Resep Dapur Rasa'}
              </h1>
              <p>
                {selectedCategory
                  ? CATEGORIES.find((c) => c.slug === selectedCategory)?.deskripsi
                  : 'Jelajahi seluruh koleksi resep, atau saring berdasarkan kategori di bawah ini.'}
              </p>

              {/* Filter Chips */}
              <div className="filter-bar">
                <button
                  className={`filter-chip ${selectedCategory === null ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(null)}
                >
                  🍽 Semua Resep
                </button>
                {CATEGORIES.map((c) => (
                  <button
                    key={c.slug}
                    className={`filter-chip ${selectedCategory === c.slug ? 'active' : ''}`}
                    onClick={() => setSelectedCategory(c.slug)}
                  >
                    {c.emoji} {c.nama}
                  </button>
                ))}
              </div>

              {searchQuery && (
                <p className="result-note">
                  Menampilkan hasil pencarian untuk “{searchQuery}”
                  <button
                    onClick={() => setSearchQuery('')}
                    style={{
                      marginLeft: '8px',
                      color: 'var(--brand)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      fontWeight: 700,
                    }}
                  >
                    (Hapus filter)
                  </button>
                </p>
              )}
            </div>
          </section>

          <section className="section">
            <div className="wrap">
              {categoryFilteredRecipes.length > 0 ? (
                <div className="resep-grid">
                  {categoryFilteredRecipes.map((r) => (
                    <RecipeCard
                      key={r.id}
                      recipe={r}
                      onSelect={handleSelectRecipe}
                      onEdit={handleEditRecipe}
                      onDelete={handleDeleteRecipe}
                    />
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <div className="icon">🍽</div>
                  <h3>Resep belum ditemukan</h3>
                  <p>Coba kata kunci lain atau pilih kategori lain di atas.</p>
                  <p style={{ marginTop: '16px' }}>
                    <button
                      className="btn btn-primary"
                      onClick={() => {
                        setSelectedCategory(null);
                        setSearchQuery('');
                      }}
                    >
                      Lihat semua resep
                    </button>
                  </p>
                </div>
              )}
            </div>
          </section>
        </main>
      )}

      {/* VIEW: PROFIL (SESUAI GAMBAR PENGGUNA) */}
      {currentView === 'profil' && (
        <ProfilView
          onOpenLogin={handleOpenLogin}
          onOpenCreate={handleOpenCreate}
          onSelectRecipe={handleSelectRecipe}
          onEditRecipe={handleEditRecipe}
          onDeleteRecipe={handleDeleteRecipe}
          onBrowseCategory={handleSelectCategory}
        />
      )}

      {/* VIEW: DETAIL RESEP */}
      {currentView === 'detail' && selectedRecipe && (
        <RecipeDetailView
          recipe={selectedRecipe}
          onBack={() => setCurrentView('kategori')}
          onSelectOtherRecipe={handleSelectRecipe}
          onEditRecipe={handleEditRecipe}
          onDeleteRecipe={handleDeleteRecipe}
        />
      )}

      {/* SITE FOOTER */}
      <footer className="site-footer">
        <div className="wrap">
          <div className="footer-grid">
            <div>
              <button
                className="logo"
                style={{ color: '#fff', marginBottom: '12px' }}
                onClick={() => setCurrentView('home')}
              >
                <span className="logo-mark">🍳</span>
                <span className="logo-text">Dapur Rasa</span>
              </button>
              <p>
                Kumpulan resep rumahan yang mudah diikuti, dengan takaran jelas dan langkah-langkah yang ramah untuk pemula.
              </p>
            </div>
            <div className="footer-col">
              <h4>Kategori</h4>
              <ul>
                {CATEGORIES.map((c) => (
                  <li key={c.slug}>
                    <button onClick={() => handleSelectCategory(c.slug)}>
                      {c.nama}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div className="footer-col">
              <h4>Navigasi</h4>
              <ul>
                <li>
                  <button onClick={() => setCurrentView('home')}>Beranda</button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setCurrentView('home');
                      setTimeout(() => {
                        document.querySelector('#tren')?.scrollIntoView({ behavior: 'smooth' });
                      }, 50);
                    }}
                  >
                    Resep Tren
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setCurrentView('home');
                      setTimeout(() => {
                        document.querySelector('#tips')?.scrollIntoView({ behavior: 'smooth' });
                      }, 50);
                    }}
                  >
                    Tips Masak
                  </button>
                </li>
                <li>
                  <button onClick={() => setCurrentView('profil')}>Profil</button>
                </li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <span>© 2026 Dapur Rasa · Resep Kita</span>
            <span>Masak dengan hati, sajikan dengan senyum.</span>
          </div>
        </div>
      </footer>

      {/* Delete Confirmation Modal */}
      {recipeToDelete && (
        <div className="modal" role="dialog" aria-modal="true">
          <div
            className="modal-backdrop"
            onClick={() => setRecipeToDelete(null)}
          />
          <div className="modal-card" style={{ maxWidth: '400px' }}>
            <div className="modal-head">
              <span className="modal-emoji">⚠️</span>
              <div>
                <h2>Hapus Resep?</h2>
                <p className="modal-sub">
                  Resep “{recipeToDelete.title}” akan dihapus secara permanen.
                </p>
              </div>
            </div>
            <div
              style={{
                display: 'flex',
                gap: '10px',
                marginTop: '20px',
                justifyContent: 'flex-end',
              }}
            >
              <button
                className="btn btn-ghost"
                onClick={() => setRecipeToDelete(null)}
              >
                Batal
              </button>
              <button
                className="btn btn-danger"
                onClick={confirmDeleteRecipe}
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Auth Modal */}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        initialMode={loginMode}
      />

      {/* Add / Edit Recipe Modal */}
      <AddRecipeModal
        isOpen={isAddOpen}
        onClose={() => {
          setIsAddOpen(false);
          setRecipeToEdit(null);
        }}
        recipeToEdit={recipeToEdit}
      />
    </div>
  );
};

export default App;
