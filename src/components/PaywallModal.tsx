import React, { useState } from 'react';
import {
  Lock,
  Unlock,
  CheckCircle2,
  ShieldCheck,
  CreditCard,
  Sparkles,
  X,
  Smartphone,
  Gift,
  Loader2,
  Globe,
  Radio,
  Zap,
  AlertCircle,
  UserCheck,
} from 'lucide-react';
import { DiscoveredPath, UserProfile } from '../types';

interface PaywallModalProps {
  path: DiscoveredPath;
  user: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onUnlockSuccess: (pathId: string) => void;
}

type PaymentTab = 'free_mode' | 'data_bundle' | 'card';

export const PaywallModal: React.FC<PaywallModalProps> = ({
  path,
  user,
  isOpen,
  onClose,
  onUnlockSuccess,
}) => {
  const [activeTab, setActiveTab] = useState<PaymentTab>('free_mode');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const userAge = Number(user?.age) || 18;
  const isUnder15 = userAge < 15;

  // Card State
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');

  // Mobile Data Bundle State
  const [provider, setProvider] = useState('MTN');
  const [phoneOrPin, setPhoneOrPin] = useState('');
  const [bundleMb, setBundleMb] = useState('100');

  if (!isOpen) return null;

  // 1. Free Mode Unlock Handler
  const handleFreeModeUnlock = async () => {
    setIsProcessing(true);
    setError('');
    setSuccessMsg('');

    try {
      const response = await fetch('/api/free-mode/unlock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id || 'user_guest',
          userEmail: user.email || 'guest@pathverse.app',
          userName: user.name || 'Learner',
          userAge: user.age,
          pathId: path.id,
          pathTitle: path.title,
          reason: 'Junior Youth Access Scholarship (< 15 years)',
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccessMsg(data.message || 'Unlocked via Free Junior Youth Mode!');
        setTimeout(() => {
          onUnlockSuccess(path.id);
        }, 1200);
      } else {
        setError(data.error || 'Free Mode is only available for learners under 15 years old.');
      }
    } catch (err) {
      setError('Network connection error. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  // 2. Data Bundle Transfer Handler
  const handleDataBundlePayment = async () => {
    if (!phoneOrPin.trim()) {
      setError('Please enter your phone number or data voucher PIN.');
      return;
    }

    setIsProcessing(true);
    setError('');
    setSuccessMsg('');

    try {
      const response = await fetch('/api/data-bundle/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id || 'user_guest',
          userEmail: user.email || 'guest@pathverse.app',
          userName: user.name || 'Learner',
          pathId: path.id,
          pathTitle: path.title,
          provider,
          phoneOrPin: phoneOrPin.trim(),
          bundleMb: Number(bundleMb) || 100,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccessMsg(data.message || `Unlocked using ${bundleMb}MB Data Bundle!`);
        setTimeout(() => {
          onUnlockSuccess(path.id);
        }, 1200);
      } else {
        setError(data.error || 'Data bundle exchange failed. Please verify details.');
      }
    } catch (err) {
      setError('Connection issue. Please verify mobile signal.');
    } finally {
      setIsProcessing(false);
    }
  };

  // 3. Card Checkout Handler
  const handleCardPayment = async () => {
    setIsProcessing(true);
    setError('');
    setSuccessMsg('');

    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id || 'user_guest',
          userEmail: user.email || 'guest@pathverse.app',
          userName: user.name || 'Learner',
          pathId: path.id,
          pathTitle: path.title,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccessMsg('Payment successful! Unlocking path...');
        setTimeout(() => {
          onUnlockSuccess(path.id);
        }, 1000);
      } else {
        setError(data.error || 'Payment failed. Please try again.');
      }
    } catch (err) {
      setError('Network connection issue. Please check internet.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B0D17]/90 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-[#1C1F37] border border-white/10 rounded-3xl p-5 sm:p-7 shadow-2xl overflow-hidden space-y-5 max-h-[92vh] overflow-y-auto">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-[#0B0D17] border border-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5 text-[#F2AF29]" />
        </button>

        {/* Header */}
        <div className="text-center space-y-1.5 pt-1">
          <div className="w-11 h-11 rounded-2xl bg-[#0B0D17] border border-[#F2AF29]/40 flex items-center justify-center text-[#F2AF29] mx-auto shadow-lg">
            <Lock className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-bold text-white tracking-tight">
            Unlock Life GPS Route
          </h3>
          <p className="text-xs text-[#F2AF29] font-bold uppercase tracking-wider">
            {path.title}
          </p>
        </div>

        {/* Blurred Preview */}
        <div className="relative rounded-2xl bg-[#0B0D17] p-3.5 border border-white/5 overflow-hidden">
          <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
            Route Steps Preview
          </div>

          <div className="filter blur-[3px] select-none space-y-2 opacity-50">
            <div className="flex items-start gap-2.5 p-2 rounded-xl bg-[#1C1F37]">
              <span className="w-5 h-5 rounded-full bg-[#F2AF29] text-[#0B0D17] font-bold text-[10px] flex items-center justify-center shrink-0">1</span>
              <div>
                <div className="text-xs font-bold text-white">Foundations & Core Skills</div>
                <div className="text-[10px] text-slate-400">Personalized micro projects and roadmap...</div>
              </div>
            </div>
          </div>

          {/* Overlay Tag */}
          <div className="absolute inset-0 flex items-center justify-center bg-[#0B0D17]/75 backdrop-blur-[2px]">
            <span className="px-3 py-1 rounded-full bg-[#F2AF29]/20 border border-[#F2AF29]/40 text-[#F2AF29] text-xs font-bold flex items-center gap-1.5 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-[#F2AF29]" />
              <span>Full Personalized Roadmap</span>
            </span>
          </div>
        </div>

        {/* Option Tabs Selector */}
        <div className="space-y-2">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">
            Choose Your Access Method
          </div>
          <div className="grid grid-cols-3 gap-1.5 bg-[#0B0D17] p-1.5 rounded-2xl border border-white/10 text-xs">
            <button
              onClick={() => {
                setActiveTab('free_mode');
                setError('');
              }}
              className={`py-2 px-2 rounded-xl font-bold flex flex-col items-center gap-1 transition-all cursor-pointer relative ${
                activeTab === 'free_mode'
                  ? 'bg-[#F2AF29] text-[#0B0D17] shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Gift className="w-4 h-4" />
              <span className="text-[10px] leading-tight">Free Mode (&lt;15 Yrs)</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('data_bundle');
                setError('');
              }}
              className={`py-2 px-2 rounded-xl font-bold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                activeTab === 'data_bundle'
                  ? 'bg-[#F2AF29] text-[#0B0D17] shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Smartphone className="w-4 h-4" />
              <span className="text-[10px] leading-tight">Data Bundle</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('card');
                setError('');
              }}
              className={`py-2 px-2 rounded-xl font-bold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                activeTab === 'card'
                  ? 'bg-[#F2AF29] text-[#0B0D17] shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <CreditCard className="w-4 h-4" />
              <span className="text-[10px] leading-tight">Card ($4.99)</span>
            </button>
          </div>
        </div>

        {/* Status Messages */}
        {error && (
          <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs text-center font-medium">
            {error}
          </div>
        )}

        {successMsg && (
          <div className="p-3 rounded-xl bg-emerald-950/70 border border-emerald-700 text-emerald-300 text-xs text-center font-bold flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* TAB 1: FREE MODE (SPONSORED FOR LEARNERS UNDER 15 YEARS OLD) */}
        {activeTab === 'free_mode' && (
          <div className="bg-[#0B0D17] p-4 sm:p-5 rounded-2xl border border-[#F2AF29]/30 space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Gift className="w-5 h-5 text-[#F2AF29]" />
                <div>
                  <h4 className="text-sm font-bold text-white">PathVerse Junior Free Mode</h4>
                  <p className="text-[10px] text-slate-400">100% Free Sponsored Access for Learners &lt; 15 Years Old</p>
                </div>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-[10px] font-bold uppercase tracking-wider">
                FREE ($0.00)
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              PathVerse Free Mode provides 100% sponsored, free access specifically to empower young learners below 15 years old to explore careers and learn skills without financial barriers.
            </p>

            {/* Age Eligibility Check Banner */}
            {isUnder15 ? (
              <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 space-y-1">
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
                  <UserCheck className="w-4 h-4 shrink-0" />
                  <span>Eligible for Free Access (Registered Age: {userAge} yrs &lt; 15)</span>
                </div>
                <p className="text-[11px] text-emerald-200/80 leading-normal pl-6">
                  You qualify for full sponsored access as a learner under 15! Click below to unlock your route immediately.
                </p>
              </div>
            ) : (
              <div className="p-3.5 rounded-xl bg-amber-950/60 border border-amber-500/40 space-y-2">
                <div className="flex items-center gap-2 text-amber-300 text-xs font-bold">
                  <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
                  <span>Age Requirement Notice (Your Registered Age: {userAge} yrs)</span>
                </div>
                <p className="text-[11px] text-amber-100/90 leading-normal">
                  PathVerse Free Mode is strictly reserved for young learners below 15 years old. As a learner 15 or older, please use our affordable Mobile Data Bundle exchange ($1.00 USD) or Card checkout ($4.99 USD) to unlock full routes.
                </p>
                <div className="flex flex-col sm:flex-row gap-2 pt-1">
                  <button
                    onClick={() => {
                      setActiveTab('data_bundle');
                      setError('');
                    }}
                    className="flex-1 py-2 px-3 rounded-xl bg-[#F2AF29]/20 hover:bg-[#F2AF29]/30 border border-[#F2AF29]/50 text-[#F2AF29] font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>Use Data Bundle ($1)</span>
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab('card');
                      setError('');
                    }}
                    className="flex-1 py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/20 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <CreditCard className="w-3.5 h-3.5 text-[#F2AF29]" />
                    <span>Use Card ($4.99)</span>
                  </button>
                </div>
              </div>
            )}

            <button
              onClick={handleFreeModeUnlock}
              disabled={isProcessing || !isUnder15}
              className={`w-full py-3.5 rounded-2xl font-bold text-xs uppercase tracking-wider shadow-lg transition-all flex items-center justify-center gap-2 ${
                isUnder15
                  ? 'bg-[#F2AF29] hover:bg-[#e09e1e] text-[#0B0D17] cursor-pointer shadow-[#F2AF29]/20'
                  : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed opacity-60'
              }`}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-[#0B0D17]" />
                  <span>Unlocking in Free Mode...</span>
                </>
              ) : isUnder15 ? (
                <>
                  <Unlock className="w-4 h-4" />
                  <span>Unlock Path 100% Free Now (Junior Access)</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Free Mode Reserved for Below 15 Years Old</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* TAB 2: MOBILE DATA BUNDLE PAYMENT */}
        {activeTab === 'data_bundle' && (
          <div className="bg-[#0B0D17] p-4 sm:p-5 rounded-2xl border border-[#F2AF29]/30 space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-[#F2AF29]" />
                <div>
                  <h4 className="text-sm font-bold text-white">Mobile Data to Money Converter</h4>
                  <p className="text-[10px] text-slate-400">Convert Mobile Data Bundles into Cash Value</p>
                </div>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-[#F2AF29]/20 border border-[#F2AF29]/40 text-[#F2AF29] text-[10px] font-bold uppercase tracking-wider">
                Telco Exchange
              </span>
            </div>

            {/* Live Data-to-Money Conversion Calculator Box */}
            <div className="p-3 rounded-xl bg-[#1C1F37] border border-[#F2AF29]/40 flex items-center justify-between gap-3">
              <div className="space-y-0.5">
                <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider block">
                  Data-to-Money Conversion Rate
                </span>
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  <span className="text-[#F2AF29]">{bundleMb} MB Data</span>
                  <span className="text-slate-400">➔</span>
                  <span className="text-emerald-400 font-extrabold text-sm">
                    ${(Number(bundleMb) * 0.01).toFixed(2)} USD
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[10px] font-bold">
                  1 MB = $0.01 USD
                </span>
              </div>
            </div>

            <div className="space-y-2.5 text-xs">
              {/* Carrier Selector */}
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
                  Select Mobile Network Carrier
                </label>
                <select
                  value={provider}
                  onChange={(e) => setProvider(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#1C1F37] border border-white/10 text-white text-xs focus:outline-none focus:border-[#F2AF29]"
                >
                  <option value="MTN">MTN (Ghana, Nigeria, Uganda, SA)</option>
                  <option value="Telecel/Vodafone">Telecel / Vodafone</option>
                  <option value="AirtelTigo">AirtelTigo / Airtel</option>
                  <option value="Safaricom">Safaricom (M-Pesa Data)</option>
                  <option value="Orange">Orange Money Data</option>
                  <option value="Glo">Glo Mobile</option>
                  <option value="Jio">Jio / Airtel (India)</option>
                  <option value="Other Carrier">Other Local Telecom</option>
                </select>
              </div>

              {/* Data Bundle Amount Selector */}
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
                  Select Data Bundle (Converts to Money)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { mb: '50', cash: '$0.50' },
                    { mb: '100', cash: '$1.00' },
                    { mb: '200', cash: '$2.00' },
                  ].map((item) => (
                    <button
                      key={item.mb}
                      type="button"
                      onClick={() => setBundleMb(item.mb)}
                      className={`py-2 px-1 rounded-xl border text-xs font-bold transition-all cursor-pointer flex flex-col items-center justify-center ${
                        bundleMb === item.mb
                          ? 'bg-[#F2AF29] text-[#0B0D17] border-[#F2AF29]'
                          : 'bg-[#1C1F37] text-slate-300 border-white/10 hover:border-white/20'
                      }`}
                    >
                      <span>{item.mb} MB</span>
                      <span className={`text-[9px] ${bundleMb === item.mb ? 'text-[#0B0D17]' : 'text-emerald-400'}`}>
                        ({item.cash} USD)
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Phone / Voucher Input */}
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
                  Mobile Number or Data Voucher PIN
                </label>
                <input
                  type="text"
                  value={phoneOrPin}
                  onChange={(e) => setPhoneOrPin(e.target.value)}
                  placeholder="e.g. +233 24 000 0000 or PIN Code"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#1C1F37] border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-[#F2AF29]"
                />
              </div>
            </div>

            <button
              onClick={handleDataBundlePayment}
              disabled={isProcessing}
              className="w-full py-3.5 rounded-2xl bg-[#F2AF29] hover:bg-[#e09e1e] disabled:opacity-50 text-[#0B0D17] font-bold text-xs uppercase tracking-wider shadow-lg shadow-[#F2AF29]/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-[#0B0D17]" />
                  <span>Converting {bundleMb}MB Data to ${(Number(bundleMb) * 0.01).toFixed(2)} USD...</span>
                </>
              ) : (
                <>
                  <Smartphone className="w-4 h-4" />
                  <span>Convert {bundleMb}MB (${(Number(bundleMb) * 0.01).toFixed(2)}) & Unlock</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* TAB 3: CREDIT CARD CHECKOUT */}
        {activeTab === 'card' && (
          <div className="bg-[#0B0D17] p-4 sm:p-5 rounded-2xl border border-white/10 space-y-3.5">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest block">
                  Lifetime Card Access
                </span>
                <span className="text-xl font-black text-white">$4.99 USD</span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-[#F2AF29]/10 border border-[#F2AF29]/30 text-[#F2AF29] text-[10px] font-bold uppercase tracking-wider">
                Stripe SSL
              </span>
            </div>

            <div className="relative">
              <CreditCard className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="text"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                placeholder="Card Number"
                className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-[#1C1F37] border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-[#F2AF29]"
              />
            </div>

            <button
              onClick={handleCardPayment}
              disabled={isProcessing}
              className="w-full py-3.5 rounded-2xl bg-[#F2AF29] hover:bg-[#e09e1e] disabled:opacity-50 text-[#0B0D17] font-bold text-xs uppercase tracking-wider shadow-lg shadow-[#F2AF29]/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-[#0B0D17]" />
                  <span>Processing Card Payment...</span>
                </>
              ) : (
                <>
                  <CreditCard className="w-4 h-4" />
                  <span>Pay $4.99 USD via Stripe</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* Footer Guarantee */}
        <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-400 uppercase tracking-widest pt-1">
          <ShieldCheck className="w-3.5 h-3.5 text-[#F2AF29]" />
          <span>Inclusive Global Access • Free Mode • Mobile Data Bundle • Cards</span>
        </div>
      </div>
    </div>
  );
};
