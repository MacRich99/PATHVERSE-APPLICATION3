import React, { useState } from 'react';
import { X, Award, Check, Users, Sparkles, Heart, ShieldCheck, DollarSign, Compass, Rocket, Globe, Star } from 'lucide-react';
import { UserProfile } from '../types';
import { FIELDS_OF_STUDY, AVAILABLE_YEAR_BADGES, INITIAL_YEAR_COHORTS } from '../data/yearBadges';

interface YearBadgeModalProps {
  user: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onJoinYearBadge: (yearBadge: string, fieldOfStudy: string) => void;
}

export const YearBadgeModal: React.FC<YearBadgeModalProps> = ({
  user,
  isOpen,
  onClose,
  onJoinYearBadge,
}) => {
  const [selectedYear, setSelectedYear] = useState<string>(user.yearBadge ? user.yearBadge.replace('Class of ', '').replace('League of ', '').replace(' Badge', '').replace(' Cohort', '') : '2026');
  const [selectedField, setSelectedField] = useState<string>(user.fieldOfStudy || 'Tech & AI');
  const [isSuccessMessage, setIsSuccessMessage] = useState<boolean>(false);

  if (!isOpen) return null;

  const currentBadgeTitle = `League of ${selectedYear} ${selectedField !== 'All Fields' ? selectedField : ''} Badge`.trim();

  const handleConfirmJoin = () => {
    onJoinYearBadge(`League of ${selectedYear}`, selectedField);
    setIsSuccessMessage(true);
    setTimeout(() => {
      setIsSuccessMessage(false);
      onClose();
    }, 1200);
  };

  const getFieldIcon = (field: string) => {
    switch (field) {
      case 'Tech & AI':
        return <Sparkles className="w-4 h-4 text-[#F2AF29]" />;
      case 'Healthcare & Nursing':
        return <Heart className="w-4 h-4 text-rose-400" />;
      case 'Business & Finance':
        return <DollarSign className="w-4 h-4 text-emerald-400" />;
      case 'Law & Public Policy':
        return <ShieldCheck className="w-4 h-4 text-indigo-400" />;
      case 'Design & Creative Arts':
        return <Compass className="w-4 h-4 text-purple-400" />;
      case 'Science & Engineering':
        return <Rocket className="w-4 h-4 text-cyan-400" />;
      case 'Psychology & Wellness':
        return <Users className="w-4 h-4 text-amber-400" />;
      default:
        return <Globe className="w-4 h-4 text-[#F2AF29]" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B0D17]/90 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-xl bg-[#1C1F37] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] flex flex-col overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-[#0B0D17] border border-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer z-10"
        >
          <X className="w-5 h-5 text-[#F2AF29]" />
        </button>

        {/* Modal Title Banner */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#0B0D17] border border-[#F2AF29] flex items-center justify-center text-[#F2AF29] shadow-lg shadow-[#F2AF29]/10 shrink-0">
            <Award className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#F2AF29] bg-[#F2AF29]/10 px-2 py-0.5 rounded-full border border-[#F2AF29]/30">
                Global Cohort Network
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white mt-0.5">
              Join a Year Badge Cohort
            </h2>
            <p className="text-xs text-slate-300 opacity-80">
              Connect with fellow learners across all fields of study graduating or targeting the same milestone year.
            </p>
          </div>
        </div>

        {/* Success Confirmation Toast */}
        {isSuccessMessage && (
          <div className="bg-emerald-950/80 border border-emerald-500/50 rounded-2xl p-4 text-center text-emerald-300 text-xs font-bold flex items-center justify-center gap-2 animate-bounce">
            <Check className="w-5 h-5 text-emerald-400" />
            <span>Successfully joined the {currentBadgeTitle}!</span>
          </div>
        )}

        <div className="space-y-5 overflow-y-auto pr-1">
          {/* Step 1: Select Graduation / Target Year */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
              <Star className="w-3.5 h-3.5 text-[#F2AF29]" />
              <span>1. Choose Target / Graduation Year Badge</span>
            </label>
            <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5">
              {AVAILABLE_YEAR_BADGES.map((b) => {
                const isSelected = selectedYear === b.year;
                return (
                  <button
                    key={b.year}
                    onClick={() => setSelectedYear(b.year)}
                    className={`py-2 px-1 rounded-xl text-xs font-bold transition-all cursor-pointer border flex flex-col items-center justify-center ${
                      isSelected
                        ? 'bg-[#F2AF29] border-[#F2AF29] text-[#0B0D17] shadow-lg shadow-[#F2AF29]/20'
                        : 'bg-[#0B0D17] border-white/10 text-slate-300 hover:border-white/30 hover:text-white'
                    }`}
                  >
                    <span className="text-[9px] uppercase opacity-70">League of</span>
                    <span className="text-sm font-black font-mono">{b.year}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2: Select Field of Study */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-[#F2AF29]" />
              <span>2. Select Field of Study</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {FIELDS_OF_STUDY.map((field) => {
                const isSelected = selectedField === field;
                return (
                  <button
                    key={field}
                    onClick={() => setSelectedField(field)}
                    className={`p-2.5 rounded-2xl text-left border transition-all cursor-pointer flex items-center gap-2 ${
                      isSelected
                        ? 'bg-[#1C1F37] border-[#F2AF29] text-white shadow-md'
                        : 'bg-[#0B0D17] border-white/10 text-slate-400 hover:text-slate-200 hover:border-white/20'
                    }`}
                  >
                    <div className="shrink-0">{getFieldIcon(field)}</div>
                    <span className="text-xs font-medium leading-tight truncate">{field}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Live Preview Badge Card */}
          <div className="bg-[#0B0D17] border-2 border-[#F2AF29]/60 rounded-3xl p-5 relative overflow-hidden shadow-2xl space-y-3">
            <div className="absolute top-0 right-0 transform translate-x-4 -translate-y-4 w-28 h-28 bg-[#F2AF29]/10 rounded-full blur-2xl pointer-events-none"></div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#1C1F37] border-2 border-[#F2AF29] flex items-center justify-center text-[#F2AF29] font-serif font-bold text-xl shadow-lg">
                  {selectedYear.slice(-2)}
                </div>
                <div>
                  <span className="text-[9px] uppercase tracking-widest font-bold text-[#F2AF29]">Official Year Badge</span>
                  <h3 className="text-base font-bold text-white leading-tight">{currentBadgeTitle}</h3>
                  <p className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1">
                    <Users className="w-3 h-3 text-[#F2AF29]" />
                    <span>Join 1,200+ global learners in this cohort</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t border-white/10 pt-3 flex items-center justify-between text-[11px] text-slate-300">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                <span>Active Cohort Study Groups</span>
              </div>
              <span className="font-mono text-[#F2AF29] font-bold text-xs">All Fields Welcome</span>
            </div>
          </div>
        </div>

        {/* Modal Action Buttons */}
        <div className="pt-2 border-t border-white/10 flex items-center gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-2xl bg-[#0B0D17] border border-white/10 text-slate-400 hover:text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirmJoin}
            className="flex-1 py-3 rounded-2xl bg-[#F2AF29] hover:bg-[#e09e1e] text-[#0B0D17] font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-[#F2AF29]/20"
          >
            <Award className="w-4 h-4" />
            <span>Join Year Badge Cohort</span>
          </button>
        </div>
      </div>
    </div>
  );
};
