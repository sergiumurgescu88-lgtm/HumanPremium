#!/usr/bin/env bash
# ============================================================
#  fix_all.sh — patch complet pentru daeu.online / hp-repo
#  Rulează din ~/hp-repo sau /opt/daeu
# ============================================================
set -e

REPO_DIR="$(pwd)"
SRC="$REPO_DIR/src"

echo "=== [0] Verificare director ==="
if [ ! -f "$SRC/DaRomaniaApp.tsx" ]; then
  echo "ERROR: Nu găsesc src/DaRomaniaApp.tsx în $(pwd)"
  echo "Rulează scriptul din rădăcina proiectului (hp-repo sau /opt/daeu)"
  exit 1
fi
echo "OK — director corect: $REPO_DIR"

# ============================================================
# [1] Unifică callAI — schimbă Supabase cu /api/chat direct
# ============================================================
echo ""
echo "=== [1] Unificare callAI ==="

python3 - << 'PYEOF'
import sys, re

path = "src/DaRomaniaApp.tsx"
with open(path, "r") as f:
    c = f.read()

# Cauta definitia callAI si inlocuieste endpoint-ul
old_patterns = [
    # Pattern 1: Supabase functions URL
    (
        r"const\s+SUPABASE_URL\s*=\s*['\"]https://[^'\"]+['\"];?\s*\n"
        r"(.*?\n)*?.*?/functions/v1/chat",
        None  # Handled separately below
    ),
]

# Inlocuieste orice referinta la supabase chat endpoint
replacements = [
    # Endpoint supabase -> /api/chat
    (r"[`'\"]https://[a-zA-Z0-9]+\.supabase\.co/functions/v1/chat[`'\"]",
     "'https://daeu.online/api/chat'"),
    # Variabila ${SUPABASE_URL}/functions/v1/chat
    (r"`\$\{SUPABASE_URL\}/functions/v1/chat`",
     "'https://daeu.online/api/chat'"),
    # sau cu concatenare string
    (r"SUPABASE_URL\s*\+\s*['\"]\/functions\/v1\/chat['\"]",
     "'https://daeu.online/api/chat'"),
]

changed = False
for pattern, replacement in replacements:
    new_c = re.sub(pattern, replacement, c)
    if new_c != c:
        c = new_c
        changed = True
        print(f"  ✓ Inlocuit: {pattern[:60]}...")

if changed:
    with open(path, "w") as f:
        f.write(c)
    print("  → callAI endpoint unificat cu succes")
else:
    print("  → Deja unificat sau pattern-ul nu a fost gasit (verificare manuala recomandata)")
PYEOF

# ============================================================
# [2] Revert generateLuckyAnswer → folosește callAI
# ============================================================
echo ""
echo "=== [2] Revert generateLuckyAnswer → callAI ==="

python3 - << 'PYEOF'
import re

path = "src/DaRomaniaApp.tsx"
with open(path, "r") as f:
    c = f.read()

# Cauta versiunea cu fetch inline si o inlocuieste cu callAI
old_fetch = r"""  const generateLuckyAnswer = async \(qKey: 'q1' \| 'q2' \| 'q3', questionText: string\) => \{
    if \(!selectedJob\) return;
    setLuckyLoading\(prev => \(\{ \.\.\.prev, \[qKey\]: true \}\)\);
    try \{
      const prompt = `.+?`;
      const res = await fetch\('https://daeu\.online/api/chat', \{
        method: 'POST',
        headers: \{ 'Content-Type': 'application/json' \},
        body: JSON\.stringify\(\{ messages: \[\{ role: 'user', content: prompt \}\], lucky: true \}\)
      \}\);
      const data = await res\.json\(\);
      const _luckyText = data\.text \|\| '';
      if \(_luckyText\) \{ setContextAnswers\(prev => \(\{ \.\.\.prev, \[qKey\]: _luckyText\.trim\(\) \}\)\); \}
    \} catch \(error\) \{
      console\.error\("Error generating lucky answer:", error\);
    \} finally \{
      setLuckyLoading\(prev => \(\{ \.\.\.prev, \[qKey\]: false \}\)\);
    \}
  \};"""

new_callai = """  const generateLuckyAnswer = async (qKey: 'q1' | 'q2' | 'q3', questionText: string) => {
    if (!selectedJob) return;
    setLuckyLoading(prev => ({ ...prev, [qKey]: true }));
    try {
      const prompt = `Ești un ${selectedJob.title}. Răspunde scurt (maxim 10-15 cuvinte), la persoana a I-a, la următoarea întrebare despre preferințele tale profesionale: "${questionText}". Fii creativ, realist și foarte specific meseriei tale. Nu folosi ghilimele.`;
      const _luckyText = await callAI(prompt, undefined, true);
      if (_luckyText) { setContextAnswers(prev => ({ ...prev, [qKey]: _luckyText.trim() })); }
    } catch (error) {
      console.error("Error generating lucky answer:", error);
    } finally {
      setLuckyLoading(prev => ({ ...prev, [qKey]: false }));
    }
  };"""

new_c = re.sub(old_fetch, new_callai, c, flags=re.DOTALL)

if new_c != c:
    with open(path, "w") as f:
        f.write(new_c)
    print("  ✓ generateLuckyAnswer revenit la callAI")
else:
    # Verifică dacă e deja ok
    if "await callAI(prompt, undefined, true)" in c and "generateLuckyAnswer" in c:
        print("  → Deja folosește callAI, nimic de schimbat")
    else:
        print("  ⚠ Pattern nu s-a potrivit exact — verifică manual linia 953")
PYEOF

# ============================================================
# [3] Creare pagini lipsă
# ============================================================
echo ""
echo "=== [3] Creare pagini lipsă ==="

mkdir -p "$SRC/pages"

# --- Academy.tsx ---
cat > "$SRC/pages/Academy.tsx" << 'TSX'
import React from 'react';

const Academy: React.FC = () => {
  const features = [
    { icon: '🎓', title: 'Cursuri Video HD', desc: 'Peste 200 de ore de conținut practic, actualizat lunar' },
    { icon: '🤖', title: 'AI Mentor Personal', desc: 'Asistent AI disponibil 24/7 pentru întrebările tale' },
    { icon: '📋', title: 'Proiecte Reale', desc: '71 de proiecte cu feedback de la experți din industrie' },
    { icon: '🏆', title: 'Certificare Recunoscută', desc: 'Certificat verificabil, acceptat de angajatori top din RO' },
    { icon: '👥', title: 'Comunitate Activă', desc: 'Acces la grupul privat cu 2,400+ profesioniști' },
    { icon: '♾️', title: 'Acces Pe Viață', desc: 'Plătești o dată, ai acces la toate actualizările viitoare' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)', color: '#fff', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '60px 24px' }}>
        {/* Hero */}
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <div style={{ display: 'inline-block', background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.4)', borderRadius: 20, padding: '6px 18px', fontSize: 13, color: '#a78bfa', marginBottom: 20 }}>
            🎓 ACADEMIA DA ROMÂNIA
          </div>
          <h1 style={{ fontSize: 'clamp(32px, 6vw, 56px)', fontWeight: 800, margin: '0 0 20px', lineHeight: 1.15 }}>
            Devino expert în{' '}
            <span style={{ background: 'linear-gradient(90deg, #a78bfa, #60a5fa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              noua economie
            </span>
          </h1>
          <p style={{ fontSize: 18, color: '#94a3b8', maxWidth: 580, margin: '0 auto 32px', lineHeight: 1.7 }}>
            Cursuri practice, proiecte reale și un AI mentor care te ghidează pas cu pas spre cariera pe care o meriți.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="/checkout?plan=academy" style={{ display: 'inline-block', background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)', color: '#fff', padding: '14px 32px', borderRadius: 12, fontSize: 16, fontWeight: 700, textDecoration: 'none' }}>
              Înscrie-te — $29/lună →
            </a>
            <a href="#features" style={{ display: 'inline-block', background: 'rgba(255,255,255,0.08)', color: '#e2e8f0', padding: '14px 32px', borderRadius: 12, fontSize: 16, textDecoration: 'none' }}>
              Vezi curriculum
            </a>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, marginBottom: 64, textAlign: 'center' }}>
          {[['71', 'Proiecte practice'], ['2,400+', 'Studenți activi'], ['94%', 'Rată de angajare']].map(([val, label]) => (
            <div key={label} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, padding: '28px 16px' }}>
              <div style={{ fontSize: 36, fontWeight: 800, color: '#a78bfa' }}>{val}</div>
              <div style={{ color: '#94a3b8', fontSize: 14, marginTop: 6 }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Features */}
        <div id="features" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24, marginBottom: 64 }}>
          {features.map((f) => (
            <div key={f.title} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(139,92,246,0.2)', borderRadius: 16, padding: 28 }}>
              <div style={{ fontSize: 36, marginBottom: 14 }}>{f.icon}</div>
              <h3 style={{ margin: '0 0 10px', fontSize: 18, fontWeight: 700 }}>{f.title}</h3>
              <p style={{ color: '#94a3b8', fontSize: 14, margin: 0, lineHeight: 1.6 }}>{f.desc}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center', background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.3)', borderRadius: 24, padding: '48px 32px' }}>
          <h2 style={{ fontSize: 28, fontWeight: 800, margin: '0 0 12px' }}>Gata să începi?</h2>
          <p style={{ color: '#94a3b8', marginBottom: 28 }}>Primul modul e gratuit. Fără card de credit necesar.</p>
          <a href="/checkout?plan=academy" style={{ display: 'inline-block', background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)', color: '#fff', padding: '16px 40px', borderRadius: 12, fontSize: 18, fontWeight: 700, textDecoration: 'none' }}>
            Începe Gratuit Acum →
          </a>
        </div>
      </div>
    </div>
  );
};

export default Academy;
TSX
echo "  ✓ src/pages/Academy.tsx creat"

# --- AfacereLaCheie.tsx ---
cat > "$SRC/pages/AfacereLaCheie.tsx" << 'TSX'
import React from 'react';

const AfacereLaCheie: React.FC = () => {
  const steps = [
    { num: '01', title: 'Consultație Gratuită', desc: 'Discutăm viziunea ta și identificăm cea mai profitabilă nișă' },
    { num: '02', title: 'Strategie Personalizată', desc: 'Echipa noastră construiește planul complet de business' },
    { num: '03', title: 'Implementare Completă', desc: 'Lansăm tot: site, branding, procese, primii clienți' },
    { num: '04', title: 'Predare & Suport 30 Zile', desc: 'Preluai afacerea gata de funcționare, cu suport inclus' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)', color: '#fff', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '60px 24px' }}>
        {/* Hero */}
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <div style={{ display: 'inline-block', background: 'rgba(234,179,8,0.15)', border: '1px solid rgba(234,179,8,0.4)', borderRadius: 20, padding: '6px 18px', fontSize: 13, color: '#fbbf24', marginBottom: 20 }}>
            🏆 DONE-FOR-YOU BUSINESS
          </div>
          <h1 style={{ fontSize: 'clamp(32px, 6vw, 56px)', fontWeight: 800, margin: '0 0 20px', lineHeight: 1.15 }}>
            Afacerea ta,{' '}
            <span style={{ background: 'linear-gradient(90deg, #fbbf24, #f59e0b)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              gata în 14 zile
            </span>
          </h1>
          <p style={{ fontSize: 18, color: '#94a3b8', maxWidth: 600, margin: '0 auto 32px', lineHeight: 1.7 }}>
            Tu alegi viziunea. Noi facem tot restul. Primești o afacere complet funcțională, gata să genereze venituri din prima săptămână.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="/checkout?plan=afacerelacheie" style={{ display: 'inline-block', background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#000', padding: '14px 32px', borderRadius: 12, fontSize: 16, fontWeight: 800, textDecoration: 'none' }}>
              Rezervă Locul — $99 →
            </a>
            <a href="#process" style={{ display: 'inline-block', background: 'rgba(255,255,255,0.08)', color: '#e2e8f0', padding: '14px 32px', borderRadius: 12, fontSize: 16, textDecoration: 'none' }}>
              Cum funcționează
            </a>
          </div>
          <p style={{ color: '#64748b', fontSize: 13, marginTop: 14 }}>⚡ Doar 5 locuri disponibile pe lună</p>
        </div>

        {/* Process */}
        <div id="process" style={{ marginBottom: 64 }}>
          <h2 style={{ textAlign: 'center', fontSize: 28, fontWeight: 800, marginBottom: 40 }}>Procesul nostru în 4 pași</h2>
          <div style={{ display: 'grid', gap: 20 }}>
            {steps.map((s) => (
              <div key={s.num} style={{ display: 'flex', gap: 24, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(251,191,36,0.2)', borderRadius: 16, padding: '24px 28px', alignItems: 'flex-start' }}>
                <div style={{ fontSize: 32, fontWeight: 900, color: '#fbbf24', minWidth: 48, opacity: 0.7 }}>{s.num}</div>
                <div>
                  <h3 style={{ margin: '0 0 8px', fontSize: 18, fontWeight: 700 }}>{s.title}</h3>
                  <p style={{ color: '#94a3b8', margin: 0, lineHeight: 1.6 }}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Includes */}
        <div style={{ background: 'rgba(251,191,36,0.06)', border: '1px solid rgba(251,191,36,0.25)', borderRadius: 24, padding: '40px 32px', marginBottom: 48, textAlign: 'center' }}>
          <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 28 }}>Ce primești în pachet</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, textAlign: 'left' }}>
            {[
              '✅ Site complet (design + dev)',
              '✅ Brand identity (logo, culori, fonturi)',
              '✅ Strategie de marketing 90 zile',
              '✅ Primii 3 clienți garantați',
              '✅ Automatizări CRM + email',
              '✅ Training echipă 2h live',
              '✅ Suport 30 de zile post-lansare',
              '✅ Documentație completă de procese',
            ].map(item => (
              <div key={item} style={{ color: '#e2e8f0', fontSize: 14, padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>{item}</div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center' }}>
          <a href="/checkout?plan=afacerelacheie" style={{ display: 'inline-block', background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#000', padding: '18px 48px', borderRadius: 14, fontSize: 20, fontWeight: 800, textDecoration: 'none' }}>
            Vreau Afacerea Mea →
          </a>
          <p style={{ color: '#64748b', fontSize: 13, marginTop: 16 }}>Garanție 100% rambursare dacă nu livrăm în 14 zile</p>
        </div>
      </div>
    </div>
  );
};

export default AfacereLaCheie;
TSX
echo "  ✓ src/pages/AfacereLaCheie.tsx creat"

# --- ArsenalAPI.tsx ---
cat > "$SRC/pages/ArsenalAPI.tsx" << 'TSX'
import React, { useState } from 'react';

const APIS = [
  { cat: '🤖 AI & ML', items: ['OpenAI GPT-4o', 'Anthropic Claude', 'Google Gemini', 'Stability AI', 'Whisper STT', 'ElevenLabs TTS'] },
  { cat: '💳 Plăți', items: ['Stripe', 'PayPal', 'Revolut Business', 'Netopia', 'euPlatesc', 'Braintree'] },
  { cat: '📧 Email & SMS', items: ['Resend', 'SendGrid', 'Postmark', 'Twilio SMS', 'WhatsApp Business', 'Mailchimp'] },
  { cat: '🔐 Auth & Users', items: ['Supabase Auth', 'Auth0', 'Firebase Auth', 'Clerk', 'Magic.link', 'Okta'] },
  { cat: '📊 Analytics', items: ['Google Analytics 4', 'Mixpanel', 'Amplitude', 'Posthog', 'Hotjar', 'Heap'] },
  { cat: '☁️ Storage & DB', items: ['Supabase DB', 'Firebase', 'PlanetScale', 'Neon', 'Cloudflare R2', 'AWS S3'] },
  { cat: '🗺️ Maps & Location', items: ['Google Maps', 'Mapbox', 'OpenStreetMap', 'IPInfo', 'Geocodio', 'HERE Maps'] },
  { cat: '🛒 eCommerce', items: ['Shopify', 'WooCommerce', 'Ecwid', 'Snipcart', 'Paddle', 'Lemon Squeezy'] },
];

const ArsenalAPI: React.FC = () => {
  const [search, setSearch] = useState('');
  const filtered = APIS.map(cat => ({
    ...cat,
    items: cat.items.filter(i => i.toLowerCase().includes(search.toLowerCase())),
  })).filter(cat => cat.items.length > 0 || search === '');

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #020617 0%, #0f172a 50%, #1e1b4b 100%)', color: '#fff', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ maxWidth: 960, margin: '0 auto', padding: '60px 24px' }}>
        {/* Hero */}
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{ display: 'inline-block', background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.4)', borderRadius: 20, padding: '6px 18px', fontSize: 13, color: '#818cf8', marginBottom: 20 }}>
            ⚡ ARSENAL API
          </div>
          <h1 style={{ fontSize: 'clamp(32px, 6vw, 52px)', fontWeight: 800, margin: '0 0 16px', lineHeight: 1.2 }}>
            150+ API-uri esențiale,{' '}
            <span style={{ background: 'linear-gradient(90deg, #818cf8, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              un singur loc
            </span>
          </h1>
          <p style={{ fontSize: 17, color: '#94a3b8', maxWidth: 560, margin: '0 auto 28px', lineHeight: 1.7 }}>
            Ghid complet cu documentație, exemple de cod și integrări gata de copiat pentru orice proiect digital.
          </p>
          <a href="/checkout?plan=arsenalapi" style={{ display: 'inline-block', background: 'linear-gradient(135deg, #6366f1, #4f46e5)', color: '#fff', padding: '14px 36px', borderRadius: 12, fontSize: 16, fontWeight: 700, textDecoration: 'none' }}>
            Obține Accesul — $9 one-time →
          </a>
          <p style={{ color: '#475569', fontSize: 13, marginTop: 12 }}>Acces pe viață • Actualizări incluse • Fără abonament</p>
        </div>

        {/* Search */}
        <div style={{ marginBottom: 40 }}>
          <input
            type="text"
            placeholder="🔍 Caută un API (ex: Stripe, OpenAI, Twilio...)"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ width: '100%', padding: '14px 20px', borderRadius: 12, border: '1px solid rgba(99,102,241,0.3)', background: 'rgba(255,255,255,0.05)', color: '#fff', fontSize: 15, outline: 'none', boxSizing: 'border-box' }}
          />
        </div>

        {/* API Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
          {filtered.map((cat) => (
            <div key={cat.cat} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 16, padding: 24 }}>
              <h3 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 700 }}>{cat.cat}</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {cat.items.map(item => (
                  <span key={item} style={{ background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.25)', borderRadius: 8, padding: '5px 12px', fontSize: 13, color: '#c7d2fe' }}>
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* CTA bottom */}
        <div style={{ textAlign: 'center', marginTop: 60, background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.25)', borderRadius: 24, padding: '40px 32px' }}>
          <h2 style={{ fontSize: 26, fontWeight: 800, margin: '0 0 12px' }}>Gata să construiești mai rapid?</h2>
          <p style={{ color: '#94a3b8', marginBottom: 24 }}>Un singur payment, acces complet la toate integrările + actualizări viitoare.</p>
          <a href="/checkout?plan=arsenalapi" style={{ display: 'inline-block', background: 'linear-gradient(135deg, #6366f1, #4f46e5)', color: '#fff', padding: '15px 40px', borderRadius: 12, fontSize: 17, fontWeight: 700, textDecoration: 'none' }}>
            Cumpără Acum — $9 →
          </a>
        </div>
      </div>
    </div>
  );
};

export default ArsenalAPI;
TSX
echo "  ✓ src/pages/ArsenalAPI.tsx creat"

# ============================================================
# [4] Patch App.tsx — adaugă route-uri lipsă
# ============================================================
echo ""
echo "=== [4] Patch App.tsx — route-uri lipsă ==="

APP_FILE=""
for candidate in "$SRC/App.tsx" "$SRC/main.tsx" "$SRC/router.tsx" "$SRC/Routes.tsx"; do
  if [ -f "$candidate" ]; then
    if grep -q "Route\|BrowserRouter\|createBrowserRouter" "$candidate" 2>/dev/null; then
      APP_FILE="$candidate"
      break
    fi
  fi
done

# Daca nu am gasit, cauta in DaRomaniaApp.tsx
if [ -z "$APP_FILE" ]; then
  if grep -q "Route\|BrowserRouter" "$SRC/DaRomaniaApp.tsx" 2>/dev/null; then
    APP_FILE="$SRC/DaRomaniaApp.tsx"
  fi
fi

if [ -z "$APP_FILE" ]; then
  echo "  ⚠ Nu am găsit fișierul cu Route-uri. Cauta manual in App.tsx sau DaRomaniaApp.tsx"
else
  echo "  → Fișier routes detectat: $APP_FILE"
  python3 - "$APP_FILE" << 'PYEOF'
import sys, re

path = sys.argv[1]
with open(path, "r") as f:
    c = f.read()

# Check ce importuri lipsesc
pages_to_add = {
    "Academy": "from './pages/Academy'",
    "AfacereLaCheie": "from './pages/AfacereLaCheie'",
    "ArsenalAPI": "from './pages/ArsenalAPI'",
}

routes_to_add = {
    "/academy": "<Route path=\"/academy\" element={<Academy />} />",
    "/afacerelacheie": "<Route path=\"/afacerelacheie\" element={<AfacereLaCheie />} />",
    "/arsenalapi": "<Route path=\"/arsenalapi\" element={<ArsenalAPI />} />",
    "/chatbuddy": "<Route path=\"/chatbuddy\" element={<ChatBuddy />} />",
}

# Adauga importuri lipsă
import_block_added = []
for comp, imp_from in pages_to_add.items():
    import_line = f"import {comp} {imp_from};"
    if comp not in c:
        # Adauga dupa ultimul import
        c = re.sub(r"(import .+ from '.+';)\n(?!import)", 
                   r"\1\n" + import_line + "\n", 
                   c, count=1)
        import_block_added.append(comp)
        print(f"  ✓ Import adăugat: {comp}")
    else:
        print(f"  → {comp} deja importat")

# Adauga route-uri lipsă
routes_added = []
for path_str, route_jsx in routes_to_add.items():
    if f'path="{path_str}"' not in c and f"path='{path_str}'" not in c:
        # Adauga inainte de </Routes> sau </Switch>
        for closing in ['</Routes>', '</Switch>']:
            if closing in c:
                c = c.replace(closing, f"  {route_jsx}\n          {closing}", 1)
                routes_added.append(path_str)
                print(f"  ✓ Route adăugat: {path_str}")
                break
    else:
        print(f"  → Route {path_str} deja există")

with open(path, "w") as f:
    f.write(c)

if not routes_added and not import_block_added:
    print("  → Nimic de adăugat sau pattern-urile nu s-au potrivit exact")
    print("    Adaugă manual în fișierul routes:")
    print("    import Academy from './pages/Academy';")
    print("    import AfacereLaCheie from './pages/AfacereLaCheie';")
    print("    import ArsenalAPI from './pages/ArsenalAPI';")
    print("    <Route path='/academy' element={<Academy />} />")
    print("    <Route path='/afacerelacheie' element={<AfacereLaCheie />} />")
    print("    <Route path='/arsenalapi' element={<ArsenalAPI />} />")
PYEOF
fi

# ============================================================
# [5] Verificare finală și build
# ============================================================
echo ""
echo "=== [5] TypeScript check rapid ==="
npx tsc --noEmit 2>&1 | head -30 || true

echo ""
echo "=== [6] Build ==="
npm run build

echo ""
echo "============================================"
echo "  ✅ FIX_ALL COMPLET!"
echo "============================================"
echo ""
echo "Pagini create:"
echo "  → /academy         (Academy.tsx)"
echo "  → /afacerelacheie  (AfacereLaCheie.tsx)"
echo "  → /arsenalapi      (ArsenalAPI.tsx)"
echo ""
echo "Dacă build-ul a reușit, deployează cu:"
echo "  cp -r dist/* /var/www/html/"
echo "  # sau rsync/nginx restart după configurația ta"
