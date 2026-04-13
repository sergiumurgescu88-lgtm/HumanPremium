import BuddyArsenalChat from './components/BuddyArsenalChat';
import ProfilePage from './auth/ProfilePage';
import AfacereLaCheiePage from './AfacereLaCheiePage';
import ArsenalPage from './ArsenalPage';
import { T, BRANDS, LANG_NAMES, type Lang } from './i18n';
import { runBuddy } from './core/buddyEngine';
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { 
  Brain, 
  Users, 
  TrendingUp, 
  Zap, 
  ShieldCheck, 
  ArrowRight, 
  ArrowLeft,
  Search, 
  RefreshCcw,
  AlertTriangle,
  Coins,
  Cpu,
  HeartHandshake,
  X,
  CheckCircle2,
  Download,
  Mail,
  User,
  Briefcase,
  Youtube,
  Linkedin,
  Globe,
  Rocket,
  Lightbulb,
  Share2,
  Mic,
  MicOff,
  Send,
  MessageSquare,
  Bot,
  MessageCircle,
  Wand2,
  PlayCircle,
  BookOpen,
  Check,
  Menu
} from 'lucide-react';
import { JOBS_LIST, JobData } from './constants';
import Markdown from 'react-markdown';
import ClawStatusBar from './components/ClawStatusBar';
import { useAgentState } from './context/AgentStateProvider';

// Initialize Gemini

const callAI = async (prompt: string, mode: string = "chat", lucky?: boolean): Promise<string> => {

  const SYSTEM_PROMPTS: Record<string, string> = {

    coding: "You are a senior software engineer. Be precise, structured, give code-first answers, no fluff.",

    marketing: "You are a growth hacker and marketing strategist. Focus on conversion, hooks, funnels, and virality.",

    side_hustle: "You are a startup advisor. Focus on monetization, fast execution, MVPs, and scalable ideas.",

    chat: "You are a helpful AI assistant. Be clear and friendly."

  };



  const systemPrompt = SYSTEM_PROMPTS[mode] || SYSTEM_PROMPTS.chat;



  const res = await fetch("/api/chat", {

    method: "POST",

    headers: { "Content-Type": "application/json" },

    body: JSON.stringify({

      messages: [{ role: "user", content: prompt }],

      systemPrompt,

      lucky: lucky ?? false

    })

  });



  const d = await res.json();

  return d.text || "";

};
interface MonetizationProject {
  title: string;
  description: string;
  platform: string;
  marketingStrategy: string;
  innovation: string;
  projectType: string;
  monetizationMethod: string;
  suitabilityQuestions: string[];
}


interface PremiumProjection {
  month3: number;
  month6: number;
  month12: number;
  startupCost: number;
  cac: number;
  ltv: number;
  roas: number;
  recommendedChannel: string;
  roadmap30: string;
  roadmap60: string;
  roadmap90: string;
}

interface PivotData {
  pivotStrategy: string;
  monetizationProjects: MonetizationProject[];
}


const getJobQuestions = (job: { title: string; category: string }) => {
  const cat = job.category;
  const title = job.title;

  const map: Record<string, [string, string, string]> = {
    'Productie': [
      `Ce parte din munca ta de ${title} îți aduce cea mai mare satisfacție — precizia, viteza sau rezolvarea problemelor tehnice?`,
      `Preferi să lucrezi cu echipe de ingineri, cu manageri de producție sau direct cu clienți industriali?`,
      `Ai experiență cu un anumit tip de mașini sau materiale specifice și cât timp pe săptămână poți dedica unui proiect nou?`,
    ],
    'Logistica': [
      `Ce aspect al logisticii stăpânești cel mai bine — organizarea depozitului, optimizarea rutelor sau managementul stocurilor?`,
      `Preferi să lucrezi cu firme mici de e-commerce, cu retaileri mari sau cu distribuitori?`,
      `Câte ore pe săptămână poți aloca și vrei venituri rapide sau un business scalabil pe termen lung?`,
    ],
    'Sanatate': [
      `Ce parte din activitatea ta medicală o consideri ireductibil umană și nu poate fi preluată de AI?`,
      `Preferi să lucrezi cu pacienți individuali, cu clinici private sau cu sisteme spitalicești?`,
      `Cât timp ai disponibil în afara programului clinic și care este obiectivul principal — venit extra sau tranziție completă?`,
    ],
    'Juridic': [
      `Pe ce arie juridică ești specializat și ce tip de cazuri rezolvi cel mai bine?`,
      `Preferi clienți corporate, antreprenori IMM sau persoane fizice cu nevoi specifice?`,
      `Vrei să construiești o platformă de servicii juridice online sau să îți scalezi practica actuală cu AI?`,
    ],
    'Finante': [
      `Ce serviciu financiar oferi cel mai bine — planificare, analiză, audit sau consultanță fiscală?`,
      `Preferi clienți persoane fizice cu avere în creștere, startup-uri sau companii mature?`,
      `Care e obiectivul principal — venituri recurente din subscripții sau proiecte high-ticket punctuale?`,
    ],
    'Marketing': [
      `În ce ești cel mai bun — strategie de conținut, paid ads, SEO sau brand building?`,
      `Ce industrii de clienți cunoști cel mai bine din experiența ta anterioară?`,
      `Vrei să construiești o agenție cu echipă sau să operezi solo cu procese 90% automatizate?`,
    ],
    'HR': [
      `Ce parte din recrutare sau HR îți place cel mai mult — sourcing candidați, interviuri sau people strategy?`,
      `Preferi să lucrezi cu startup-uri tech, corporații sau IMM-uri din industrie?`,
      `Vrei un model de venituri per hire, retainer lunar sau SaaS cu acces la platformă?`,
    ],
    'Design': [
      `Ce tip de design stăpânești cel mai bine — brand identity, UI/UX, ilustrații sau motion graphics?`,
      `Preferi clienți startup-uri în faza de lansare, agenții de marketing sau branduri consacrate?`,
      `Vrei să vinzi pachete fixe, subscripții lunare sau proiecte la cheie high-ticket?`,
    ],
    'Educatie': [
      `Ce materie sau domeniu predai cel mai bine și la ce nivel — beginner, intermediar sau avansat?`,
      `Preferi să lucrezi cu elevi individuali, cu grupuri mici sau să creezi cursuri scalabile online?`,
      `Care e obiectivul — venituri din tutoriat live sau construirea unui produs educațional pasiv?`,
    ],
    'Tehnologie': [
      `Ce tehnologii sau limbaje de programare stăpânești cel mai bine în acest moment?`,
      `Preferi să lucrezi cu startup-uri early-stage, cu agenții digitale sau să construiești propriile produse SaaS?`,
      `Vrei să oferi servicii de dezvoltare pe proiecte sau să construiești un portofoliu de micro-SaaS-uri recurente?`,
    ],
    'Media': [
      `Ce format de conținut produci cel mai bine — video, audio, scris sau fotografie?`,
      `Preferi să lucrezi pentru branduri corporate, creatori independenți sau agenții de media?`,
      `Vrei venituri din servicii pentru clienți sau să construiești un canal propriu monetizat?`,
    ],
    'Imobiliare': [
      `Ce aspect al pieței imobiliare cunoști cel mai bine — rezidențial, comercial, investiții sau property management?`,
      `Preferi să lucrezi cu cumpărători primari, investitori sau cu agenții imobiliare ca clienți B2B?`,
      `Care e modelul preferat — comision per tranzacție, retainer lunar de la agenții sau SaaS pentru agenți?`,
    ],
    'Administratie': [
      `Ce procese administrative le execuți cel mai eficient — organizare, comunicare, raportare sau coordonare?`,
      `Preferi să lucrezi ca asistent virtual pentru executivi, pentru startup-uri sau pentru echipe remote?`,
      `Vrei să oferi servicii lunare recurente sau pachete de setup one-time pentru sisteme de organizare?`,
    ],
    'Servicii': [
      `Ce abilitate din serviciile tale este cel mai greu de înlocuit cu AI sau automatizare?`,
      `Preferi clienți corporate care plătesc mai mult sau volume mari de clienți individuali?`,
      `Care e obiectivul — să monetizezi experiența prin consultanță sau să creezi un produs digital scalabil?`,
    ],
    'Business': [
      `Ce aspect al business development-ului ești cel mai bun — vânzări, strategie, parteneriate sau creștere?`,
      `Preferi să lucrezi cu fondatori early-stage, cu companii în expansiune sau cu investitori?`,
      `Vrei un model de success fee, retainer lunar sau equity în companiile pe care le ajuți?`,
    ],
    'Cercetare': [
      `Ce domeniu de cercetare sau analiză stăpânești cel mai bine și unde ai publicat sau contribuit?`,
      `Preferi să lucrezi cu instituții academice, cu corporații care au nevoie de research sau cu think tank-uri?`,
      `Vrei venituri din consultanță de specialitate, din cursuri sau din rapoarte de piață vândute ca produs?`,
    ],
    'Creativitate': [
      `Ce formă de expresie creativă o consideri unică și imposibil de replicat de AI?`,
      `Preferi clienți care vor work-for-hire, colaborări pe termen lung sau să vinzi creații proprii direct?`,
      `Care e modelul de monetizare preferat — comisioane, licențiere sau comunitate cu abonament?`,
    ],
    'Comunicare': [
      `Ce abilitate de comunicare o consideri ireductibil umană în munca ta zilnică?`,
      `Preferi să lucrezi în context B2B corporate, în media sau direct cu audiențe mari online?`,
      `Vrei să monetizezi prin servicii directe sau să construiești o audiență proprie care generează venituri pasive?`,
    ],
    'Date': [
      `Ce tip de analiză de date o execuți cel mai bine — descriptivă, predictivă sau prescriptivă?`,
      `Preferi să lucrezi cu startup-uri tech, cu corporații din FMCG sau cu instituții financiare?`,
      `Vrei venituri din proiecte punctuale de analiză sau un produs SaaS de dashboard-uri pentru o nișă specifică?`,
    ],
  };

  const defaults: [string, string, string] = [
    `Ce parte din activitatea ta de ${title} îți aduce cea mai mare satisfacție și te diferențiază de alții?`,
    `Cu ce tip de clienți sau organizații ai obținut cele mai bune rezultate în cariera ta?`,
    `Câte ore pe săptămână poți investi și care este obiectivul principal — venituri extra sau tranziție completă?`,
  ];

  return map[cat] || defaults;
};

const buildUniversalBusinessPipelines = (jobTitle: string, context: {q1: string, q2: string, q3: string}) => ({
  pivotStrategy: `Business Blueprint complet pentru ${jobTitle}

PIPELINE 1 — Servicii Premium
Expertiză profesională → servicii premium → retainer lunar → upsell enterprise

PIPELINE 2 — Produse Digitale
Template → funnel → vânzare → abonament

PIPELINE 3 — Educație
Audiență → curs → cohortă → mentorat

PIPELINE 4 — Content Authority
LinkedIn → newsletter → lead generation

PIPELINE 5 — YouTube Monetization
Shorts → long form → AdSense → sponsori → afiliere

PIPELINE 6 — Scalare
Freelancer → agenție → SaaS platform`,
  monetizationProjects: [
    {
      title: `${jobTitle} Premium Services`,
      description: `Servicii premium pentru ${jobTitle} bazate pe expertiza existentă.`,
      platform: "LinkedIn / Direct Sales",
      marketingStrategy: "Lead generation + content authority",
      innovation: "AI assisted workflow",
      projectType: "Service Business",
      monetizationMethod: "Retainer",
      suitabilityQuestions: ["Îți place lucrul direct cu clienți?", "Poți scala procesul?"]
    },
    {
      title: `${jobTitle} Digital Products`,
      description: `Construiește produse digitale monetizabile:
- template premium
- calculator/toolkit
- dashboard SaaS
- prompt packs
- abonament lunar.
Funnel: trafic organic → landing page → lead magnet → email nurture → vânzare.
Țintă 6 luni: €5000+ MRR.`,
      platform: "Website",
      marketingStrategy: "SEO + funnel",
      innovation: "Automation",
      projectType: "Digital Product",
      monetizationMethod: "One time + subscription",
      suitabilityQuestions: ["Poți documenta know-how-ul?", "Poți standardiza procese?"]
    },
    {
      title: `${jobTitle} Academy`,
      description: `Academie premium:
- curs flagship
- cohortă live
- mentorat 1:1
- mastermind
- certificare.
Monetizare pe 3 niveluri:
€99 / €499 / €1999.
Scalare prin YouTube + webinar funnel.`,
      platform: "YouTube + Course Platform",
      marketingStrategy: "Educational content",
      innovation: "Hybrid AI learning",
      projectType: "Education",
      monetizationMethod: "Course sales",
      suitabilityQuestions: ["Îți place să predai?", "Poți crea curriculum?"]
    },
    {
      title: `${jobTitle} YouTube Channel`,
      description: `Canal YouTube construit ca asset de business:
Shorts → long-form → lead funnel → sponsori → afiliere → produse proprii.
Obiectiv:
100k views/lună în 90 zile.
Venit:
AdSense + sponsorship + course funnel + consulting.`,
      platform: "YouTube",
      marketingStrategy: "Shorts + long form",
      innovation: "AI content research",
      projectType: "Media",
      monetizationMethod: "AdSense + sponsors",
      suitabilityQuestions: ["Poți produce video constant?", "Ai storytelling?"]
    },
    {
      title: `${jobTitle} Scalable Agency`,
      description: `Scalare reală în business mare:
freelancer → micro agency → standardizare SOP → echipă → SaaS layer.
Venit țintă 12 luni:
€15k–€50k / lună.`,
      platform: "Website + CRM",
      marketingStrategy: "Outbound + authority",
      innovation: "AI automation pipelines",
      projectType: "Agency",
      monetizationMethod: "Retainer + SaaS",
      suitabilityQuestions: ["Poți conduce echipe?", "Poți standardiza livrarea?"]
    }
  ]
});




const buildPremiumProjection = (jobTitle: string, risk = 70): PremiumProjection => {
  const base = 1000 + risk * 20;

  return {
    month3: base * 3,
    month6: base * 7,
    month12: base * 15,
    startupCost: 500 + risk * 10,
    cac: 20 + Math.round(risk / 5),
    ltv: 300 + risk * 8,
    roas: 3.5,
    recommendedChannel: "YouTube + LinkedIn + Website funnel",
    roadmap30: `Validare ofertă premium pentru ${jobTitle}`,
    roadmap60: `Lansare funnel lead generation + conținut authority`,
    roadmap90: `Scalare business și automatizare pipeline`
  };
};


const buildFinanceProjection = () => [
  { month: "L1", revenue: 1000 },
  { month: "L3", revenue: 5000 },
  { month: "L6", revenue: 15000 },
  { month: "L12", revenue: 50000 }
];


const COLORS = [
  'from-blue-600 to-indigo-700',
  'from-purple-600 to-violet-700',
  'from-emerald-600 to-teal-700',
  'from-amber-600 to-orange-700',
  'from-rose-600 to-pink-700'
];

interface Message {
  role: 'user' | 'model';
  text: string;
}

function ChatAgent({ job, onClose }: { job: JobData, onClose: () => void }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sessionRef = useRef<any>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const nextPlayTimeRef = useRef<number>(0);
  const activeSourcesRef = useRef<AudioBufferSourceNode[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem(`chat_memory_${job.id}`);
    if (saved) {
      setMessages(JSON.parse(saved));
    } else {
      setMessages([{ role: 'model', text: `Salut! Sunt agentul tău de monetizare pentru **${job.title}**. Ce planuri avem pentru astăzi?` }]);
    }
  }, [job.id]);

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(`chat_memory_${job.id}`, JSON.stringify(messages));
    }
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, job.id]);

  const handleSendText = async () => {
    if (!inputText.trim() || isLoading) return;
    const newMessages = [...messages, { role: 'user' as const, text: inputText }];
    setMessages(newMessages);
    setInputText('');
    setIsLoading(true);

    try {
      const contents = newMessages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));

      const buddy = await runBuddy(prompt);
      setMode(buddy.mode as any);
      const response = await callAI(prompt, buddy.mode);

      if (response) {
        setMessages(prev => [...prev, { role: 'model', text: response.text! }]);
      }
    } catch (e) {
      console.error(e);
      setMessages(prev => [...prev, { role: 'model', text: "A apărut o eroare. Te rog încearcă din nou." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleVoice = async () => {
    if (isVoiceActive) {
      stopVoice();
    } else {
      startVoice();
    }
  };

  const stopVoice = () => {
    setIsVoiceActive(false);
    if (sessionRef.current) {
      sessionRef.current.close();
      sessionRef.current = null;
    }
    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
  };

  const startVoice = async () => {
    setIsVoiceActive(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const audioCtx = new AudioContext({ sampleRate: 16000 });
      audioContextRef.current = audioCtx;
      nextPlayTimeRef.current = audioCtx.currentTime;

      const source = audioCtx.createMediaStreamSource(stream);
      const processor = audioCtx.createScriptProcessor(4096, 1, 1);
      processorRef.current = processor;

      source.connect(processor);
      processor.connect(audioCtx.destination);

      const sessionPromise = Promise.resolve(null);

      sessionRef.current = await sessionPromise;

    } catch (e) {
      console.error("Failed to start voice:", e);
      stopVoice();
    }
  };

  useEffect(() => {
    return () => stopVoice();
  }, []);



  const generateTools = async (project: any, idx: number) => {
    setGeneratingTools(idx);
    try {
      const prompt = 'Expert tooluri digitale si AI. DOAR JSON fara markdown: [{"category":"Cercetare & Analiza","tools":["tool1","tool2","tool3"],"usage":"cum le folosesti","signup":"unde te inregistrezi gratuit"},{"category":"Creare Continut AI","tools":["tool1","tool2"],"usage":"cum le folosesti","signup":"link inregistrare"},{"category":"Marketing & Outreach","tools":["tool1","tool2"],"usage":"cum le folosesti","signup":"link"},{"category":"Automatizare","tools":["tool1","tool2"],"usage":"cum le folosesti","signup":"link"},{"category":"Monetizare & Plati","tools":["tool1","tool2"],"usage":"cum le folosesti","signup":"link"},{"category":"Analytics","tools":["tool1","tool2"],"usage":"cum le folosesti","signup":"link"}] pentru business: ' + project.title + ' pe ' + (project.platform||'');
      const buddy = await runBuddy(prompt);
      setMode(buddy.mode as any);
      const response = await callAI(prompt, buddy.mode);
      const clean = response.replace(/```json/g,'').replace(/```/g,'').trim();
      const data = JSON.parse(clean);
      setProjectTools((prev: any) => ({ ...prev, [idx]: data }));
    } catch(err) {
      console.error('Tools error:', err);
    } finally {
      setGeneratingTools(null);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 w-[calc(100vw-2rem)] md:w-[400px] h-[80vh] md:h-[600px] bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden z-50">
      {/* Header */}
      <div className="bg-indigo-600 p-4 flex items-center justify-between text-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold leading-tight">Agent {job.title}</h3>
            <span className="text-xs text-indigo-200 flex items-center gap-1">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span> Online
            </span>
          </div>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-3 rounded-2xl ${m.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-sm' : 'bg-white border border-slate-200 text-slate-800 rounded-tl-sm shadow-sm'}`}>
              <div className={`prose prose-sm max-w-none ${m.role === 'user' ? 'prose-invert' : ''}`}>
                <Markdown>{m.text}</Markdown>
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white border border-slate-200 p-4 rounded-2xl rounded-tl-sm shadow-sm w-[85%] space-y-3">
              <div className="flex items-center gap-2 mb-2">
                <Bot className="w-4 h-4 text-indigo-500 animate-pulse" />
                <span className="text-xs font-bold text-indigo-500 animate-pulse">Agentul procesează...</span>
              </div>
              <div className="h-2 bg-slate-200 rounded-full animate-pulse w-3/4"></div>
              <div className="h-2 bg-slate-200 rounded-full animate-pulse w-full"></div>
              <div className="h-2 bg-slate-200 rounded-full animate-pulse w-5/6"></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Voice Active Overlay */}
      {isVoiceActive && (
        <div className="absolute inset-0 bg-indigo-900/95 backdrop-blur-sm flex flex-col items-center justify-center text-white z-10">
          <div className="w-24 h-24 bg-indigo-500/30 rounded-full flex items-center justify-center mb-8 animate-pulse">
            <div className="w-16 h-16 bg-indigo-500 rounded-full flex items-center justify-center">
              <Mic className="w-8 h-8" />
            </div>
          </div>
          <h3 className="text-2xl font-bold mb-2">Mod Vocal Activ</h3>
          <p className="text-indigo-200 mb-8 text-center px-6">Vorbește cu agentul tău. Conversația vocală este în timp real.</p>
          <button onClick={toggleVoice} className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-full font-bold flex items-center gap-2 transition-all">
            <MicOff className="w-5 h-5" /> Închide Apelul
          </button>
        </div>
      )}

      {/* Input */}
      <div className="p-4 bg-white border-t border-slate-200">
        <div className="flex items-center gap-2">
          <button onClick={toggleVoice} className="p-3 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors" title="Apel Vocal">
            <Mic className="w-6 h-6" />
          </button>
          <input
            type="text"
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSendText()}
            placeholder="Scrie un mesaj..."
            className="flex-1 bg-slate-100 border-transparent focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 rounded-full px-4 py-3 outline-none transition-all"
          />
          <button onClick={handleSendText} disabled={!inputText.trim() || isLoading} className="p-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 disabled:opacity-50 disabled:hover:bg-indigo-600 transition-colors">
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

function PlatformChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: 'Salut! Sunt asistentul platformei Human Premium. Cu ce te pot ajuta legat de serviciile noastre sau tranziția profesională în era AI?' }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<any>(null);

  useEffect(() => {
    if (!chatRef.current) {
      chatRef.current = null;
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  const handleSendText = async () => {
    if (!inputText.trim() || isLoading) return;
    const userText = inputText;
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await chatRef.current.sendMessage({ message: userText });
      if (response) {
        setMessages(prev => [...prev, { role: 'model', text: response.text }]);
      }
    } catch (e) {
      console.error(e);
      setMessages(prev => [...prev, { role: 'model', text: "A apărut o eroare. Te rog încearcă din nou." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-4 left-4 md:bottom-8 md:left-8 bg-slate-800 text-white p-3 md:p-4 rounded-full shadow-2xl hover:bg-slate-900 hover:scale-110 transition-all z-40 flex items-center gap-3"
        >
          <MessageCircle className="w-6 h-6" />
          <span className="font-bold pr-2 hidden md:inline">Suport Platformă</span>
        </button>
      )}

      {isOpen && (
        <div className="fixed bottom-4 left-4 md:bottom-6 md:left-6 w-[calc(100vw-2rem)] md:w-[400px] h-[80vh] md:h-[500px] bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden z-50">
          <div className="bg-slate-800 p-4 flex items-center justify-between text-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <MessageCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold leading-tight">Suport Human Premium</h3>
                <span className="text-xs text-slate-300 flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span> Online
                </span>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/20 rounded-full transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-2xl ${m.role === 'user' ? 'bg-slate-800 text-white rounded-tr-sm' : 'bg-white border border-slate-200 text-slate-800 rounded-tl-sm shadow-sm'}`}>
                  <div className={`prose prose-sm max-w-none ${m.role === 'user' ? 'prose-invert' : ''}`}>
                    <Markdown>{m.text}</Markdown>
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-200 p-4 rounded-2xl rounded-tl-sm shadow-sm w-[85%] space-y-3">
                  <div className="flex items-center gap-2 mb-2">
                    <MessageCircle className="w-4 h-4 text-slate-500 animate-pulse" />
                    <span className="text-xs font-bold text-slate-500 animate-pulse">Platforma răspunde...</span>
                  </div>
                  <div className="h-2 bg-slate-200 rounded-full animate-pulse w-3/4"></div>
                  <div className="h-2 bg-slate-200 rounded-full animate-pulse w-full"></div>
                  <div className="h-2 bg-slate-200 rounded-full animate-pulse w-5/6"></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 bg-white border-t border-slate-200">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSendText()}
                placeholder="Întreabă ceva..."
                className="flex-1 bg-slate-100 border-transparent focus:bg-white focus:border-slate-500 focus:ring-2 focus:ring-slate-200 rounded-full px-4 py-3 outline-none transition-all"
              />
              <button onClick={handleSendText} disabled={!inputText.trim() || isLoading} className="p-3 bg-slate-800 text-white rounded-full hover:bg-slate-900 disabled:opacity-50 disabled:hover:bg-slate-800 transition-colors">
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}


const RadarChart = ({ job }: { job: any }) => {
  const axes = [
    { key: 'ax1', label: 'Structură', color: '#ef4444' },
    { key: 'ax2', label: 'Logică', color: '#8b5cf6' },
    { key: 'ax3', label: 'Senzorial', color: '#f59e0b' },
    { key: 'ax4', label: 'Social', color: '#10b981' },
    { key: 'ax5', label: 'Creativitate', color: '#3b82f6' },
  ];
  const cx = 110, cy = 110, r = 80;
  const n = 5;
  const angleStep = (2 * Math.PI) / n;
  const startAngle = -Math.PI / 2;

  const getPoint = (i: number, val: number) => {
    const angle = startAngle + i * angleStep;
    const dist = (val / 100) * r;
    return { x: cx + dist * Math.cos(angle), y: cy + dist * Math.sin(angle) };
  };

  const getLabelPoint = (i: number) => {
    const angle = startAngle + i * angleStep;
    const dist = r + 22;
    return { x: cx + dist * Math.cos(angle), y: cy + dist * Math.sin(angle) };
  };

  const gridLevels = [20, 40, 60, 80, 100];

  const dataPoints = axes.map((a, i) => getPoint(i, job[a.key] || 0));
  const dataPath = dataPoints.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ') + ' Z';

  return (
    <div className="flex flex-col items-center">
      <svg width="220" height="220" viewBox="0 0 220 220">
        {gridLevels.map(level => {
          const pts = axes.map((_, i) => getPoint(i, level));
          const path = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ') + ' Z';
          return <path key={level} d={path} fill="none" stroke="#e2e8f0" strokeWidth="0.8" />;
        })}
        {axes.map((_, i) => {
          const pt = getPoint(i, 100);
          return <line key={i} x1={cx} y1={cy} x2={pt.x.toFixed(1)} y2={pt.y.toFixed(1)} stroke="#e2e8f0" strokeWidth="0.8" />;
        })}
        <path d={dataPath} fill="rgba(139,92,246,0.15)" stroke="#8b5cf6" strokeWidth="2" />
        {dataPoints.map((p, i) => (
          <circle key={i} cx={p.x.toFixed(1)} cy={p.y.toFixed(1)} r="3" fill={axes[i].color} />
        ))}
        {axes.map((a, i) => {
          const lp = getLabelPoint(i);
          return (
            <text key={i} x={lp.x.toFixed(1)} y={lp.y.toFixed(1)} textAnchor="middle" dominantBaseline="middle"
              fontSize="9" fill="#64748b" fontWeight="500">
              {a.label}
            </text>
          );
        })}
      </svg>
      <div className="grid grid-cols-5 gap-1 w-full mt-1">
        {axes.map((a, i) => (
          <div key={i} className="text-center">
            <div className="text-xs font-black" style={{color: a.color}}>{job[a.key] || 0}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function App() {
  const { mode, setMode } = useAgentState();
  const [searchTerm, setSearchTerm] = useState('');

  const getArsenalButtons = (project) => {
    return [
      { label: '📝 Script TTS', key: 'tts' },
      { label: '🖼️ Imagini Sincronizate', key: 'images' },
      { label: '🎙️ Audio TTS', key: 'audio' },
      { label: '🎬 Asamblare Video', key: 'video' },
      { label: '🔍 Analiză SEO Completă', key: 'seo' },
      { label: '📊 Audit Digital', key: 'audit' },
      { label: '🚀 Funnel Skool/TG/WA', key: 'funnel' },
      { label: '👥 Scraping Audiență', key: 'scraping' },
      { label: '#️⃣ SEO & Hashtags', key: 'hashtags' },
      { label: '📱 Social Media Copy', key: 'social' },
      { label: '📧 Secvență Email', key: 'email' },
      { label: '💬 WhatsApp Outreach', key: 'whatsapp' },
    ];
  };

  const generateArsenal = async (project, idx, step) => {
    setGeneratingArsenal({ idx, step });
    setArsenalProgress(0);
    const btn = getArsenalButtons(project)[step];
    const timer = setInterval(() => setArsenalProgress(p => Math.min(p + 1, 99)), 1200);

    // Pasul 2 — Imagini Sincronizate via KIE.ai
    if (btn.key === 'images') {
      try {
        const prompts = [
          `Professional hero image for ${project.title}, cinematic lighting, modern brand, 4K`,
          `Social media visual for ${project.title}, vibrant, engaging, Instagram ready`,
          `YouTube thumbnail for ${project.title}, bold, high contrast, professional`,
        ];
        const results = [];
        for (const prompt of prompts) {
          const res = await fetch('/api/generate-image', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt, aspect_ratio: '16:9' })
          });
          const data = await res.json();
          if (data.success) {
            let attempts = 0;
            while (attempts < 20) {
              await new Promise(r => setTimeout(r, 3000));
              const s = await fetch('/api/task-status?taskId=' + data.taskId);
              const sd = await s.json();
              if (sd.state === 'success' && sd.resultUrl) { results.push({ prompt, url: sd.resultUrl }); break; }
              if (sd.state === 'fail') break;
              attempts++;
            }
          }
        }
        clearInterval(timer); setArsenalProgress(100);
        const result = results.map((r, i) => `### Imagine ${i+1}\nPrompt: ${r.prompt}\nURL imagine: ${r.url}\n`).join('\n---\n') || '## Eroare — încearcă din nou';
        setArsenalData(prev => ({ ...prev, [idx]: { ...(prev[idx] || {}), [step]: result } }));
        setArsenalStep(prev => ({ ...prev, [idx]: Math.max((prev[idx] || 0), step + 1) }));
        setGeneratingArsenal(null); return;
      } catch { clearInterval(timer); setGeneratingArsenal(null); return; }
    }

    const title = project.title;
    const mono = project.monetizationMethod || 'subscriptie lunara';
    const pm: Record<string, string> = {
      tts: `Expert TTS si voiceover profesional. DOAR JSON: {"result":"## Script TTS Principal (60 secunde)\n[script complet gata de citit cu pauze marcate]\n\n## Script TTS Scurt (15 secunde — reclama)\n[script dinamic cu hook puternic]\n\n## Script TTS Intro Video (30 secunde)\n[script captivant pentru primele 30 secunde]\n\n## Script TTS Podcast (5 minute)\n[script complet episod introductiv]\n\n## Ghid Voce\n- Ton: [ton recomandat]\n- Viteza: [viteza WPM]\n- Emotie: [emotia de transmis]\n- Pauze cheie: [unde pauze dramatice]\n\n## Tool-uri recomandate\n1. ElevenLabs — elevenlabs.io (cel mai realist)\n2. Murf.ai — murf.ai\n3. Play.ht — play.ht\n4. Voicemaker.in — gratuit"} pentru business: ${title}`,

      audio: `Expert productie audio si podcast. DOAR JSON: {"result":"## Setup Audio Recomandat\n### Microfon\n[optiune gratuita + optiune premium]\n### Software gratuit\n[Audacity + setari recomandate]\n\n## Workflow Audio Complet\n1. [pas 1]\n2. [pas 2]\n3. [pas 3]\n4. [pas 4]\n5. [pas 5]\n\n## Script Audio pentru Intro Episod\n[30 secunde de intro profesional]\n\n## Script Audio pentru Outro\n[15 secunde cu CTA clar]\n\n## Muzica de Fundal Gratuita\n1. YouTube Audio Library — studio.youtube.com\n2. Pixabay — pixabay.com/music\n3. Free Music Archive — freemusicarchive.org\n\n## Prompt ElevenLabs\n[prompt exact pentru generarea vocii in stilul potrivit]"} pentru: ${title}`,

      video: `Expert video editing si productie YouTube. DOAR JSON: {"result":"## Instructiuni Asamblare Video Completa\n\n### Software Recomandat Gratuit\n- CapCut Desktop (cel mai usor)\n- DaVinci Resolve (profesional)\n- OpenShot (open source)\n\n### Structura Video (8 minute)\n- 0:00–0:30: [ce contine intro + cum il montezi]\n- 0:30–2:00: [continut principal pas 1]\n- 2:00–5:00: [demonstratie / tutorial]\n- 5:00–7:00: [rezultate si social proof]\n- 7:00–8:00: [CTA final]\n\n### Prompt Imagini pentru Video\n[3 prompturi Midjourney/Leonardo pentru imagini cheie]\n\n### Text pe Ecran\n[ce texte suprapuse adaugi si cand]\n\n### Tranzitii Recomandate\n[tipuri de tranzitii pentru fiecare sectiune]\n\n### Export Setari\n- Rezolutie: 1920x1080\n- FPS: 30\n- Format: MP4 H.264"} pentru canalul: ${title}`,

      seo: `Expert SEO si content marketing. DOAR JSON: {"result":"## Analiza SEO Completa\n\n### Keyword Principal\n[keyword cu volum mare si competitie mica]\n\n### 10 Keywords Secundare\n1. [kw + volum estimat]\n2. [kw + volum]\n3. [kw + volum]\n4. [kw + volum]\n5. [kw + volum]\n6. [kw + volum]\n7. [kw + volum]\n8. [kw + volum]\n9. [kw + volum]\n10. [kw + volum]\n\n### Structura Articol Optimizat\n- H1: [titlu exact]\n- H2-uri: [5 subtitluri]\n- Meta Title: [60 caractere]\n- Meta Description: [155 caractere]\n\n### Strategie Link Building\n[5 tactici concrete gratuita]\n\n### Continut Pillar Page\n[brief complet articol principal 2000 cuvinte]\n\n### Competitori de depasit\n[3 site-uri competitor cu analiza gap]"} pentru nisa: ${title}`,

      audit: `Expert digital marketing si audit online. DOAR JSON: {"result":"## Audit Digital Complet\n\n### Prezenta Online Actuala\n[analiza ce ar trebui sa aiba]\n\n### Website\n- Viteza recomandata: sub 3 secunde\n- Tool audit gratuit: PageSpeed Insights\n- Probleme frecvente: [lista]\n\n### Social Media Audit\n- Platforme prioritare pentru nisa: [lista]\n- Frecventa postare recomandata: [detalii]\n- Tip continut cu ROI maxim: [detalii]\n\n### Email Marketing\n- Rata deschidere benchmark: [%]\n- Tool recomandat gratuit: Brevo (300/zi gratis)\n- Secventa minima necesara: [nr emailuri]\n\n### SEO Score Estimat\n[scor si ce trebuie imbunatatit]\n\n### Plan de Actiune 30 zile\n1. [actiune ziua 1-7]\n2. [actiune ziua 8-14]\n3. [actiune ziua 15-21]\n4. [actiune ziua 22-30]\n\n### Tool-uri Gratuite Recomandate\n[5 tool-uri cu link]"} pentru business: ${title}`,

      funnel: `Expert funnel marketing si automatizare vanzari. DOAR JSON: {"result":"## Funnel Complet Skool + Telegram + WhatsApp\n\n### Structura Funnel\nTop of Funnel → Middle → Bottom → Retention\n\n### Skool Community Funnel\n- Nume comunitate recomandat: [nume]\n- Categorii de continut: [5 categorii]\n- Post de bun venit: [text complet]\n- Regulament: [3 reguli clare]\n- Oferta de upsell din comunitate: [descriere]\n\n### Telegram Channel Funnel\n- Descriere canal: [text bio complet]\n- Primele 5 posturi: [continut fiecare]\n- Frecventa postare: [detalii]\n- CTA principal: [text exact]\n\n### WhatsApp Business Funnel\n- Mesaj de bun venit automat: [text complet]\n- Catalog produse: [structura]\n- Secventa follow-up 7 zile: [mesaj per zi]\n\n### Flow Complet\n[diagrama text a intregului funnel de la lead la client]"} pentru: ${title} monetizat prin ${mono}`,

      scraping: `Expert research audienta si market intelligence. DOAR JSON: {"result":"## Strategie Scraping Audienta\n\n### Profilul Clientului Ideal\n- Varsta: [range]\n- Ocupatie: [detalii]\n- Probleme principale: [3 probleme]\n- Unde petrece timp online: [platforme]\n- Ce cauta pe Google: [5 cautari frecvente]\n\n### Grupuri Facebook de Targetat\n[5 tipuri de grupuri cu descriere si cum le gasesti]\n\n### Hashtags TikTok & Instagram\n[10 hashtags cu volum mare din nisa]\n\n### Comunitati Reddit\n[3 subreddits relevante]\n\n### Tool-uri Gratuite de Research\n1. Facebook Groups Search: [query exact]\n2. Jina AI Reader: reader.jina.ai/[URL competitor]\n3. Brave Search: [query exact]\n4. Google Trends: [termeni de urmarit]\n5. AnswerThePublic: [query]\n\n### Script de Outreach Initial\n[mesaj de contact pentru primul val de audienta]\n\n### 300 Contacte Prima Luna\n[strategie pas cu pas pentru a gasi 300 contacte calificate]"} pentru nisa: ${title}`,

      hashtags: `Expert SEO social media si hashtag strategy. DOAR JSON: {"result":"## Strategie SEO & Hashtags Completa\n\n### YouTube SEO\n- Titlu optimizat: [titlu cu keyword]\n- 20 Tags YouTube: [tags separate virgula]\n- Descriere SEO 300 cuvinte: [text complet]\n- End screen CTA: [text]\n\n### Instagram Hashtags\n- Set 1 (nisa): [10 hashtags volum mic]\n- Set 2 (mediu): [10 hashtags volum mediu]\n- Set 3 (viral): [5 hashtags volum mare]\n- Caption hook: [prima linie captivanta]\n\n### TikTok SEO\n- Caption optimizata: [text complet 150 caractere]\n- Hashtags TikTok: [10 hashtags]\n- Sound recomandat: [tip de sunet pentru nisa]\n\n### LinkedIn SEO\n- Headline profil optimizat: [text]\n- Keywords profil: [10 keywords]\n- Post tags: [5 tags]\n\n### Google Business Profile\n- Categorii recomandate: [categorii]\n- Descriere optimizata: [text 750 caractere]"} pentru: ${title}`,

      social: `Expert social media marketing si copywriting. DOAR JSON: {"result":"## Social Media Copy Complet\n\n### 5 Posturi Instagram Feed\nPost 1 (Educational):\n[caption complet + hashtags + CTA]\n---\nPost 2 (Social Proof):\n[caption + hashtags + CTA]\n---\nPost 3 (Behind Scenes):\n[caption + hashtags + CTA]\n---\nPost 4 (Produs/Serviciu):\n[caption + hashtags + CTA]\n---\nPost 5 (Viral/Emotional):\n[caption + hashtags + CTA]\n\n### 3 Scripts Reels/TikTok\nReel 1: [hook 3 sec + body + CTA]\nReel 2: [hook + body + CTA]\nReel 3: [hook + body + CTA]\n\n### 3 Posturi LinkedIn\n[post complet fiecare, ton profesional]\n\n### Thread Twitter/X (10 tweet-uri)\n[thread complet cu hook si fiecare tweet]\n\n### Story Sequence (5 story-uri)\n[continut fiecare story cu sondaj/link]"} pentru: ${title}`,

      email: `Expert email marketing si copywriting. DOAR JSON: {"result":"## Secventa 7 Emailuri Completa\n\n### Email 1 — Bun venit (Ziua 1)\nSubiect: [subiect cu rata deschidere mare]\nPreview: [preview text 90 caractere]\n[corp email complet 300 cuvinte]\n\n---\n### Email 2 — Valoare pura (Ziua 3)\nSubiect: [subiect]\n[corp complet]\n\n---\n### Email 3 — Poveste personala (Ziua 5)\nSubiect: [subiect emotional]\n[corp complet]\n\n---\n### Email 4 — Obiectii si raspunsuri (Ziua 7)\nSubiect: [subiect]\n[corp complet]\n\n---\n### Email 5 — Social proof (Ziua 10)\nSubiect: [subiect cu testimonial]\n[corp complet]\n\n---\n### Email 6 — Urgenta reala (Ziua 12)\nSubiect: [subiect urgenta]\n[corp complet]\n\n---\n### Email 7 — Oferta finala (Ziua 14)\nSubiect: [subiect oferta]\n[corp complet cu CTA puternic]\n\n### Setup Amazon SES\n[instructiuni concrete activare si configurare]"} pentru: ${title}`,

      whatsapp: `Expert WhatsApp marketing si outreach automation. DOAR JSON: {"result":"## Strategie WhatsApp Outreach Complet\n\n### Mesaj 1 — Cold Outreach\n[mesaj personalizat 160 caractere, fara spam]\n\n### Mesaj 2 — Follow-up Ziua 2\n[mesaj valoare + intrebare deschisa]\n\n### Mesaj 3 — Valoare Ziua 4\n[partajare resursa gratuita relevanta]\n\n### Mesaj 4 — Social Proof Ziua 6\n[testimonial scurt + invitatie call]\n\n### Mesaj 5 — Oferta Ziua 8\n[oferta clara cu CTA specific]\n\n### Configurare Robot WhatsApp\n1. Instaleaza Python 3.10+\n2. pip install selenium webdriver-manager\n3. Deschide WhatsApp Web si scaneaza QR\n4. Creeaza contacts.csv cu: phone,name,nisa\n5. Ruleaza: python robot.py --daily=300 --delay=120\n\n### Setari Sigurante\n- Max 300 mesaje/zi\n- Delay 2 minute intre mesaje\n- Pauza 8h noaptea (22:00-06:00)\n- Rotate template la fiecare 50 mesaje\n\n### Template CSV Contacte\n[structura exacta fisier cu exemple]\n\n### Monitorizare\n- CTR tinta: 15-25%\n- Raspuns tinta: 5-10%\n- Conversie tinta: 1-3%"} pentru business: ${title}`,
    };

    try {
      const response = await callAI(pm[btn.key] || pm.tts, mode);
      clearInterval(timer);
      setArsenalProgress(100);
      const clean = response.replace(/\`\`\`json/g, '').replace(/\`\`\`/g, '').trim();
      const data = JSON.parse(clean);
      setArsenalData(prev => ({ ...prev, [idx]: { ...(prev[idx] || {}), [step]: data.result } }));
      setArsenalStep(prev => ({ ...prev, [idx]: Math.max((prev[idx] || 0), step + 1) }));
    } catch (err) {
      clearInterval(timer);
    } finally {
      setGeneratingArsenal(null);
    }
  };

  const downloadArsenal = (idx) => {
    if (!pivotData) return;
    const proj = pivotData.monetizationProjects[idx];
    const data = arsenalData[idx] || {};
    const btns = getArsenalButtons(proj);
    let txt = 'ARSENAL: ' + proj.title + '\n\n';
    btns.forEach((b, s) => { if (data[s]) txt += '=== ' + b.label + ' ===\n' + data[s] + '\n\n'; });
    const blob = new Blob([txt], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'arsenal.txt'; a.click();
  };

  const [selectedJob, setSelectedJob] = useState<JobData | null>(null);

  const [premiumProjection, setPremiumProjection] = useState<PremiumProjection | null>(null);
  const [developingIdx, setDevelopingIdx] = useState<number | null>(null);
  const [arsenalStep, setArsenalStep] = useState({});
  const [arsenalData, setArsenalData] = useState({});
  const [generatingArsenal, setGeneratingArsenal] = useState(null);
  const [arsenalProgress, setArsenalProgress] = useState(0);
  const [generatingTools, setGeneratingTools] = useState<number | null>(null);
  const [projectTools, setProjectTools] = useState<{[k: number]: any[]}>({});
  const [developProgress, setDevelopProgress] = useState(0);
  const [developments, setDevelopments] = useState<{[key: number]: any}>({});

  const [pivotData, setPivotData] = useState<PivotData | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [showAcademia, setShowAcademia] = useState(false);
  const [showOpenClaw, setShowOpenClaw] = useState(false);
  const [showArsenal, setShowArsenal] = useState(false);
  const [showAfacere, setShowAfacere] = useState(false);
  const location = useLocation();
  useEffect(() => {
    const p = location.pathname;
    if (p === '/afacerelacheie') setShowAfacere(true);
    else if (p === '/academy') setShowAcademia(true);
    else if (p === '/openclaw') setShowOpenClaw(true);
    else if (p === '/arsenalapi') setShowArsenal(true);
  }, []);
  const [lang, setLang] = useState<Lang>('ro');
  const [showLangMenu, setShowLangMenu] = useState(false);
  const t = T[lang];
  const brand = BRANDS[lang];
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [contextAnswers, setContextAnswers] = useState({ q1: '', q2: '', q3: '' });
  const [luckyLoading, setLuckyLoading] = useState({ q1: false, q2: false, q3: false });
  
  // Refs for scrolling
  const pivotRef = useRef<HTMLDivElement>(null);
  const pricingRef = useRef<HTMLDivElement>(null);
  const missionRef = useRef<HTMLDivElement>(null);
  const principlesRef = useRef<HTMLDivElement>(null);
  const diffRef = useRef<HTMLDivElement>(null);
  const methodologyRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef<HTMLDivElement>(null);
  const dividendRef = useRef<HTMLDivElement>(null);
  const projectsRef = useRef<HTMLDivElement>(null);

  const filteredJobs = JOBS_LIST.filter(job => 
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const categoryRiskData = useMemo(() => {
    const categories: Record<string, { total: number, count: number }> = {};
    JOBS_LIST.forEach(job => {
      if (!categories[job.category]) {
        categories[job.category] = { total: 0, count: 0 };
      }
      categories[job.category].total += job.automationRisk;
      categories[job.category].count += 1;
    });
    
    return Object.keys(categories).map(cat => ({
      name: cat,
      risk: Math.round(categories[cat].total / categories[cat].count)
    })).sort((a, b) => b.risk - a.risk);
  }, []);

  const handleJobSelect = (job: JobData) => {
    setSelectedJob(job);
    setPivotData(null);
    setContextAnswers({ q1: '', q2: '', q3: '' });
    setLuckyLoading({ q1: false, q2: false, q3: false });
    setTimeout(() => {
      pivotRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const generateTools = async (project: any, idx: number) => {
    setGeneratingTools(idx);
    try {
        const prompt = `Ești un expert în tools digitale și AI. Returnează DOAR JSON fără markdown, fără text extra, pentru proiectul: ${project.title} pe platforma ${project.platform}. Format: [{category:'Cercetare',tools:['tool1','tool2'],usage:'descriere'},{category:'Marketing',tools:['tool1','tool2'],usage:'descriere'},{category:'Automatizare',tools:['tool1','tool2'],usage:'descriere'},{category:'Monetizare',tools:['tool1','tool2'],usage:'descriere'},{category:'Analytics',tools:['tool1','tool2'],usage:'descriere'}]`;
      const buddy = await runBuddy(prompt);
      setMode(buddy.mode as any);
      const response = await callAI(prompt, buddy.mode);
      const clean = response.replace(/```json/g,'').replace(/```/g,'').trim();
      const data = JSON.parse(clean);
      setProjectTools(prev => ({ ...prev, [idx]: data }));
    } catch(err) {
      console.error('Tools error:', err);
    } finally {
      setGeneratingTools(null);
    }
  };

  const generateDevelopment = async (project: any, idx: number) => {
    setDevelopingIdx(idx);
    setDevelopProgress(0);
    let step = 0;
    const timer = setInterval(() => {
      step++;
      setDevelopProgress(Math.min(step, 99));
      if (step >= 99) clearInterval(timer);
    }, 600);
    try {
      const prompt = `Ești OpenClaw.ai cu 3 agenți: CTO, CFO, SEO. Construiește plan complet pentru: ${project.title} pe ${project.platform}. Răspunde DOAR JSON fără markdown: {"product":"descriere produs","acquisition":"strategie clienti","agents":{"cto":"stack tehnic","cfo":"proiectii financiare","seo":"strategie seo"},"pipeline":["Ziua 1-7: actiuni","Ziua 8-14: actiuni","Luna 1: actiuni","Luna 2-3: actiuni","Luna 4-6: actiuni","Luna 7-12: actiuni"],"openclawSetup":"ghid instalare nvidia api + telegram"}`;
      const buddy = await runBuddy(prompt);
      setMode(buddy.mode as any);
      const response = await callAI(prompt, buddy.mode);
      clearInterval(timer);
      setDevelopProgress(100);
      const clean = response.replace(/```json/g,'').replace(/```/g,'').trim();
      const data = JSON.parse(clean);
      setDevelopments(prev => ({ ...prev, [idx]: data }));
    } catch(err) {
      clearInterval(timer);
    } finally {
      setDevelopingIdx(null);
    }
  };

  const generateLuckyAnswer = async (qKey: 'q1' | 'q2' | 'q3', questionText: string) => {
    if (!selectedJob) return;
    setLuckyLoading(prev => ({ ...prev, [qKey]: true }));
    try {
      const prompt = `Ești un ${selectedJob.title}. Răspunde scurt (maxim 10-15 cuvinte), la persoana a I-a, la următoarea întrebare despre preferințele tale profesionale: "${questionText}". Fii creativ, realist și foarte specific meseriei tale. Nu folosi ghilimele.`;
      const _luckyText = await callAI(prompt, mode, true);
      if (_luckyText) { setContextAnswers(prev => ({ ...prev, [qKey]: _luckyText.trim() })); }
    } catch (error) {
      console.error("Error generating lucky answer:", error);
    } finally {
      setLuckyLoading(prev => ({ ...prev, [qKey]: false }));
    }
  };

  const generatePivotStrategy = async (job: JobData, context: {q1: string, q2: string, q3: string}) => {
    setIsGenerating(true);
    setPivotData(null);
    
    try {
      const prompt = `Generează o strategie de pivotare pentru meseria de "${job.title}".
      Contextul specific al utilizatorului:
      - Ce îi place să facă: ${context.q1 || 'Nespecificat'}
      - Cu cine preferă să lucreze: ${context.q2 || 'Nespecificat'}
      - Timp și obiective: ${context.q3 || 'Nespecificat'}
      
      Trebuie să returnezi un obiect JSON cu următoarea structură:
      - pivotStrategy: Un text în format Markdown cu strategia generală (propunere de valoare, abilități cheie, plan de acțiune, AI ca asistent).
      - monetizationProjects: Un array de exact 5 obiecte, fiecare reprezentând un proiect de monetizare.
        Fiecare proiect trebuie să aibă:
        - title: Titlul proiectului (ex: ${job.pivot1})
        - description: O descriere FOARTE EXTINSĂ și detaliată (minim 5-6 propoziții). Explică pas cu pas exact cum funcționează acest proiect în practică, de ce este extrem de valoros pentru clienți/utilizatori și cum se aliniază perfect cu contextul și abilitățile utilizatorului. Fii foarte specific și oferă exemple concrete de aplicare.
        - platform: Platforma recomandată (ex: YouTube, LinkedIn)
        - marketingStrategy: Strategia de marketing
        - innovation: Elementul de inovație
        - projectType: Tipul proiectului (ex: Conținut Video, Consultanță)
        - monetizationMethod: Metoda de monetizare (ex: AdSense, Abonament)
        - suitabilityQuestions: Un array de 2-3 întrebări de auto-reflecție (string-uri) profunde și specifice pentru a ajuta utilizatorul să-și dea seama exact dacă acest proiect i se potrivește (ex: "Ești confortabil să construiești o audiență de la zero?", "Ai răbdarea necesară pentru a oferi suport 1-la-1?"). Acestea trebuie să fie întrebări la care utilizatorul să răspundă cu Da/Nu sau să reflecteze profund.
      `;

      const buddy = await runBuddy(prompt);
      setMode(buddy.mode as any);
      const response = await callAI(prompt, buddy.mode);

      if (response) {
        let parsed;
        try {
          parsed = (() => {
          if (!response || response.trim().startsWith("<")) {
            console.error("Invalid HTML / timeout response:", response);
            return buildUniversalBusinessPipelines(job.title, context);
          }

          try {
            return buildUniversalBusinessPipelines(job.title, context);
          } catch (e) {
            console.error("JSON parse failed:", response);
            return buildUniversalBusinessPipelines(job.title, context);
          }
        })();
        } catch (e) {
          console.error("AI response is not valid JSON:", response);
          console.warn("Using local fallback strategy");
          setPivotData(buildUniversalBusinessPipelines(job.title, context));
          setIsGenerating(false);
          return;
        }

        const normalized = Array.isArray(parsed)
          ? {
              pivotStrategy: `Ești un ${job.title}. Iată 5 pipeline-uri de business scalabile generate automat pentru monetizare și creștere.`,
              monetizationProjects: parsed.map((item: any, index: number) => ({
                title: item.nume || `Business ${index + 1}`,
                description: item.descriere || "Business pipeline complet.",
                platform: item.canale_acces_clienti?.join(', ') || "Website + Social Media",
                marketingStrategy: item.fluxuri_venit?.join(', ') || "Inbound + outbound",
                innovation: item.diferente_cheie?.join(', ') || "AI automation",
                projectType: item.tip || "Business",
                monetizationMethod: item.fluxuri_venit?.join(', ') || "Subscription",
                suitabilityQuestions: item.pasi_initiali || ["Poți executa acest plan?"],
                revenue30: "€1.000 - €3.000",
                revenue90: "€5.000 - €15.000",
                revenue180: "€15.000 - €50.000",
                startupCost: item.costuri_initiale_estimate_eur
                  ? `€${item.costuri_initiale_estimate_eur.min} - €${item.costuri_initiale_estimate_eur.max}`
                  : "€500 - €2.000",
                timeToFirstSale: "7-21 zile",
                difficulty: "Medium / High",
                funnel: "Lead magnet → consult call → ofertă premium → retainer",
                kpi: item.indicatori_succes?.join(', ') || "MRR, CAC, Conversion Rate"
              }))
            }
          : parsed;

        setPivotData(normalized);
      } else {
        throw new Error("Empty response");
      }
      
      // Scroll to projects after a delay
      setTimeout(() => {
        projectsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } catch (error) {
      console.error("Error generating strategy:", error);
      setPivotData(buildUniversalBusinessPipelines(job.title, context));
      setPremiumProjection(buildPremiumProjection(job.title, job.automationRisk));
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadPlan = () => {
    if (!pivotData || !selectedJob) return;
    
    const content = `PLAN DE PIVOTARE: ${selectedJob.title}\n\n` +
      `STRATEGIE:\n${pivotData.pivotStrategy}\n\n` +
      `PROIECTE DE MONETIZARE:\n` +
      pivotData.monetizationProjects.map((p, i) => 
        `${i+1}. ${p.title}\n   Tip: ${p.projectType}\n   Monetizare: ${p.monetizationMethod}\n   Platformă: ${p.platform}\n   Descriere: ${p.description}\n   Marketing: ${p.marketingStrategy}\n   Inovație: ${p.innovation}\n`
      ).join('\n');

    const element = document.createElement("a");
    const file = new Blob([content], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `Plan_DaRomania_${selectedJob.title.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const scrollTo = (ref: React.RefObject<HTMLDivElement | null>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100 snap-y snap-mandatory scroll-smooth">
      <ClawStatusBar />
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
            <div className="bg-indigo-600 p-2 rounded-xl">
              <HeartHandshake className="text-white w-6 h-6" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">Da<span className="text-indigo-600">{brand.highlight}</span></span>
          </div>
          
          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <button onClick={() => setShowAcademia(true)} className="hover:text-indigo-600 transition-colors font-black text-indigo-600">{t.nav_academy}</button>
            <button onClick={() => setShowOpenClaw(true)} className="hover:text-purple-600 transition-colors font-black text-purple-600">{t.nav_openclaw}</button>
            <button onClick={() => setShowArsenal(true)} className="hover:text-amber-500 transition-colors font-black text-amber-500">{t.nav_arsenal}</button>
            <button onClick={() => setShowAfacere(true)} className="hover:text-green-600 transition-colors font-black text-green-600">{t.nav_afacere}</button>
            <div className="relative">
              <button onClick={() => setShowLangMenu(p => !p)} className="flex items-center gap-1 text-slate-500 hover:text-slate-800 transition-colors text-sm font-semibold px-2 py-1 rounded-lg hover:bg-slate-100">
                {BRANDS[lang].flag} {lang.toUpperCase()} <span className="text-xs">▾</span>
              </button>
              {showLangMenu && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowLangMenu(false)} />
                  <div className="absolute right-0 top-10 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden z-50 min-w-[150px]">
                    {(['ro','en','es'] as Lang[]).map(l => (
                      <button key={l} onClick={() => { setLang(l); setShowLangMenu(false); }}
                        className={"w-full text-left px-4 py-3 text-sm flex items-center gap-2 transition-colors " + (lang === l ? "bg-indigo-50 text-indigo-700 font-black" : "hover:bg-slate-50 text-slate-700 font-medium")}>
                        {BRANDS[l].flag} {LANG_NAMES[l]}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
            <button onClick={() => scrollTo(missionRef)} className="hover:text-indigo-600 transition-colors">Misiune</button>

            <button onClick={() => scrollTo(pricingRef)} className="hover:text-indigo-600 transition-colors">Prețuri</button>
            <button 
onClick={() => {}} className="hidden" />
            
          </nav>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Nav */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden bg-white border-b border-slate-200 overflow-hidden"
            >
              <div className="px-4 py-6 flex flex-col gap-4">
                <button onClick={() => { setShowAcademia(true); setIsMobileMenuOpen(false); }} className="text-left text-lg font-black text-indigo-600 py-2">🎓 Academia DaRomania</button>
                <button onClick={() => { setShowOpenClaw(true); setIsMobileMenuOpen(false); }} className="text-left text-lg font-black text-purple-600 py-2">🤖 OpenClaw — Ghid Instalare</button>
                <button onClick={() => { setShowArsenal(true); setIsMobileMenuOpen(false); }} className="text-left text-lg font-black text-amber-500 py-2">⚡ Arsenal API — Transformă-ți Jobul</button>
                <button onClick={() => { setShowAfacere(true); setIsMobileMenuOpen(false); }} className="text-left text-lg font-black text-green-600 py-2">💼 Afacere la Cheie — $99/lună</button>
                <button onClick={() => { scrollTo(missionRef); setIsMobileMenuOpen(false); }} className="text-left text-lg font-medium text-slate-600 hover:text-indigo-600 py-2">Misiune</button>

                <button onClick={() => { scrollTo(pricingRef); setIsMobileMenuOpen(false); }} className="text-left text-lg font-medium text-slate-600 hover:text-indigo-600 py-2">Prețuri</button>
                <button 
                  onClick={() => { setAuthModal('signin'); setIsMobileMenuOpen(false); }}
                  className="bg-slate-900 text-white px-5 py-3 rounded-xl hover:bg-slate-800 transition-all shadow-sm mt-2 font-bold"
                >
                  Intra in cont
                </button>
              </div>
            </motion.div>
          )}

        {/* OPENCLAW PAGE */}
          {showArsenal && <><ArsenalPage onClose={() => setShowArsenal(false)} /><BuddyArsenalChat /></>}
        {showAfacere && <AfacereLaCheiePage onClose={() => setShowAfacere(false)} />}
        
        
        {showOpenClaw && (
          <div className="fixed inset-0 z-50 bg-white overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-white/95 backdrop-blur border-b border-slate-200 px-4 py-3 flex items-center justify-between z-10">
              <button onClick={() => setShowOpenClaw(false)} style={{display:"flex",alignItems:"center",gap:8,background:"linear-gradient(135deg,#f6c90e,#e0a800)",border:"none",borderRadius:10,padding:"10px 20px",color:"#1a1a1a",fontWeight:900,fontSize:13,cursor:"pointer",boxShadow:"0 2px 8px rgba(246,201,14,0.4)"}}>← Back to 🇷🇴 DaRomania</button>
                
              <span className="font-black text-slate-800 text-sm hidden sm:block">🤖 OpenClaw AI — Cel mai viral agent AI din 2026</span>
              <a href="https://build.nvidia.com" target="_blank" rel="noopener noreferrer" className="text-xs font-black text-green-700 bg-green-100 px-3 py-2 rounded-full">NVIDIA Gratuit →</a>
            </div>

            <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">

              {/* HERO */}
              <div className="bg-gradient-to-br from-purple-700 via-indigo-700 to-blue-800 rounded-3xl p-8 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32" />
                <div className="relative z-10">
                  <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-4 py-1 text-sm font-bold mb-4">
                    🔥 #1 cel mai viral proiect GitHub din 2026
                  </div>
                  <h2 className="text-2xl md:text-5xl font-black mb-3 leading-tight">OpenClaw AI<br/><span className="text-purple-300">Agentul tau personal</span></h2>
                  <p className="text-white/80 text-lg mb-6 max-w-2xl">Nu e un chatbot. E un agent AI care <strong className="text-white">executa task-uri reale</strong> pe calculatorul tau — trimite emailuri, scrie cod, controleaza aplicatii, raspunde pe WhatsApp si Telegram, 24/7, fara sa platesti nimic.</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[['247K+','Stele GitHub'],['60 zile','0 → 250K stars'],['13.700+','Skills disponibile'],['0 EUR','Cost lunar cu NVIDIA']].map(([n,l]) => (
                      <div key={l} className="bg-white/10 backdrop-blur rounded-2xl p-4 text-center border border-white/20">
                        <p className="text-2xl font-black">{n}</p>
                        <p className="text-xs text-white/70 mt-1">{l}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* RECORD BREAKING */}
              <div className="bg-amber-50 border-2 border-amber-300 rounded-3xl p-6">
                <p className="text-amber-800 font-black text-lg mb-2">⚡ Record absolut in istoria GitHub</p>
                <p className="text-amber-700 text-sm leading-relaxed">OpenClaw a crescut de la 0 la 250.000 de stele in doar 60 de zile — <strong>mai rapid decat React, Linux si orice alt proiect open-source din istorie.</strong> Creatorul sau, Peter Steinberger, a fost angajat de OpenAI pe baza acestui succes. O fundatie non-profit a preluat proiectul pentru a-l mentine gratuit pentru totdeauna.</p>
              </div>

              {/* CE POATE FACE — KILLER FEATURES */}
              <div>
                <h3 className="text-2xl font-black text-slate-900 mb-4">🦾 Ce poate face OpenClaw pentru tine</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { icon: '📱', title: '20+ Platforme de mesagerie', desc: 'WhatsApp, Telegram, Slack, Discord, iMessage, Signal, Teams, WeChat, LINE, Matrix si altele. Un singur agent, toate canalele.', color: 'bg-blue-50 border-blue-200' },
                    { icon: '🧠', title: 'Memorie persistenta (spre deosebire de ChatGPT)', desc: 'Isi aminteste tot ce i-ai spus vreodata. Stie preferintele tale, istoricul, proiectele. Nu uita niciodata nimic.', color: 'bg-purple-50 border-purple-200' },
                    { icon: '🌐', title: 'Control browser complet', desc: 'Deschide Chrome, navigheaza, completeaza formulare, extrage date, face comenzi online. Fara sa te atingi de tastatura.', color: 'bg-green-50 border-green-200' },
                    { icon: '🎙️', title: 'Comenzi vocale (Wake Word)', desc: 'Pe macOS si iOS: trezesti agentul cu vocea. Pe Android: Talk Mode continuu. Ca Jarvis din Iron Man.', color: 'bg-orange-50 border-orange-200' },
                    { icon: '⚙️', title: 'Automatizari complexe (Cron)', desc: 'Ruleaza task-uri la ore fixe: rapoarte zilnice, monitorizare preturi, postari sociale, backup-uri, emailuri de follow-up.', color: 'bg-red-50 border-red-200' },
                    { icon: '🤖', title: 'Multi-agent routing', desc: 'Poti crea agenti separati: unul pentru business, unul pentru personal, unul pentru cod. Fiecare cu personalitate si acces propriu.', color: 'bg-teal-50 border-teal-200' },
                    { icon: '🎬', title: 'Video + muzica generata AI', desc: 'Ultima versiune (2026.4.5) include generare video si muzica built-in. Pipeline complet de content dintr-o comanda.', color: 'bg-pink-50 border-pink-200' },
                    { icon: '🔒', title: 'Local-first, datele tale raman la tine', desc: 'Ruleaza pe calculatorul tau. Nicio companie nu iti vede datele. Poti expune securizat via Tailscale pentru acces remote.', color: 'bg-slate-50 border-slate-200' },
                  ].map(f => (
                    <div key={f.title} className={`rounded-2xl border-2 p-5 ${f.color}`}>
                      <p className="text-2xl mb-2">{f.icon}</p>
                      <p className="font-black text-slate-900 mb-1">{f.title}</p>
                      <p className="text-slate-600 text-sm leading-relaxed">{f.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* TESTIMONIALE REALE */}
              <div className="bg-slate-900 rounded-3xl p-6 md:p-8">
                <h3 className="text-xl font-black text-white mb-5">💬 Ce spun utilizatorii reali</h3>
                <div className="space-y-3">
                  {[
                    ['"L-am botezat Jarvis. Imi face briefing zilnic, verifica calendarul si ma anunta cand sa plec la pickleball in functie de trafic."', '@BraydonCoyer'],
                    ['"Am dat comanda de pe telefon: fix tests via Telegram. A rulat loop-ul, mi-a trimis progres la fiecare 5 iteratii. Autonom 100%."', '@php100'],
                    ['"OpenClaw-ul meu a realizat ca are nevoie de API key... a deschis browserul... a deschis Google Cloud Console... si si-a configurat singur token-ul."', '@Infoxicador'],
                    ['"Mi-am facut primul asistent AI personal pe WhatsApp. Imi construieste second brain-ul in timp ce chat-uiesc."', '@christinetyip'],
                    ['"Am rulat OpenClaw pe Raspberry Pi cu Cloudflare. Am construit un website de pe telefon in minute."', '@AlbertMoral'],
                  ].map(([q,a]) => (
                    <div key={a} className="bg-white/5 rounded-2xl p-4 border border-white/10">
                      <p className="text-white/90 text-sm italic leading-relaxed mb-2">{q}</p>
                      <p className="text-purple-400 text-xs font-bold">{a} · Twitter/X</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* COMPARATIE */}
              <div>
                <h3 className="text-2xl font-black text-slate-900 mb-4">📊 OpenClaw vs ChatGPT vs Abonamente</h3>
                <div className="overflow-x-auto rounded-2xl border border-slate-200">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-slate-900 text-white">
                        <th className="text-left p-4 font-black">Functie</th>
                        <th className="text-center p-4 font-black text-purple-400">OpenClaw + NVIDIA</th>
                        <th className="text-center p-4 font-black text-slate-400">ChatGPT Plus</th>
                        <th className="text-center p-4 font-black text-slate-400">Alt SaaS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        ['Cost lunar','0 EUR','$20/luna','$50-200/luna'],
                        ['Memorie persistenta','✅ Da','❌ Limitata','⚠️ Partiala'],
                        ['WhatsApp + Telegram','✅ Ambele','❌ Nu','⚠️ Uneori'],
                        ['Ruleaza local (privat)','✅ 100%','❌ Cloud','❌ Cloud'],
                        ['Control browser','✅ Complet','⚠️ Limitat','❌ Nu'],
                        ['Automatizari Cron','✅ Da','❌ Nu','⚠️ Platit'],
                        ['100+ modele AI','✅ Da (NVIDIA)','❌ Doar GPT','❌ 1-2'],
                        ['Open-source','✅ MIT','❌ Proprietar','❌ Proprietar'],
                      ].map(([f,a,b,c], i) => (
                        <tr key={f} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                          <td className="p-4 font-bold text-slate-900">{f}</td>
                          <td className="p-4 text-center font-black text-purple-700 bg-purple-50">{a}</td>
                          <td className="p-4 text-center text-slate-500">{b}</td>
                          <td className="p-4 text-center text-slate-500">{c}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* PASUL 1 */}
              <div className="bg-white rounded-3xl border-2 border-green-200 p-6">
                <div className="flex items-center gap-3 mb-5">
                  <span className="bg-green-600 text-white font-black w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0">1</span>
                  <div>
                    <h3 className="text-xl font-black text-slate-900">Obtine API-ul NVIDIA — Gratuit</h3>
                    <p className="text-sm text-slate-500">1.000 credite la inregistrare · 100+ modele AI de top</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {[
                    ['A','build.nvidia.com','Deschide platforma NVIDIA pentru dezvoltatori. Inregistrare 100% gratuita.','https://build.nvidia.com'],
                    ['B','Creeaza cont','Sign Up cu email + verificare telefon. Sub 2 minute.', null],
                    ['C','Genereaza cheia','Settings → API Keys → Generate → Never Expire → NGC Catalog + Public API → Generate.',null],
                    ['D','Salveaza cheia','Formatul: nvapi-xxxx... Primesti 1.000 credite instant. Nu o impartasi cu nimeni!',null],
                  ].map(([s,t,d,l]) => (
                    <div key={s} className="flex gap-3 bg-green-50 rounded-2xl p-4 items-start">
                      <span className="bg-green-600 text-white font-black text-sm w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">{s}</span>
                      <div>
                        <p className="font-black text-slate-900">{t}</p>
                        <p className="text-slate-600 text-sm">{d}</p>
                        {l && <a href={l} target="_blank" rel="noopener noreferrer" className="text-green-700 font-bold text-sm">{l} →</a>}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 bg-green-100 rounded-xl p-3">
                  <p className="text-green-800 font-bold text-sm">🆓 Modele gratuite: Qwen 3.5-397B · DeepSeek V3 · Kimi K2.5 · Llama 3.3 70B · Mistral Large + 100 altele</p>
                </div>
              </div>

              {/* PASUL 2 */}
              <div className="bg-white rounded-3xl border-2 border-purple-200 p-6">
                <div className="flex items-center gap-3 mb-5">
                  <span className="bg-purple-600 text-white font-black w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0">2</span>
                  <div>
                    <h3 className="text-xl font-black text-slate-900">Instaleaza OpenClaw</h3>
                    <p className="text-sm text-slate-500">Windows · Mac · Linux — sub 10 minute</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="border border-slate-200 rounded-2xl p-4">
                    <p className="font-black text-slate-800 mb-2">🪟 Windows — PowerShell ca Administrator</p>
                    <div className="bg-slate-900 rounded-xl p-3"><code className="text-green-400 text-sm font-mono">iwr https://openclaw.ai/install.ps1 | iex</code></div>
                  </div>
                  <div className="border border-slate-200 rounded-2xl p-4">
                    <p className="font-black text-slate-800 mb-2">🍎 Mac / 🐧 Linux — Terminal</p>
                    <div className="bg-slate-900 rounded-xl p-3"><code className="text-green-400 text-sm font-mono">curl -fsSL https://openclaw.ai/install.sh | sh</code></div>
                  </div>
                  <div className="bg-purple-50 border border-purple-200 rounded-2xl p-4 space-y-1 text-sm text-purple-900">
                    <p className="font-black mb-2">⚙️ Configurare wizard (porneste automat):</p>
                    <p>1. AI Provider → <strong>NVIDIA NIM</strong></p>
                    <p>2. Introdu cheia <strong>nvapi-...</strong> din Pasul 1</p>
                    <p>3. Model → <strong>qwen/qwen3.5-397b-a17b</strong></p>
                    <p>4. Channel → <strong>Telegram</strong></p>
                  </div>
                  <div className="bg-slate-900 rounded-xl p-3">
                    <code className="text-green-400 text-sm font-mono">openclaw gateway status</code>
                    <p className="text-green-500 text-xs mt-1">✅ Running — port 18789</p>
                  </div>
                </div>
              </div>

              {/* PASUL 3 */}
              <div className="bg-white rounded-3xl border-2 border-blue-200 p-6">
                <div className="flex items-center gap-3 mb-5">
                  <span className="bg-blue-600 text-white font-black w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0">3</span>
                  <div>
                    <h3 className="text-xl font-black text-slate-900">Conecteaza Telegram</h3>
                    <p className="text-sm text-slate-500">Controleaza agentul din telefon, oriunde</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {[
                    ['1','Creeaza Bot Telegram','Telegram → @BotFather → /newbot → nume + username → primesti TOKEN'],
                    ['2','Adauga in OpenClaw','localhost:18789 → Settings → Channels → Telegram → lipeste TOKEN → Save'],
                    ['3','Testeaza','Cauta bot-ul in Telegram → /start → scrie orice → raspunde instant!'],
                  ].map(([s,t,d]) => (
                    <div key={s} className="flex gap-3 bg-blue-50 rounded-2xl p-4 items-start">
                      <span className="bg-blue-600 text-white font-black text-sm w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">{s}</span>
                      <div>
                        <p className="font-black text-slate-900">{t}</p>
                        <p className="text-slate-600 text-sm">{d}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* COMENZI */}
              <div className="bg-slate-900 rounded-3xl p-6 text-white">
                <h3 className="text-xl font-black mb-4">⌨️ Comenzi esentiale</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {[
                    ['openclaw gateway start','Porneste agentul'],
                    ['openclaw gateway stop','Opreste agentul'],
                    ['openclaw gateway status','Verifica statusul'],
                    ['openclaw plugins list','Toate plugin-urile'],
                    ['openclaw models list','Modele disponibile'],
                    ['openclaw doctor','Diagnosticare automata'],
                  ].map(([cmd, desc]) => (
                    <div key={cmd} className="bg-slate-800 rounded-xl p-3 flex items-center justify-between gap-2">
                      <code className="text-green-400 text-xs font-mono">{cmd}</code>
                      <span className="text-slate-500 text-xs shrink-0">{desc}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA $9 */}
              <div className="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-3xl p-8 text-white text-center">
                <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-4 py-1 text-sm font-bold mb-4">
                  🚀 Sergiu il configureaza pentru tine
                </div>
                <h3 className="text-3xl font-black mb-2">Gata in 30 de minute.</h3>
                <p className="text-white/80 text-lg mb-2">NVIDIA API + OpenClaw + Telegram + primul tau agent AI functional.</p>
                <p className="text-white/60 text-sm mb-6">Tu nu faci nimic tehnic. Sergiu instaleaza, configureaza, testeaza si iti preda agentul gata de folosit.</p>
                <div className="bg-white/10 rounded-2xl p-4 mb-6 inline-block">
                  <p className="text-4xl font-black">$9</p>
                  <p className="text-white/70 text-sm">setup complet · o singura data</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <a href="https://wa.me/40768676141?text=Vreau%20OpenClaw%20configurat%20pentru%20proiectul%20meu" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 bg-green-500 text-white px-8 py-4 rounded-full font-black hover:bg-green-600 transition-all text-lg no-underline">
                    💬 Vreau OpenClaw — $9
                  </a>
                  <a href="https://build.nvidia.com" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 bg-white/20 text-white px-6 py-4 rounded-full font-black hover:bg-white/30 transition-all no-underline">
                    🔑 NVIDIA API Gratuit
                  </a>
                </div>
              </div>

            </div>
          </div>
        )}
        </AnimatePresence>

        {/* ACADEMIA DAROMANIA MODAL */}
        {showAcademia && (
          <div className="fixed inset-0 z-50 bg-white overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-slate-200 px-4 py-4 flex items-center justify-between z-10 shadow-sm">
              <div className="flex items-center gap-3">
                <button onClick={() => setShowAcademia(false)} style={{display:"flex",alignItems:"center",gap:8,background:"linear-gradient(135deg,#f6c90e,#e0a800)",border:"none",borderRadius:10,padding:"10px 20px",color:"#1a1a1a",fontWeight:900,fontSize:13,cursor:"pointer",boxShadow:"0 2px 8px rgba(246,201,14,0.4)"}}>← Back to 🇷🇴 DaRomania</button>
                <div>
                  <h1 className="text-xl font-black text-slate-900">🎓 Academia DaRomania</h1>
                  <p className="text-xs text-slate-500">71 proiecte construite de SSociety — comunitatea noastră</p>
                </div>
              </div>
              <a href="https://ssociety.eu" target="_blank" rel="noopener noreferrer" className="text-xs font-black text-indigo-600 bg-indigo-50 px-3 py-2 rounded-full hover:bg-indigo-100 transition-all">ssociety.eu →</a>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8">
              {/* Hero */}
              <div className="text-center mb-12">
                <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-4">71 Proiecte Active</h2>
                <p className="text-xl text-slate-600 max-w-3xl mx-auto">De la roboți AI pentru restaurante și sisteme solare inteligente, până la unelte creative, platforme de securitate și proiecte de lifestyle. Construit cu pasiune & AI.</p>
                <div className="flex flex-wrap justify-center gap-6 mt-8">
                  {[['71','Proiecte'],['8','Domenii'],['100%','Live'],['2026','Activ']].map(([n,l]) => (
                    <div key={l} className="text-center">
                      <p className="text-3xl font-black text-indigo-600">{n}</p>
                      <p className="text-sm text-slate-500">{l}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Categorii */}
              {[
                {
                  cat: '🍽️ Restaurante', color: 'from-orange-500 to-red-500', count: 15,
                  projects: [
                    { name: 'MrDelivery — Pagina Principală', desc: 'Platforma centrală cu toate serviciile digitale pentru restaurante. AI, automatizare, delivery optimization și consultanță.', link: 'https://mrdelivery.ro', badge: 'LIVE' },
                    { name: 'Instant Menu Pictures — Poze Meniu AI', desc: 'Generează fotografii profesionale de meniu Michelin-quality doar din text. Logo branding, export multi-format, procesare bulk.', link: 'https://ssociety-image-generator-588412172690.us-west1.run.app/', badge: 'LIVE' },
                    { name: 'AI Assistant pentru Clienți', desc: 'Chatbot AI care răspunde la întrebări despre meniu, prețuri, alergeni, preia comenzi și oferă suport 24/7 pe WhatsApp sau site.', link: 'https://mrdelivery.ro', badge: 'LIVE' },
                    { name: 'AI Assistant pentru Echipă', desc: 'Asistent AI intern pentru personal: instrucțiuni preparare, checklist-uri deschidere/închidere, alertează managerii. Reduce erorile umane.', link: 'https://mrdelivery.ro', badge: 'LIVE' },
                    { name: 'Gourmet Visionary AI', desc: 'Platformă AI premium fine dining: meniuri degustare sofisticate, perechi vin-mâncare, descrieri poetice, consultanță Michelin.', link: 'https://mrdelivery.ro', badge: 'LIVE' },
                    { name: 'MrDelivery AI Central', desc: 'Dashboard central care controlează toate sistemele AI ale restaurantului. Status boti, performanță, setări, rapoarte consolidate.', link: 'https://mrdelivery.ro', badge: 'LIVE' },
                    { name: 'Laborator de Texte AI', desc: 'Generator conținut specializat restaurante: postări social media, descrieri meniu, mesaje WhatsApp, răspunsuri recenzii Google.', link: 'https://mrdelivery.ro', badge: 'LIVE' },
                    { name: 'FoodieQuest — Descoperă Restaurante', desc: 'App descoperire culinară cu AI: spui ce poftești, buget, locație și primești recomandări perfecte cu filtre alergeni și rating.', link: 'https://mrdelivery.ro', badge: 'LIVE' },
                    { name: 'Audit AI — Analiză Restaurant', desc: 'Audit digital complet: meniu, prețuri, prezență online, recenzii, operațiuni, marketing. Raport cu note și recomandări concrete.', link: 'https://mrdelivery.ro', badge: 'LIVE' },
                    { name: 'Audit Michelin — Evaluare Premium', desc: 'Evaluare AI pe criteriile reale Michelin: ingrediente, tehnici gătit, calitate-preț, consistență. Scor detaliat și plan de acțiune.', link: 'https://mrdelivery.ro', badge: 'LIVE' },
                    { name: 'RestoMaster — Management All-in-One', desc: 'Platformă completă management restaurant: rezervări, meniu, stocuri, financiar, marketing, echipă, satisfacție clienți.', link: 'https://mrdelivery.ro', badge: 'LIVE' },
                    { name: 'MisterDelivery Bot — Chelner Digital', desc: 'Chatbot AI chelner virtual 24/7: preia comenzi prin chat, recomandă preparate, informează alergeni, trimite la bucătărie.', link: 'https://mrdelivery.ro', badge: 'LIVE' },
                    { name: 'MrDelivery Shop — Magazin Online', desc: 'Magazin online echipamente delivery și restaurante: cutii termice, pungi branduite, ambalaje eco, materiale marketing.', link: 'https://mrdelivery.ro', badge: 'LIVE' },
                    { name: 'MrDelivery Online — Portal Parteneri', desc: 'Portal digital parteneri: resurse exclusive, documentație, tutoriale, management performanță și rapoarte din dashboard centralizat.', link: 'https://mrdelivery.ro', badge: 'LIVE' },
                    { name: 'Audit MrDelivery — Interfață Modernă', desc: 'Versiunea redesignată a auditului restaurant cu interfață modernă, grafice interactive, scoruri colorate și recomandări pas-cu-pas.', link: 'https://mrdelivery.ro', badge: 'LIVE' },
                  ]
                },
                {
                  cat: '🤖 Unelte AI', color: 'from-purple-500 to-indigo-600', count: 10,
                  projects: [
                    { name: 'SSociety Studio — 6 Agenți AI', desc: 'CEO, CMO, CRO, CTO, CSO, CFO — agenți AI 24/7 pe marketing, vânzări, CRM și conținut. 500+ utilizatori, 3x ROI mediu.', link: 'https://ssocietystudio.lovable.app/', badge: 'LIVE' },
                    { name: 'PromptLab — Laborator Prompturi AI', desc: 'Creează, testează și optimizează prompturi AI. A/B Testing, Library, Analytics. Compatibil GPT-4, Gemini, DeepSeek, Mistral.', link: 'https://ssocietypromptlab.lovable.app/', badge: 'LIVE' },
                    { name: 'SSociety AI Studio — Content Factory', desc: 'Script AI → Audio TTS → Video Kie.ai → SEO → Auto-Publish. De la idee la publicat pe 7+ platforme în 15 minute.', link: 'https://ssocietyaistudio.lovable.app/', badge: 'LIVE' },
                    { name: 'VentureAI — Agenți AI Autonomi', desc: 'Automatizează proiecte, descoperă oportunități de venit, maximizează revenue. 1200+ utilizatori, $2.4M venituri generate.', link: 'https://ssocietyagents.lovable.app/', badge: 'LIVE' },
                    { name: 'AI Studio — Creație Vizuală', desc: 'Studio creativ AI: logo-uri, bannere, postări social media, materiale brand. Generează variante profesionale instant.', link: 'https://mrdelivery.ro', badge: 'LIVE' },
                    { name: 'Aura AI — Asistent cu Personalitate', desc: 'Asistent AI cu personalitate configurabilă: ton, cunoștințe de domeniu, stil comunicare unic. Perfect pentru branduri.', link: 'https://mrdelivery.ro', badge: 'LIVE' },
                    { name: 'Creator Studio — Video & Social Media', desc: 'Asistent AI creatori video: idei clipuri virale, scenarii, thumbnail-uri, titluri SEO, calendar publicare. YouTube, TikTok, Reels.', link: 'https://mrdelivery.ro', badge: 'LIVE' },
                    { name: 'App Creator — Aplicații fără Cod', desc: 'Construiești propria aplicație doar descriind ce vrei. AI generează interfața, logica, funcționalitățile. Zero cod scris.', link: 'https://mrdelivery.ro', badge: 'LIVE' },
                    { name: 'Snapshot Sparkle — Foto to Video', desc: 'Transformă orice fotografie în videoclip captivant: mișcare cinematică, efecte vizuale, muzică. Export pentru Reels/TikTok.', link: 'https://mrdelivery.ro', badge: 'LIVE' },
                    { name: 'MuseFlow — Productivitate Creativă', desc: 'Intră în starea de flow: Pomodoro, muzică ambientală AI, blocare distractori, tracking productivitate. Se adaptează ritmului tău.', link: 'https://mrdelivery.ro', badge: 'LIVE' },
                  ]
                },
                {
                  cat: '📣 Marketing', color: 'from-pink-500 to-rose-600', count: 6,
                  projects: [
                    { name: 'Wild Bot — 300 Mesaje/zi WhatsApp', desc: 'Outreach WhatsApp nedetectabil. Mesaje 100% unice, timpi umani aleatorii, 12 straturi protecție anti-ban. 2000+ mesaje/campanie.', link: 'https://wild-bot-rho.vercel.app/', badge: 'LIVE' },
                    { name: 'AdFusion — Agenție AI Publicitate', desc: 'Agenție publicitate complet automatizată: creează reclame, scrie texte, generează imagini, planifică campanii, optimizează buget.', link: 'https://mrdelivery.ro', badge: 'LIVE' },
                    { name: 'Viral Architect — Campanii Virale', desc: 'Proiectează campanii virale: analizează trenduri, creează hook-uri captivante, strategii distribuție, calendare publicare.', link: 'https://mrdelivery.ro', badge: 'LIVE' },
                    { name: 'One Image Ad Engine', desc: 'O singură poză → campanie publicitară completă: multiple variante reclamă, texte persuasive, formatele corecte per platformă.', link: 'https://mrdelivery.ro', badge: 'LIVE' },
                    { name: 'LeadGenius — Generare Lead-uri AI', desc: 'Identifică potențiali clienți din surse multiple, evaluează după criterii personalizabile, scorează și livrează lista gata de contactat.', link: 'https://mrdelivery.ro', badge: 'LIVE' },
                    { name: 'SEO Mastermind — Audit Avansat', desc: 'Audit SEO enterprise: competitor intelligence, keyword gap, content strategy AI, link building, technical SEO, predicții ranking.', link: 'https://mrdelivery.ro', badge: 'LIVE' },
                  ]
                },
                {
                  cat: '☀️ Energie', color: 'from-yellow-500 to-orange-500', count: 5,
                  projects: [
                    { name: 'Helios — Calculator Solar Rapid', desc: '3-4 întrebări simple → estimare producție, economie lunară, cost și payback period. Zero jargon tehnic.', link: 'https://mrdelivery.ro', badge: 'LIVE' },
                    { name: 'Smart Helios — Planificare Inteligentă', desc: 'Asistent AI planificare sistem fotovoltaic complet: panouri, invertor, baterii, cablare. Adaptat consumului tău real.', link: 'https://mrdelivery.ro', badge: 'LIVE' },
                    { name: 'Smart Helios Dashboard — Monitorizare Live', desc: 'Dashboard timp real sisteme fotovoltaice: producție curentă, economii, consum vs producție, surplus injectat, stare baterii.', link: 'https://mrdelivery.ro', badge: 'LIVE' },
                    { name: 'Smart Renewable — Energie Verde', desc: 'Aplicație educativă energie regenerabilă: solar, eolian, pompe căldură. Calculatoare impact ecologic și ghid tranziție.', link: 'https://mrdelivery.ro', badge: 'LIVE' },
                    { name: 'Diagnosticare Energie Verde', desc: 'AI troubleshooting sisteme energie regenerabilă: identifică cauza problemei, sugerează soluții, estimează cost reparație.', link: 'https://mrdelivery.ro', badge: 'LIVE' },
                  ]
                },
                {
                  cat: '📊 Operațiuni', color: 'from-blue-500 to-cyan-500', count: 5,
                  projects: [
                    { name: 'Nexus Dashboard — Command Center', desc: 'Dashboard executiv all-in-one: venituri, cheltuieli, comenzi, clienți, retenție — actualizat real-time cu alarme automate.', link: 'https://mrdelivery.ro', badge: 'LIVE' },
                    { name: 'Nexus 2027 — Platformă Business Futuristică', desc: 'Management business complet: project management, HR lite, CRM, raportare avansată, planificare strategică cu AI.', link: 'https://mrdelivery.ro', badge: 'LIVE' },
                    { name: 'Claude Trading Agent — Investiții AI', desc: 'Agent AI trading 24/7: analizează acțiuni și crypto, identifică pattern-uri tehnice, evaluează sentiment, sugerează tranzacții.', link: 'https://mrdelivery.ro', badge: 'LIVE' },
                    { name: 'Automation Hub — Conectare Servicii', desc: 'Hub automatizare: conectează toate aplicațiile între ele. Creează fluxuri automate fără cod între orice servicii digitale.', link: 'https://mrdelivery.ro', badge: 'LIVE' },
                    { name: 'GreenThumb AI — Consultant Agricol', desc: 'Asistent AI agricultură: identifică plante din foto, diagnostichează boli, programe irigație, sfaturi sezon, calendar plantare.', link: 'https://mrdelivery.ro', badge: 'LIVE' },
                  ]
                },
                {
                  cat: '💼 Afaceri', color: 'from-emerald-500 to-teal-600', count: 5,
                  projects: [
                    { name: 'SocietyHUB CRM Imobiliar PRO', desc: 'CRM imobiliar complet: proprietăți, leads, matching AI, publicare multi-portal (OLX, Storia, Imobiliare.ro), contracte, vizionări.', link: 'https://ssocietyhub.store', badge: 'LIVE' },
                    { name: 'MB EuroParts — Piese Auto Europene', desc: 'Marketplace piese auto Mercedes-Benz și europene: căutare OEM, comparare prețuri, verificare compatibilitate, livrare 24h.', link: 'https://mbeuroparts.lovable.app', badge: 'LIVE' },
                    { name: 'Vreau Franciză — Aplicare MrDelivery', desc: 'Formular digital aplicare franciză MrDelivery: evaluare automată eligibilitate și pași următori personalizați.', link: 'https://mrdelivery.ro', badge: 'LIVE' },
                    { name: 'Franchise Dream — Plan Personalizat', desc: 'Generator AI planuri franciză personalizate: model business, proiecții financiare, pași implementare, resurse necesare.', link: 'https://mrdelivery.ro', badge: 'LIVE' },
                    { name: 'Dream Formula Maker — Blueprint Afacere', desc: 'Cristalizează ideea perfectă de afacere: combini pasiuni + skills + piață + buget → formula completă cu plan 90 zile.', link: 'https://mrdelivery.ro', badge: 'LIVE' },
                  ]
                },
                {
                  cat: '🛡️ Securitate', color: 'from-slate-600 to-slate-900', count: 2,
                  projects: [
                    { name: 'SecureScan Pro — Testare Etică', desc: 'Scanează API-uri, detectează vulnerabilități, creează rapoarte HackerOne/Bugcrowd. 100% conformitate legală Legea 161/2003.', link: 'https://ssocialsafe.lovable.app/', badge: 'LIVE' },
                    { name: 'SSocietySafe — Ethical Hacking', desc: 'Platformă securitate cibernetică: descoperă vulnerabilități, scanări non-distructive, rapoarte profesionale bug bounty ready.', link: 'https://ssocietyhacking.lovable.app/', badge: 'LIVE' },
                  ]
                },
                {
                  cat: '✨ Lifestyle', color: 'from-violet-500 to-purple-600', count: 6,
                  projects: [
                    { name: 'LifeOS AI — Sistemul Tău de Operare Personal', desc: 'Gestionează obiective, finanțe, sănătate, rutine și productivitate. Goal tracking, finance manager, health dashboard, AI journal.', link: 'https://ssocietylifeos.lovable.app/', badge: 'LIVE' },
                    { name: 'SSociety VIEW — Earth Intelligence Platform', desc: 'Monitorizare globală Pământ în timp real: straturi satelitare NASA, detectare incendii, tracking aeronave, monitorizare seismică.', link: 'https://ssociety-view.lovable.app/', badge: 'LIVE' },
                    { name: 'Velvet & Rose — Wellness & Beauty', desc: 'Platformă wellness și self-care: rutine îngrijire piele personalizate AI, meditații ghidate, exerciții relaxare, jurnal bunăstare.', link: 'https://mrdelivery.ro', badge: 'LIVE' },
                    { name: 'Heart Echo — Mesaje de Suflet', desc: 'Generator AI mesaje emoționale personalizate pentru orice ocazie: partener, părinte, prieten. Unic, sincer, emoționant.', link: 'https://mrdelivery.ro', badge: 'LIVE' },
                    { name: 'Anchor — Guardian al Relațiilor', desc: 'AI relațional: amintește aniversări, sugerează activități quality time, sfaturi comunicare, te ajută să fii prezent cu cei dragi.', link: 'https://mrdelivery.ro', badge: 'LIVE' },
                    { name: 'LifeKit — Kit pentru o Viață Mai Bună', desc: 'Instrumente AI dezvoltare personală: tracker obiceiuri, jurnal recunoștință, obiective, meditații, nutriție, coach AI personal.', link: 'https://mrdelivery.ro', badge: 'LIVE' },
                  ]
                },
              ].map((category, ci) => (
                <div key={ci} className="mb-12">
                  <div className={"inline-flex items-center gap-2 bg-gradient-to-r " + category.color + " text-white px-4 py-2 rounded-full font-black text-sm mb-6"}>
                    {category.cat} <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs">{category.count}</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {category.projects.map((project, pi) => (
                      <a key={pi} href={project.link} target="_blank" rel="noopener noreferrer" className="block bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-xl hover:border-indigo-300 transition-all no-underline group">
                        <div className="flex items-start justify-between mb-3">
                          <span className={"text-xs font-black px-2 py-1 rounded-full " + (project.badge === 'LIVE' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700')}>{project.badge}</span>
                          <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-600 transition-all" />
                        </div>
                        <h3 className="font-black text-slate-900 mb-2 text-sm leading-tight">{project.name}</h3>
                        <p className="text-xs text-slate-600 leading-relaxed">{project.desc}</p>
                      </a>
                    ))}
                  </div>
                </div>
              ))}

              {/* CTA Final */}
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-8 md:p-12 text-white text-center mt-8">
                <h3 className="text-3xl font-black mb-4">Ai o idee de proiect?</h3>
                <p className="text-white/80 mb-6 text-lg">Construim împreună. Scrie-i lui Sergiu pe WhatsApp și visele devin realitate.</p>
                <a href="https://wa.me/40768676141" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-white text-indigo-600 px-8 py-4 rounded-full font-black text-lg hover:bg-indigo-50 transition-all no-underline">
                  💬 Scrie pe WhatsApp
                </a>
              </div>
            </div>
          </div>
        )}
      </header>

      <main className="w-full">
        {/* Hero Section - FULL SCREEN */}
        <section className="min-h-screen flex flex-col items-center justify-center text-center snap-start px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-5xl mx-auto"
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 text-indigo-700 text-sm font-semibold mb-6 border border-indigo-100">
              <Rocket className="w-4 h-4" /> Călătoria succesului tău este motivația noastră!
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 mb-8 tracking-tight leading-tight">
              {t.hero_title1} <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">să nu mai simți că muncești o zi din viață!</span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto mb-12 leading-relaxed font-medium">
              99 de meserii în pericol de automatizare. 99 de planuri de business construite pe experiența ta. O singură misiune — să nu pierzi nimic din ce contează cu adevărat.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button 
                onClick={() => pivotRef.current?.scrollIntoView({ behavior: 'smooth' })}
                className="w-full sm:w-auto bg-indigo-600 text-white px-10 py-5 rounded-full text-xl font-black hover:bg-indigo-700 transition-all shadow-2xl shadow-indigo-200 flex items-center justify-center gap-3"
              >
                {t.hero_cta} <ArrowRight className="w-6 h-6" />
              </button>
              <button 
                onClick={() => methodologyRef.current?.scrollIntoView({ behavior: 'smooth' })}
                className="w-full sm:w-auto bg-white text-slate-900 border-2 border-slate-200 px-10 py-5 rounded-full text-xl font-black hover:border-indigo-600 hover:text-indigo-600 transition-all flex items-center justify-center gap-3"
              >
                Vezi cum funcționează
              </button>
            </div>

            <motion.div 
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="mt-20 flex flex-col items-center gap-2 text-slate-400"
            >
              <span className="text-xs font-bold uppercase tracking-widest">Scroll pentru a explora</span>
              <div className="w-px h-12 bg-gradient-to-b from-indigo-600 to-transparent" />
            </motion.div>
          </motion.div>
        </section>

        <section ref={pivotRef} className="min-h-screen w-full bg-slate-50 snap-start relative overflow-hidden py-24 px-4">
          {!selectedJob ? (
            <div className="max-w-7xl mx-auto flex flex-col h-full">
              <div className="text-center mb-12">
                <h2 className="text-4xl md:text-6xl font-black mb-6 flex items-center justify-center gap-4 text-slate-900">
                  <svg className="w-10 h-10 md:w-12 md:h-12" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16 36 Q14 44 24 44 Q34 44 32 36 Z" fill="#c2714f"/><path d="M14 34 Q14 36 24 36 Q34 36 34 34 L32 28 Q28 30 24 30 Q20 30 16 28 Z" fill="#d4845e"/><ellipse cx="24" cy="28" rx="10" ry="3" fill="#5C4033"/><path d="M24 28 Q24 20 24 16" stroke="#4CAF50" strokeWidth="2" strokeLinecap="round"/><path d="M24 22 Q18 20 16 14 Q22 14 24 22Z" fill="#66BB6A"/><path d="M24 19 Q30 17 32 11 Q26 11 24 19Z" fill="#4CAF50"/><path d="M24 25 Q17 24 15 18 Q21 17 24 25Z" fill="#81C784"/><path d="M36 8 Q40 8 40 12 L40 18 Q40 20 38 20 L34 20 Q32 20 32 18 L32 12 Q32 8 36 8Z" fill="#64B5F6"/><path d="M32 14 L26 16" stroke="#64B5F6" strokeWidth="2" strokeLinecap="round"/><circle cx="35" cy="25" r="1" fill="#90CAF9"/><circle cx="37" cy="24" r="1" fill="#90CAF9"/><circle cx="39" cy="25" r="1" fill="#90CAF9"/></svg>
                  Index Automatizare
                </h2>
                <p className="text-xl text-slate-600 font-medium max-w-2xl mx-auto mb-8">
                  Caută profesia ta și descoperă cum poți transforma riscul de automatizare într-un avantaj competitiv imposibil de replicat.
                </p>
                <div className="relative max-w-2xl mx-auto">
                  <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 w-6 h-6" />
                  <input 
                    type="text" 
                    placeholder={t.search_placeholder}
                    className="w-full pl-16 pr-6 py-5 rounded-full border-2 border-slate-200 shadow-sm focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-xl font-medium"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="mt-6 text-slate-500 font-bold text-lg">{filteredJobs.length} meserii identificate</div>
              </div>

              <div className="flex-1 overflow-y-auto pb-20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <AnimatePresence mode="popLayout">
                    {filteredJobs.map((job) => (
                      <motion.button
                        key={job.id}
                        layout
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        onClick={() => handleJobSelect(job)}
                        className="w-full p-5 md:p-8 rounded-2xl md:rounded-[2rem] border-2 border-slate-200 bg-white hover:border-indigo-300 hover:shadow-xl text-left transition-all group flex flex-col h-full"
                      >
                        <div className="flex justify-between items-start mb-6">
                          <span className="text-sm font-black uppercase tracking-widest text-slate-400 group-hover:text-indigo-500 transition-colors">
                            {job.category}
                          </span>
                          <div className="flex items-center gap-1 text-amber-600 font-black text-xl bg-amber-50 px-3 py-1 rounded-full">
                            <TrendingUp className="w-5 h-5" />
                            {job.automationRisk}%
                          </div>
                        </div>
                        <h3 className="text-2xl font-black text-slate-800 mb-4 group-hover:text-indigo-700 transition-colors leading-tight">
                          {job.title}
                        </h3>
                        <p className="text-slate-500 font-medium mb-6 flex-1">
                          Descoperă cum poți transforma experiența ta de {job.title.toLowerCase()} într-un business profitabil în era AI.
                        </p>
                        <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden shadow-inner mb-6">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${job.automationRisk}%` }}
                            className={`h-full shadow-sm ${job.automationRisk > 80 ? 'bg-gradient-to-r from-rose-500 to-pink-500' : 'bg-gradient-to-r from-amber-500 to-orange-500'}`}
                          />
                        </div>
                        <div className="border-t border-slate-100 pt-4 mb-2">
                          <RadarChart job={job} />
                        </div>
                        <div className="text-xs text-slate-400 flex justify-between px-1 mb-3">
                          <span>Structură</span><span>Logică</span><span>Senzorial</span><span>Social</span><span>Creativitate</span>
                        </div>
                        <div className="text-sm text-slate-600 font-bold flex items-center gap-2 border-t border-slate-100 pt-4">
                          <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                          5 idei de business incluse
                        </div>
                      </motion.button>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          ) : (
            <div className="fixed inset-0 z-50 md:relative md:inset-auto max-w-5xl mx-auto bg-white md:rounded-[3rem] shadow-2xl md:border border-slate-200 overflow-hidden flex flex-col h-[100dvh] md:h-[90vh]">
              {/* Header with Back Button */}
              <div className="p-4 md:p-6 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-20 shadow-sm">
                <button 
                  onClick={() => { setSelectedJob(null); setPivotData(null); }}
                  className="flex items-center gap-2 text-indigo-600 font-black px-4 py-2 md:px-6 md:py-3 bg-indigo-50 hover:bg-indigo-100 transition-colors rounded-full"
                >
                  <ArrowLeft className="w-5 h-5" /> <span className="hidden sm:inline">Înapoi la Index</span>
                </button>
                <div className="font-black text-slate-900 text-lg md:text-xl text-right">{selectedJob.title}</div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 md:p-12 relative">
                {isGenerating ? (
                  <div className="max-w-4xl mx-auto pb-32 w-full animate-pulse">
                    <div className="flex items-center justify-between mb-12">
                      <div className="p-6 bg-indigo-50 rounded-3xl border-2 border-indigo-100 w-full md:w-2/3">
                        <div className="h-4 bg-indigo-200 rounded w-1/4 mb-4"></div>
                        <div className="h-8 bg-indigo-200 rounded w-3/4"></div>
                      </div>
                    </div>
                    
                    <div className="space-y-6 mb-16">
                      <div className="h-10 bg-slate-200 rounded w-1/3 mb-8"></div>
                      <div className="h-4 bg-slate-200 rounded w-full"></div>
                      <div className="h-4 bg-slate-200 rounded w-full"></div>
                      <div className="h-4 bg-slate-200 rounded w-5/6"></div>
                      <div className="h-4 bg-slate-200 rounded w-full mt-8"></div>
                      <div className="h-4 bg-slate-200 rounded w-4/5"></div>
                      <div className="h-4 bg-slate-200 rounded w-full"></div>
                    </div>

                    <div className="w-full h-24 bg-indigo-100 rounded-[2.5rem]"></div>
                    
                    {/* Progress indicator overlay */}
                    <div className="fixed bottom-10 left-1/2 transform -translate-x-1/2 bg-white px-8 py-4 rounded-full shadow-2xl border border-indigo-100 flex items-center gap-4 z-50 w-[90%] md:w-auto justify-center">
                      <RefreshCcw className="w-6 h-6 text-indigo-600 animate-spin" />
                      <span className="font-bold text-indigo-900 truncate">Generăm strategia pentru {selectedJob.title}...</span>
                    </div>
                  </div>
                ) : !pivotData ? (
                  <div className="max-w-3xl mx-auto pb-32">
                    <div className="flex items-center justify-between mb-12">
                      <div className="p-6 bg-indigo-50 rounded-3xl border-2 border-indigo-100 inline-block">
                        <h4 className="text-indigo-900 font-black text-sm uppercase tracking-[0.2em] mb-2">Pasul 1: Context</h4>
                        <p className="text-indigo-700 text-2xl font-black m-0">Personalizează strategia pentru {selectedJob.title}</p>
                      </div>
                    </div>
                    
                    <div className="bg-white border-2 border-slate-100 rounded-3xl p-8 shadow-sm space-y-6">
                      <div>
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-0 mb-3">
                          <label className="block text-lg font-bold text-slate-900">
                            1. {getJobQuestions(selectedJob)[0]}
                          </label>
                          <button
                            onClick={() => generateLuckyAnswer('q1', getJobQuestions(selectedJob)[0])}
                            disabled={luckyLoading.q1}
                            className="flex items-center justify-center gap-2 text-sm font-bold text-indigo-600 hover:text-indigo-800 transition-colors bg-indigo-50 px-4 py-2 rounded-full hover:bg-indigo-100 self-start sm:self-auto shrink-0"
                          >
                            {luckyLoading.q1 ? <RefreshCcw className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
                            I'm feeling lucky
                          </button>
                        </div>
                        <textarea
                          rows={3}
                          value={contextAnswers.q1}
                          onChange={(e) => setContextAnswers({...contextAnswers, q1: e.target.value})}
                          placeholder="Ex: Să analizez date, să vorbesc cu clienții, să creez strategii..."
                          className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-lg transition-all resize-none"
                        />
                      </div>
                      <div>
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-0 mb-3">
                          <label className="block text-lg font-bold text-slate-900">
                            2. {getJobQuestions(selectedJob)[1]}
                          </label>
                          <button
                            onClick={() => generateLuckyAnswer('q2', getJobQuestions(selectedJob)[1])}
                            disabled={luckyLoading.q2}
                            className="flex items-center justify-center gap-2 text-sm font-bold text-indigo-600 hover:text-indigo-800 transition-colors bg-indigo-50 px-4 py-2 rounded-full hover:bg-indigo-100 self-start sm:self-auto shrink-0"
                          >
                            {luckyLoading.q2 ? <RefreshCcw className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
                            I'm feeling lucky
                          </button>
                        </div>
                        <textarea
                          rows={3}
                          value={contextAnswers.q2}
                          onChange={(e) => setContextAnswers({...contextAnswers, q2: e.target.value})}
                          placeholder="Ex: Antreprenori, corporații, echipe mici, studenți..."
                          className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-lg transition-all resize-none"
                        />
                      </div>
                      <div>
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-0 mb-3">
                          <label className="block text-lg font-bold text-slate-900">
                            3. {getJobQuestions(selectedJob)[2]}
                          </label>
                          <button
                            onClick={() => generateLuckyAnswer('q3', getJobQuestions(selectedJob)[2])}
                            disabled={luckyLoading.q3}
                            className="flex items-center justify-center gap-2 text-sm font-bold text-indigo-600 hover:text-indigo-800 transition-colors bg-indigo-50 px-4 py-2 rounded-full hover:bg-indigo-100 self-start sm:self-auto shrink-0"
                          >
                            {luckyLoading.q3 ? <RefreshCcw className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
                            I'm feeling lucky
                          </button>
                        </div>
                        <textarea
                          rows={3}
                          value={contextAnswers.q3}
                          onChange={(e) => setContextAnswers({...contextAnswers, q3: e.target.value})}
                          placeholder="Ex: 10 ore/săptămână, vreau un venit suplimentar stabil..."
                          className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-lg transition-all resize-none"
                        />
                      </div>
                      <div className="mt-8 flex justify-end">
                        <button
                          onClick={() => generatePivotStrategy(selectedJob, contextAnswers)}
                          className="bg-gradient-to-r from-[#B8860B] to-[#D4A017] text-white px-8 py-4 rounded-full text-xl font-black hover:bg-indigo-700 transition-all shadow-lg hover:shadow-xl flex items-center gap-3"
                        >
                          Generează Strategia <ArrowRight className="w-6 h-6" />
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-4xl mx-auto pb-32"
                  >
                    <div className="flex items-center justify-between mb-12">
                      <div className="p-6 bg-indigo-50 rounded-3xl border-2 border-indigo-100 inline-block">
                        <h4 className="text-indigo-900 font-black text-sm uppercase tracking-[0.2em] mb-2">Context Actual</h4>
                        <p className="text-indigo-700 text-2xl font-black m-0">Ești un {selectedJob.title}. Iată cum devii de neînlocuit:</p>
                      </div>
                    </div>
                    
                    <div className="prose prose-base md:prose-lg prose-indigo max-w-none mb-16">
                      <div className="markdown-body">
                        
                        
                        <Markdown>{pivotData?.pivotStrategy}</Markdown>

                        {pivotData?.monetizationProjects?.length > 0 && (
                          <div className="mt-16">
                            <h3 className="text-3xl font-black text-slate-900 mb-8">🗺️ Pipeline Complet de Business</h3>
                            <div className="relative">
                              {pivotData.monetizationProjects.map((project, idx) => {
                                const colors = ['from-red-500 to-orange-500','from-blue-600 to-indigo-600','from-emerald-500 to-teal-500','from-purple-600 to-pink-600','from-amber-500 to-yellow-500'];
                                const color = colors[idx % colors.length];
                                const icons = ['🎬','💰','🎓','📱','🏢'];
                                return (
                                  <div key={idx} className="flex gap-4 mb-6 relative">
                                    {idx < pivotData.monetizationProjects.length - 1 && (
                                      <div className="absolute left-6 top-14 w-0.5 h-full bg-slate-200 z-0" />
                                    )}
                                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-r ${color} flex items-center justify-center text-white font-black text-lg flex-shrink-0 z-10 shadow-lg`}>
                                      {icons[idx]}
                                    </div>
                                    <div className="bg-white rounded-2xl border border-slate-200 p-5 flex-1 shadow-md">
                                      <div className="flex items-center justify-between mb-2">
                                        <span className="text-xs font-bold text-slate-500">PIPELINE {idx+1}</span>
                                        <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full font-bold">{project.projectType}</span>
                                      </div>
                                      <h4 className="text-lg font-black text-slate-900 mb-1">{project.title}</h4>
                                      <p className="text-slate-600 text-sm mb-3">{project.description?.slice(0,150)}...</p>
                                      <div className="flex flex-wrap gap-2 mb-3">
                                        <span className="bg-slate-50 text-slate-700 px-3 py-1 rounded-full text-xs font-semibold">📍 {project.platform}</span>
                                        <span className="bg-slate-50 text-slate-700 px-3 py-1 rounded-full text-xs font-semibold">💳 {project.monetizationMethod}</span>
                                        {project.revenue90 && <span className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold">📈 {project.revenue90} / 90 zile</span>}
                                      </div>
                                      <div className="grid grid-cols-2 gap-2 mt-2">
                                        <div className="bg-slate-50 rounded-xl p-3">
                                          <p className="text-xs text-slate-500 font-bold">Marketing</p>
                                          <p className="text-sm font-semibold text-slate-700">{project.marketingStrategy}</p>
                                        </div>
                                        <div className="bg-slate-50 rounded-xl p-3">
                                          <p className="text-xs text-slate-500 font-bold">Inovație</p>
                                          <p className="text-sm font-semibold text-slate-700">{project.innovation}</p>
                                        </div>
                                      </div>
                                      <div className="mt-3">
                                        <button
                                          onClick={() => generateTools(project, idx)}
                                          disabled={generatingTools === idx}
                                          className="w-full bg-indigo-600 text-white py-2 rounded-xl text-sm font-black hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 mb-2"
                                        >
                                          {generatingTools === idx ? <RefreshCcw className="w-3 h-3 animate-spin" /> : <Cpu className="w-3 h-3" />}
                                          {generatingTools === idx ? 'Se generează toolurile...' : 'Generează Tooluri AI'}
                                        </button>
                                        {projectTools[idx] && (
                                          <div className="space-y-2">
                                            {projectTools[idx].map((cat: any, ci: number) => (
                                              <div key={ci} className="bg-slate-50 rounded-xl p-3">
                                                <p className="text-xs font-black text-slate-700 mb-1">📦 {cat.category}</p>
                                                <div className="flex flex-wrap gap-1">
                                                  {cat.tools.map((tool: string, ti: number) => (
                                                    <span key={ti} className="bg-indigo-50 text-indigo-700 px-2 py-1 rounded-lg text-xs font-bold">{tool}</span>
                                                  ))}
                                                </div>
                                                <p className="text-xs text-slate-500 mt-1">{cat.usage}</p>
                                              </div>
                                            ))}
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                          
                        {premiumProjection && (
                          <div className="mt-16 bg-slate-900 text-white rounded-[2rem] p-10 shadow-2xl">
                            <h3 className="text-3xl font-black mb-8">
                              Plan Premium — Proiecții Financiare
                            </h3>

                            <div className="grid md:grid-cols-3 gap-6 mb-8">
                              <div className="bg-white/10 rounded-2xl p-6">
                                <p className="text-sm">3 luni</p>
                                <p className="text-3xl font-black">€{premiumProjection.month3}</p>
                              </div>
                              <div className="bg-white/10 rounded-2xl p-6">
                                <p className="text-sm">6 luni</p>
                                <p className="text-3xl font-black">€{premiumProjection.month6}</p>
                              </div>
                              <div className="bg-white/10 rounded-2xl p-6">
                                <p className="text-sm">12 luni</p>
                                <p className="text-3xl font-black">€{premiumProjection.month12}</p>
                              </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                              <div>Cost start: €{premiumProjection.startupCost}</div>
                              <div>CAC: €{premiumProjection.cac}</div>
                              <div>LTV: €{premiumProjection.ltv}</div>
                              <div>ROAS: {premiumProjection.roas}x</div>
                            </div>

                            <div className="mt-8 space-y-3">
                              <p><strong>Canal recomandat:</strong> {premiumProjection.recommendedChannel}</p>
                              <p><strong>30 zile:</strong> {premiumProjection.roadmap30}</p>
                              <p><strong>60 zile:</strong> {premiumProjection.roadmap60}</p>
                              <p><strong>90 zile:</strong> {premiumProjection.roadmap90}</p>
                            </div>
                          </div>
                        )}


                      </div>
                    </div>

                    <button 
                      onClick={handleDownloadPlan}
                      className="w-full bg-indigo-600 text-white py-8 rounded-[2.5rem] font-black text-2xl flex items-center justify-center gap-4 hover:bg-indigo-700 transition-all shadow-2xl shadow-indigo-200 hover:scale-[1.02]"
                    >
                      Descarcă Planul Complet <Download className="w-8 h-8" />
                    </button>
                  </motion.div>
                )}
              </div>
            </div>
          )}
        </section>


        {/* PRICING SECTION */}
        <section ref={pricingRef} className="py-24 md:py-32 bg-slate-900 text-white snap-start px-4 relative overflow-hidden">
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="text-center mb-20">
              <h2 className="text-3xl md:text-6xl font-black mb-6">Investiția în Viitorul Tău</h2>
              <p className="text-xl text-indigo-300 font-medium max-w-3xl mx-auto">
                Totul este gratuit până în momentul în care decizi să lansezi un proiect. Fără taxe ascunse, fără surprize.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
              {/* Pachet 1 */}
              <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl md:rounded-[2.5rem] p-5 md:p-8 flex flex-col hover:bg-white/10 transition-colors">
                <h3 className="text-xl md:text-2xl font-black mb-2">Lansare Proiect</h3>
                <p className="text-slate-400 mb-6 flex-1">Singura și unica taxă pentru a lansa un proiect real.</p>
                <div className="mb-8">
                  <span className="text-5xl font-black">$9</span>
                  <span className="text-slate-400">/lună</span>
                </div>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                    <span className="text-sm text-slate-300">1 Proiect activ</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                    <span className="text-sm text-slate-300">Vrei 2 proiecte? Plătești $9/lună per proiect.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                    <span className="text-sm text-slate-300">Agent Openclaw.ai inclus pentru execuție</span>
                  </li>
                </ul>
                <button className="w-full py-4 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold transition-colors mt-auto">Alege Pachetul</button>
              </div>

              {/* Pachet 2 */}
              <div className="bg-indigo-600 rounded-2xl md:rounded-[2.5rem] p-5 md:p-8 flex flex-col relative transform md:-translate-y-4 shadow-2xl shadow-indigo-900/50">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-amber-400 text-amber-950 text-xs font-black px-4 py-1 rounded-full uppercase tracking-widest">Recomandat</div>
                <h3 className="text-xl md:text-2xl font-black mb-2 text-white">Academy DaRomania</h3>
                <p className="text-indigo-200 mb-6 flex-1">Acces complet la rețeaua de succes.</p>
                <div className="mb-8">
                  <span className="text-5xl font-black text-white">$19</span>
                  <span className="text-indigo-200">/lună</span>
                </div>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-indigo-300 shrink-0 mt-0.5" />
                    <span className="text-sm text-white">Tot ce include pachetul de $9</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-indigo-300 shrink-0 mt-0.5" />
                    <span className="text-sm text-white">Acces în Academy DaRomania</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-indigo-300 shrink-0 mt-0.5" />
                    <span className="text-sm text-white">Vezi proiectele și succesul monetizat al rețelei</span>
                  </li>
                </ul>
                <button className="w-full py-4 rounded-full bg-white text-indigo-600 hover:bg-indigo-50 font-black transition-colors mt-auto">Alege Pachetul</button>
              </div>

              {/* Pachet 3 */}
              <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl md:rounded-[2.5rem] p-5 md:p-8 flex flex-col hover:bg-white/10 transition-colors">
                <h3 className="text-xl md:text-2xl font-black mb-2">Mentor 1:1</h3>
                <p className="text-slate-400 mb-6 flex-1">Îndrumare directă de la experți.</p>
                <div className="mb-8">
                  <span className="text-5xl font-black">€99</span>
                  <span className="text-slate-400">/lună</span>
                </div>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                    <span className="text-sm text-slate-300">Tot ce include pachetul Academy</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                    <span className="text-sm text-slate-300">1 ședință/săptămână de 2 ore</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                    <span className="text-sm text-slate-300">Sesiuni cu un colaborator din academie</span>
                  </li>
                </ul>
                <button className="w-full py-4 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold transition-colors mt-auto">Alege Pachetul</button>
              </div>

              {/* Pachet 4 */}
              <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl md:rounded-[2.5rem] p-5 md:p-8 flex flex-col hover:bg-white/10 transition-colors">
                <h3 className="text-xl md:text-2xl font-black mb-2">Sergiu Live 1:1</h3>
                <p className="text-slate-400 mb-6 flex-1">Experiența supremă de mentorat.</p>
                <div className="mb-8">
                  <span className="text-5xl font-black">€899</span>
                  <span className="text-slate-400">/lună</span>
                </div>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                    <span className="text-sm text-slate-300">Tot ce include pachetul Academy</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                    <span className="text-sm text-slate-300">1 ședință/săptămână de 2 ore</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                    <span className="text-sm text-slate-300">Sesiuni 1:1 direct cu Sergiu</span>
                  </li>
                </ul>
                <button className="w-full py-4 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold transition-colors mt-auto">Alege Pachetul</button>
              </div>
            </div>

            <div className="mt-16 bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl p-8 text-center max-w-4xl mx-auto">
              <div className="flex items-center justify-center gap-4 mb-4">
                <Bot className="w-8 h-8 text-indigo-400" />
                <h3 className="text-2xl font-black">Agent Openclaw.ai Inclus</h3>
              </div>
              <p className="text-slate-300 text-lg">
                Pentru orice proiect lansat, se creează automat un Agent (Openclaw.ai) care duce proiectul la cap. Tu doar îl urmărești cum îți execută viziunea!
              </p>
            </div>
          </div>
        </section>

        {/* Chat Agent Floating Button */}
        {!isChatOpen && selectedJob && (
          <button
            onClick={() => setIsChatOpen(true)}
            className="fixed bottom-4 right-4 md:bottom-8 md:right-8 bg-indigo-600 text-white p-3 md:p-4 rounded-full shadow-2xl hover:bg-indigo-700 hover:scale-110 transition-all z-40 flex items-center gap-3"
          >
            <div className="relative">
              <Brain className="w-6 h-6" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 border-2 border-indigo-600 rounded-full"></span>
            </div>
            <span className="font-bold pr-2 hidden md:inline">Agent Monetizare</span>
          </button>
        )}

        {/* Chat Agent Window */}
        {isChatOpen && selectedJob && (
          <ChatAgent job={selectedJob} onClose={() => setIsChatOpen(false)} />
        )}

        {/* Platform Chatbot */}
        <PlatformChatbot />

        {/* AI Dividend Section - FULL SCREEN */}
        <section ref={dividendRef} className="min-h-screen w-full bg-indigo-600 flex items-center justify-center snap-start py-20 px-4 md:px-12">
          <div className="max-w-7xl mx-auto w-full flex flex-col lg:flex-row items-center gap-16">
            <div className="flex-1 text-white">
              <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white/10 border border-white/20 backdrop-blur-md mb-8">
                <Coins className="w-6 h-6 text-yellow-300" />
                <span className="text-xl font-bold tracking-widest uppercase text-yellow-300">Fondul de Tranziție</span>
              </div>
              <h2 className="text-5xl md:text-8xl font-black mb-8 leading-tight">
                AI Dividend <br/>Program
              </h2>
              <p className="text-2xl md:text-4xl text-indigo-100 mb-12 leading-relaxed font-medium">
                Companiile care automatizează roluri umane contribuie la un fond de tranziție global. 
                <span className="text-white font-black block mt-4">Verifică dacă ești eligibil pentru grantul tău de tranziție.</span>
              </p>
              
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <button 
                  onClick={() => setActiveModal('eligibility')}
                  className="w-full sm:w-auto bg-yellow-400 text-slate-900 px-12 py-6 rounded-full text-2xl font-black hover:bg-yellow-300 transition-all shadow-[0_0_40px_rgba(250,204,21,0.4)] hover:scale-105"
                >
                  Verifică Eligibilitatea
                </button>
                <div className="flex items-center gap-4 px-8 py-6 rounded-full bg-black/20 backdrop-blur-md border border-white/10">
                  <div className="w-4 h-4 bg-green-400 rounded-full animate-pulse shadow-[0_0_15px_rgba(74,222,128,0.8)]" />
                  <span className="text-xl font-bold text-white">12.4k Granturi acordate luna aceasta</span>
                </div>
              </div>
            </div>
            <div className="hidden lg:flex flex-1 justify-center relative">
              <div className="absolute inset-0 bg-yellow-400/20 blur-[100px] rounded-full" />
              <Coins className="w-96 h-96 text-yellow-400 relative z-10 drop-shadow-2xl" />
            </div>
          </div>
        </section>

        {/* Monetization Projects Section - FULL SCREEN VERTICAL STACK */}
        <AnimatePresence>
          {pivotData && pivotData.monetizationProjects.length > 0 && (
            <div ref={projectsRef}>
              <section className="min-h-screen w-full flex flex-col items-center justify-center snap-start bg-slate-50 px-4">
                <div className="max-w-7xl mx-auto text-center">
                  <h2 className="text-5xl md:text-7xl font-black mb-6 tracking-tight text-slate-900">5 Proiecte de Monetizare Premium</h2>
                  <p className="text-slate-600 text-2xl max-w-3xl mx-auto">Idei inovatoare pentru a-ți transforma expertiza în fluxuri de venit sustenabile.</p>
                  <motion.div 
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="mt-16 flex flex-col items-center gap-2 text-slate-400"
                  >
                    <span className="text-xs font-bold uppercase tracking-widest">Scroll pentru proiecte</span>
                    <div className="w-px h-12 bg-gradient-to-b from-indigo-600 to-transparent" />
                  </motion.div>
                </div>
              </section>

              <div className="space-y-0">
                {pivotData.monetizationProjects.map((project, idx) => {
                  return (
                  <motion.section
                    key={idx}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true, margin: "-100px" }}
                    className={`min-h-screen w-full flex items-center justify-center p-4 md:p-8 sticky top-0 snap-start bg-gradient-to-br ${COLORS[idx]}`}
                  >
                    <div className="max-w-6xl w-full max-h-[95vh] overflow-y-auto custom-scrollbar bg-white/10 backdrop-blur-3xl rounded-[2rem] md:rounded-[3rem] border border-white/20 p-4 md:p-12 shadow-2xl text-white">
                      <div className="flex flex-col lg:flex-row gap-6 lg:gap-10 items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 md:gap-6 mb-6 md:mb-8">
                            <div className="w-10 h-10 md:w-16 md:h-16 bg-white/20 rounded-xl md:rounded-2xl flex items-center justify-center shadow-inner flex-shrink-0">
                              {idx === 0 && <Youtube className="w-8 h-8" />}
                              {idx === 1 && <Linkedin className="w-8 h-8" />}
                              {idx === 2 && <Globe className="w-8 h-8" />}
                              {idx === 3 && <Rocket className="w-8 h-8" />}
                              {idx === 4 && <Lightbulb className="w-8 h-8" />}
                            </div>
                            <div>
                              <span className="text-xs font-black uppercase tracking-[0.3em] opacity-60 block mb-1">{project.platform}</span>
                              <h3 className="text-xl md:text-5xl font-black leading-tight tracking-tight">{project.title}</h3>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-3 md:gap-6 mb-6 md:mb-8">
                            <div className="bg-white/10 rounded-xl md:rounded-[2rem] p-3 md:p-6 border border-white/10 shadow-lg">
                              <h4 className="text-indigo-200 font-black text-[10px] uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                                <Briefcase className="w-4 h-4" /> Tip Proiect
                              </h4>
                              <p className="text-sm md:text-2xl font-black">{project.projectType}</p>
                            </div>
                            <div className="bg-white/10 rounded-xl md:rounded-[2rem] p-3 md:p-6 border border-white/10 shadow-lg">
                              <h4 className="text-emerald-200 font-black text-[10px] uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                                <Coins className="w-4 h-4" /> Metodă Monetizare
                              </h4>
                              <p className="text-sm md:text-2xl font-black">{project.monetizationMethod}</p>
                            </div>
                          </div>

                          <p className="text-lg md:text-xl leading-relaxed font-medium opacity-95 mb-8 max-w-4xl">
                            {project.description}
                          </p>
                          
                          <div className="bg-white/5 rounded-[1.5rem] p-6 border border-white/10 max-w-4xl">
                            <h4 className="text-white/60 font-black text-xs uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                              <Rocket className="w-4 h-4" /> Platforme Premium — Academia DaRomania
                            </h4>
                            <div className="space-y-3">
                              {[
                                {
                                  icon: '🎬',
                                  name: 'SSociety Studio — Content Generator AI',
                                  desc: 'Generează script TTS, imagini sincronizate, audio, video, SEO complet, social media copy, email sequence și WhatsApp outreach. Gemini Pro & Veo Ready. Pipeline în 12 pași.',
                                  badge: 'CONTENT AI',
                                  link: 'https://ssociety-image-generator-588412172690.us-west1.run.app/'
                                },
                                {
                                  icon: '📱',
                                  name: 'Wild Bot — Robot 300 Mesaje/zi',
                                  desc: 'Primul sistem de outreach WhatsApp nedetectabil. Mesaje 100% unice per contact, timpi umani aleatorii, zero ban. 2000+ mesaje per campanie, ~95% rată livrare.',
                                  badge: 'OUTREACH',
                                  link: 'https://wild-bot-rho.vercel.app/'
                                },
                                {
                                  icon: '🤖',
                                  name: 'SSociety Studio — 6 Agenți AI',
                                  desc: 'CEO, CMO, CRO, CTO, CSO, CFO — agenți AI specializați care lucrează 24/7 pe marketing, vânzări, CRM și conținut. 500+ utilizatori activi, 3x ROI mediu.',
                                  badge: 'AI AGENTS',
                                  link: 'https://ssocietystudio.lovable.app/'
                                },
                                {
                                  icon: '🧪',
                                  name: 'PromptLab — Laborator de Prompturi AI',
                                  desc: 'Creează, testează și optimizează prompturi AI cu A/B Testing, Marketplace și Analytics. Compatibil GPT-4, Gemini, DeepSeek, Mistral.',
                                  badge: 'PROMPTS',
                                  link: 'https://ssocietypromptlab.lovable.app/'
                                },
                                {
                                  icon: '⚡',
                                  name: 'AI Content Factory — 10 Pași, Un Click',
                                  desc: 'De la idee la publicat pe toate platformele în 15 minute. Script AI → Audio TTS → Video Kie.ai → SEO → Social → Auto-Publish → Analytics.',
                                  badge: 'FACTORY',
                                  link: 'https://ssocietyaistudio.lovable.app/'
                                },
                              ].map((tool, ti) => (
                                <a key={ti} href={tool.link} target="_blank" rel="noopener noreferrer" className="block bg-white/10 hover:bg-white/20 rounded-2xl p-4 transition-all border border-white/10 no-underline group">
                                  <div className="flex items-start gap-3">
                                    <span className="text-2xl flex-shrink-0">{tool.icon}</span>
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center gap-2 mb-1">
                                        <p className="text-sm font-black text-white">{tool.name}</p>
                                        <span className="text-[9px] font-black bg-white/20 text-white px-2 py-0.5 rounded-full flex-shrink-0">{tool.badge}</span>
                                      </div>
                                      <p className="text-xs text-white/60 leading-relaxed">{tool.desc}</p>
                                      <p className="text-xs text-white/40 mt-1 group-hover:text-white/60 transition-all">Accesează →</p>
                                    </div>
                                  </div>
                                </a>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="w-full lg:w-80 space-y-3 flex-shrink-0">
                          <div className="bg-black/20 rounded-[2rem] p-5 border border-white/10">
                            <p className="text-white/50 font-black text-[10px] uppercase tracking-widest mb-3">⚡ Arsenal Pipeline — 12 Pași</p>
                            <div className="space-y-2">
                              {getArsenalButtons(project).map((btn, step) => {
                                const done = !!(arsenalData[idx] && arsenalData[idx][step]);
                                const cur = arsenalStep[idx] || 0;
                                const isGen = generatingArsenal && generatingArsenal.idx === idx && generatingArsenal.step === step;
                                const locked = cur < step;
                                return (
                                  <div key={step}>
                                    <button onClick={() => { if (!locked && !isGen) generateArsenal(project, idx, step); }} disabled={locked || !!isGen} className={"w-full py-3 rounded-xl text-sm font-black transition-all flex items-center justify-center gap-2 " + (done ? "bg-white/30 text-white" : !locked ? "bg-white text-slate-900 shadow-lg" : "bg-white/10 text-white/40 cursor-not-allowed")}>
                                      {isGen ? <RefreshCcw className="w-4 h-4 animate-spin" /> : done ? <CheckCircle2 className="w-4 h-4" /> : null}
                                      {locked ? "🔒 " : ""}{btn.label}
                                    </button>
                                    {isGen && (<div className="mt-1"><div className="w-full bg-white/20 rounded-full h-1.5"><div className="h-1.5 rounded-full bg-white transition-all" style={{width: arsenalProgress + "%"}} /></div><p className="text-xs opacity-60 mt-1 text-center">{arsenalProgress}%</p></div>)}
                                    {done && (
                                      <div className="mt-1 bg-white/10 rounded-xl p-3 text-xs whitespace-pre-line max-h-60 overflow-y-auto">
                                        {step === 2 && arsenalData[idx][step]?.includes('URL imagine:') ? (
                                          <div className="grid grid-cols-1 gap-2">
                                            {arsenalData[idx][step].split('---').map((block, bi) => {
                                              const urlMatch = block.match(/URL imagine: (https?:\/\/\S+)/);
                                              const promptMatch = block.match(/Prompt folosit: (.+)/);
                                              return urlMatch ? (
                                                <div key={bi} className="rounded-lg overflow-hidden">
                                                  <img src={urlMatch[1]} alt={promptMatch?.[1] || 'imagine'} className="w-full rounded-lg" onError={e => { (e.target as HTMLImageElement).style.display='none'; }} />
                                                  <p className="text-white/60 text-xs mt-1">{promptMatch?.[1]?.slice(0,60)}...</p>
                                                </div>
                                              ) : null;
                                            })}
                                          </div>
                                        ) : (
                                          arsenalData[idx][step]
                                        )}
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                              {(arsenalStep[idx] || 0) >= 1 && (<button onClick={() => downloadArsenal(idx)} className="w-full mt-2 bg-white text-slate-900 py-3 rounded-xl font-black text-sm flex items-center justify-center gap-2"><Download className="w-4 h-4" /> Descarcă Arsenal</button>)}
                            </div>
                          </div>
                          <button 
                            onClick={() => setActiveModal('join')}
                            className="w-full bg-white text-slate-900 py-3 md:py-4 rounded-xl md:rounded-[1.5rem] text-sm md:text-lg font-black hover:bg-indigo-50 transition-all flex items-center justify-center gap-2 shadow-2xl shadow-black/20"
                          >
                            Lansează — $9 <ArrowRight className="w-5 h-5" />
                          </button>
                          <a href="https://ssocietyaistudio.lovable.app/" target="_blank" rel="noopener noreferrer" className="w-full bg-white/20 text-white py-4 rounded-[1.5rem] text-lg font-black hover:bg-white/30 transition-all flex items-center justify-center gap-2 shadow-xl mt-3 block text-center no-underline">
                            <Rocket className="w-5 h-5" /> Dezvoltă cu OpenClaw.ai
                          </a>
                          <a href={"https://wa.me/40768676141?text=" + encodeURIComponent("Vreau sa lansez: " + project.title)} target="_blank" rel="noopener noreferrer" className="w-full bg-green-500 text-white py-4 rounded-[1.5rem] text-lg font-black hover:bg-green-600 transition-all flex items-center justify-center gap-2 shadow-xl mt-3">💬 Discută direct cu Sergiu</a>
                          
                        </div>
                      </div>
                    </div>
                  </motion.section>
                  );
                })}
              </div>
            </div>
          )}
        </AnimatePresence>

        {/* Features Section - FULL SCREEN */}
        <section ref={missionRef} className="min-h-screen flex flex-col items-center justify-center snap-start py-20 px-4 sm:px-6 lg:px-8 relative">
          <div className="absolute top-0 left-0 right-0 h-px" style={{background:'linear-gradient(90deg,transparent,#D4A017,#E8B84B,#D4A017,transparent)'}} />
          <div className="max-w-7xl mx-auto w-full">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-6xl font-black mb-4 text-slate-900">Misiunea Noastră</h2>
              <div className="h-1 w-16 mx-auto rounded-full mb-4" style={{background:'linear-gradient(90deg,#B8860B,#E8B84B,#B8860B)'}} />
              <p className="text-[#5A5040] text-xl max-w-2xl mx-auto">Protejăm valoarea umană într-o lume dominată de algoritmi.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 w-full">
              <div className="p-6 md:p-12 rounded-2xl md:rounded-[3rem] bg-white border border-[#EDE5C8]/50 shadow-[0_4px_32px_rgba(180,134,11,0.08)] hover:shadow-[rgba(210,160,23,0.16)] hover:border-[#D4A017]/30 transition-all">
                <div className="w-16 h-16 bg-[#FDF8ED] rounded-2xl flex items-center justify-center mb-8 relative group cursor-help">
                  <ShieldCheck className="text-[#B8860B] w-8 h-8" />
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-64 p-3 bg-slate-900 text-white text-sm rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 shadow-xl z-10 text-center">
                    Verifică și validează deciziile AI pentru a asigura conformitatea etică, lipsa prejudecăților și alinierea cu valorile umane.
                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#1A1208]"></div>
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-4">Audit Etic AI</h3>
                <p className="text-slate-600 text-lg leading-relaxed">
                  Fostul tău job de corector sau editor devine acum un rol de Auditor Etic pentru conținutul generat de AI.
                </p>
              </div>
              <div className="p-6 md:p-12 rounded-2xl md:rounded-[3rem] bg-white border border-[#E0E0EC]/50 shadow-[0_4px_32px_rgba(140,140,180,0.08)] hover:shadow-[rgba(140,140,180,0.16)] hover:border-[#8A8A9E]/25 transition-all">
                <div className="w-16 h-16 bg-[#F3F3F9] rounded-2xl flex items-center justify-center mb-8 relative group cursor-help">
                  <Users className="text-[#8A8A9E] w-8 h-8" />
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-64 p-3 bg-slate-900 text-white text-sm rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 shadow-xl z-10 text-center">
                    Oferă nuanța emoțională și culturală pe care AI-ul nu o poate înțelege. Construiește relații bazate pe încredere și empatie.
                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#1A1208]"></div>
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-4">Consultanță Contextuală</h3>
                <p className="text-slate-600 text-lg leading-relaxed">
                  AI-ul știe datele, tu știi oamenii. Transformă-ți experiența în brokeraj sau vânzări în management de relații complexe.
                </p>
              </div>
              <div className="p-6 md:p-12 rounded-2xl md:rounded-[3rem] bg-white border border-[#EDE5C8]/50 shadow-[0_4px_32px_rgba(180,134,11,0.08)] hover:shadow-[rgba(210,160,23,0.16)] hover:border-[#D4A017]/30 transition-all">
                <div className="w-16 h-16 bg-[#FDF8ED] rounded-2xl flex items-center justify-center mb-8 relative group cursor-help">
                  <Cpu className="text-[#B8860B] w-8 h-8" />
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-64 p-3 bg-slate-900 text-white text-sm rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 shadow-xl z-10 text-center">
                    Coordonează și integrează multiple sisteme AI pentru a crea fluxuri de lucru complexe, maximizând eficiența și productivitatea.
                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#1A1208]"></div>
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-4">AI Orchestration</h3>
                <p className="text-slate-600 text-lg leading-relaxed">
                  Nu lupta cu AI-ul, dirijează-l. Învățăm profesioniștii cum să folosească 10 unelte AI pentru a face munca a 100 de oameni.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Modals */}
      <AnimatePresence>
        {activeModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveModal(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden"
            >
              <button 
                onClick={() => setActiveModal(null)}
                className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>

              {activeModal === 'join' && <JoinForm onClose={() => setActiveModal(null)} />}
              {activeModal === 'eligibility' && <EligibilityCheck onClose={() => setActiveModal(null)} />}
            </motion.div>
          </div>
        )}
      </AnimatePresence>


        {/* SECTIUNEA 1 — CUM FUNCTIONEAZA TRANSFORMAREA */}
        <section className="py-24 md:py-32 bg-white snap-start px-4 border-t border-slate-200">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-block bg-[#FEF8E7] text-[#8B6508] font-black text-sm px-4 py-1.5 rounded-full mb-4 border border-[#E8D5A3]">Metodologia DaRomânia</div>
              <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-4">Cum funcționează transformarea</h2>
              <p className="text-xl text-slate-500 max-w-2xl mx-auto">Nu îți schimbăm cariera. Îți amplificăm experiența cu AI ca motor de execuție.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="relative">
                <div className="bg-[#FEF8E7] border border-[#E8D5A3] rounded-3xl p-8 h-full">
                  <div className="text-5xl font-black text-[#C9A84C] mb-4">85%</div>
                  <h3 className="text-xl font-black text-slate-900 mb-3">Ce preia AI-ul</h3>
                  <p className="text-slate-600 leading-relaxed text-sm mb-4">Sarcinile repetitive, structurate și bazate pe reguli din jobul tău actual — emailuri standard, rapoarte, introducere date, programări, follow-up-uri automate.</p>
                  <div className="space-y-2">
                    {['Comunicare standardizată', 'Analiză date de rutină', 'Generare rapoarte', 'Programare întâlniri', 'Follow-up automat'].map((item, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-[#8B6508] bg-[#FEF3D0] rounded-full px-3 py-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#C9A84C] flex-shrink-0"></span>
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-indigo-600 rounded-full items-center justify-center text-white font-black text-lg">→</div>
              </div>

              <div className="relative">
                <div className="bg-green-50 border border-green-100 rounded-3xl p-8 h-full">
                  <div className="text-5xl font-black text-green-200 mb-4">15%</div>
                  <h3 className="text-xl font-black text-slate-900 mb-3">Ce rămâne ireductibil uman</h3>
                  <p className="text-slate-600 leading-relaxed text-sm mb-4">Judecata, empatia, relațiile, contextul și nuanța umană acumulată în ani de experiență reală în industrie. Exact aceea nu o poate replica nimeni.</p>
                  <div className="space-y-2">
                    {['Înțelegerea profundă a clientului', 'Negociere și relații', 'Gândire strategică', 'Adaptabilitate la context', 'Autoritate în domeniu'].map((item, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-green-700 bg-green-100 rounded-full px-3 py-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-400 flex-shrink-0"></span>
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-indigo-600 rounded-full items-center justify-center text-white font-black text-lg">→</div>
              </div>

              <div className="bg-indigo-600 rounded-3xl p-8 h-full text-white">
                <div className="text-5xl font-black text-indigo-400 mb-4">∞</div>
                <h3 className="text-xl font-black text-white mb-3">Business-ul tău la cheie</h3>
                <p className="text-indigo-200 leading-relaxed text-sm mb-4">Tu furnizezi expertiza și supervizezi 2h/zi. AI-ul execută celelalte 22h — generează conținut, trimite emailuri, postează, analizează, raportează.</p>
                <div className="space-y-2">
                  {['Venituri recurente lunare', 'Sistem care lucrează fără tine', 'Scalabil fără angajați', 'Cost real API-uri: $3–9/lună', 'Venit estimat: €2.000–€12.000/lună'].map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-indigo-100 bg-indigo-500 rounded-full px-3 py-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-300 flex-shrink-0"></span>
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTIUNEA 2 — PIPELINE-UL AUTOMAT */}
        <section className="py-24 md:py-32 bg-slate-900 snap-start px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-block bg-white/10 text-white font-black text-sm px-4 py-1.5 rounded-full mb-4">Arhitectura tehnică</div>
              <h2 className="text-4xl md:text-6xl font-black text-white mb-4">Pipeline-ul tău automat</h2>
              <p className="text-xl text-slate-400 max-w-2xl mx-auto">Un sistem ierarhic de agenți AI care lucrează 24/7 pentru afacerea ta. Tu ești directorul. Ei sunt echipa.</p>
            </div>

            <div className="flex flex-col items-center gap-4 mb-12">
              {/* Tu — Air Claw */}
              <div className="bg-indigo-600 rounded-2xl px-8 py-5 text-center text-white w-full max-w-sm">
                <div className="text-2xl font-black mb-1">🧠 Tu — Directorul Strategic</div>
                <div className="text-indigo-200 text-sm">Furnizezi expertiza · Supervizezi 2h/zi · Iei deciziile mari</div>
              </div>
              <div className="text-white text-2xl">↓</div>

              {/* Air Claw Agent */}
              <div className="bg-purple-700 rounded-2xl px-8 py-4 text-center text-white w-full max-w-sm">
                <div className="text-xl font-black mb-1">⚡ Agent Principal (Air Claw)</div>
                <div className="text-purple-200 text-sm">Orchestrează toți sub-agenții · Generează idei de business · Monitorizează performanța</div>
              </div>
              <div className="text-white text-2xl">↓</div>

              {/* Sub-agenti */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3 w-full">
                {[
                  { icon: '🔧', name: 'Agent CTO', desc: 'Monitorizează API-urile · Gestionează erori · Menține stabilitatea', color: 'bg-blue-800' },
                  { icon: '💰', name: 'Agent CFO', desc: 'Trackează costurile · Alertă buget · Optimizează cheltuieli', color: 'bg-green-800' },
                  { icon: '🔍', name: 'Agent SEO', desc: 'Research keywords · Optimizează conținut · Analizează competitori', color: 'bg-amber-800' },
                  { icon: '✍️', name: 'Content Creator', desc: 'Generează text · Imagini · Video · Scripturi TTS', color: 'bg-rose-800' },
                  { icon: '📱', name: 'Social Manager', desc: 'Postează pe 4 platforme · Programează · Monitorizează reach', color: 'bg-violet-800' },
                ].map((agent, i) => (
                  <div key={i} className={`${agent.color} rounded-xl p-4 text-center text-white`}>
                    <div className="text-2xl mb-2">{agent.icon}</div>
                    <div className="font-black text-sm mb-1">{agent.name}</div>
                    <div className="text-xs opacity-70 leading-tight">{agent.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Cost real lunar API-uri', val: '$3–9/lună' },
                { label: 'Emailuri automate/zi', val: '300' },
                { label: 'Platforme sociale', val: '4 simultan' },
                { label: 'Ore supervizare/zi', val: '~2h' },
              ].map((m, i) => (
                <div key={i} className="bg-white/5 rounded-xl p-4 text-center">
                  <div className="text-2xl font-black text-indigo-400 mb-1">{m.val}</div>
                  <div className="text-slate-400 text-xs">{m.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTIUNEA 3 — UNDE VINZI */}
        <section className="py-24 md:py-32 bg-white snap-start px-4 border-t border-slate-200">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-block bg-green-50 text-green-700 font-black text-sm px-4 py-1.5 rounded-full mb-4">Modele de monetizare</div>
              <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-4">Unde și cum vinzi</h2>
              <p className="text-xl text-slate-500 max-w-2xl mx-auto">Nu un singur canal. Un ecosistem de venituri care funcționează simultan.</p>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  icon: '🛍️',
                  title: 'Etsy — Produse Digitale',
                  desc: '95 milioane cumpărători activi. Zero costuri de livrare. Vânzare automată 24/7. Ghiduri PDF, template-uri, cursuri video, pachete de automatizare.',
                  stats: ['GMV 2024: $12 miliarde', '46% cumpărători internaționali', 'Cost marginal per vânzare: $0'],
                  color: 'border-orange-200 bg-orange-50',
                  badge: 'Recomandat pentru start',
                  badgeColor: 'bg-orange-100 text-orange-700',
                },
                {
                  icon: '🔄',
                  title: 'Subscripții — Venit Recurent',
                  desc: 'Cel mai stabil model de venituri. Comunitate premium, bibliotecă de resurse actualizate lunar, acces la tool-uri și template-uri exclusive.',
                  stats: ['Venit predictibil lunar', 'Churn rate mic dacă oferi valoare', 'Scalabil fără costuri extra'],
                  color: 'border-indigo-200 bg-indigo-50',
                  badge: 'Cel mai sustenabil',
                  badgeColor: 'bg-indigo-100 text-indigo-700',
                },
                {
                  icon: '🎯',
                  title: 'Servicii High-Ticket',
                  desc: 'Consultanță, coaching, audit digital, implementare la cheie. Prețuri €299–€2.999 per proiect. Clienți calificați atrași de conținutul tău automat.',
                  stats: ['Marjă 95%+', '1-3 clienți/lună = venit full', 'Leaduri generate automat de pipeline'],
                  color: 'border-purple-200 bg-purple-50',
                  badge: 'Venit maxim per client',
                  badgeColor: 'bg-purple-100 text-purple-700',
                },
                {
                  icon: '🤝',
                  title: 'Comisioane & Parteneriate',
                  desc: 'Recomanzi tool-uri, platforme și servicii pe care le folosești. Afiliați, parteneriate B2B, white-label pentru alte agenții.',
                  stats: ['Venit 100% pasiv', 'Fără muncă extra după setup', 'Acumulativ în timp'],
                  color: 'border-green-200 bg-green-50',
                  badge: 'Venit pasiv pur',
                  badgeColor: 'bg-green-100 text-green-700',
                },
              ].map((ch, i) => (
                <div key={i} className={`border-2 ${ch.color} rounded-3xl p-7`}>
                  <div className="flex items-start justify-between mb-4">
                    <span className="text-4xl">{ch.icon}</span>
                    <span className={`text-xs font-black px-3 py-1 rounded-full ${ch.badgeColor}`}>{ch.badge}</span>
                  </div>
                  <h3 className="text-xl font-black text-slate-900 mb-2">{ch.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed mb-4">{ch.desc}</p>
                  <div className="space-y-1">
                    {ch.stats.map((s, j) => (
                      <div key={j} className="flex items-center gap-2 text-xs text-slate-500">
                        <span className="text-green-500 font-black">✓</span> {s}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTIUNEA 4 — PLANUL IN 4 FAZE */}
        <section className="py-24 md:py-32 bg-[#FAFAF7] snap-start px-4 border-t border-[#EDE5C8]/40">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-block bg-amber-50 text-amber-700 font-black text-sm px-4 py-1.5 rounded-full mb-4">Roadmap concret</div>
              <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-4">Planul tău în 4 faze</h2>
              <p className="text-xl text-slate-500 max-w-2xl mx-auto">Nu construim totul dintr-o dată. Validăm pas cu pas, minimizăm riscul, maximizăm rezultatele.</p>
            </div>
            <div className="space-y-6">
              {[
                {
                  phase: '01',
                  period: 'Luna 1–2',
                  title: 'Validarea MVP',
                  desc: 'Un singur flux de la A la B. DeepSeek generează conținut → Amazon SES trimite emailuri → tu măsori costul real și calitatea. Obiectiv: primul feedback de la piață.',
                  actions: ['Alegi un singur job target și un singur canal', 'Configurezi DeepSeek API + Amazon SES', 'Trimiți primele 300 emailuri/zi automat', 'Măsori rata de deschidere și răspuns'],
                  color: 'bg-rose-600',
                  lightColor: 'bg-rose-50 border-rose-200',
                },
                {
                  phase: '02',
                  period: 'Luna 3',
                  title: 'Primele vânzări',
                  desc: 'Transformi rezultatele MVP într-un produs digital real. Îl listezi pe Etsy. Primești primele vânzări și feedback direct de la clienți plătitori.',
                  actions: ['Creezi primul produs digital (PDF, template, ghid)', 'Listezi pe Etsy cu SEO optimizat', 'Primele vânzări la €9–€49', 'Colectezi recenzii și ajustezi produsul'],
                  color: 'bg-amber-600',
                  lightColor: 'bg-amber-50 border-amber-200',
                },
                {
                  phase: '03',
                  period: 'Luna 4',
                  title: 'Distribuție multiplă',
                  desc: 'Adaugi Social Media Manager în pipeline. Postezi automat pe LinkedIn, Instagram, TikTok, YouTube. Traficul organic crește și leadurile vin automat.',
                  actions: ['Configurezi Telegram Bot + Buffer pentru postare automată', 'KIE.ai generează imagini pentru fiecare post', 'Pipeline complet: conținut → postare → leaduri → email', 'Primii 10 clienți recurenți'],
                  color: 'bg-indigo-600',
                  lightColor: 'bg-indigo-50 border-indigo-200',
                },
                {
                  phase: '04',
                  period: 'Luna 5+',
                  title: 'Scale & Optimizare',
                  desc: 'Multiplici produsele, canalele și tipurile de conținut. Agent CFO monitorizează costurile. Bugetul crește odată cu veniturile. Obiectiv: €5.000+/lună recurent.',
                  actions: ['Adaugi subscripție lunară comunitate premium', 'Lansezi servicii high-ticket €299–€999', 'Automatizezi 90% din operațiuni', 'Construiești portofoliu de venituri multiple'],
                  color: 'bg-green-600',
                  lightColor: 'bg-green-50 border-green-200',
                },
              ].map((phase, i) => (
                <div key={i} className={`border-2 ${phase.lightColor} rounded-2xl md:rounded-3xl p-4 md:p-7 flex gap-3 md:gap-6`}>
                  <div className={`${phase.color} text-white rounded-xl md:rounded-2xl w-12 h-12 md:w-16 md:h-16 flex items-center justify-center font-black text-base md:text-xl flex-shrink-0`}>
                    {phase.phase}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <h3 className="text-xl font-black text-slate-900">{phase.title}</h3>
                      <span className="text-xs font-black text-slate-400 bg-slate-100 px-3 py-1 rounded-full">{phase.period}</span>
                    </div>
                    <p className="text-slate-600 text-sm leading-relaxed mb-4">{phase.desc}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {phase.actions.map((action, j) => (
                        <div key={j} className="flex items-start gap-2 text-sm text-slate-700">
                          <span className="text-green-500 font-black mt-0.5 flex-shrink-0">→</span>
                          {action}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 bg-indigo-600 rounded-3xl p-8 text-center text-white">
              <h3 className="text-2xl font-black mb-2">Gata să începi?</h3>
              <p className="text-indigo-200 mb-6">Găsește-ți meseria în indexul nostru și primești planul complet în 60 de secunde.</p>
              <button onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}
                className="bg-white text-indigo-700 font-black px-8 py-3 rounded-xl hover:bg-indigo-50 transition-all">
                Găsește-ți meseria acum →
              </button>
            </div>
          </div>
        </section>

        {/* ABOUT / MISIUNEA NOASTRĂ */}
        <section ref={missionRef} className="py-24 md:py-32 bg-[#FAFAF7] snap-start px-4 border-t border-[#EDE5C8]/40 relative">
          <div className="absolute top-0 left-0 right-0 h-px" style={{background:'linear-gradient(90deg,transparent,#D4A017,#E8B84B,#D4A017,transparent)'}} />
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-6xl font-black mb-12 text-slate-900">De ce există DaRomânia</h2>
            <div className="prose prose-lg md:prose-xl mx-auto text-slate-600 text-left font-medium leading-relaxed">
              <p>Nu am construit DaRomânia pentru că avem soluții la toate problemele. Am construit-o pentru că am văzut o problemă pe care nimeni nu o rezolva corect.</p>
              <p>Mii de oameni cu 10, 15, 20 de ani de experiență într-un domeniu primesc în fiecare zi notificarea pe care nu o doresc. Disponibilizare. Restructurare. Automatizare. Și primul instinct — perfect uman — este să caute alt job similar. Care va fi automatizat în 18 luni.</p>
              
              <div className="my-12 p-8 bg-[#FEF8E7] rounded-3xl border border-[#E8D5A3] text-center">
                <p className="font-black text-[#B8860B] text-xl md:text-3xl m-0">DaRomânia sparge acest cerc.</p>
              </div>
              
              <p>Nu îți cerem să devii altcineva. Nu îți spunem că ce ai făcut până acum nu mai valorează. Îți spunem exact opusul — ce ai acumulat tu, în industria ta, în toți acei ani de muncă, este cel mai valoros activ pe care îl poți deține în era AI. Și noi îți arătăm cum să îl transformi într-un business care funcționează fără tine opt ore pe zi, șase zile pe săptămână.</p>
              <p className="font-bold text-2xl text-slate-900 mt-8">Tu rămâi cu jobul. Tu rămâi cu pasiunea. DaRomânia te ajută să o duci la cel mai înalt nivel posibil.</p>
            </div>
          </div>
        </section>

        {/* CELE TREI PRINCIPII */}
        <section ref={principlesRef} className="py-24 md:py-32 bg-[#FAFAF7] snap-start px-4">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-black mb-4 text-center text-slate-900">Ce credem cu adevărat</h2>
            <div className="h-1 w-16 mx-auto rounded-full mb-16" style={{background:'linear-gradient(90deg,#B8860B,#E8B84B,#B8860B)'}} />
            <div className="grid md:grid-cols-3 gap-12">
              <div className="bg-white p-5 md:p-10 rounded-xl md:rounded-[2.5rem] shadow-[0_4px_32px_rgba(180,134,11,0.07)] border border-[#EDE5C8]/60 relative overflow-hidden group hover:md:-translate-y-2 hover:border-[#D4A017]/40 hover:shadow-[rgba(210,160,23,0.14)] transition-all">
                <div className="absolute -right-4 -top-4 text-9xl font-black text-[#F5EDD0] opacity-70 group-hover:text-[#FEF0C0] transition-colors">01</div>
                <div className="relative z-10">
                  <h3 className="text-2xl font-black text-slate-900 mb-6 leading-tight">Tu ești cel mai în măsură să construiești un business în domeniul tău</h3>
                  <p className="text-slate-600 text-lg leading-relaxed font-medium">Nu un consultant extern. Nu un curs generic de antreprenoriat. Tu — cel care a trăit industria, care cunoaște clienții reali, care știe exact unde sunt problemele nerezolvate și de ce nimeni nu le rezolvă bine. DaRomânia nu îți aduce expertiza. O ai deja. Îți aduce sistemul prin care o transformi în libertate financiară.</p>
                </div>
              </div>
              
              <div className="bg-white p-5 md:p-10 rounded-xl md:rounded-[2.5rem] shadow-[0_4px_32px_rgba(180,134,11,0.07)] border border-[#EDE5C8]/60 relative overflow-hidden group hover:md:-translate-y-2 hover:border-[#D4A017]/40 hover:shadow-[rgba(210,160,23,0.14)] transition-all">
                <div className="absolute -right-4 -top-4 text-9xl font-black text-[#EDEDF5] opacity-70 group-hover:text-[#E4E4F4] transition-colors">02</div>
                <div className="relative z-10">
                  <h3 className="text-2xl font-black text-slate-900 mb-6 leading-tight">Facem ceea ce iubim la nivel maxim</h3>
                  <p className="text-slate-600 text-lg leading-relaxed font-medium">Nu pivotăm spre ceva nou și necunoscut. Amplificăm ce există deja în tine. Dacă ești reprezentant de vânzări, devii cel mai valoros consultant de vânzări din nișa ta. Dacă ești jurnalist, devii cel mai căutat creator de conținut de nișă din domeniu. Dacă ești contabil, devii CFO-ul strategic pe care startup-urile îl caută disperat și nu îl găsesc. Aceeași pasiune. Alt nivel. Altă ecuație financiară.</p>
                </div>
              </div>

              <div className="bg-white p-5 md:p-10 rounded-xl md:rounded-[2.5rem] shadow-[0_4px_32px_rgba(180,134,11,0.07)] border border-[#EDE5C8]/60 relative overflow-hidden group hover:md:-translate-y-2 hover:border-[#D4A017]/40 hover:shadow-[rgba(210,160,23,0.14)] transition-all">
                <div className="absolute -right-4 -top-4 text-9xl font-black text-[#F5EDD0] opacity-70 group-hover:text-[#FEF0C0] transition-colors">03</div>
                <div className="relative z-10">
                  <h3 className="text-2xl font-black text-slate-900 mb-6 leading-tight">Suntem parteneri, nu furnizori</h3>
                  <p className="text-slate-600 text-lg leading-relaxed font-medium">Fee-ul nostru acoperă costurile de implementare ale proiectului tău. Nu câștigăm din disperarea ta. Câștigăm din succesul tău. Modelul nostru de business este aliniat complet cu al tău — cu cât construiești mai repede, cu atât călătoria noastră împreună are mai multă valoare. Mergem cu tine, nu în fața ta.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* DE CE E REVOLUȚIONAR */}
        <section ref={diffRef} className="py-24 md:py-32 bg-slate-900 text-white snap-start px-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://picsum.photos/seed/abstract/1920/1080?blur=10')] opacity-10 object-cover" />
          <div className="max-w-5xl mx-auto relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-6xl font-black mb-6">DaRomânia nu seamănă cu nimic ce ai văzut până acum</h2>
              <p className="text-indigo-300 text-2xl font-medium">Și asta nu e un claim de marketing. E o diferență structurală.</p>
            </div>
            
            <div className="space-y-6">
              <div className="bg-white/5 backdrop-blur-lg border border-white/10 p-8 rounded-[2rem] flex flex-col md:flex-row gap-6 items-center text-center md:text-left">
                <div className="flex-1">
                  <p className="text-slate-400 text-lg line-through decoration-slate-500">Toate platformele de reconversie profesională îți spun să devii altceva.</p>
                </div>
                <div className="hidden md:block w-px h-12 bg-white/20"></div>
                <div className="flex-1">
                  <p className="text-2xl font-bold text-white">DaRomânia îți spune să devii versiunea premium a ceea ce ești deja.</p>
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur-lg border border-white/10 p-8 rounded-[2rem] flex flex-col md:flex-row gap-6 items-center text-center md:text-left">
                <div className="flex-1">
                  <p className="text-slate-400 text-lg line-through decoration-slate-500">Toate cursurile online îți vând informație.</p>
                </div>
                <div className="hidden md:block w-px h-12 bg-white/20"></div>
                <div className="flex-1">
                  <p className="text-2xl font-bold text-white">DaRomânia îți însoțește implementarea, zi de zi, pas cu pas.</p>
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur-lg border border-white/10 p-8 rounded-[2rem] flex flex-col md:flex-row gap-6 items-center text-center md:text-left">
                <div className="flex-1">
                  <p className="text-slate-400 text-lg line-through decoration-slate-500">Toți consultanții lucrează pentru tine cu soluții externe.</p>
                </div>
                <div className="hidden md:block w-px h-12 bg-white/20"></div>
                <div className="flex-1">
                  <p className="text-2xl font-bold text-white">DaRomânia deblochează ce era deja în tine și îl structurează corect.</p>
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur-lg border border-white/10 p-8 rounded-[2rem] flex flex-col md:flex-row gap-6 items-center text-center md:text-left">
                <div className="flex-1">
                  <p className="text-slate-400 text-lg line-through decoration-slate-500">Toți furnizorii câștigă din ce plătești tu.</p>
                </div>
                <div className="hidden md:block w-px h-12 bg-white/20"></div>
                <div className="flex-1">
                  <p className="text-2xl font-bold text-white">DaRomânia câștigă din ce construiești tu. Suntem aliniați complet.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* METODOLOGIA - CUM FUNCȚIONEAZĂ */}
        <section ref={methodologyRef} className="py-24 md:py-32 bg-white snap-start px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-6xl font-black mb-6 text-slate-900">Metodologia DaRomânia</h2>
              <p className="text-2xl font-bold text-indigo-600 mb-4">Patru piloni, o singură destinație</p>
              <p className="text-slate-600 text-xl max-w-3xl mx-auto font-medium">Nu un curs. Nu un template. Un sistem complet de transformare a experienței tale în business viabil, construit pas cu pas, zi de zi.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Pilon 1 */}
              <div className="bg-slate-50 rounded-xl md:rounded-[2.5rem] p-5 md:p-10 border border-slate-200 shadow-lg">
                <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center font-black text-2xl mb-8">1</div>
                <h3 className="text-3xl font-black text-slate-900 mb-4">Automatizezi cele 85%</h3>
                <p className="text-slate-600 text-lg leading-relaxed mb-8 font-medium">Înainte să construiești orice, eliminăm din mâinile tale tot ce poate face AI-ul mai bine decât tine. Nu ca să rămâi fără muncă. Ca să îți eliberezi 5-6 ore pe zi pe care acum le consumi pe taskuri repetitive care nu îți aduc nicio satisfacție și nicio diferențiere. Acele ore sunt capitalul de timp pentru business-ul tău.</p>
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                  <p className="text-slate-900 font-medium"><span className="font-black text-indigo-600 block mb-2 uppercase tracking-wider text-sm">Ce primești:</span> Listă de unelte AI specifice jobului tău, tutoriale pas cu pas, sistem de automatizare testat.</p>
                </div>
              </div>

              {/* Pilon 2 */}
              <div className="bg-slate-50 rounded-xl md:rounded-[2.5rem] p-5 md:p-10 border border-slate-200 shadow-lg">
                <div className="w-16 h-16 bg-violet-100 text-violet-600 rounded-2xl flex items-center justify-center font-black text-2xl mb-8">2</div>
                <h3 className="text-3xl font-black text-slate-900 mb-4">Monitorizezi, nu execuți</h3>
                <p className="text-slate-600 text-lg leading-relaxed mb-8 font-medium">AI-ul lucrează, tu supraveghezi. Devii directorul propriului tău proces, nu executantul lui. Îți arătăm exact ce indicatori să urmărești, cum să verifici calitatea output-ului, când și cum să intervii. Este o schimbare fundamentală de poziție — de la angajat care execută, la antreprenor care conduce.</p>
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                  <p className="text-slate-900 font-medium"><span className="font-black text-violet-600 block mb-2 uppercase tracking-wider text-sm">Ce primești:</span> Dashboard de monitorizare, checklist zilnic de supervizare, sistem de quality control.</p>
                </div>
              </div>

              {/* Pilon 3 */}
              <div className="bg-slate-50 rounded-xl md:rounded-[2.5rem] p-5 md:p-10 border border-slate-200 shadow-lg">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center font-black text-2xl mb-8">3</div>
                <h3 className="text-3xl font-black text-slate-900 mb-4">Monetizezi cu un singur proiect ales</h3>
                <p className="text-slate-600 text-lg leading-relaxed mb-8 font-medium">Primești 5 proiecte de monetizare construite specific pe experiența ta. Nu pe a altcuiva. Pe a ta. Alegi unul — cel cu care rezonezi cel mai mult, cel pentru care ai cel mai mult capital de experiență acumulat. Un singur proiect, executat complet și consistent, este mai valoros decât cinci proiecte abandonate pe jumătate.</p>
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                  <p className="text-slate-900 font-medium"><span className="font-black text-emerald-600 block mb-2 uppercase tracking-wider text-sm">Ce primești:</span> 5 planuri de business detaliate, criterii de selecție personalizate, plan de lansare în 90 de zile.</p>
                </div>
              </div>

              {/* Pilon 4 */}
              <div className="bg-slate-50 rounded-xl md:rounded-[2.5rem] p-5 md:p-10 border border-slate-200 shadow-lg">
                <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center font-black text-2xl mb-8">4</div>
                <h3 className="text-3xl font-black text-slate-900 mb-4">Taskuri zilnice cu însoțire reală</h3>
                <p className="text-slate-600 text-lg leading-relaxed mb-8 font-medium">Plan de 12 săptămâni, descompus în acțiuni zilnice extrem de specifice. Nu „construiește-ți brandul personal" — asta nu înseamnă nimic. Ci „azi publici pe LinkedIn o lecție din cele mai dificile 3 situații pe care le-ai rezolvat în carieră și cum le-ai depășit, cu această structură exactă." Specific. Măsurabil. Acționabil. Zi de zi. Cu echipa DaRomânia alături.</p>
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                  <p className="text-slate-900 font-medium"><span className="font-black text-rose-600 block mb-2 uppercase tracking-wider text-sm">Ce primești:</span> Plan zilnic de acțiune, comunitate de accountability, suport direct din echipa DaRomânia.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PENTRU CINE */}
        <section ref={targetRef} className="py-24 md:py-32 bg-[#FAFAF7] snap-start px-4">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12">
            <div className="bg-white p-10 md:p-12 rounded-[3rem] shadow-xl border-t-8 border-emerald-500">
              <h3 className="text-3xl md:text-4xl font-black mb-10 text-slate-900 leading-tight">DaRomânia este construită pentru tine dacă...</h3>
              <ul className="space-y-6">
                <li className="flex gap-4 items-start">
                  <div className="bg-emerald-100 p-2 rounded-full shrink-0 mt-1"><Check className="text-emerald-600 w-5 h-5"/></div>
                  <span className="text-lg text-slate-700 font-medium">Ai între 5 și 25 de ani de experiență într-un domeniu și știi că ești bun la ce faci — dar simți că nisipul se mișcă sub picioare.</span>
                </li>
                <li className="flex gap-4 items-start">
                  <div className="bg-emerald-100 p-2 rounded-full shrink-0 mt-1"><Check className="text-emerald-600 w-5 h-5"/></div>
                  <span className="text-lg text-slate-700 font-medium">Citești știrile despre disponibilizări și te întrebi în liniște „oare când vine rândul meu?" — fără să spui nimănui.</span>
                </li>
                <li className="flex gap-4 items-start">
                  <div className="bg-emerald-100 p-2 rounded-full shrink-0 mt-1"><Check className="text-emerald-600 w-5 h-5"/></div>
                  <span className="text-lg text-slate-700 font-medium">Ai primit deja notificarea și cauți o cale care să nu înceapă cu „rescrie-ți CV-ul".</span>
                </li>
                <li className="flex gap-4 items-start">
                  <div className="bg-emerald-100 p-2 rounded-full shrink-0 mt-1"><Check className="text-emerald-600 w-5 h-5"/></div>
                  <span className="text-lg text-slate-700 font-medium">Ești angajat, ești stabil momentan, dar vrei să construiești ceva al tău înainte ca decizia să nu mai fie a ta.</span>
                </li>
                <li className="flex gap-4 items-start">
                  <div className="bg-emerald-100 p-2 rounded-full shrink-0 mt-1"><Check className="text-emerald-600 w-5 h-5"/></div>
                  <span className="text-lg text-slate-700 font-medium">Crezi că ai mai multă valoare decât reflectă salariul tău actual și vrei să demonstrezi asta concret.</span>
                </li>
              </ul>
            </div>

            <div className="bg-white p-10 md:p-12 rounded-[3rem] shadow-xl border-t-8 border-rose-500">
              <h3 className="text-3xl md:text-4xl font-black mb-10 text-slate-900 leading-tight">DaRomânia <span className="text-rose-600">nu</span> este pentru tine dacă...</h3>
              <ul className="space-y-6">
                <li className="flex gap-4 items-start">
                  <div className="bg-rose-100 p-2 rounded-full shrink-0 mt-1"><X className="text-rose-600 w-5 h-5"/></div>
                  <span className="text-lg text-slate-700 font-medium">Cauți o schemă rapidă de îmbogățire fără muncă reală.</span>
                </li>
                <li className="flex gap-4 items-start">
                  <div className="bg-rose-100 p-2 rounded-full shrink-0 mt-1"><X className="text-rose-600 w-5 h-5"/></div>
                  <span className="text-lg text-slate-700 font-medium">Nu ești dispus să investești 1-2 ore pe zi în construirea business-ului tău.</span>
                </li>
                <li className="flex gap-4 items-start">
                  <div className="bg-rose-100 p-2 rounded-full shrink-0 mt-1"><X className="text-rose-600 w-5 h-5"/></div>
                  <span className="text-lg text-slate-700 font-medium">Vrei să abandonezi complet ce ai construit și să o iei de la zero într-un domeniu pe care nu îl cunoști.</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <HeartHandshake className="text-indigo-600 w-6 h-6" />
            <span className="text-xl font-bold tracking-tight">DaRomânia</span>
          </div>
          <div className="text-center md:text-left">
            <p className="text-slate-500 text-sm font-medium mb-1">
              © 2026 DaRomânia. 99 de meserii în pericol. 99 de business-uri posibile. Unul e al tău.
            </p>
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">
              Powered by SSociety.eu
            </p>
          </div>
          <div className="flex gap-6">
          </div>
        </div>
      </footer>
    </div>
  );
}

function JoinForm({ onClose }: { onClose: () => void }) {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(onClose, 2000);
  };

  if (submitted) {
    return (
      <div className="p-12 text-center">
        <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10 text-green-600" />
        </div>
        <h3 className="text-2xl font-bold mb-2">Bun venit în rețea!</h3>
        <p className="text-slate-500">Te vom contacta în curând cu primele oportunități.</p>
      </div>
    );
  }

  return (
    <div className="p-10">
      <h3 className="text-2xl font-bold mb-2">Alătură-te Rețelei</h3>
      <p className="text-slate-500 mb-8">Conectează-te cu alți profesioniști care au pivotat cu succes.</p>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input required type="text" placeholder="Nume complet" className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none" />
        </div>
        <div className="relative">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input required type="email" placeholder="Adresa de email" className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none" />
        </div>
        <div className="relative">
          <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input required type="text" placeholder="Meseria actuală" className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none" />
        </div>
        <button type="submit" className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 transition-all">
          Trimite Cererea
        </button>
      </form>
    </div>
  );
}

function EligibilityCheck({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<boolean[]>([]);

  const questions = [
    "Ai fost afectat direct de automatizarea AI în ultimele 6 luni?",
    "Meseria ta are un risc de automatizare mai mare de 60%?",
    "Ești dispus să urmezi un program de recalificare de 4 săptămâni?"
  ];

  const handleAnswer = (val: boolean) => {
    const newAnswers = [...answers, val];
    setAnswers(newAnswers);
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      setStep(questions.length);
    }
  };

  const isEligible = answers.every(a => a === true);

  if (step === questions.length) {
    return (
      <div className="p-12 text-center">
        {isEligible ? (
          <>
            <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Coins className="w-10 h-10 text-indigo-600" />
            </div>
            <h3 className="text-2xl font-bold mb-2">Ești Eligibil!</h3>
            <p className="text-slate-500 mb-8">Ai fost pre-aprobat pentru grantul de tranziție de 1.000€.</p>
            <button onClick={onClose} className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 transition-all">
              Revendică Grantul
            </button>
          </>
        ) : (
          <>
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-10 h-10 text-slate-400" />
            </div>
            <h3 className="text-2xl font-bold mb-2">Mai avem nevoie de date</h3>
            <p className="text-slate-500 mb-8">Momentan nu îndeplinești toate criteriile automate. Te rugăm să ne contactezi pentru o evaluare manuală.</p>
            <button onClick={onClose} className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-slate-800 transition-all">
              Închide
            </button>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="p-10">
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-xl font-bold">Verificare Eligibilitate</h3>
        <span className="text-sm font-bold text-indigo-600">Pasul {step + 1}/3</span>
      </div>
      
      <p className="text-lg font-medium text-slate-800 mb-10 leading-relaxed">
        {questions[step]}
      </p>
      
      <div className="grid grid-cols-2 gap-4">
        <button 
          onClick={() => handleAnswer(true)}
          className="py-4 rounded-xl border-2 border-slate-100 hover:border-indigo-600 hover:bg-indigo-50 font-bold transition-all"
        >
          Da
        </button>
        <button 
          onClick={() => handleAnswer(false)}
          className="py-4 rounded-xl border-2 border-slate-100 hover:border-rose-600 hover:bg-rose-50 font-bold transition-all"
        >
          Nu
        </button>
      </div>
    </div>
  );
}
