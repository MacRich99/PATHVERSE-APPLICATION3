import React, { useState } from 'react';
import { Sparkles, ArrowRight, ArrowLeft, CheckCircle2, Star, Award, Compass, Brain, Zap, Target, BarChart2 } from 'lucide-react';
import { UserProfile } from '../types';

interface AiDiagnosticQuizProps {
  user: UserProfile;
  onQuizComplete: (quizData: {
    scores: Record<string, number>;
    strengths: string[];
    primaryInterest: string;
  }) => void;
  onSkipQuiz?: () => void;
}

interface QuizQuestion {
  id: number;
  category: 'instinct' | 'flow' | 'value' | 'role' | 'learning' | 'future';
  question: string;
  subtitle: string;
  options: {
    label: string;
    description: string;
    scores: {
      analytical?: number;
      creative?: number;
      technical?: number;
      leadership?: number;
      empathetic?: number;
    };
  }[];
}

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    category: 'instinct',
    question: 'When faced with an unfamiliar complex challenge, what is your immediate instinct?',
    subtitle: 'This identifies your baseline problem-solving cognitive orientation.',
    options: [
      {
        label: 'Break it into logical steps & data points',
        description: 'Systematically analyze root causes and inspect numbers or logic.',
        scores: { analytical: 25, technical: 15 },
      },
      {
        label: 'Brainstorm creative, out-of-the-box angles',
        description: 'Visualize novel designs or unconventional human-centered workarounds.',
        scores: { creative: 25, empathetic: 10 },
      },
      {
        label: 'Open a code editor or hands-on workbench',
        description: 'Start experimenting directly with code, tools, or physical prototypes.',
        scores: { technical: 25, analytical: 10 },
      },
      {
        label: 'Rally people & coordinate a team strategy',
        description: 'Gather perspectives, align goals, and assign roles effectively.',
        scores: { leadership: 25, empathetic: 15 },
      },
    ],
  },
  {
    id: 2,
    category: 'flow',
    question: 'Which activity makes time pass by fastest for you?',
    subtitle: 'Flow states reveal where your intrinsic curiosity naturally thrives.',
    options: [
      {
        label: 'Building tools, debugging code, or tinkering with tech',
        description: 'Creating functional mechanisms that run smoothly and solve tasks.',
        scores: { technical: 25, analytical: 10 },
      },
      {
        label: 'Designing visuals, UI layouts, or artistic media',
        description: 'Crafting aesthetic harmonies, typography, or visual storytelling.',
        scores: { creative: 25, empathetic: 10 },
      },
      {
        label: 'Analyzing trends, solving puzzles, or managing budgets',
        description: 'Uncovering hidden insights, financial growth, or structured patterns.',
        scores: { analytical: 25, leadership: 10 },
      },
      {
        label: 'Mentoring others, writing stories, or leading discussions',
        description: 'Empowering people, explaining ideas, or advocating for causes.',
        scores: { empathetic: 25, leadership: 15 },
      },
    ],
  },
  {
    id: 3,
    category: 'value',
    question: 'What outcome would give you the deepest sense of professional pride?',
    subtitle: 'Understanding your core values guides your long-term career satisfaction.',
    options: [
      {
        label: 'Creating an app or platform used by thousands of people',
        description: 'Delivering real technical utility and robust digital infrastructure.',
        scores: { technical: 20, leadership: 15 },
      },
      {
        label: 'Designing an iconic experience or brand loved by users',
        description: 'Setting new aesthetic standards and crafting delightful interactions.',
        scores: { creative: 25, empathetic: 10 },
      },
      {
        label: 'Solving a high-stakes analytical or business decision',
        description: 'Optimizing systems, unlocking revenue, or curing scientific bottlenecks.',
        scores: { analytical: 25, leadership: 10 },
      },
      {
        label: 'Improving health, education, or community well-being',
        description: 'Directly lifting people’s lives through care, policy, or coaching.',
        scores: { empathetic: 25, leadership: 10 },
      },
    ],
  },
  {
    id: 4,
    category: 'role',
    question: 'In a group project or startup team, which role do you naturally step into?',
    subtitle: 'This highlights your practical execution style in collaborative environments.',
    options: [
      {
        label: 'System Architect / Technical Specialist',
        description: 'Focus on core functionality, technical architecture, and reliability.',
        scores: { technical: 20, analytical: 15 },
      },
      {
        label: 'Product Lead / Team Strategist',
        description: 'Set priorities, pitch vision, and keep everyone focused on success.',
        scores: { leadership: 25, analytical: 10 },
      },
      {
        label: 'UI/UX Designer / Creative Director',
        description: 'Shape how the product looks, feels, and communicates with humans.',
        scores: { creative: 25, empathetic: 10 },
      },
      {
        label: 'Research Analyst / Insights Specialist',
        description: 'Conduct deep investigations, validate facts, and measure performance.',
        scores: { analytical: 25, technical: 10 },
      },
    ],
  },
  {
    id: 5,
    category: 'learning',
    question: 'How do you absorb complex new concepts most effectively?',
    subtitle: 'Your preferred learning style ensures sustainable skill acquisition.',
    options: [
      {
        label: 'Reading deep-dive articles & technical whitepapers',
        description: 'Analyzing structured explanations and case study documentation.',
        scores: { analytical: 20, technical: 15 },
      },
      {
        label: 'Building hands-on starter projects immediately',
        description: 'Trial and error: breaking things and putting them back together.',
        scores: { technical: 25, creative: 10 },
      },
      {
        label: 'Visual diagrams, video breakdowns & mind maps',
        description: 'Seeing relationships drawn out visually before building.',
        scores: { creative: 20, analytical: 10 },
      },
      {
        label: 'Interactive discussions & mentorship Q&A',
        description: 'Talking through concepts, asking questions, and getting guidance.',
        scores: { empathetic: 20, leadership: 15 },
      },
    ],
  },
  {
    id: 6,
    category: 'future',
    question: 'Which environment best describes your ideal future work setup?',
    subtitle: 'This aligns your trajectory with real-world industry culture.',
    options: [
      {
        label: 'High-growth Tech Startup or Engineering Lab',
        description: 'Fast-paced, cutting-edge tools, high technical autonomy.',
        scores: { technical: 20, leadership: 15 },
      },
      {
        label: 'Creative Design Studio or Media House',
        description: 'Expressive, visual, collaborative, brand-oriented culture.',
        scores: { creative: 25, empathetic: 10 },
      },
      {
        label: 'Strategic Analytics Firm or Financial Venture',
        description: 'Data-driven decision making, market impact, high earning potential.',
        scores: { analytical: 25, leadership: 15 },
      },
      {
        label: 'Global Impact Org, Health Center, or Advisory',
        description: 'Purpose-driven, community focused, direct human impact.',
        scores: { empathetic: 25, leadership: 10 },
      },
    ],
  },
];

export const AiDiagnosticQuiz: React.FC<AiDiagnosticQuizProps> = ({
  user,
  onQuizComplete,
  onSkipQuiz,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>(Array(QUIZ_QUESTIONS.length).fill(-1));
  const [isFinished, setIsFinished] = useState(false);

  const question = QUIZ_QUESTIONS[currentStep];

  const handleSelectOption = (optionIndex: number) => {
    const updated = [...answers];
    updated[currentStep] = optionIndex;
    setAnswers(updated);
  };

  const handleNext = () => {
    if (currentStep < QUIZ_QUESTIONS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsFinished(true);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Calculate Scores & Strengths
  const calculateResults = () => {
    const scores = {
      analytical: 20,
      creative: 20,
      technical: 20,
      leadership: 20,
      empathetic: 20,
    };

    answers.forEach((ansIdx, qIdx) => {
      if (ansIdx >= 0) {
        const q = QUIZ_QUESTIONS[qIdx];
        const selectedOption = q.options[ansIdx];
        if (selectedOption?.scores) {
          Object.entries(selectedOption.scores).forEach(([domain, pt]) => {
            if (pt) {
              scores[domain as keyof typeof scores] = (scores[domain as keyof typeof scores] || 0) + pt;
            }
          });
        }
      }
    });

    // Determine Top Strengths
    const sortedDomains = Object.entries(scores).sort((a, b) => b[1] - a[1]);
    
    const domainLabels: Record<string, string> = {
      analytical: 'Analytical & Logical Reasoning',
      creative: 'Creative & Visual Innovation',
      technical: 'Systems & Technical Engineering',
      leadership: 'Strategic & Entrepreneurial Drive',
      empathetic: 'Human-Centered & Communication Mastery',
    };

    const topStrengths = sortedDomains.slice(0, 3).map(([key]) => domainLabels[key]);
    const topDomainKey = sortedDomains[0][0];

    const interestMap: Record<string, string> = {
      technical: 'Software, AI & Data Engineering',
      creative: 'Design Systems & Creative Arts',
      analytical: 'Data Analytics & Strategic Business',
      leadership: 'Entrepreneurship & Product Leadership',
      empathetic: 'Healthcare, Biotech & Public Policy',
    };

    return {
      scores,
      sortedDomains,
      domainLabels,
      topStrengths,
      primaryInterest: interestMap[topDomainKey] || 'Technology & Innovation',
    };
  };

  const results = calculateResults();

  const handleFinishSubmit = () => {
    onQuizComplete({
      scores: results.scores,
      strengths: results.topStrengths,
      primaryInterest: results.primaryInterest,
    });
  };

  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center px-4 py-8 max-w-2xl mx-auto animate-fade-in">
      <div className="w-full bg-[#1C1F37] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        {/* Background Subtle Accent Glow */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-[#F2AF29]/5 rounded-full blur-3xl pointer-events-none"></div>

        {!isFinished ? (
          <div className="space-y-6">
            {/* Header Badge & Progress Bar */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-slate-400">
                <div className="flex items-center gap-1.5 text-[#F2AF29]">
                  <Brain className="w-4 h-4 text-[#F2AF29]" />
                  <span>AI First-Time Diagnostic Quiz</span>
                </div>
                <span>Question {currentStep + 1} of {QUIZ_QUESTIONS.length}</span>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-[#0B0D17] h-2 rounded-full overflow-hidden border border-white/5">
                <div
                  className="bg-[#F2AF29] h-full transition-all duration-300 ease-out"
                  style={{ width: `${((currentStep + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Question Prompt */}
            <div className="space-y-2">
              <h2 className="text-xl sm:text-2xl font-bold text-white leading-snug">
                {question.question}
              </h2>
              <p className="text-xs text-slate-400">
                {question.subtitle}
              </p>
            </div>

            {/* Answer Options */}
            <div className="space-y-3 pt-2">
              {question.options.map((option, idx) => {
                const isSelected = answers[currentStep] === idx;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectOption(idx)}
                    className={`w-full p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-start justify-between gap-3 ${
                      isSelected
                        ? 'bg-[#0B0D17] border-[#F2AF29] text-white shadow-lg shadow-[#F2AF29]/10 ring-1 ring-[#F2AF29]'
                        : 'bg-[#0B0D17]/60 border-white/10 text-slate-300 hover:border-white/20 hover:bg-[#0B0D17]'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="text-xs font-bold flex items-center gap-2">
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                          isSelected ? 'bg-[#F2AF29] text-[#0B0D17]' : 'bg-white/10 text-slate-400'
                        }`}>
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span className={isSelected ? 'text-[#F2AF29]' : 'text-white'}>
                          {option.label}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed pl-7">
                        {option.description}
                      </p>
                    </div>

                    {isSelected && (
                      <CheckCircle2 className="w-5 h-5 text-[#F2AF29] shrink-0 mt-0.5" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Navigation Row */}
            <div className="flex items-center justify-between pt-6 border-t border-white/10">
              {currentStep > 0 ? (
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-4 py-2.5 rounded-xl border border-white/10 bg-[#0B0D17] text-slate-300 hover:text-white text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4 text-[#F2AF29]" />
                  <span>Previous</span>
                </button>
              ) : onSkipQuiz ? (
                <button
                  type="button"
                  onClick={onSkipQuiz}
                  className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
                >
                  Skip diagnostic quiz
                </button>
              ) : (
                <div></div>
              )}

              <button
                type="button"
                onClick={handleNext}
                disabled={answers[currentStep] === -1}
                className={`px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
                  answers[currentStep] !== -1
                    ? 'bg-[#F2AF29] hover:bg-[#e09e1e] text-[#0B0D17] shadow-lg shadow-[#F2AF29]/20'
                    : 'bg-white/10 text-slate-500 cursor-not-allowed'
                }`}
              >
                <span>{currentStep === QUIZ_QUESTIONS.length - 1 ? 'View AI Diagnostic Results' : 'Next Question'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          /* Diagnostic Summary Screen */
          <div className="space-y-6 animate-fade-in text-center sm:text-left">
            <div className="flex flex-col sm:flex-row items-center gap-4 pb-6 border-b border-white/10">
              <div className="w-14 h-14 rounded-2xl bg-[#F2AF29]/10 border border-[#F2AF29]/30 flex items-center justify-center text-[#F2AF29] shrink-0">
                <Sparkles className="w-7 h-7" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-[#F2AF29] uppercase tracking-widest block mb-0.5">
                  Diagnostic Analysis Complete
                </span>
                <h2 className="text-2xl font-extrabold text-white">
                  Your Core Strengths Profile
                </h2>
                <p className="text-xs text-slate-400">
                  Calculated systematically based on your problem-solving instinct and flow-state responses.
                </p>
              </div>
            </div>

            {/* Strengths Meter List */}
            <div className="space-y-4">
              <h3 className="text-xs uppercase tracking-widest font-bold text-slate-400 flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-[#F2AF29]" />
                <span>Cognitive Strengths Matrix</span>
              </h3>

              <div className="grid gap-3">
                {results.sortedDomains.map(([key, score]) => {
                  const label = results.domainLabels[key];
                  const maxPossible = 120;
                  const percent = Math.min(100, Math.round((score / maxPossible) * 100));

                  return (
                    <div key={key} className="bg-[#0B0D17] border border-white/10 rounded-2xl p-4 space-y-2">
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span className="text-white">{label}</span>
                        <span className="text-[#F2AF29] font-mono">{percent}% Match</span>
                      </div>
                      <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden border border-white/5">
                        <div
                          className="bg-[#F2AF29] h-full rounded-full transition-all duration-500"
                          style={{ width: `${percent}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Primary Domain Recommendation Badge */}
            <div className="bg-[#0B0D17] border border-[#F2AF29]/50 rounded-2xl p-5 space-y-2 relative overflow-hidden bg-gradient-to-r from-[#0B0D17] to-[#1C1F37]">
              <div className="flex items-center gap-2 text-[#F2AF29] text-xs font-black uppercase tracking-wider">
                <Compass className="w-4 h-4" />
                <span>Primary Diagnostic Path Recommendation</span>
              </div>
              <h4 className="text-xl font-extrabold text-white">
                {results.primaryInterest}
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed opacity-90">
                Your diagnostic responses directly analyzed your cognitive flow and problem-solving style, highlighting a high-confidence match for <span className="text-[#F2AF29] font-bold">{results.primaryInterest}</span>. You will now be directed to explore tailored growth paths suited to your interests.
              </p>
            </div>

            {/* Action CTA */}
            <button
              onClick={handleFinishSubmit}
              className="w-full py-4 rounded-2xl bg-[#F2AF29] hover:bg-[#e09e1e] text-[#0B0D17] font-black text-sm uppercase tracking-wider shadow-xl shadow-[#F2AF29]/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-5 h-5 fill-[#0B0D17]" />
              <span>Directly Explore {results.primaryInterest} Path →</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
