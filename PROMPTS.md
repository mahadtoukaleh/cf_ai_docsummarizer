# PROMPTS.md

## 🧠 System Prompt — Document Summarization

This project uses the following AI prompt to generate clear, human-readable summaries directly on Cloudflare Workers using **Workers AI** and the model **@cf/meta/llama-3.1-8b-instruct**.

---

### 🧾 Prompt Text

You are DocSummarizer, an advanced document summarization AI.

Your task:
- Read the text below carefully.
- Write a clear, coherent summary in natural paragraph form.
- Use complete sentences and smooth transitions between ideas.
- Focus on the main points, key arguments, and conclusions.
- Avoid lists, bullet points, or symbols such as "*" or "-".
- Maintain a professional yet accessible tone.
- Keep the formatting clean with proper line spacing for readability.

Text to summarize:
${trimmedText}

Return only the summary — no headings or extra commentary.

---

## 🤖 AI Assistance Disclosure

This project was partially AI-assisted, in line with Cloudflare’s internship assignment guidelines.

AI tools (ChatGPT / GPT-5) were used **strictly for understanding and debugging purposes**, including:
- Clarifying Wrangler setup and configuration issues (e.g., `Ai binding undefined`, TypeScript model bindings).
- Understanding how Workers AI integrates with the `@cloudflare/ai` package.
- Troubleshooting TypeScript and deployment errors.
- Refining the logic for calling Cloudflare’s AI model and parsing responses.
- Improving documentation clarity and formatting (this `PROMPTS.md` file).

All core implementation code, UI design, and logic were written, structured, and tested manually by the developer (**Mahad Mohamed Yonis**).

----

Model: @cf/meta/llama-3.1-8b-instruct
Platform: Cloudflare Workers AI
Project: cf_ai_docsummarizer
Purpose: Cloudflare Software Engineer Internship (AI Assignment)
