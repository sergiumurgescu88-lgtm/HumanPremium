import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Cell } from 'recharts';
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
  BookOpen
} from 'lucide-react';
import { GoogleGenAI, Type, Modality, LiveServerMessage } from "@google/genai";
import { JOBS_LIST, JobData } from './constants';
import Markdown from 'react-markdown';

// Initialize Gemini
const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

type ModalType = 'join' | 'eligibility' | 'download' | null;

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

interface PivotData {
  pivotStrategy: string;
  monetizationProjects: MonetizationProject[];
}

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

      const response = await genAI.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: contents,
        config: {
          systemInstruction: `Ești agentul AI personal de monetizare pentru un ${job.title}. Îl ajuți zi de zi să își crească veniturile, să găsească clienți și să implementeze proiectele de pivotare. Fii scurt, la obiect și proactiv. Răspunde în română.`
        }
      });

      if (response.text) {
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

      const sessionPromise = genAI.live.connect({
        model: "gemini-3.1-flash-live-preview",
        callbacks: {
          onopen: () => {
            processor.onaudioprocess = (e) => {
              const channelData = e.inputBuffer.getChannelData(0);
              const pcm16 = new Int16Array(channelData.length);
              for (let i = 0; i < channelData.length; i++) {
                pcm16[i] = Math.max(-32768, Math.min(32767, channelData[i] * 32768));
              }
              const base64 = btoa(String.fromCharCode(...new Uint8Array(pcm16.buffer)));
              sessionPromise.then(session => {
                session.sendRealtimeInput({ audio: { data: base64, mimeType: 'audio/pcm;rate=16000' } });
              });
            };
          },
          onmessage: async (message: LiveServerMessage) => {
            const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (base64Audio && audioContextRef.current) {
              const binary = atob(base64Audio);
              const bytes = new Uint8Array(binary.length);
              for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
              const pcm16 = new Int16Array(bytes.buffer);
              const audioBuffer = audioContextRef.current.createBuffer(1, pcm16.length, 24000);
              const channelData = audioBuffer.getChannelData(0);
              for (let i = 0; i < pcm16.length; i++) channelData[i] = pcm16[i] / 32768;

              const playSource = audioContextRef.current.createBufferSource();
              playSource.buffer = audioBuffer;
              playSource.connect(audioContextRef.current.destination);

              if (nextPlayTimeRef.current < audioContextRef.current.currentTime) {
                nextPlayTimeRef.current = audioContextRef.current.currentTime;
              }
              playSource.start(nextPlayTimeRef.current);
              nextPlayTimeRef.current += audioBuffer.duration;
              activeSourcesRef.current.push(playSource);
            }

            if (message.serverContent?.interrupted) {
              activeSourcesRef.current.forEach(s => {
                try { s.stop(); } catch(e){}
              });
              activeSourcesRef.current = [];
              if (audioContextRef.current) {
                nextPlayTimeRef.current = audioContextRef.current.currentTime;
              }
            }
          },
          onclose: () => {
            stopVoice();
          },
          onerror: (e) => {
            console.error("Live API Error:", e);
            stopVoice();
          }
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: "Zephyr" } },
          },
          systemInstruction: `Ești agentul AI personal de monetizare pentru un ${job.title}. Îl ajuți zi de zi să își crească veniturile. Răspunde scurt, practic și în română. Istoricul recent (rezumat): ${messages.slice(-5).map(m => m.role + ': ' + m.text).join(' | ')}`,
        }
      });

      sessionRef.current = await sessionPromise;

    } catch (e) {
      console.error("Failed to start voice:", e);
      stopVoice();
    }
  };

  useEffect(() => {
    return () => stopVoice();
  }, []);

  return (
    <div className="fixed bottom-6 right-6 w-[400px] h-[600px] bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden z-50">
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
      chatRef.current = genAI.chats.create({
        model: "gemini-3-flash-preview",
        config: {
          systemInstruction: `Ești asistentul virtual al platformei 'Human Premium' (AI Monetization Hub). 
          Scopul platformei: Ajută profesioniștii să nu fie înlocuiți de AI, ci să pivoteze către roluri strategice, oferind planuri de business și proiecte de monetizare.
          Servicii: Generare de strategii de pivotare, idei de proiecte de monetizare, și 'AI Dividend Program' (un fond de tranziție global pentru cei afectați de automatizare).
          Ton: Profesionist, empatic, încurajator, concis. Răspunde în limba română.`
        }
      });
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
      if (response.text) {
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
          className="fixed bottom-8 left-8 bg-slate-800 text-white p-4 rounded-full shadow-2xl hover:bg-slate-900 hover:scale-110 transition-all z-40 flex items-center gap-3"
        >
          <MessageCircle className="w-6 h-6" />
          <span className="font-bold pr-2 hidden md:inline">Suport Platformă</span>
        </button>
      )}

      {isOpen && (
        <div className="fixed bottom-6 left-6 w-[350px] md:w-[400px] h-[500px] bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden z-50">
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

export default function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedJob, setSelectedJob] = useState<JobData | null>(null);
  const [pivotData, setPivotData] = useState<PivotData | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [contextAnswers, setContextAnswers] = useState({ q1: '', q2: '', q3: '' });
  const [luckyLoading, setLuckyLoading] = useState({ q1: false, q2: false, q3: false });
  
  // Refs for scrolling
  const pivotRef = useRef<HTMLDivElement>(null);
  const missionRef = useRef<HTMLDivElement>(null);
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

  const generateLuckyAnswer = async (qKey: 'q1' | 'q2' | 'q3', questionText: string) => {
    if (!selectedJob) return;
    setLuckyLoading(prev => ({ ...prev, [qKey]: true }));
    try {
      const prompt = `Ești un ${selectedJob.title}. Răspunde scurt (maxim 10-15 cuvinte), la persoana a I-a, la următoarea întrebare despre preferințele tale profesionale: "${questionText}". Fii creativ, realist și foarte specific meseriei tale. Nu folosi ghilimele.`;
      const response = await genAI.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
      });
      if (response.text) {
        setContextAnswers(prev => ({ ...prev, [qKey]: response.text.trim() }));
      }
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

      const response = await genAI.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              pivotStrategy: { type: Type.STRING },
              monetizationProjects: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    description: { type: Type.STRING },
                    platform: { type: Type.STRING },
                    marketingStrategy: { type: Type.STRING },
                    innovation: { type: Type.STRING },
                    projectType: { type: Type.STRING },
                    monetizationMethod: { type: Type.STRING },
                    suitabilityQuestions: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING }
                    }
                  },
                  required: ["title", "description", "platform", "marketingStrategy", "innovation", "projectType", "monetizationMethod", "suitabilityQuestions"]
                }
              }
            },
            required: ["pivotStrategy", "monetizationProjects"]
          }
        }
      });

      if (response.text) {
        const data = JSON.parse(response.text);
        setPivotData(data);
      } else {
        throw new Error("Empty response");
      }
      
      // Scroll to projects after a delay
      setTimeout(() => {
        projectsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } catch (error) {
      console.error("Error generating strategy:", error);
      setPivotData({
        pivotStrategy: "Eroare la generarea strategiei. Te rugăm să încerci din nou.",
        monetizationProjects: []
      });
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
    element.download = `Plan_HumanPremium_${selectedJob.title.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const scrollTo = (ref: React.RefObject<HTMLDivElement | null>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100 snap-y snap-mandatory scroll-smooth">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
            <div className="bg-indigo-600 p-2 rounded-xl">
              <HeartHandshake className="text-white w-6 h-6" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">Human<span className="text-indigo-600">Premium</span></span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <button onClick={() => scrollTo(missionRef)} className="hover:text-indigo-600 transition-colors">Misiune</button>
            <button onClick={() => scrollTo(pivotRef)} className="hover:text-indigo-600 transition-colors">Pivotează</button>
            <button onClick={() => scrollTo(dividendRef)} className="hover:text-indigo-600 transition-colors">AI Dividend</button>
            <button 
              onClick={() => setActiveModal('join')}
              className="bg-slate-900 text-white px-5 py-2.5 rounded-full hover:bg-slate-800 transition-all shadow-sm"
            >
              Alătură-te Rețelei
            </button>
          </nav>
        </div>
      </header>

      <main className="w-full">
        {/* Hero Section - FULL SCREEN */}
        <section className="min-h-screen flex flex-col items-center justify-center text-center snap-start">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 text-indigo-700 text-sm font-semibold mb-6 border border-indigo-100">
              <Rocket className="w-4 h-4" /> Succesul tău este motivația noastră!
            </span>
            <h1 className="text-6xl md:text-8xl font-extrabold text-slate-900 mb-8 tracking-tight leading-tight">
              Sfidăm Gravitația <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">Profesională</span>
            </h1>
            <p className="text-2xl text-slate-600 max-w-3xl mx-auto mb-12 leading-relaxed">
              Când AI-ul preia greutatea sarcinilor repetitive, noi te ajutăm să te înalți. Transformăm potențialul tău uman într-o forță de neoprit, monetizând esența ta creativă.
            </p>
            
            <button 
              onClick={() => pivotRef.current?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-indigo-600 text-white px-10 py-5 rounded-full text-2xl font-black hover:bg-indigo-700 transition-all shadow-2xl shadow-indigo-200 flex items-center gap-3 mx-auto"
            >
              Explorează Meseriile <ArrowRight className="w-6 h-6" />
            </button>

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

        {/* Tutorial Section */}
        <section className="min-h-screen flex flex-col items-center justify-center snap-start py-20 px-4 sm:px-6 lg:px-8 bg-slate-50">
          <div className="max-w-7xl mx-auto w-full">
            <div className="text-center mb-16">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-100 text-indigo-700 text-sm font-semibold mb-6 border border-indigo-200">
                <BookOpen className="w-4 h-4" /> Ghid de Utilizare
              </span>
              <h2 className="text-4xl md:text-6xl font-black mb-4 text-slate-900">Cum funcționează?</h2>
              <p className="text-slate-600 text-xl max-w-2xl mx-auto">Trei pași simpli pentru a-ți transforma experiența profesională într-un avantaj competitiv imposibil de automatizat.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Step 1 */}
              <div className="bg-white rounded-[2.5rem] p-10 border border-slate-200 shadow-xl hover:shadow-2xl transition-all group flex flex-col items-center text-center">
                <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                  <Search className="w-10 h-10 text-indigo-600" />
                </div>
                <div className="flex items-center justify-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-black text-sm">1</div>
                  <h3 className="text-2xl font-bold text-slate-900">Găsește-ți Meseria</h3>
                </div>
                <p className="text-slate-600 text-lg leading-relaxed">
                  Caută profesia ta în <strong>Indexul de Automatizare</strong>. Află exact ce procent din munca ta este expus riscului de a fi preluat de AI în următorii 5 ani.
                </p>
              </div>

              {/* Step 2 */}
              <div className="bg-white rounded-[2.5rem] p-10 border border-slate-200 shadow-xl hover:shadow-2xl transition-all group flex flex-col items-center text-center">
                <div className="w-24 h-24 bg-violet-50 rounded-full flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                  <Wand2 className="w-10 h-10 text-violet-600" />
                </div>
                <div className="flex items-center justify-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-violet-600 text-white rounded-full flex items-center justify-center font-black text-sm">2</div>
                  <h3 className="text-2xl font-bold text-slate-900">Generează Strategia</h3>
                </div>
                <p className="text-slate-600 text-lg leading-relaxed">
                  Răspunde la 3 întrebări simple despre preferințele tale. AI-ul nostru va genera un <strong>Plan de Pivotare</strong> personalizat, adaptat abilităților tale unice.
                </p>
              </div>

              {/* Step 3 */}
              <div className="bg-white rounded-[2.5rem] p-10 border border-slate-200 shadow-xl hover:shadow-2xl transition-all group flex flex-col items-center text-center">
                <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                  <Rocket className="w-10 h-10 text-emerald-600" />
                </div>
                <div className="flex items-center justify-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center font-black text-sm">3</div>
                  <h3 className="text-2xl font-bold text-slate-900">Alege Proiectul</h3>
                </div>
                <p className="text-slate-600 text-lg leading-relaxed">
                  Explorează cele 5 proiecte de monetizare propuse. Alege-l pe cel care ți se potrivește cel mai bine și începe să construiești <strong>Avantajul tău Uman</strong>.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section ref={pivotRef} className="h-screen w-full flex bg-white snap-start relative overflow-hidden">
          {/* Sidebar - Jobs List */}
          <div className={`h-full bg-slate-50 border-r border-slate-200 flex-col w-full md:w-[400px] lg:w-[450px] flex-shrink-0 transition-transform duration-300 ${selectedJob ? 'hidden md:flex' : 'flex'}`}>
            <div className="p-6 border-b border-slate-200 bg-white sticky top-0 z-10">
              <h2 className="text-2xl font-black mb-6 flex items-center gap-3">
                <AlertTriangle className="text-amber-500 w-8 h-8" /> 
                Index Automatizare
              </h2>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input 
                  type="text" 
                  placeholder="Caută meseria ta..."
                  className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 shadow-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-lg font-medium"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="mt-4 text-sm text-slate-500 font-bold">{filteredJobs.length} meserii identificate</div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <AnimatePresence mode="popLayout">
                {filteredJobs.map((job) => (
                  <motion.button
                    key={job.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    onClick={() => handleJobSelect(job)}
                    className={`w-full p-6 rounded-3xl border-2 text-left transition-all group ${
                      selectedJob?.id === job.id 
                        ? 'border-indigo-600 bg-indigo-50 shadow-lg' 
                        : 'border-slate-100 bg-white hover:border-indigo-200 hover:shadow-md'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <span className="text-xs font-black uppercase tracking-widest text-slate-400 group-hover:text-indigo-500 transition-colors">
                        {job.category}
                      </span>
                      <div className="flex items-center gap-1 text-amber-600 font-black text-lg">
                        <TrendingUp className="w-5 h-5" />
                        {job.automationRisk}%
                      </div>
                    </div>
                    <h3 className="text-xl font-black text-slate-800 mb-4 group-hover:text-indigo-700 transition-colors leading-tight">
                      {job.title}
                    </h3>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden shadow-inner mb-4">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${job.automationRisk}%` }}
                        className={`h-full shadow-sm ${job.automationRisk > 80 ? 'bg-gradient-to-r from-rose-500 to-pink-500' : 'bg-gradient-to-r from-amber-500 to-orange-500'}`}
                      />
                    </div>
                    <div className="text-xs text-slate-500 font-medium flex items-center gap-2 border-t border-slate-100 pt-4 mt-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
                      5 idei de business incluse
                    </div>
                  </motion.button>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Main Content - Pivot Strategy */}
          <div className={`h-full flex-1 flex-col bg-white overflow-hidden ${!selectedJob ? 'hidden md:flex' : 'flex'}`}>
            {/* Mobile Header */}
            <div className="md:hidden p-4 border-b border-slate-100 flex items-center bg-white sticky top-0 z-20 shadow-sm">
              <button 
                onClick={() => { setSelectedJob(null); setPivotData(null); }}
                className="flex items-center gap-2 text-indigo-600 font-black px-4 py-2 bg-indigo-50 rounded-full"
              >
                <ArrowLeft className="w-5 h-5" /> Înapoi la meserii
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 md:p-12 lg:p-20 relative">
              {!selectedJob ? (
                <div className="h-full flex flex-col items-center justify-center text-center max-w-4xl mx-auto">
                  <div className="bg-slate-50 p-8 rounded-full mb-6">
                    <Brain className="w-16 h-16 text-slate-300" />
                  </div>
                  <h2 className="text-3xl font-black text-slate-800 mb-2">Risc de Automatizare pe Categorii</h2>
                  <p className="text-lg text-slate-500 mb-12">Selectează o meserie din stânga pentru detalii sau analizează riscul mediu pe industrii.</p>
                  
                  <div className="w-full h-[400px] bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={categoryRiskData}
                        layout="vertical"
                        margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                        <XAxis type="number" domain={[0, 100]} hide />
                        <YAxis 
                          dataKey="name" 
                          type="category" 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{ fill: '#64748b', fontSize: 14, fontWeight: 600 }}
                          width={120}
                        />
                        <RechartsTooltip 
                          cursor={{ fill: '#f8fafc' }}
                          contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
                          formatter={(value: number) => [`${value}%`, 'Risc Automatizare']}
                        />
                        <Bar dataKey="risk" radius={[0, 8, 8, 0]} barSize={24}>
                          {categoryRiskData.map((entry, index) => (
                            <Cell 
                              key={`cell-${index}`} 
                              fill={
                                entry.risk >= 80 ? '#ef4444' : 
                                entry.risk >= 65 ? '#f59e0b' : 
                                '#10b981'
                              } 
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              ) : isGenerating ? (
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
                    <button 
                      onClick={() => { setSelectedJob(null); setPivotData(null); setContextAnswers({ q1: '', q2: '', q3: '' }); }}
                      className="hidden md:flex p-4 rounded-full hover:bg-slate-100 transition-colors"
                    >
                      <X className="w-8 h-8 text-slate-400" />
                    </button>
                  </div>
                  
                  <div className="bg-white border-2 border-slate-100 rounded-3xl p-8 shadow-sm space-y-6">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="block text-lg font-bold text-slate-900">
                          1. Ce îți place cel mai mult să faci în activitatea ta?
                        </label>
                        <button
                          onClick={() => generateLuckyAnswer('q1', 'Ce îți place cel mai mult să faci în activitatea ta?')}
                          disabled={luckyLoading.q1}
                          className="flex items-center gap-2 text-sm font-bold text-indigo-600 hover:text-indigo-800 transition-colors bg-indigo-50 px-3 py-1.5 rounded-full hover:bg-indigo-100"
                        >
                          {luckyLoading.q1 ? <RefreshCcw className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
                          I'm feeling lucky
                        </button>
                      </div>
                      <input
                        type="text"
                        value={contextAnswers.q1}
                        onChange={(e) => setContextAnswers({...contextAnswers, q1: e.target.value})}
                        placeholder="Ex: Să analizez date, să vorbesc cu clienții, să creez strategii..."
                        className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-lg transition-all"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="block text-lg font-bold text-slate-900">
                          2. Cu ce tip de clienți sau colegi preferi să lucrezi?
                        </label>
                        <button
                          onClick={() => generateLuckyAnswer('q2', 'Cu ce tip de clienți sau colegi preferi să lucrezi?')}
                          disabled={luckyLoading.q2}
                          className="flex items-center gap-2 text-sm font-bold text-indigo-600 hover:text-indigo-800 transition-colors bg-indigo-50 px-3 py-1.5 rounded-full hover:bg-indigo-100"
                        >
                          {luckyLoading.q2 ? <RefreshCcw className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
                          I'm feeling lucky
                        </button>
                      </div>
                      <input
                        type="text"
                        value={contextAnswers.q2}
                        onChange={(e) => setContextAnswers({...contextAnswers, q2: e.target.value})}
                        placeholder="Ex: Antreprenori, corporații, echipe mici, studenți..."
                        className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-lg transition-all"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="block text-lg font-bold text-slate-900">
                          3. Cât timp poți aloca și care este obiectivul tău principal?
                        </label>
                        <button
                          onClick={() => generateLuckyAnswer('q3', 'Cât timp poți aloca și care este obiectivul tău principal?')}
                          disabled={luckyLoading.q3}
                          className="flex items-center gap-2 text-sm font-bold text-indigo-600 hover:text-indigo-800 transition-colors bg-indigo-50 px-3 py-1.5 rounded-full hover:bg-indigo-100"
                        >
                          {luckyLoading.q3 ? <RefreshCcw className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
                          I'm feeling lucky
                        </button>
                      </div>
                      <input
                        type="text"
                        value={contextAnswers.q3}
                        onChange={(e) => setContextAnswers({...contextAnswers, q3: e.target.value})}
                        placeholder="Ex: 10 ore/săptămână, vreau un venit suplimentar stabil..."
                        className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-lg transition-all"
                      />
                    </div>
                    <div className="mt-8 flex justify-end">
                      <button
                        onClick={() => generatePivotStrategy(selectedJob, contextAnswers)}
                        className="bg-indigo-600 text-white px-8 py-4 rounded-full text-xl font-black hover:bg-indigo-700 transition-all shadow-lg hover:shadow-xl flex items-center gap-3"
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
                    <button 
                      onClick={() => { setSelectedJob(null); setPivotData(null); }}
                      className="hidden md:flex p-4 rounded-full hover:bg-slate-100 transition-colors"
                    >
                      <X className="w-8 h-8 text-slate-400" />
                    </button>
                  </div>
                  
                  <div className="prose prose-base md:prose-lg prose-indigo max-w-none mb-16">
                    <div className="markdown-body">
                      <Markdown>{pivotData?.pivotStrategy}</Markdown>
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
        </section>

        {/* Chat Agent Floating Button */}
        {!isChatOpen && selectedJob && (
          <button
            onClick={() => setIsChatOpen(true)}
            className="fixed bottom-8 right-8 bg-indigo-600 text-white p-4 rounded-full shadow-2xl hover:bg-indigo-700 hover:scale-110 transition-all z-40 flex items-center gap-3"
          >
            <div className="relative">
              <Brain className="w-6 h-6" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 border-2 border-indigo-600 rounded-full"></span>
            </div>
            <span className="font-bold pr-2">Agent Monetizare</span>
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
                {pivotData.monetizationProjects.map((project, idx) => (
                  <motion.section
                    key={idx}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true, margin: "-100px" }}
                    className={`min-h-screen w-full flex items-center justify-center p-4 md:p-8 sticky top-0 snap-start bg-gradient-to-br ${COLORS[idx]}`}
                  >
                    <div className="max-w-6xl w-full max-h-[95vh] overflow-y-auto custom-scrollbar bg-white/10 backdrop-blur-3xl rounded-[3rem] border border-white/20 p-6 md:p-12 shadow-2xl text-white">
                      <div className="flex flex-col lg:flex-row gap-10 items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-6 mb-8">
                            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center shadow-inner flex-shrink-0">
                              {idx === 0 && <Youtube className="w-8 h-8" />}
                              {idx === 1 && <Linkedin className="w-8 h-8" />}
                              {idx === 2 && <Globe className="w-8 h-8" />}
                              {idx === 3 && <Rocket className="w-8 h-8" />}
                              {idx === 4 && <Lightbulb className="w-8 h-8" />}
                            </div>
                            <div>
                              <span className="text-xs font-black uppercase tracking-[0.3em] opacity-60 block mb-1">{project.platform}</span>
                              <h3 className="text-3xl md:text-5xl font-black leading-tight tracking-tight">{project.title}</h3>
                            </div>
                          </div>

                          <div className="grid md:grid-cols-2 gap-6 mb-8">
                            <div className="bg-white/10 rounded-[2rem] p-6 border border-white/10 shadow-lg">
                              <h4 className="text-indigo-200 font-black text-[10px] uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                                <Briefcase className="w-4 h-4" /> Tip Proiect
                              </h4>
                              <p className="text-xl md:text-2xl font-black">{project.projectType}</p>
                            </div>
                            <div className="bg-white/10 rounded-[2rem] p-6 border border-white/10 shadow-lg">
                              <h4 className="text-emerald-200 font-black text-[10px] uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                                <Coins className="w-4 h-4" /> Metodă Monetizare
                              </h4>
                              <p className="text-xl md:text-2xl font-black">{project.monetizationMethod}</p>
                            </div>
                          </div>

                          <p className="text-lg md:text-xl leading-relaxed font-medium opacity-95 mb-8 max-w-4xl">
                            {project.description}
                          </p>
                          
                          {project.suitabilityQuestions && project.suitabilityQuestions.length > 0 && (
                            <div className="bg-white/5 rounded-[1.5rem] p-6 border border-white/10 max-w-4xl">
                              <h4 className="text-white/60 font-black text-xs uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                                <MessageCircle className="w-4 h-4" /> Este acest proiect pentru tine?
                              </h4>
                              <ul className="space-y-3">
                                {project.suitabilityQuestions.map((q, qIdx) => (
                                  <li key={qIdx} className="flex items-start gap-3 text-base md:text-lg font-medium">
                                    <span className="text-indigo-300 mt-1">?</span>
                                    <span>{q}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>

                        <div className="w-full lg:w-80 space-y-6 flex-shrink-0">
                          <div className="bg-black/20 rounded-[2rem] p-6 border border-white/5 shadow-xl">
                            <h4 className="text-white/40 font-black text-[10px] uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                              <Share2 className="w-4 h-4" /> Strategie Marketing
                            </h4>
                            <p className="text-base leading-relaxed font-medium">{project.marketingStrategy}</p>
                          </div>
                          <div className="bg-black/20 rounded-[2rem] p-6 border border-white/5 shadow-xl">
                            <h4 className="text-white/40 font-black text-[10px] uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                              <Zap className="w-4 h-4" /> Inovație Cheie
                            </h4>
                            <p className="text-base leading-relaxed font-medium">{project.innovation}</p>
                          </div>
                          <button 
                            onClick={() => setActiveModal('join')}
                            className="w-full bg-white text-slate-900 py-4 rounded-[1.5rem] text-lg font-black hover:bg-indigo-50 transition-all flex items-center justify-center gap-2 shadow-2xl shadow-black/20"
                          >
                            Lansează proiectul <ArrowRight className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.section>
                ))}
              </div>
            </div>
          )}
        </AnimatePresence>

        {/* Features Section - FULL SCREEN */}
        <section ref={missionRef} className="min-h-screen flex flex-col items-center justify-center snap-start py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto w-full">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-6xl font-black mb-4">Misiunea Noastră</h2>
              <p className="text-slate-600 text-xl max-w-2xl mx-auto">Protejăm valoarea umană într-o lume dominată de algoritmi.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 w-full">
              <div className="p-12 rounded-[3rem] bg-white border border-slate-100 shadow-xl hover:shadow-indigo-100 transition-all">
                <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mb-8 relative group cursor-help">
                  <ShieldCheck className="text-indigo-600 w-8 h-8" />
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-64 p-3 bg-slate-900 text-white text-sm rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 shadow-xl z-10 text-center">
                    Verifică și validează deciziile AI pentru a asigura conformitatea etică, lipsa prejudecăților și alinierea cu valorile umane.
                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900"></div>
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-4">Audit Etic AI</h3>
                <p className="text-slate-600 text-lg leading-relaxed">
                  Fostul tău job de corector sau editor devine acum un rol de Auditor Etic pentru conținutul generat de AI.
                </p>
              </div>
              <div className="p-12 rounded-[3rem] bg-white border border-slate-100 shadow-xl hover:shadow-violet-100 transition-all">
                <div className="w-16 h-16 bg-violet-50 rounded-2xl flex items-center justify-center mb-8 relative group cursor-help">
                  <Users className="text-violet-600 w-8 h-8" />
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-64 p-3 bg-slate-900 text-white text-sm rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 shadow-xl z-10 text-center">
                    Oferă nuanța emoțională și culturală pe care AI-ul nu o poate înțelege. Construiește relații bazate pe încredere și empatie.
                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900"></div>
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-4">Consultanță Contextuală</h3>
                <p className="text-slate-600 text-lg leading-relaxed">
                  AI-ul știe datele, tu știi oamenii. Transformă-ți experiența în brokeraj sau vânzări în management de relații complexe.
                </p>
              </div>
              <div className="p-12 rounded-[3rem] bg-white border border-slate-100 shadow-xl hover:shadow-amber-100 transition-all">
                <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center mb-8 relative group cursor-help">
                  <Cpu className="text-amber-600 w-8 h-8" />
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-64 p-3 bg-slate-900 text-white text-sm rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 shadow-xl z-10 text-center">
                    Coordonează și integrează multiple sisteme AI pentru a crea fluxuri de lucru complexe, maximizând eficiența și productivitatea.
                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900"></div>
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

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <HeartHandshake className="text-indigo-600 w-6 h-6" />
            <span className="text-xl font-bold tracking-tight">HumanPremium</span>
          </div>
          <p className="text-slate-500 text-sm">
            © 2026 Human Premium. Construit pentru a proteja demnitatea muncii umane în era inteligenței artificiale.
          </p>
          <div className="flex gap-6">
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-indigo-600 transition-colors">LinkedIn</a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-indigo-600 transition-colors">Twitter</a>
            <a href="mailto:contact@humanpremium.com" className="text-slate-400 hover:text-indigo-600 transition-colors">Contact</a>
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
