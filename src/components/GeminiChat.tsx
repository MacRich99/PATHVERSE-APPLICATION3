import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, Loader2, RefreshCw, Server, CheckCircle2, ShieldCheck } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'gemini';
  text: string;
  timestamp: string;
}

export const GeminiChat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'gemini',
      text: "Hello! I am Gemini 1.5 Flash running via an AWS Amplify Gen 2 serverless backend route (/api/gemini). Ask me anything!",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSendPrompt = async (textOverride?: string) => {
    const textToSend = (textOverride || prompt).trim();
    if (!textToSend || loading) return;

    setError(null);
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!textOverride) setPrompt('');
    setLoading(true);

    try {
      // Calling backend endpoint /api/gemini via POST with JSON body { prompt: "user message" }
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: textToSend }),
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        throw new Error(data.error || `HTTP error ${response.status}`);
      }

      const geminiResponseText = data.text || 'No response returned from Gemini.';

      const geminiMessage: ChatMessage = {
        id: `gemini-${Date.now()}`,
        sender: 'gemini',
        text: geminiResponseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, geminiMessage]);
    } catch (err: any) {
      console.error('Error fetching /api/gemini:', err);
      setError(err?.message || 'Failed to connect to backend /api/gemini endpoint.');
    } finally {
      setLoading(false);
    }
  };

  const sampleQuestions = [
    'Explain how AWS Amplify Gen 2 functions keep API keys safe',
    'Write a TypeScript function to fetch /api/gemini with POST',
    'What are the key benefits of using gemini-1.5-flash for real-time web applications?',
  ];

  return (
    <div className="flex flex-col h-full w-full max-w-4xl mx-auto bg-[#0B0D17] border border-[#2A2E45] rounded-2xl shadow-2xl overflow-hidden my-4">
      {/* Header Banner */}
      <div className="bg-[#15192B] border-b border-[#2A2E45] px-6 py-4 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#3B82F6] to-[#8B5CF6] flex items-center justify-center text-white shadow-lg">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              Gemini 1.5 Flash AI Assistant
              <span className="text-[10px] bg-[#3B82F6]/20 border border-[#3B82F6]/40 text-[#60A5FA] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider">
                Amplify Gen 2
              </span>
            </h2>
            <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
              <Server className="w-3.5 h-3.5 text-emerald-400" />
              Proxied via backend route <code className="bg-[#0B0D17] text-amber-400 px-1.5 py-0.5 rounded border border-[#2A2E45]">/api/gemini</code>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-300 bg-[#0B0D17] px-3 py-1.5 rounded-lg border border-[#2A2E45]">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>API Key Hidden in Server Environment</span>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 min-h-[380px]">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 ${
              msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
            }`}
          >
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-white font-medium shadow-md ${
                msg.sender === 'user'
                  ? 'bg-blue-600'
                  : 'bg-gradient-to-tr from-purple-600 to-indigo-600'
              }`}
            >
              {msg.sender === 'user' ? (
                <User className="w-5 h-5" />
              ) : (
                <Bot className="w-5 h-5" />
              )}
            </div>

            <div
              className={`max-w-[80%] rounded-2xl p-4 shadow-md ${
                msg.sender === 'user'
                  ? 'bg-blue-600 text-white rounded-tr-none'
                  : 'bg-[#181C2E] text-slate-100 border border-[#2A2E45] rounded-tl-none'
              }`}
            >
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
              <div
                className={`text-[10px] mt-2 flex items-center gap-1 ${
                  msg.sender === 'user' ? 'text-blue-200 justify-end' : 'text-slate-400'
                }`}
              >
                <span>{msg.timestamp}</span>
                {msg.sender === 'gemini' && (
                  <span className="flex items-center gap-1 text-emerald-400 ml-2">
                    <CheckCircle2 className="w-3 h-3" /> Server-Verified
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-3 text-slate-400 text-sm italic">
            <div className="w-9 h-9 rounded-xl bg-[#181C2E] border border-[#2A2E45] flex items-center justify-center text-purple-400">
              <Loader2 className="w-5 h-5 animate-spin" />
            </div>
            <span>Contacting AWS Amplify backend function /api/gemini...</span>
          </div>
        )}

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-300 p-4 rounded-xl text-xs flex items-center justify-between gap-2">
            <span><strong>Error:</strong> {error}</span>
            <button
              onClick={() => setError(null)}
              className="text-red-400 hover:text-white text-xs underline"
            >
              Dismiss
            </button>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Starter Prompts */}
      <div className="px-6 py-2 bg-[#0F1221] border-t border-[#2A2E45]/60 flex items-center gap-2 overflow-x-auto no-scrollbar">
        <span className="text-[11px] font-semibold text-slate-400 shrink-0">Try prompt:</span>
        {sampleQuestions.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSendPrompt(q)}
            disabled={loading}
            className="text-xs bg-[#181C2E] hover:bg-[#252B45] text-slate-300 hover:text-white px-3 py-1.5 rounded-lg border border-[#2A2E45] whitespace-nowrap transition-colors shrink-0 disabled:opacity-50"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input Area */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendPrompt();
        }}
        className="bg-[#15192B] border-t border-[#2A2E45] p-4 flex items-center gap-3"
      >
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Ask Gemini anything... (calls POST /api/gemini)"
          disabled={loading}
          className="flex-1 bg-[#0B0D17] border border-[#2A2E45] focus:border-blue-500 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-400 focus:outline-none transition-colors disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={!prompt.trim() || loading}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium px-5 py-3 rounded-xl flex items-center gap-2 text-sm shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <span>Send</span>
              <Send className="w-4 h-4" />
            </>
          )}
        </button>
      </form>
    </div>
  );
};
