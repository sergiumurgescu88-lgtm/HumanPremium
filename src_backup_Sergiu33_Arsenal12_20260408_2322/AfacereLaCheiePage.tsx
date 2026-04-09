import { useState } from 'react';

interface Props { onClose: () => void; }

const BUSINESS_PACKAGES = [
  {
    id: 1,
    job: 'Copywriter / Content Writer',
    risk: '83%',
    title: 'Agenție de Content AI Semi-Automat',
    tagline: 'Tu supervizezi 2h/zi. AI-ul scrie, postează, trimite emailuri.',
    costReal: '$2.50/lună',
    venituEstimat: '€2.800–€6.000/lună',
    clienti: '10–20 clienți × €149–€299/lună',
    apis: [
      { name: 'DeepSeek API', role: 'Generare articole, copywriting, emailuri', cost: '~$1/lună pentru 500k cuvinte', free: true },
      { name: 'Apify Web Scraper', role: 'Research trenduri și subiecte virale', cost: '~$0.90/lună (300 cereri)', free: false },
      { name: 'Amazon SES', role: 'Trimitere 300 emailuri/zi către clienți', cost: 'GRATUIT 62.000/an', free: true },
      { name: 'Telegram Bot API', role: 'Livrare automată conținut la clienți', cost: '100% GRATUIT nelimitat', free: true },
      { name: 'Brave Search API', role: 'Research SEO și keywords', cost: 'GRATUIT 2.000 cereri/lună', free: true },
    ],
    workflow: [
      'Luni dimineața: DeepSeek generează 30 articole/postări pentru toți clienții în 20 minute',
      'Tu verifici și ajustezi 10% — 40 minute total',
      'Buffer sau Telegram Bot postează automat pe schedule-ul fiecărui client',
      'Amazon SES trimite newsletterul săptămânal la baza de date a clientului',
      'Vineri: raport automat generat cu DeepSeek + date Apify despre performanță',
    ],
    primii3clienti: 'Mergi pe LinkedIn și oferi primul lună GRATUIT la 3 business-uri locale. Le arăți raportul. Ei plătesc luna 2.',
  },
  {
    id: 2,
    job: 'Agent Imobiliar',
    risk: '70%',
    title: 'Platformă Marketing Imobiliar Automat',
    tagline: 'Anunț complet în 3 minute. Follow-up automat 30 zile. Zero muncă manuală.',
    costReal: '$1.50/lună',
    venituEstimat: '€1.500–€5.000/lună',
    clienti: '5–15 agenți × €99–€299/lună',
    apis: [
      { name: 'DeepSeek API', role: 'Descrieri anunțuri în română + engleză, SEO optimizate', cost: '~$0.50/lună', free: true },
      { name: 'Jina AI Reader', role: 'Extrage date din orice site imobiliar concurent', cost: '100% GRATUIT', free: true },
      { name: 'Amazon SES', role: 'Follow-up automat 30 zile după vizionare', cost: 'GRATUIT 62.000/an', free: true },
      { name: 'Telegram Bot API', role: 'Notificări instant agent când vine lead nou', cost: '100% GRATUIT', free: true },
      { name: 'Google Calendar API', role: 'Programare automată vizionări', cost: '100% GRATUIT', free: true },
    ],
    workflow: [
      'Agentul completează 5 câmpuri: adresă, suprafață, camere, preț, 3 cuvinte cheie',
      'DeepSeek generează descriere completă română + engleză + 5 postări social media în 30 secunde',
      'Sistemul postează automat pe OLX, Storia, Imobiliare.ro via scraper',
      'Lead-ul vine → Telegram Bot notifică agentul instant → Google Calendar propune orar',
      'Secvență 7 emailuri automate trimise via Amazon SES în 30 zile după vizionare',
    ],
    primii3clienti: 'Mergi la 3 agenții din oraș. Fă live demo: introduci o proprietate, în 60 secunde ies toate materialele. Ei semnează pe loc.',
  },
  {
    id: 3,
    job: 'HR Manager / Recruiter',
    risk: '72%',
    title: 'Agenție Recrutare AI-Assisted',
    tagline: 'Screening 100 CV-uri în 5 minute. Interviuri programate automat. Tu închizi doar candidații finali.',
    costReal: '$2/lună',
    venituEstimat: '€2.500–€8.000/lună',
    clienti: '€300–€800/hire sau €499/lună retainer',
    apis: [
      { name: 'DeepSeek API', role: 'Scoring CV-uri față de job description, generare întrebări interviu', cost: '~$1/lună', free: true },
      { name: 'Amazon SES', role: 'Emailuri automate candidați (confirmare, respingere, invitație)', cost: 'GRATUIT', free: true },
      { name: 'Telegram Bot API', role: 'Notificări HR când candidat trece screening-ul', cost: '100% GRATUIT', free: true },
      { name: 'Google Calendar API', role: 'Programare automată interviuri în agenda HR-ului', cost: '100% GRATUIT', free: true },
      { name: 'Jina AI Reader', role: 'Scraping LinkedIn pentru sourcing candidați pasivi', cost: '100% GRATUIT', free: true },
    ],
    workflow: [
      'Clientul postează job description în platforma ta',
      'CV-urile vin → DeepSeek scorează fiecare față de cerințe în 3 secunde/CV',
      'Top 10 candidați → emailuri automate de invitație via Amazon SES',
      'Candidatul alege slot din calendar via Google Calendar API',
      'Tu primești pe Telegram un brief cu top 3 candidați înainte de fiecare interviu',
    ],
    primii3clienti: 'Abordează 3 startup-uri care caută activ pe LinkedIn. Oferă screening gratuit pentru primul post. La 90% satisfacție, semnezi retainer.',
  },
  {
    id: 4,
    job: 'Social Media Manager',
    risk: '75%',
    title: 'Agenție Social Media 100% Automatizată',
    tagline: '30 postări/lună per client. Tu lucrezi 2h/client/lună. Restul face AI-ul.',
    costReal: '$3/lună pentru 20 clienți',
    venituEstimat: '€3.000–€12.000/lună',
    clienti: '10–30 clienți × €149–€399/lună',
    apis: [
      { name: 'DeepSeek API', role: 'Generare captions, hashtags, ideas, threads', cost: '~$2/lună pentru toți clienții', free: false },
      { name: 'Brave Search API', role: 'Research trenduri virale din nișa clientului', cost: 'GRATUIT 2.000/lună', free: true },
      { name: 'Telegram Bot API', role: 'Aprobare conținut de client și livrare automată', cost: '100% GRATUIT', free: true },
      { name: 'Amazon SES', role: 'Raport lunar performanță trimis automat clientului', cost: 'GRATUIT', free: true },
      { name: 'YouTube Data API', role: 'Upload automat Shorts și Reels pe YouTube', cost: '100% GRATUIT (6 video/zi)', free: true },
    ],
    workflow: [
      'Luni: Brave Search identifică 10 trenduri relevante per client în nișa lui',
      'DeepSeek generează 30 postări complete (caption + hashtags + CTA) în 15 minute',
      'Clientul primește pe Telegram link de aprobare — apasă ✅ sau ✏️ pentru modificări',
      'Conținut aprobat → publicat automat pe schedule via Buffer sau Zapier webhooks',
      '1 a lunii: Amazon SES trimite raport complet cu reach, engagement, recomandări luna viitoare',
    ],
    primii3clienti: 'Alege 3 restaurante sau saloane din oraș. Fă-le 1 săptămână gratuit — 7 postări automate. Arată-le statisticile. Închizi la €149/lună.',
  },
  {
    id: 5,
    job: 'Profesor / Tutor',
    risk: '65%',
    title: 'Platformă Tutoriat AI Personalizat',
    tagline: 'Tu predai 2 ore live pe săptămână. AI-ul tutorizează restul de 168 ore.',
    costReal: '$1/lună',
    venituEstimat: '€1.500–€6.000/lună',
    clienti: '50–200 elevi × €19–€29/lună subscripție',
    apis: [
      { name: 'DeepSeek API', role: 'Tutor AI care răspunde la întrebări 24/7, generează exerciții personalizate', cost: '~$0.50/lună chiar și cu trafic mare', free: true },
      { name: 'Telegram Bot API', role: 'Interfața principală de tutoriat — elevii pun întrebări pe Telegram', cost: '100% GRATUIT nelimitat', free: true },
      { name: 'Amazon SES', role: 'Emailuri progres săptămânal trimise părinților', cost: 'GRATUIT', free: true },
      { name: 'Google Calendar API', role: 'Programare automată sesiuni live', cost: '100% GRATUIT', free: true },
      { name: 'Jina AI Reader', role: 'Extrage materiale din orice sursă educațională pentru baza de cunoștințe', cost: '100% GRATUIT', free: true },
    ],
    workflow: [
      'Elevul intră pe Telegram Bot și pune orice întrebare din materia ta',
      'DeepSeek răspunde în stilul tău de predare, cu exemple și exerciții suplimentare',
      'Bot-ul urmărește progresul: ce a greșit, ce a înțeles, ce necesită repetiție',
      'Vineri: Amazon SES trimite raport progres părintelui cu note și recomandări',
      'Tu faci 2h live pe Zoom/Meet pe săptămână pentru conceptele complexe',
    ],
    primii3clienti: 'Postează pe un grup de părinți din Facebook: "50 elevi primesc tutoriat AI gratuit 30 zile". Colectezi feedback. Lansezi paid la €19/lună.',
  },
  {
    id: 6,
    job: 'Specialist SEO',
    risk: '70%',
    title: 'Agenție SEO AI — Articole + Audit + Rapoarte',
    tagline: 'Audit SEO complet în 10 minute. Articol de 1500 cuvinte în 3 minute. 10 clienți, 3h muncă/lună.',
    costReal: '$3.50/lună',
    venituEstimat: '€3.000–€10.000/lună',
    clienti: '5–10 clienți × €299–€999/lună',
    apis: [
      { name: 'DeepSeek API', role: 'Scriere articole SEO, meta descriptions, title tags', cost: '~$1/lună', free: false },
      { name: 'Brave Search API', role: 'Research keywords și competitori fără să plătești SerpAPI', cost: 'GRATUIT 2.000/lună', free: true },
      { name: 'Jina AI Reader', role: 'Audit conținut competitori — extrage și analizează orice URL', cost: '100% GRATUIT', free: true },
      { name: 'PageSpeed Insights API', role: 'Audit tehnic automat viteza și Core Web Vitals', cost: '100% GRATUIT', free: true },
      { name: 'Google Search Console API', role: 'Date reale de crawl și indexare direct de la Google', cost: '100% GRATUIT', free: true },
      { name: 'Amazon SES', role: 'Raport lunar SEO trimis automat clientului', cost: 'GRATUIT', free: true },
    ],
    workflow: [
      'Apify + Jina AI Reader scanează site-ul clientului și top 3 competitori în 5 minute',
      'DeepSeek generează raport audit complet: ce lipsește, ce e broken, ce oportunități există',
      'Brave Search API identifică 20 keywords cu volum mare și concurență mică în nișa clientului',
      'DeepSeek scrie articolul optimizat pentru keyword-ul principal — 1.500 cuvinte în 3 minute',
      '1 a lunii: raport complet cu rankings, trafic, articole publicate, plan luna viitoare — trimis automat via SES',
    ],
    primii3clienti: 'Fă un audit GRATUIT la 3 business-uri locale. Livrezi raport PDF de 10 pagini în 24h. Ei văd valoarea. Tu câștigi retainer €299/lună.',
  },
];

const COST_BREAKDOWN = [
  { api: 'DeepSeek API', cost: '~$1–2/lună', what: '500.000–1M cuvinte generate' },
  { api: 'Apify Web Scraper', cost: '~$0.90/lună', what: '300 cereri scraping' },
  { api: 'Amazon SES', cost: 'GRATUIT', what: '62.000 emailuri/an (170/zi)' },
  { api: 'Telegram Bot API', cost: 'GRATUIT', what: 'Mesaje nelimitate' },
  { api: 'Brave Search API', cost: 'GRATUIT', what: '2.000 căutări/lună' },
  { api: 'Jina AI Reader', cost: 'GRATUIT', what: 'Scraping nelimitat URL-uri' },
  { api: 'Google Calendar API', cost: 'GRATUIT', what: 'Programări nelimitate' },
  { api: 'PageSpeed + GSC', cost: 'GRATUIT', what: 'Audit tehnic complet' },
  { api: 'YouTube Data API', cost: 'GRATUIT', what: '6 video uploads/zi' },
  { api: 'KIE.ai Grok Images', cost: 'Credite incluse', what: 'Imagini și video AI' },
];

export default function AfacereLaCheiePage({ onClose }: Props) {
  const [selected, setSelected] = useState<number | null>(null);
  const [tab, setTab] = useState<'apis' | 'workflow' | 'clienti'>('apis');
  const STRIPE_LINK = 'https://buy.stripe.com/PLACEHOLDER_99';

  const pkg = selected !== null ? BUSINESS_PACKAGES[selected] : null;

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
      <div className="sticky top-0 bg-white border-b border-slate-200 z-10 px-4 py-3 flex items-center justify-between">
        <button onClick={onClose} className="flex items-center gap-2 text-purple-600 font-black px-4 py-2 bg-purple-50 rounded-full hover:bg-purple-100 transition-all text-sm">
          ← Înapoi
        </button>
        <span className="font-black text-slate-800 text-sm hidden sm:block">💼 Afacere la Cheie — $99/lună tot inclus</span>
        <a href={STRIPE_LINK} target="_blank" rel="noopener noreferrer"
          className="bg-purple-600 text-white font-black px-5 py-2 rounded-full text-sm hover:bg-purple-700 transition-all">
          Vreau afacerea mea →
        </a>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-10">

        {/* Hero */}
        <div className="text-center mb-12">
          <div className="inline-block bg-green-100 text-green-700 font-black text-sm px-4 py-1.5 rounded-full mb-4">
            💡 Cost real API-uri: $2–4/lună. Venit estimat: €2.000–€12.000/lună.
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 leading-tight">
            Business la cheie din meseria ta.<br/>
            <span className="text-purple-600">Cu API-uri în mare parte gratuite.</span>
          </h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto mb-6">
            Selectează meseria ta. Îți arătăm exact ce API-uri gratuite folosești, cum le conectezi, cât costă real și câți clienți poți lua.
          </p>
          <p className="text-sm text-slate-400">
            Nu e teorie. E stack-ul real pe care îl configurăm noi pentru tine în 48h.
          </p>
        </div>

        {/* Selectie job */}
        <div className="mb-10">
          <h2 className="text-lg font-black text-slate-700 mb-4 text-center">Alege meseria ta:</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {BUSINESS_PACKAGES.map((p, i) => (
              <div key={i} onClick={() => { setSelected(i); setTab('apis'); }}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${selected === i ? 'border-purple-500 bg-purple-50' : 'border-slate-200 hover:border-slate-300 bg-white'}`}>
                <div className="flex justify-between items-start mb-2">
                  <span className="font-black text-slate-900 text-sm leading-tight">{p.job}</span>
                  <span className="text-xs bg-red-100 text-red-700 font-black px-2 py-0.5 rounded-full">{p.risk}</span>
                </div>
                <div className="text-xs text-purple-700 font-semibold mb-1">{p.title}</div>
                <div className="text-xs text-green-600 font-black">{p.venituEstimat}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Detaliu pachet */}
        {pkg && (
          <div className="bg-white border-2 border-purple-200 rounded-3xl overflow-hidden mb-10">
            <div className="bg-gradient-to-r from-purple-600 to-purple-800 p-6 text-white">
              <div className="flex items-start justify-between flex-wrap gap-4">
                <div>
                  <div className="text-purple-200 text-sm font-semibold mb-1">{pkg.job} → {pkg.risk} risc automatizare</div>
                  <h2 className="text-2xl font-black mb-2">{pkg.title}</h2>
                  <p className="text-purple-200 text-sm leading-relaxed max-w-xl">{pkg.tagline}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-3xl font-black">{pkg.venituEstimat}</div>
                  <div className="text-purple-200 text-xs">venit lunar estimat</div>
                  <div className="mt-2 bg-white/20 rounded-xl px-3 py-1 text-sm font-black">
                    Cost API-uri: {pkg.costReal}
                  </div>
                </div>
              </div>
            </div>

            <div className="border-b border-slate-100">
              <div className="flex">
                {(['apis', 'workflow', 'clienti'] as const).map(t => (
                  <button key={t} onClick={() => setTab(t)}
                    className={`flex-1 py-3 text-sm font-black transition-all ${tab === t ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50' : 'text-slate-400 hover:text-slate-600'}`}>
                    {t === 'apis' ? '⚡ API-uri gratuite' : t === 'workflow' ? '🔄 Cum funcționează' : '🎯 Primii clienți'}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-6">
              {tab === 'apis' && (
                <div className="space-y-3">
                  <p className="text-sm text-slate-500 mb-4">Stack-ul complet pe care îl configurăm pentru tine:</p>
                  {pkg.apis.map((api, i) => (
                    <div key={i} className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-black text-slate-900 text-sm">{api.name}</span>
                          {api.free && <span className="text-xs bg-green-100 text-green-700 font-black px-2 py-0.5 rounded-full">GRATUIT</span>}
                        </div>
                        <div className="text-xs text-slate-500">{api.role}</div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="text-sm font-black text-green-600">{api.cost}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {tab === 'workflow' && (
                <div className="space-y-4">
                  <p className="text-sm text-slate-500 mb-4">Cum rulează sistemul automat zi de zi:</p>
                  {pkg.workflow.map((step, i) => (
                    <div key={i} className="flex gap-3 items-start">
                      <span className="min-w-[28px] h-[28px] rounded-full bg-purple-600 text-white text-xs font-black flex items-center justify-center flex-shrink-0">{i + 1}</span>
                      <p className="text-slate-700 text-sm leading-relaxed pt-1">{step}</p>
                    </div>
                  ))}
                </div>
              )}

              {tab === 'clienti' && (
                <div>
                  <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-4">
                    <div className="font-black text-amber-800 mb-2">🎯 Strategia pentru primii 3 clienți plătitori:</div>
                    <p className="text-amber-700 text-sm leading-relaxed">{pkg.primii3clienti}</p>
                  </div>
                  <div className="bg-green-50 border border-green-200 rounded-2xl p-5">
                    <div className="font-black text-green-800 mb-2">💰 Model de pricing recomandat:</div>
                    <p className="text-green-700 text-sm">{pkg.clienti}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Cost real total */}
        <div className="mb-10">
          <h2 className="text-2xl font-black text-slate-900 text-center mb-3">Costul real al întregului stack</h2>
          <p className="text-slate-500 text-center text-sm mb-6">Toate API-urile de care ai nevoie. Marea majoritate sunt 100% gratuite.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {COST_BREAKDOWN.map((c, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                <div>
                  <div className="font-black text-slate-900 text-sm">{c.api}</div>
                  <div className="text-xs text-slate-400">{c.what}</div>
                </div>
                <div className={`font-black text-sm ${c.cost === 'GRATUIT' || c.cost.includes('GRATUIT') ? 'text-green-600' : 'text-slate-700'}`}>
                  {c.cost}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 bg-purple-50 border border-purple-200 rounded-2xl p-5 text-center">
            <div className="text-3xl font-black text-purple-700">~$3–5/lună</div>
            <div className="text-slate-600 text-sm mt-1">costul total real al API-urilor pentru un business complet automatizat</div>
          </div>
        </div>

        {/* Ce facem noi */}
        <div className="mb-10">
          <h2 className="text-2xl font-black text-slate-900 text-center mb-8">Ce facem noi pentru tine în $99/lună</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[
              { icon: '⚙️', title: 'Configurăm tot stack-ul tehnic', desc: 'Conectăm toate API-urile, le testăm, le calibrăm pe nișa ta. Tu nu atinge cod.' },
              { icon: '🧠', title: 'Senior alocat 1:1 săptămânal', desc: 'Call 45 min/săptămână. El cunoaște business-ul tău și ajustează strategia în timp real.' },
              { icon: '📊', title: 'Dashboard monitorizare live', desc: 'Vezi în timp real: postări publicate, emailuri trimise, leads generate, venit estimat.' },
              { icon: '🎯', title: 'Strategie primii 10 clienți', desc: 'Nu te lăsăm cu tool-urile. Îți dăm scriptul exact pentru a închide primii clienți plătitori.' },
              { icon: '🔧', title: 'Suport tehnic prioritar', desc: 'Ceva nu merge? Răspundem în 2h pe WhatsApp. Fix garantat în 24h.' },
              { icon: '📚', title: 'Academia completă inclusă', desc: 'Acces la toate 47 lecțiile + plan 12 săptămâni personalizat + comunitate.' },
            ].map((item, i) => (
              <div key={i} className="flex gap-4 p-5 bg-white border border-slate-200 rounded-2xl">
                <span className="text-3xl flex-shrink-0">{item.icon}</span>
                <div>
                  <div className="font-black text-slate-900 mb-1">{item.title}</div>
                  <div className="text-sm text-slate-500 leading-relaxed">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-800 rounded-3xl p-10 text-center text-white">
          <div className="text-purple-200 text-sm font-semibold mb-3">API-uri cost real: $3–5/lună · Tu plătești: $99/lună · Diferența: munca și expertiza noastră</div>
          <h2 className="text-3xl font-black mb-3">Vrei afacerea ta live în 48h?</h2>
          <p className="text-purple-200 mb-8 max-w-xl mx-auto">Selectezi meseria, noi configurăm stack-ul complet, Seniorul tău te ghidează spre primii clienți. Tu supervizezi 2h/zi.</p>
          <a href={STRIPE_LINK} target="_blank" rel="noopener noreferrer"
            className="inline-block bg-white text-purple-700 font-black px-10 py-4 rounded-2xl text-lg hover:bg-purple-50 transition-all shadow-lg mb-4">
            Începe cu $99/lună →
          </a>
          <div className="text-purple-300 text-sm">✅ 48h până la primul sistem live &nbsp;·&nbsp; ✅ Anulezi oricând &nbsp;·&nbsp; ✅ 20 locuri disponibile</div>
        </div>

      </div>
    </div>
  );
}
