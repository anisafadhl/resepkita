import React, { useState } from 'react';
import { useRecipes } from '../context/RecipeContext';

interface HeaderProps {
  currentView: 'home' | 'kategori' | 'profil' | 'detail';
  setCurrentView: (view: 'home' | 'kategori' | 'profil') => void;
  onOpenLogin: () => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onSearchSubmit: (q: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  setCurrentView,
  onOpenLogin,
  searchQuery,
  setSearchQuery,
  onSearchSubmit,
}) => {
  const { currentUser, bookmarks } = useRecipes();
  const [menuOpen, setMenuOpen] = useState(false);
  const [localSearch, setLocalSearch] = useState(searchQuery);

  const handleNavClick = (view: 'home' | 'kategori' | 'profil', hash?: string) => {
    setCurrentView(view);
    setMenuOpen(false);
    if (hash) {
      setTimeout(() => {
        const el = document.querySelector(hash);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 50);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (localSearch.trim()) {
      setSearchQuery(localSearch.trim());
      onSearchSubmit(localSearch.trim());
      setMenuOpen(false);
    }
  };

  return (
    <header className="site-header">
      <div className="wrap nav">
        {/* Logo */}
        <button className="logo" onClick={() => handleNavClick('home')}>
          <span className="logo-mark">🍳</span>
          <span className="logo-text">Dapur Rasa</span>
        </button>

        {/* Desktop Nav Links */}
        <ul className={`nav-links ${menuOpen ? 'open' : ''}`}>
          <li>
            <button
              className={currentView === 'home' ? 'active' : ''}
              onClick={() => handleNavClick('home')}
            >
              Beranda
            </button>
          </li>
          <li>
            <button onClick={() => handleNavClick('home', '#kategori')}>
              Kategori
            </button>
          </li>
          <li>
            <button onClick={() => handleNavClick('home', '#tren')}>
              Resep Tren
            </button>
          </li>
          <li>
            <button onClick={() => handleNavClick('home', '#tips')}>
              Tips Masak
            </button>
          </li>
          <li>
            <button
              className={currentView === 'kategori' ? 'active' : ''}
              onClick={() => handleNavClick('kategori')}
            >
              Semua Resep
            </button>
          </li>

          {/* Search inside mobile menu */}
          <li className="nav-item-search" style={{ display: menuOpen ? 'block' : 'none' }}>
            <form onSubmit={handleSearch} className="nav-search" style={{ width: '100%' }}>
              <input
                type="search"
                placeholder="Cari resep…"
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
              />
              <button type="submit">🔍</button>
            </form>
          </li>
        </ul>

        {/* Right CTA */}
        <div className="nav-cta">
          <form onSubmit={handleSearch} className="nav-search">
            <input
              type="search"
              placeholder="Cari resep…"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
            />
            <button type="submit" aria-label="Cari">🔍</button>
          </form>

          {/* Profile / Auth Button */}
          <button
            className={`nav-profile ${currentUser ? 'is-login' : ''}`}
            onClick={() => {
              if (currentUser) {
                setCurrentView('profil');
              } else {
                onOpenLogin();
              }
            }}
            title={currentUser ? `Profil & Koleksi — ${currentUser.name}` : 'Masuk / Daftar'}
          >
            <span className="nav-avatar">
              {currentUser ? currentUser.name.trim().charAt(0).toUpperCase() : '👤'}
            </span>
            <span className="nav-prof-text">
              {currentUser ? currentUser.name.trim().split(' ')[0] : 'Masuk'}
            </span>
            {currentUser && bookmarks.length > 0 && (
              <span className="nav-badge">{bookmarks.length}</span>
            )}
          </button>

          {/* Mobile hamburger */}
          <button
            className="nav-toggle"
            aria-label="Buka menu"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            ☰
          </button>
        </div>
      </div>
    </header>
  );
};
