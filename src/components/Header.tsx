import React from 'react';
import { Compass, User, DollarSign, Users, Award, Sparkles, RefreshCw, Bell } from 'lucide-react';
import { UserProfile } from '../types';

interface HeaderProps {
  user: UserProfile | null;
  activeTab: 'home' | 'discovery' | 'lifeGps' | 'community' | 'contacts';
  setActiveTab: (tab: 'home' | 'discovery' | 'lifeGps' | 'community' | 'contacts') => void;
  onOpenRevenueReport: () => void;
  onOpenProfile: () => void;
  onOpenMentor?: () => void;
  onOpenNotifications?: () => void;
  unreadNotificationCount?: number;
  onSignOut: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  activeTab,
  setActiveTab,
  onOpenRevenueReport,
  onOpenProfile,
  onOpenMentor,
  onOpenNotifications,
  unreadNotificationCount = 0,
  onSignOut,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#0B0D17]/90 backdrop-blur-md border-b border-white/10 px-4 py-3.5">
      <div className="w-full max-w-6xl mx-auto flex items-center justify-between">
        {/* Logo and Tagline (Shown on mobile or when no sidebar) */}
        <button
          onClick={() => setActiveTab('home')}
          className="flex md:hidden items-center gap-3 text-left focus:outline-none group cursor-pointer"
        >
          <div className="w-10 h-10 rounded-2xl bg-[#1C1F37] border border-[#F2AF29] flex items-center justify-center text-[#F2AF29] shadow-lg shadow-[#F2AF29]/10 group-hover:scale-105 transition-transform">
            <Compass className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-[#F2AF29]">
                PathVerse
              </h1>
              <span className="text-[9px] font-bold uppercase tracking-wider text-[#F2AF29] bg-[#F2AF29]/10 px-2 py-0.5 rounded-full border border-[#F2AF29]/30">
                Gemini XPRIZE
              </span>
            </div>
            <p className="text-[10px] opacity-80 uppercase tracking-widest font-semibold text-slate-300">
              Guidance for 3 billion • The map we wish we had.
            </p>
          </div>
        </button>

        {/* Desktop Screen Title / Workspace Indicator (Shown on desktop) */}
        <div className="hidden md:flex items-center justify-between w-full">
          <div>
            <h2 className="text-base font-bold text-white capitalize flex items-center gap-2">
              <span>
                {activeTab === 'home' && 'Dashboard Overview'}
                {activeTab === 'discovery' && 'Career Path Discovery'}
                {activeTab === 'lifeGps' && 'Life GPS Route Navigator'}
                {activeTab === 'community' && 'Global Learner Network'}
                {activeTab === 'contacts' && 'Google Contacts Network'}
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#1C1F37] border border-white/10 text-[#F2AF29]">
                Stress-Free Learning
              </span>
            </h2>
            <p className="text-[11px] text-slate-400">
              {activeTab === 'home' && 'Track your active courses, daily momentum, and personalized learning milestones.'}
              {activeTab === 'discovery' && 'Discover matching careers and AI-crafted learning paths tailored to your interests.'}
              {activeTab === 'lifeGps' && 'Navigate step-by-step milestones to achieve your long-term career goals.'}
              {activeTab === 'community' && 'Connect, share achievements, and collaborate with learners across all fields of study.'}
              {activeTab === 'contacts' && 'Sync, manage, and invite your personal Google Contacts to build your study mentor network.'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Notifications Trigger */}
            {onOpenNotifications && (
              <button
                onClick={onOpenNotifications}
                className="relative p-2 rounded-xl bg-[#1C1F37] border border-white/10 hover:border-[#F2AF29]/40 text-slate-300 hover:text-white transition-colors cursor-pointer"
                title="Progress Notifications & Reminders"
              >
                <Bell className="w-5 h-5 text-[#F2AF29]" />
                {unreadNotificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#F2AF29] text-[#0B0D17] text-[9px] font-black flex items-center justify-center">
                    {unreadNotificationCount}
                  </span>
                )}
              </button>
            )}

            {/* Quick Profile Trigger for Desktop */}
            {user && (
              <div
                onClick={onOpenProfile}
                className={`flex items-center gap-2 border rounded-xl px-3 py-1.5 transition-colors cursor-pointer ${
                  user.role === 'admin'
                    ? 'bg-emerald-950/40 border-emerald-500/50 hover:border-emerald-400'
                    : 'bg-[#1C1F37] border-white/10 hover:border-[#F2AF29]/40'
                }`}
              >
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold overflow-hidden shrink-0 ${
                  user.role === 'admin' ? 'bg-emerald-400 text-[#0B0D17]' : 'bg-[#F2AF29] text-[#0B0D17]'
                }`}>
                  {user.avatarUrl ? (
                    <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    user.name.charAt(0).toUpperCase()
                  )}
                </div>
                <div className="text-left leading-none">
                  <div className="flex items-center gap-1.5">
                    <p className="text-xs font-bold text-white">{user.name}</p>
                    {user.role === 'admin' && (
                      <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-1.5 py-0.2 rounded text-[8px] font-bold uppercase tracking-wider">
                        ADMIN
                      </span>
                    )}
                  </div>
                  <p className="text-[9px] text-[#F2AF29] font-medium">{(user.yearBadge ? user.yearBadge.replace('Class of', 'League of') : 'League of 2026')} • {user.stageLevel}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation & Actions (Shown on mobile when sidebar is hidden) */}
        {user ? (
          <div className="flex md:hidden items-center justify-end w-full gap-2">
            {/* AI Mentor Button Mobile */}
            {onOpenMentor && (
              <button
                onClick={onOpenMentor}
                title="Ask Gemini AI Mentor"
                className="p-2 rounded-xl bg-[#1C1F37] border border-[#F2AF29]/50 text-[#F2AF29] hover:bg-[#F2AF29] hover:text-[#0B0D17] transition-all flex items-center gap-1.5 text-xs font-bold cursor-pointer shadow-md"
              >
                <Sparkles className="w-4 h-4 text-[#F2AF29]" />
                <span className="text-[11px]">Mentor</span>
              </button>
            )}

            {/* Avatar Button Mobile */}
            <button
              onClick={onOpenProfile}
              className="w-9 h-9 rounded-full bg-[#1C1F37] border border-[#F2AF29] flex items-center justify-center text-sm font-bold text-white hover:bg-[#1C1F37]/80 transition-colors cursor-pointer shadow-md shrink-0 overflow-hidden"
              title="Profile & Settings"
            >
              {user.avatarUrl ? (
                <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                user.name.charAt(0).toUpperCase()
              )}
            </button>
          </div>
        ) : (
          <button
            onClick={onOpenRevenueReport}
            className="flex md:hidden px-3.5 py-1.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 text-xs font-semibold items-center gap-1.5 hover:bg-emerald-900/60 transition-colors cursor-pointer"
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>Revenue Evidence</span>
          </button>
        )}
      </div>
    </header>
  );
};

