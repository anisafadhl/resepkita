import React from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { useRecipes } from '../context/RecipeContext';

export const Toast: React.FC = () => {
  const { toast } = useRecipes();

  if (!toast) return null;

  return (
    <div className="fixed top-5 right-5 z-50 transform transition-all duration-300 bg-stone-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 border border-stone-700 animate-in fade-in slide-in-from-top-5">
      {toast.type === 'error' ? (
        <AlertCircle className="w-6 h-6 text-rose-400 flex-shrink-0" />
      ) : (
        <CheckCircle className="w-6 h-6 text-emerald-400 flex-shrink-0" />
      )}
      <span className="text-sm font-semibold tracking-wide">{toast.message}</span>
    </div>
  );
};
