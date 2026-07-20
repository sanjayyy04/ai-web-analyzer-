import { useEffect, useMemo, useState, type FormEvent } from "react";
import { AnalysisWireframe } from "./components/AnalysisWireframe";
import { OverallScoreChart } from "./components/charts/OverallScoreChart";
import { PerformanceCharts } from "./components/charts/PerformanceCharts";
import { DownloadReport } from "./components/DownloadReport";
import { FindingCard } from "./components/FindingCard";
import { FeatureGrid } from "./components/FeatureGrid";
import { HowItWorks } from "./components/HowItWorks";
import { SnapSection } from "./components/SnapSection";
import { SiteFooter } from "./components/SiteFooter";
import { SiteHeader } from "./components/SiteHeader";
import { StickyAuditSection } from "./components/StickyAuditSection";
import { VintageBackdrop } from "./components/VintageBackdrop";
import type { AnalyzeResponse } from "./types";

const SCORE_KEYS = [
  ["performance", "Performance"],
  ["accessibility", "Accessibility"],
  ["seo", "SEO"],
  ["best-practices", "Best practices"],
  ["ux", "UX"],
  ["content", "Content"],
] as const;

function scoreColor(score: number | null): string {
  if (score === null) return "bg-slate-400 dark:bg-slate-600";
  if (score >= 90) return "bg-emerald-500";
  if (score >= 50) return "bg-amber-500";
  return "bg-rose-500";
}

export default function App() {
  const [url, setUrl] = useState("https://web.dev");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<AnalyzeResponse | null>(null);

  const canSubmit = useMemo(
    () => url.trim().length > 0 && !loading,
    [url, loading],
  );

  useEffect(() => {
    if (data && !loading) {
      document.getElementById("results")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [data, loading]);

  async function onAnalyze(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setData(null);
    setLoading(true);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || "Request failed");
        return;
      }
      setData(json as AnalyzeResponse);
    } catch {
      setError("Network error. Is the API running on port 8787?");
    } finally {
      setLoading(false);
    }
  }

  const panel =
    "rounded-2xl border border-slate-400/70 bg-white/90 p-6 shadow-lg shadow-slate-900/5 backdrop-blur dark:border-white/10 dark:bg-white/5 dark:shadow-none";

  return (
    <div className="relative min-h-screen text-slate-900 dark:text-slate-100">
      <VintageBackdrop />
      <SiteHeader />

      <main className="w-full">
        {/* Hero — full viewport snap panel */}
        <section
          id="top"
          className="snap-section snap-section-screen relative flex w-full flex-col justify-center scroll-mt-[4.5rem]"
        >
          <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl text-center sm:text-left">
              <p className="text-sm font-medium uppercase tracking-[0.35em] text-indigo-800 dark:text-cyan-300/90">
                AI-Powered Web Intelligence
              </p>
              <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-5xl lg:text-6xl">
                Decode Your Website’s Intelligence Layer
              </h1>
              <p className="mt-4 text-lg text-slate-600 dark:text-slate-300 sm:text-xl">
                Dive into the hidden layers of your website. Reveal performance, structure, and
                usability issues — translated into actionable intelligence.
              </p>
              <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:items-start">
                <a
                  href="#analyze"
                  className="inline-flex min-h-[48px] items-center justify-center rounded-full bg-indigo-600 px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition hover:bg-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-400"
                >
                  Launch audit
                </a>
                <a
                  href="#how-it-works"
                  className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-slate-400/60 bg-white/70 px-8 py-3 text-sm font-semibold text-slate-800 transition hover:border-indigo-400/60 dark:border-white/15 dark:bg-white/10 dark:text-slate-200"
                >
                  How it works
                </a>
              </div>
            </div>
          </div>
          <a
            href="#how-it-works"
            className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-1 text-xs font-medium uppercase tracking-widest text-slate-500 transition hover:text-indigo-700 dark:text-slate-400 dark:hover:text-cyan-300"
            aria-label="Scroll to next section"
          >
            <span>Scroll</span>
            <svg
              className="h-5 w-5 animate-bounce"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden
            >
              <path strokeLinecap="round" d="M12 5v14M6 13l6 6 6-6" />
            </svg>
          </a>
        </section>

        <SnapSection id="how-it-works">
          <HowItWorks />
        </SnapSection>

        <SnapSection id="audit-guides" size="auto" innerClassName="py-8">
          <StickyAuditSection />
        </SnapSection>

        <SnapSection id="features">
          <h2 className="mb-8 text-center font-display text-2xl font-bold text-slate-900 dark:text-white sm:text-left sm:text-3xl">
            What we measure
          </h2>
          <FeatureGrid />
        </SnapSection>

        <SnapSection id="analyze">
          <form onSubmit={onAnalyze} className={panel}>
            <label
              htmlFor="url"
              className="block text-sm font-medium text-slate-800 dark:text-slate-200"
            >
              Target URL
            </label>
            <div className="mt-3 flex flex-col gap-3 sm:flex-row">
              <input
                id="url"
                name="url"
                type="url"
                placeholder="https://example.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full rounded-xl border border-slate-400/50 bg-white/80 px-4 py-3 text-base text-slate-900 outline-none ring-indigo-500/20 placeholder:text-slate-400 focus:ring-2 dark:border-white/10 dark:bg-ink-900/80 dark:text-white dark:placeholder:text-slate-500"
              />
              <button
                type="submit"
                disabled={!canSubmit}
                className="inline-flex min-h-[48px] items-center justify-center rounded-xl bg-indigo-600 px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-indigo-500 dark:hover:bg-indigo-400"
              >
                {loading ? "Scanning…" : "Launch audit"}
              </button>
            </div>
            <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
              First run may take 1–3 minutes. Keep this tab open.
            </p>
          </form>

          {error && (
            <div className="mt-6 rounded-xl border border-rose-400/50 bg-rose-50 px-4 py-3 text-sm text-rose-900 dark:border-rose-500/40 dark:bg-rose-950/40 dark:text-rose-100">
              {error}
            </div>
          )}

          {loading && (
            <div className="mt-8">
              <AnalysisWireframe />
            </div>
          )}
        </SnapSection>

        {data && !loading && (
          <SnapSection id="results" size="auto" innerClassName="py-10">
            <div className="w-full space-y-8">
              {data.note && (
                <div className="rounded-xl border border-cyan-500/40 bg-cyan-50 px-4 py-3 text-sm text-cyan-950 dark:border-cyan-500/30 dark:bg-cyan-950/30 dark:text-cyan-100">
                  {data.note}
                </div>
              )}

              <DownloadReport data={data} />

              <section className={panel}>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <h2 className="font-display text-xl font-semibold text-slate-900 dark:text-white">
                      Scores
                    </h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {data.url} · {new Date(data.fetchedAt).toLocaleString()}
                      {data.auditMeta
                        ? ` · Lighthouse ${data.auditMeta.lighthouseVersion} (${data.auditMeta.formFactor})`
                        : ""}
                      {data.aiModel && data.aiModel !== "fallback"
                        ? ` · model: ${data.aiModel}`
                        : ""}
                    </p>
                  </div>
                </div>
                {data.auditMeta && (
                  <p className="mt-4 rounded-lg border border-amber-400/40 bg-amber-50/80 px-3 py-2 text-xs text-amber-950 dark:border-amber-500/30 dark:bg-amber-950/30 dark:text-amber-100">
                    Scores may differ from Chrome DevTools if device mode differs (this run:{" "}
                    <strong>{data.auditMeta.formFactor}</strong>). UX and Content are app
                    heuristics, not Lighthouse. Set{" "}
                    <code className="rounded bg-black/10 px-1 dark:bg-white/10">
                      LIGHTHOUSE_FORM_FACTOR=desktop
                    </code>{" "}
                    in server/.env to match desktop DevTools audits.
                  </p>
                )}
                <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {SCORE_KEYS.map(([key, label]) => {
                    const v = data.scores[key] ?? null;
                    return (
                      <div
                        key={key}
                        className="rounded-xl border border-slate-200/80 bg-white/70 p-4 dark:border-white/10 dark:bg-ink-900/60"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                            {label}
                          </p>
                          <span
                            className={`h-2.5 w-2.5 shrink-0 rounded-full ${scoreColor(v)}`}
                            title={v === null ? "n/a" : `${v}`}
                          />
                        </div>
                        <p className="mt-2 font-display text-3xl font-bold tabular-nums text-slate-900 dark:text-white">
                          {v === null ? "—" : `${v}`}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </section>

              <section className={panel}>
                <h2 className="font-display text-xl font-semibold text-slate-900 dark:text-white">
                  Performance charts
                </h2>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Core Web Vitals timing and per-metric Lighthouse scores.
                </p>
                <div className="mt-6">
                  <PerformanceCharts
                    performanceScore={data.scores.performance ?? null}
                    metrics={data.performanceMetrics ?? []}
                  />
                </div>
              </section>

              <section className={panel}>
                <h2 className="font-display text-xl font-semibold text-slate-900 dark:text-white">
                  Overall audit summary
                </h2>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Final radar and bar chart across all measured categories.
                </p>
                <div className="mt-6">
                  <OverallScoreChart scores={data.scores} />
                </div>
              </section>

              <section>
                <h2 className="font-display text-2xl font-semibold text-slate-900 dark:text-white">
                  Developer report
                </h2>
                <p className="mt-1 text-slate-600 dark:text-slate-400">
                  Each issue includes impact, an AI fix, and copy-paste sample code when applicable.
                </p>
                <div className="mt-6 space-y-6">
                  {data.report.map((section) => (
                    <article
                      key={section.category + section.headline}
                      className="rounded-2xl border border-slate-300/50 bg-gradient-to-br from-white/80 to-white/40 p-6 dark:border-white/10 dark:from-white/10 dark:to-white/5"
                    >
                      <h3 className="font-display text-lg font-semibold text-slate-900 dark:text-white">
                        {section.headline}
                      </h3>
                      <ul className="mt-4 space-y-4">
                        {section.findings.map((f, i) => (
                          <FindingCard key={i} finding={f} />
                        ))}
                      </ul>
                    </article>
                  ))}
                </div>
              </section>
            </div>
          </SnapSection>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
