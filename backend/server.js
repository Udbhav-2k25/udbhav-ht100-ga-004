import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

// ------------------- Debug Log -------------------
console.log("🔑 HuggingFace Key Loaded:", process.env.HUGGINGFACE_API_KEY ? "OK" : "❌ Missing");

// ------------------- Helper to call HF API -------------------
async function callHF(model, input) {
  const url = `https://api-inference.huggingface.co/models/${model}`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ inputs: input }),
    });

    const result = await response.json();
    return result;

  } catch (err) {
    console.error("❌ HF API error:", err);
    return { error: true };
  }
}

// ------------------- Test Route -------------------
app.get("/", (req, res) => {
  res.send("🚀 Backend is running & ready!");
});

// ------------------- TEXT Emotion Route -------------------
app.post("/analyze-text", async (req, res) => {
  const { message } = req.body;

  if (!message) return res.json({ error: "⚠️ No message received" });

  const result = await callHF("j-hartmann/emotion-english-distilroberta-base", message);

  res.json({
    input: message,
    result
  });
});

// ------------------- TEMP Voice Endpoint -------------------
app.post("/analyze-audio", (req, res) => {
  res.json({ message: "🎤 Voice emotion recognition coming soon..." });
});

// ------------------- Start Server -------------------
app.listen(PORT, () => {
  console.log(`🟢 Server running at http://localhost:${PORT}`);
});
