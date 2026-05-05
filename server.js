import express from "express";
import cors from "cors";

import dotenv from "dotenv";
console.log("🟡 Starting server...");
dotenv.config();
process.on("uncaughtException", err => {
  console.error("💥 UNCAUGHT ERROR:", err);
});

process.on("unhandledRejection", err => {
  console.error("💥 PROMISE ERROR:", err);
});

const app = express();
app.use(cors());
app.use(express.json());

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
app.post("/summarize", async (req, res) => {
  try {
    const { text } = req.body;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: `Summarize this clearly:\n\n${text}` }
              ]
            }
          ]
        })
      }
    );

    const data = await response.json();

    console.log("🔍 FULL GEMINI RESPONSE:", JSON.stringify(data, null, 2));

    const summary =
      data?.candidates?.[0]?.content?.parts
        ?.map(p => p.text)
        .join(" ")
      || data?.candidates?.[0]?.output
      || "No summary available";

    res.json({ summary });

  } catch (err) {
    console.error("❌ ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
});
app.listen(3000, () => {
  console.log("🟢 Server running at http://localhost:3000");
});