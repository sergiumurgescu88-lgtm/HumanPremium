import { useState, useRef } from 'react';
import { useAuth } from './AuthContext';

interface Props { onClose: () => void; }

const DOMENII = [
  'Copywriter / Content Writer', 'Agent Imobiliar', 'HR Manager / Recruiter',
  'Social Media Manager', 'Profesor / Tutor', 'Specialist SEO',
  'Consultant / Coach', 'Developer / IT', 'Contabil / CFO', 'Altul'
];

const STADII = ['Idee — nu am pornit', 'Am pornit, caut primii clienți', 'Am primii clienți', 'Scalez activ'];

const LECTII = [
  'Introducere în AI pentru profesioniști', 'DeepSeek API — setup complet',
  'Amazon SES — emailuri automate', 'Telegram Bot — livrare automată',
  'Brave Search — research fără costuri', 'Primul tău pipeline AI',
  'Cum găsești primii 3 clienți', 'Pricing și pachete de servicii',
  'Social Media automatizat', 'SEO cu AI — audit + articole',
  'Recrutare AI-assisted', 'Scale la €5.000/lună'
];

const G = {
  rich:   '#B8860B',
  warm:   '#D4A017',
  bright: '#E8B84B',
  gleam:  '#F5CC6A',
  deep:   '#8B6508',
  muted:  '#6B4E0A',
  bg0:    '#09080C',
  bg1:    '#0E0B10',
  bg2:    '#120F04',
  bgTint: '#160F00',
  bdr0:   '#1C1608',
  bdr1:   '#2E2208',
  bdr2:   '#4A3610',
};

const GRAD_GOLD   = 'linear-gradient(135deg, #D4A017 0%, #B8860B 60%, #8B6508 100%)';
const GRAD_GLEAM  = 'linear-gradient(90deg, #B8860B, #D4A017, #E8B84B, #F5CC6A, #E8B84B, #D4A017, #B8860B)';
const GRAD_SUBTLE = 'linear-gradient(135deg, #160F00 0%, #100D02 100%)';
const GRAD_LINE   = 'linear-gradient(90deg, transparent, #D4A017, #E8B84B, #D4A017, transparent)';

function getProfile() {
  try { return JSON.parse(localStorage.getItem('dr_profile') || '{}'); } catch { return {}; }
}
function saveProfile(data: Record<string, unknown>) {
  localStorage.setItem('dr_profile', JSON.stringify({ ...getProfile(), ...data }));
}

export default function ProfilePage({ onClose }: Props) {
  const { user, logout } = useAuth();
  const [tab, setTab] = useState<'profil' | 'academia' | 'business' | 'setari'>('profil');
  const profile = getProfile();

  const [name, setName]       = useState(profile.name    || user?.name || '');
  const [domeniu, setDomeniu] = useState(profile.domeniu || '');
  const [bio, setBio]         = useState(profile.bio     || '');
  const [avatar, setAvatar]   = useState<string>(profile.avatar || '');
  const fileRef = useRef<HTMLInputElement>(null);

  const [nisa, setNisa]         = useState(profile.nisa     || '');
  const [venit, setVenit]       = useState(profile.venit    || '');
  const [stadiu, setStadiu]     = useState(profile.stadiu   || '');
  const [obiectiv, setObiectiv] = useState(profile.obiectiv || '');

  const [lectiiFinalizate, setLectiiFinalizate] = useState<string[]>(profile.lectii || []);
  const [oldPass, setOldPass]           = useState('');
  const [newPass, setNewPass]           = useState('');
  const [passMsg, setPassMsg]           = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState('');
  const [saved, setSaved]               = useState(false);

  const handleAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setAvatar(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleSaveProfil = () => {
    saveProfile({ name, domeniu, bio, avatar });
    const stored = JSON.parse(localStorage.getItem('dr_session') || '{}');
    localStorage.setItem('dr_session', JSON.stringify({ ...stored, name }));
    setSaved(true); setTimeout(() => setSaved(false), 2000);
  };

  const handleSaveBusiness = () => {
    saveProfile({ nisa, venit, stadiu, obiectiv });
    setSaved(true); setTimeout(() => setSaved(false), 2000);
  };

  const toggleLectie = (l: string) => {
    const updated = lectiiFinalizate.includes(l)
      ? lectiiFinalizate.filter(x => x !== l)
      : [...lectiiFinalizate, l];
    setLectiiFinalizate(updated);
    saveProfile({ lectii: updated });
  };

  const handleChangePass = async () => {
    setPassMsg('');
    if (!oldPass || !newPass) { setPassMsg('Completează ambele câmpuri.'); return; }
    if (newPass.length < 6) { setPassMsg('Parola nouă trebuie să aibă minim 6 caractere.'); return; }
    const users: Record<string, { hash: string; name: string }> = JSON.parse(localStorage.getItem('dr_users') || '{}');
    const email = user!.email;
    const encoder = new TextEncoder();
    const hashOld = Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', encoder.encode(oldPass + 'dr_salt_2025')))).map(b => b.toString(16).padStart(2, '0')).join('');
    if (users[email]?.hash !== hashOld) { setPassMsg('Parola veche este incorectă.'); return; }
    const hashNew = Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', encoder.encode(newPass + 'dr_salt_2025')))).map(b => b.toString(16).padStart(2, '0')).join('');
    users[email].hash = hashNew;
    localStorage.setItem('dr_users', JSON.stringify(users));
    setPassMsg('✓ Parola schimbată cu succes.');
    setOldPass(''); setNewPass('');
  };

  const handleDeleteAccount = () => {
    if (deleteConfirm !== user?.email) return;
    const users: Record<string, unknown> = JSON.parse(localStorage.getItem('dr_users') || '{}');
    delete users[user!.email];
    localStorage.setItem('dr_users', JSON.stringify(users));
    localStorage.removeItem('dr_session');
    localStorage.removeItem('dr_profile');
    logout(); onClose();
  };

  const initials = (name || user?.name || 'U').split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);
  const progress = Math.round((lectiiFinalizate.length / LECTII.length) * 100);

  const TABS = [
    { id: 'profil',   label: 'Profil',   icon: '◈' },
    { id: 'academia', label: 'Academie', icon: '◎' },
    { id: 'business', label: 'Business', icon: '◆' },
    { id: 'setari',   label: 'Setări',   icon: '◉' },
  ] as const;

  const inputBase: React.CSSProperties = { background: G.bg2, border: `1px solid ${G.bdr1}`, color: '#F0E8D0' };
  const inputCss = "w-full rounded-xl px-4 py-3 text-sm font-medium outline-none transition-all placeholder:opacity-25 resize-none";

  const fh = {
    onFocus: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      e.target.style.borderColor = G.warm;
      e.target.style.boxShadow = '0 0 0 2px rgba(212,160,23,0.12)';
    },
    onBlur: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      e.target.style.borderColor = G.bdr1;
      e.target.style.boxShadow = 'none';
    },
  };

  const labelCss = "text-xs font-bold tracking-widest uppercase mb-2 block";
  const btnSave = saved
    ? { background: '#0B1F0B', color: '#4ade80', border: '1px solid #1A4A1A' }
    : { background: GRAD_GOLD, color: G.bg0, boxShadow: '0 4px 20px rgba(184,134,11,0.30)' };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" style={{ background: G.bg0 }}>

      {/* Top bar */}
      <div className="sticky top-0 z-10" style={{ background: G.bg1, borderBottom: `1px solid ${G.bdr0}` }}>
        <div className="h-px w-full" style={{ background: GRAD_LINE }} />
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <button onClick={onClose}
            className="flex items-center gap-2 text-sm font-bold transition-all hover:opacity-60"
            style={{ color: G.warm }}>
            ← Înapoi la platformă
          </button>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: G.warm }} />
            <span className="text-xs font-bold tracking-widest uppercase" style={{ color: G.muted }}>Dashboard</span>
          </div>
          <button onClick={() => { logout(); onClose(); }}
            className="text-xs font-bold tracking-widest uppercase transition-colors hover:text-red-400"
            style={{ color: '#3A2A2A' }}>
            Deconectare
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10">

        {/* Hero card */}
        <div className="rounded-2xl p-8 mb-8 relative overflow-hidden"
          style={{ background: GRAD_SUBTLE, border: `1px solid ${G.bdr1}` }}>
          <div className="absolute top-0 left-0 right-0 h-px" style={{ background: GRAD_LINE }} />
          <div className="absolute top-4 right-4 opacity-5 text-6xl font-black select-none pointer-events-none"
            style={{ color: G.gleam }}>◆</div>

          <div className="flex items-center gap-6">
            <div className="relative flex-shrink-0">
              {avatar
                ? <img src={avatar} alt="avatar" className="w-20 h-20 rounded-xl object-cover"
                    style={{ border: `2px solid ${G.warm}`, boxShadow: '0 0 20px rgba(212,160,23,0.25)' }} />
                : (
                  <div className="w-20 h-20 rounded-xl flex items-center justify-center text-2xl font-black"
                    style={{ background: GRAD_GOLD, color: G.bg0, boxShadow: '0 4px 24px rgba(184,134,11,0.35)' }}>
                    {initials}
                  </div>
                )
              }
              <button onClick={() => fileRef.current?.click()}
                className="absolute -bottom-2 -right-2 w-7 h-7 rounded-lg flex items-center justify-center text-xs transition-all hover:scale-110"
                style={{ background: G.bg1, border: `1px solid ${G.bdr2}`, color: G.warm }}>
                ↑
              </button>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatar} />
            </div>

            <div className="flex-1 min-w-0">
              <div className="text-2xl font-black text-white truncate" style={{ letterSpacing: '-0.02em' }}>
                {name || user?.name}
              </div>
              <div className="text-sm mt-0.5 truncate" style={{ color: G.muted }}>{user?.email}</div>
              {domeniu && (
                <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-lg text-xs font-bold"
                  style={{ background: G.bgTint, border: `1px solid ${G.bdr2}`, color: G.bright }}>
                  ◆ {domeniu}
                </div>
              )}
            </div>

            <div className="flex-shrink-0 text-right">
              <div className="text-4xl font-black" style={{
                background: GRAD_GLEAM, backgroundSize: '200%',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              }}>
                {progress}%
              </div>
              <div className="text-xs font-bold tracking-widest uppercase mt-1" style={{ color: G.muted }}>
                Academie completată
              </div>
              <div className="mt-3 w-32 rounded-full h-1.5" style={{ background: G.bdr0 }}>
                <div className="h-1.5 rounded-full transition-all"
                  style={{ width: `${progress}%`, background: GRAD_GLEAM, backgroundSize: '200%' }} />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-8 pt-8" style={{ borderTop: `1px solid ${G.bdr0}` }}>
            {[
              { label: 'Lecții finalizate', val: `${lectiiFinalizate.length} / ${LECTII.length}` },
              { label: 'Stadiu business',   val: stadiu || '—' },
              { label: 'Venit estimat',     val: venit  || '—' },
            ].map((s, i) => (
              <div key={i}>
                <div className="text-xs font-bold tracking-widest uppercase mb-1" style={{ color: G.muted }}>{s.label}</div>
                <div className="font-bold text-sm truncate" style={{ color: '#E8DCC8' }}>{s.val}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 p-1 rounded-xl" style={{ background: G.bg1, border: `1px solid ${G.bdr0}` }}>
          {TABS.map(t => {
            const active = tab === t.id;
            return (
              <button key={t.id} onClick={() => setTab(t.id)}
                className="flex-1 py-2.5 text-xs font-bold tracking-widest uppercase rounded-lg transition-all flex items-center justify-center gap-2"
                style={active
                  ? { background: GRAD_SUBTLE, color: G.bright, border: `1px solid ${G.bdr2}`, boxShadow: '0 0 12px rgba(212,160,23,0.12)' }
                  : { color: G.muted, background: 'transparent', border: '1px solid transparent' }}>
                <span>{t.icon}</span> {t.label}
              </button>
            );
          })}
        </div>

        {/* TAB PROFIL */}
        {tab === 'profil' && (
          <div className="rounded-2xl p-8 space-y-5 relative overflow-hidden"
            style={{ background: G.bg1, border: `1px solid ${G.bdr1}` }}>
            <div className="absolute top-0 left-0 right-0 h-px" style={{ background: GRAD_LINE }} />
            <h2 className="text-white font-black text-lg mb-6" style={{ letterSpacing: '-0.02em' }}>Informații personale</h2>
            <div>
              <label className={labelCss} style={{ color: G.warm }}>Nume complet</label>
              <input value={name} onChange={e => setName(e.target.value)} placeholder="Numele tău"
                className={inputCss} style={inputBase} {...fh} />
            </div>
            <div>
              <label className={labelCss} style={{ color: G.warm }}>Email</label>
              <input value={user?.email} disabled className={inputCss}
                style={{ ...inputBase, opacity: 0.35, cursor: 'not-allowed' }} />
            </div>
            <div>
              <label className={labelCss} style={{ color: G.warm }}>Meserie / Domeniu</label>
              <select value={domeniu} onChange={e => setDomeniu(e.target.value)}
                className={inputCss} style={{ ...inputBase, colorScheme: 'dark' }} {...fh}>
                <option value="">Selectează domeniul tău</option>
                {DOMENII.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCss} style={{ color: G.warm }}>Bio scurt</label>
              <textarea value={bio} onChange={e => setBio(e.target.value)} rows={3}
                placeholder="Câteva cuvinte despre tine și ce construiești..."
                className={inputCss} style={inputBase} {...fh} />
            </div>
            <button onClick={handleSaveProfil}
              className="w-full py-3.5 rounded-xl font-black text-sm tracking-widest uppercase transition-all"
              style={btnSave}>
              {saved ? '✓ Salvat cu succes' : 'Salvează profilul'}
            </button>
          </div>
        )}

        {/* TAB ACADEMIA */}
        {tab === 'academia' && (
          <div className="rounded-2xl p-8 relative overflow-hidden"
            style={{ background: G.bg1, border: `1px solid ${G.bdr1}` }}>
            <div className="absolute top-0 left-0 right-0 h-px" style={{ background: GRAD_LINE }} />
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-white font-black text-lg" style={{ letterSpacing: '-0.02em' }}>Progres Academie</h2>
              <span className="text-xs font-bold tracking-widest uppercase px-3 py-1.5 rounded-lg"
                style={{ background: G.bgTint, color: G.bright, border: `1px solid ${G.bdr2}` }}>
                {lectiiFinalizate.length} / {LECTII.length} lecții
              </span>
            </div>
            <div className="w-full rounded-full h-2 mb-8 overflow-hidden" style={{ background: G.bdr0 }}>
              <div className="h-2 rounded-full transition-all"
                style={{ width: `${progress}%`, background: GRAD_GLEAM, backgroundSize: '300%' }} />
            </div>
            <div className="space-y-2">
              {LECTII.map((lectie, i) => {
                const done = lectiiFinalizate.includes(lectie);
                return (
                  <div key={i} onClick={() => toggleLectie(lectie)}
                    className="flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all"
                    style={done
                      ? { background: G.bgTint, border: `1px solid ${G.bdr2}` }
                      : { background: G.bg2,    border: `1px solid ${G.bdr0}` }}
                    onMouseEnter={e => { if (!done) (e.currentTarget as HTMLDivElement).style.borderColor = G.bdr1; }}
                    onMouseLeave={e => { if (!done) (e.currentTarget as HTMLDivElement).style.borderColor = G.bdr0; }}>
                    <div className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0 transition-all"
                      style={done
                        ? { background: GRAD_GOLD }
                        : { background: 'transparent', border: `1px solid ${G.bdr1}` }}>
                      {done && <span className="text-xs font-black" style={{ color: G.bg0 }}>✓</span>}
                    </div>
                    <span className="text-sm font-medium flex-1"
                      style={{ color: done ? G.muted : '#C8B896', textDecoration: done ? 'line-through' : 'none' }}>
                      <span style={{ color: G.bdr2 }}>{String(i + 1).padStart(2, '0')}. </span>{lectie}
                    </span>
                    {done && <span className="text-xs font-bold" style={{ color: G.warm }}>Finalizat</span>}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB BUSINESS */}
        {tab === 'business' && (
          <div className="rounded-2xl p-8 space-y-5 relative overflow-hidden"
            style={{ background: G.bg1, border: `1px solid ${G.bdr1}` }}>
            <div className="absolute top-0 left-0 right-0 h-px" style={{ background: GRAD_LINE }} />
            <h2 className="text-white font-black text-lg mb-6" style={{ letterSpacing: '-0.02em' }}>Business-ul meu</h2>
            <div>
              <label className={labelCss} style={{ color: G.warm }}>Nișa / Industria</label>
              <input value={nisa} onChange={e => setNisa(e.target.value)}
                placeholder="ex: Agenție content pentru restaurante"
                className={inputCss} style={inputBase} {...fh} />
            </div>
            <div>
              <label className={labelCss} style={{ color: G.warm }}>Venit lunar estimat</label>
              <input value={venit} onChange={e => setVenit(e.target.value)}
                placeholder="ex: €1.500 / lună"
                className={inputCss} style={inputBase} {...fh} />
            </div>
            <div>
              <label className={labelCss} style={{ color: G.warm }}>Stadiu actual</label>
              <select value={stadiu} onChange={e => setStadiu(e.target.value)}
                className={inputCss} style={{ ...inputBase, colorScheme: 'dark' }} {...fh}>
                <option value="">Selectează stadiul</option>
                {STADII.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCss} style={{ color: G.warm }}>Obiectiv luna aceasta</label>
              <textarea value={obiectiv} onChange={e => setObiectiv(e.target.value)} rows={3}
                placeholder="ex: Să închid primii 2 clienți și să ajung la €500/lună"
                className={inputCss} style={inputBase} {...fh} />
            </div>
            <button onClick={handleSaveBusiness}
              className="w-full py-3.5 rounded-xl font-black text-sm tracking-widest uppercase transition-all"
              style={btnSave}>
              {saved ? '✓ Salvat cu succes' : 'Salvează business-ul'}
            </button>
          </div>
        )}

        {/* TAB SETARI */}
        {tab === 'setari' && (
          <div className="space-y-4">
            <div className="rounded-2xl p-8 space-y-4 relative overflow-hidden"
              style={{ background: G.bg1, border: `1px solid ${G.bdr1}` }}>
              <div className="absolute top-0 left-0 right-0 h-px" style={{ background: GRAD_LINE }} />
              <h2 className="text-white font-black text-lg mb-2" style={{ letterSpacing: '-0.02em' }}>Schimbă parola</h2>
              <div>
                <label className={labelCss} style={{ color: G.warm }}>Parola actuală</label>
                <input type="password" value={oldPass} onChange={e => setOldPass(e.target.value)}
                  placeholder="••••••••" className={inputCss} style={inputBase} {...fh} />
              </div>
              <div>
                <label className={labelCss} style={{ color: G.warm }}>Parola nouă</label>
                <input type="password" value={newPass} onChange={e => setNewPass(e.target.value)}
                  placeholder="Minim 6 caractere" className={inputCss} style={inputBase} {...fh} />
              </div>
              {passMsg && (
                <div className="text-sm px-4 py-3 rounded-xl font-medium"
                  style={passMsg.includes('succes')
                    ? { background: '#0B1F0B', color: '#4ade80', border: '1px solid #1A4A1A' }
                    : { background: '#1A0808', color: '#F87171', border: '1px solid #3A1010' }}>
                  {passMsg}
                </div>
              )}
              <button onClick={handleChangePass}
                className="w-full py-3.5 rounded-xl font-black text-sm tracking-widest uppercase transition-all"
                style={{ background: GRAD_GOLD, color: G.bg0, boxShadow: '0 4px 20px rgba(184,134,11,0.25)' }}>
                Schimbă parola
              </button>
            </div>

            <div className="rounded-2xl p-8 space-y-4"
              style={{ background: G.bg1, border: '1px solid #2A1010' }}>
              <h2 className="font-black text-lg" style={{ color: '#EF4444', letterSpacing: '-0.02em' }}>Șterge contul</h2>
              <p className="text-sm leading-relaxed" style={{ color: '#5A3A3A' }}>
                Această acțiune este ireversibilă. Toate datele tale vor fi șterse permanent din sistem.
              </p>
              <div>
                <label className="text-xs font-bold tracking-widest uppercase mb-2 block" style={{ color: '#8B3030' }}>
                  Scrie "{user?.email}" pentru confirmare
                </label>
                <input value={deleteConfirm} onChange={e => setDeleteConfirm(e.target.value)}
                  placeholder={user?.email} className={inputCss}
                  style={{ ...inputBase, borderColor: '#2A1010' }}
                  onFocus={e => { e.target.style.borderColor = '#5A2020'; }}
                  onBlur={e  => { e.target.style.borderColor = '#2A1010'; }} />
              </div>
              <button onClick={handleDeleteAccount} disabled={deleteConfirm !== user?.email}
                className="w-full py-3.5 rounded-xl font-black text-sm tracking-widest uppercase transition-all"
                style={deleteConfirm === user?.email
                  ? { background: '#EF4444', color: '#fff', boxShadow: '0 4px 20px rgba(239,68,68,0.30)' }
                  : { background: '#1A0808', color: '#3A1010', cursor: 'not-allowed', border: '1px solid #2A1010' }}>
                Șterge contul definitiv
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
