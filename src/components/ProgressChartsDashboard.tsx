import React, { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from 'recharts';
import { BarChart3, TrendingUp, Sparkles, Award, CheckCircle2, Zap } from 'lucide-react';
import { PathJourney } from '../types';

interface ProgressChartsDashboardProps {
  activeJourney?: PathJourney | null;
}

export const ProgressChartsDashboard: React.FC<ProgressChartsDashboardProps> = ({ activeJourney }) => {
  const [chartMode, setChartMode] = useState<'area' | 'radar'>('area');

  // Compute Journey Step Completion rate
  const steps = activeJourney?.steps || [];
  const completedSteps = steps.filter((s) => s.status === 'completed').length;
  const totalSteps = steps.length || 6;
  const overallRate = Math.round((completedSteps / totalSteps) * 100);

  // Journey Completion Timeline Data
  const journeyProgressData = [
    { phase: 'Foundations', completionRate: 100, target: 100, stepsCompleted: 2, label: 'Phase 1' },
    { phase: 'Core Skills', completionRate: Math.max(overallRate, 75), target: 80, stepsCompleted: 3, label: 'Phase 2' },
    { phase: 'Practical Projects', completionRate: Math.max(overallRate - 15, 50), target: 60, stepsCompleted: 4, label: 'Phase 3' },
    { phase: 'AI & Automation', completionRate: Math.max(overallRate - 25, 35), target: 45, stepsCompleted: 5, label: 'Phase 4' },
    { phase: 'Portfolio Launch', completionRate: Math.max(overallRate - 40, 20), target: 30, stepsCompleted: 6, label: 'Phase 5' },
  ];

  // Skill Mastery Radar Data
  const skillMasteryData = [
    { domain: 'Coding & Logic', mastery: 85, target: 95, fullMark: 100 },
    { domain: 'System Design', mastery: 70, target: 85, fullMark: 100 },
    { domain: 'AI & Prompting', mastery: 90, target: 90, fullMark: 100 },
    { domain: 'Product UX', mastery: 75, target: 80, fullMark: 100 },
    { domain: 'Problem Breakdown', mastery: 95, target: 100, fullMark: 100 },
    { domain: 'Leadership & Pitch', mastery: 65, target: 75, fullMark: 100 },
  ];

  // Custom Dark Recharts Tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#0B0D17] border border-[#F2AF29]/50 p-3 rounded-xl shadow-2xl space-y-1 text-xs">
          <p className="font-bold text-[#F2AF29]">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={`item-${index}`} className="text-white flex items-center justify-between gap-4">
              <span className="opacity-80" style={{ color: entry.color }}>
                {entry.name}:
              </span>
              <span className="font-mono font-bold text-[#F2AF29]">{entry.value}%</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-[#1C1F37] border border-white/10 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-5">
      {/* Chart Panel Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#F2AF29] uppercase tracking-widest mb-1">
            <BarChart3 className="w-4 h-4 text-[#F2AF29]" />
            <span>Learning Analytics</span>
          </div>
          <h3 className="text-xl font-bold text-white">
            Journey Steps Rate & Skill Mastery
          </h3>
          <p className="text-xs text-slate-300 opacity-80 mt-0.5">
            Visualize step completion trajectory and skill domain mastery over time.
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center bg-[#0B0D17] border border-white/10 p-1 rounded-2xl shrink-0 self-start sm:self-auto">
          <button
            onClick={() => setChartMode('area')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              chartMode === 'area'
                ? 'bg-[#F2AF29] text-[#0B0D17] shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Steps Trajectory</span>
          </button>
          <button
            onClick={() => setChartMode('radar')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              chartMode === 'radar'
                ? 'bg-[#F2AF29] text-[#0B0D17] shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Skill Radar</span>
          </button>
        </div>
      </div>

      {/* Metrics Header Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-[#0B0D17] border border-white/10 p-3.5 rounded-2xl">
          <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Overall Completion</span>
          <div className="text-xl font-bold font-mono text-[#F2AF29]">{overallRate}%</div>
          <p className="text-[10px] text-emerald-400 mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            <span>{completedSteps} / {totalSteps} Steps Mastered</span>
          </p>
        </div>

        <div className="bg-[#0B0D17] border border-white/10 p-3.5 rounded-2xl">
          <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Active Path</span>
          <div className="text-sm font-bold text-white truncate">{activeJourney?.pathTitle || 'Path Discovery'}</div>
          <p className="text-[10px] text-[#F2AF29] mt-1 font-mono">Life GPS Active</p>
        </div>

        <div className="bg-[#0B0D17] border border-white/10 p-3.5 rounded-2xl">
          <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Top Skill Mastery</span>
          <div className="text-xl font-bold font-mono text-emerald-400">95%</div>
          <p className="text-[10px] text-slate-300 mt-1">Problem Breakdown</p>
        </div>

        <div className="bg-[#0B0D17] border border-white/10 p-3.5 rounded-2xl">
          <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Global Milestone</span>
          <div className="text-xl font-bold font-mono text-cyan-400">Phase 2</div>
          <p className="text-[10px] text-slate-300 mt-1">On Target Velocity</p>
        </div>
      </div>

      {/* Main Recharts Area */}
      <div className="bg-[#0B0D17] border border-white/10 rounded-2xl p-4 sm:p-5 h-[300px] sm:h-[320px] w-full">
        {chartMode === 'area' ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={journeyProgressData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="goldGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F2AF29" stopOpacity={0.6} />
                  <stop offset="95%" stopColor="#F2AF29" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="emeraldGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1C1F37" />
              <XAxis dataKey="phase" stroke="#94A3B8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94A3B8" fontSize={11} domain={[0, 100]} unit="%" tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="completionRate"
                name="Step Completion Rate"
                stroke="#F2AF29"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#goldGrad)"
              />
              <Area
                type="monotone"
                dataKey="target"
                name="Benchmark Target"
                stroke="#10B981"
                strokeWidth={2}
                strokeDasharray="4 4"
                fillOpacity={0.2}
                fill="url(#emeraldGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="75%" data={skillMasteryData}>
              <PolarGrid stroke="#1C1F37" />
              <PolarAngleAxis dataKey="domain" stroke="#CBD5E1" fontSize={10} tick={{ fill: '#E2E8F0' }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#64748B" fontSize={10} />
              <Radar
                name="Current Mastery"
                dataKey="mastery"
                stroke="#F2AF29"
                fill="#F2AF29"
                fillOpacity={0.5}
              />
              <Radar
                name="Target Benchmark"
                dataKey="target"
                stroke="#10B981"
                fill="#10B981"
                fillOpacity={0.2}
              />
              <Tooltip content={<CustomTooltip />} />
            </RadarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};
