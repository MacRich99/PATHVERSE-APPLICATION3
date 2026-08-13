import React from 'react';
import { Compass, Sparkles, Award, ArrowRight, CheckCircle2, Play, Users, BarChart3, Clock, Rocket, Trophy } from 'lucide-react';
import { UserProfile, DiscoveryResult, PathJourney, RecommendedProject, LifeGpsStep, StepResource } from '../types';
import { ProgressChartsDashboard } from './ProgressChartsDashboard';
import { SkillMasteryTree } from './SkillMasteryTree';
import { DailyNavigator } from './DailyNavigator';

interface DashboardScreenProps {
  user: UserProfile;
  discoveryResult: DiscoveryResult | null;
  activeJourney: PathJourney | null;
  todayStep?: LifeGpsStep | null;
  todayResource?: StepResource | null;
  onNavigateTab: (tab: 'home' | 'discovery' | 'lifeGps' | 'community') => void;
  onOpenProject: () => void;
  onContinueStep: () => void;
  onOpenProfileBadges?: () => void;
  onOpenMentor?: () => void;
  onOpenResource?: (resource: StepResource) => void;
  onStartAssessment?: (step: LifeGpsStep) => void;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  user,
  discoveryResult,
  activeJourney,
  todayStep = null,
  todayResource = null,
  onNavigateTab,
  onOpenProject,
  onContinueStep,
  onOpenProfileBadges,
  onOpenMentor,
  onOpenResource,
  onStartAssessment,
}) => {
  // Determine Greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const hasDiscovered = discoveryResult && discoveryResult.paths && discoveryResult.paths.length > 0;

  // Calculate percentage of active route
  const completedCount = activeJourney ? activeJourney.steps.filter((s) => s.status === 'completed').length : 0;
  const totalCount = activeJourney ? activeJourney.steps.length : 1;
  const progressPercent = Math.round((completedCount / totalCount) * 100);

  // Find next unfinished step
  const nextStep = activeJourney ? activeJourney.steps.find((s) => s.status !== 'completed') : null;

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6 animate-fade-in">
      {/* 1. Greeting Banner */}
      <div className="bg-[#1C1F37] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="flex items-center justify-between gap-4">
          <div>
            <span className="text-xs uppercase tracking-widest font-bold text-[#F2AF29] block mb-1">
              {getGreeting()}, {user.name || 'Learner'} 👋
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Welcome to PathVerse
            </h2>
            <p className="text-xs opacity-80 text-[#F2AF29] font-medium mt-1">
              Guidance for 3 billion • The map we wish we had.
            </p>
          </div>

          <div className="w-14 h-14 rounded-2xl bg-[#0B0D17] border border-[#F2AF29]/40 flex items-center justify-center text-[#F2AF29] shrink-0 shadow-lg">
            <Compass className="w-7 h-7" />
          </div>
        </div>

        {/* 2. Stage Badge & My League Badge & Chosen Path Row */}
        <div className="mt-6 pt-5 border-t border-white/5 flex flex-wrap items-center gap-2.5">
          <div className="px-3 py-1 rounded-full bg-[#F2AF29]/10 border border-[#F2AF29]/30 text-[#F2AF29] text-xs font-bold flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-[#F2AF29]" />
            <span className="uppercase tracking-wider text-[11px]">Stage: {user.stageLevel}</span>
          </div>

          <div className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-1.5">
            <Trophy className="w-3.5 h-3.5 text-emerald-400" />
            <span className="uppercase tracking-wider text-[11px]">My League: {user.yearBadge ? user.yearBadge.replace('Class of', 'League of') : 'League of 2026'}</span>
          </div>

          {activeJourney ? (
            <div className="px-3.5 py-1 rounded-full bg-[#0B0D17] border border-white/10 text-slate-200 text-xs font-semibold flex items-center gap-1.5">
              <Rocket className="w-3.5 h-3.5 text-[#F2AF29]" />
              <span className="font-bold text-white">{activeJourney.pathTitle}</span>
            </div>
          ) : (
            <div className="px-3.5 py-1 rounded-full bg-[#0B0D17] border border-white/10 text-slate-400 text-xs">
              No active path selected
            </div>
          )}
        </div>
      </div>

      {/* IF DISCOVERY NOT DONE: Prominent CTA */}
      {!hasDiscovered ? (
        <div className="bg-[#1C1F37] border border-white/10 rounded-3xl p-8 text-center space-y-5 shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-[#0B0D17] border border-[#F2AF29]/30 flex items-center justify-center text-[#F2AF29] mx-auto shadow-lg">
            <Sparkles className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-white">Start Your Career Discovery</h3>
            <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed opacity-80">
              You haven't run your path analysis yet. Tap below to send your profile details to Gemini and generate personalized career options.
            </p>
          </div>

          <button
            onClick={() => onNavigateTab('discovery')}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#F2AF29] hover:bg-[#e09e1e] text-[#0B0D17] font-bold text-sm tracking-wide shadow-xl shadow-[#F2AF29]/20 transition-all flex items-center justify-center gap-2 mx-auto cursor-pointer"
          >
            <Compass className="w-5 h-5" />
            <span>Discover My Path</span>
          </button>
        </div>
      ) : (
        /* DASHBOARD CONTENT */
        <div className="space-y-6">
          {/* 3. Next Step Card */}
          {nextStep ? (
            <div className="bg-[#1C1F37] border border-white/10 rounded-3xl p-6 shadow-2xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-[#F2AF29] uppercase tracking-widest flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  Next Unfinished Step
                </span>
                <span className="text-[10px] text-slate-300 bg-[#0B0D17] px-2.5 py-0.5 rounded-full border border-white/10 font-mono">
                  Step {nextStep.order} of {totalCount}
                </span>
              </div>

              <h4 className="text-lg font-bold text-white">
                {nextStep.title}
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed opacity-80">
                {nextStep.description}
              </p>

              <button
                onClick={onContinueStep}
                className="w-full py-3.5 rounded-2xl bg-[#F2AF29] hover:bg-[#e09e1e] text-[#0B0D17] font-bold text-xs uppercase tracking-wider shadow-lg shadow-[#F2AF29]/15 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                <span>Continue Life GPS Route</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : activeJourney ? (
            <div className="bg-emerald-950/50 border border-emerald-500/30 rounded-3xl p-6 text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
              <h4 className="text-base font-bold text-white">All Route Steps Completed!</h4>
              <p className="text-xs text-slate-300">You've mastered this Life GPS route.</p>
            </div>
          ) : null}

          {/* 4. Current Project Card (White Contrast Card from Design HTML) */}
          {activeJourney && activeJourney.recommendedProject && (
            <div className="bg-white rounded-3xl p-7 text-[#0B0D17] flex flex-col shadow-2xl space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-xs uppercase tracking-widest font-black opacity-50">
                  Current Project
                </h3>
                <span className={`w-2.5 h-2.5 rounded-full ${
                  activeJourney.recommendedProject.isStarted ? 'bg-green-500' : 'bg-amber-500'
                }`}></span>
              </div>

              <h2 className="text-2xl font-black text-[#0B0D17]">
                {activeJourney.recommendedProject.name}
              </h2>

              <p className="text-xs leading-relaxed opacity-80 text-[#0B0D17]">
                {activeJourney.recommendedProject.description}
              </p>

              <div className="flex flex-wrap gap-2 pt-1">
                {(activeJourney.recommendedProject.skills || (activeJourney.recommendedProject as any).skillsGained || []).map((sk: string, idx: number) => (
                  <span key={idx} className="px-3 py-1 rounded-full bg-[#0B0D17]/5 text-[10px] font-bold border border-[#0B0D17]/10 text-[#0B0D17]">
                    {sk}
                  </span>
                ))}
              </div>

              <button
                onClick={onOpenProject}
                className="w-full py-3.5 border-2 border-[#0B0D17] rounded-2xl font-bold uppercase text-xs tracking-widest hover:bg-[#0B0D17] hover:text-white transition-colors cursor-pointer mt-2"
              >
                View Project Details
              </button>
            </div>
          )}

          {/* 5. Path Progress Bar */}
          {activeJourney && (
            <div className="bg-[#1C1F37] border border-white/10 rounded-3xl p-6 shadow-2xl space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-white">
                <span className="flex items-center gap-1.5 uppercase tracking-widest text-[11px] text-slate-300">
                  <BarChart3 className="w-4 h-4 text-[#F2AF29]" />
                  <span>Path Completion</span>
                </span>
                <span className="text-[#F2AF29] font-mono text-sm">{progressPercent}%</span>
              </div>

              <div className="w-full bg-[#0B0D17] h-2 rounded-full overflow-hidden border border-white/5">
                <div
                  className="bg-[#F2AF29] h-full rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>

              <p className="text-[11px] text-slate-400 text-center">
                Completed {completedCount} of {totalCount} Life GPS steps
              </p>
            </div>
          )}

          {/* Daily Navigator: What Should I Do Today? (#20 & #18) */}
          {activeJourney && (
            <DailyNavigator
              user={user}
              activeJourney={activeJourney}
              todayStep={todayStep}
              todayResource={todayResource}
              onOpenResource={(res) => onOpenResource && onOpenResource(res)}
              onStartAssessment={(st) => onStartAssessment && onStartAssessment(st)}
              onNavigateLifeGps={onContinueStep}
            />
          )}

          {/* Recharts Progress Dashboard */}
          <ProgressChartsDashboard activeJourney={activeJourney} />

          {/* SVG Skill Mastery Tree */}
          <SkillMasteryTree
            activeJourney={activeJourney}
            onOpenMentor={onOpenMentor}
          />

          {/* 6. Gemini AI Mentor Card */}
          <div className="bg-gradient-to-r from-[#1C1F37] via-[#24284d] to-[#1C1F37] border border-[#F2AF29]/30 rounded-3xl p-6 shadow-2xl flex items-center justify-between gap-4 relative overflow-hidden">
            <div className="space-y-1 z-10">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#F2AF29] uppercase tracking-widest">
                <Sparkles className="w-3.5 h-3.5 text-[#F2AF29] animate-pulse" />
                <span>24/7 Gemini AI Mentor</span>
              </div>
              <h4 className="text-base font-bold text-white">
                Ask Questions in Any Language
              </h4>
              <p className="text-xs text-slate-300 opacity-90 max-w-sm">
                Need advice on skills, micro projects, or career directions? Chat with your AI mentor anytime in Twi, Spanish, Hindi, or English.
              </p>
            </div>

            {onOpenMentor && (
              <button
                onClick={onOpenMentor}
                className="px-4 py-3 rounded-2xl bg-[#F2AF29] hover:bg-[#e09e1e] text-[#0B0D17] font-bold text-xs uppercase tracking-wider transition-all shrink-0 cursor-pointer shadow-lg shadow-[#F2AF29]/20 z-10 flex items-center gap-1.5"
              >
                <Sparkles className="w-4 h-4" />
                <span>Ask Mentor</span>
              </button>
            )}
          </div>

          {/* 7. Badges & Achievements Card */}
          <div className="bg-[#1C1F37] border border-white/10 rounded-3xl p-6 shadow-2xl flex items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#F2AF29] uppercase tracking-widest">
                <Award className="w-3.5 h-3.5" />
                <span>Achievement Badges</span>
              </div>
              <h4 className="text-base font-bold text-white">
                {(user.unlockedAchievementIds || []).length > 0
                  ? `${(user.unlockedAchievementIds || []).length} Badges Earned`
                  : 'Start Earning Badges'}
              </h4>
              <p className="text-xs text-slate-400">
                Unlock badges as you complete onboarding, discover paths, and build projects.
              </p>
            </div>

            {onOpenProfileBadges && (
              <button
                onClick={onOpenProfileBadges}
                className="px-4 py-2.5 rounded-2xl bg-[#0B0D17] border border-white/10 hover:border-white/20 text-[#F2AF29] font-bold text-xs uppercase tracking-wider transition-colors shrink-0 cursor-pointer shadow-md"
              >
                View Badges
              </button>
            )}
          </div>

          {/* 7. Community Card */}
          <div className="bg-[#1C1F37] rounded-3xl p-6 border border-white/10 flex items-center justify-between gap-4 shadow-2xl">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#F2AF29] uppercase tracking-widest">
                <Users className="w-3.5 h-3.5" />
                <span>Peer Community</span>
              </div>
              <h4 className="text-base font-bold text-white">
                Meet Other Young Learners
              </h4>
              <p className="text-xs text-slate-400">
                Connect with peers exploring similar career paths.
              </p>
            </div>

            <button
              onClick={() => onNavigateTab('community')}
              className="px-4 py-2.5 rounded-2xl bg-[#F2AF29] hover:bg-[#e09e1e] text-[#0B0D17] font-bold text-xs uppercase tracking-wider transition-colors shrink-0 cursor-pointer shadow-md"
            >
              Meet Learners
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
