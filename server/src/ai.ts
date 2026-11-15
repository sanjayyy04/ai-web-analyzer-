import { GoogleGenerativeAI } from "@google/generative-ai";
import type { AnalyzePayload, HumanizedSection } from "./types.js";
import { buildFallbackReport } from "./report-fallback.js";

const SYSTEM = `You are a senior web engineer writing a developer report with FIXES and SAMPLE CODE.
You receive JSON with Lighthouse audit items plus HTML content signals.

For each finding provide:
- summary: short issue title (what is wrong)
- impact: why it matters for users, SEO, or performance
- fix: "AI Fix" — 1–3 sentences with concrete remediation steps
- sampleCode: REQUIRED when a code change helps — minimal copy-paste snippet (HTML/CSS/JS). No markdown fences. Escape quotes in JSON.
- codeLanguage: "html" | "css" | "javascript"
- relatedAuditIds: optional Lighthouse audit ids from input

Examples:
- Slow hero image → fix mentions WebP + lazy-load; sampleCode: <img loading="lazy" src="hero.webp" alt="..." />
- Missing alt → sampleCode: <img src="x.jpg" alt="Descriptive text" />
- Missing viewport → sampleCode: <meta name="viewport" content="width=device-width, initial-scale=1" />

Rules:
- Be accurate; only suggest changes grounded in the audit data.
- Prefer real-world snippets developers can paste into their project.
- 3–8 findings per section when input allows.
- Categories: seo, accessibility, performance, best-practices, ux, content

Return ONLY valid JSON:
{
  "report": [
    {
      "category": "performance",
      "headline": "string",
      "findings": [
        {
          "summary": "string",
          "impact": "string",
          "fix": "string",
          "sampleCode": "string",
          "codeLanguage": "html",
          "relatedAuditIds": ["audit-id"]
        }
      ]
    }
  ]
}`;

const DEFAULT_GEMINI_MODEL = "gemini-3.8-flash";
const GEMINI_MODEL = process.env.GEMINI_MODEL?.trim() || DEFAULT_GEMINI_MODEL;

function isModelUnavailable(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error);
  return /\b404\b/.test(message) && /model/i.test(message) && /not found|no longer available/i.test(message);
}

function extractJson(text: string): string {
  const trimmed = text.trim();
  const fence = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fence) return fence[1].trim();
  const start = trimmed.indexOf("{");
  const end = trimmed.lastIndexOf("}");
  if (start !== -1 && end !== -1) return trimmed.slice(start, end + 1);
  return trimmed;
}

export async function humanizeWithGemini(
  raw: AnalyzePayload,
  apiKey: string
): Promise<{ report: HumanizedSection[]; model: string }> {
  const genAI = new GoogleGenerativeAI(apiKey);
  const userPayload = {
    url: raw.url,
    lighthouseVersion: raw.lighthouseVersion,
    categories: raw.categories,
    content: raw.content,
  };

  const prompt = `Analyze this website audit data and return JSON only.\n\nINPUT:\n${JSON.stringify(userPayload)}`;
  const getModel = (modelName: string) =>
    genAI.getGenerativeModel({
      model: modelName,
      systemInstruction: SYSTEM,
      generationConfig: {
        temperature: 0.3,
        responseMimeType: "application/json",
      },
    });

  let activeModel = GEMINI_MODEL;
  let result;
  try {
    result = await getModel(activeModel).generateContent(prompt);
  } catch (error) {
    if (activeModel === DEFAULT_GEMINI_MODEL || !isModelUnavailable(error)) {
      throw error;
    }

    console.warn(`Gemini model "${activeModel}" is unavailable; retrying with "${DEFAULT_GEMINI_MODEL}".`);
    activeModel = DEFAULT_GEMINI_MODEL;
    result = await getModel(activeModel).generateContent(prompt);
  }

  const text = result.response.text();
  if (!text) {
    return { report: buildFallbackReport(raw), model: "fallback" };
  }

  try {
    const parsed = JSON.parse(extractJson(text)) as { report?: HumanizedSection[] };
    if (!parsed.report || !Array.isArray(parsed.report)) {
      return { report: buildFallbackReport(raw), model: "fallback" };
    }
    return { report: parsed.report, model: activeModel };
  } catch {
    return { report: buildFallbackReport(raw), model: "fallback" };
  }
}

/** Resolve Gemini key from env (supports GEMINI_API_KEY or legacy OPENAI_API_KEY slot). */
export function getGeminiApiKey(): string | undefined {
  const key =
    process.env.GEMINI_API_KEY?.trim() ||
    process.env.GOOGLE_API_KEY?.trim() ||
    process.env.OPENAI_API_KEY?.trim();
  return key || undefined;
}

export function humanizeOffline(raw: AnalyzePayload): HumanizedSection[] {
  return buildFallbackReport(raw);
}
