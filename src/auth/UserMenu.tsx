import { useState, useRef, useEffect } from 'react';
import { useAuth } from './AuthContext';

interface Props {
  onOpenAuth: (mode: 'signin' | 'signup') => void;
  onOpenProfile?: () => void;
}

export default function UserMenu({ onOpenAuth, onOpenProfile }: Props) {
  const { user, logout, isAuthenticated } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  if (!isAuthenticated) {
    return (
      <div className="flex items-center gap-2">
        <button onClick={() => onOpenAuth('signin')}
          className="text-sm font-black text-slate-600 hover:text-purple-600 transition-colors px-3 py-2">
          Intra in cont
        </button>
        <button onClick={() => onOpenAuth('signup')}
          className="text-sm font-black bg-purple-600 text-white px-4 py-2 rounded-full hover:bg-purple-700 transition-all">
          Inregistrare
        </button>
      </div>
    );
  }

  const initials = user!.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div className="relative" ref={ref}>
      <button onClick={() => onOpenProfile ? onOpenProfile() : setOpen(o => !o)}
        className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 rounded-full pr-3 pl-1 py-1 transition-all">
        <div className="w-7 h-7 rounded-full bg-purple-600 text-white text-xs font-black flex items-center justify-center">
          {initials}
        </div>
        <span className="text-sm font-black text-slate-700 hidden sm:block max-w-[120px] truncate">
          {user!.name.split(' ')[0]}
        </span>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50">
          <div className="px-4 py-3 border-b border-slate-100">
            <div className="font-black text-slate-900 text-sm truncate">{user!.name}</div>
            <div className="text-xs text-slate-400 truncate">{user!.email}</div>
          </div>
          <div className="p-2">
            <button onClick={() => { logout(); setOpen(false); }}
              className="w-full text-left px-3 py-2.5 text-sm text-red-600 font-black hover:bg-red-50 rounded-xl transition-all">
              Deconectare
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
