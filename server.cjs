const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const OpenAI = require("openai");
const path = require("path");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    app: "DaRomania",
    model: process.env.OPENAI_MODEL || "gpt-5"
  });
});

app.post("/api/chat", async (req, res) => {
  try {
    const prompt = req.body.prompt || req.body.messages?.[0]?.content || "Salut DaRomania";
    const response = await client.responses.create({
      model: process.env.OPENAI_MODEL || "gpt-5",
      input: prompt || "Salut DaRomania"
    });

    res.json({
      success: true,
      text: response.output_text
    });
  } catch (error) {
    console.error("OPENAI ERROR:", error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});


// KIE.AI — Generare imagini Grok
app.post("/api/generate-image", async (req, res) => {
  try {
    const { prompt, aspect_ratio = "16:9" } = req.body;
    const response = await fetch("https://api.kie.ai/api/v1/jobs/createTask", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + process.env.KIE_API_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "grok-imagine/text-to-image",
        input: { prompt, aspect_ratio, enable_pro: false }
      })
    });
    const data = await response.json();
    if (data.code !== 200) throw new Error(data.msg);
    res.json({ success: true, taskId: data.data.taskId });
  } catch (error) {
    console.error("KIE IMAGE ERROR:", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// KIE.AI — Generare video Grok
app.post("/api/generate-video", async (req, res) => {
  try {
    const { prompt, image_url, duration = "6", resolution = "480p" } = req.body;
    const input = { prompt, mode: "normal", duration, resolution, aspect_ratio: "16:9" };
    if (image_url) input.image_urls = [image_url];
    const response = await fetch("https://api.kie.ai/api/v1/jobs/createTask", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + process.env.KIE_API_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ model: "grok-imagine/image-to-video", input })
    });
    const data = await response.json();
    if (data.code !== 200) throw new Error(data.msg);
    res.json({ success: true, taskId: data.data.taskId });
  } catch (error) {
    console.error("KIE VIDEO ERROR:", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// KIE.AI — Verifica status task
app.get("/api/task-status", async (req, res) => {
  try {
    const { taskId } = req.query;
    const response = await fetch("https://api.kie.ai/api/v1/jobs/recordInfo?taskId=" + taskId, {
      headers: { "Authorization": "Bearer " + process.env.KIE_API_KEY }
    });
    const data = await response.json();
    if (data.code !== 200) throw new Error(data.msg);
    const task = data.data;
    let resultUrl = null;
    if (task.state === "success" && task.resultJson) {
      const result = JSON.parse(task.resultJson);
      resultUrl = result.resultUrls?.[0] || null;
    }
    res.json({ success: true, state: task.state, resultUrl });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.use(express.static(path.join(__dirname, "dist")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

app.get("*", (req, res, next) => {
  if (req.path.startsWith("/api")) return next();
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log("[DaRomania] Server pornit pe portul", PORT);
});
