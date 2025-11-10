// src/index.ts
import { Ai } from "@cloudflare/ai";

export interface Env {
  AI: Ai;
}


export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    // Serve simple HTML UI at GET /
    if (request.method === "GET" && url.pathname === "/") {
      const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Cloudflare Doc Summarizer</title>
  <style>
    body { font-family: Arial, sans-serif; max-width: 700px; margin: 40px auto; }
    textarea { width: 100%; height: 200px; }
    .summary { white-space: pre-wrap; background: #f5f5f5; padding: 12px; border-radius: 8px; margin-top: 16px; }
    .btn { padding: 8px 16px; margin-top: 8px; cursor: pointer; }
  </style>
</head>
<body>
  <h1>Cloudflare Doc Summarizer</h1>
  <p>Paste text or choose a file, then get a summary generated at the edge.</p>

  <h3>Paste Text</h3>
  <textarea id="textInput" placeholder="Paste your document text here..."></textarea>
  <br />
  <button class="btn" id="summarizeTextBtn">Summarize Text</button>

  <h3>Or Upload File (.txt)</h3>
  <input type="file" id="fileInput" accept=".txt" />
  <button class="btn" id="summarizeFileBtn">Summarize File</button>

  <h2>Summary</h2>
  <div id="summary" class="summary"></div>

  <script>
    const summaryDiv = document.getElementById("summary");
    const textInput = document.getElementById("textInput");
    const fileInput = document.getElementById("fileInput");
    const summarizeTextBtn = document.getElementById("summarizeTextBtn");
    const summarizeFileBtn = document.getElementById("summarizeFileBtn");

    async function summarizeText() {
      const text = textInput.value.trim();
      if (!text) {
        alert("Please paste some text first.");
        return;
      }
      summaryDiv.textContent = "Summarizing...";
      const res = await fetch("/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const out = await res.text();
      summaryDiv.textContent = out;
    }

    async function summarizeFile() {
      const file = fileInput.files[0];
      if (!file) {
        alert("Please choose a file first.");
        return;
      }
      summaryDiv.textContent = "Summarizing...";
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/summarize", {
        method: "POST",
        body: formData,
      });
      const out = await res.text();
      summaryDiv.textContent = out;
    }

    summarizeTextBtn.addEventListener("click", summarizeText);
    summarizeFileBtn.addEventListener("click", summarizeFile);
  </script>
</body>
</html>
      `;
      return new Response(html, {
        status: 200,
        headers: { "Content-Type": "text/html; charset=utf-8" },
      });
    }

    // Handle summarization via POST /summarize
    if (request.method === "POST" && url.pathname === "/summarize") {
      const contentType = request.headers.get("Content-Type") || "";
      let text = "";

      if (contentType.includes("application/json")) {
        const body = await request.json();
        text = (body as any).text || "";
      } else if (contentType.includes("text/plain")) {
        text = await request.text();
      } else if (contentType.includes("multipart/form-data")) {
        const formData = await request.formData();
        const file = formData.get("file");
        if (file && file instanceof File) {
          text = await file.text();
        }
      }

      if (!text || text.trim().length === 0) {
        return new Response("No text content provided.", { status: 400 });
      }

      // Limit prompt size
      const maxLength = 4000;
      const trimmedText =
        text.length > maxLength ? text.slice(0, maxLength) : text;

      const prompt = `
You are EdgeSummarizer, a helpful AI that summarizes documents.

Summarize the following text into 3–6 concise bullet points.
Use plain language and focus on the main ideas.

Text:
${trimmedText}
      `;

      try {
        const ai = new Ai(env.AI);

        const response = await ai.run(
		"@cf/meta/llama-3.1-8b-instruct" as any,
		{ prompt }
		);


        let resultText = "";
        if (typeof response === "string") {
          resultText = response;
        } else if (typeof (response as any).response === "string") {
          resultText = (response as any).response;
        } else {
          resultText = JSON.stringify(response);
        }

        return new Response(resultText, {
          status: 200,
          headers: { "Content-Type": "text/plain" },
        });
      } catch (err: any) {
        return new Response(
          "Error calling Workers AI: " + (err?.message || String(err)),
          { status: 500 }
        );
      }
    }

    // Fallback for unknown routes
    return new Response("Not found", { status: 404 });
  },
};
