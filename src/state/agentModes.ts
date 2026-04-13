export type GlobalMode = 'coding' | 'marketing' | 'side_hustle' | 'chat';

export const MODE_CONFIG = {
  coding: {
    label: 'CODING',
    color: 'bg-green-500',
    text: 'text-green-400',
  },
  marketing: {
    label: 'MARKETING',
    color: 'bg-orange-500',
    text: 'text-orange-400',
  },
  side_hustle: {
    label: 'SIDE HUSTLE',
    color: 'bg-red-500',
    text: 'text-red-400',
  },
  chat: {
    label: 'CHAT',
    color: 'bg-purple-500',
    text: 'text-purple-400',
  },
} as const;

export const AGENTS = [
  'Buddy',
  'PaperclipClaw',
  'OpenClaw',
  'NemoClaw',
  'HermesClaw',
];
