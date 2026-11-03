import React, { useState, useEffect } from 'react';
import { X, Play, RotateCcw, Sparkles, ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';
import { Recipe } from '../types/recipe';
import confetti from 'canvas-confetti';

interface CookingModeModalProps {
  recipe: Recipe | null;
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

export const CookingModeModal: React.FC<CookingModeModalProps> = ({
  recipe,
  isOpen,
  onClose,
  onComplete,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [timerSeconds, setTimerSeconds] = useState(300);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setCurrentStep(0);
      setTimerSeconds(300);
      setIsTimerRunning(false);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds(prev => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0 && isTimerRunning) {
      setIsTimerRunning(false);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, timerSeconds]);

  if (!isOpen || !recipe) return null;

  const stepsList = Array.isArray(recipe.steps) && recipe.steps.length > 0 
    ? recipe.steps 
    : ['Ikuti petunjuk umum persiapan masakan.'];
  const totalSteps = stepsList.length;

  const handleNext = () => {
    if (currentStep === totalSteps - 1) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      onComplete();
      onClose();
    } else {
      setCurrentStep(prev => prev + 1);
      setTimerSeconds(300);
      setIsTimerRunning(false);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
      setTimerSeconds(300);
      setIsTimerRunning(false);
    }
  };

  const mins = Math.floor(timerSeconds / 60);
  const secs = timerSeconds % 60;
  const timeFormatted = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

  return (
    <div 
      className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-md overflow-y-auto flex items-center justify-center p-4 animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div 
        className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden relative max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-brand-500 text-white p-6 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-white/20">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs uppercase tracking-wider font-extrabold text-brand-100">
                Mode Memasak Fokus
              </span>
              <h3 className="font-bold text-lg sm:text-xl truncate max-w-sm sm:max-w-md">
                {recipe.title}
              </h3>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-all cursor-pointer"
            title="Keluar dari mode memasak"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Body content */}
        <div className="p-6 sm:p-10 text-center overflow-y-auto">
          {/* Progress badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-50 text-brand-700 text-xs sm:text-sm font-black mb-6">
            Langkah {currentStep + 1} dari {totalSteps}
          </div>

          {/* Current Step Instruction */}
          <div className="min-h-[140px] flex items-center justify-center mb-8 px-2">
            <p className="text-lg sm:text-2xl font-bold text-stone-900 leading-relaxed max-w-xl">
              "{stepsList[currentStep]}"
            </p>
          </div>

          {/* Kitchen Timer Widget */}
          <div className="bg-stone-50 border border-stone-200 rounded-3xl p-5 max-w-sm mx-auto mb-8 shadow-sm">
            <span className="block text-xs font-bold text-stone-400 uppercase tracking-wider mb-1">
              Timer Dapur (Menit : Detik)
            </span>
            <div className="text-3xl font-black text-stone-800 tracking-widest font-mono mb-3">
              {timeFormatted}
            </div>
            <div className="flex items-center justify-center gap-2">
              <button 
                onClick={() => setIsTimerRunning(!isTimerRunning)} 
                className="px-5 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 active:scale-95 text-white font-bold text-xs shadow-md shadow-brand-500/20 cursor-pointer flex items-center gap-1.5"
              >
                <Play className="w-3.5 h-3.5" />
                <span>{isTimerRunning ? 'Jeda' : 'Mulai Timer'}</span>
              </button>
              <button 
                onClick={() => {
                  setIsTimerRunning(false);
                  setTimerSeconds(300);
                }} 
                className="px-4 py-2 rounded-xl bg-white hover:bg-stone-100 border border-stone-200 text-stone-600 font-bold text-xs cursor-pointer flex items-center gap-1"
                title="Reset timer 5 menit"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            </div>
          </div>

          {/* Step Navigation Controls */}
          <div className="flex items-center justify-between gap-4 pt-4 border-t border-stone-100">
            <button 
              onClick={handlePrev}
              disabled={currentStep === 0}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl border border-stone-200 text-stone-600 text-xs sm:text-sm font-bold hover:bg-stone-50 disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Langkah Sebelumnya</span>
            </button>

            <button 
              onClick={handleNext}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-brand-500 hover:bg-brand-600 text-white text-xs sm:text-sm font-bold shadow-md shadow-brand-500/25 cursor-pointer active:scale-95 transition-all"
            >
              {currentStep === totalSteps - 1 ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Selesai Memasak 🎉</span>
                </>
              ) : (
                <>
                  <span>Lanjut Langkah Berikutnya</span>
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
