import React, { useEffect } from 'react';
import { Award, Sparkles, X } from 'lucide-react';

interface AchievementToastProps {
  title: string;
  description: string;
  onClose: () => void;
}

export const AchievementToast: React.FC<AchievementToastProps> = ({
  title,
  description,
  onClose,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-20 right-4 z-50 max-w-sm bg-[#1C1F37] border border-[#F2AF29]/50 rounded-2xl p-4 shadow-2xl animate-fade-in flex items-start gap-3 backdrop-blur-md">
      <div className="w-10 h-10 rounded-xl bg-[#0B0D17] border border-[#F2AF29] flex items-center justify-center text-[#F2AF29] shrink-0 shadow-lg">
        <Award className="w-5 h-5 animate-bounce" />
      </div>

      <div className="flex-1 pr-2">
        <div className="flex items-center gap-1.5">
          <span className="text-[9px] font-bold uppercase tracking-widest text-[#F2AF29]">
            Achievement Unlocked!
          </span>
          <Sparkles className="w-3 h-3 text-[#F2AF29]" />
        </div>
        <h4 className="text-sm font-bold text-white mt-0.5">
          {title}
        </h4>
        <p className="text-[11px] text-slate-300 leading-tight mt-1 opacity-90">
          {description}
        </p>
      </div>

      <button
        onClick={onClose}
        className="p-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
