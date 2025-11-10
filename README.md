An AI-powered document summarizer built on **Cloudflare Workers** and **Workers AI**.

Paste text or upload a `.txt` file and Doc Summarizer will generate a clean, paragraph-style summary, running entirely on Cloudflare’s edge network.

---

## 🚀 Demo

- **Live demo:** `(https://cf-ai-docsummarizer.mahad-toukaleh56.workers.dev/)`  
- **Tech stack:** Cloudflare Workers · Workers AI · TypeScript · Wrangler
---

## ✨ Features

- **Paste or upload**  
  - Paste any text into the textarea, or upload a `.txt` file.
- **Clean paragraph summaries**  
  - No bullet points or markdown – just human-readable, well-structured summaries.
- **Runs at the edge**  
  - All inference happens via **Cloudflare Workers AI**, close to the user.
- **Simple, self-contained Worker**  
  - No separate frontend app – HTML, CSS, and JS are served directly from the Worker.

---

## 🧱 Architecture

Everything lives in a single Cloudflare Worker:

- `src/index.ts`
  - Handles `GET /` → serves the HTML UI.
  - Handles `POST /` → accepts JSON `{ text }`, calls Workers AI, returns `{ summary }`.

Configuration is managed via `wrangler.jsonc`:

- `"main": "src/index.ts"` – Worker entrypoint.
- `"ai": { "binding": "AI" }` – exposes Workers AI to the Worker as `env.AI`.

**High-level flow:**

1. User loads `/` → Worker returns the UI.
2. User pastes text **or** uploads a `.txt` file.
3. Frontend JS reads the text and sends it to `POST /` as JSON.
4. The Worker builds a prompt and calls a Workers AI model via `@cloudflare/ai`.
5. The AI returns a summary → Worker returns `{ summary }` → UI renders it.

---

## 🧠 AI Behavior

At a high level, the prompt tells the model to:

- Act as a **professional document summarizer**.
- Produce **natural, paragraph-style summaries** (no bullets or special symbols).
- Focus on main ideas, arguments, and conclusions.
- Use clear, accessible language.

We also truncate very long inputs on the server side to avoid excessive context length.

---
