import React, { useState } from 'react';
import { ArrowRight, ArrowLeft, CheckCircle2, Sparkles, Heart, Compass, Globe, User, HelpCircle } from 'lucide-react';
import { UserProfile, CurrentStage } from '../types';

interface OnboardingFlowProps {
  user: UserProfile;
  onComplete: (updatedProfile: UserProfile) => void;
}

const STAGE_OPTIONS: CurrentStage[] = [
  'Exploring',
  'High School',
  'University',
  'Working',
  'Changing direction',
];

const INTEREST_OPTIONS = [
  'Technology & Software',
  'Medicine & Healthcare',
  'Business & Entrepreneurship',
  'Finance & Economics',
  'Engineering & Robotics',
  'Science & Biotech',
  'Design & Creative Arts',
  'Psychology & Wellness',
  'Law & Public Policy',
  'Data Science & AI',
  'Education & Coaching',
  'Media & Communications',
];

export const OnboardingFlow: React.FC<OnboardingFlowProps> = ({
  user,
  onComplete,
}) => {
  const [step, setStep] = useState(1);

  // Form State
  const [name, setName] = useState(user.name || '');
  const [age, setAge] = useState<number>(user.age || 18);
  const [country, setCountry] = useState(user.country || 'United States');
  const [stage, setStage] = useState<CurrentStage>(user.stage || 'Exploring');
  const [interests, setInterests] = useState<string[]>(
    user.interests && user.interests.length > 0
      ? user.interests
      : ['Technology', 'Design']
  );
  const [enjoyText, setEnjoyText] = useState(
    user.enjoyText || 'I enjoy building creative digital tools, drawing UI mockups, and exploring how tech solves real-world problems.'
  );
  const [futureGoals, setFutureGoals] = useState(
    user.futureGoals || 'I want financial stability, freedom to work on meaningful projects, and skills that make an impact.'
  );

  const toggleInterest = (option: string) => {
    if (interests.includes(option)) {
      setInterests(interests.filter((i) => i !== option));
    } else {
      setInterests([...interests, option]);
    }
  };

  const handleNext = () => {
    if (step < 5) {
      setStep(step + 1);
    } else {
      // Complete Onboarding
      const updatedProfile: UserProfile = {
        ...user,
        name: name || 'Friend',
        age: Number(age) || 18,
        country: country || 'Global',
        stage,
        interests: interests.length > 0 ? interests : ['Technology'],
        enjoyText: enjoyText || 'I enjoy learning new concepts and creating things.',
        futureGoals: futureGoals || 'I want to build a career I love.',
        hasCompletedOnboarding: true,
        stageLevel: 'Explorer',
        unlockedPathIds: user.unlockedPathIds || [],
      };

      onComplete(updatedProfile);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center px-4 py-8 max-w-xl mx-auto">
      <div className="w-full bg-[#1C1F37] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl relative">
        {/* Step Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">
            <span className="text-[#F2AF29]">Step {step} of 5</span>
            <span>{Math.round((step / 5) * 100)}% Complete</span>
          </div>
          <div className="w-full bg-[#0B0D17] h-2 rounded-full overflow-hidden border border-white/5">
            <div
              className="bg-[#F2AF29] h-full transition-all duration-300 ease-out"
              style={{ width: `${(step / 5) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* STEP 1: BASICS */}
        {step === 1 && (
          <div className="space-y-5 animate-fade-in">
            <div className="flex items-center gap-2 text-[#F2AF29] font-bold text-[10px] uppercase tracking-widest">
              <User className="w-4 h-4 text-[#F2AF29]" />
              <span>Basic Information</span>
            </div>
            <h2 className="text-2xl font-bold text-white">Let's get to know you</h2>
            <p className="text-xs text-slate-400">
              We use these details to personalize your discovery paths.
            </p>

            <div className="space-y-4 pt-2">
              <div>
                <label className="block text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-1">
                  What should we call you?
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex"
                  className="w-full px-4 py-3 rounded-2xl bg-[#0B0D17] border border-white/10 text-white placeholder-slate-600 text-xs focus:outline-none focus:border-[#F2AF29]"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-1">
                  Your Age
                </label>
                <input
                  type="number"
                  min="10"
                  max="35"
                  value={age}
                  onChange={(e) => setAge(parseInt(e.target.value) || 18)}
                  className="w-full px-4 py-3 rounded-2xl bg-[#0B0D17] border border-white/10 text-white text-xs focus:outline-none focus:border-[#F2AF29]"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-1">
                  Country or Location
                </label>
                <input
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="e.g. United States, Nigeria, India..."
                  className="w-full px-4 py-3 rounded-2xl bg-[#0B0D17] border border-white/10 text-white placeholder-slate-600 text-xs focus:outline-none focus:border-[#F2AF29]"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: CURRENT STAGE */}
        {step === 2 && (
          <div className="space-y-5 animate-fade-in">
            <div className="flex items-center gap-2 text-[#F2AF29] font-bold text-[10px] uppercase tracking-widest">
              <Compass className="w-4 h-4 text-[#F2AF29]" />
              <span>Current Stage</span>
            </div>
            <h2 className="text-2xl font-bold text-white">Where are you right now?</h2>
            <p className="text-xs text-slate-400">
              Select the option that best describes your current place in life.
            </p>

            <div className="space-y-2.5 pt-2">
              {STAGE_OPTIONS.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setStage(option)}
                  className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                    stage === option
                      ? 'bg-[#0B0D17] border-[#F2AF29] text-[#F2AF29] shadow-md'
                      : 'bg-[#0B0D17] border-white/10 text-slate-300 hover:border-white/20'
                  }`}
                >
                  <span className="font-semibold text-xs">{option}</span>
                  {stage === option && (
                    <CheckCircle2 className="w-5 h-5 text-[#F2AF29] shrink-0" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 3: INTERESTS */}
        {step === 3 && (
          <div className="space-y-5 animate-fade-in">
            <div className="flex items-center gap-2 text-[#F2AF29] font-bold text-[10px] uppercase tracking-widest">
              <Sparkles className="w-4 h-4 text-[#F2AF29]" />
              <span>Fields & Interests</span>
            </div>
            <h2 className="text-2xl font-bold text-white">What fields spark your curiosity?</h2>
            <p className="text-xs text-slate-400">
              Select all that apply — you don't need prior experience in them.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2">
              {INTEREST_OPTIONS.map((interest) => {
                const isSelected = interests.includes(interest);
                return (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => toggleInterest(interest)}
                    className={`p-3 rounded-2xl border text-xs font-semibold transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'bg-[#0B0D17] border-[#F2AF29] text-[#F2AF29] shadow-sm'
                        : 'bg-[#0B0D17] border-white/10 text-slate-400 hover:border-white/20'
                    }`}
                  >
                    <span>{interest}</span>
                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-[#F2AF29] ml-1 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 4: WHAT THEY ENJOY */}
        {step === 4 && (
          <div className="space-y-5 animate-fade-in">
            <div className="flex items-center gap-2 text-[#F2AF29] font-bold text-[10px] uppercase tracking-widest">
              <Heart className="w-4 h-4 text-[#F2AF29]" />
              <span>Personal Interests & Activities</span>
            </div>
            <h2 className="text-2xl font-bold text-white">What do you naturally enjoy doing?</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Tell us about things you enjoy, subjects you like, or things you naturally spend time doing (e.g. gaming, drawing, organizing events, fixing things, tinkering with computers).
            </p>

            <div className="pt-2">
              <textarea
                rows={4}
                value={enjoyText}
                onChange={(e) => setEnjoyText(e.target.value)}
                placeholder="I love solving logical puzzles, experimenting with graphic design, and making YouTube videos..."
                className="w-full p-4 rounded-2xl bg-[#0B0D17] border border-white/10 text-white placeholder-slate-600 text-xs focus:outline-none focus:border-[#F2AF29] leading-relaxed"
              ></textarea>
            </div>
          </div>
        )}

        {/* STEP 5: FUTURE ASPIRATIONS */}
        {step === 5 && (
          <div className="space-y-5 animate-fade-in">
            <div className="flex items-center gap-2 text-[#F2AF29] font-bold text-[10px] uppercase tracking-widest">
              <Compass className="w-4 h-4 text-[#F2AF29]" />
              <span>Future Vision</span>
            </div>
            <h2 className="text-2xl font-bold text-white">What do you want from your future?</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Think about what matters to you — financial independence, creative freedom, helping your community, building products, or remote flexibility.
            </p>

            <div className="pt-2">
              <textarea
                rows={4}
                value={futureGoals}
                onChange={(e) => setFutureGoals(e.target.value)}
                placeholder="I want financial stability, a creative environment where I keep learning, and the ability to work from anywhere..."
                className="w-full p-4 rounded-2xl bg-[#0B0D17] border border-white/10 text-white placeholder-slate-600 text-xs focus:outline-none focus:border-[#F2AF29] leading-relaxed"
              ></textarea>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between mt-8 pt-4 border-t border-white/10">
          {step > 1 ? (
            <button
              type="button"
              onClick={handleBack}
              className="px-4 py-2.5 rounded-2xl border border-white/10 bg-[#0B0D17] text-slate-300 hover:text-white text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 text-[#F2AF29]" />
              <span>Back</span>
            </button>
          ) : (
            <div></div>
          )}

          <button
            type="button"
            onClick={handleNext}
            className="px-6 py-3.5 rounded-2xl bg-[#F2AF29] hover:bg-[#e09e1e] text-[#0B0D17] font-bold text-xs uppercase tracking-wider shadow-lg shadow-[#F2AF29]/20 transition-all flex items-center gap-2 cursor-pointer ml-auto"
          >
            <span>{step === 5 ? 'Complete Onboarding' : 'Next Step'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
