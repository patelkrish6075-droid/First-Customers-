import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  Send, 
  Bot, 
  User, 
  RotateCcw, 
  ArrowRight, 
  ShieldCheck, 
  HelpCircle,
  Copy,
  Check,
  Zap
} from 'lucide-react';
import { BusinessProfile, DiagnosticReport, TrackedExperiment, AssistantChatMessage } from '../types';
import { getSavedChatMessages, saveChatMessages } from '../lib/storage';

interface AIAssistantViewProps {
  profile: BusinessProfile;
  latestReport: DiagnosticReport | null;
  experiments: TrackedExperiment[];
}

export const AIAssistantView: React.FC<AIAssistantViewProps> = ({
  profile,
  latestReport,
  experiments
}) => {
  const [messages, setMessages] = useState<AssistantChatMessage[]>(() => getSavedChatMessages());
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputText;
    if (!query.trim() || isLoading) return;

    const userMsg: AssistantChatMessage = {
      id: `msg-user-${Date.now()}`,
      sender: 'user',
      content: query.trim(),
      timestamp: new Date().toISOString()
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    saveChatMessages(updatedMessages);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/assistant/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query.trim(),
          history: updatedMessages.slice(-6),
          context: {
            profile,
            latestReport,
            experimentsCount: experiments.length
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Assistant API returned status ${response.status}`);
      }

      const data = await response.json();
      const botMsg: AssistantChatMessage = {
        id: `msg-bot-${Date.now()}`,
        sender: 'assistant',
        content: data.reply || 'Strategy assessment gathered from workspace facts.',
        timestamp: new Date().toISOString(),
        suggestedFollowUps: data.suggestedFollowUps || []
      };

      const finalMessages = [...updatedMessages, botMsg];
      setMessages(finalMessages);
      saveChatMessages(finalMessages);
    } catch (err) {
      console.warn('API error, falling back to local reasoning:', err);
      const fallbackMsg: AssistantChatMessage = {
        id: `msg-bot-${Date.now()}`,
        sender: 'assistant',
        content: `Based on your profile for ${profile.productName} (${profile.targetBuyer}):\n\nThe most important constraint right now is validating whether target buyers experience sufficient daily pain to authorize payment.\n\nRecommended Action: Execute 20 direct touches presenting a concrete pricing tier ($X/mo) before coding new features.`,
        timestamp: new Date().toISOString(),
        suggestedFollowUps: ['Draft a cold outreach template', 'Review my funnel calculations']
      };
      const finalMessages = [...updatedMessages, fallbackMsg];
      setMessages(finalMessages);
      saveChatMessages(finalMessages);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetChat = () => {
    const initial = getSavedChatMessages().slice(0, 1);
    setMessages(initial);
    saveChatMessages(initial);
  };

  const handleCopyMessage = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const quickPrompts = [
    'Why aren\'t customers buying my product?',
    'Draft a 4-sentence cold outreach message for my ICP',
    'How do I conduct my first 15-minute customer interview?',
    'Analyze my current sales funnel bottleneck'
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-4 pb-20">
      {/* Header */}
      <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-stone-900">AI Strategy Assistant</h1>
            <p className="text-xs text-stone-600">
              Contextual guidance grounded in your product ({profile.productName}), constraints, and funnel numbers.
            </p>
          </div>
        </div>

        <button
          onClick={handleResetChat}
          className="text-xs font-semibold text-stone-500 hover:text-stone-800 flex items-center space-x-1 cursor-pointer self-start sm:self-auto"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Clear History</span>
        </button>
      </div>

      {/* Chat Messages Viewport */}
      <div className="bg-white border border-stone-200 rounded-2xl p-4 sm:p-6 shadow-xs min-h-[420px] max-h-[600px] overflow-y-auto space-y-4">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`flex items-start space-x-3 ${
              msg.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
            }`}
          >
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
              msg.sender === 'user' 
                ? 'bg-stone-900 text-white' 
                : 'bg-indigo-600 text-white'
            }`}>
              {msg.sender === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
            </div>

            <div className={`max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed space-y-2 ${
              msg.sender === 'user'
                ? 'bg-stone-900 text-white rounded-tr-xs'
                : 'bg-stone-50 border border-stone-200/80 text-stone-800 rounded-tl-xs'
            }`}>
              <div className="whitespace-pre-wrap">{msg.content}</div>

              {msg.sender === 'assistant' && (
                <div className="pt-2 flex items-center justify-between text-[10px] text-stone-600 border-t border-stone-200/60">
                  <span>Grounded in workspace evidence</span>
                  <button
                    onClick={() => handleCopyMessage(msg.id, msg.content)}
                    className="hover:text-stone-700 flex items-center space-x-1 cursor-pointer"
                  >
                    {copiedId === msg.id ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-600" />
                        <span className="text-emerald-700">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              )}

              {msg.suggestedFollowUps && msg.suggestedFollowUps.length > 0 && (
                <div className="pt-2 border-t border-stone-200/60 flex flex-wrap gap-1.5">
                  {msg.suggestedFollowUps.map((su, sIdx) => (
                    <button
                      key={sIdx}
                      onClick={() => handleSendMessage(su)}
                      className="text-[10px] bg-white border border-stone-200 px-2 py-1 rounded-md text-stone-700 hover:bg-stone-100 transition cursor-pointer"
                    >
                      {su} →
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-start space-x-3 animate-in fade-in">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold shrink-0">
              <Bot className="w-3.5 h-3.5" />
            </div>
            <div className="bg-stone-50 border border-stone-200 p-3.5 rounded-2xl text-xs text-stone-500 rounded-tl-xs">
              Synthesizing workspace constraints and diagnostic rules...
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompt Suggestions */}
      <div className="flex flex-wrap gap-1.5">
        {quickPrompts.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(prompt)}
            className="text-xs bg-white border border-stone-200 hover:border-stone-300 text-stone-700 px-3 py-1.5 rounded-lg transition cursor-pointer shadow-2xs"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Bar */}
      <form onSubmit={e => { e.preventDefault(); handleSendMessage(); }} className="flex gap-2">
        <input
          type="text"
          value={inputText}
          onChange={e => setInputText(e.target.value)}
          placeholder="Ask a question about cold outreach, customer interviews, or sales friction..."
          disabled={isLoading}
          className="flex-1 px-4 py-3 rounded-xl border border-stone-300 bg-white text-xs text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 shadow-2xs"
        />
        <button
          type="submit"
          disabled={!inputText.trim() || isLoading}
          className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs transition shadow-2xs cursor-pointer flex items-center space-x-1.5"
        >
          <span>Send</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
};
