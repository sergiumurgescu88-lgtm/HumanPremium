import React, { useState } from 'react';
import { runBuddy } from '../core/buddyEngine';

type Message = {
  role: 'buddy' | 'user';
  text: string;
};

export default function BuddyArsenalChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'buddy',
      text: 'Salut 👋 Sunt Buddy. Spune-mi meseria ta și îți arăt cum o transformi într-un business AI.'
    }
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userText = input;

    setMessages(prev => [
      ...prev,
      { role: 'user', text: userText }
    ]);

    setInput('');
    setLoading(true);

    try {
      const result = await runBuddy(userText);

      const reply =
        `🎯 Detectat: ${result.context.detectedIntent}\n` +
        `⚡ Mod recomandat: ${result.mode}\n` +
        `💡 Recomandare: combină 2-3 API-uri gratuite și lansează MVP-ul la $9/lună.\n` +
        `💶 Potențial: €1.500–€5.000/lună`;

      setMessages(prev => [
        ...prev,
        { role: 'buddy', text: reply }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed right-6 bottom-6 w-80 h-[520px] bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl flex flex-col z-50">
      <div className="p-4 border-b border-zinc-800 font-bold text-white">
        ⚡ Buddy Arsenal
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`p-3 rounded-xl text-sm whitespace-pre-line ${
              m.role === 'user'
                ? 'bg-blue-600 text-white ml-8'
                : 'bg-zinc-800 text-zinc-100 mr-8'
            }`}
          >
            {m.text}
          </div>
        ))}
      </div>

      <div className="p-3 border-t border-zinc-800 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Scrie meseria ta..."
          className="flex-1 bg-zinc-900 text-white rounded-xl px-3 py-2 outline-none"
        />

        <button
          onClick={sendMessage}
          disabled={loading}
          className="px-4 py-2 bg-green-600 rounded-xl text-white"
        >
          {loading ? '...' : 'Send'}
        </button>
      </div>
    </div>
  );
}
