import React, { useState } from 'react';
import { X, ChefHat, UserPlus, LogIn } from 'lucide-react';
import { useRecipes } from '../context/RecipeContext';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessLogin?: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onSuccessLogin }) => {
  const { setCurrentUser, showToast } = useRecipes();
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

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
    if (!name.trim()) return;

    setCurrentUser({
      name: name.trim(),
      email: email.trim() || undefined,
    });

    if (isRegisterMode) {
      showToast(`Pendaftaran berhasil! Selamat bergabung sebagai Koki, ${name.trim()} 🎉`);
    } else {
      showToast(`Selamat datang kembali, ${name.trim()}! Siap berkreasi di dapur.`);
    }

    setName('');
    setEmail('');
    setPassword('');
    onClose();
    if (onSuccessLogin) {
      onSuccessLogin();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-sm overflow-y-auto flex items-center justify-center p-4 animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div 
        className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-6 sm:p-8 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose} 
          className="absolute top-5 right-5 text-stone-400 hover:text-stone-600 cursor-pointer"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Tab Pilihan Masuk / Daftar */}
        <div className="flex bg-stone-100 p-1 rounded-2xl mb-6">
          <button
            type="button"
            onClick={() => setIsRegisterMode(false)}
            className={`flex-1 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              !isRegisterMode 
                ? 'bg-white text-stone-900 shadow-sm' 
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            <LogIn className="w-4 h-4" />
            <span>Masuk Akun</span>
          </button>
          <button
            type="button"
            onClick={() => setIsRegisterMode(true)}
            className={`flex-1 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              isRegisterMode 
                ? 'bg-white text-stone-900 shadow-sm' 
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>Daftar Koki Baru</span>
          </button>
        </div>

        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-brand-100 text-brand-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-inner">
            <ChefHat className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-black text-stone-900">
            {isRegisterMode ? 'Buat Akun Koki Baru' : 'Masuk ke Resep Kita'}
          </h3>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            {isRegisterMode 
              ? 'Daftarkan profilmu untuk menyimpan portofolio masakan & berbagi inspirasi resep keluarga.'
              : 'Mencari resep tetap gratis tanpa login. Masuk untuk mengelola & menerbitkan resepmu.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1.5">
              {isRegisterMode ? 'Nama Lengkap / Nama Panggilan Koki *' : 'Nama Kamu / Nama Koki *'}
            </label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              required 
              placeholder={isRegisterMode ? "Contoh: Bunda Anisa / Chef Budi" : "Nama akun kokimu"} 
              className="w-full text-sm border border-stone-300 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-brand-500 focus:outline-none bg-stone-50 focus:bg-white transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1.5">
              Email {isRegisterMode ? '*' : '(Opsional)'}
            </label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required={isRegisterMode}
              placeholder="koki@email.com" 
              className="w-full text-sm border border-stone-300 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-brand-500 focus:outline-none bg-stone-50 focus:bg-white transition-all"
            />
          </div>

          {isRegisterMode && (
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5">
                Kata Sandi *
              </label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required={isRegisterMode}
                placeholder="Minimal 6 karakter" 
                className="w-full text-sm border border-stone-300 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-brand-500 focus:outline-none bg-stone-50 focus:bg-white transition-all"
              />
            </div>
          )}

          <div className="pt-2">
            <button 
              type="submit" 
              className="w-full py-3.5 bg-brand-500 hover:bg-brand-600 active:scale-95 text-white rounded-2xl font-bold text-sm shadow-md shadow-brand-500/30 transition-all cursor-pointer"
            >
              {isRegisterMode ? 'Daftar Sekarang & Lanjut' : 'Masuk & Lanjut Menulis'}
            </button>
          </div>

          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => setIsRegisterMode(!isRegisterMode)}
              className="text-xs text-stone-500 hover:text-brand-600 font-semibold cursor-pointer underline"
            >
              {isRegisterMode 
                ? 'Sudah punya akun? Masuk di sini' 
                : 'Belum punya akun? Daftar sebagai koki baru'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
