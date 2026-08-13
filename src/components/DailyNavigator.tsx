import React from 'react';
import { Target, Flame, ArrowRight, CheckCircle2, BookOpen, Sparkles, Clock, ShieldCheck, Play, Award } from 'lucide-react';
import { UserProfile, PathJourney, LifeGpsStep, StepResource } from '../types';

interface DailyNavigatorProps {
  user: UserProfile;
  activeJourney: PathJourney | null;
  todayStep: LifeGpsStep | null;
  todayResource: StepResource | null;
  onOpenResource: (resource: StepResource) => void;
  onStartAssessment: (step: LifeGpsStep) => void;
  onNavigateLifeGps: () => void;
}

export const DailyNavigator: React.FC<DailyNavigatorProps> = ({
  user,
  activeJourney,
  todayStep,
  todayResource,
  onOpenResource,
  onStartAssessment,
  onNavigateLifeGps,
}) => {
  if (!activeJourney) {
    return null;
  }

  // Format career title for greeting e.g. "AI Application Specialist" -> "FUTURE AI APPLICATION SPECIALIST"
  const careerTag = activeJourney.pathTitle.toUpperCase();
  const streak = user.learningStreakDays || 1;

  // Calculate overall pathway progress
  const completedCount = activeJourney.steps.filter((s) => s.status === 'completed').length;
  const verifiedCount = (user.verifiedStepIds || []).length;
  const totalCount = activeJourney.steps.length;
  const progressPercent = Math.round((completedCount / totalCount) * 100);

  // Check if today's step is finished
  const isTodayStepVerified = todayStep && (user.verifiedStepIds || []).includes(todayStep.id);
  const isTodayStepCompleted = todayStep && (todayStep.status === 'completed' || (user.completedResourceIds || []).includes(todayResource?.id || ''));

  return (
    <div className="bg-[#1C1F37] border border-[#F2AF29]/40 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden space-y-6">
      {/* Background Subtle Gradient Glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#F2AF29]/5 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#F2AF29] mb-1">
            <Target className="w-4 h-4 text-[#F2AF29]" />
            <span>TODAY'S MISSION • WHAT SHOULD I DO TODAY?</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-white">
            HEY FUTURE {careerTag}! 🚀
          </h3>
        </div>

        {/* Streak & League Badge */}
        <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
          <div className="px-3 py-1.5 rounded-full bg-[#0B0D17] border border-[#F2AF29]/30 text-[#F2AF29] text-xs font-extrabold flex items-center gap-1.5 shadow-md">
            <Flame className="w-4 h-4 text-[#F2AF29] fill-[#F2AF29]" />
            <span>{streak} DAY STREAK</span>
          </div>

          <div className="px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>PathVerse Verified</span>
          </div>
        </div>
      </div>

      {/* Mission Body */}
      {todayStep ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-widest flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#F2AF29]" />
              <span>Step {todayStep.order} of {totalCount} ({todayStep.phase})</span>
            </span>
            <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-[#0B0D17] border border-white/10 text-[#F2AF29] font-mono">
              ~25 mins estimated
            </span>
          </div>

          <div>
            <h4 className="text-xl font-bold text-white mb-1">
              {todayStep.title}
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed opacity-90">
              {todayStep.description}
            </p>
          </div>

          {/* Today's Learning Resource Card */}
          {todayResource && (
            <div className="bg-[#0B0D17] border border-white/10 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-[#F2AF29]/50 transition-all">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#F2AF29]/10 border border-[#F2AF29]/30 flex items-center justify-center text-[#F2AF29] shrink-0">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">{todayResource.title}</span>
                    <span className="px-2 py-0.5 rounded bg-white/10 text-[9px] uppercase font-mono text-slate-300">
                      {todayResource.providerName}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Status:{' '}
                    <span className="font-bold text-[#F2AF29]">
                      {todayResource.status === 'not_started' && '○ Not Started'}
                      {todayResource.status === 'opened' && '⏳ Opened (In Progress)'}
                      {todayResource.status === 'completed' && '✓ Completed (User-Reported)'}
                      {todayResource.status === 'verified' && '🛡️ Verified'}
                      {todayResource.status === 'mastered' && '👑 Mastered'}
                    </span>
                  </p>
                </div>
              </div>

              <button
                onClick={() => onOpenResource(todayResource)}
                className="px-4 py-2.5 rounded-xl bg-[#0B0D17] border border-[#F2AF29] text-[#F2AF29] hover:bg-[#F2AF29] hover:text-[#0B0D17] font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0 shadow-md"
              >
                <Play className="w-3.5 h-3.5" />
                <span>Open Resource</span>
              </button>
            </div>
          )}

          {/* Action Row */}
          <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={() => onStartAssessment(todayStep)}
              className="w-full sm:flex-1 py-3.5 rounded-2xl bg-[#F2AF29] hover:bg-[#e09e1e] text-[#0B0D17] font-extrabold text-xs uppercase tracking-wider shadow-xl shadow-[#F2AF29]/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>
                {isTodayStepVerified
                  ? 'Retake Step Assessment'
                  : 'Start Today\'s Verification Quiz & Challenge'}
              </span>
            </button>

            <button
              onClick={onNavigateLifeGps}
              className="w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-[#0B0D17] border border-white/10 hover:border-white/20 text-slate-300 hover:text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>View Full Life GPS</span>
              <ArrowRight className="w-4 h-4 text-[#F2AF29]" />
            </button>
          </div>

          {/* Completion banner if today's step is verified/completed */}
          {isTodayStepCompleted && (
            <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 flex items-center gap-3 text-emerald-200">
              <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
              <div className="text-xs space-y-0.5">
                <p className="font-bold text-white">🎉 GREAT WORK! Today's mission is complete.</p>
                <p className="text-slate-300">
                  Pathway Progress: <span className="font-mono font-bold text-emerald-400">{progressPercent}%</span>.
                  Come back tomorrow for your next milestone!
                </p>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-6 space-y-3">
          <Award className="w-12 h-12 text-[#F2AF29] mx-auto" />
          <h4 className="text-xl font-bold text-white">All Journey Steps Mastered!</h4>
          <p className="text-xs text-slate-300 max-w-md mx-auto">
            You've completed every step in {activeJourney.pathTitle}. You are ready for professional portfolio reviews!
          </p>
        </div>
      )}
    </div>
  );
};
