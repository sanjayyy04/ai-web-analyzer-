import { useMemo, useState } from "react";
import { AnalysisWireframe } from "./components/AnalysisWireframe";
import { FeatureGrid } from "./components/FeatureGrid";
import { VintageBackdrop } from "./components/VintageBackdrop";
import { useTheme } from "./ThemeContext";
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

function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const isDark = theme === "dark";
  return (
    <button
      type="button"
      onClick={toggle}
      className="group inline-flex items-center gap-2 rounded-full border border-slate-400/50 bg-white/60 px-3 py-2 text-xs font-semibold uppercase tracking-widest text-slate-700 shadow-sm backdrop-blur transition hover:border-indigo-400/60 dark:border-white/15 dark:bg-white/5 dark:text-slate-200 dark:hover:border-cyan-400/40"
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
    >
      {isDark ? (
        <svg
          className="h-4 w-4 text-amber-300"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden
        >
          <path d="M12 3a9 9 0 109 9c0-.46-.04-.92-.1-1.36a5.5 5.5 0 01-7.74-7.74A8.96 8.96 0 0012 3z" />
        </svg>
      ) : (
        <svg
          className="h-4 w-4 text-amber-500"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden
        >
          <path d="M12 7a5 5 0 100 10 5 5 0 000-10zM12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
        </svg>
      )}
      <span className="hidden sm:inline">{isDark ? "Light" : "Dark"}</span>
    </button>
  );
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

  async function onAnalyze(e: React.FormEvent) {
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

      <div className="relative mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <header className="max-w-2xl text-center sm:text-left">
            <p className="text-sm font-medium uppercase tracking-[0.35em] text-indigo-800 dark:text-cyan-300/90">
              AI-Powered Web Intelligence
            </p>
            <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
              Decode Your Website’s Intelligence Layer
            </h1>
            <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">
              Dive into the hidden layers of your website. Reveal performance,
              structure, and usability issues — translated into actionable
              intelligence.
            </p>
          </header>
          <div className="flex justify-center sm:justify-end">
            <ThemeToggle />
          </div>
        </div>

        <FeatureGrid />

        <form onSubmit={onAnalyze} className={`${panel} mt-12`}>
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
            It may be take some time to run, Keep this tab open.
          </p>
        </form>

        {error && (
          <div className="mt-6 rounded-xl border border-rose-400/50 bg-rose-50 px-4 py-3 text-sm text-rose-900 dark:border-rose-500/40 dark:bg-rose-950/40 dark:text-rose-100">
            {error}
          </div>
        )}

        {loading && <AnalysisWireframe />}

        {data && !loading && (
          <div className="mt-10 space-y-8">
            {data.note && (
              <div className="rounded-xl border border-cyan-500/40 bg-cyan-50 px-4 py-3 text-sm text-cyan-950 dark:border-cyan-500/30 dark:bg-cyan-950/30 dark:text-cyan-100">
                {data.note}
              </div>
            )}

            <section className={panel}>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h2 className="font-display text-xl font-semibold text-slate-900 dark:text-white">
                    Scores
                  </h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {data.url} · {new Date(data.fetchedAt).toLocaleString()}
                    {data.aiModel && data.aiModel !== "fallback"
                      ? ` · model: ${data.aiModel}`
                      : ""}
                  </p>
                </div>
              </div>
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

            <section>
              <h2 className="font-display text-2xl font-semibold text-slate-900 dark:text-white">
                Developer report
              </h2>
              <p className="mt-1 text-slate-600 dark:text-slate-400">
                Impact and fix blocks stay grounded in audit data—AI only
                refines wording when enabled.
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
                    <ul className="mt-4 space-y-5">
                      {section.findings.map((f, i) => (
                        <li
                          key={i}
                          className="border-t border-slate-200/80 pt-5 first:border-t-0 first:pt-0 dark:border-white/10"
                        >
                          <p className="font-medium text-slate-900 dark:text-slate-100">
                            {f.summary}
                          </p>
                          <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                            <span className="font-semibold text-slate-800 dark:text-slate-200">
                              Impact:{" "}
                            </span>
                            {f.impact}
                          </p>
                          <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                            <span className="font-semibold text-slate-800 dark:text-slate-200">
                              Fix:{" "}
                            </span>
                            {f.fix}
                          </p>
                        </li>
                      ))}
                    </ul>
                  </article>
                ))}
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
