import React from 'react';
import { X, ExternalLink, CheckCircle2, ShieldCheck, Sparkles, BookOpen, Clock, AlertCircle, Video, FileText } from 'lucide-react';
import { StepResource } from '../types';

interface ResourceMonitoringModalProps {
  isOpen: boolean;
  resource: StepResource | null;
  onClose: () => void;
  onConfirmUserCompletion: (resourceId: string) => void;
  onStartVerificationAssessment: (resourceId: string) => void;
  onOpenMentorHelp: (topic: string) => void;
}

export const ResourceMonitoringModal: React.FC<ResourceMonitoringModalProps> = ({
  isOpen,
  resource,
  onClose,
  onConfirmUserCompletion,
  onStartVerificationAssessment,
  onOpenMentorHelp,
}) => {
  if (!isOpen || !resource) return null;

  const isVideo = resource.type === 'video';

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-[#1C1F37] border border-white/10 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative space-y-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-[#0B0D17] text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-2xl bg-[#0B0D17] border flex items-center justify-center shrink-0 shadow-lg ${
            isVideo ? 'border-rose-500/40 text-rose-400' : 'border-[#F2AF29]/40 text-[#F2AF29]'
          }`}>
            {isVideo ? <Video className="w-6 h-6" /> : <FileText className="w-6 h-6" />}
          </div>
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest block text-[#F2AF29]">
              {isVideo ? '📹 VIDEO STUDY RESOURCE (YOUTUBE)' : '📄 ARTICLE & READING RESOURCE (GOOGLE / WEB)'}
            </span>
            <h3 className="text-xl font-bold text-white">
              {resource.title}
            </h3>
            <p className="text-xs text-slate-400">
              Provider: {resource.providerName} • ~{resource.estimatedMinutes} mins
            </p>
          </div>
        </div>

        {/* Current Status Banner */}
        <div className="bg-[#0B0D17] border border-white/10 rounded-2xl p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300">Current Status:</span>
            <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-[#F2AF29]/10 border border-[#F2AF29]/30 text-[#F2AF29]">
              {resource.status === 'not_started' && '○ Not Started'}
              {resource.status === 'opened' && '⏳ Opened (In Progress)'}
              {resource.status === 'completed' && '✓ Completed (User-Reported)'}
              {resource.status === 'verified' && '🛡️ Verified'}
              {resource.status === 'mastered' && '👑 Mastered'}
            </span>
          </div>

          <p className="text-[11px] text-slate-400 leading-relaxed">
            {resource.status === 'completed'
              ? 'Labeled as user-reported completion. To earn verified status, pass the PathVerse assessment.'
              : 'Opening external resources opens a tab directly to YouTube or Google source pages. PathVerse tracks your status.'}
          </p>
        </div>

        {/* Launch Resource Button */}
        <a
          href={resource.url}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-3.5 rounded-2xl bg-[#0B0D17] border-2 border-[#F2AF29] text-[#F2AF29] hover:bg-[#F2AF29] hover:text-[#0B0D17] font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg"
        >
          <ExternalLink className="w-4 h-4" />
          <span>{isVideo ? 'Watch Video Source on YouTube' : 'Read Article Source on Google / Web'}</span>
        </a>

        {/* Completion Prompt */}
        <div className="space-y-3 pt-2 border-t border-white/10">
          <h4 className="text-sm font-bold text-white text-center">
            Did you complete this learning resource?
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {/* Yes I completed it */}
            <button
              onClick={() => {
                onConfirmUserCompletion(resource.id);
                onClose();
              }}
              className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/20 text-emerald-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Yes, I Completed It</span>
            </button>

            {/* Take Verification Assessment */}
            <button
              onClick={() => {
                onStartVerificationAssessment(resource.id);
                onClose();
              }}
              className="p-3.5 rounded-2xl bg-[#F2AF29] hover:bg-[#e09e1e] text-[#0B0D17] font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Verify Learning (Quiz)</span>
            </button>

            {/* Still Learning */}
            <button
              onClick={onClose}
              className="p-3 rounded-2xl bg-[#0B0D17] border border-white/10 text-slate-300 hover:text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <span>I'm Still Learning</span>
            </button>

            {/* I Need Help */}
            <button
              onClick={() => {
                onOpenMentorHelp(resource.title);
                onClose();
              }}
              className="p-3 rounded-2xl bg-[#0B0D17] border border-[#F2AF29]/30 text-[#F2AF29] hover:border-[#F2AF29] font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>I Need AI Mentor Help</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

