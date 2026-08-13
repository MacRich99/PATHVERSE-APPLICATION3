import React, { useState } from 'react';
import { Sparkles, Code, Compass, Cpu, Layers, Rocket, CheckCircle2, Award, Zap, BookOpen, ChevronRight, HelpCircle } from 'lucide-react';
import { PathJourney } from '../types';

export interface SkillNodeData {
  id: string;
  name: string;
  category: string;
  progress: number; // 0 - 100
  status: 'mastered' | 'in_progress' | 'unlocked' | 'locked';
  icon: 'Code' | 'Compass' | 'Sparkles' | 'Cpu' | 'Layers' | 'Rocket' | 'Zap' | 'Award';
  xp: number;
  microSkills: string[];
  description: string;
  x: number; // percentage or relative SVG position x
  y: number; // percentage or relative SVG position y
  level: number; // 0 = root, 1 = tier 1, 2 = tier 2
  parentId?: string;
}

interface SkillMasteryTreeProps {
  activeJourney?: PathJourney | null;
  onOpenMentor?: () => void;
  onOpenCourseModal?: (topic?: string) => void;
}

export const SkillMasteryTree: React.FC<SkillMasteryTreeProps> = ({
  activeJourney,
  onOpenMentor,
  onOpenCourseModal,
}) => {
  const [hoveredNode, setHoveredNode] = useState<SkillNodeData | null>(null);
  const [selectedNode, setSelectedNode] = useState<SkillNodeData | null>(null);

  // Derive skill nodes dynamically or fallback to rich default tree
  const defaultNodes: SkillNodeData[] = [
    {
      id: 'root-foundations',
      name: activeJourney ? `${activeJourney.pathTitle} Foundations` : 'Path Foundations',
      category: 'Core Fundamentals',
      progress: 100,
      status: 'mastered',
      icon: 'Award',
      xp: 500,
      microSkills: ['Problem Breakdown', 'Core Terminology', 'Tooling Setup', 'Digital Literacy'],
      description: 'Foundational concepts and essential vocabulary required for your chosen career path.',
      x: 50,
      y: 12,
      level: 0,
    },
    {
      id: 'tech-core',
      name: 'Technical & Web Core',
      category: 'Engineering',
      progress: 85,
      status: 'in_progress',
      icon: 'Code',
      xp: 420,
      microSkills: ['HTML5 & CSS Layouts', 'JavaScript Logic', 'DOM Manipulation', 'Git Versioning'],
      description: 'Mastering web development fundamentals, clean markup, and stateful application logic.',
      x: 22,
      y: 42,
      level: 1,
      parentId: 'root-foundations',
    },
    {
      id: 'ai-automation',
      name: 'AI Agent & Prompting',
      category: 'AI Systems',
      progress: 90,
      status: 'in_progress',
      icon: 'Sparkles',
      xp: 480,
      microSkills: ['Gemini 3.6 API', 'Prompt Architecture', 'Function Calling', 'Context Windowing'],
      description: 'Leveraging modern AI LLMs to automate tasks, generate code, and synthesize insights.',
      x: 50,
      y: 42,
      level: 1,
      parentId: 'root-foundations',
    },
    {
      id: 'product-design',
      name: 'UI/UX & Product Design',
      category: 'Creative Design',
      progress: 70,
      status: 'in_progress',
      icon: 'Layers',
      xp: 350,
      microSkills: ['Figma Design Systems', 'User Journeys', 'Color Hierarchy', 'Responsive Layouts'],
      description: 'Crafting user-centered interfaces with accessible spacing, typography, and contrast.',
      x: 78,
      y: 42,
      level: 1,
      parentId: 'root-foundations',
    },
    {
      id: 'frontend-architecture',
      name: 'React & TypeScript App',
      category: 'Engineering',
      progress: 60,
      status: 'in_progress',
      icon: 'Cpu',
      xp: 300,
      microSkills: ['React Hooks', 'Type Safety', 'State Managers', 'Component Composition'],
      description: 'Building modern single-page applications with reusable component structures.',
      x: 12,
      y: 78,
      level: 2,
      parentId: 'tech-core',
    },
    {
      id: 'backend-apis',
      name: 'Backend APIs & Data',
      category: 'Engineering',
      progress: 45,
      status: 'unlocked',
      icon: 'Zap',
      xp: 220,
      microSkills: ['Express REST Routes', 'JSON Schemas', 'Database Storage', 'Security Headers'],
      description: 'Designing server-side endpoints to process data, manage sessions, and handle APIs.',
      x: 34,
      y: 78,
      level: 2,
      parentId: 'tech-core',
    },
    {
      id: 'ai-integration',
      name: 'Autonomous AI Workflows',
      category: 'AI Systems',
      progress: 65,
      status: 'in_progress',
      icon: 'Compass',
      xp: 310,
      microSkills: ['Multimodal Prompts', 'Structured JSON Output', 'Agent Evaluation'],
      description: 'Connecting AI reasoning capabilities directly into frontend & backend workflows.',
      x: 50,
      y: 78,
      level: 2,
      parentId: 'ai-automation',
    },
    {
      id: 'career-launch',
      name: 'Portfolio & Launch',
      category: 'Career Growth',
      progress: 30,
      status: 'unlocked',
      icon: 'Rocket',
      xp: 150,
      microSkills: ['Live Deployment', 'Case Study Pitch', 'GitHub Portfolio', 'Peer Showcase'],
      description: 'Packaging your real-world micro projects into an outstanding professional portfolio.',
      x: 78,
      y: 78,
      level: 2,
      parentId: 'product-design',
    },
  ];

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Code':
        return <Code className="w-4 h-4" />;
      case 'Sparkles':
        return <Sparkles className="w-4 h-4" />;
      case 'Cpu':
        return <Cpu className="w-4 h-4" />;
      case 'Layers':
        return <Layers className="w-4 h-4" />;
      case 'Rocket':
        return <Rocket className="w-4 h-4" />;
      case 'Zap':
        return <Zap className="w-4 h-4" />;
      case 'Compass':
        return <Compass className="w-4 h-4" />;
      case 'Award':
      default:
        return <Award className="w-4 h-4" />;
    }
  };

  const activeTooltipNode = hoveredNode || selectedNode;

  return (
    <div className="bg-[#1C1F37] border border-white/10 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-5 relative overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#F2AF29] uppercase tracking-widest mb-1">
            <Sparkles className="w-4 h-4 text-[#F2AF29]" />
            <span>Interactive Skill Tree</span>
          </div>
          <h3 className="text-xl font-bold text-white">
            Skill Mastery Tree & Connections
          </h3>
          <p className="text-xs text-slate-300 opacity-80 mt-0.5">
            Hover over any skill cluster node to inspect current mastery progress, micro-skills, and learning pathways.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase bg-[#0B0D17] border border-white/10 px-2.5 py-1 rounded-full text-slate-300">
            <span className="w-2 h-2 rounded-full bg-[#F2AF29] animate-pulse"></span>
            <span>8 Mastery Clusters</span>
          </span>
        </div>
      </div>

      {/* SVG Canvas & Node Tree Container */}
      <div className="relative w-full h-[360px] sm:h-[400px] bg-[#0B0D17] border border-white/10 rounded-2xl p-4 overflow-hidden select-none">
        {/* Subtle Background Grid Pattern */}
        <div
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(#F2AF29 1px, transparent 1px)`,
            backgroundSize: '24px 24px',
          }}
        ></div>

        {/* SVG Connecting Lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
          <defs>
            <linearGradient id="lineGradActive" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F2AF29" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#10B981" stopOpacity="0.8" />
            </linearGradient>
            <linearGradient id="lineGradNormal" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F2AF29" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#64748B" stopOpacity="0.3" />
            </linearGradient>
          </defs>

          {defaultNodes.map((node) => {
            if (!node.parentId) return null;
            const parent = defaultNodes.find((p) => p.id === node.parentId);
            if (!parent) return null;

            const isHovered = hoveredNode?.id === node.id || hoveredNode?.id === parent.id;

            return (
              <line
                key={`${parent.id}-${node.id}`}
                x1={`${parent.x}%`}
                y1={`${parent.y}%`}
                x2={`${node.x}%`}
                y2={`${node.y}%`}
                stroke={isHovered ? 'url(#lineGradActive)' : 'url(#lineGradNormal)'}
                strokeWidth={isHovered ? 3 : 2}
                strokeDasharray={node.status === 'unlocked' ? '4,4' : undefined}
                className="transition-all duration-300"
              />
            );
          })}
        </svg>

        {/* Render Skill Nodes */}
        <div className="relative w-full h-full z-10">
          {defaultNodes.map((node) => {
            const isHovered = hoveredNode?.id === node.id;
            const isMastered = node.status === 'mastered';
            const isInProgress = node.status === 'in_progress';

            return (
              <div
                key={node.id}
                style={{
                  left: `${node.x}%`,
                  top: `${node.y}%`,
                  transform: 'translate(-50%, -50%)',
                }}
                onMouseEnter={() => setHoveredNode(node)}
                onMouseLeave={() => setHoveredNode(null)}
                onClick={() => setSelectedNode(selectedNode?.id === node.id ? null : node)}
                className={`absolute cursor-pointer transition-all duration-300 group flex flex-col items-center ${
                  isHovered ? 'scale-110 z-30' : 'z-20'
                }`}
              >
                {/* Node Outer Glow Circle */}
                <div
                  className={`w-11 h-11 sm:w-13 sm:h-13 rounded-2xl flex items-center justify-center border-2 transition-all shadow-xl relative ${
                    isMastered
                      ? 'bg-emerald-950/90 border-emerald-400 text-emerald-300 shadow-emerald-500/20'
                      : isInProgress
                      ? 'bg-[#1C1F37] border-[#F2AF29] text-[#F2AF29] shadow-[#F2AF29]/30 ring-2 ring-[#F2AF29]/20'
                      : 'bg-[#0B0D17] border-slate-600 text-slate-400 opacity-80'
                  }`}
                >
                  {getIcon(node.icon)}

                  {/* Progress Ring Badge */}
                  <div className="absolute -top-1 -right-1 bg-[#0B0D17] border border-white/20 text-[9px] font-mono font-bold px-1.5 py-0.2 rounded-full text-white shadow">
                    {node.progress}%
                  </div>
                </div>

                {/* Node Label Below */}
                <span
                  className={`mt-1.5 text-[10px] sm:text-[11px] font-bold tracking-tight text-center max-w-[90px] sm:max-w-[110px] leading-tight transition-colors ${
                    isHovered ? 'text-[#F2AF29]' : 'text-slate-200'
                  }`}
                >
                  {node.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Floating Active Node Tooltip / Detail Card */}
      {activeTooltipNode && (
        <div className="bg-[#0B0D17] border border-[#F2AF29]/50 rounded-2xl p-4 shadow-2xl space-y-3 animate-fade-in relative z-30">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#1C1F37] border border-[#F2AF29] flex items-center justify-center text-[#F2AF29] shrink-0">
                {getIcon(activeTooltipNode.icon)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[9px] uppercase font-bold text-[#F2AF29] tracking-wider">
                    {activeTooltipNode.category}
                  </span>
                  <span
                    className={`px-2 py-0.2 rounded-full text-[9px] font-bold uppercase tracking-wider border ${
                      activeTooltipNode.status === 'mastered'
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : activeTooltipNode.status === 'in_progress'
                        ? 'bg-[#F2AF29]/20 text-[#F2AF29] border-[#F2AF29]/40'
                        : 'bg-slate-800 text-slate-300 border-slate-700'
                    }`}
                  >
                    {activeTooltipNode.status === 'mastered'
                      ? 'Mastered'
                      : activeTooltipNode.status === 'in_progress'
                      ? 'In Progress'
                      : 'Unlocked'}
                  </span>
                </div>
                <h4 className="text-base font-bold text-white leading-snug">
                  {activeTooltipNode.name}
                </h4>
              </div>
            </div>

            <div className="text-right shrink-0">
              <span className="text-sm font-mono font-bold text-[#F2AF29]">
                {activeTooltipNode.progress}%
              </span>
              <span className="text-[9px] text-slate-400 block">+ {activeTooltipNode.xp} XP</span>
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            {activeTooltipNode.description}
          </p>

          {/* Micro Skills Chips */}
          <div className="space-y-1">
            <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400 block">
              Micro-Skills Included:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {activeTooltipNode.microSkills.map((sk, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-0.5 rounded-lg bg-[#1C1F37] border border-white/10 text-slate-200 text-[10px] font-medium flex items-center gap-1"
                >
                  <CheckCircle2 className="w-3 h-3 text-[#F2AF29]" />
                  <span>{sk}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Action Row */}
          <div className="pt-2 border-t border-white/10 flex flex-wrap items-center justify-between gap-2">
            {onOpenCourseModal && (
              <button
                onClick={() => onOpenCourseModal(activeTooltipNode.name)}
                className="px-3 py-1.5 rounded-xl bg-[#F2AF29] hover:bg-[#e09e1e] text-[#0B0D17] text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shadow"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Practice & Course Outline</span>
              </button>
            )}

            {onOpenMentor && (
              <button
                onClick={onOpenMentor}
                className="px-3 py-1.5 rounded-xl bg-[#1C1F37] hover:bg-white/10 border border-white/10 text-[#F2AF29] text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#F2AF29]" />
                <span>Ask AI Mentor</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
