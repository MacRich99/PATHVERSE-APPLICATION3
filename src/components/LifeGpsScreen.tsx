import React, { useState } from 'react';
import { Compass, CheckCircle2, Circle, ArrowLeft, Sparkles, MapPin, Play, Award, Check, AlertCircle, RefreshCw, BookOpen, ShieldCheck, ExternalLink, Video, FileText } from 'lucide-react';
import { UserProfile, PathJourney, LifeGpsStep, RecommendedProject, StepResource } from '../types';
import { generateResourcesForStep } from '../data/stepResources';

interface LifeGpsScreenProps {
  journey: PathJourney | null;
  user: UserProfile;
  isLoading: boolean;
  onBackToDiscovery: () => void;
  onStartProject: (project: RecommendedProject) => void;
  onToggleStepComplete: (stepId: string) => void;
  onOpenMentor?: () => void;
  onOpenResource?: (resource: StepResource) => void;
  onStartAssessment?: (step: LifeGpsStep) => void;
}

export const LifeGpsScreen: React.FC<LifeGpsScreenProps> = ({
  journey,
  user,
  isLoading,
  onBackToDiscovery,
  onStartProject,
  onToggleStepComplete,
  onOpenMentor,
  onOpenResource,
  onStartAssessment,
}) => {
  const [startedToast, setStartedToast] = useState(false);
  const [pacingMode, setPacingMode] = useState<'relaxed' | 'steady' | 'accelerated'>('relaxed');

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center space-y-6">
        <div className="relative w-20 h-20 mx-auto">
          <div className="absolute inset-0 rounded-full border-4 border-amber-500/20 border-t-amber-500 animate-spin"></div>
          <div className="w-full h-full rounded-full flex items-center justify-center text-amber-400">
            <Compass className="w-8 h-8" />
          </div>
        </div>
        <h3 className="text-2xl font-bold text-white">Mapping your Life GPS route...</h3>
        <p className="text-sm text-slate-400">
          Generating step-by-step milestone map and matching starter project.
        </p>
      </div>
    );
  }

  if (!journey) {
    return (
      <div className="max-w-md mx-auto px-4 py-12 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-amber-400 mx-auto" />
        <h3 className="text-xl font-bold text-white">No Route Selected</h3>
        <p className="text-xs text-slate-400">
          Please select a path from the discovery result to generate your Life GPS route.
        </p>
        <button
          onClick={onBackToDiscovery}
          className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs"
        >
          Back to Discovery
        </button>
      </div>
    );
  }

  const handleStartProjectClick = () => {
    onStartProject(journey.recommendedProject);
    setStartedToast(true);
    setTimeout(() => setStartedToast(false), 4000);
  };

  const totalSteps = journey.steps.length;
  const completedSteps = journey.steps.filter((s) => s.status === 'completed').length;
  const progressPercent = Math.round((completedSteps / totalSteps) * 100);

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-8 animate-fade-in">
      {/* Back Button & Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBackToDiscovery}
          className="px-3.5 py-2 rounded-xl bg-[#1C1F37] border border-white/10 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-[#F2AF29]" />
          <span>All Paths</span>
        </button>

        <div className="px-3 py-1 rounded-full bg-[#F2AF29]/10 border border-[#F2AF29]/30 text-[#F2AF29] text-xs font-bold flex items-center gap-1.5">
          <Award className="w-3.5 h-3.5 text-[#F2AF29]" />
          <span className="uppercase tracking-wider text-[11px]">{user.stageLevel} Stage</span>
        </div>
      </div>

      {/* Path Title Banner */}
      <div className="bg-[#1C1F37] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-xs font-bold text-[#F2AF29] uppercase tracking-widest block mb-1">
              Life GPS Route
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              {journey.pathTitle}
            </h2>
          </div>

            <span className="text-xs font-bold text-[#F2AF29] bg-[#F2AF29]/10 px-3 py-1 rounded-full border border-[#F2AF29]/30 uppercase tracking-widest shrink-0 self-start sm:self-auto">
              Verified Path
            </span>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs text-slate-300 font-medium">
            <span className="uppercase tracking-widest text-[10px] text-slate-400">Route Progress</span>
            <span className="text-[#F2AF29] font-mono font-bold">{progressPercent}% Completed</span>
          </div>
          <div className="w-full bg-[#0B0D17] h-2 rounded-full overflow-hidden border border-white/5">
            <div
              className="bg-[#F2AF29] h-full rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>

        {/* AI Mentor Quick Trigger */}
        {onOpenMentor && (
          <div className="mt-2 pt-4 border-t border-white/5 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <Sparkles className="w-4 h-4 text-[#F2AF29] shrink-0 animate-pulse" />
              <span>Questions about these steps? Ask Gemini AI Mentor anytime.</span>
            </div>
            <button
              onClick={onOpenMentor}
              className="px-3.5 py-1.5 rounded-xl bg-[#0B0D17] border border-[#F2AF29]/40 text-[#F2AF29] hover:bg-[#F2AF29] hover:text-[#0B0D17] font-bold text-xs transition-all shrink-0 cursor-pointer shadow-md"
            >
              Ask Mentor
            </button>
          </div>
        )}
      </div>

      {/* Stress-Free Future Pacing Control */}
      <div className="bg-[#1C1F37] border border-white/10 rounded-3xl p-6 shadow-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-[10px] font-bold text-[#F2AF29] uppercase tracking-widest block mb-0.5">
              Stress-Free Future Navigation
            </span>
            <h3 className="text-lg font-bold text-white">
              Choose Your Daily Study Pace
            </h3>
          </div>
          <div className="flex items-center gap-1.5 bg-[#0B0D17] p-1.5 rounded-2xl border border-white/10 self-start sm:self-auto">
            <button
              onClick={() => setPacingMode('relaxed')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                pacingMode === 'relaxed'
                  ? 'bg-[#F2AF29] text-[#0B0D17] shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Relaxed (15m/day)
            </button>
            <button
              onClick={() => setPacingMode('steady')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                pacingMode === 'steady'
                  ? 'bg-[#F2AF29] text-[#0B0D17] shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Steady (30m/day)
            </button>
            <button
              onClick={() => setPacingMode('accelerated')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                pacingMode === 'accelerated'
                  ? 'bg-[#F2AF29] text-[#0B0D17] shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Accelerated (60m/day)
            </button>
          </div>
        </div>

        <div className="bg-[#0B0D17] border border-white/5 rounded-2xl p-4 flex items-start gap-3">
          <div className="p-2 rounded-xl bg-[#F2AF29]/10 border border-[#F2AF29]/30 text-[#F2AF29] shrink-0 mt-0.5">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="space-y-1">
            <p className="text-xs font-semibold text-white">
              {pacingMode === 'relaxed' && '🌿 Relaxed Micro-Pacing: Perfect for balancing school, clinicals, work, or family with zero pressure.'}
              {pacingMode === 'steady' && '⚡ Steady Momentum: Balanced structure ensuring consistent progress across your field of study.'}
              {pacingMode === 'accelerated' && '🚀 Deep Focus Sprint: High-velocity mastery designed for rapid skill acquisition and career transitions.'}
            </p>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              PathVerse dynamically adjusts module sizes so you learn sustainably without anxiety or cognitive burnout.
            </p>
          </div>
        </div>
      </div>

      {/* Vertical Map / Flight Path Route */}
      <div className="bg-[#1C1F37] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl relative">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-white mb-0.5">Life GPS</h3>
            <p className="text-xs text-slate-400 font-medium">Your journey, not a fixed destiny. Tap any step to view resources and assessments.</p>
          </div>
          <span className="px-3 py-1 rounded-full bg-white/5 text-[10px] uppercase font-bold tracking-widest border border-white/10 text-[#F2AF29]">
            Unlocked
          </span>
        </div>

        {/* Vertical Route Container */}
        <div className="relative pl-6 space-y-8 mt-6">
          {/* Vertical Gold Gradient Route Line */}
          <div className="absolute left-[15px] top-3 bottom-6 w-0.5 bg-gradient-to-b from-[#F2AF29] via-[#F2AF29]/60 to-white/10"></div>

          {(journey?.steps || []).map((step, idx) => {
            const isCompleted = step.status === 'completed';
            const isCurrent = !isCompleted && journey.steps.findIndex((s) => s.status !== 'completed') === idx;

            return (
              <div key={step.id} className="relative flex items-start gap-4 group">
                {/* Step Marker Node */}
                <button
                  onClick={() => onToggleStepComplete(step.id)}
                  className={`absolute -left-[24px] top-1.5 w-6 h-6 rounded-full flex items-center justify-center transition-transform hover:scale-110 cursor-pointer shadow-md z-10 ${
                    isCompleted
                      ? 'bg-[#F2AF29] text-[#0B0D17] shadow-[#F2AF29]/40'
                      : isCurrent
                      ? 'bg-[#F2AF29] text-[#0B0D17] ring-8 ring-[#F2AF29]/20 font-bold'
                      : 'bg-[#0B0D17] border-2 border-white/20 text-slate-400'
                  }`}
                  title={isCompleted ? 'Mark as incomplete' : 'Mark as completed'}
                >
                  {isCompleted ? (
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  ) : (
                    <span className="text-[10px] font-bold">{idx + 1}</span>
                  )}
                </button>

                {/* Step Content Card */}
                <div
                  className={`flex-1 p-4 sm:p-5 rounded-2xl border transition-all ${
                    isCurrent
                      ? 'bg-[#F2AF29] text-[#0B0D17] border-[#F2AF29] shadow-lg shadow-[#F2AF29]/15'
                      : isCompleted
                      ? 'bg-[#0B0D17]/40 border-white/5 text-slate-400'
                      : 'bg-[#0B0D17] border-white/10 text-slate-200 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-[10px] font-bold uppercase tracking-widest ${isCurrent ? 'text-[#0B0D17]' : 'text-[#F2AF29]'}`}>
                      {isCurrent ? 'YOU ARE HERE • ' : ''}Step {step.order} ({step.phase})
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border ${isCurrent ? 'bg-[#0B0D17]/10 border-[#0B0D17]/20 text-[#0B0D17]' : 'bg-[#1C1F37] border-white/10 text-slate-400'}`}>
                      {step.estimatedTime}
                    </span>
                  </div>

                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <h4 className={`text-base font-bold ${isCurrent ? 'text-[#0B0D17]' : isCompleted ? 'line-through text-slate-400' : 'text-white'}`}>
                      {step.title}
                    </h4>

                    {/* Step Verification Status Badge */}
                    <div className="shrink-0">
                      {(user.verifiedStepIds || []).includes(step.id) ? (
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[10px] font-bold flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3 text-emerald-400" />
                          <span>Verified</span>
                        </span>
                      ) : isCompleted ? (
                        <span className="px-2.5 py-0.5 rounded-full bg-[#F2AF29]/20 border border-[#F2AF29]/40 text-[#F2AF29] text-[10px] font-bold">
                          User Completed
                        </span>
                      ) : null}
                    </div>
                  </div>

                  <p className={`text-xs leading-relaxed mb-3 ${isCurrent ? 'text-[#0B0D17]/80' : 'text-slate-300 opacity-80'}`}>
                    {step.description}
                  </p>

                  {/* Study Resources: Videos & Articles for this topic */}
                  <div className="pt-3 border-t border-white/10 space-y-2">
                    <span className={`text-[10px] font-bold uppercase tracking-wider block ${isCurrent ? 'text-[#0B0D17]/80' : 'text-[#F2AF29]'}`}>
                      Study Resources (Videos & Articles)
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {generateResourcesForStep(step.id, step.title, journey.pathTitle).map((res) => {
                        const isVideo = res.type === 'video';
                        return (
                          <div
                            key={res.id}
                            className={`p-2.5 rounded-xl border flex items-center justify-between gap-2 text-xs ${
                              isCurrent
                                ? 'bg-[#0B0D17]/10 border-[#0B0D17]/20 text-[#0B0D17]'
                                : 'bg-[#0B0D17] border-white/10 text-slate-200'
                            }`}
                          >
                            <div className="flex items-center gap-2 overflow-hidden">
                              {isVideo ? (
                                <Video className="w-4 h-4 text-rose-400 shrink-0" />
                              ) : (
                                <FileText className="w-4 h-4 text-[#F2AF29] shrink-0" />
                              )}
                              <div className="truncate">
                                <p className="font-semibold text-[11px] truncate">{res.title}</p>
                                <p className="text-[9px] opacity-70 truncate">{res.providerName}</p>
                              </div>
                            </div>

                            <div className="flex items-center gap-1 shrink-0">
                              {/* Open in app modal */}
                              {onOpenResource && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onOpenResource(res);
                                  }}
                                  className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                                    isCurrent
                                      ? 'bg-[#0B0D17] text-[#F2AF29]'
                                      : 'bg-[#1C1F37] text-[#F2AF29] hover:bg-[#F2AF29] hover:text-[#0B0D17]'
                                  }`}
                                  title="Interactive App Study Guide"
                                >
                                  Study
                                </button>
                              )}

                              {/* External direct link (YouTube / Google) */}
                              <a
                                href={res.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className={`p-1 rounded-lg transition-colors cursor-pointer ${
                                  isCurrent ? 'hover:bg-[#0B0D17]/20 text-[#0B0D17]' : 'hover:bg-white/10 text-slate-400 hover:text-white'
                                }`}
                                title={isVideo ? 'Watch on YouTube' : 'Read source on Google/Web'}
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {onStartAssessment && (
                      <div className="pt-2 flex justify-end">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onStartAssessment(step);
                          }}
                          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                            isCurrent
                              ? 'bg-[#0B0D17] text-[#F2AF29] hover:bg-[#0B0D17]/90'
                              : 'bg-[#0B0D17] border border-emerald-500/40 text-emerald-300 hover:bg-emerald-500 hover:text-[#0B0D17]'
                          }`}
                        >
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>Take Verification Quiz</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Destination Role Node */}
        <div className="mt-8 pt-4 border-t border-white/5 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#F2AF29] text-[#0B0D17] font-bold flex items-center justify-center shrink-0 shadow-lg shadow-[#F2AF29]/20">
            ★
          </div>
          <div>
            <div className="text-xs font-bold text-[#F2AF29] uppercase tracking-widest">Destination Goal</div>
            <div className="text-sm font-bold text-white">Beginner-Professional Level Role</div>
          </div>
        </div>

        {/* Required Disclaimer Footer */}
        <div className="mt-6 pt-4 border-t border-white/5 text-center">
          <p className="text-xs font-semibold text-slate-400">
            "This is a suggested route, not a fixed destiny."
          </p>
        </div>
      </div>

      {/* Recommended Starter Project (White Contrast Card from Design Spec) */}
      {journey.recommendedProject && (
        <div className="bg-white rounded-3xl p-7 text-[#0B0D17] flex flex-col shadow-2xl relative overflow-hidden space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xs uppercase tracking-widest font-black opacity-50">
              Current Starter Project
            </h3>
            <span className={`w-2.5 h-2.5 rounded-full ${journey.recommendedProject.isStarted ? 'bg-green-500' : 'bg-amber-500'}`}></span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-2xl font-black text-[#0B0D17]">
                {journey.recommendedProject.name}
              </h2>
            </div>


          </div>

          <p className="text-xs leading-relaxed opacity-80 text-[#0B0D17]">
            {journey.recommendedProject.description}
          </p>

          {/* Skill Tags */}
          <div className="mb-2">
            <span className="text-[10px] font-bold uppercase tracking-widest block mb-2 opacity-60 text-[#0B0D17]">
              Skills You'll Put Into Practice
            </span>
            <div className="flex flex-wrap gap-1.5">
              {(journey?.recommendedProject?.skills || (journey?.recommendedProject as any)?.skillsGained || []).map((skill: string, sIdx: number) => (
                <span
                  key={sIdx}
                  className="px-3 py-1 rounded-full bg-[#0B0D17]/5 text-[10px] font-bold border border-[#0B0D17]/10 text-[#0B0D17] flex items-center gap-1"
                >
                  <BookOpen className="w-2.5 h-2.5 opacity-70" />
                  <span>{skill}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Toast Notification */}
          {startedToast && (
            <div className="p-3 rounded-2xl bg-[#0B0D17] text-white font-bold text-xs flex items-center gap-2 animate-fade-in shadow-lg">
              <Sparkles className="w-4 h-4 text-[#F2AF29] shrink-0" />
              <span>Nice — you've started this project! Advanced stage level to <strong>Builder</strong>.</span>
            </div>
          )}

          {/* Start Project Button */}
          <button
            onClick={handleStartProjectClick}
            className={`w-full py-4 border-2 border-[#0B0D17] rounded-2xl font-bold uppercase text-xs tracking-widest hover:bg-[#0B0D17] hover:text-white transition-colors cursor-pointer ${
              journey.recommendedProject.isStarted
                ? 'bg-[#0B0D17] text-white'
                : 'text-[#0B0D17]'
            }`}
          >
            {journey.recommendedProject.isStarted ? 'Project In Progress • Builder Stage' : 'View Project Details / Start'}
          </button>
        </div>
      )}
    </div>
  );
};
