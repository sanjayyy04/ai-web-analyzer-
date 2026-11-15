import { DownloadReport } from "./DownloadReport";
import { FindingCard } from "./FindingCard";
import { OverallScoreChart } from "./charts/OverallScoreChart";
import { PerformanceCharts } from "./charts/PerformanceCharts";
import { SiteHeader } from "./SiteHeader";
import type { AnalyzeResponse } from "../types";

const SCORE_KEYS = [
  ["performance", "Performance"],
  ["accessibility", "Accessibility"],
  ["seo", "SEO"],
  ["best-practices", "Best practices"],
  ["ux", "UX"],
  ["content", "Content"],
] as const;

function scoreColor(score: number | null): string {
  if (score === null) return "bg-[var(--border-strong)]";
  if (score >= 90) return "bg-[var(--score-good)]";
  if (score >= 50) return "bg-[var(--score-warning)]";
  return "bg-[var(--score-low)]";
}

export function AuditReportPage({
  data,
  onBack,
  onNewAudit,
}: {
  data: AnalyzeResponse | null;
  onBack: () => void;
  onNewAudit: () => void;
}) {
  return (
    <div className="app-shell min-h-screen">
      <SiteHeader mode="report" onBack={onBack} onNewAudit={onNewAudit} />

      <main className="content-container pb-16 pt-8 sm:pt-12">
        {!data ? (
          <section className="surface-panel mx-auto max-w-2xl p-8 text-center sm:p-12">
            <p className="section-kicker">No saved report</p>
            <h1 className="mt-3 font-display text-2xl font-semibold text-[var(--text)]">
              Run an audit to see your results here.
            </h1>
            <p className="mt-3 text-sm text-[var(--text-soft)]">
              Reports are available in this browser session after an audit completes.
            </p>
            <button type="button" className="btn-primary mt-6" onClick={onNewAudit}>
              Analyze a website
            </button>
          </section>
        ) : (
          <div className="space-y-6">
            <section className="flex flex-col gap-5 border-b border-[var(--border)] pb-6 sm:flex-row sm:items-end sm:justify-between">
              <div className="min-w-0">
                <p className="section-kicker">Website audit report</p>
                <h1 className="mt-2 break-all font-display text-2xl font-semibold tracking-tight text-[var(--text)] sm:text-3xl">
                  {data.url}
                </h1>
                <p className="mt-2 text-sm text-[var(--text-soft)]">
                  Audited {new Date(data.fetchedAt).toLocaleString()}
                  {data.auditMeta
                    ? ` · Lighthouse ${data.auditMeta.lighthouseVersion} · ${data.auditMeta.formFactor}`
                    : ""}
                  {data.aiModel && data.aiModel !== "fallback" ? ` · ${data.aiModel}` : ""}
                </p>
              </div>
              <button type="button" className="btn-secondary shrink-0" onClick={onNewAudit}>
                Analyze another site
              </button>
            </section>

            {data.note && (
              <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-subtle)] px-4 py-3 text-sm text-[var(--text-soft)]">
                {data.note}
              </div>
            )}

            <DownloadReport data={data} />

            <section className="surface-panel p-5 sm:p-7" aria-labelledby="scores-heading">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <p className="section-kicker">At a glance</p>
                  <h2 id="scores-heading" className="mt-2 font-display text-xl font-semibold text-[var(--text)]">
                    Audit scores
                  </h2>
                </div>
                <p className="max-w-3xl text-sm leading-relaxed text-[var(--text-soft)]">
                  {data.auditMeta && (
                    <>
                      Scores may differ from Chrome DevTools when device mode differs. UX and
                      Content are app heuristics, not Lighthouse. Set{" "}
                      <code className="rounded bg-[var(--surface-muted)] px-1.5 py-0.5">
                        LIGHTHOUSE_FORM_FACTOR=desktop
                      </code>{" "}
                      on the server to match desktop audits.
                    </>
                  )}
                </p>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
                {SCORE_KEYS.map(([key, label]) => {
                  const score = data.scores[key] ?? null;
                  return (
                    <div key={key} className="metric-card">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-xs font-medium text-[var(--text-soft)]">{label}</p>
                        <span
                          className={`h-2.5 w-2.5 shrink-0 rounded-full ${scoreColor(score)}`}
                          aria-label={
                            score === null
                              ? "Score unavailable"
                              : score >= 90
                                ? "Good score"
                                : score >= 50
                                  ? "Score needs attention"
                                  : "Low score"
                          }
                        />
                      </div>
                      <p className="mt-3 font-display text-3xl font-semibold tabular-nums text-[var(--text)]">
                        {score === null ? "—" : score}
                        {score !== null && <span className="ml-1 text-sm font-medium text-[var(--text-soft)]">/100</span>}
                      </p>
                    </div>
                  );
                })}
              </div>
            </section>

            <section className="grid gap-6 xl:grid-cols-2">
              <div className="surface-panel min-w-0 p-5 sm:p-7">
                <p className="section-kicker">Core Web Vitals</p>
                <h2 className="mt-2 font-display text-xl font-semibold text-[var(--text)]">
                  Performance details
                </h2>
                <p className="mt-1 text-sm text-[var(--text-soft)]">
                  Timing and per-metric Lighthouse scores for this run.
                </p>
                <div className="mt-5">
                  <PerformanceCharts
                    performanceScore={data.scores.performance ?? null}
                    metrics={data.performanceMetrics ?? []}
                  />
                </div>
              </div>

              <div className="surface-panel min-w-0 p-5 sm:p-7">
                <p className="section-kicker">Category balance</p>
                <h2 className="mt-2 font-display text-xl font-semibold text-[var(--text)]">
                  Overall audit summary
                </h2>
                <p className="mt-1 text-sm text-[var(--text-soft)]">
                  Compare results across all measured categories.
                </p>
                <div className="mt-5">
                  <OverallScoreChart scores={data.scores} />
                </div>
              </div>
            </section>

            <section aria-labelledby="developer-report-heading">
              <div className="mb-5">
                <p className="section-kicker">Recommended next steps</p>
                <h2 id="developer-report-heading" className="mt-2 font-display text-2xl font-semibold text-[var(--text)]">
                  Developer report
                </h2>
                <p className="mt-2 text-sm text-[var(--text-soft)]">
                  Findings include impact, a suggested fix, and sample code where available.
                </p>
              </div>
              {data.report.length > 0 ? (
                <div className="space-y-4">
                  {data.report.map((section) => (
                    <article
                      key={section.category + section.headline}
                      className="surface-subtle p-5 sm:p-7"
                    >
                      <h3 className="font-display text-lg font-semibold text-[var(--text)]">
                        {section.headline}
                      </h3>
                      <ul className="mt-4 space-y-4">
                        {section.findings.map((finding, index) => (
                          <FindingCard
                            key={`${section.category}-${finding.summary}-${index}`}
                            finding={finding}
                          />
                        ))}
                      </ul>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="surface-panel p-6 text-sm text-[var(--text-soft)]">
                  No report findings were returned for this audit.
                </div>
              )}
            </section>
          </div>
        )}
      </main>
    </div>
  );
}
