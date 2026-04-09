import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface AppUser {
  email: string;
  name: string;
}

interface AuthContextType {
  user: AppUser | null;
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  signup: (email: string, password: string, name: string) => Promise<{ ok: boolean; error?: string }>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + 'dr_salt_2025');
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

function getUsers(): Record<string, { hash: string; name: string }> {
  try { return JSON.parse(localStorage.getItem('dr_users') || '{}'); } catch { return {}; }
}

function saveUsers(users: Record<string, { hash: string; name: string }>) {
  localStorage.setItem('dr_users', JSON.stringify(users));
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('dr_session');
    if (stored) {
      try { setUser(JSON.parse(stored)); } catch { localStorage.removeItem('dr_session'); }
    }
  }, []);

  const signup = async (email: string, password: string, name: string) => {
    const users = getUsers();
    if (users[email]) return { ok: false, error: 'Emailul este deja inregistrat.' };
    if (password.length < 6) return { ok: false, error: 'Parola trebuie sa aiba minim 6 caractere.' };
    const hash = await hashPassword(password);
    users[email] = { hash, name };
    saveUsers(users);
    const u = { email, name };
    setUser(u);
    localStorage.setItem('dr_session', JSON.stringify(u));
    return { ok: true };
  };

  const login = async (email: string, password: string) => {
    const users = getUsers();
    if (!users[email]) return { ok: false, error: 'Nu exista cont cu acest email.' };
    const hash = await hashPassword(password);
    if (users[email].hash !== hash) return { ok: false, error: 'Parola incorecta.' };
    const u = { email, name: users[email].name };
    setUser(u);
    localStorage.setItem('dr_session', JSON.stringify(u));
    return { ok: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('dr_session');
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
}
