const dotenv = require('dotenv');
dotenv.config({ path: '/root/hp-repo/.env' });

const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'dist')));

// ── NVIDIA NIM - Kimi K2.5 + fallback Qwen ────────────────────────────────


const NVIDIA_KEY_QWEN = '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';
const NVIDIA_KEY_KIMI = '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';
const NVIDIA_URL = 'https://integrate.api.nvidia.com/v1/chat/completions';

async function callNvidia({ messages, systemPrompt }) {
  const msgs = systemPrompt
    ? [{ role: 'system', content: systemPrompt }, ...messages]
    : messages;

  // 1️⃣ QWEN 397B - Principal
  try {
    const res = await fetch(NVIDIA_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${NVIDIA_KEY_QWEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'qwen/qwen3.5-397b-a17b',
        messages: msgs,
        max_tokens: 4096,
        temperature: 0.6,
        top_p: 0.95,
        top_k: 20,
        presence_penalty: 0,
        repetition_penalty: 1,
        stream: false
      })
    });
    if (!res.ok) throw new Error(`Qwen ${res.status}`);
    const data = await res.json();
    const text = data.choices?.[0]?.message?.content;
    if (!text) throw new Error('Qwen: no content');
    console.log('[AI] Qwen 397B OK');
    return text;
  } catch (err) {
    console.warn('[AI] Qwen picat:', err.message, '→ fallback Kimi');
  }

  // 2️⃣ KIMI - Fallback
  const res = await fetch(NVIDIA_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${NVIDIA_KEY_KIMI}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'moonshotai/kimi-k2.5',
      messages: msgs,
      max_tokens: 4096,
      temperature: 1.0,
      top_p: 1.0,
      stream: false
    })
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Kimi ${res.status}: ${err.slice(0, 200)}`);
  }
  const data = await res.json();
  const text = data.choices?.[0]?.message?.content;
  if (!text) throw new Error('Kimi: no content');
  console.log('[AI] Kimi fallback OK');
  return text;
}




// ── ENDPOINT PRINCIPAL AI ─────────────────────────────────────────────────
app.post('/api/ai', async (req, res) => {
  try {
    const { messages, systemPrompt, prompt } = req.body;

    // Suportă și format simplu { prompt: "..." }
    const msgs = messages || [{ role: 'user', content: prompt || '' }];
    const text = await callNvidia({ messages: msgs, systemPrompt });
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
