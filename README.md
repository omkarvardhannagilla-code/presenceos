# PresenceOS 🟡

**AI Digital Presence Builder — a complete online identity for any business in 60 seconds.**

Built for **TakeOver'26** (NIAT Hackathon) · **Theme 8: Digital Presence & Customer Experience**

🔗 **Live Demo:** `https://presenceos.vercel.app` *(update with your Vercel URL after deploying)*

---

## 🧩 Problem

Millions of small businesses in India — tiffin centres, gyms, salons, agencies, clinics — have **no website, no brand identity, no SEO and no customer support channel**. Hiring an agency costs ₹20,000+ and weeks of time. This directly maps to the theme's curated problem statements:

| Problem Statement (Theme 8) | How PresenceOS solves it |
|---|---|
| Business Website & Digital Identity | Generates a complete, deployable website with SEO baked in |
| Brand & Marketing Automation | Generates a brand kit (tagline, voice, palette) + ready-to-post social content |
| Customer Experience Platform | Every generated site ships with a built-in AI support chatbot |
| Customer Engagement & Loyalty | Chatbot answers customers 24×7 in the brand's own voice |

## 💡 Solution

The owner fills **one form** (name, industry, description, tone, contact). PresenceOS uses **Google Gemini** to generate:

1. **Brand Kit** — tagline, about copy, brand voice, custom colour palette
2. **Launch-ready Website** — live preview in an in-app browser frame, fully responsive
3. **SEO Pack** — title, meta description, keywords, OpenGraph tags (pre-injected into the site)
4. **Social Media Pack** — Instagram, WhatsApp Status & LinkedIn posts with hashtags, one-click copy
5. **AI Support Chatbot** — embedded floating widget inside the generated website, context-aware about the business, powered by Gemini

Then **one click downloads the finished website** as a single standalone `.html` file — deployable on GitHub Pages / Netlify / Vercel with zero configuration.

## ⚙️ Tech Stack

- **Frontend:** Vanilla HTML / CSS / JavaScript — single file, zero build step
- **Backend:** One Vercel serverless function (`api/gemini.js`) acting as a secure proxy
- **AI:** Google Gemini 2.0 Flash (`generateContent` REST API)
- **Security:** API key stored as a Vercel environment variable — never exposed to the browser or the repo
- **Fonts:** Bricolage Grotesque, Instrument Sans, JetBrains Mono
- **Hosting:** Vercel (free tier)

## 🏗️ Architecture

```
┌──────────────────────────────────────────────────┐
│  Browser (index.html / downloaded website)       │
│      │  POST /api/gemini  (no key)               │
│      ▼                                           │
│  Vercel serverless proxy (api/gemini.js)         │
│      │  key from env var GEMINI_API_KEY          │
│      ▼                                           │
│  Google Gemini 2.0 Flash                         │
└──────────────────────────────────────────────────┘
```

The API key exists **only** on the server. The browser, the repo and the downloaded websites never see it. Downloaded websites bake in the proxy URL, so their embedded chatbots work from anywhere.

## 🚀 Deploy (Vercel — 5 minutes)

1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) → **Add New → Project** → import the repo
3. Before deploying, open **Environment Variables** and add:
   - Name: `GEMINI_API_KEY`
   - Value: your key from [aistudio.google.com/apikey](https://aistudio.google.com/apikey)
4. Click **Deploy** — done. The key is stored encrypted on Vercel and never leaves the server.

**Run locally:** `npm i -g vercel && vercel dev` (uses the same env var via `vercel env pull`).

## 🎬 Demo Flow (for judges)

1. Enter a real local business (e.g. a tiffin centre in Hyderabad)
2. Generate → show the live website preview with AI-chosen palette
3. Open **Support bot** tab → ask "What are your timings?" as a customer
4. Show **Social posts** tab → copy an Instagram caption
5. Click **Download website** → open the file → the chatbot works inside it too
6. Deploy the downloaded file anywhere (GitHub Pages / Netlify drop) live on stage — its chatbot still works via the proxy

## 🔒 Security

The Gemini API key is never present in the frontend, the repo, or the downloaded websites. All AI traffic flows through the `api/gemini.js` serverless proxy, which reads the key from Vercel's encrypted environment variables. Downloaded websites call the same proxy over HTTPS with CORS enabled.

## 👤 Team

**N. Omkar Vardhan (OV)** — NIAT · Creative & Design Head, GEN AI Club
GitHub: [@NagillaOmkar](https://github.com/NagillaOmkar)
