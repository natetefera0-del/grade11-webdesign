// server.js
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import fetch from "node-fetch";

const app = express();
app.use(cors());
app.use(bodyParser.json());

const OPENAI_API_KEY = "YOUR_API_KEY_HERE"; // replace with your key

app.post("/ask", async (req, res) => {
  const { question, lesson } = req.body;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are a friendly AI tutor for Ethiopian Grade 11 web design students.",
          },
          {
            role: "user",
            content: `The student is learning: ${lesson}. Question: ${question}`,
          },
        ],
      }),
    });

    const data = await response.json();
    const answer = data.choices?.[0]?.message?.content || "Sorry, I couldn't understand that.";
    res.json({ answer });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "AI server error" });
  }
});

app.listen(3000, () => console.log("✅ AI server running on http://localhost:3000"));
