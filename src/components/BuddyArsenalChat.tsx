import React, { useEffect, useState } from 'react';
import { runBuddy } from '../core/buddyEngine';

type Message = {
  role: 'buddy' | 'user';
  text: string;
};

type Props = {
  initialPrompt?: string;
};

export default function BuddyArsenalChat({ initialPrompt }: Props) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'buddy',
      text: 'Salut 👋 Sunt Buddy. Selectează o meserie și îți arăt business-ul AI perfect.'
    }
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const processPrompt = async (text: string) => {
    if (!text.trim()) return;

    setMessages(prev => [...prev, { role: 'user', text }]);
    setLoading(true);

    try {
      const result = await runBuddy(text);

      const reply =
        `🎯 Detectat: ${result.context.detectedIntent}\n` +
        `⚡ Mod recomandat: ${result.mode}\n` +
        `💡 Recomandare: combină 2-3 API-uri gratuite și lansează MVP-ul la $9/lună.\n` +
        `💶 Potențial: €1.500–€5.000/lună`;

      setMessages(prev => [...prev, { role: 'buddy', text: reply }]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialPrompt) {
      processPrompt(initialPrompt);
    }
  }, [initialPrompt]);

  const sendMessage = async () => {
    await processPrompt(input);
    setInput('');
  };

  return (
    <div className="fixed top-4 right-4 w-96 h-[600px] border-4 border-red-500 bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl flex flex-col z-50">
      <div className="p-4 border-b border-zinc-800 font-bold text-white">
        ⚡ Buddy Arsenal
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`p-3 rounded-xl text-sm whitespace-pre-line ${
              msg.role === 'buddy'
                ? 'bg-zinc-800 text-white'
                : 'bg-green-600 text-white ml-6'
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>

      <div className="p-3 border-t border-zinc-800 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Scrie meseria sau ideea..."
          className="flex-1 px-3 py-2 bg-zinc-900 text-white rounded-xl outline-none"
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
