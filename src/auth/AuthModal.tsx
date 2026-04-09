import { useState } from 'react';
import { useAuth } from './AuthContext';

interface Props {
  mode: 'signin' | 'signup';
  onClose: () => void;
  onSwitchMode: (m: 'signin' | 'signup') => void;
}

export default function AuthModal({ mode, onClose, onSwitchMode }: Props) {
  const { login, signup } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setError('');
    if (!email || !password) { setError('Completeaza toate campurile.'); return; }
    if (mode === 'signup' && !name) { setError('Introduceaza numele.'); return; }
    setLoading(true);
    const result = mode === 'signup'
      ? await signup(email, password, name)
      : await login(email, password);
    setLoading(false);
    if (result.ok) onClose();
    else setError(result.error || 'Eroare necunoscuta.');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 z-10">
        <button onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 text-sm font-black transition-all">
          X
        </button>

        <div className="text-center mb-8">
          <div className="text-3xl mb-3">RO</div>
          <h2 className="text-2xl font-black text-slate-900 mb-1">
            {mode === 'signup' ? 'Creeaza cont DaRomania' : 'Bine ai revenit'}
          </h2>
          <p className="text-slate-500 text-sm">
            {mode === 'signup' ? 'Inregistrare rapida, fara confirmare.' : 'Intra cu emailul si parola ta.'}
          </p>
        </div>

        <div className="space-y-3">
          {mode === 'signup' && (
            <input
              type="text" placeholder="Numele tau" value={name}
              onChange={e => setName(e.target.value)}
              className="w-full border-2 border-slate-200 focus:border-purple-500 rounded-2xl px-4 py-3 text-sm font-semibold outline-none transition-all"
            />
          )}
          <input
            type="email" placeholder="Email" value={email}
            onChange={e => setEmail(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            className="w-full border-2 border-slate-200 focus:border-purple-500 rounded-2xl px-4 py-3 text-sm font-semibold outline-none transition-all"
          />
          <input
            type="password" placeholder="Parola (minim 6 caractere)" value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            className="w-full border-2 border-slate-200 focus:border-purple-500 rounded-2xl px-4 py-3 text-sm font-semibold outline-none transition-all"
          />
        </div>

        {error && (
          <div className="mt-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 text-center">
            {error}
          </div>
        )}

        <button onClick={handleSubmit} disabled={loading}
          className="w-full mt-5 bg-purple-600 hover:bg-purple-700 text-white font-black py-4 rounded-2xl transition-all disabled:opacity-60 disabled:cursor-not-allowed text-sm">
          {loading ? 'Se proceseaza...' : mode === 'signup' ? 'Creeaza cont' : 'Intra in cont'}
        </button>

        <p className="text-center text-sm text-slate-400 mt-5">
          {mode === 'signup' ? (
            <>Ai deja cont?{' '}
              <button onClick={() => onSwitchMode('signin')} className="text-purple-600 font-black hover:underline">Intra in cont</button>
            </>
          ) : (
            <>Nu ai cont?{' '}
              <button onClick={() => onSwitchMode('signup')} className="text-purple-600 font-black hover:underline">Inregistreaza-te gratuit</button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
