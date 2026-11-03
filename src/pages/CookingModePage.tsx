import React, { useState } from 'react';
import { ArrowLeft, Play, RotateCcw, Sparkles, ChevronLeft, ChevronRight, CheckCircle2, Clock } from 'lucide-react';
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
    <div className="max-w-[1600px] w-full mx-auto px-4 sm:px-8 xl:px-12 pt-4 pb-20 animate-in fade-in duration-200">
      {/* Top Bar Navigation */}
      <div className="flex items-center justify-between py-3 mb-6">
        <button 
          onClick={onBack}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white border border-stone-200 text-stone-700 hover:bg-stone-50 text-sm font-bold shadow-sm transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-brand-600" />
          <span>Kembali ke Detail Resep</span>
        </button>

        <div className="text-right">
          <span className="text-xs text-stone-400 font-bold block">Sedang Memasak:</span>
          <span className="text-sm font-extrabold text-stone-800 truncate max-w-xs block">
            {recipe.title}
          </span>
        </div>
      </div>

      {/* Main Container - Full Desktop Split Layout */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-xl overflow-hidden">
        {/* Top Header Banner */}
        <div className="bg-gradient-to-r from-brand-600 to-amber-500 text-white p-6 sm:p-8 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-2xl bg-white/20 shadow-inner">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-black">{recipe.title}</h2>
            </div>
          </div>
          <span className="bg-white/20 backdrop-blur-md px-5 py-2 rounded-2xl text-sm font-black shadow-sm">
            Langkah {currentStep + 1} dari {totalSteps}
          </span>
        </div>

        {/* Progress Bar Visual */}
        <div className="w-full bg-stone-100 h-2.5 overflow-hidden">
          <div 
            className="bg-brand-500 h-full transition-all duration-300"
            style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
          />
        </div>

        {/* Split Layout: Desktop 2 Kolom Seimbang */}
        <div className="p-6 sm:p-12 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Sisi Kiri: Instruksi Langkah Besar (Desktop: 7 dari 12 Kolom) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-50 text-brand-700 text-xs sm:text-sm font-black">
              Langkah Aktif #{currentStep + 1}
            </div>

            <div className="p-8 sm:p-10 bg-stone-50 rounded-3xl border border-stone-200 shadow-inner min-h-[220px] flex items-center">
              <p className="text-2xl sm:text-4xl font-black text-stone-900 leading-relaxed">
                "{stepsList[currentStep]}"
              </p>
            </div>

            {/* Step Navigation Controls */}
            <div className="flex items-center gap-4 pt-4">
              <button 
                onClick={handlePrev}
                disabled={currentStep === 0}
                className="flex items-center gap-2 px-6 py-4 rounded-2xl border border-stone-200 text-stone-700 text-sm font-bold hover:bg-stone-50 disabled:opacity-30 disabled:pointer-events-none cursor-pointer transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
                <span>Langkah Sebelumnya</span>
              </button>

              <button 
                onClick={handleNext}
                className="flex-1 flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-brand-500 hover:bg-brand-600 text-white text-sm font-black shadow-lg shadow-brand-500/25 cursor-pointer active:scale-95 transition-all"
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

          {/* Sisi Kanan: Timer Dapur & Mini Overview Langkah (Desktop: 5 dari 12 Kolom) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Timer Dapur Digital */}
            <div className="bg-gradient-to-br from-stone-900 to-stone-800 text-white rounded-3xl p-8 text-center shadow-xl border border-stone-700">
              <span className="block text-xs font-bold text-stone-400 uppercase tracking-wider mb-2 flex items-center justify-center gap-1.5">
                <Clock className="w-4 h-4 text-brand-400" /> Timer Dapur Digital
              </span>
              <div className="text-5xl sm:text-6xl font-black text-white tracking-widest font-mono my-4">
                {timeFormatted}
              </div>
              <div className="flex items-center justify-center gap-3 pt-2">
                <button 
                  onClick={() => setIsTimerRunning(!isTimerRunning)} 
                  className="px-6 py-3 rounded-2xl bg-brand-500 hover:bg-brand-600 active:scale-95 text-white font-black text-sm shadow-md shadow-brand-500/25 cursor-pointer flex items-center gap-2"
                >
                  <Play className="w-4 h-4" />
                  <span>{isTimerRunning ? 'Jeda Timer' : 'Mulai Timer'}</span>
                </button>
                <button 
                  onClick={() => {
                    setIsTimerRunning(false);
                    setTimerSeconds(300);
                  }} 
                  className="px-5 py-3 rounded-2xl bg-stone-800 hover:bg-stone-700 border border-stone-600 text-stone-300 font-bold text-sm cursor-pointer flex items-center gap-1.5 transition-colors"
                  title="Reset timer 5 menit"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Reset (5m)</span>
                </button>
              </div>
            </div>

            {/* Mini Roadmap Langkah */}
            <div className="bg-stone-50 rounded-3xl p-6 border border-stone-200">
              <span className="text-xs font-black text-stone-500 uppercase tracking-wider block mb-3">
                Daftar Semua Langkah:
              </span>
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {stepsList.map((st, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentStep(i)}
                    className={`w-full text-left p-3 rounded-xl text-xs font-semibold flex items-center gap-3 transition-colors cursor-pointer ${
                      i === currentStep 
                        ? 'bg-brand-500 text-white shadow-sm' 
                        : 'bg-white hover:bg-stone-100 text-stone-700 border border-stone-200'
                    }`}
                  >
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black flex-shrink-0 ${
                      i === currentStep ? 'bg-white text-brand-600' : 'bg-stone-200 text-stone-600'
                    }`}>
                      {i + 1}
                    </span>
                    <span className="truncate">{st}</span>
                  </button>
                ))}
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
