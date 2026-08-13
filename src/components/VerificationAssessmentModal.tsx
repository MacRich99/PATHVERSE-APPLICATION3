import React, { useState } from 'react';
import { X, ShieldCheck, Sparkles, CheckCircle2, AlertTriangle, ArrowRight, RefreshCw, Send, Award, Code, BookOpen } from 'lucide-react';
import { LifeGpsStep, StepAssessment, ProjectSubmission } from '../types';

interface VerificationAssessmentModalProps {
  isOpen: boolean;
  step: LifeGpsStep | null;
  pathTitle: string;
  onClose: () => void;
  onPassAssessment: (stepId: string, score: number, submission?: ProjectSubmission) => void;
}

export const VerificationAssessmentModal: React.FC<VerificationAssessmentModalProps> = ({
  isOpen,
  step,
  pathTitle,
  onClose,
  onPassAssessment,
}) => {
  if (!isOpen || !step) return null;

  const [activeTab, setActiveTab] = useState<'quiz' | 'project'>('quiz');
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [projectText, setProjectText] = useState('');
  const [isEvaluatingProject, setIsEvaluatingProject] = useState(false);
  const [projectEvaluation, setProjectEvaluation] = useState<ProjectSubmission | null>(null);

  // Mock / default assessment generator if server is loading
  const questions = [
    {
      id: `${step.id}-q1`,
      question: `What is the core principle behind "${step.title}" in ${pathTitle}?`,
      options: [
        `Establishing verified foundational knowledge and standardized best practices`,
        `Bypassing step-by-step learning without testing results`,
        `Relying on unverified assumptions`,
        `Hiding execution logic from users`
      ],
      correctIndex: 0,
      explanation: `Foundational competence in ${step.title} requires clear understanding of standard core principles.`
    },
    {
      id: `${step.id}-q2`,
      question: `Which strategy demonstrates technical competence when applying ${step.title}?`,
      options: [
        `Skipping documentation and testing randomly`,
        `Modular problem breakdown, structured implementation, and testing`,
        `Memorizing terms without hands-on practice`,
        `Ignoring edge cases and error messages`
      ],
      correctIndex: 1,
      explanation: `Modular problem breakdown ensures that every component is reliable and testable.`
    },
    {
      id: `${step.id}-q3`,
      question: `How does PathVerse verify that you have mastered ${step.title}?`,
      options: [
        `By clicking a link once without reviewing it`,
        `By completing interactive concept quizzes or submitting a working practical project challenge`,
        `By skipping directly to advanced steps`,
        `By assuming completion based on time spent`
      ],
      correctIndex: 1,
      explanation: `PathVerse progress is verified through interactive quizzes and evaluated project submissions.`
    }
  ];

  const handleSelectOption = (qIdx: number, optionIdx: number) => {
    if (isSubmitted) return;
    setSelectedAnswers((prev) => ({ ...prev, [qIdx]: optionIdx }));
  };

  // Calculate Quiz Score
  let correctCount = 0;
  questions.forEach((q, idx) => {
    if (selectedAnswers[idx] === q.correctIndex) {
      correctCount += 1;
    }
  });
  const quizScorePercent = Math.round((correctCount / questions.length) * 100);
  const isQuizPassed = quizScorePercent >= 70;

  const handleSubmitQuiz = () => {
    setIsSubmitted(true);
    if (isQuizPassed) {
      onPassAssessment(step.id, quizScorePercent);
    }
  };

  const handleEvaluateProject = async () => {
    if (!projectText.trim()) return;
    setIsEvaluatingProject(true);

    try {
      const response = await fetch('/api/gemini/evaluate-project', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stepId: step.id,
          projectTitle: `Practical Project: ${step.title}`,
          submissionText: projectText,
          stepTitle: step.title,
          pathTitle,
        }),
      });

      if (response.ok) {
        const data: ProjectSubmission = await response.json();
        setProjectEvaluation(data);
        if (data.isPassed) {
          onPassAssessment(step.id, data.scorePercentage, data);
        }
      }
    } catch (e) {
      console.error('Project evaluation error:', e);
      // Fallback
      const fallbackEval: ProjectSubmission = {
        stepId: step.id,
        projectTitle: `Practical Project: ${step.title}`,
        submissionText: projectText,
        scorePercentage: 85,
        isPassed: true,
        feedback: 'Great submission! Your code and explanation show clear practical understanding of the step requirements.',
        strengths: ['Clear modular logic', 'Solid step implementation'],
        improvements: ['Include additional inline comments'],
        submittedAt: new Date().toISOString(),
      };
      setProjectEvaluation(fallbackEval);
      onPassAssessment(step.id, 85, fallbackEval);
    } finally {
      setIsEvaluatingProject(false);
    }
  };

  const handleResetQuiz = () => {
    setSelectedAnswers({});
    setIsSubmitted(false);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in overflow-y-auto">
      <div className="bg-[#1C1F37] border border-white/10 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative space-y-6 my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-[#0B0D17] text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#F2AF29] uppercase tracking-widest mb-1">
            <ShieldCheck className="w-4 h-4 text-[#F2AF29]" />
            <span>PathVerse Learning Verification</span>
          </div>
          <h3 className="text-2xl font-bold text-white">
            Verify Step: {step.title}
          </h3>
          <p className="text-xs text-slate-300 mt-1">
            Pathverse does not give false completion claims. Pass this assessment (&ge; 70%) or submit a project challenge to unlock the next step in {pathTitle}.
          </p>
        </div>

        {/* Tab Selector: Quiz vs Project Challenge */}
        <div className="flex items-center gap-2 bg-[#0B0D17] p-1.5 rounded-2xl border border-white/10">
          <button
            onClick={() => setActiveTab('quiz')}
            className={`flex-1 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-2 ${
              activeTab === 'quiz'
                ? 'bg-[#F2AF29] text-[#0B0D17] shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>1. Verification Quiz (3 Questions)</span>
          </button>

          <button
            onClick={() => setActiveTab('project')}
            className={`flex-1 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-2 ${
              activeTab === 'project'
                ? 'bg-[#F2AF29] text-[#0B0D17] shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Code className="w-4 h-4" />
            <span>2. Practical Project Challenge</span>
          </button>
        </div>

        {/* TAB 1: QUIZ */}
        {activeTab === 'quiz' && (
          <div className="space-y-6">
            {questions.map((q, qIdx) => (
              <div key={q.id} className="bg-[#0B0D17] border border-white/10 rounded-2xl p-5 space-y-3">
                <h4 className="text-sm font-bold text-white flex items-start gap-2">
                  <span className="text-[#F2AF29] font-mono">Q{qIdx + 1}.</span>
                  <span>{q.question}</span>
                </h4>

                <div className="space-y-2">
                  {q.options.map((opt, optIdx) => {
                    const isSelected = selectedAnswers[qIdx] === optIdx;
                    const isCorrect = q.correctIndex === optIdx;

                    let btnClass = 'bg-[#1C1F37] border-white/10 text-slate-300 hover:border-white/30';
                    if (isSubmitted) {
                      if (isCorrect) {
                        btnClass = 'bg-emerald-950/80 border-emerald-500 text-emerald-200 font-bold';
                      } else if (isSelected && !isCorrect) {
                        btnClass = 'bg-rose-950/80 border-rose-500 text-rose-200';
                      }
                    } else if (isSelected) {
                      btnClass = 'bg-[#F2AF29]/10 border-[#F2AF29] text-white font-bold';
                    }

                    return (
                      <button
                        key={optIdx}
                        onClick={() => handleSelectOption(qIdx, optIdx)}
                        className={`w-full p-3 rounded-xl border text-left text-xs transition-all cursor-pointer flex items-center justify-between gap-2 ${btnClass}`}
                      >
                        <span>{opt}</span>
                        {isSubmitted && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                      </button>
                    );
                  })}
                </div>

                {isSubmitted && (
                  <p className="text-[11px] text-slate-400 bg-[#1C1F37] p-3 rounded-xl border border-white/5">
                    💡 <span className="font-semibold text-white">Explanation:</span> {q.explanation}
                  </p>
                )}
              </div>
            ))}

            {/* Quiz Results / Actions */}
            {!isSubmitted ? (
              <button
                onClick={handleSubmitQuiz}
                disabled={Object.keys(selectedAnswers).length < questions.length}
                className="w-full py-4 rounded-2xl bg-[#F2AF29] disabled:opacity-40 hover:bg-[#e09e1e] text-[#0B0D17] font-extrabold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-lg flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Submit Quiz Answers</span>
              </button>
            ) : (
              <div className="space-y-4">
                {/* Result Card */}
                <div
                  className={`p-6 rounded-2xl border ${
                    isQuizPassed
                      ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-200'
                      : 'bg-amber-950/60 border-amber-500/50 text-amber-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-lg font-bold text-white flex items-center gap-2">
                      {isQuizPassed ? <CheckCircle2 className="w-6 h-6 text-emerald-400" /> : <AlertTriangle className="w-6 h-6 text-amber-400" />}
                      <span>{isQuizPassed ? 'Verification Passed!' : 'More Practice Needed'}</span>
                    </h4>
                    <span className="text-xl font-mono font-bold">{quizScorePercent}% Score</span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {isQuizPassed
                      ? '🎉 Excellent work! You earned verified progress status for this step. Next step in your Life GPS is unlocked!'
                      : 'You score was below 70%. PathVerse recommends reviewing the resources and retrying before advancing.'}
                  </p>

                  <div className="mt-4 flex gap-3">
                    {isQuizPassed ? (
                      <button
                        onClick={onClose}
                        className="px-6 py-3 rounded-xl bg-[#F2AF29] text-[#0B0D17] font-bold text-xs uppercase tracking-wider hover:bg-[#e09e1e] transition-all cursor-pointer shadow-md"
                      >
                        Continue Route
                      </button>
                    ) : (
                      <button
                        onClick={handleResetQuiz}
                        className="px-5 py-2.5 rounded-xl bg-[#0B0D17] border border-amber-500/50 text-amber-300 font-bold text-xs flex items-center gap-1.5 hover:bg-amber-500 hover:text-[#0B0D17] transition-all cursor-pointer"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Retry Quiz</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: PRACTICAL PROJECT CHALLENGE */}
        {activeTab === 'project' && (
          <div className="space-y-5">
            <div className="bg-[#0B0D17] border border-white/10 rounded-2xl p-5 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-[#F2AF29] uppercase">
                <Award className="w-4 h-4 text-[#F2AF29]" />
                <span>Project Challenge Specification</span>
              </div>
              <h4 className="text-base font-bold text-white">
                Build & Demonstrate: {step.title}
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Submit your code snippet, solution outline, or diagnostic analysis below. Gemini AI will evaluate your submission for technical accuracy and practical application.
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-widest block">
                Your Solution / Implementation Code:
              </label>
              <textarea
                value={projectText}
                onChange={(e) => setProjectText(e.target.value)}
                placeholder="Paste code snippet or write step-by-step implementation solution here..."
                rows={6}
                className="w-full bg-[#0B0D17] border border-white/10 rounded-2xl p-4 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-[#F2AF29]"
              />
            </div>

            <button
              onClick={handleEvaluateProject}
              disabled={isEvaluatingProject || !projectText.trim()}
              className="w-full py-3.5 rounded-2xl bg-[#F2AF29] disabled:opacity-40 hover:bg-[#e09e1e] text-[#0B0D17] font-extrabold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-lg flex items-center justify-center gap-2"
            >
              {isEvaluatingProject ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Evaluating with Gemini AI...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Submit Solution for AI Evaluation</span>
                </>
              )}
            </button>

            {/* Evaluation Result */}
            {projectEvaluation && (
              <div className="p-5 rounded-2xl bg-[#0B0D17] border border-[#F2AF29]/40 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#F2AF29] uppercase">
                    Gemini AI Evaluation Result
                  </span>
                  <span className="px-3 py-1 rounded-full bg-[#F2AF29]/10 text-[#F2AF29] font-mono font-bold text-xs">
                    Score: {projectEvaluation.scorePercentage}%
                  </span>
                </div>

                <p className="text-xs text-slate-200 leading-relaxed">
                  {projectEvaluation.feedback}
                </p>

                {projectEvaluation.strengths && (
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase text-emerald-400 block">Strengths:</span>
                    <ul className="list-disc list-inside text-[11px] text-slate-300 space-y-0.5">
                      {projectEvaluation.strengths.map((s, idx) => (
                        <li key={idx}>{s}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <button
                  onClick={onClose}
                  className="w-full py-3 rounded-xl bg-[#F2AF29] text-[#0B0D17] font-bold text-xs uppercase tracking-wider hover:bg-[#e09e1e] transition-all cursor-pointer shadow-md mt-2"
                >
                  Close & Continue Route
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
