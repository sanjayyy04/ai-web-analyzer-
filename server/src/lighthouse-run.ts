import lighthouse from "lighthouse";
import desktopConfig from "lighthouse/core/config/desktop-config.js";
import * as chromeLauncher from "chrome-launcher";
import type { CategoryBundle, PerformanceMetric, RawAuditItem } from "./types.js";

export type LighthouseFormFactor = "mobile" | "desktop";

function resolveFormFactor(): LighthouseFormFactor {
  const raw = process.env.LIGHTHOUSE_FORM_FACTOR?.trim().toLowerCase();
  return raw === "desktop" ? "desktop" : "mobile";
}

const PERF_METRIC_IDS: { id: string; shortLabel: string }[] = [
  { id: "first-contentful-paint", shortLabel: "FCP" },
  { id: "largest-contentful-paint", shortLabel: "LCP" },
  { id: "total-blocking-time", shortLabel: "TBT" },
  { id: "cumulative-layout-shift", shortLabel: "CLS" },
  { id: "speed-index", shortLabel: "Speed Index" },
  { id: "interactive", shortLabel: "TTI" },
];

const LH_CATEGORIES = ["performance", "accessibility", "best-practices", "seo"] as const;

interface AuditLike {
  title: string;
  description: string;
  score: number | null;
  scoreDisplayMode: string;
  displayValue?: string;
  numericValue?: number;
  numericUnit?: string;
  details?: unknown;
}

function extractPerformanceMetrics(
  audits: Record<string, AuditLike | undefined>,
): PerformanceMetric[] {
  const metrics: PerformanceMetric[] = [];
  for (const { id, shortLabel } of PERF_METRIC_IDS) {
    const audit = audits[id];
    if (!audit || audit.numericValue === undefined) continue;
    metrics.push({
      id,
      title: audit.title,
      shortLabel,
      value: audit.numericValue,
      unit: audit.numericUnit || "unitless",
      displayValue: audit.displayValue || String(audit.numericValue),
      score: audit.score,
    });
  }
  return metrics;
}

function auditToItem(id: string, audit: AuditLike): RawAuditItem | null {
  if (audit.scoreDisplayMode === "notApplicable" || audit.scoreDisplayMode === "manual") {
    return null;
  }
  if (audit.score === null) {
    return null;
  }
  if (audit.score >= 1) {
    return null;
  }

  let detailsSummary: string | undefined;
  const d = audit.details as { items?: unknown[] } | undefined;
  if (d?.items && d.items.length > 0) {
    detailsSummary = `${d.items.length} item(s)`;
  }

  return {
    id,
    title: audit.title,
    description: audit.description,
    score: audit.score,
    displayValue: audit.displayValue,
    detailsSummary,
  };
}

export async function runLighthouseAudit(url: string): Promise<{
  lighthouseVersion: string;
  formFactor: LighthouseFormFactor;
  categories: Record<string, CategoryBundle>;
  performanceMetrics: PerformanceMetric[];
}> {
  const formFactor = resolveFormFactor();
  const chrome = await chromeLauncher.launch({
    chromeFlags: ["--headless", "--no-sandbox", "--disable-gpu"],
  });

  try {
    const options = {
      logLevel: "error" as const,
      output: "json" as const,
      onlyCategories: [...LH_CATEGORIES],
      port: chrome.port,
      maxWaitForLoadMs: 90000,
    };

    const lhConfig = formFactor === "desktop" ? desktopConfig : undefined;
    const runnerResult = await lighthouse(url, options, lhConfig);
    const lhr = runnerResult?.lhr;
    if (!lhr) {
      throw new Error("Lighthouse returned no result");
    }

    const categories: Record<string, CategoryBundle> = {};

    for (const catId of LH_CATEGORIES) {
      const cat = lhr.categories[catId];
      if (!cat) continue;

      const audits: RawAuditItem[] = [];
      for (const ref of cat.auditRefs) {
        const audit = lhr.audits[ref.id] as AuditLike | undefined;
        if (!audit) continue;
        const item = auditToItem(ref.id, audit);
        if (item) audits.push(item);
        if (audits.length >= 30) break;
      }

      categories[catId] = {
        score: Math.round((cat.score ?? 0) * 100),
        audits,
      };
    }

    return {
      lighthouseVersion: lhr.lighthouseVersion || "unknown",
      formFactor,
      categories,
      performanceMetrics: extractPerformanceMetrics(
        lhr.audits as Record<string, AuditLike | undefined>,
      ),
    };
  } finally {
    await chrome.kill();
  }
}
