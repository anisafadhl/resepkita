import React, { useState } from 'react';
import { useRecipes } from '../context/RecipeContext';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'daftar';
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'login',
}) => {
  const { setCurrentUser, showToast } = useRecipes();
  const [tab, setTab] = useState<'login' | 'daftar'>(initialMode);
  const [nama, setNama] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  React.useEffect(() => {
    setTab(initialMode);
  }, [initialMode, isOpen]);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (tab === 'daftar' && nama.trim().length < 2) {
      setError('Nama minimal 2 karakter.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Format email belum benar.');
      return;
    }
    if (password.length < 4) {
      setError('Kata sandi minimal 4 karakter.');
      return;
    }

    const userName = tab === 'daftar' ? nama.trim() : email.split('@')[0];

    setCurrentUser({
      name: userName,
      email: email.trim(),
      role: 'user',
    });

    if (tab === 'daftar') {
      showToast(`🎉 Akun baru dibuat. Selamat datang, ${userName}!`);
    } else {
      showToast(`👋 Selamat datang kembali, ${userName}!`);
    }

    setNama('');
    setEmail('');
    setPassword('');
    onClose();
  };

  return (
    <div className="modal" role="dialog" aria-modal="true">
      <div className="modal-backdrop" onClick={onClose} />
      <div className="modal-card">
        <button
          className="modal-close"
          type="button"
          onClick={onClose}
          aria-label="Tutup"
        >
          ×
        </button>

        <div className="modal-head">
          <span className="modal-emoji">🔖</span>
          <div>
            <h2>{tab === 'daftar' ? 'Buat akun baru' : 'Masuk untuk menyimpan resep'}</h2>
            <p className="modal-sub">
              {tab === 'daftar'
                ? 'Gratis, cukup satu kali daftar.'
                : 'Simpan resep favoritmu di sini.'}
            </p>
          </div>
        </div>

        <div className="modal-tabs">
          <button
            type="button"
            className={tab === 'login' ? 'active' : ''}
            onClick={() => {
              setTab('login');
              setError('');
            }}
          >
            Masuk
          </button>
          <button
            type="button"
            className={tab === 'daftar' ? 'active' : ''}
            onClick={() => {
              setTab('daftar');
              setError('');
            }}
          >
            Daftar baru
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          {tab === 'daftar' && (
            <label className="field">
              Nama
              <input
                type="text"
                placeholder="Nama kamu"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                required
              />
            </label>
          )}

          <label className="field">
            Email
            <input
              type="email"
              placeholder="nama@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>

          <label className="field">
            Kata sandi
            <input
              type="password"
              placeholder="Minimal 4 karakter"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>

          {error && (
            <p
              style={{
                margin: '0 0 10px',
                fontSize: '0.82rem',
                fontWeight: 600,
                color: '#c0392b',
                background: '#fdeceb',
                border: '1px solid #f6cfcb',
                padding: '8px 11px',
                borderRadius: '10px',
              }}
            >
              {error}
            </p>
          )}

          <button className="btn btn-primary btn-block" type="submit">
            {tab === 'daftar' ? 'Daftar & simpan' : 'Masuk'}
          </button>
        </form>

        <p
          style={{
            margin: '12px 0 0',
            fontSize: '0.74rem',
            color: '#a99c8f',
            textAlign: 'center',
          }}
        >
          Masuk dengan akunmu untuk menyimpan resep dan menulis resep sendiri.
        </p>
      </div>
    </div>
  );
};
