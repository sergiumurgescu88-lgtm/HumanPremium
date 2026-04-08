const dotenv = require('dotenv');
dotenv.config({ path: '/root/hp-repo/.env' });

const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'dist')));

const NVIDIA_URL = 'https://integrate.api.nvidia.com/v1/chat/completions';

// ── CHEI AI ───────────────────────────────────────────────────────────────
const NVIDIA_KEY_QWEN = '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';

// 3 chei Kimi separate pentru Feeling Lucky (rotatie round-robin)
const KIMI_KEYS = [
  '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',
  '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',
  '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'
];
let kimiRoundRobin = 0;

// ── HELPER: call Kimi cu o cheie specifică ────────────────────────────────
async function callKimi(msgs, keyIndex) {
  const key = KIMI_KEYS[keyIndex % KIMI_KEYS.length];
  const res = await fetch(NVIDIA_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${key}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'moonshotai/kimi-k2-instruct-0905',
      messages: msgs,
      max_tokens: 4096,
      temperature: 0.6,
      top_p: 0.9,
      stream: false
    })
  });
  if (!res.ok) throw new Error(`Kimi[${keyIndex}] ${res.status}`);
  const data = await res.json();
  const text = data.choices?.[0]?.message?.content;
  if (!text) throw new Error(`Kimi[${keyIndex}]: no content`);
  return text;
}

// ── FEELING LUCKY: Kimi dedicat (round-robin pe 3 chei) ──────────────────
async function callLucky({ messages, systemPrompt }) {
  const msgs = systemPrompt
    ? [{ role: 'system', content: systemPrompt }, ...messages]
    : messages;

  const keyIdx = kimiRoundRobin % 3;
  kimiRoundRobin++;

  // Încearcă cheia curentă, apoi urmAtoarele 2 ca fallback
  for (let i = 0; i < 3; i++) {
    try {
      const text = await callKimi(msgs, (keyIdx + i) % 3);
      console.log(`[AI Lucky] Kimi[${(keyIdx + i) % 3}] OK`);
      return text;
    } catch (err) {
      console.warn(`[AI Lucky] Kimi[${(keyIdx + i) % 3}] picat:`, err.message);
    }
  }
  throw new Error('Toate cheile Kimi au picat');
}

// ── GENERARE FINALA: Kimi round-robin pe 3 chei ─────────────────────────
async function callMain({ messages, systemPrompt }) {
  const msgs = systemPrompt
    ? [{ role: 'system', content: systemPrompt }, ...messages]
    : messages;

  const startIdx = kimiRoundRobin % 3;
  kimiRoundRobin++;

  for (let i = 0; i < 3; i++) {
    const idx = (startIdx + i) % 3;
    try {
      const text = await callKimi(msgs, idx);
      console.log(`[AI Main] Kimi[${idx}] OK`);
      return text;
    } catch (err) {
      console.warn(`[AI Main] Kimi[${idx}] picat:`, err.message);
    }
  }
  throw new Error('Toate cheile Kimi au picat');
}

// ── ENDPOINT AI - detectează tipul de request ─────────────────────────────
app.post('/api/ai', async (req, res) => {
  try {
    const { messages, systemPrompt, prompt, lucky } = req.body;
    const msgs = messages || [{ role: 'user', content: prompt || '' }];

    // lucky=true → Feeling Lucky (Kimi round-robin rapid)
    // lucky=false/undefined → generare finală (Qwen 397B)
    const text = lucky
      ? await callLucky({ messages: msgs, systemPrompt })
      : await callMain({ messages: msgs, systemPrompt });

    res.json({ text });
  } catch (err) {
    console.error('[/api/ai]', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ── STRIPE ────────────────────────────────────────────────────────────────
app.post('/api/create-payment-intent', async (req, res) => {
  try {
    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    const { amount, email } = req.body;
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: 'ron',
      receipt_email: email,
      metadata: { platform: 'daromania.online' }
    });
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    console.error('[Stripe]', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ── SPA fallback ──────────────────────────────────────────────────────────
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => console.log(`[DaRomania] Server pornit pe portul ${PORT}`));
