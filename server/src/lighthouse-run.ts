import lighthouse from "lighthouse";
import * as chromeLauncher from "chrome-launcher";
import type { CategoryBundle, RawAuditItem } from "./types.js";

const LH_CATEGORIES = ["performance", "accessibility", "best-practices", "seo"] as const;

interface AuditLike {
  title: string;
  description: string;
  score: number | null;
  scoreDisplayMode: string;
  displayValue?: string;
  details?: unknown;
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
  categories: Record<string, CategoryBundle>;
}> {
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

    const runnerResult = await lighthouse(url, options);
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
      categories,
    };
  } finally {
    await chrome.kill();
  }
}
