import { useState, useMemo } from 'react';
import { JOBS_LIST } from './constants';

const API_CATALOG = {
  'AI & Text': [
    { name: 'Google Gemini', desc: 'Gratuit 1M tokeni/zi', price: 'FREE', url: 'https://aistudio.google.com' },
    { name: 'Groq API', desc: 'Llama ultra rapid, gratuit', price: 'FREE', url: 'https://console.groq.com' },
    { name: 'DeepSeek API', desc: 'Cel mai ieftin LLM', price: '$0.0001/1k', url: 'https://platform.deepseek.com' },
    { name: 'Together AI', desc: '$5 credit gratuit', price: 'FREE start', url: 'https://api.together.xyz' },
    { name: 'Hugging Face', desc: '100K+ modele gratuite', price: 'FREE', url: 'https://huggingface.co' },
    { name: 'OpenRouter', desc: 'Acces toate modelele', price: 'Pay per use', url: 'https://openrouter.ai' },
    { name: 'Mistral AI', desc: 'Modele europene top', price: 'FREE tier', url: 'https://mistral.ai' },
    { name: 'Cloudflare Workers AI', desc: 'AI la edge, ultra rapid', price: 'FREE 10k/zi', url: 'https://ai.cloudflare.com' },
    { name: 'xAI Grok', desc: '$25 credit gratuit', price: 'FREE start', url: 'https://console.x.ai' },
    { name: 'Perplexity API', desc: 'Search + AI combinat', price: '$5/lună', url: 'https://docs.perplexity.ai' },
  ],
  'Imagini & Video': [
    { name: 'Stability AI', desc: 'Generare imagini premium', price: '$10/lună', url: 'https://stability.ai' },
    { name: 'Ideogram', desc: 'Text în imagini perfect', price: 'FREE tier', url: 'https://ideogram.ai' },
    { name: 'Flux via HuggingFace', desc: 'Imagini HD gratuit', price: 'FREE', url: 'https://huggingface.co/black-forest-labs' },
    { name: 'ElevenLabs', desc: 'Voce AI ultra realistă', price: 'FREE 10k/lună', url: 'https://elevenlabs.io' },
    { name: 'Suno AI', desc: 'Muzică completă din text', price: '$8/lună', url: 'https://suno.com' },
    { name: 'D-ID', desc: 'Avataruri video vorbătoare', price: '$5.99/lună', url: 'https://d-id.com' },
    { name: 'HeyGen', desc: 'Video avatar profesional', price: '$29/lună', url: 'https://heygen.com' },
    { name: 'Remove.bg', desc: 'Background removal instant', price: '$9/50 credite', url: 'https://remove.bg' },
    { name: 'Leonardo AI', desc: 'Imagini AI creative', price: 'FREE 150/zi', url: 'https://leonardo.ai' },
    { name: 'Runway ML', desc: 'Video AI avansat', price: '$12/lună', url: 'https://runwayml.com' },
  ],
  'Date & Business': [
    { name: 'Stripe', desc: 'Plăți + subscripții', price: '2.9%+$0.30', url: 'https://stripe.com' },
    { name: 'Supabase', desc: 'DB + Auth + Storage gratuit', price: 'FREE tier', url: 'https://supabase.com' },
    { name: 'Resend', desc: 'Email transacțional', price: 'FREE 3k/lună', url: 'https://resend.com' },
    { name: 'Twilio', desc: 'SMS + WhatsApp + Voice', price: '$0.0079/SMS', url: 'https://twilio.com' },
    { name: 'Alpha Vantage', desc: 'Date piețe financiare', price: 'FREE 25/zi', url: 'https://alphavantage.co' },
    { name: 'Airtable', desc: 'DB vizual no-code', price: 'FREE tier', url: 'https://airtable.com' },
    { name: 'Notion API', desc: 'Workspace automatizat', price: 'FREE', url: 'https://developers.notion.com' },
    { name: 'Google Sheets API', desc: 'Spreadsheet ca backend', price: 'FREE', url: 'https://developers.google.com/sheets' },
    { name: 'Firebase', desc: 'Realtime DB + hosting', price: 'FREE Spark', url: 'https://firebase.google.com' },
    { name: 'CoinGecko', desc: 'Date crypto în timp real', price: 'FREE 10k/lună', url: 'https://coingecko.com/api' },
  ],
  'Web & SEO': [
    { name: 'SerpAPI', desc: '100 căutări/lună gratuit', price: 'FREE 100/lună', url: 'https://serpapi.com' },
    { name: 'Jina AI Reader', desc: 'Scraping gratuit orice URL', price: 'FREE', url: 'https://jina.ai' },
    { name: 'Firecrawl', desc: 'Web scraping pentru AI', price: 'FREE 500/lună', url: 'https://firecrawl.dev' },
    { name: 'Brave Search API', desc: '2000 căutări/lună gratuit', price: 'FREE 2k/lună', url: 'https://api.search.brave.com' },
    { name: 'Exa AI', desc: 'Search semantic avansat', price: 'FREE 1k/lună', url: 'https://exa.ai' },
    { name: 'PageSpeed Insights', desc: 'Audit SEO tehnic', price: 'FREE', url: 'https://pagespeed.web.dev' },
    { name: 'Apify', desc: 'Scraping scalabil', price: 'FREE $5/lună', url: 'https://apify.com' },
    { name: 'Cloudflare Analytics', desc: 'Analytics fără cookies', price: 'FREE', url: 'https://cloudflare.com/analytics' },
    { name: 'Google Search Console', desc: 'Date SEO oficiale Google', price: 'FREE', url: 'https://search.google.com/search-console' },
    { name: 'ScraperAPI', desc: 'Proxy rotation automat', price: 'FREE 1k/lună', url: 'https://scraperapi.com' },
  ],
  'Social & Outreach': [
    { name: 'Telegram Bot API', desc: '100% gratuit, nelimitat', price: 'FREE', url: 'https://core.telegram.org/bots' },
    { name: 'Twitter/X API', desc: 'Free tier disponibil', price: 'FREE tier', url: 'https://developer.twitter.com' },
    { name: 'YouTube Data API', desc: 'Date canal și videouri', price: 'FREE 10k/zi', url: 'https://developers.google.com/youtube' },
    { name: 'WhatsApp Business API', desc: 'Mesagerie business', price: 'FREE 1k/lună', url: 'https://business.whatsapp.com' },
    { name: 'Discord Bot API', desc: 'Comunitate automată', price: 'FREE', url: 'https://discord.com/developers' },
    { name: 'Reddit API', desc: 'Date comunități', price: 'FREE tier', url: 'https://www.reddit.com/dev/api' },
    { name: 'LinkedIn API', desc: 'Rețea profesională', price: 'Aplicație necesară', url: 'https://developer.linkedin.com' },
    { name: 'Slack API', desc: 'Automatizare echipă', price: 'FREE', url: 'https://api.slack.com' },
    { name: 'Mailchimp API', desc: 'Email marketing', price: 'FREE 500 contacte', url: 'https://mailchimp.com/developer' },
    { name: 'SendGrid', desc: 'Email în masă', price: 'FREE 100/zi', url: 'https://sendgrid.com' },
  ],
  'Productivitate': [
    { name: 'Google Calendar API', desc: 'Calendar + programări', price: 'FREE', url: 'https://developers.google.com/calendar' },
    { name: 'Gmail API', desc: 'Email automat', price: 'FREE', url: 'https://developers.google.com/gmail' },
    { name: 'Google Drive API', desc: 'Storage + docs auto', price: 'FREE 15GB', url: 'https://developers.google.com/drive' },
    { name: 'Calendly API', desc: 'Programări automate', price: 'FREE tier', url: 'https://developer.calendly.com' },
    { name: 'DocuSign', desc: 'Semnături digitale', price: '$10/lună', url: 'https://developers.docusign.com' },
    { name: 'Zoom API', desc: 'Video meetings automate', price: 'FREE tier', url: 'https://developers.zoom.us' },
    { name: 'Zapier Webhooks', desc: 'Automatizare no-code', price: 'FREE 100/lună', url: 'https://zapier.com' },
    { name: 'Hunter.io', desc: 'Găsire emailuri business', price: 'FREE 25/lună', url: 'https://hunter.io' },
    { name: 'Bannerbear', desc: 'Imagini generate automat', price: '$49/lună', url: 'https://bannerbear.com' },
    { name: 'PDF.co', desc: 'PDF generate și editate', price: 'FREE 100/zi', url: 'https://pdf.co' },
  ],
};

const CATEGORY_API_MAP: Record<string, string[]> = {
  'Comunicare': ['AI & Text', 'Social & Outreach', 'Productivitate'],
  'Cercetare': ['AI & Text', 'Web & SEO', 'Date & Business'],
  'Stiinta': ['AI & Text', 'Date & Business', 'Web & SEO'],
  'Scriere': ['AI & Text', 'Productivitate', 'Web & SEO'],
  'Tehnologie': ['AI & Text', 'Web & SEO', 'Date & Business'],
  'Creativitate': ['AI & Text', 'Imagini & Video', 'Social & Outreach'],
  'Date': ['AI & Text', 'Date & Business', 'Web & SEO'],
  'Business': ['AI & Text', 'Date & Business', 'Social & Outreach'],
  'Media': ['AI & Text', 'Imagini & Video', 'Social & Outreach'],
  'Finante': ['AI & Text', 'Date & Business', 'Productivitate'],
  'Servicii': ['AI & Text', 'Productivitate', 'Social & Outreach'],
  'Retail': ['AI & Text', 'Date & Business', 'Productivitate'],
  'Imobiliare': ['AI & Text', 'Imagini & Video', 'Web & SEO'],
  'Juridic': ['AI & Text', 'Productivitate', 'Date & Business'],
  'HR': ['AI & Text', 'Productivitate', 'Social & Outreach'],
  'Design': ['Imagini & Video', 'AI & Text', 'Social & Outreach'],
  'Marketing': ['AI & Text', 'Social & Outreach', 'Web & SEO'],
  'Educatie': ['AI & Text', 'Productivitate', 'Social & Outreach'],
  'Administratie': ['AI & Text', 'Productivitate', 'Date & Business'],
};

const STEPS_BY_CATEGORY: Record<string, string[]> = {
  'AI & Text': [
    'Creează cont gratuit pe Groq sau Google Gemini — obții API key instant',
    'Construiește un portal simplu (React + Express) unde clienții trimit cereri',
    'Automatizează răspunsurile cu prompt-uri specializate pe domeniul tău',
    'Adaugă Stripe pentru subscripții lunare $19-$99/lună',
    'Scalezi la 50 clienți recurenți = €1.000-€5.000/lună pasiv',
  ],
  'Imagini & Video': [
    'Creează cont pe Leonardo AI (150 imagini/zi gratuit) sau Stability AI',
    'Definește 20 stiluri vizuale pentru nișa ta și salvează prompt-urile',
    'Construiește portal: client descrie → primești 5 variante în 60 secunde',
    'Adaugă Remove.bg pentru editare automată și Bannerbear pentru template-uri',
    'Vinzi pachete: €29 logo, €99 brand kit, €149/lună social media',
  ],
  'Date & Business': [
    'Conectează Supabase (gratuit) ca bază de date și backend',
    'Integrează Stripe pentru plăți și subscripții automate',
    'Construiește dashboard cu date în timp real pentru clienți',
    'Adaugă Resend pentru emailuri automate și notificări',
    'Lansezi SaaS vertical la $49-$199/lună per client',
  ],
  'Web & SEO': [
    'Configurează Brave Search API (2000 căutări/lună gratuit)',
    'Adaugă Jina AI Reader pentru extragere conținut de pe orice URL',
    'Automatizează audit SEO cu PageSpeed Insights API',
    'Construiește raport automat generat cu AI în PDF',
    'Vinzi audit SEO complet la €199 sau retainer lunar €499',
  ],
  'Social & Outreach': [
    'Creează bot Telegram (100% gratuit, nelimitat) pentru notificări și clienți',
    'Conectează Buffer sau Meta Graph API pentru programare postări',
    'Automatizează generarea conținutului cu Groq sau Gemini',
    'Adaugă WhatsApp Business API pentru follow-up automat clienți',
    'Scalezi la 20 clienți €199/lună = €3.980 cu 2h muncă/lună',
  ],
  'Productivitate': [
    'Configurează Google Calendar API pentru programări automate',
    'Adaugă Calendly pentru booking client fără intervenție umană',
    'Automatizează documente cu DocuSign și Gmail API',
    'Construiește workflow complet: lead → propunere → contract → factură',
    'Vinzi serviciul ca pachet setup €299 + suport lunar €99',
  ],
};


const BUSINESS_DOCS = [
  {
    id: 1,
    icon: "🎯",
    title: "Prompt Engineering — Serviciu + Agenție",
    subtitle: "Cum transformi abilitatea de a scrie prompt-uri într-un business de €5.000+/lună",
    apis: ["OpenAI API", "Groq API", "Google Gemini", "Anthropic Claude", "OpenRouter"],
    stack: "React frontend + Node.js backend + Supabase DB + Stripe subscripții",
    pricing: "Audit prompt-uri €299 | Optimizare lunară €499/lună | Training echipe €1.500/zi",
    revenue: "€3.000–€12.000/lună",
    steps: [
      "Creează portofoliu cu 10 cazuri reale: before/after prompt + rezultat measurabil",
      "Lansează serviciu audit prompt-uri la €299 — analizezi sistemul AI al clientului",
      "Construiește biblioteca de prompt-uri pe verticale: legal, medical, marketing, HR",
      "Adaugă subscripție lunară €499: optimizare continuă + prompt-uri noi în fiecare săptămână",
      "Scalezi la agenție: angajezi 2-3 prompt engineers, vinzi la €2.000+/client/lună"
    ],
    prompts: [
      "Acționează ca expert în [DOMENIU] cu 20 ani experiență. Analizează [SITUAȚIE] și oferă [OUTPUT SPECIFIC] structurat în: 1) Analiză 2) Recomandări 3) Pași acționabili. Tonul: profesional dar accesibil.",
      "Ești un copywriter de conversie cu rata de succes demonstrată. Scrie [TIP CONȚINUT] pentru [AUDIENȚĂ ȚINTĂ] care [OBIECTIV]. Include: hook puternic, beneficii concrete, CTA clar. Maxim [NR] cuvinte.",
      "Comportă-te ca CFO al unui startup. Analizează aceste date financiare [DATE] și creează un raport executiv cu: situația actuală, riscuri, oportunități și 3 scenarii pentru trimestrul următor."
    ]
  },
  {
    id: 2,
    icon: "📱",
    title: "Social Media AI Agency",
    subtitle: "Agenție de content automat pentru clienți — €299/client/lună, 20 clienți = €6.000",
    apis: ["OpenAI API", "Midjourney/Leonardo AI", "Buffer API", "Meta Graph API", "Canva API"],
    stack: "Next.js + Make.com automation + Airtable CRM + Stripe billing",
    pricing: "Starter €149/lună (3 platforme, 15 postări) | Pro €299/lună (5 platforme, 30 postări) | Agency €599/lună (nelimitat)",
    revenue: "€3.000–€15.000/lună",
    steps: [
      "Definești 5 tipare de conținut care funcționează: educațional, inspirațional, produs, behind-scenes, UGC",
      "Creezi biblioteca de prompt-uri per industrie (restaurant, coach, imobiliar, clinic, retail)",
      "Automatizezi cu Make.com: luni dimineața generezi tot conținutul lunii în 30 minute",
      "Adaugi aprobarea clientului: trimit link Airtable, aprobă sau modifică în 24h",
      "Programezi automat cu Buffer și raportezi cu template PDF lunar generat automat"
    ],
    prompts: [
      "Creează 5 postări Instagram pentru [TIP BUSINESS] din [ORAȘ]. Audiență: [DESCRIERE]. Tone of voice: [TON]. Include: caption captivant, 3 hashtag-uri de nișă, CTA specific. Format: postare educațională care demonstrează expertiza.",
      "Scrie un calendar editorial pentru luna [LUNĂ] pentru [BUSINESS]. Include: 20 idei de postări grupate pe teme săptămânale, mix de formate (carousel, reel, story, post), și hook-uri pentru primele 3 secunde ale fiecărui reel.",
      "Analizează ultimele 10 postări ale competitorului [LINK/DESCRIERE] și creează o strategie de diferențiere cu 5 unghiuri de conținut pe care ei NU le folosesc dar audiența ar rezona cu ele."
    ]
  },
  {
    id: 3,
    icon: "📧",
    title: "Newsletter AI — Scriere + Trimitere + Monetizare",
    subtitle: "Newsletter semi-automat de nișă cu 500 abonați = €2.500/lună pasiv",
    apis: ["OpenAI API", "Resend API", "Stripe API", "NewsAPI", "Brave Search API"],
    stack: "Beehiiv sau Ghost + Node.js scraper + OpenAI pentru draft + Stripe pentru paid tier",
    pricing: "Free tier (lead gen) | €9/lună basic | €29/lună pro cu analize exclusive",
    revenue: "€1.500–€8.000/lună",
    steps: [
      "Alegi nișa: finanțe personale, AI tools, real estate, health tech, crypto — ceva în care ești credibil",
      "Configurezi pipeline: NewsAPI + Brave Search colectează știrile → OpenAI scrie draft → tu editezi 20%",
      "Trimiți primele 10 ediții gratuit, construiești lista la 200 abonați prin LinkedIn + Twitter",
      "Lansezi paid tier la €9/lună: conținut exclusiv, analize mai profunde, acces comunitate",
      "Monetizezi în 3 moduri: abonamente, sponsorizări (€300-€1000/ediție), produse proprii"
    ],
    prompts: [
      "Ești editorul unui newsletter premium de [NIȘĂ] citit de [AUDIENȚĂ]. Bazat pe aceste știri din săptămâna trecută: [ȘTIRI], scrie o ediție completă cu: intro hook 100 cuvinte, 3 secțiuni principale cu analiză, takeaway acționabil, și o întrebare pentru cititori. Ton: expert prietenos, nu corporatist.",
      "Analizează tendința [SUBIECT] din perspectiva [AUDIENȚĂ NEWSLETTER]. Ce înseamnă concret pentru ei? Care sunt implicațiile în 30 zile, 6 luni, 1 an? Oferă 3 acțiuni specifice pe care le pot lua săptămâna asta.",
      "Scrie un subject line A/B test pentru newsletter-ul despre [SUBIECT]: Varianta A (curiozitate), Varianta B (beneficiu direct), Varianta C (urgență/FOMO). Include preview text pentru fiecare."
    ]
  },
  {
    id: 4,
    icon: "🔍",
    title: "SEO AI Agency",
    subtitle: "Articole, audit tehnic, link building automat — €499-€2.999/client/lună",
    apis: ["OpenAI API", "SerpAPI", "Google Search Console API", "Ahrefs/Semrush API", "Firecrawl"],
    stack: "Python scripts + Supabase + React dashboard + Stripe + WordPress REST API",
    pricing: "Audit SEO €299 (one-time) | Content package €499/lună (8 articole) | Full SEO €1.499/lună",
    revenue: "€3.000–€20.000/lună",
    steps: [
      "Automatizezi audit SEO: Firecrawl scanează site-ul, SerpAPI verifică pozițiile, generezi raport PDF automat",
      "Creezi pipeline de articole: keyword research → brief → scriere AI → editare umană 15 min → publicare",
      "Construiești sistem de link building: identifici oportunități guest post, generezi outreach personalizat",
      "Adaugi monitorizare automată: alerte când pozițiile scad, raport lunar generat automat",
      "Scalezi la 10 clienți cu 2h muncă/zi: automatizezi 80%, supervizezi 20%"
    ],
    prompts: [
      "Ești expert SEO cu specializare în [INDUSTRIE]. Scrie un articol de 1500 cuvinte pentru keyword-ul [KEYWORD] cu search intent [INTENT]. Include: H1 optimizat, 5 H2-uri cu variante de keyword, introducere cu hook, FAQ section cu 5 întrebări reale din Google, și meta description de 155 caractere.",
      "Analizează aceste 10 articole de top pentru [KEYWORD]: [URLs]. Identifică: ce topicuri acoperă toate, ce lipsește (content gap), ce format domină, și creează un brief pentru un articol care le depășește pe toate.",
      "Creează o strategie de internal linking pentru site-ul [DOMENIU] cu [NR] articole. Identifică pillar pages, cluster articles, și sugerează 3 internal links pentru fiecare articol nou publicat."
    ]
  },
  {
    id: 5,
    icon: "🎓",
    title: "AI Tutoring Platform",
    subtitle: "Cursuri personalizate cu AI — €29/elev/lună, 200 elevi = €5.800 recurent",
    apis: ["OpenAI API", "Stripe API", "Supabase", "ElevenLabs API", "Google Calendar API"],
    stack: "React + Node.js + Supabase + OpenAI Assistant API + Stripe subscriptions",
    pricing: "€19/lună basic (acces cursuri) | €29/lună pro (tutor AI inclus) | €99/lună premium (sesiuni live)",
    revenue: "€2.000–€10.000/lună",
    steps: [
      "Alegi nișa educațională: matematică BAC, engleză business, programare pentru începători, finanțe personale",
      "Creezi 15 lecții video de bază (30 min fiecare) + quiz automat după fiecare lecție",
      "Integrezi OpenAI Assistant ca tutor: răspunde la întrebări, generează exerciții personalizate",
      "Adaugi progress tracking: Supabase stochează progresul, dashboard arată procentul completat",
      "Lansezi cu 20 beta-testeri gratuit → collect feedback → lansezi paid la €29/lună"
    ],
    prompts: [
      "Ești tutor expert în [MATERIE] pentru [NIVEL: elev clasa X / student / profesionist]. Elevul a greșit exercițiul: [EXERCIȚIU + RĂSPUNS GREȘIT]. Nu da răspunsul direct. În schimb: 1) Identifică unde a greșit, 2) Explică conceptul cu o analogie simplă, 3) Dă un exercițiu similar mai ușor, 4) Ghidează spre răspunsul corect cu întrebări Socratice.",
      "Creează un plan de studiu de 30 zile pentru [OBIECTIV DE ÎNVĂȚARE]. Nivel curent: [NIVEL]. Timp disponibil: [ORE/SĂPTĂMÂNĂ]. Include: obiective săptămânale, resurse specifice, exerciții practice zilnice, și milestone-uri de progres măsurabile.",
      "Generează 10 întrebări de quiz pentru lecția despre [SUBIECT] la nivelul [DIFICULTATE]. Format: multiple choice cu 4 variante. Include explicația corectă pentru fiecare răspuns greșit. Dificultate progresivă de la ușor la greu."
    ]
  },
  {
    id: 6,
    icon: "🛒",
    title: "E-commerce Automat",
    subtitle: "Descrieri, imagini, reclame generate automat — setup pentru magazine online",
    apis: ["OpenAI API", "Leonardo AI", "Shopify API", "Meta Ads API", "Remove.bg API"],
    stack: "Node.js scripts + Shopify API + Leonardo AI + Meta Business API + Bannerbear",
    pricing: "Setup one-time €499 | Mentenanță lunară €199 | Per produs €2 (descriere + imagine editată)",
    revenue: "€2.000–€8.000/lună",
    steps: [
      "Conectezi Shopify API: extragi toate produsele fără descriere sau cu descriere slabă",
      "Automatizezi: titlu produs + categorie → OpenAI generează descriere SEO optimizată în 10 secunde",
      "Procesezi imaginile: Remove.bg elimină fundalul, Bannerbear adaugă overlay cu preț și branding",
      "Generezi reclamele: 5 variante de ad copy per produs pentru Facebook + Instagram",
      "Livrezi clientului: CSV cu descrieri + folder cu imagini procesate + document cu reclame"
    ],
    prompts: [
      "Scrie o descriere de produs pentru [PRODUS] din categoria [CATEGORIE]. Target: [AUDIENȚĂ]. Include: headline beneficiu principal, 3 bullet-uri cu features cheie transformate în beneficii, paragraf storytelling despre cum rezolvă problema, specificații tehnice, și CTA urgent. SEO keyword principal: [KEYWORD]. Lungime: 200-300 cuvinte.",
      "Creează 5 variante de reclame Facebook pentru produsul [PRODUS] la prețul [PREȚ]. Obiectiv: conversii. Include: hook primele 3 cuvinte, body copy 100 cuvinte, headline pentru imagine, CTA button text. Variante: curiozitate, social proof, urgență, beneficiu direct, storytelling.",
      "Analizează recenziile clienților pentru [PRODUS]: [RECENZII]. Extrage: top 3 beneficii menționate, top 3 obiecții/probleme, limbajul exact folosit de clienți (pentru ad copy autentic), și sugerează îmbunătățiri de produs."
    ]
  },
  {
    id: 7,
    icon: "👔",
    title: "AI Recruitment Agency",
    subtitle: "Screening CV-uri, interviuri automate, matchmaking — €500/hire sau €299/lună SaaS",
    apis: ["OpenAI API", "LinkedIn API", "Calendly API", "DocuSign API", "Resend API"],
    stack: "React + Node.js + Supabase + OpenAI + Calendly webhooks + DocuSign",
    pricing: "Per hire €300-€800 | Retainer €499/lună (până la 5 posturi active) | SaaS €199/lună/companie",
    revenue: "€3.000–€15.000/lună",
    steps: [
      "Construiești portal: companiile postează job-uri cu cerințe detaliate în 10 minute",
      "Automatizezi screening: CV-uri uploadate → OpenAI scorează față de cerințe → top 10 în 5 minute",
      "Adaugi interviu AI: candidații răspund la 5 întrebări video/text, AI evaluează și rezumă",
      "Programezi interviuri umane automat cu Calendly pentru top 3 candidați",
      "Generezi contracte cu DocuSign și trimiți automat după acceptarea ofertei"
    ],
    prompts: [
      "Ești recruiter expert cu 15 ani experiență în [INDUSTRIE]. Analizează acest CV: [CV] față de job description-ul: [JD]. Scor 0-100 pentru: experiență relevantă, skills tehnice, soft skills indicate, cultural fit estimat. Explică scorul și listează: top 3 puncte forte, top 3 gaps, și 5 întrebări de interviu specifice pentru acest candidat.",
      "Creează un job description atractiv pentru poziția de [TITLU] la o companie [DESCRIERE COMPANIE]. Include: pitch companiei în 2 propoziții, responsabilități concrete (nu vagi), cerințe must-have vs nice-to-have, beneficii reale (nu clișee), și procesul de aplicare în pași clari. Ton: direct și uman, nu corporatist.",
      "Generează 10 întrebări de interviu comportamental pentru rolul de [POZIȚIE] cu focus pe [COMPETENȚE CHEIE]. Format STAR. Include: întrebarea principală, follow-up questions, și ce răspuns ideal ar arăta. Evită întrebările clișeu."
    ]
  },
  {
    id: 8,
    icon: "🏠",
    title: "Real Estate AI",
    subtitle: "Anunțuri, follow-up automat, analiză piață — pentru agenți și agenții imobiliare",
    apis: ["OpenAI API", "Google Maps API", "Twilio API", "Resend API", "Midjourney/Leonardo AI"],
    stack: "React dashboard + Node.js + Supabase + Twilio pentru SMS + Google Maps API",
    pricing: "Per anunț €49 (descriere + poze procesate) | Pachet agent €199/lună | Agenție €499/lună",
    revenue: "€2.000–€10.000/lună",
    steps: [
      "Agentul completează formular simplu: adresă, suprafață, camere, preț, 5 cuvinte cheie",
      "Automatizezi: generezi descriere anunț în română și engleză, SEO optimizat, în 30 secunde",
      "Procesezi pozele: Remove.bg pentru exterior, Bannerbear pentru watermark, HDR enhancement",
      "Adaugi follow-up automat: SMS la 24h, 72h, 7 zile după vizionare cu Twilio",
      "Generezi raport de piață lunar per zonă: prețuri medii, tendințe, comparație cu trimestrul anterior"
    ],
    prompts: [
      "Scrie un anunț imobiliar captivant pentru [TIP PROPRIETATE] în [ZONĂ/ORAȘ]. Suprafață: [M2]. Camere: [NR]. Preț: [PREȚ]. Puncte forte: [LIST]. Scrie în română. Include: titlu emoțional (nu tehnic), paragraf introductiv care vinde stilul de viață, specificații prezentate ca beneficii, descrierea zonei cu facilități concrete, și CTA urgent. Lungime: 250 cuvinte.",
      "Creează o secvență de 5 SMS-uri de follow-up pentru un potențial cumpărător care a vizitat [PROPRIETATE] dar nu a răspuns. SMS 1 (24h): apreciere + întrebare deschisă. SMS 2 (72h): informație valoroasă despre zonă. SMS 3 (7 zile): alt unghi al proprietății. SMS 4 (14 zile): scarcity/urgență reală. SMS 5 (30 zile): break-up message. Fiecare max 160 caractere.",
      "Analizează aceste date de piață pentru zona [ZONĂ]: [DATE]. Creează un raport de 1 pagină pentru un cumpărător: prețul mediu pe m2, tendința ultimelor 6 luni, comparație cu zone similare, și recomandare: cumpăr acum sau aștept? Bazat strict pe date, fără opinii."
    ]
  },
  {
    id: 9,
    icon: "🎬",
    title: "AI Content Factory",
    subtitle: "Agenție video/audio/text end-to-end — cel mai scalabil business AI din 2026",
    apis: ["OpenAI API", "ElevenLabs API", "HeyGen/D-ID", "Runway ML", "Suno AI", "Leonardo AI"],
    stack: "Make.com orchestration + toate API-urile + Airtable CRM + Stripe + Delivery portal",
    pricing: "Video explicativ €149 | Pachet 4 videos/lună €399 | White-label agenție €1.499/lună",
    revenue: "€5.000–€25.000/lună",
    steps: [
      "Definești 3 produse clare: video explicativ 60s (€149), video cu avatar AI (€99), video cu voiceover (€79)",
      "Automatizezi pipeline: brief client → script OpenAI → voiceover ElevenLabs → avatar HeyGen → editare Runway",
      "Creezi portal client: uploadează brief, primește draft în 48h, aprobă sau solicită revizii",
      "Adaugi upsell natural: fiecare video vine cu post de blog, 5 postări social media, email newsletter",
      "Scalezi la echipă virtuală: tu iei briefurile și supervizezi, automatizările fac 80% din muncă"
    ],
    prompts: [
      "Scrie un script de video explicativ de 60 secunde pentru [PRODUS/SERVICIU]. Audiență: [TARGET]. Structură obligatorie: 0-5s hook cu problema, 5-15s agravarea problemei, 15-40s soluția prezentată vizual, 40-55s beneficii concrete cu cifre, 55-60s CTA specific. Include indicații de vizual pentru fiecare secțiune. Ton: [TON].",
      "Creează un pachet complet de conținut pentru lansarea [PRODUS/SERVICIU]: 1 video script 60s, 3 variante de titlu YouTube, 1 articol blog 800 cuvinte, 5 postări LinkedIn, 3 emailuri pentru secvența de lansare, și 10 idei de short-form content. Toate coerente ca mesaj și ton.",
      "Ești director creativ. Clientul vrea să comunice [MESAJ CHEIE] către [AUDIENȚĂ]. Propune 3 concepte creative diferite ca abordare: unul emoțional, unul rațional/date, unul entertainment. Pentru fiecare: titlu concept, descriere în 3 propoziții, format recomandat, și de ce ar funcționa pentru această audiență."
    ]
  }
];

const REVENUE_BY_LEVEL: Record<string, string> = {
  critical: '€2.500–€8.000/lună',
  high: '€1.500–€5.000/lună',
  medium: '€800–€3.000/lună',
};

const ALL_CATEGORIES = ['Toate', ...Array.from(new Set(JOBS_LIST.map(j => j.category)))];



function BusinessDocsSection() {
  const [expanded, setExpanded] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'steps' | 'prompts'>('overview');

  return (
    <div className="mt-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-black text-slate-900 mb-2">📚 9 Business-uri la Cheie</h2>
        <p className="text-slate-500 text-sm">Ghiduri complete cu stack tehnic, pricing, pași și prompt-uri gata de copiat</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {BUSINESS_DOCS.map(doc => (
          <div key={doc.id} className={`bg-white border rounded-2xl overflow-hidden transition-all ${expanded === doc.id ? 'border-purple-400 col-span-1 md:col-span-2 xl:col-span-3' : 'border-slate-200 hover:border-slate-300'}`}>
            <div className="p-5 cursor-pointer" onClick={() => { setExpanded(expanded === doc.id ? null : doc.id); setActiveTab('overview'); }}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex gap-3 items-start">
                  <span className="text-3xl">{doc.icon}</span>
                  <div>
                    <h3 className="font-black text-slate-900 text-base leading-tight">{doc.title}</h3>
                    <p className="text-slate-500 text-xs mt-1 leading-relaxed">{doc.subtitle}</p>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-green-600 font-black text-sm">{doc.revenue}</div>
                  <div className="text-slate-400 text-xs">potențial lunar</div>
                </div>
              </div>
              {expanded !== doc.id && (
                <div className="mt-3 flex flex-wrap gap-1">
                  {doc.apis.slice(0,3).map((api, i) => (
                    <span key={i} className="text-xs bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full">{api}</span>
                  ))}
                  {doc.apis.length > 3 && <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">+{doc.apis.length - 3} mai multe</span>}
                </div>
              )}
            </div>

            {expanded === doc.id && (
              <div className="border-t border-slate-100">
                <div className="flex border-b border-slate-100">
                  {(['overview', 'steps', 'prompts'] as const).map(tab => (
                    <button key={tab} onClick={() => setActiveTab(tab)}
                      className={`flex-1 py-3 text-xs font-semibold transition-all ${activeTab === tab ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50' : 'text-slate-400 hover:text-slate-600'}`}>
                      {tab === 'overview' ? '📊 Overview' : tab === 'steps' ? '🪜 Pași' : '💬 Prompt-uri'}
                    </button>
                  ))}
                </div>

                <div className="p-5">
                  {activeTab === 'overview' && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <div className="text-xs font-black text-slate-400 uppercase mb-2">API-uri necesare</div>
                        <div className="flex flex-wrap gap-1">
                          {doc.apis.map((api, i) => <span key={i} className="text-xs bg-purple-50 text-purple-700 px-2 py-1 rounded-full">{api}</span>)}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs font-black text-slate-400 uppercase mb-2">Stack tehnic</div>
                        <p className="text-sm text-slate-700 leading-relaxed">{doc.stack}</p>
                      </div>
                      <div>
                        <div className="text-xs font-black text-slate-400 uppercase mb-2">Model pricing</div>
                        <p className="text-sm text-slate-700 leading-relaxed">{doc.pricing}</p>
                        <div className="mt-3 bg-green-50 rounded-xl p-3">
                          <div className="text-green-700 font-black">{doc.revenue}</div>
                          <div className="text-green-600 text-xs">venit lunar estimat</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'steps' && (
                    <div className="space-y-3 max-w-3xl">
                      {doc.steps.map((step, i) => (
                        <div key={i} className="flex gap-3 items-start">
                          <span className="min-w-[28px] h-[28px] rounded-full bg-slate-900 text-white text-xs font-black flex items-center justify-center flex-shrink-0">{i + 1}</span>
                          <span className="text-slate-700 text-sm leading-relaxed pt-1">{step}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {activeTab === 'prompts' && (
                    <div className="space-y-4 max-w-4xl">
                      <p className="text-xs text-slate-400">Click pe prompt pentru a-l copia</p>
                      {doc.prompts.map((prompt, i) => (
                        <div key={i} onClick={() => navigator.clipboard?.writeText(prompt)}
                          className="bg-slate-50 border border-slate-200 rounded-xl p-4 cursor-pointer hover:border-purple-300 hover:bg-purple-50 transition-all group">
                          <div className="flex justify-between items-start gap-2 mb-2">
                            <span className="text-xs font-semibold text-slate-400">Prompt #{i + 1}</span>
                            <span className="text-xs text-purple-600 opacity-0 group-hover:opacity-100 transition-all">📋 copiaza</span>
                          </div>
                          <p className="text-sm text-slate-700 leading-relaxed font-mono">{prompt}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

interface Props {
  onClose: () => void;
}

export default function ArsenalPage({ onClose }: Props) {
  const [selectedProfession, setSelectedProfession] = useState('');
  const [search, setSearch] = useState('');
  const [activeCat, setActiveCat] = useState('Toate');
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [activeApiTab, setActiveApiTab] = useState(0);

  const filtered = useMemo(() => {
    return JOBS_LIST.filter(j => {
      const catOk = activeCat === 'Toate' || j.category === activeCat;
      const q = search.toLowerCase();
      const searchOk = !q || j.title.toLowerCase().includes(q) || j.category.toLowerCase().includes(q);
      return catOk && searchOk;
    });
  }, [search, activeCat]);

  const selectedJob = selectedId ? JOBS_LIST.find(j => j.id === selectedId) : null;

  const getApiGroups = (job: typeof JOBS_LIST[0]) => {
    const cats = CATEGORY_API_MAP[job.category] || ['AI & Text', 'Date & Business', 'Productivitate'];
    return cats.map(cat => ({ cat, apis: API_CATALOG[cat] || [] }));
  };

  const getSteps = (job: typeof JOBS_LIST[0]) => {
    const cats = CATEGORY_API_MAP[job.category] || ['AI & Text'];
    return STEPS_BY_CATEGORY[cats[0]] || STEPS_BY_CATEGORY['AI & Text'];
  };

  const getRiskColor = (level: string) => {
    if (level === 'critical') return 'bg-red-100 text-red-700';
    if (level === 'high') return 'bg-amber-100 text-amber-700';
    return 'bg-yellow-100 text-yellow-700';
  };

  const getRiskLabel = (risk: number) => {
    if (risk >= 85) return 'risc critic';
    if (risk >= 70) return 'risc ridicat';
    return 'risc mediu';
  };

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-slate-200 z-10 px-4 py-3 flex items-center justify-between">
        <button onClick={onClose} style={{display:"flex",alignItems:"center",gap:8,background:"linear-gradient(135deg,#f6c90e,#e0a800)",border:"none",borderRadius:10,padding:"10px 20px",color:"#1a1a1a",fontWeight:900,fontSize:13,cursor:"pointer",boxShadow:"0 2px 8px rgba(246,201,14,0.4)"}}>
          ← Back to 🇷🇴 DaRomania
        </button>
        <span className="font-black text-slate-800 text-sm hidden sm:block">⚡ Arsenal API — 99 meserii × ghid complet de automatizare</span>
        <div className="w-20" />
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Hero */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 mb-3">
            ⚡ Arsenal API<br />
            <span className="text-purple-600">Transformă-ți jobul în business</span>
          </h1>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto">
            Selectează meseria ta → primești instant ghidul complet: API-uri gratuite, pași de implementare, venit estimat
          </p>
          <div className="mt-4 flex items-center justify-center gap-6 text-sm text-slate-400">
            <span>✅ 99 meserii acoperite</span>
            <span>✅ 60+ API-uri gratuite</span>
            <span>✅ Venit estimat per nișă</span>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left panel — job list */}
          <div className="lg:w-2/5 xl:w-1/3">
            <input
              type="text"
              placeholder="Caută meserie..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full mb-3 px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-200"
            />

            <div className="flex flex-wrap gap-1.5 mb-3">
              {ALL_CATEGORIES.slice(0, 8).map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCat(cat)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                    activeCat === cat
                      ? 'bg-purple-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-1.5 mb-4">
              {ALL_CATEGORIES.slice(8).map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCat(cat)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                    activeCat === cat
                      ? 'bg-purple-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <p className="text-xs text-slate-400 mb-3">{filtered.length} meserii găsite</p>

            <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-1">
              {filtered.map(job => (
                <div
                  key={job.id}
                  onClick={() => { setSelectedId(job.id); setActiveApiTab(0); }}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${
                    selectedId === job.id
                      ? 'border-purple-400 bg-purple-50'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-semibold text-slate-800 text-sm leading-tight">{job.title}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium whitespace-nowrap ${getRiskColor(job.level)}`}>
                      {job.automationRisk}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-slate-400">{job.category}</span>
                    <span className="text-xs text-green-600 font-medium">{REVENUE_BY_LEVEL[job.level]?.split('–')[0]}+</span>
                  </div>
                </div>
              ))}
              {filtered.length === 0 && (
                <div className="text-center py-8 text-slate-400 text-sm">
                  Nicio meserie găsită. Încearcă alt termen.
                </div>
              )}
            </div>
          </div>

          {/* Right panel — detail */}
          <div className="lg:w-3/5 xl:w-2/3">
            {!selectedJob ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-16 border-2 border-dashed border-slate-200 rounded-2xl">
                <div className="text-5xl mb-4">⚡</div>
                <h3 className="text-xl font-black text-slate-700 mb-2">Selectează meseria ta din stânga</h3>
                <p className="text-slate-400 text-sm max-w-xs">
                  Primești instant ghidul complet cu API-uri, pași de implementare și venit estimat
                </p>
              </div>
            ) : (
              <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
                {/* Job header */}
                <div className="bg-gradient-to-r from-purple-600 to-purple-800 p-6 text-white">
                  <div className="flex items-start justify-between mb-2">
                    <h2 className="text-2xl font-black leading-tight">{selectedJob.title}</h2>
                    <span className="bg-white/20 text-white text-xs px-3 py-1 rounded-full font-medium">
                      {selectedJob.automationRisk}% risc automatizare
                    </span>
                  </div>
                  <p className="text-purple-200 text-sm mb-3">{selectedJob.category} · {getRiskLabel(selectedJob.level)}</p>
                  <div className="bg-white/10 rounded-xl px-4 py-2 inline-block">
                    <span className="text-white font-black text-lg">{REVENUE_BY_LEVEL[selectedJob.level]}</span>
                    <span className="text-purple-200 text-xs ml-2">venit lunar estimat</span>
                  </div>
                </div>

                <div className="p-5">
                  {/* 5 Pivot ideas */}
                  <div className="mb-6">
                    <h3 className="text-sm font-black text-slate-500 uppercase tracking-wide mb-3">
                      5 Idei de Business Pivot
                    </h3>
                    <div className="space-y-2">
                      {[selectedJob.pivot1, selectedJob.pivot2, selectedJob.pivot3, selectedJob.pivot4, selectedJob.pivot5].map((pivot, i) => (
                        <div key={i} className="flex gap-3 items-start">
                          <span className="min-w-[22px] h-[22px] rounded-full bg-purple-100 text-purple-700 text-xs font-black flex items-center justify-center">
                            {i + 1}
                          </span>
                          <span className="text-slate-700 text-sm leading-relaxed">{pivot}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* API tabs */}
                  <div className="mb-4">
                    <h3 className="text-sm font-black text-slate-500 uppercase tracking-wide mb-3">
                      API-uri recomandate
                    </h3>
                    <div className="flex gap-2 mb-4 border-b border-slate-100">
                      {getApiGroups(selectedJob).map((group, i) => (
                        <button
                          key={i}
                          onClick={() => setActiveApiTab(i)}
                          className={`px-3 py-2 text-xs font-semibold rounded-t-lg transition-all -mb-px ${
                            activeApiTab === i
                              ? 'bg-white border border-b-white border-slate-200 text-purple-600'
                              : 'text-slate-400 hover:text-slate-600'
                          }`}
                        >
                          {group.cat}
                        </button>
                      ))}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {getApiGroups(selectedJob)[activeApiTab]?.apis.map((api, i) => (
                        <div
                          key={i}
                          onClick={() => window.open(api.url, "_blank")}
                          className="flex items-start gap-3 p-3 rounded-xl border border-slate-200 hover:border-purple-300 hover:bg-purple-50 transition-all group cursor-pointer"
                        >
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-slate-800 text-sm group-hover:text-purple-700">{api.name}</div>
                            <div className="text-xs text-slate-400 mt-0.5">{api.desc}</div>
                          </div>
                          <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full whitespace-nowrap">
                            {api.price}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Implementation steps */}
                  <div className="mb-6">
                    <h3 className="text-sm font-black text-slate-500 uppercase tracking-wide mb-3">
                      Plan implementare — 5 pași
                    </h3>
                    <div className="space-y-3">
                      {getSteps(selectedJob).map((step, i) => (
                        <div key={i} className="flex gap-3 items-start">
                          <span className="min-w-[24px] h-[24px] rounded-full bg-slate-900 text-white text-xs font-black flex items-center justify-center">
                            {i + 1}
                          </span>
                          <span className="text-slate-700 text-sm leading-relaxed">{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Upsell CTA */}
                  <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-5">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div>
                        <h3 className="font-black text-slate-900 text-base mb-1">
                          Vrei să implementăm asta pentru tine?
                        </h3>
                        <p className="text-slate-600 text-sm">
                          Setup complet în 48h — API-uri conectate, portal client live, primii 3 clienți
                        </p>
                      </div>
                      <div className="text-center flex-shrink-0">
                        <div className="text-3xl font-black text-amber-600">$9</div>
                        <div className="text-xs text-slate-400">setup complet</div>
                        <a
                          href="https://buy.stripe.com/bJe14o1Ht3ZCamfedh5os00"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-2 block bg-amber-500 hover:bg-amber-600 text-white font-black px-6 py-2.5 rounded-xl text-sm transition-all text-center"
                        >
                          Vreau setup →
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        <BusinessDocsSection />
      </div>
    </div>
  );
}
