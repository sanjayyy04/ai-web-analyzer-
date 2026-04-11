import OpenAI from "openai";
import type { AnalyzePayload, HumanizedSection } from "./types.js";
import { buildFallbackReport } from "./report-fallback.js";

const SYSTEM = `You are a senior web engineer writing a concise developer report.
You receive JSON with Lighthouse-style audit items plus HTML-derived content signals.
Convert technical findings into clear, actionable guidance.

Rules:
- Use short paragraphs and bullet-style clarity in the "fix" field when helpful.
- Prefer accurate, conservative claims—do not invent metrics not present in input.
- For each section, include 3–8 findings when possible; fewer if input is small.
- Categories must be exactly one of: seo, accessibility, performance, best-practices, ux, content
- "ux" should focus on user friction inferred from the provided UX audit items (if any) and cross-cutting signals.
- "content" should discuss title/description/headings/language/body text signals.

Return ONLY valid JSON with this shape:
{
  "report": [
    {
      "category": "seo",
      "headline": "string",
      "findings": [
        { "summary": "string", "impact": "string", "fix": "string", "relatedAuditIds": ["optional"] }
      ]
    }
  ]
}`;

export async function humanizeWithOpenAI(
  raw: AnalyzePayload,
  apiKey: string
): Promise<{ report: HumanizedSection[]; model: string }> {
  const client = new OpenAI({ apiKey });

  const userPayload = {
    url: raw.url,
    lighthouseVersion: raw.lighthouseVersion,
    categories: raw.categories,
    content: raw.content,
  };

  const completion = await client.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0.3,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: SYSTEM },
      {
        role: "user",
        content: `Analyze and return JSON only.\n\nINPUT:\n${JSON.stringify(userPayload)}`,
      },
    ],
  });

  const text = completion.choices[0]?.message?.content;
  if (!text) {
    return { report: buildFallbackReport(raw), model: "fallback" };
  }

  try {
    const parsed = JSON.parse(text) as { report?: HumanizedSection[] };
    if (!parsed.report || !Array.isArray(parsed.report)) {
      return { report: buildFallbackReport(raw), model: "fallback" };
    }
    return { report: parsed.report, model: "gpt-4o-mini" };
  } catch {
    return { report: buildFallbackReport(raw), model: "fallback" };
  }
}

export function humanizeOffline(raw: AnalyzePayload): HumanizedSection[] {
  return buildFallbackReport(raw);
}
