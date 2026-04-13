import React, { createContext, useContext, useState } from 'react';
import type { GlobalMode } from '../state/agentModes';

type AgentContextType = {
  mode: GlobalMode;
  setMode: (mode: GlobalMode) => void;
};

const AgentStateContext = createContext<AgentContextType | undefined>(undefined);

export const AgentStateProvider = ({ children }: { children: React.ReactNode }) => {
  const [mode, setMode] = useState<GlobalMode>('chat');

  return (
    <AgentStateContext.Provider value={{ mode, setMode }}>
      {children}
    </AgentStateContext.Provider>
  );
};

export const useAgentState = () => {
  const ctx = useContext(AgentStateContext);

  if (!ctx) {
    throw new Error('useAgentState must be used inside AgentStateProvider');
  }

  return ctx;
};
