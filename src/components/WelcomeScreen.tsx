import React from 'react';
import { Compass, Sparkles, CompassIcon, ArrowRight, ShieldCheck, HeartHandshake } from 'lucide-react';

interface WelcomeScreenProps {
  onGetStarted: () => void;
  onQuickDemoLogin: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  onGetStarted,
  onQuickDemoLogin,
}) => {
  return (
    <div className="min-h-[85vh] flex flex-col justify-center items-center px-4 py-8 text-center max-w-xl mx-auto">
      {/* Compass Icon Badge */}
      <div className="relative mb-6">
        <div className="absolute -inset-1 rounded-3xl bg-[#F2AF29] blur-lg opacity-30 animate-pulse"></div>
        <div className="relative w-20 h-20 rounded-2xl bg-[#0B0D17] border border-[#F2AF29]/40 flex items-center justify-center text-[#F2AF29] shadow-2xl shadow-[#F2AF29]/20">
          <Compass className="w-11 h-11 stroke-[2.2]" />
        </div>
      </div>

      {/* App Name & Tagline */}
      <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight mb-2">
        Guidance for 3 billion
      </h1>
      <p className="text-lg sm:text-xl font-semibold text-[#F2AF29] mb-8 max-w-md leading-relaxed">
        The map we wish we had.
      </p>

      {/* 3 Pillars Card */}
      <div className="w-full bg-[#1C1F37] border border-white/10 rounded-3xl p-6 sm:p-7 mb-8 shadow-2xl space-y-4">
        <div className="flex items-center gap-3 text-left">
          <div className="w-8 h-8 rounded-full bg-[#0B0D17] border border-[#F2AF29]/30 flex items-center justify-center text-[#F2AF29] shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="text-slate-200 font-medium text-base">
            Discover your strengths.
          </span>
        </div>

        <div className="w-full h-px bg-white/5"></div>

        <div className="flex items-center gap-3 text-left">
          <div className="w-8 h-8 rounded-full bg-[#0B0D17] border border-[#F2AF29]/30 flex items-center justify-center text-[#F2AF29] shrink-0">
            <CompassIcon className="w-4 h-4" />
          </div>
          <span className="text-slate-200 font-medium text-base">
            Explore your possibilities.
          </span>
        </div>

        <div className="w-full h-px bg-white/5"></div>

        <div className="flex items-center gap-3 text-left">
          <div className="w-8 h-8 rounded-full bg-[#0B0D17] border border-[#F2AF29]/30 flex items-center justify-center text-[#F2AF29] shrink-0">
            <HeartHandshake className="w-4 h-4" />
          </div>
          <span className="text-slate-200 font-medium text-base">
            Build your future.
          </span>
        </div>
      </div>

      {/* Get Started Button */}
      <button
        onClick={onGetStarted}
        className="w-full py-4 px-8 rounded-2xl bg-[#F2AF29] hover:bg-[#e09e1e] text-[#0B0D17] font-bold text-base uppercase tracking-wider shadow-xl shadow-[#F2AF29]/20 transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 group cursor-pointer mb-4"
      >
        <span>Get Started</span>
        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
      </button>

      {/* Quick Demo Option */}
      <button
        onClick={onQuickDemoLogin}
        className="text-xs text-slate-400 hover:text-[#F2AF29] underline underline-offset-4 transition-colors cursor-pointer"
      >
        Or try instant demo account (Alex, age 16)
      </button>

      {/* Reassurance footnote */}
      <div className="mt-8 flex items-center justify-center gap-1.5 text-xs text-slate-500">
        <ShieldCheck className="w-3.5 h-3.5 text-[#F2AF29]" />
        <span>No upfront commitment • A supportive guide, not a test</span>
      </div>
    </div>
  );
};
