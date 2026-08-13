import React, { useState, useRef } from 'react';
import { X, User, MapPin, Compass, Sparkles, Rocket, CheckCircle2, Globe, Award, LogOut, RotateCcw, ShieldCheck, Heart, Info, Camera, Upload } from 'lucide-react';
import { UserProfile, DiscoveryResult, PathJourney } from '../types';
import { getComputedAchievements } from '../data/achievements';

interface ProfileModalProps {
  user: UserProfile;
  discoveryResult?: DiscoveryResult | null;
  activeJourney?: PathJourney | null;
  isOpen: boolean;
  onClose: () => void;
  onRedoOnboarding: () => void;
  onSignOut: () => void;
  onUnlockAchievement?: (achievementId: string) => void;
  onOpenYearModal?: () => void;
  onUpdateAvatar?: (avatarUrl: string) => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  user,
  discoveryResult = null,
  activeJourney = null,
  isOpen,
  onClose,
  onRedoOnboarding,
  onSignOut,
  onUnlockAchievement,
  onOpenYearModal,
  onUpdateAvatar,
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'achievements' | 'mission'>('profile');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be under 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        if (result && onUpdateAvatar) {
          onUpdateAvatar(result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const achievements = getComputedAchievements(user, discoveryResult, activeJourney);
  const unlockedCount = achievements.filter((a) => a.unlocked).length;
  const totalCount = achievements.length;
  const badgePercent = Math.round((unlockedCount / totalCount) * 100);

  const getBadgeIcon = (iconName: string, unlocked: boolean) => {
    const iconClass = unlocked ? 'text-[#F2AF29]' : 'text-slate-600';
    switch (iconName) {
      case 'Compass':
        return <Compass className={`w-5 h-5 ${iconClass}`} />;
      case 'Sparkles':
        return <Sparkles className={`w-5 h-5 ${iconClass}`} />;
      case 'Rocket':
        return <Rocket className={`w-5 h-5 ${iconClass}`} />;
      case 'CheckCircle2':
        return <CheckCircle2 className={`w-5 h-5 ${iconClass}`} />;
      case 'Globe':
        return <Globe className={`w-5 h-5 ${iconClass}`} />;
      case 'Award':
      default:
        return <Award className={`w-5 h-5 ${iconClass}`} />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B0D17]/90 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-[#1C1F37] border border-white/10 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-5 max-h-[90vh] flex flex-col overflow-hidden">
        {/* Hidden Image Input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageChange}
          accept="image/*"
          className="hidden"
        />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-[#0B0D17] border border-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer z-10"
        >
          <X className="w-5 h-5 text-[#F2AF29]" />
        </button>

        {/* User Header */}
        <div className="flex items-center gap-4 pt-1">
          <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
            <div className={`w-16 h-16 rounded-2xl bg-[#0B0D17] border font-bold text-2xl flex items-center justify-center shadow-lg shrink-0 overflow-hidden ${
              user.role === 'admin' ? 'border-emerald-400 text-emerald-400' : 'border-[#F2AF29]/40 text-[#F2AF29]'
            }`}>
              {user.avatarUrl ? (
                <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                user.name.charAt(0).toUpperCase()
              )}
            </div>
            <div className="absolute inset-0 bg-black/60 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera className="w-5 h-5 text-[#F2AF29]" />
            </div>
            <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#F2AF29] text-[#0B0D17] flex items-center justify-center text-[10px] shadow">
              <Upload className="w-3 h-3 stroke-[3]" />
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold text-white">{user.name}</h3>
              {user.role === 'admin' ? (
                <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 text-[9px] font-bold uppercase tracking-wider flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  <span>Admin</span>
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-md bg-[#F2AF29]/10 border border-[#F2AF29]/30 text-[#F2AF29] text-[9px] font-bold uppercase tracking-wider">
                  Learner User
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 font-mono">{user.email}</p>
            <div className="flex flex-wrap items-center gap-2 mt-1">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="text-[10px] text-[#F2AF29] hover:underline font-bold flex items-center gap-1 cursor-pointer"
              >
                <Camera className="w-3 h-3" />
                <span>Upload Profile Picture</span>
              </button>
            </div>
          </div>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="grid grid-cols-3 bg-[#0B0D17] p-1.5 rounded-2xl border border-white/10 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('profile')}
            className={`py-2 rounded-xl transition-all uppercase tracking-wider text-[11px] cursor-pointer ${
              activeTab === 'profile'
                ? 'bg-[#F2AF29] text-[#0B0D17] font-bold shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Profile
          </button>
          <button
            onClick={() => setActiveTab('achievements')}
            className={`py-2 rounded-xl transition-all uppercase tracking-wider text-[11px] cursor-pointer flex items-center justify-center gap-1 ${
              activeTab === 'achievements'
                ? 'bg-[#F2AF29] text-[#0B0D17] font-bold shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Badges ({unlockedCount})</span>
          </button>
          <button
            onClick={() => setActiveTab('mission')}
            className={`py-2 rounded-xl transition-all uppercase tracking-wider text-[11px] cursor-pointer flex items-center justify-center gap-1 ${
              activeTab === 'mission'
                ? 'bg-[#F2AF29] text-[#0B0D17] font-bold shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Our Mission</span>
          </button>
        </div>

        {/* Tab 1: Profile Summary */}
        {activeTab === 'profile' && (
          <div className="bg-[#0B0D17] p-4 rounded-2xl border border-white/5 space-y-3 text-xs overflow-y-auto">
            {/* Year Badge Cohort Highlight */}
            <div className="p-3 bg-[#1C1F37] border border-[#F2AF29]/40 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-[#F2AF29] uppercase tracking-widest font-bold text-[9px] block">Official Year Cohort Badge</span>
                <span className="text-white font-bold text-xs">{user.yearBadge ? user.yearBadge.replace('Class of', 'League of') : 'League of 2026'} • {user.fieldOfStudy || 'Tech & AI'}</span>
              </div>
              {onOpenYearModal && (
                <button
                  onClick={onOpenYearModal}
                  className="px-2.5 py-1 rounded-lg bg-[#F2AF29] text-[#0B0D17] text-[10px] font-bold uppercase tracking-wider hover:bg-[#e09e1e] transition-all cursor-pointer"
                >
                  Join / Switch
                </button>
              )}
            </div>

            <div>
              <span className="text-slate-500 uppercase tracking-widest font-bold text-[9px] block mb-0.5">Current Stage</span>
              <span className="text-slate-200 font-medium">{user.stage}</span>
            </div>

            <div>
              <span className="text-slate-500 uppercase tracking-widest font-bold text-[9px] block mb-0.5">Key Interests</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {(user?.interests || []).map((i, idx) => (
                  <span key={idx} className="px-2 py-0.5 rounded-md bg-[#1C1F37] text-slate-300 text-[10px] border border-white/5">
                    {i}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <span className="text-slate-500 uppercase tracking-widest font-bold text-[9px] block mb-0.5">Things Enjoyed</span>
              <p className="text-slate-300 italic text-[11px] leading-relaxed">
                "{user.enjoyText}"
              </p>
            </div>

            <div>
              <span className="text-slate-500 uppercase tracking-widest font-bold text-[9px] block mb-0.5">Future Goals</span>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                {user.futureGoals}
              </p>
            </div>
          </div>
        )}

        {/* Tab 2: Achievements & Badges */}
        {activeTab === 'achievements' && (
          <div className="space-y-3 overflow-y-auto pr-1">
            {/* Progress Header */}
            <div className="bg-[#0B0D17] p-3.5 rounded-2xl border border-white/10 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-white">
                <span className="text-slate-300 uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-[#F2AF29]" />
                  <span>Achievement Unlocks</span>
                </span>
                <span className="text-[#F2AF29] font-mono text-xs">{unlockedCount} / {totalCount} Badges ({badgePercent}%)</span>
              </div>
              <div className="w-full bg-[#1C1F37] h-2 rounded-full overflow-hidden border border-white/5">
                <div
                  className="bg-[#F2AF29] h-full rounded-full transition-all duration-500"
                  style={{ width: `${badgePercent}%` }}
                ></div>
              </div>
            </div>

            {/* Badges Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {achievements.map((ach) => (
                <div
                  key={ach.id}
                  className={`p-3 rounded-2xl border transition-all flex items-start gap-3 ${
                    ach.unlocked
                      ? 'bg-[#0B0D17] border-[#F2AF29]/40 shadow-md'
                      : 'bg-[#0B0D17]/50 border-white/5 opacity-60'
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                      ach.unlocked
                        ? 'bg-[#1C1F37] border border-[#F2AF29]/40 text-[#F2AF29]'
                        : 'bg-slate-900 border border-slate-800 text-slate-600'
                    }`}
                  >
                    {getBadgeIcon(ach.icon, ach.unlocked)}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className={`text-xs font-bold ${ach.unlocked ? 'text-white' : 'text-slate-400'}`}>
                        {ach.title}
                      </span>
                      {ach.unlocked && (
                        <span className="px-1.5 py-0.2 text-[8px] uppercase tracking-wider rounded bg-[#F2AF29]/20 text-[#F2AF29] font-bold">
                          Unlocked
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-slate-400 leading-tight mt-1">
                      {ach.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Our Global Mission */}
        {activeTab === 'mission' && (
          <div className="bg-[#0B0D17] p-4.5 rounded-2xl border border-white/10 space-y-4 text-xs overflow-y-auto">
            <div className="border-b border-white/10 pb-3">
              <span className="text-[10px] uppercase font-bold text-[#F2AF29] tracking-widest block mb-1">
                Why PathVerse Exists
              </span>
              <h4 className="text-lg font-bold text-white">
                Solving a Global & Generational Career Gap
              </h4>
            </div>

            <div className="space-y-3 text-[11px] text-slate-300 leading-relaxed">
              <div className="p-3 rounded-xl bg-[#1C1F37] border border-white/5 space-y-1">
                <span className="text-[#F2AF29] font-bold uppercase tracking-wider text-[10px] block">
                  1. The Global Challenge
                </span>
                <p>
                  250 million young people worldwide are out of school. Billions more are in classrooms but receive zero guidance. <strong className="text-white font-medium">"What should I do with my life?"</strong> is the #1 unanswered question for youth age 12–22 everywhere.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-[#1C1F37] border border-white/5 space-y-1">
                <span className="text-[#F2AF29] font-bold uppercase tracking-wider text-[10px] block">
                  2. The Generational Shift
                </span>
                <p>
                  Previous generations had 5 standard career options. Today's youth face over 5,000 choices — yet zero navigation. Without a map, vast human talent gets wasted. PathVerse provides that navigation map.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-[#1C1F37] border border-white/5 space-y-1">
                <span className="text-[#F2AF29] font-bold uppercase tracking-wider text-[10px] block">
                  3. The AI Breakthrough
                </span>
                <p>
                  Before Gemini AI, serving all youth required 10,000,000 human career counselors. Now, 1 AI mentor can guide millions of youth globally — in English, Spanish, Twi, Hindi, and more — for free.
                </p>
              </div>
            </div>

            {/* Claim Badge Button */}
            {onUnlockAchievement && !user.unlockedAchievementIds?.includes('global_visionary') && (
              <button
                onClick={() => onUnlockAchievement('global_visionary')}
                className="w-full py-2.5 rounded-xl bg-[#F2AF29] hover:bg-[#e09e1e] text-[#0B0D17] font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <Award className="w-4 h-4" />
                <span>Claim 'Global Visionary' Badge</span>
              </button>
            )}
          </div>
        )}

        {/* Actions Footer */}
        <div className="space-y-2 pt-1 border-t border-white/10">
          <button
            onClick={onRedoOnboarding}
            className="w-full py-3 rounded-2xl bg-[#0B0D17] border border-white/10 hover:border-white/20 text-[#F2AF29] font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4 text-[#F2AF29]" />
            <span>Update Onboarding Profile</span>
          </button>

          <button
            onClick={onSignOut}
            className="w-full py-3 rounded-2xl bg-rose-950/40 border border-rose-900/60 hover:bg-rose-900/60 text-rose-300 font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};

