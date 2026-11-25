import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, BookOpen } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { ragService, ChatResponse } from '../../services/ragService';
import type { ChatMessage } from '../../types';

function generateId(): string {
  return Math.random().toString(36).substring(2, 11);
}

const LibrarianChat: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: generateId(),
      role: 'assistant',
      content: `👋 Greetings from **LPU Central Library**! I am your AI Librarian, powered by our library knowledge base and Google Gemini.

How may I assist your academic journey today? Try asking:
• *"Where is Introduction to Algorithms?"*
• *"What should I study before Deep Learning?"*
• *"Recommend good beginner books for Machine Learning"*`,
      timestamp: new Date(),
    },
  ]);
  const [sourcesList, setSourcesList] = useState<Record<string, any[]>>({});
  const [currentEngine, setCurrentEngine] = useState<string>('Google Gemini RAG');
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const query = input;
    const userMsgId = generateId();
    const userMsg: ChatMessage = {
      id: userMsgId,
      role: 'user',
      content: query,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    const history = messages.slice(-4).map(m => ({
      role: m.role,
      content: m.content,
    }));

    try {
      const response: ChatResponse = await ragService.query(query, history);
      const assistantMsgId = generateId();
      const assistantMsg: ChatMessage = {
        id: assistantMsgId,
        role: 'assistant',
        content: response.answer,
        timestamp: new Date(),
      };

      if (response.sources?.length) {
        setSourcesList(prev => ({ ...prev, [assistantMsgId]: response.sources }));
      }
      if (response.engine) {
        setCurrentEngine(response.engine);
      }

      setMessages(prev => [...prev, assistantMsg]);
    } catch {
      const fallbackMsg: ChatMessage = {
        id: generateId(),
        role: 'assistant',
        content: "I'm having trouble connecting to the catalog right now. Please try again in a moment.",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const renderContent = (content: string) => {
    const lines = content.split('\n');
    return lines.map((line, i) => {
      if (!line.trim()) return <br key={i} />;
      const formatted = line
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.+?)\*/g, '<em>$1</em>')
        .replace(/`(.+?)`/g, '<code class="text-[#DC2626] bg-[#1A0808] px-1 rounded font-mono">$1</code>');
      return (
        <div
          key={i}
          className={line.startsWith('•') ? 'ml-3 my-0.5' : 'my-0.5'}
          dangerouslySetInnerHTML={{ __html: formatted }}
        />
      );
    });
  };

  return (
    <div className="flex flex-col h-full">
      {/* Gemini RAG Engine Banner */}
      <div
        className={`flex items-center justify-between p-3 rounded-2xl border mb-4 text-xs ${
          isDark ? 'bg-[#151515] border-[#2A2A2A] text-gray-300' : 'bg-white border-gray-200 text-gray-700 shadow-sm'
        }`}
      >
        <div className="flex items-center gap-2">
          <Sparkles size={16} className="text-[#DC2626]" />
          <span>
            Intelligent Engine: <strong className="text-[#DC2626] font-semibold">{currentEngine}</strong>
          </span>
        </div>
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-500/10 text-green-500 font-medium border border-green-500/20">
          Source Grounded
        </span>
      </div>

      {/* Messages Window */}
      <div
        className={`flex-1 overflow-y-auto rounded-2xl border p-5 space-y-4 mb-4 ${
          isDark ? 'bg-[#0D0D0D] border-[#2A2A2A]' : 'bg-gray-50 border-gray-200'
        }`}
        style={{ minHeight: '440px', maxHeight: '540px' }}
      >
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`flex gap-3.5 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
          >
            <div
              className={`flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center shadow-md ${
                msg.role === 'assistant'
                  ? 'bg-[#DC2626] text-white shadow-[#DC2626]/20'
                  : isDark
                  ? 'bg-[#2A2A2A] text-white'
                  : 'bg-gray-200 text-black'
              }`}
            >
              {msg.role === 'assistant' ? <Bot size={16} /> : <User size={16} />}
            </div>

            <div className="max-w-[82%] space-y-2">
              <div
                className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-[#DC2626] text-white'
                    : isDark
                    ? 'bg-[#151515] border border-[#2A2A2A] text-[#F5F5F5]'
                    : 'bg-white border border-gray-200 text-[#171717] shadow-sm'
                }`}
              >
                {renderContent(msg.content)}
              </div>

              {/* Source citations tag */}
              {sourcesList[msg.id] && sourcesList[msg.id].length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5 pl-1">
                  <span className="text-[10px] text-gray-500 flex items-center gap-1">
                    <BookOpen size={10} /> Grounded Sources:
                  </span>
                  {sourcesList[msg.id].map((src, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] px-2 py-0.5 rounded-md bg-[#DC2626]/10 text-[#DC2626] border border-[#DC2626]/20 font-medium"
                    >
                      {src.title}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex gap-3.5">
            <div className="w-8 h-8 rounded-xl bg-[#DC2626] flex items-center justify-center text-white shadow-md shadow-[#DC2626]/20">
              <Bot size={16} />
            </div>
            <div
              className={`rounded-2xl px-4 py-3 text-sm flex items-center gap-2 ${
                isDark ? 'bg-[#151515] border border-[#2A2A2A] text-gray-400' : 'bg-white border border-gray-200 text-gray-500'
              }`}
            >
              <div className="flex gap-1">
                <span className="w-2 h-2 rounded-full bg-[#DC2626] animate-pulse"></span>
                <span className="w-2 h-2 rounded-full bg-[#DC2626] animate-pulse delay-75"></span>
                <span className="w-2 h-2 rounded-full bg-[#DC2626] animate-pulse delay-150"></span>
              </div>
              <span>Consulting catalog & Google Gemini RAG...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Field */}
      <div
        className={`flex gap-2 items-center rounded-2xl border p-2 transition-all ${
          isDark
            ? 'bg-[#151515] border-[#2A2A2A] focus-within:border-[#DC2626]'
            : 'bg-white border-gray-200 focus-within:border-[#DC2626] shadow-sm'
        }`}
      >
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask about books, shelf coordinates, or reading prerequisites..."
          className={`flex-1 bg-transparent text-sm outline-none px-3 py-2 ${
            isDark ? 'text-white placeholder-gray-500' : 'text-black placeholder-gray-400'
          }`}
        />
        <button
          onClick={sendMessage}
          disabled={!input.trim() || loading}
          className="p-3 bg-[#DC2626] hover:bg-[#EF4444] disabled:opacity-40 text-white rounded-xl transition-all shadow-md shadow-[#DC2626]/20"
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  );
};

export default LibrarianChat;
