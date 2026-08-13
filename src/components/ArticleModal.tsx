import React, { useState } from 'react';
import { X, FileText, CheckCircle2, Clock, Share2, BookOpen, ExternalLink, Sparkles, Award } from 'lucide-react';
import { StepResource } from '../types';

interface ArticleModalProps {
  resource: StepResource | null;
  isOpen: boolean;
  onClose: () => void;
  onMarkCompleted?: (resourceId: string) => void;
}

export const ArticleModal: React.FC<ArticleModalProps> = ({
  resource,
  isOpen,
  onClose,
  onMarkCompleted,
}) => {
  const [isCompleted, setIsCompleted] = useState(resource?.status === 'completed' || resource?.status === 'verified');
  const [copied, setCopied] = useState(false);

  if (!isOpen || !resource) return null;

  const content = resource.articleContent || {
    summary: `Essential reading guide for ${resource.title}.`,
    keyTakeaways: [
      'Understand core industry principles and standardized practices.',
      'Review real-world execution frameworks and case study benchmarks.',
      'Apply lessons directly to your practical career milestone projects.'
    ],
    fullArticleText: `### ${resource.title}\n\nMastering this topic requires combining solid theoretical fundamentals with practical real-world execution...`,
    caseStudyTitle: 'Industry Benchmark Case Study',
    caseStudyText: 'Leading organizations implementing these principles saw significant improvements in performance and operational clarity.'
  };

  const handleComplete = () => {
    setIsCompleted(true);
    if (onMarkCompleted) {
      onMarkCompleted(resource.id);
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-[#1C1F37] border border-white/10 rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl relative overflow-hidden">
        {/* Header Bar */}
        <div className="p-6 border-b border-white/10 flex items-start justify-between gap-4 bg-[#0B0D17]">
          <div className="flex items-start gap-3">
            <div className="p-3 rounded-2xl bg-[#F2AF29]/10 border border-[#F2AF29]/30 text-[#F2AF29] shrink-0 mt-0.5">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full bg-[#F2AF29] text-[#0B0D17] text-[10px] font-black uppercase tracking-wider">
                  Article & Case Study
                </span>
                <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                  <Clock className="w-3 h-3 text-[#F2AF29]" />
                  {resource.estimatedMinutes || 12} mins read
                </span>
              </div>
              <h3 className="text-xl font-bold text-white leading-snug">
                {resource.title}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Published by <span className="text-[#F2AF29] font-semibold">{resource.providerName}</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Article Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-300 text-xs leading-relaxed">
          {/* Executive Summary */}
          <div className="bg-[#0B0D17] border border-white/10 rounded-2xl p-4 space-y-2">
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#F2AF29] block">
              Executive Summary
            </span>
            <p className="text-slate-200 text-xs leading-relaxed">
              {content.summary}
            </p>
          </div>

          {/* Key Takeaways */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#F2AF29]" />
              <span>Key Takeaways</span>
            </h4>
            <div className="grid gap-2">
              {content.keyTakeaways.map((takeaway, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#F2AF29] shrink-0 mt-0.5" />
                  <span className="text-slate-200 text-xs">{takeaway}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Full Article Text */}
          <div className="space-y-4 pt-2 border-t border-white/10">
            <div className="prose prose-invert max-w-none text-xs text-slate-300 space-y-3">
              {content.fullArticleText.split('\n\n').map((paragraph, pIdx) => {
                if (paragraph.startsWith('### ')) {
                  return <h3 key={pIdx} className="text-base font-bold text-white pt-2">{paragraph.replace('### ', '')}</h3>;
                }
                if (paragraph.startsWith('#### ')) {
                  return <h4 key={pIdx} className="text-sm font-bold text-[#F2AF29] pt-1">{paragraph.replace('#### ', '')}</h4>;
                }
                return <p key={pIdx} className="text-slate-300 leading-relaxed">{paragraph}</p>;
              })}
            </div>
          </div>

          {/* Real-World Case Study Highlight */}
          {content.caseStudyTitle && (
            <div className="bg-[#0B0D17] border border-[#F2AF29]/30 rounded-2xl p-5 space-y-2 relative overflow-hidden">
              <div className="flex items-center gap-2 text-[#F2AF29] text-xs font-bold uppercase tracking-wider">
                <Award className="w-4 h-4 text-[#F2AF29]" />
                <span>{content.caseStudyTitle}</span>
              </div>
              <p className="text-slate-300 text-xs leading-relaxed">
                {content.caseStudyText}
              </p>
            </div>
          )}

          {/* Source Link */}
          {resource.url && (
            <div className="pt-2 flex items-center justify-between text-xs text-slate-400">
              <span>Read original source reference:</span>
              <a
                href={resource.url}
                target="_blank"
                rel="noreferrer"
                className="text-[#F2AF29] hover:underline flex items-center gap-1 font-semibold"
              >
                <span>{resource.providerName}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-6 border-t border-white/10 bg-[#0B0D17] flex items-center justify-between gap-4">
          <button
            onClick={handleShare}
            className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Share2 className="w-4 h-4 text-[#F2AF29]" />
            <span>{copied ? 'Link Copied!' : 'Share Article'}</span>
          </button>

          <button
            onClick={handleComplete}
            disabled={isCompleted}
            className={`px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
              isCompleted
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                : 'bg-[#F2AF29] hover:bg-[#e09e1e] text-[#0B0D17] shadow-lg shadow-[#F2AF29]/20'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{isCompleted ? 'Article Completed ✓' : 'Mark Article as Completed'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
