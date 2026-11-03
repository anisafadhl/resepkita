import React, { useState } from 'react';
import { ArrowLeft, Play, RotateCcw, Sparkles, ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';
import { Recipe } from '../types/recipe';
import confetti from 'canvas-confetti';

interface CookingModePageProps {
  recipe: Recipe;
  onBack: () => void;
  onFinish: () => void;
}

export const CookingModePage: React.FC<CookingModePageProps> = ({
  recipe,
  onBack,
  onFinish,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [timerSeconds, setTimerSeconds] = useState(300);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentStep]);

  React.useEffect(() => {
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

  const stepsList = Array.isArray(recipe.steps) && recipe.steps.length > 0 
    ? recipe.steps 
    : ['Ikuti petunjuk umum persiapan masakan.'];
  const totalSteps = stepsList.length;

  const handleNext = () => {
    if (currentStep === totalSteps - 1) {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });
      onFinish();
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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-2 pb-20 animate-in fade-in duration-200">
      {/* Top Bar Navigation */}
      <div className="flex items-center justify-between py-4 mb-4">
        <button 
          onClick={onBack}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white border border-stone-200 text-stone-700 hover:bg-stone-50 text-sm font-bold shadow-sm transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-brand-600" />
          <span>Kembali ke Detail Resep</span>
        </button>

        <div className="text-right">
          <span className="text-xs text-stone-400 font-bold block">Memasak:</span>
          <span className="text-sm font-extrabold text-stone-800 truncate max-w-[200px] block">
            {recipe.title}
          </span>
        </div>
      </div>

      {/* Main Focus Card */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-xl overflow-hidden">
        {/* Banner Bar */}
        <div className="bg-gradient-to-r from-brand-600 to-amber-500 text-white p-6 sm:p-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-white/20 shadow-inner">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs uppercase tracking-wider font-extrabold text-brand-100 block">
                Mode Memasak Fokus Layar Penuh
              </span>
              <h2 className="text-xl sm:text-2xl font-black">{recipe.title}</h2>
            </div>
          </div>
          <span className="bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-2xl text-xs sm:text-sm font-black">
            Langkah {currentStep + 1} / {totalSteps}
          </span>
        </div>

        {/* Step Body */}
        <div className="p-6 sm:p-12 text-center">
          {/* Progress Bar Visual */}
          <div className="w-full bg-stone-100 rounded-full h-3 mb-8 overflow-hidden">
            <div 
              className="bg-brand-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
            />
          </div>

          {/* Current Step Instruction Big Typography */}
          <div className="min-h-[160px] flex items-center justify-center mb-10 px-4 py-6 bg-stone-50 rounded-3xl border border-stone-200">
            <p className="text-xl sm:text-3xl font-black text-stone-900 leading-relaxed max-w-2xl">
              "{stepsList[currentStep]}"
            </p>
          </div>

          {/* Kitchen Timer Card */}
          <div className="bg-stone-50 border border-stone-200 rounded-3xl p-6 max-w-sm mx-auto mb-10 shadow-sm">
            <span className="block text-xs font-black text-stone-400 uppercase tracking-wider mb-2">
              Timer Dapur Digital
            </span>
            <div className="text-4xl sm:text-5xl font-black text-stone-800 tracking-widest font-mono mb-4">
              {timeFormatted}
            </div>
            <div className="flex items-center justify-center gap-3">
              <button 
                onClick={() => setIsTimerRunning(!isTimerRunning)} 
                className="px-6 py-2.5 rounded-2xl bg-brand-500 hover:bg-brand-600 active:scale-95 text-white font-bold text-xs sm:text-sm shadow-md shadow-brand-500/25 cursor-pointer flex items-center gap-2"
              >
                <Play className="w-4 h-4" />
                <span>{isTimerRunning ? 'Jeda' : 'Mulai Timer'}</span>
              </button>
              <button 
                onClick={() => {
                  setIsTimerRunning(false);
                  setTimerSeconds(300);
                }} 
                className="px-4 py-2.5 rounded-2xl bg-white hover:bg-stone-100 border border-stone-200 text-stone-600 font-bold text-xs sm:text-sm cursor-pointer flex items-center gap-1.5"
                title="Reset timer 5 menit"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset (5m)</span>
              </button>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between gap-4 pt-6 border-t border-stone-100">
            <button 
              onClick={handlePrev}
              disabled={currentStep === 0}
              className="flex items-center gap-2 px-6 py-3.5 rounded-2xl border border-stone-200 text-stone-700 text-sm font-bold hover:bg-stone-50 disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
              <span>Langkah Sebelumnya</span>
            </button>

            <button 
              onClick={handleNext}
              className="flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-brand-500 hover:bg-brand-600 text-white text-sm font-bold shadow-lg shadow-brand-500/25 cursor-pointer active:scale-95 transition-all"
            >
              {currentStep === totalSteps - 1 ? (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Selesai Memasak 🎉</span>
                </>
              ) : (
                <>
                  <span>Langkah Berikutnya</span>
                  <ChevronRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
