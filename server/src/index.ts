import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { humanizeOffline, humanizeWithOpenAI } from "./ai.js";
import { analyzeContentSignals, emptyContentSignals } from "./content.js";
import { runLighthouseAudit } from "./lighthouse-run.js";
import { buildSyntheticUxCategory } from "./synthetic-ux.js";
import type { AnalyzePayload, AnalyzeResponse, ContentSignals } from "./types.js";
import { normalizeUrl } from "./url.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: "1mb" }));

function heuristicContentScore(c: ContentSignals): number {
  let s = 100;
  if (c.titleLength === 0) s -= 25;
  if (c.metaDescriptionLength === 0) s -= 15;
  if (c.h1Count === 0) s -= 20;
  else if (c.h1Count > 1) s -= 5;
  if (!c.langAttribute) s -= 10;
  if (c.wordCountApprox > 0 && c.wordCountApprox < 120) s -= 10;
  return Math.max(0, Math.min(100, s));
}

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.post("/api/analyze", async (req, res) => {
  const urlRaw = req.body?.url;
  try {
    const url = normalizeUrl(String(urlRaw || ""));

    const [lh, contentResult] = await Promise.allSettled([
      runLighthouseAudit(url),
      analyzeContentSignals(url),
    ]);

    if (lh.status === "rejected") {
      const msg = lh.reason instanceof Error ? lh.reason.message : String(lh.reason);
      res.status(400).json({
        error: `Lighthouse failed: ${msg}. Ensure Google Chrome is installed and the URL is reachable.`,
      });
      return;
    }

    const contentSignals =
      contentResult.status === "fulfilled" ? contentResult.value : emptyContentSignals();

    const perfScore = lh.value.categories.performance?.score ?? null;
    const a11yScore = lh.value.categories.accessibility?.score ?? null;
    const ux = buildSyntheticUxCategory(contentSignals, perfScore, a11yScore);

    const payload: AnalyzePayload = {
      url,
      fetchedAt: new Date().toISOString(),
      lighthouseVersion: lh.value.lighthouseVersion,
      categories: {
        ...lh.value.categories,
        ux,
      },
      content: contentSignals,
    };

    const apiKey = process.env.OPENAI_API_KEY;
    let report;
    let aiModel: string | undefined;
    let note: string | undefined;

    if (apiKey) {
      const result = await humanizeWithOpenAI(payload, apiKey);
      report = result.report;
      aiModel = result.model;
      if (result.model === "fallback") {
        note = "AI returned an unexpected format; showing rule-based summaries.";
      }
    } else {
      report = humanizeOffline(payload);
      note = "Set OPENAI_API_KEY in server/.env to enable AI-enhanced summaries.";
    }

    const scores: Record<string, number | null> = {};
    for (const [k, v] of Object.entries(payload.categories)) {
      scores[k] = v.score;
    }
    scores["content"] = heuristicContentScore(contentSignals);

    const response: AnalyzeResponse = {
      url,
      fetchedAt: payload.fetchedAt,
      scores,
      raw: payload,
      report,
      aiModel,
      note,
    };

    res.json(response);
  } catch (e) {
    const err = e instanceof Error ? e.message : "Unknown error";
    res.status(400).json({ error: err });
  }
});

const port = Number(process.env.PORT) || 8787;
app.listen(port, () => {
  console.log(`AI Web Analyzer API listening on http://localhost:${port}`);
});
