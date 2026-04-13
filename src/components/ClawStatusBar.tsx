import React from 'react';
import { MODE_CONFIG, AGENTS } from '../state/agentModes';
import { useAgentState } from '../context/AgentStateProvider';

export default function ClawStatusBar() {
  const { mode, setMode } = useAgentState();
  const config = MODE_CONFIG[mode];

  return (
    <div className="w-full p-4 rounded-2xl border border-white/10 bg-black/30 backdrop-blur-md mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className={`font-bold text-lg ${config.text}`}>
          {config.label}
        </div>

        <div className="flex gap-2 flex-wrap">
          {Object.keys(MODE_CONFIG).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m as any)}
              className="px-3 py-1 rounded-xl border border-white/10 text-sm"
            >
              {MODE_CONFIG[m as keyof typeof MODE_CONFIG].label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-5 gap-3">
        {AGENTS.map((agent) => (
          <div
            key={agent}
            className="rounded-xl p-3 border border-white/10 bg-white/5"
          >
            <div className="font-semibold text-sm">{agent}</div>
            <div className={`text-xs mt-1 ${config.text}`}>
              ACTIVE
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
