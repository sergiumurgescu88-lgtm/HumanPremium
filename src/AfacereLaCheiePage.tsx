import { useState } from "react";

interface Business {
  id: number; category: string; jobTitle: string; risk: number;
  businessName: string; tagline: string; revenue: string; totalApiCost: string; color: string;
  apis: {name:string;cost:string;desc:string;badge?:string}[];
  pipeline: string[]; primiiClienti: string[];
  ssociety: {icon:string;name:string;url:string;desc:string}[];
}

const B: Business[] = [
  {id:1,category:"Marketing",jobTitle:"Copywriter / Content Writer",risk:83,businessName:"Agentie Content AI Semi-Automat",tagline:"Tu supervizezi 2h/zi. AI-ul scrie, posteaza, trimite emailuri.",revenue:"2.800-6.000 EUR/luna",totalApiCost:"~3 USD/luna",color:"#6c47ff",
   apis:[{name:"DeepSeek API",cost:"~1 USD/luna",desc:"500k cuvinte generate lunar",badge:"LOW-COST"},{name:"Amazon SES",cost:"GRATUIT",desc:"62.000 emailuri/an",badge:"GRATUIT"},{name:"Telegram Bot API",cost:"GRATUIT",desc:"Livrare rapoarte clienti",badge:"GRATUIT"},{name:"Brave Search API",cost:"GRATUIT",desc:"2.000 cautari SEO/luna",badge:"GRATUIT"},{name:"Zernio API",cost:"~1 USD/luna",desc:"Postare 4 platforme simultan",badge:"LOW-COST"}],
   pipeline:["Air Claw - Strategie si orchestrare","Agent Content - Articole, emailuri, reclame","Agent SEO - Keywords si optimizare","Agent Social - Postare 4 platforme","Agent CFO - Costuri real-time"],
   primiiClienti:["LinkedIn outreach la 50 IMM-uri/zi automat","Demo portofoliu live cu 3 articole AI","Oferta 299 USD/luna per client - 10 clienti = 3000 EUR"],
   ssociety:[{icon:"✍",name:"Laborator de Texte AI",url:"ssocietystudio.lovable.app",desc:"Generator continut specializat pentru restaurante, IMM-uri, branduri."},{icon:"🎬",name:"SSociety AI Studio",url:"ssocietyaistudio.lovable.app",desc:"Script AI - video - thumbnail - auto-posting 7+ platforme. 15 min de la idee la publicat."},{icon:"🔥",name:"Viral Architect",url:"ssocietyhub.store",desc:"Campanii cu potential viral: hook-uri, strategii distributie, calendar."}]},
  {id:2,category:"Imobiliare",jobTitle:"Agent Imobiliar",risk:70,businessName:"Platforma Marketing Imobiliar Automat",tagline:"Anunt complet in 3 minute. Follow-up automat 30 zile. Zero munca manuala.",revenue:"1.500-5.000 EUR/luna",totalApiCost:"~1.5 USD/luna",color:"#00b894",
   apis:[{name:"DeepSeek API",cost:"~0.5 USD/luna",desc:"Descrieri anunturi RO+EN SEO",badge:"LOW-COST"},{name:"KIE.ai Images",cost:"~1 USD/luna",desc:"Imagini AI premium anunturi",badge:"LOW-COST"},{name:"Amazon SES",cost:"GRATUIT",desc:"Follow-up 30 zile automat",badge:"GRATUIT"},{name:"Google Maps API",cost:"GRATUIT",desc:"Harti si date zona",badge:"GRATUIT"},{name:"Jina AI Reader",cost:"GRATUIT",desc:"Scraping preturi concurenta",badge:"GRATUIT"}],
   pipeline:["Agent Listings - Descriere SEO in 3 minute","Agent Visual - Imagini AI per proprietate","Agent Follow-up - 30 zile automata per lead","Agent Market - Analiza pret zona"],
   primiiClienti:["49 USD/proprietate descriere si imagini AI","Pachet lunar 299 USD - anunturi, follow-up, raport","Nisa: agentii 1-5 agenti fara tool-uri digitale"],
   ssociety:[{icon:"🏢",name:"SocietyHUB CRM Imobiliar PRO",url:"ssocietyhub.store",desc:"CRM complet: 47+ proprietati, matching AI, contracte, 18K EUR comisioane/luna."},{icon:"🎯",name:"LeadGenius",url:"ssocietyhub.store",desc:"Lead-uri calificate AI gata de contactat."},{icon:"🔍",name:"Mega SEO Audit Pro",url:"ssocietyhub.store",desc:"Audit SEO pentru anunturi imobiliare."}]},
  {id:3,category:"HR",jobTitle:"HR Manager / Recruiter",risk:72,businessName:"Agentie Recrutare AI-Assisted",tagline:"Screening automat, interviuri AI, plasament rapid - tu faci doar closing-ul.",revenue:"2.500-8.000 EUR/luna",totalApiCost:"~2 USD/luna",color:"#e17055",
   apis:[{name:"DeepSeek API",cost:"~1 USD/luna",desc:"Analiza CV-uri, intrebari interviu",badge:"LOW-COST"},{name:"Apify Scraper",cost:"~0.9 USD/luna",desc:"Scraping joburi LinkedIn",badge:"LOW-COST"},{name:"Amazon SES",cost:"GRATUIT",desc:"Emailuri candidati si companii",badge:"GRATUIT"},{name:"Google Calendar API",cost:"GRATUIT",desc:"Programare interviuri automat",badge:"GRATUIT"},{name:"Telegram Bot",cost:"GRATUIT",desc:"Notificari real-time recrutori",badge:"GRATUIT"}],
   pipeline:["Agent Sourcing - Candidati din LinkedIn","Agent Screening - Analiza CV si potrivire job","Agent Schedule - Programare fara emailuri","Agent Report - Raport hiring saptamanal"],
   primiiClienti:["500 USD per plasament reusit","999 USD/luna hiring continuu startup-uri tech","Nisa: companii 10-50 angajati fara HR intern"],
   ssociety:[{icon:"⚡",name:"SSociety Studio - 6 Agenti AI",url:"ssocietystudio.lovable.app",desc:"342+ lead-uri gestionate, 1847+ tasks automatizate."},{icon:"🚀",name:"VentureAI",url:"ssocietyagents.lovable.app",desc:"1200+ utilizatori, 2.4M USD venituri generate."},{icon:"🧠",name:"PromptLab AI",url:"ssocietypromptlab.lovable.app",desc:"Testeaza prompts screening pe GPT-4, Claude, Gemini simultan."}]},
  {id:4,category:"Marketing",jobTitle:"Social Media Manager",risk:75,businessName:"Agentie Social Media 100% Automatizata",tagline:"4 platforme simultan, 30 posturi/luna per client, 2h supervizare/zi.",revenue:"3.000-12.000 EUR/luna",totalApiCost:"~5 USD/luna",color:"#fd79a8",
   apis:[{name:"Zernio API",cost:"~1 USD/luna",desc:"YouTube, TikTok, IG, LinkedIn simultan",badge:"LOW-COST"},{name:"DeepSeek API",cost:"~1 USD/luna",desc:"Captions, hashtags, scripturi",badge:"LOW-COST"},{name:"KIE.ai Images",cost:"~3 USD/luna",desc:"Imagini AI branded per client",badge:"LOW-COST"},{name:"Brave Search",cost:"GRATUIT",desc:"Trenduri continut viral zilnic",badge:"GRATUIT"},{name:"YouTube Data API",cost:"GRATUIT",desc:"6 upload-uri video/zi gratuit",badge:"GRATUIT"}],
   pipeline:["Agent Content - 30 posturi/luna per client","Agent Visual - Design AI per brand","Agent Schedule - Postare ore peak","Agent Analytics - Reach si engagement"],
   primiiClienti:["299 USD/luna per client (4 platforme)","Demo gratuit 7 zile cu rezultate reale","Nisa: restaurante, saloane, IMM-uri locale"],
   ssociety:[{icon:"🎬",name:"SSociety AI Studio",url:"ssocietyaistudio.lovable.app",desc:"Pipeline complet: script - video - posting 7+ platforme. 4.9/5 rating."},{icon:"🏢",name:"AdFusion",url:"ssocietyhub.store",desc:"Agentie publicitate 100% AI automatizata."},{icon:"🎭",name:"Creator Studio",url:"ssocietystudio.lovable.app",desc:"Idei virale, scenarii, calendar publicare YouTube/TikTok/IG."}]},
  {id:5,category:"Educatie",jobTitle:"Profesor / Tutor",risk:72,businessName:"Platforma Tutoriat AI Personalizat",tagline:"Lectii adaptate nivelului, quiz-uri automate, progres monitorizat.",revenue:"1.500-6.000 EUR/luna",totalApiCost:"~2 USD/luna",color:"#fdcb6e",
   apis:[{name:"DeepSeek API",cost:"~1 USD/luna",desc:"Lectii personalizate si quiz-uri",badge:"LOW-COST"},{name:"Amazon SES",cost:"GRATUIT",desc:"Raport progres saptamanal",badge:"GRATUIT"},{name:"Telegram Bot",cost:"GRATUIT",desc:"Bot tutoriat 24/7",badge:"GRATUIT"},{name:"YouTube Data API",cost:"GRATUIT",desc:"Lectii video canal privat",badge:"GRATUIT"}],
   pipeline:["Agent Tutor - Lectii adaptate nivelului","Agent Quiz - Teste personalizate","Agent Report - Progress saptamanal","Bot 24/7 - Raspunde instant"],
   primiiClienti:["49 USD/luna per student (scalabil la 100+)","499 USD/luna scoli private - o clasa intreaga","Nisa: matematica bac, limbi straine, programare"],
   ssociety:[{icon:"🧠",name:"LifeOS AI",url:"ssocietylifeos.lovable.app",desc:"Goal tracking, habit streaks, smart calendar AI."},{icon:"🚀",name:"VentureAI Learning Hub",url:"ssocietyagents.lovable.app",desc:"Module interactive cu quiz-uri si certificate."},{icon:"💫",name:"Aura AI",url:"ssocietystudio.lovable.app",desc:"Asistent AI cu personalitate configurabila per materie."}]},
  {id:6,category:"Marketing",jobTitle:"Specialist SEO",risk:70,businessName:"Agentie SEO AI - Articole + Audit + Rapoarte",tagline:"8 articole optimizate/luna, audit tehnic automat, raport PDF livrat.",revenue:"3.000-10.000 EUR/luna",totalApiCost:"~2 USD/luna",color:"#74b9ff",
   apis:[{name:"DeepSeek API",cost:"~1 USD/luna",desc:"Articole SEO 1500+ cuvinte",badge:"LOW-COST"},{name:"Brave Search API",cost:"GRATUIT",desc:"Research keywords zilnic",badge:"GRATUIT"},{name:"PageSpeed + GSC",cost:"GRATUIT",desc:"Audit tehnic complet",badge:"GRATUIT"},{name:"Jina AI Reader",cost:"GRATUIT",desc:"Analiza top 10 concurenta",badge:"GRATUIT"},{name:"Amazon SES",cost:"GRATUIT",desc:"Raport PDF lunar automat",badge:"GRATUIT"}],
   pipeline:["Agent Research - 50 keywords/zi","Agent Writer - Articol in 3 minute","Agent Audit - Scan tehnic saptamanal","Agent Report - PDF lunar automat"],
   primiiClienti:["399 USD/luna: 8 articole + audit + raport","Audit gratuit site - hook conversie","Nisa: e-commerce, clinici, agentii locale"],
   ssociety:[{icon:"🔎",name:"Mega SEO Audit Pro",url:"ssocietyhub.store",desc:"Audit complet: Core Web Vitals, meta tags, backlink-uri. Scor pe 100."},{icon:"🏆",name:"SEO Mastermind",url:"ssocietyhub.store",desc:"Enterprise: competitor intelligence, keyword gap, content strategy AI."},{icon:"🎯",name:"LeadGenius",url:"ssocietyhub.store",desc:"Clienti SEO calificati gata de contactat."}]},
  {id:7,category:"Finante",jobTitle:"Contabil / Expert Contabil",risk:85,businessName:"Firm CFO Fractional AI",tagline:"Rapoarte financiare automate, previziuni cashflow, alerta ANAF - 10+ IMM-uri simultan.",revenue:"3.000-9.000 EUR/luna",totalApiCost:"~2 USD/luna",color:"#00cec9",
   apis:[{name:"DeepSeek API",cost:"~1 USD/luna",desc:"Rapoarte narative financiare",badge:"LOW-COST"},{name:"Amazon SES",cost:"GRATUIT",desc:"Alerte ANAF si rapoarte",badge:"GRATUIT"},{name:"Google Sheets API",cost:"GRATUIT",desc:"Dashboard financiar live",badge:"GRATUIT"},{name:"Telegram Bot",cost:"GRATUIT",desc:"Alerte cashflow real-time",badge:"GRATUIT"},{name:"Jina AI Reader",cost:"GRATUIT",desc:"Monitor legislativ ANAF",badge:"GRATUIT"}],
   pipeline:["Agent CFO - P&L si cashflow lunar","Agent Tax - Calendar ANAF per client","Agent Report - Bilant narativ in romana","Agent Alert - Anomalii cheltuieli instant"],
   primiiClienti:["299 USD/luna per IMM: rapoarte + alerta + call CFO","10 clienti = 2990 EUR/luna recurent","Nisa: SRL-uri 1-10 angajati fara contabil intern"],
   ssociety:[{icon:"🌐",name:"Nexus Dashboard",url:"ssocietyhub.store",desc:"KPI-uri business real-time: venituri, cheltuieli, alerte automate."},{icon:"📈",name:"Claude Trading Agent",url:"societybot.online",desc:"Monitorizare investitii 24/7. 50+ indicatori tehnici."},{icon:"🚀",name:"Nexus 2027",url:"ssocietyhub.store",desc:"Management business complet cu planificare strategica AI."}]},
  {id:8,category:"Media",jobTitle:"Video Editor",risk:70,businessName:"Studio Video AI Semi-Automat",tagline:"Shorts, reclame, testimoniale - produse de AI, livrate in 24h.",revenue:"2.500-8.000 EUR/luna",totalApiCost:"~5 USD/luna",color:"#ff7675",
   apis:[{name:"KIE.ai Grok Video",cost:"~3 USD/luna",desc:"Generare video AI din prompt",badge:"LOW-COST"},{name:"KIE.ai Images",cost:"~2 USD/luna",desc:"Imagini cinematografice",badge:"LOW-COST"},{name:"DeepSeek API",cost:"GRATUIT",desc:"Scripturi, captions, voiceover",badge:"GRATUIT"},{name:"YouTube Data API",cost:"GRATUIT",desc:"Upload 6 video/zi gratuit",badge:"GRATUIT"},{name:"Amazon SES",cost:"GRATUIT",desc:"Livrare si factura automata",badge:"GRATUIT"}],
   pipeline:["Agent Script - Scenariu din brief client","Agent Visual - Imagini AI si compositing","Agent Assemble - Clip final cu muzica","Agent Publish - Upload YouTube si notificare"],
   primiiClienti:["99 USD per Short (60 sec) branduri locale","499 USD/luna - 6 Shorts si 1 reclama lunga","Nisa: restaurante, saloane, e-commerce"],
   ssociety:[{icon:"🎬",name:"SSociety AI Studio",url:"ssocietyaistudio.lovable.app",desc:"Script - video Kie.ai - thumbnail - 7+ platforme. 15 min de la idee la publicat."},{icon:"📸",name:"Snapshot Sparkle",url:"ssocietystudio.lovable.app",desc:"Foto - video captivant cu efecte cinematice. Export Reels, TikTok, Shorts."},{icon:"🍽",name:"Instant Menu Pictures",url:"mrdelivery.ro",desc:"Imagini Michelin-quality din text simplu. Bulk import, 4K, 60 sec/imagine."}]},
  {id:9,category:"Administratie",jobTitle:"Asistent Administrativ / Executiv",risk:80,businessName:"Birou Virtual AI 24/7",tagline:"Email management, programari, documente - automatizate pentru CEO-i ocupati.",revenue:"2.000-6.000 EUR/luna",totalApiCost:"~2 USD/luna",color:"#55efc4",
   apis:[{name:"DeepSeek API",cost:"~1 USD/luna",desc:"Draft emailuri, rezumate meeting",badge:"LOW-COST"},{name:"Google Calendar API",cost:"GRATUIT",desc:"Programari automate",badge:"GRATUIT"},{name:"Amazon SES",cost:"GRATUIT",desc:"Follow-up si reminder",badge:"GRATUIT"},{name:"Telegram Bot",cost:"GRATUIT",desc:"Asistent CEO 24/7",badge:"GRATUIT"},{name:"Jina AI Reader",cost:"GRATUIT",desc:"Rezumate contracte 30 sec",badge:"GRATUIT"}],
   pipeline:["Agent Calendar - Zero email scheduling","Agent Email - Draft si sortare inbox","Agent Docs - Rezumate instant","Bot CEO - Asistent Telegram oricand"],
   primiiClienti:["199 USD/luna per CEO sau fondator","Demo gratuit 7 zile - economia de timp masurata","Nisa: CEO startup-uri 2-10 angajati"],
   ssociety:[{icon:"⚙",name:"Automation Hub",url:"ssocietyhub.store",desc:"Comanda - WhatsApp - inventory - factura - email. Totul fara cod."},{icon:"🧠",name:"LifeOS AI",url:"ssocietylifeos.lovable.app",desc:"Smart Calendar AI, goal tracking, rutine automate."},{icon:"🚀",name:"VentureAI",url:"ssocietyagents.lovable.app",desc:"20h economiste/saptamana, 98% satisfactie clienti."}]},
  {id:10,category:"Date",jobTitle:"Analist Financiar / Data Scientist",risk:75,businessName:"Serviciu BI si Rapoarte Automate",tagline:"Dashboard-uri live, previziuni AI, rapoarte executive PDF livrate automat.",revenue:"3.500-12.000 EUR/luna",totalApiCost:"~2 USD/luna",color:"#0984e3",
   apis:[{name:"DeepSeek API",cost:"~1 USD/luna",desc:"Narative executive generate AI",badge:"LOW-COST"},{name:"Google Sheets API",cost:"GRATUIT",desc:"Dashboard live actualizat",badge:"GRATUIT"},{name:"Amazon SES",cost:"GRATUIT",desc:"Raport PDF prima zi a lunii",badge:"GRATUIT"},{name:"Jina AI Reader",cost:"GRATUIT",desc:"Date din rapoarte industrie",badge:"GRATUIT"},{name:"Brave Search",cost:"GRATUIT",desc:"Benchmark-uri real-time",badge:"GRATUIT"}],
   pipeline:["Agent Data - Proceseaza date multiple surse","Agent Forecast - Previziuni 3/6/12 luni","Agent Report - PDF 10 pagini automat","Agent KPI - Alerta deviere target"],
   primiiClienti:["599 USD/luna: dashboard + raport + alerta KPI","Audit gratuit date existente - hook principal","Nisa: companii 500k+ EUR cifra de afaceri"],
   ssociety:[{icon:"🤖",name:"Trading AI Fleet Dashboard",url:"societybot.online",desc:"8 boti activi, 124K+ USD equity, 161 tranzactii. P&L, win rate live."},{icon:"🌐",name:"Nexus Dashboard",url:"ssocietyhub.store",desc:"KPI-uri centralizate: venituri, cheltuieli, grafice interactive."},{icon:"📈",name:"BetSentiment AI",url:"societybot.shop",desc:"80% winrate, 1247 meciuri, +340% ROI. Analytics sentiment 10.000+ surse."}]},
  {id:11,category:"Marketing",jobTitle:"Email Marketer",risk:78,businessName:"Agentie Email Automation AI",tagline:"Secvente 10 emailuri scrise AI, A/B testing automat, open rate 40%+.",revenue:"2.500-8.000 EUR/luna",totalApiCost:"~2 USD/luna",color:"#a29bfe",
   apis:[{name:"DeepSeek API",cost:"~1 USD/luna",desc:"Secvente, subject lines, copy",badge:"LOW-COST"},{name:"Amazon SES",cost:"GRATUIT",desc:"62.000 emailuri/an gratuit",badge:"GRATUIT"},{name:"Brave Search",cost:"GRATUIT",desc:"Research audienta per nisa",badge:"GRATUIT"},{name:"Telegram Bot",cost:"GRATUIT",desc:"Alerte open rate live",badge:"GRATUIT"}],
   pipeline:["Agent Copy - Secventa 10 emailuri per funnel","Agent A/B - 3 subject lines simultan","Agent Track - Open rate si click rate","Agent Optimize - Ajusteaza automat"],
   primiiClienti:["399 USD/luna: 2 secvente + trimitere + raport","Audit gratuit campanii existente","Nisa: e-commerce, SaaS cu trial, coaches"],
   ssociety:[{icon:"🤖",name:"WhatsAll Bot",url:"mrdelivery.ro",desc:"Outreach B2B WhatsApp: mii de mesaje personalizate, anti-ban protection."},{icon:"🎯",name:"LeadGenius",url:"ssocietyhub.store",desc:"Lista curata prospecti calificati gata de contactat."},{icon:"🔥",name:"Viral Architect",url:"ssocietyhub.store",desc:"Campanii email si social cu potential viral."}]},
  {id:12,category:"Design",jobTitle:"Designer Grafic",risk:60,businessName:"Studio Design AI - Branding & Visual",tagline:"Identitate vizuala completa in 48h: logo, brand kit, template-uri social.",revenue:"2.000-7.000 EUR/luna",totalApiCost:"~4 USD/luna",color:"#fd79a8",
   apis:[{name:"KIE.ai Grok Images",cost:"~3 USD/luna",desc:"Logo-uri, ilustratii AI",badge:"LOW-COST"},{name:"Ideogram API",cost:"~1 USD/luna",desc:"Text pe imagini 95% acuratete",badge:"LOW-COST"},{name:"DeepSeek API",cost:"GRATUIT",desc:"Brief branding, copy prezentare",badge:"GRATUIT"},{name:"Amazon SES",cost:"GRATUIT",desc:"Livrare brand kit automat",badge:"GRATUIT"}],
   pipeline:["Agent Brand - 3 directii vizuale din brief","Agent Visual - Logo si culori si tipografie","Agent Kit - Brand kit complet asamblat","Agent Deliver - Livrare 48h si feedback"],
   primiiClienti:["299 USD brand kit: logo si culori si 5 template-uri","19 USD/template Canva (pasiv scalabil)","Nisa: startup-uri noi, restaurante, freelanceri"],
   ssociety:[{icon:"🎨",name:"AI Studio - Creatie Vizuala",url:"ssocietystudio.lovable.app",desc:"Logo-uri, bannere, postari social fara skills design. Export instant."},{icon:"✨",name:"Creative Studio",url:"ssocietystudio.lovable.app",desc:"Moodboard-uri, palete culori, concepte vizuale din brief simplu."},{icon:"🖼",name:"One Image Ad Engine",url:"ssocietyhub.store",desc:"O poza produs - campanie completa cu variante reclame A/B."}]},
  {id:13,category:"Juridic",jobTitle:"Paralegal / Clerk Juridic",risk:82,businessName:"Serviciu Juridic AI pentru IMM",tagline:"Contracte standard, GDPR, template-uri juridice - verificate, livrate instant.",revenue:"2.500-7.000 EUR/luna",totalApiCost:"~2 USD/luna",color:"#636e72",
   apis:[{name:"DeepSeek API",cost:"~1 USD/luna",desc:"Contracte, TOS, GDPR per industrie",badge:"LOW-COST"},{name:"Jina AI Reader",cost:"GRATUIT",desc:"Monitor modificari legislative",badge:"GRATUIT"},{name:"Amazon SES",cost:"GRATUIT",desc:"Livrare si alerte legislative",badge:"GRATUIT"},{name:"Telegram Bot",cost:"GRATUIT",desc:"Bot FAQ juridic 24/7",badge:"GRATUIT"}],
   pipeline:["Agent Contract - NDA, SLA, PFA, SRL generat","Agent GDPR - Politica per business","Agent Monitor - Alerta modificari legi","Bot FAQ - Raspunsuri juridice instant"],
   primiiClienti:["199 USD/luna: 5 contracte si GDPR si alerta legi","29 USD/template juridic pe Gumroad","Nisa: freelanceri, startup-uri, PFA-uri"],
   ssociety:[{icon:"🛡",name:"SecureScan Pro",url:"ssocietyhacking.lovable.app",desc:"100% Legea 161/2003. Rapoarte HackerOne ready."},{icon:"🏛",name:"GovRO Forum Public AI",url:"govro.online",desc:"17 departamente AI, monitor legislativ pe Constitutie."},{icon:"🔒",name:"SSocietySafe",url:"ssocietyhacking.lovable.app",desc:"GDPR compliant, 10.000+ vulnerabilitati gasite."}]},
  {id:14,category:"Servicii",jobTitle:"Agent Customer Service",risk:72,businessName:"Agentie Customer Success AI 24/7",tagline:"Bot suport AI cu personalitate de brand, escalare inteligenta, CSAT automat.",revenue:"2.000-8.000 EUR/luna",totalApiCost:"~2 USD/luna",color:"#74b9ff",
   apis:[{name:"DeepSeek API",cost:"~1 USD/luna",desc:"Raspunsuri contextuale si escalare",badge:"LOW-COST"},{name:"Telegram Bot",cost:"GRATUIT",desc:"Suport 24/7 Telegram/WhatsApp",badge:"GRATUIT"},{name:"Amazon SES",cost:"GRATUIT",desc:"Email suport si CSAT survey",badge:"GRATUIT"},{name:"Google Sheets",cost:"GRATUIT",desc:"Dashboard CSAT live",badge:"GRATUIT"}],
   pipeline:["Bot Support - 80% intrebari automat","Agent Escalate - Cazuri complexe la uman","Agent CSAT - Survey la 24h post-rezolvare","Dashboard KPI - Suport real-time"],
   primiiClienti:["299 USD/luna per brand: bot si 1000 interactiuni","Demo bot live pe site-ul lor in 48h","Nisa: e-commerce, SaaS, platforme online"],
   ssociety:[{icon:"🤖",name:"AI Assistant Clienti Restaurant",url:"mrdelivery.ro",desc:"Meniu, preturi, alergeni, comenzi, 24/7. Integrat WhatsApp sau site."},{icon:"🤵",name:"MisterDelivery Bot",url:"mrdelivery.ro",desc:"Chelner virtual 24/7: comenzi, recomandari, cereri speciale."},{icon:"💫",name:"Aura AI",url:"ssocietystudio.lovable.app",desc:"Personalitate configurabila per brand. Nu suna a bot."}]},
  {id:15,category:"Transport",jobTitle:"Taximetrist / Sofer Livrare",risk:85,businessName:"Serviciu Logistica si Optimizare Rute AI",tagline:"Rute optimizate, tracking real-time, raport eficienta combustibil - plug and play.",revenue:"1.500-4.000 EUR/luna",totalApiCost:"~2 USD/luna",color:"#b2bec3",
   apis:[{name:"Google Maps API",cost:"GRATUIT",desc:"Optimizare rute multi-stop",badge:"GRATUIT"},{name:"DeepSeek API",cost:"~1 USD/luna",desc:"Raport eficienta flota",badge:"LOW-COST"},{name:"Telegram Bot",cost:"GRATUIT",desc:"Ruta optima direct pe telefon",badge:"GRATUIT"},{name:"Amazon SES",cost:"GRATUIT",desc:"Raport lunar per vehicul",badge:"GRATUIT"},{name:"Google Sheets",cost:"GRATUIT",desc:"Dashboard flota live",badge:"GRATUIT"}],
   pipeline:["Agent Route - 10 stopuri optimizate in 5 sec","Agent Track - Locatie flota real-time","Agent Fuel - Cost combustibil per livrare","Agent Fleet - Raport eficienta lunar"],
   primiiClienti:["149 USD/luna per vehicul (minim 5 vehicule)","Demo gratuit 14 zile firma curierat locala","Nisa: curierat, catering, service cu deplasari"],
   ssociety:[{icon:"🚙",name:"MB EuroParts",url:"mbeuroparts.lovable.app",desc:"15K+ piese, 200+ modele, livrare 24h. Mentenanta flota."},{icon:"🚗",name:"Alex Mercedes",url:"ssocietyhub.store",desc:"Platforma auto: portofoliu vehicule, specificatii, test drive."},{icon:"⚙",name:"Automation Hub",url:"ssocietyhub.store",desc:"Comanda - alocare sofer - tracking - factura. Zero manual."}]},
];

const CATS = ["Toate","Marketing","Imobiliare","HR","Finante","Date","Media","Design","Juridic","Servicii","Transport","Administratie","Educatie"];

function rc(r:number){return r>=85?"#dc3545":r>=70?"#fd7e14":"#28a745";}
function rl(r:number){return r>=85?"CRITIC":r>=70?"RIDICAT":"MEDIU";}

export default function AfacereLaCheiePage({ onClose }: { onClose?: () => void }){
  const [cat,setCat]=useState("Toate");
  const [sel,setSel]=useState<Business|null>(null);
  const [tab,setTab]=useState<"api"|"pipeline"|"clienti"|"ssociety">("api");
  const list=cat==="Toate"?B:B.filter(b=>b.category===cat);

  if(sel){document.body.style.overflow="hidden";
    return(
      <div style={{position:"fixed",top:0,left:0,right:0,bottom:0,zIndex:99999,overflowY:"auto",background:"#f8f9fa",fontFamily:"Syne,Arial,sans-serif"}}><button onClick={()=>onClose&&onClose()} style={{position:"fixed",top:16,left:16,zIndex:999999,background:"linear-gradient(135deg,#f6c90e,#e0a800)",border:"none",borderRadius:10,padding:"10px 20px",color:"#1a1a1a",fontWeight:900,fontSize:13,cursor:"pointer",boxShadow:"0 4px 12px rgba(246,201,14,0.5)"}}>← Back to 🇷🇴 DaRomania</button>
        <div style={{background:"#fff",borderBottom:"1px solid #e9ecef",padding:"14px 24px",display:"flex",alignItems:"center",gap:16,position:"sticky",top:0,zIndex:10}}>
          <button onClick={()=>{setSel(null);setTab("api");document.body.style.overflow="auto";}} style={{background:"linear-gradient(135deg,#f6c90e,#e0a800)",border:"none",borderRadius:10,padding:"10px 20px",color:"#1a1a1a",fontWeight:900,fontSize:13,cursor:"pointer",boxShadow:"0 2px 8px rgba(246,201,14,0.4)"}}>← Back to 🇷🇴 DaRomania</button>
          <div style={{flex:1,fontSize:13,fontWeight:700,color:sel.color}}>{sel.businessName}</div>
          <button onClick={()=>window.location.href="/#pricing"} style={{background:"linear-gradient(135deg,#6c47ff,"+sel.color+")",border:"none",borderRadius:8,padding:"10px 20px",color:"#fff",fontWeight:800,fontSize:13,cursor:"pointer"}}>Incepe 99 USD/luna</button>
        </div>
        <div style={{maxWidth:900,margin:"0 auto",padding:"28px 20px 60px"}}>
          <div style={{background:"#fff",borderRadius:16,border:"1px solid #e9ecef",padding:"28px",marginBottom:20,boxShadow:"0 2px 8px rgba(0,0,0,0.05)"}}>
            <div style={{display:"flex",gap:8,marginBottom:14,flexWrap:"wrap"}}>
              <span style={{fontSize:11,fontWeight:800,padding:"4px 12px",borderRadius:20,background:rc(sel.risk)+"22",color:rc(sel.risk)}}>{sel.risk}% RISC - {rl(sel.risk)}</span>
              <span style={{fontSize:11,padding:"4px 12px",borderRadius:20,background:"#f8f9fa",color:"#6c757d",fontWeight:700}}>{sel.jobTitle}</span>
            </div>
            <h1 style={{fontSize:"clamp(20px,4vw,32px)",fontWeight:900,color:sel.color,margin:"0 0 10px"}}>{sel.businessName}</h1>
            <p style={{fontSize:15,color:"#6c757d",lineHeight:1.7,margin:"0 0 22px"}}>{sel.tagline}</p>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14}}>
              {[["Venit estimat",sel.revenue,"#0d0d1a"],["Cost API-uri",sel.totalApiCost,"#28a745"],["Tu platesti","99 USD/luna","#6c47ff"]].map(([label,val,col])=>(
                <div key={String(label)} style={{background:"#f8f9fa",borderRadius:12,padding:"14px 16px",textAlign:"center"}}>
                  <div style={{fontSize:10,color:"#adb5bd",fontWeight:700,textTransform:"uppercase",marginBottom:4}}>{label}</div>
                  <div style={{fontSize:17,fontWeight:900,color:String(col)}}>{val}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{background:"#fff",borderRadius:16,border:"1px solid #e9ecef",overflow:"hidden",boxShadow:"0 2px 8px rgba(0,0,0,0.05)"}}>
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",borderBottom:"1px solid #e9ecef"}}>
              {([["api","API-uri"],["pipeline","Pipeline"],["clienti","Clienti"],["ssociety","SSociety"]] as const).map(([t,l])=>(
                <button key={t} onClick={()=>setTab(t)} style={{padding:"13px 8px",border:"none",background:tab===t?"#fff":"#f8f9fa",color:tab===t?"#6c47ff":"#6c757d",fontWeight:700,fontSize:12,cursor:"pointer",borderBottom:tab===t?"3px solid "+sel.color:"3px solid transparent",transition:"all .2s"}}>{l}</button>
              ))}
            </div>
            <div style={{padding:"26px"}}>
              {tab==="api"&&(
                <div>
                  <p style={{color:"#6c757d",fontSize:14,marginBottom:18}}>Stack-ul complet configurat in <strong>48h</strong>. Cost real total: <strong style={{color:"#28a745"}}>{sel.totalApiCost}</strong></p>
                  <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:12}}>
                    {sel.apis.map((a,i)=>(
                      <div key={i} style={{background:"#f8f9fa",borderRadius:12,padding:"14px 16px",border:"1px solid #e9ecef"}}>
                        <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                          <span style={{fontWeight:800,fontSize:13,color:"#0d0d1a"}}>{a.name}</span>
                          {a.badge&&<span style={{fontSize:9,fontWeight:800,padding:"2px 7px",borderRadius:8,background:a.badge==="GRATUIT"?"#d4edda":"#e8e4ff",color:a.badge==="GRATUIT"?"#155724":"#4a2db0"}}>{a.badge}</span>}
                        </div>
                        <div style={{fontSize:12,color:"#6c757d",marginBottom:6}}>{a.desc}</div>
                        <div style={{fontSize:15,fontWeight:900,color:a.badge==="GRATUIT"?"#28a745":"#6c47ff"}}>{a.cost}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{marginTop:18,background:"#f0ecff",borderRadius:12,padding:"18px 22px",border:"1px solid #d0c6ff",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:12}}>
                    <div><div style={{fontSize:10,color:"#6c47ff",fontWeight:700,textTransform:"uppercase"}}>Cost real total</div><div style={{fontSize:22,fontWeight:900,color:"#28a745"}}>{sel.totalApiCost}</div></div>
                    <div style={{textAlign:"right"}}><div style={{fontSize:10,color:"#6c47ff",fontWeight:700,textTransform:"uppercase"}}>Tu platesti</div><div style={{fontSize:22,fontWeight:900,color:"#6c47ff"}}>99 USD/luna</div><div style={{fontSize:11,color:"#adb5bd"}}>diferenta = expertiza noastra</div></div>
                  </div>
                </div>
              )}
              {tab==="pipeline"&&(
                <div>
                  <p style={{color:"#6c757d",fontSize:14,marginBottom:22}}>Tu esti directorul. Agentii AI lucreaza <strong>24/7</strong>.</p>
                  {sel.pipeline.map((step,i)=>(
                    <div key={i} style={{display:"flex",gap:14,marginBottom:14,alignItems:"flex-start"}}>
                      <div style={{width:34,height:34,borderRadius:"50%",background:i===0?sel.color:"#f8f9fa",border:"2px solid "+sel.color,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,fontSize:12,flexShrink:0,color:i===0?"#fff":sel.color}}>{i+1}</div>
                      <div style={{background:"#f8f9fa",borderRadius:12,padding:"13px 16px",flex:1,border:"1px solid #e9ecef",fontSize:14,color:"#495057",lineHeight:1.5}}>{step}</div>
                    </div>
                  ))}
                  <div style={{marginTop:22,background:"#f8f9fa",borderRadius:12,padding:"18px",border:"1px solid #e9ecef"}}>
                    <div style={{fontWeight:800,color:"#0d0d1a",marginBottom:12,fontSize:14}}>Ce facem noi in 99 USD/luna:</div>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                      {["Setup complet stack tehnic in 48h","Senior alocat 1:1 saptamanal (call 45 min)","Dashboard live: postari, leads, conversii","Script exact pentru primii 10 clienti"].map((item,i)=>(
                        <div key={i} style={{background:"#fff",borderRadius:10,padding:"11px 13px",border:"1px solid #e9ecef",fontSize:13,color:"#495057"}}>Ok {item}</div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              {tab==="clienti"&&(
                <div>
                  <p style={{color:"#6c757d",fontSize:14,marginBottom:18}}>Strategia exacta pentru primii clienti platitori:</p>
                  {sel.primiiClienti.map((item,i)=>(
                    <div key={i} style={{display:"flex",gap:12,marginBottom:12,background:i===0?sel.color+"12":"#f8f9fa",borderRadius:12,padding:"16px 18px",border:"1px solid "+(i===0?sel.color+"44":"#e9ecef")}}>
                      <div style={{width:30,height:30,borderRadius:"50%",background:i===0?sel.color:"#dee2e6",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,fontSize:12,flexShrink:0,color:i===0?"#fff":"#6c757d"}}>{i+1}</div>
                      <div style={{fontSize:14,color:"#495057",lineHeight:1.6,paddingTop:3}}>{item}</div>
                    </div>
                  ))}
                  <div style={{marginTop:18,background:"#f8f9fa",borderRadius:12,padding:"22px",border:"1px solid #e9ecef"}}>
                    <div style={{fontWeight:800,color:"#0d0d1a",marginBottom:14,fontSize:14}}>Roadmap 90 de zile:</div>
                    {[["Ziua 1-2","Setup complet","API-uri conectate, testate, calibrate pe nisa ta."],["Saptamana 1","Primele rezultate live","Pipeline ruleaza, primul raport cu metrici reale."],["Luna 1-2","Primii clienti platitori","Primii 500-1500 EUR din businessul tau nou."],["Luna 3+","Scale recurent",sel.revenue+" lunar recurent."]].map(([phase,title,desc],i)=>(
                      <div key={i} style={{display:"flex",gap:14,marginBottom:12}}>
                        <div style={{fontSize:11,fontWeight:800,color:sel.color,minWidth:88,paddingTop:2}}>{phase}</div>
                        <div><div style={{fontSize:13,fontWeight:700,color:"#0d0d1a",marginBottom:2}}>{title}</div><div style={{fontSize:12,color:"#6c757d"}}>{desc}</div></div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {tab==="ssociety"&&(
                <div>
                  <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:18,background:sel.color+"12",borderRadius:12,padding:"14px 18px",border:"1px solid "+sel.color+"33"}}>
                    <div style={{fontSize:26}}>🏆</div>
                    <div><div style={{fontSize:15,fontWeight:800,color:"#0d0d1a"}}>Exemple reale din SSociety</div><div style={{fontSize:13,color:"#6c757d"}}>71 proiecte active construite in ecosistemul nostru</div></div>
                  </div>
                  {sel.ssociety.map((ex,i)=>(
                    <a key={i} href={"https://"+ex.url} target="_blank" rel="noopener noreferrer"
                      style={{display:"flex",gap:14,alignItems:"flex-start",background:"#f8f9fa",borderRadius:12,padding:"16px 18px",marginBottom:10,border:"1px solid #e9ecef",textDecoration:"none",color:"inherit",transition:"all .2s"}}
                      onMouseOver={e=>{e.currentTarget.style.borderColor=sel.color;e.currentTarget.style.background=sel.color+"10";}}
                      onMouseOut={e=>{e.currentTarget.style.borderColor="#e9ecef";e.currentTarget.style.background="#f8f9fa";}}>
                      <div style={{fontSize:26,flexShrink:0}}>{ex.icon}</div>
                      <div style={{flex:1}}>
                        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
                          <span style={{fontSize:14,fontWeight:800,color:"#0d0d1a"}}>{ex.name}</span>
                          <span style={{fontSize:9,padding:"2px 7px",borderRadius:8,background:"#d4edda",color:"#155724",fontWeight:800}}>LIVE</span>
                        </div>
                        <div style={{fontSize:13,color:"#6c757d",lineHeight:1.5,marginBottom:5}}>{ex.desc}</div>
                        <div style={{fontSize:11,color:sel.color,fontWeight:700}}>{ex.url}</div>
                      </div>
                      <div style={{color:"#dee2e6",fontSize:18,flexShrink:0}}>-&gt;</div>
                    </a>
                  ))}
                  <div style={{marginTop:6,background:"#f8f9fa",borderRadius:12,padding:"14px 18px",border:"1px solid #e9ecef",textAlign:"center"}}>
                    <div style={{fontSize:13,fontWeight:700,color:"#0d0d1a",marginBottom:5}}>Toate cele 71 de proiecte SSociety</div>
                    <a href="https://ssociety.eu" target="_blank" rel="noopener noreferrer" style={{fontSize:13,color:sel.color,fontWeight:700,textDecoration:"none"}}>ssociety.eu</a>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div style={{marginTop:20,background:"#fff",borderRadius:16,border:"2px solid "+sel.color+"44",padding:"26px",textAlign:"center",boxShadow:"0 2px 8px rgba(0,0,0,0.05)"}}>
            <div style={{fontSize:18,fontWeight:900,color:"#0d0d1a",marginBottom:8}}>Vrei <span style={{color:sel.color}}>{sel.businessName}</span> live in 48h?</div>
            <div style={{fontSize:14,color:"#6c757d",marginBottom:18}}>Selectezi meseria, noi configuram tot. Tu supervizezi 2h/zi.</div>
            <button onClick={()=>window.location.href="/#pricing"} style={{background:"linear-gradient(135deg,#6c47ff,"+sel.color+")",border:"none",borderRadius:12,padding:"15px 40px",color:"#fff",fontSize:16,fontWeight:900,cursor:"pointer"}}>Incepe cu 99 USD/luna</button>
            <div style={{display:"flex",gap:20,justifyContent:"center",marginTop:12,fontSize:12,color:"#adb5bd"}}><span>48h setup</span><span>Anulezi oricand</span><span>20 locuri</span></div>
          </div>
        </div>
      </div>
    );
  }

  return(
    <div style={{position:"fixed",top:0,left:0,right:0,bottom:0,zIndex:99999,overflowY:"auto",background:"#f8f9fa",fontFamily:"Syne,Arial,sans-serif"}}><button onClick={()=>onClose&&onClose()} style={{position:"fixed",top:16,left:16,zIndex:999999,background:"linear-gradient(135deg,#f6c90e,#e0a800)",border:"none",borderRadius:10,padding:"10px 20px",color:"#1a1a1a",fontWeight:900,fontSize:13,cursor:"pointer",boxShadow:"0 4px 12px rgba(246,201,14,0.5)"}}>← Back to 🇷🇴 DaRomania</button>
      <div style={{background:"#fff",borderBottom:"1px solid #e9ecef",padding:"16px 20px 28px",textAlign:"center"}}><div style={{textAlign:"left",marginBottom:12}}><button onClick={()=>onClose&&onClose()} style={{background:"linear-gradient(135deg,#f6c90e,#e0a800)",border:"none",borderRadius:10,padding:"10px 20px",color:"#1a1a1a",fontWeight:900,fontSize:13,cursor:"pointer",boxShadow:"0 2px 8px rgba(246,201,14,0.4)"}}>← Back to 🇷🇴 DaRomania</button></div>
        <div style={{fontSize:11,color:"#6c47ff",letterSpacing:3,fontWeight:700,textTransform:"uppercase",marginBottom:10}}>SSociety x DaRomania - 71 Proiecte Active</div>
        <h1 style={{fontSize:"clamp(24px,5vw,44px)",fontWeight:900,margin:"0 0 10px",color:"#0d0d1a"}}>Afacere la Cheie <span style={{color:"#6c47ff"}}>- 99 USD/luna</span></h1>
        <p style={{color:"#6c757d",maxWidth:520,margin:"0 auto 18px",lineHeight:1.7,fontSize:15}}>Selectezi meseria ta. Noi configuram stack-ul AI complet in 48h. Tu supervizezi 2h/zi si incasezi recurent.</p>
        <div style={{display:"flex",gap:20,justifyContent:"center",flexWrap:"wrap",fontSize:13,color:"#6c757d"}}>
          <span>{B.length} afaceri</span><span>API-uri 90% gratuite</span><span>Setup 48h</span><span>Anulezi oricand</span>
        </div>
      </div>
      <div style={{background:"#fff",borderBottom:"1px solid #e9ecef",padding:"10px 20px",display:"flex",gap:8,flexWrap:"wrap",justifyContent:"center"}}>
        {CATS.map(c=>{
          const n=c==="Toate"?B.length:B.filter(b=>b.category===c).length;
          return(<button key={c} onClick={()=>setCat(c)} style={{padding:"5px 14px",borderRadius:20,border:"1px solid",borderColor:cat===c?"#6c47ff":"#dee2e6",background:cat===c?"#6c47ff":"#fff",color:cat===c?"#fff":"#6c757d",cursor:"pointer",fontSize:12,fontWeight:600}}>{c} ({n})</button>);
        })}
      </div>
      <div style={{maxWidth:1200,margin:"0 auto",padding:"28px 20px 60px"}}>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:18}}>
          {list.map(b=>(
            <div key={b.id} onClick={()=>{setSel(b);setTab("api");window.scrollTo(0,0);}}
              style={{background:"#fff",borderRadius:16,border:"1px solid #e9ecef",padding:"22px",cursor:"pointer",transition:"all .2s",boxShadow:"0 2px 6px rgba(0,0,0,0.04)"}}
              onMouseOver={e=>{e.currentTarget.style.borderColor=b.color;e.currentTarget.style.boxShadow="0 8px 24px "+b.color+"25";e.currentTarget.style.transform="translateY(-2px)";}}
              onMouseOut={e=>{e.currentTarget.style.borderColor="#e9ecef";e.currentTarget.style.boxShadow="0 2px 6px rgba(0,0,0,0.04)";e.currentTarget.style.transform="translateY(0)";}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}>
                <span style={{fontSize:10,fontWeight:800,padding:"3px 10px",borderRadius:20,background:rc(b.risk)+"18",color:rc(b.risk)}}>{b.risk}% {rl(b.risk)}</span>
                <span style={{fontSize:10,padding:"3px 10px",borderRadius:20,background:"#f8f9fa",color:"#6c757d",fontWeight:700}}>{b.category}</span>
              </div>
              <div style={{fontSize:11,color:"#adb5bd",marginBottom:3}}>{b.jobTitle}</div>
              <h3 style={{fontSize:16,fontWeight:900,color:b.color,margin:"0 0 7px",lineHeight:1.3}}>{b.businessName}</h3>
              <p style={{fontSize:12,color:"#6c757d",lineHeight:1.5,margin:"0 0 14px"}}>{b.tagline}</p>
              <div style={{display:"flex",justifyContent:"space-between",padding:"10px 14px",background:"#f8f9fa",borderRadius:10,marginBottom:14}}>
                <div><div style={{fontSize:9,color:"#adb5bd",fontWeight:700,textTransform:"uppercase"}}>Venit</div><div style={{fontSize:13,fontWeight:900,color:"#0d0d1a"}}>{b.revenue}</div></div>
                <div style={{textAlign:"center"}}><div style={{fontSize:9,color:"#adb5bd",fontWeight:700,textTransform:"uppercase"}}>API-uri</div><div style={{fontSize:13,fontWeight:900,color:"#28a745"}}>{b.totalApiCost}</div></div>
                <div style={{textAlign:"right"}}><div style={{fontSize:9,color:"#adb5bd",fontWeight:700,textTransform:"uppercase"}}>Tu platesti</div><div style={{fontSize:13,fontWeight:900,color:"#6c47ff"}}>99 USD/luna</div></div>
              </div>
              <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:14}}>
                {b.apis.slice(0,3).map((a,i)=>(<span key={i} style={{fontSize:10,padding:"2px 7px",borderRadius:8,background:a.badge==="GRATUIT"?"#d4edda":"#e8e4ff",color:a.badge==="GRATUIT"?"#155724":"#4a2db0",fontWeight:700}}>{a.name}</span>))}
                {b.apis.length>3&&<span style={{fontSize:10,padding:"2px 7px",borderRadius:8,background:"#f8f9fa",color:"#6c757d",fontWeight:700}}>+{b.apis.length-3}</span>}
              </div>
              <button style={{width:"100%",background:"linear-gradient(135deg,#6c47ff,"+b.color+")",border:"none",borderRadius:10,padding:"11px",color:"#fff",fontWeight:800,fontSize:12,cursor:"pointer"}}>Vezi detalii complete</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
