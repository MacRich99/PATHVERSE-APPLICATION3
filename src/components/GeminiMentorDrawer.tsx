import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, X, Bot, User, Globe, MessageSquare, Loader2, Minimize2, ChevronRight } from 'lucide-react';
import { UserProfile } from '../types';

interface Message {
  id: string;
  sender: 'user' | 'mentor';
  text: string;
  timestamp: string;
}

interface GeminiMentorDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile | null;
  currentPathTitle?: string;
}

export const GeminiMentorDrawer: React.FC<GeminiMentorDrawerProps> = ({
  isOpen,
  onClose,
  user,
  currentPathTitle,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-1',
      sender: 'mentor',
      text: `Hello ${user?.name || 'there'}! I'm your Gemini AI Career Mentor. I'm here to answer questions about skills, projects, learning resources, or how to reach your goals in English, Twi, Spanish, Hindi, or any language you prefer. What's on your mind?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || loading) return;

    const userMsg: Message = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setLoading(true);

    try {
      const historyPayload = messages.slice(-6).map((m) => ({
        role: m.sender === 'user' ? 'user' : 'model',
        text: m.text,
      }));

      const res = await fetch('/api/gemini/mentor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          conversationHistory: historyPayload,
          profile: user,
          currentPath: currentPathTitle,
        }),
      });

      const data = await res.json();
      const mentorMsg: Message = {
        id: `msg-${Date.now() + 1}`,
        sender: 'mentor',
        text: data.reply || "I'm here to help guide your career exploration. What skill would you like to build next?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, mentorMsg]);
    } catch (err) {
      console.error('Mentor chat error:', err);
      const errorMsg: Message = {
        id: `msg-${Date.now() + 1}`,
        sender: 'mentor',
        text: 'I had a temporary connection hiccup, but I am still here! Feel free to ask your question again.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const samplePrompts = [
    'How do I start building projects with no experience?',
    'Explain how to get started in Twi or Spanish',
    'What micro project can I build this weekend?',
    'How can I prepare for tech opportunities in high school?',
  ];

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-[#0B0D17]/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md bg-[#1C1F37] border-l border-white/10 flex flex-col h-full shadow-2xl relative">
        {/* Drawer Header */}
        <div className="p-4 border-b border-white/10 bg-[#0B0D17]/90 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-[#0B0D17] border border-[#F2AF29] flex items-center justify-center text-[#F2AF29] shadow-md">
              <Sparkles className="w-4 h-4 animate-pulse text-[#F2AF29]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm font-bold text-white">Gemini AI Mentor</h3>
                <span className="px-1.5 py-0.2 rounded bg-[#F2AF29]/20 text-[#F2AF29] text-[9px] font-bold uppercase">
                  3.6 Flash
                </span>
              </div>
              <p className="text-[10px] text-slate-400">
                1 AI mentoring millions globally • 24/7 Guidance
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-[#0B0D17] border border-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
            title="Close Drawer"
          >
            <X className="w-4 h-4 text-[#F2AF29]" />
          </button>
        </div>

        {/* Message History */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-2.5 items-start ${
                msg.sender === 'user' ? 'flex-row-reverse' : ''
              }`}
            >
              <div
                className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                  msg.sender === 'user'
                    ? 'bg-[#F2AF29] text-[#0B0D17]'
                    : 'bg-[#0B0D17] border border-[#F2AF29]/40 text-[#F2AF29]'
                }`}
              >
                {msg.sender === 'user' ? (
                  <User className="w-3.5 h-3.5" />
                ) : (
                  <Sparkles className="w-3.5 h-3.5" />
                )}
              </div>

              <div
                className={`max-w-[82%] p-3.5 rounded-2xl leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-[#F2AF29] text-[#0B0D17] font-medium shadow-md'
                    : 'bg-[#0B0D17] border border-white/10 text-slate-200'
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.text}</p>
                <span
                  className={`text-[9px] block mt-1.5 opacity-60 ${
                    msg.sender === 'user' ? 'text-[#0B0D17] text-right' : 'text-slate-400'
                  }`}
                >
                  {msg.timestamp}
                </span>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex gap-2.5 items-start">
              <div className="w-7 h-7 rounded-xl bg-[#0B0D17] border border-[#F2AF29]/40 text-[#F2AF29] flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5 animate-spin" />
              </div>
              <div className="p-3.5 rounded-2xl bg-[#0B0D17] border border-white/10 text-slate-400 flex items-center gap-2">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-[#F2AF29]" />
                <span className="text-[11px] font-medium">Gemini AI Mentor is thinking...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Prompts */}
        {messages.length < 5 && (
          <div className="px-4 py-2 border-t border-white/5 bg-[#0B0D17]/50 space-y-1.5">
            <span className="text-[9px] uppercase font-bold tracking-widest text-[#F2AF29] block">
              Suggested Questions
            </span>
            <div className="flex flex-col gap-1">
              {samplePrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(prompt)}
                  className="p-2 rounded-xl bg-[#0B0D17] border border-white/5 hover:border-[#F2AF29]/40 text-slate-300 text-[10px] text-left transition-all flex items-center justify-between group cursor-pointer"
                >
                  <span className="truncate">{prompt}</span>
                  <ChevronRight className="w-3 h-3 text-slate-500 group-hover:text-[#F2AF29] shrink-0" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Form */}
        <div className="p-3 border-t border-white/10 bg-[#0B0D17]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask your Gemini AI Mentor anything..."
              className="flex-1 px-4 py-3 rounded-2xl bg-[#1C1F37] border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-[#F2AF29]"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="w-11 h-11 rounded-2xl bg-[#F2AF29] hover:bg-[#e09e1e] disabled:opacity-50 text-[#0B0D17] flex items-center justify-center font-bold transition-all shrink-0 cursor-pointer shadow-md"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
