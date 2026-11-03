import React from 'react';
import { X, ChefHat } from 'lucide-react';
import { useRecipes } from '../context/RecipeContext';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessLogin?: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onSuccessLogin }) => {
  const { setCurrentUser, showToast } = useRecipes();
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setCurrentUser({
      name: name.trim(),
      email: email.trim() || undefined,
    });

    showToast(`Selamat datang, ${name.trim()}! Siap membagikan resep lezatmu.`);
    setName('');
    setEmail('');
    onClose();
    if (onSuccessLogin) {
      onSuccessLogin();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-sm overflow-y-auto flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-6 sm:p-8 relative">
        <button 
          onClick={onClose} 
          className="absolute top-5 right-5 text-stone-400 hover:text-stone-600 cursor-pointer"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-brand-100 text-brand-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-inner">
            <ChefHat className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-black text-stone-900">Masuk ke Resep Kita</h3>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Mencari & membaca resep gratis tanpa login. Masuk hanya untuk menulis & membagikan resep karyamu.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1.5">Nama Kamu / Nama Koki *</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              required 
              placeholder="Contoh: Budi Santoso / Bunda Ani" 
              className="w-full text-sm border border-stone-300 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-brand-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1.5">Email (Opsional)</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nama@email.com" 
              className="w-full text-sm border border-stone-300 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-brand-500 focus:outline-none"
            />
          </div>

          <div className="pt-2">
            <button 
              type="submit" 
              className="w-full py-3.5 bg-brand-500 hover:bg-brand-600 active:scale-95 text-white rounded-2xl font-bold text-sm shadow-md shadow-brand-500/30 transition-all cursor-pointer"
            >
              Masuk & Lanjut
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
