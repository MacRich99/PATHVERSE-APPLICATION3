import React, { useState } from 'react';
import { Compass, Mail, Lock, User as UserIcon, ArrowRight, Chrome, ShieldCheck, UserCheck, Sparkles } from 'lucide-react';
import { UserProfile } from '../types';

interface AuthScreenProps {
  onAuthenticate: (user: Partial<UserProfile>, isNewUser: boolean) => void;
  onBackToWelcome: () => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({
  onAuthenticate,
  onBackToWelcome,
}) => {
  const [mode, setMode] = useState<'signup' | 'login'>('signup');
  const [accountType, setAccountType] = useState<'user' | 'admin'>('user');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in both email and password.');
      return;
    }

    if (mode === 'signup' && !name) {
      setError('Please enter your name.');
      return;
    }

    const isAdmin = accountType === 'admin' || email.toLowerCase().includes('admin');

    // Process authentication
    const userPayload: Partial<UserProfile> = {
      email,
      name: name || (isAdmin ? 'Admin' : email.split('@')[0]),
      role: isAdmin ? 'admin' : 'user',
      stageLevel: isAdmin ? 'Master' : 'Explorer',
      yearBadge: 'League of 2026',
      fieldOfStudy: isAdmin ? 'System & Operations' : 'Tech & AI',
      hasCompletedOnboarding: mode === 'login' || isAdmin,
    };

    onAuthenticate(userPayload, mode === 'signup');
  };

  const handleQuickAccount = (role: 'user' | 'admin') => {
    if (role === 'admin') {
      const adminUser: Partial<UserProfile> = {
        id: `admin-${Date.now()}`,
        name: 'Sarah Jenkins (Admin)',
        email: 'admin@pathverse.app',
        role: 'admin',
        age: 28,
        country: 'United States',
        stage: 'Working',
        interests: ['System Architecture', 'EdTech Analytics', 'Platform Scaling'],
        enjoyText: 'Managing PathVerse operations, analyzing learner metrics, and scaling AI courses.',
        futureGoals: 'Empower millions of self-driven learners worldwide with stress-free AI tools.',
        stageLevel: 'Master',
        yearBadge: 'League of 2026',
        fieldOfStudy: 'System & Operations',
        hasCompletedOnboarding: true,
        unlockedPathIds: ['path-ai-dev', 'path-ux-design', 'path-mobile-dev', 'path-fullstack'],
      };
      onAuthenticate(adminUser, false);
    } else {
      const learnerUser: Partial<UserProfile> = {
        id: `user-${Date.now()}`,
        name: 'Alex Rivera (Learner)',
        email: 'alex.user@pathverse.app',
        role: 'user',
        age: 19,
        country: 'Ghana',
        stage: 'University',
        interests: ['Software Engineering', 'AI Agents', 'UI Design'],
        enjoyText: 'Building micro-web apps, learning prompt engineering, and exploring career options.',
        futureGoals: 'Become a successful fullstack AI developer and launch my own venture.',
        stageLevel: 'Explorer',
        yearBadge: 'League of 2026',
        fieldOfStudy: 'Tech & AI',
        hasCompletedOnboarding: true,
        unlockedPathIds: [],
      };
      onAuthenticate(learnerUser, false);
    }
  };

  const handleGoogleSignIn = () => {
    // Simulate Google OAuth
    const googleUser: Partial<UserProfile> = {
      email: 'alex.google@example.com',
      name: 'Alex Rivera',
      role: 'user',
      stageLevel: 'Explorer',
      hasCompletedOnboarding: false,
    };
    onAuthenticate(googleUser, true);
  };

  return (
    <div className="min-h-[80vh] flex flex-col justify-center items-center px-4 py-8 max-w-md mx-auto">
      <div className="w-full bg-[#1C1F37] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl relative">
        {/* Header Icon */}
        <div className="flex flex-col items-center mb-6 text-center">
          <div className="w-12 h-12 rounded-2xl bg-[#0B0D17] border border-[#F2AF29]/40 flex items-center justify-center text-[#F2AF29] mb-3 shadow-lg">
            <Compass className="w-6 h-6 stroke-[2.2]" />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            {mode === 'signup' ? 'Create Your Account' : 'Welcome Back'}
          </h2>
          <p className="text-xs text-slate-300 mt-1 opacity-80">
            {mode === 'signup'
              ? 'Choose your account type to start or manage learning paths.'
              : 'Log in to continue your career discovery journey.'}
          </p>
        </div>

        {/* Mode Switcher */}
        <div className="grid grid-cols-2 bg-[#0B0D17] p-1.5 rounded-2xl mb-5 border border-white/10 text-xs font-semibold">
          <button
            type="button"
            onClick={() => {
              setMode('signup');
              setError('');
            }}
            className={`py-2 rounded-xl transition-all uppercase tracking-wider cursor-pointer ${
              mode === 'signup'
                ? 'bg-[#F2AF29] text-[#0B0D17] font-bold shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Sign Up
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setError('');
            }}
            className={`py-2 rounded-xl transition-all uppercase tracking-wider cursor-pointer ${
              mode === 'login'
                ? 'bg-[#F2AF29] text-[#0B0D17] font-bold shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Log In
          </button>
        </div>

        {/* Account Role Switcher (User vs Admin) */}
        <div className="mb-5 bg-[#0B0D17]/80 p-2 rounded-2xl border border-white/10 space-y-1.5">
          <span className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 px-1">
            Account Role Type
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setAccountType('user')}
              className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2 ${
                accountType === 'user'
                  ? 'bg-[#1C1F37] border-[#F2AF29] text-white shadow-md'
                  : 'bg-transparent border-white/5 text-slate-400 hover:text-slate-200'
              }`}
            >
              <UserCheck className={`w-4 h-4 shrink-0 ${accountType === 'user' ? 'text-[#F2AF29]' : 'text-slate-500'}`} />
              <div>
                <p className="text-xs font-bold leading-none">Learner User</p>
                <p className="text-[9px] text-slate-400 mt-0.5">Standard Access</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setAccountType('admin')}
              className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2 ${
                accountType === 'admin'
                  ? 'bg-[#1C1F37] border-emerald-400 text-white shadow-md'
                  : 'bg-transparent border-white/5 text-slate-400 hover:text-slate-200'
              }`}
            >
              <ShieldCheck className={`w-4 h-4 shrink-0 ${accountType === 'admin' ? 'text-emerald-400' : 'text-slate-500'}`} />
              <div>
                <p className="text-xs font-bold leading-none">System Admin</p>
                <p className="text-[9px] text-emerald-400 mt-0.5">Analytics & Control</p>
              </div>
            </button>
          </div>
        </div>

        {/* Error alert */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs">
            {error}
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div>
              <label className="block text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-1">
                Your Preferred Name
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={accountType === 'admin' ? 'e.g. Sarah (Admin)' : 'e.g. Alex Rivera'}
                  className="w-full pl-10 pr-3 py-3 rounded-2xl bg-[#0B0D17] border border-white/10 text-white placeholder-slate-600 text-xs focus:outline-none focus:border-[#F2AF29] transition-colors"
                  required
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={accountType === 'admin' ? 'admin@pathverse.app' : 'user@pathverse.app'}
                className="w-full pl-10 pr-3 py-3 rounded-2xl bg-[#0B0D17] border border-white/10 text-white placeholder-slate-600 text-xs focus:outline-none focus:border-[#F2AF29] transition-colors"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-3 py-3 rounded-2xl bg-[#0B0D17] border border-white/10 text-white placeholder-slate-600 text-xs focus:outline-none focus:border-[#F2AF29] transition-colors"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-2xl bg-[#F2AF29] hover:bg-[#e09e1e] text-[#0B0D17] font-bold text-xs uppercase tracking-wider shadow-lg shadow-[#F2AF29]/20 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            <span>
              {mode === 'signup'
                ? `Create ${accountType === 'admin' ? 'Admin' : 'User'} Account`
                : `Log In as ${accountType === 'admin' ? 'Admin' : 'User'}`}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10"></div>
          </div>
          <div className="relative flex justify-center text-[10px] uppercase tracking-widest">
            <span className="bg-[#1C1F37] px-3 text-slate-400 font-bold">
              Instant One-Click Account Access
            </span>
          </div>
        </div>

        {/* Fast Account Switcher Buttons */}
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickAccount('user')}
              className="p-3 rounded-2xl bg-[#0B0D17] hover:bg-[#151829] border border-[#F2AF29]/40 text-left transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-1.5 mb-1">
                <UserCheck className="w-3.5 h-3.5 text-[#F2AF29]" />
                <span className="text-[11px] font-bold text-white group-hover:text-[#F2AF29]">User Account</span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono">alex.user@pathverse.app</p>
            </button>

            <button
              type="button"
              onClick={() => handleQuickAccount('admin')}
              className="p-3 rounded-2xl bg-[#0B0D17] hover:bg-[#151829] border border-emerald-500/40 text-left transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-1.5 mb-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-[11px] font-bold text-white group-hover:text-emerald-400">Admin Account</span>
              </div>
              <p className="text-[10px] text-emerald-300 font-mono">admin@pathverse.app</p>
            </button>
          </div>

          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="w-full py-2.5 rounded-2xl bg-[#0B0D17] hover:bg-[#151829] border border-white/10 text-slate-300 text-xs font-semibold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <Chrome className="w-4 h-4 text-[#F2AF29]" />
            <span>Sign in with Google</span>
          </button>
        </div>

        {/* Back Link */}
        <div className="mt-5 text-center">
          <button
            onClick={onBackToWelcome}
            className="text-xs text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
          >
            ← Back to Welcome Screen
          </button>
        </div>
      </div>
    </div>
  );
};

