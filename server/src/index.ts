import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { getGeminiApiKey, humanizeOffline, humanizeWithGemini } from "./ai.js";
import { enrichReport } from "./enrich-findings.js";
import { analyzeContentSignals, emptyContentSignals } from "./content.js";
import { runLighthouseAudit } from "./lighthouse-run.js";
import { buildSyntheticUxCategory } from "./synthetic-ux.js";
import type { AnalyzePayload, AnalyzeResponse, ContentSignals } from "./types.js";
import { normalizeUrl } from "./url.js";

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isProd = process.env.NODE_ENV === "production";
const clientDist = path.resolve(__dirname, "../../client/dist");

const app = express();

const allowedOrigins = (process.env.CLIENT_ORIGIN || "http://localhost:5173")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

app.use(
  cors(
    isProd
      ? { origin: allowedOrigins }
      : { origin: true },
  ),
);
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
  res.json({ ok: true, mode: isProd ? "production" : "development" });
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

    const apiKey = getGeminiApiKey();
    let report;
    let aiModel: string | undefined;
    let note: string | undefined;

    if (apiKey) {
      try {
        const result = await humanizeWithGemini(payload, apiKey);
        report = result.report;
        aiModel = result.model;
        if (result.model === "fallback") {
          note = "Gemini returned an unexpected format; showing rule-based fixes with sample code.";
        } else {
          note = `Report enhanced by Google Gemini (${result.model}).`;
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        report = humanizeOffline(payload);
        aiModel = "fallback";
        note = `Gemini API error: ${msg}. Showing rule-based fixes with sample code.`;
      }
    } else {
      report = humanizeOffline(payload);
      note =
        "Set GEMINI_API_KEY in server/.env for AI-powered fixes. Showing rule-based fixes with sample code.";
    }

    report = enrichReport(report, payload);

    const scores: Record<string, number | null> = {};
    for (const [k, v] of Object.entries(payload.categories)) {
      scores[k] = v.score;
    }
    scores["content"] = heuristicContentScore(contentSignals);

    const response: AnalyzeResponse = {
      url,
      fetchedAt: payload.fetchedAt,
      scores,
      performanceMetrics: lh.value.performanceMetrics,
      auditMeta: {
        lighthouseVersion: lh.value.lighthouseVersion,
        formFactor: lh.value.formFactor,
        extraCategories: ["ux", "content"],
      },
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

if (isProd && fs.existsSync(clientDist)) {
  app.use(express.static(clientDist));
  app.get("*", (req, res, next) => {
    if (req.path.startsWith("/api")) {
      next();
      return;
    }
    res.sendFile(path.join(clientDist, "index.html"));
  });
} else if (isProd) {
  console.warn(
    `Production mode: client build not found at ${clientDist}. Run "npm run build" from project root.`,
  );
}

const port = Number(process.env.PORT) || 8787;
app.listen(port, () => {
  if (isProd && fs.existsSync(clientDist)) {
    console.log(`AI Web Analyzer running at http://localhost:${port}`);
  } else {
    console.log(`AI Web Analyzer API listening on http://localhost:${port}`);
  }
});
