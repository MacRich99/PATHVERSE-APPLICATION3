import React, { useState } from 'react';
import { Compass, Sparkles, ArrowRight, Lock, Unlock, RefreshCw, Check, Star } from 'lucide-react';
import { UserProfile, DiscoveryResult, DiscoveredPath } from '../types';

interface DiscoveryScreenProps {
  user: UserProfile;
  discoveryResult: DiscoveryResult | null;
  isLoading: boolean;
  onRunDiscovery: () => void;
  onExplorePath: (path: DiscoveredPath) => void;
  onRetakeQuiz?: () => void;
}

export const DiscoveryScreen: React.FC<DiscoveryScreenProps> = ({
  user,
  discoveryResult,
  isLoading,
  onRunDiscovery,
  onExplorePath,
  onRetakeQuiz,
}) => {
  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
      {/* Loading State */}
      {isLoading ? (
        <div className="bg-[#1C1F37] border border-white/10 rounded-3xl p-8 text-center space-y-6 shadow-2xl my-12 animate-pulse">
          <div className="relative w-20 h-20 mx-auto">
            <div className="absolute inset-0 rounded-full border-4 border-[#F2AF29]/20 border-t-[#F2AF29] animate-spin"></div>
            <div className="w-full h-full rounded-full flex items-center justify-center text-[#F2AF29]">
              <Compass className="w-8 h-8" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white mb-2">
              Analyzing where you are...
            </h3>
            <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed opacity-80">
              Gemini is reviewing your interests, skills, and goals to build personalized career options.
            </p>
          </div>
          <div className="flex justify-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#F2AF29] animate-bounce"></span>
            <span className="w-2 h-2 rounded-full bg-[#F2AF29] animate-bounce delay-150"></span>
            <span className="w-2 h-2 rounded-full bg-[#F2AF29] animate-bounce delay-300"></span>
          </div>
        </div>
      ) : !discoveryResult ? (
        /* Prompt CTA State */
        <div className="bg-[#1C1F37] border border-white/10 rounded-3xl p-8 text-center space-y-6 shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-[#0B0D17] border border-[#F2AF29]/30 flex items-center justify-center text-[#F2AF29] mx-auto shadow-lg">
            <Sparkles className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl font-extrabold text-white tracking-tight">
              Ready to Discover Your Path?
            </h2>
            <p className="text-xs text-slate-300 max-w-lg mx-auto leading-relaxed opacity-80">
              PathVerse analyzes your unique interests and goals to reveal 3 personalized growth trajectories — no rigid test scores or forced choices.
            </p>
          </div>

          <button
            onClick={onRunDiscovery}
            className="px-8 py-4 rounded-2xl bg-[#F2AF29] hover:bg-[#e09e1e] text-[#0B0D17] font-bold text-sm tracking-wide shadow-xl shadow-[#F2AF29]/20 transition-all flex items-center justify-center gap-2 mx-auto cursor-pointer"
          >
            <Compass className="w-5 h-5" />
            <span>Discover My Path</span>
          </button>
        </div>
      ) : (
        /* Results View */
        <div className="space-y-6 animate-fade-in">
          {/* Header & Stage Banner */}
          <div className="bg-[#1C1F37] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-white/5">
              <div>
                <span className="text-xs font-bold text-[#F2AF29] uppercase tracking-widest block mb-1">
                  Your Discovery Results
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                  Trajectory: {discoveryResult.growthStageDescription}
                </h2>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-center">
                {onRetakeQuiz && (
                  <button
                    onClick={onRetakeQuiz}
                    className="px-3.5 py-2 rounded-xl bg-[#0B0D17] border border-[#F2AF29]/40 text-[#F2AF29] hover:bg-[#F2AF29] hover:text-[#0B0D17] text-xs font-bold transition-all cursor-pointer"
                  >
                    Take AI Quiz
                  </button>
                )}
                <button
                  onClick={onRunDiscovery}
                  className="px-3.5 py-2 rounded-xl bg-[#0B0D17] border border-white/10 text-slate-300 hover:text-white hover:border-white/20 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-[#F2AF29]" />
                  <span>Re-Analyze</span>
                </button>
              </div>
            </div>

            {/* Implied Strengths */}
            <div>
              <h4 className="text-xs uppercase tracking-widest font-bold text-slate-400 mb-3">
                Implied Strengths Identified by AI
              </h4>
              <div className="flex flex-wrap gap-2">
                {(discoveryResult?.strengths || []).map((strength, idx) => (
                  <div
                    key={idx}
                    className="px-3 py-1.5 rounded-xl bg-[#F2AF29]/10 border border-[#F2AF29]/30 text-[#F2AF29] text-xs font-semibold flex items-center gap-1.5"
                  >
                    <Star className="w-3.5 h-3.5 text-[#F2AF29] fill-[#F2AF29]/20" />
                    <span>{strength}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 3 Paths Cards */}
          <div className="space-y-4">
            <h3 className="text-xs uppercase tracking-widest font-black text-slate-400 flex items-center gap-2">
              <span>3 Paths Worth Exploring</span>
            </h3>

            {(discoveryResult?.paths || []).map((pathItem, index) => {
              const isUnlocked = user?.unlockedPathIds?.includes(pathItem.id);
              const isPrimaryMatch = index === 0;

              return (
                <div
                  key={pathItem.id}
                  className={`bg-[#1C1F37] border rounded-3xl p-6 sm:p-7 shadow-2xl transition-all relative overflow-hidden group ${
                    isPrimaryMatch
                      ? 'border-[#F2AF29] bg-gradient-to-b from-[#1C1F37] to-[#0B0D17] ring-1 ring-[#F2AF29]/30'
                      : 'border-white/10 hover:border-white/20'
                  }`}
                >
                  {/* Option Badge & Primary Match Banner */}
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded-full bg-[#0B0D17] border border-white/10 text-slate-300 text-[10px] font-bold uppercase tracking-widest">
                        Option {index + 1}
                      </span>
                      {isPrimaryMatch && (
                        <span className="px-3 py-1 rounded-full bg-[#F2AF29] text-[#0B0D17] text-[10px] font-black uppercase tracking-widest flex items-center gap-1 shadow-md shadow-[#F2AF29]/20">
                          <Sparkles className="w-3 h-3 fill-[#0B0D17]" />
                          <span>Top Diagnostic Interest Match</span>
                        </span>
                      )}
                    </div>

                    {isUnlocked ? (
                      <span className="px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 text-[10px] font-semibold flex items-center gap-1">
                        <Unlock className="w-3 h-3" />
                        <span>Unlocked</span>
                      </span>
                    ) : (
                      <span className="px-3 py-1 rounded-full bg-[#0B0D17] border border-[#F2AF29]/40 text-[#F2AF29] text-[10px] font-bold flex items-center gap-1">
                        <Lock className="w-3 h-3 text-[#F2AF29]" />
                        <span>Life GPS Locked ($4.99)</span>
                      </span>
                    )}
                  </div>

                  {/* Path Title */}
                  <h4 className="text-xl font-extrabold text-white mb-2 group-hover:text-[#F2AF29] transition-colors flex items-center gap-2">
                    <span>{pathItem.title}</span>
                    {isPrimaryMatch && (
                      <Star className="w-4 h-4 text-[#F2AF29] fill-[#F2AF29]" />
                    )}
                  </h4>

                  {/* Personal Reason */}
                  <p className="text-xs text-slate-300 leading-relaxed mb-4 bg-[#0B0D17] p-4 rounded-2xl border border-white/5 opacity-90">
                    "{pathItem.reason}"
                  </p>

                  {/* Beginner Skills */}
                  <div className="mb-6">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">
                      Beginner Skills You'll Learn
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {(pathItem?.beginnerSkills || []).map((skill, sIdx) => (
                        <span
                          key={sIdx}
                          className="px-2.5 py-1 rounded-lg bg-[#0B0D17] text-slate-300 text-xs font-medium border border-white/5"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Explore Action Button */}
                  <button
                    onClick={() => onExplorePath(pathItem)}
                    className={`w-full py-3.5 px-6 rounded-2xl font-bold text-xs uppercase tracking-wider shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      isUnlocked
                        ? 'bg-[#F2AF29] hover:bg-[#e09e1e] text-[#0B0D17] shadow-[#F2AF29]/20'
                        : 'bg-[#0B0D17] hover:bg-[#151829] text-[#F2AF29] border border-[#F2AF29]/40'
                    }`}
                  >
                    <span>{isUnlocked ? 'View Life GPS Route' : 'Explore Path'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
