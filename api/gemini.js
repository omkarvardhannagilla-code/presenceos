// PresenceOS — AI proxy (Vercel serverless function)
// Supports TWO free providers. Set ONE of these env vars in Vercel:
//   GROQ_API_KEY   -> uses Groq (Llama 3.3 70B) — recommended, big free quota
//   GEMINI_API_KEY -> uses Google Gemini
// The frontend always sends Gemini-format payloads; this proxy translates.

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "POST only" });

  const groqKey = process.env.GROQ_API_KEY;
  const geminiKey = process.env.GEMINI_API_KEY;

  try {
    /* ---------- Groq (preferred if key present) ---------- */
    if (groqKey) {
      const b = req.body || {};
      const messages = [];
      const sys = b.systemInstruction?.parts?.map(p => p.text).join("\n");
      if (sys) messages.push({ role: "system", content: sys });
      for (const c of b.contents || []) {
        messages.push({
          role: c.role === "model" ? "assistant" : "user",
          content: (c.parts || []).map(p => p.text || "").join("\n"),
        });
      }
      const upstream = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: "Bearer " + groqKey },
        body: JSON.stringify({
          model: process.env.GROQ_MODEL || "llama-3.3-70b-versatile",
          messages,
          temperature: b.generationConfig?.temperature ?? 0.9,
        }),
      });
      const data = await upstream.json();
      if (!upstream.ok) return res.status(upstream.status).json(data);
      const text = data.choices?.[0]?.message?.content || "";
      // Translate back to Gemini response shape so the frontend just works
      return res.status(200).json({ candidates: [{ content: { parts: [{ text }] } }] });
    }

    /* ---------- Gemini fallback ---------- */
    if (geminiKey) {
      const model = process.env.GEMINI_MODEL || "gemini-2.0-flash-lite";
      const upstream = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiKey}`,
        { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(req.body) }
      );
      const data = await upstream.json();
      return res.status(upstream.status).json(data);
    }

    return res.status(500).json({ error: "No API key set. Add GROQ_API_KEY (recommended) or GEMINI_API_KEY in Vercel environment variables." });
  } catch (err) {
    return res.status(500).json({ error: "Proxy error: " + String(err) });
  }
}
