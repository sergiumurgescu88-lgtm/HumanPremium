import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Crown, X, Send, Mic, MicOff, Bot } from 'lucide-react';
import Markdown from 'react-markdown';
import { runBuddy } from '../core/buddyEngine';

interface Message {
  role: 'user' | 'model';
  text: string;
}

export default function BuddyPremium() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'model', 
      text: 'Salut. Sunt **Buddy PREMIUM** — AI Executive Companion pentru ecosistemul DaRomânia.\n\nSpune-mi ce vrei să construiești, să automatizezi, să instalezi (Arsenal, OpenClaw, Academy, Afacere la Cheie) sau ce cod ai nevoie. Știu totul.' 
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage = inputText;
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setInputText('');
    setIsLoading(true);

    try {
      const result = await runBuddy(userMessage);
      
      let responseText = result.guidance;
      
      if (result.codeSnippet) {
        responseText += `\n\n\`\`\`typescript\n${result.codeSnippet}\n\`\`\``;
      }
      
      if (result.installSteps && result.installSteps.length > 0) {
        responseText += `\n\n**Pași de instalare:**\n${result.installSteps.map((step, i) => `${i+1}. ${step}`).join('\n')}`;
      }

      setMessages(prev => [...prev, { role: 'model', text: responseText }]);
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: 'model', 
        text: "Am întâmpinat o eroare la procesare. Te rog încearcă din nou sau reformulează cererea." 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-8 left-8 bg-gradient-to-br from-amber-500 via-yellow-500 to-amber-600 text-black p-5 rounded-3xl shadow-2xl hover:scale-105 active:scale-95 transition-all z-50 flex items-center gap-4 font-bold border border-amber-300 shadow-[0_0_40px_rgb(234,179,8,0.5)]"
        >
          <Crown className="w-7 h-7" />
          <div>
            <div className="text-lg tracking-tight">Buddy PREMIUM</div>
            <div className="text-[10px] text-amber-950 -mt-1">AI Executive Companion</div>
          </div>
        </button>
      )}

      {isOpen && (
        <div className="fixed bottom-8 left-8 w-[420px] h-[620px] bg-[#0A0A0A] border border-[#D4AF37] rounded-3xl shadow-2xl overflow-hidden z-50 flex flex-col">
          {/* Header Premium */}
          <div className="bg-gradient-to-r from-black via-[#1A170F] to-black p-5 flex items-center justify-between border-b border-[#D4AF37]/50">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-2xl flex items-center justify-center shadow-inner border border-amber-300">
                <Crown className="w-8 h-8 text-black" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-white tracking-tighter">Buddy PREMIUM</h3>
                <p className="text-amber-400 text-sm -mt-1">AI Executive Companion • DaRomânia</p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-amber-400 hover:text-white p-2 hover:bg-white/10 rounded-xl transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-5 space-y-5 bg-[#0A0A0A]">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] px-5 py-4 rounded-2xl text-[15px] leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-gradient-to-br from-amber-500 to-yellow-600 text-black' 
                    : 'bg-[#161613] border border-[#D4AF37]/30 text-slate-200'
                }`}>
                  <Markdown>{msg.text}</Markdown>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-[#161613] border border-amber-500/30 px-5 py-4 rounded-2xl flex items-center gap-3">
                  <Bot className="w-5 h-5 text-amber-400 animate-pulse" />
                  <span className="text-amber-400 text-sm">Buddy analizează cererea...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-[#D4AF37]/30 bg-black">
            <div className="flex gap-3">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Spune-mi ce vrei să construiești sau să instalezi..."
                className="flex-1 bg-[#161613] border border-[#D4AF37]/40 focus:border-amber-400 rounded-2xl px-5 py-4 text-white placeholder:text-slate-500 outline-none text-sm"
                disabled={isLoading}
              />
              <button
                onClick={handleSend}
                disabled={isLoading || !inputText.trim()}
                className="bg-gradient-to-br from-amber-500 to-yellow-500 text-black px-6 rounded-2xl font-bold hover:brightness-110 transition-all disabled:opacity-50"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            <div className="text-center text-[10px] text-amber-400/60 mt-3 tracking-widest">
              CODING • INSTALARE • ARHITECTURĂ • MONETIZARE
            </div>
          </div>
        </div>
      )}
    </>
  );
}
