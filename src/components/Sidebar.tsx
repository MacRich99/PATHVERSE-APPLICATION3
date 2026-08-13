import React from 'react';
import {
  LayoutDashboard,
  Compass,
  Navigation,
  GraduationCap,
  Users,
  Sparkles,
  DollarSign,
  User,
  LogOut,
  Award,
  ShieldCheck,
  BookUser,
} from 'lucide-react';
import { UserProfile } from '../types';

interface SidebarProps {
  user: UserProfile;
  activeTab: 'home' | 'discovery' | 'lifeGps' | 'community' | 'contacts';
  setActiveTab: (tab: 'home' | 'discovery' | 'lifeGps' | 'community' | 'contacts') => void;
  onOpenRevenueReport: () => void;
  onOpenProfile: () => void;
  onOpenMentor: () => void;
  onSignOut: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  user,
  activeTab,
  setActiveTab,
  onOpenRevenueReport,
  onOpenProfile,
  onOpenMentor,
  onSignOut,
}) => {
  const navItems = [
    {
      id: 'home' as const,
      label: 'Dashboard',
      icon: LayoutDashboard,
      description: 'Your Stress-Free Hub',
    },
    {
      id: 'discovery' as const,
      label: 'Discovery',
      icon: Compass,
      description: 'Find Your Perfect Field',
    },
    {
      id: 'lifeGps' as const,
      label: 'Life GPS',
      icon: Navigation,
      description: 'Step-by-Step Guidance',
    },
    {
      id: 'community' as const,
      label: 'Community',
      icon: Users,
      description: 'Global Learner Network',
    },
    {
      id: 'contacts' as const,
      label: 'Google Contacts',
      icon: BookUser,
      description: 'Mentors & Network',
    },
  ];

  return (
    <aside className="w-64 lg:w-72 bg-[#121526] border-r border-white/10 flex-col justify-between hidden md:flex shrink-0 min-h-screen sticky top-0 h-screen overflow-y-auto">
      <div className="p-5 space-y-6">
        {/* Brand Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#1C1F37] border border-[#F2AF29] flex items-center justify-center text-[#F2AF29] shadow-lg shadow-[#F2AF29]/10 shrink-0">
            <Compass className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-lg font-bold tracking-tight text-[#F2AF29]">
                PathVerse
              </h1>
              <span className="text-[8px] font-bold uppercase tracking-wider text-[#F2AF29] bg-[#F2AF29]/10 px-1.5 py-0.5 rounded-full border border-[#F2AF29]/30">
                XPRIZE
              </span>
            </div>
            <p className="text-[9px] opacity-80 uppercase tracking-widest font-semibold text-[#F2AF29]">
              Guidance for 3 billion
            </p>
          </div>
        </div>

        {/* User Card */}
        <div
          onClick={onOpenProfile}
          className={`border rounded-2xl p-3.5 flex items-center justify-between transition-all cursor-pointer group ${
            user.role === 'admin'
              ? 'bg-emerald-950/30 border-emerald-500/50 hover:border-emerald-400'
              : 'bg-[#1C1F37] border-white/10 hover:border-[#F2AF29]/50'
          }`}
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className={`w-9 h-9 rounded-full flex items-center justify-center font-serif font-bold text-base shrink-0 ${
              user.role === 'admin' ? 'bg-emerald-400 text-[#0B0D17]' : 'bg-[#F2AF29] text-[#0B0D17]'
            }`}>
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <p className="text-xs font-bold text-white truncate group-hover:text-[#F2AF29] transition-colors">
                  {user.name}
                </p>
                {user.role === 'admin' && (
                  <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-1.5 py-0.2 rounded text-[8px] font-bold uppercase tracking-wider shrink-0">
                    ADMIN
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1.5 flex-wrap mt-0.5">
                <span className="text-[9px] text-[#F2AF29] font-bold bg-[#F2AF29]/10 border border-[#F2AF29]/30 px-1.5 py-0.2 rounded-full">
                  {(user.yearBadge ? user.yearBadge.replace('Class of', 'League of') : 'League of 2026')}
                </span>
                <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider truncate">
                  {user.stageLevel}
                </span>
              </div>
            </div>
          </div>
          {user.role === 'admin' ? (
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <Award className="w-4 h-4 text-[#F2AF29] opacity-70 group-hover:opacity-100 transition-opacity shrink-0" />
          )}
        </div>

        {/* Navigation Section */}
        <div className="space-y-1.5">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 mb-2">
            Left Dashboard Navigation
          </p>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-2xl transition-all cursor-pointer group text-left ${
                  isActive
                    ? 'bg-[#F2AF29] text-[#0B0D17] font-bold shadow-lg shadow-[#F2AF29]/20'
                    : 'text-slate-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                <div
                  className={`p-1.5 rounded-xl transition-colors ${
                    isActive
                      ? 'bg-[#0B0D17]/10 text-[#0B0D17]'
                      : 'bg-white/5 text-slate-400 group-hover:text-[#F2AF29]'
                  }`}
                >
                  <Icon className="w-4 h-4 stroke-[2.2]" />
                </div>
                <div>
                  <p className="text-xs font-bold leading-none">{item.label}</p>
                  <p
                    className={`text-[10px] mt-0.5 leading-tight ${
                      isActive ? 'text-[#0B0D17]/80 font-medium' : 'text-slate-500 group-hover:text-slate-400'
                    }`}
                  >
                    {item.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* AI Learning Tools Section */}
        <div className="space-y-2 pt-2 border-t border-white/5">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 mb-1">
            AI Studio Tools
          </p>

          <button
            onClick={onOpenMentor}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl bg-[#1C1F37] border border-[#F2AF29]/40 text-[#F2AF29] hover:bg-[#F2AF29] hover:text-[#0B0D17] transition-all cursor-pointer group text-left shadow-md"
          >
            <Sparkles className="w-4 h-4 text-[#F2AF29] group-hover:text-[#0B0D17] shrink-0" />
            <div>
              <p className="text-xs font-bold">Gemini AI Mentor</p>
              <p className="text-[10px] text-slate-400 group-hover:text-[#0B0D17]/80">24/7 Academic & Career Guide</p>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('lifeGps')}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl bg-[#1C1F37] border border-white/10 text-slate-200 hover:text-white hover:border-[#F2AF29] transition-all cursor-pointer group text-left shadow-md"
          >
            <Compass className="w-4 h-4 text-[#F2AF29] shrink-0" />
            <div>
              <p className="text-xs font-bold">Life GPS Navigator</p>
              <p className="text-[10px] text-slate-400">Step-by-Step Milestones</p>
            </div>
          </button>
        </div>
      </div>

      {/* Bottom Sidebar Footer */}
      <div className="p-4 border-t border-white/10 space-y-2.5">
        <button
          onClick={onOpenRevenueReport}
          className="w-full px-3 py-2 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 hover:bg-emerald-900/60 transition-colors flex items-center justify-between text-xs font-semibold cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-emerald-400" />
            <span>Revenue Report</span>
          </div>
          <span className="text-[10px] font-mono bg-emerald-500/20 px-1.5 py-0.5 rounded text-emerald-300">
            Hackathon
          </span>
        </button>

        <button
          onClick={onSignOut}
          className="w-full flex items-center gap-2 px-3 py-1.5 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors text-xs font-medium cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};
