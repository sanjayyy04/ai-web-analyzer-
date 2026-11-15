/** Skeleton wireframe shown while Lighthouse runs — suggests “deep analysis” */
export function AnalysisWireframe() {
  return (
    <div className="mt-10 space-y-8">
      <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.25em] text-[var(--text-soft)]">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--score-good)] opacity-50" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--score-good)]" />
        </span>
        Live wireframe · audit in progress
      </div>

      {/* Fake browser */}
      <div className="overflow-hidden rounded-2xl border-2 border-dashed border-[var(--border)] bg-[var(--panel-strong)]">
        <div className="flex items-center gap-2 border-b-2 border-dashed border-[var(--border)] px-4 py-3">
          <div className="flex gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full border-2 border-[var(--border-strong)]" />
            <div className="h-2.5 w-2.5 rounded-full border-2 border-[var(--border-strong)]" />
            <div className="h-2.5 w-2.5 rounded-full border-2 border-[var(--border-strong)]" />
          </div>
          <div className="ml-3 h-8 flex-1 rounded-lg border-2 border-dashed border-[var(--border-strong)] bg-[var(--surface-subtle)]" />
        </div>
        <div className="grid gap-3 p-4 sm:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="space-y-2 rounded-xl border-2 border-dashed border-[var(--border)] p-3"
            >
              <div className="h-3 w-1/2 rounded border-2 border-dashed border-[var(--border-strong)]" />
              <div className="h-16 rounded-lg border-2 border-dashed border-[var(--border)] bg-[var(--surface-subtle)]" />
              <div className="h-2 w-full rounded border-2 border-dashed border-[var(--border)]" />
            </div>
          ))}
        </div>
      </div>

      {/* Score grid wireframe */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {["LCP", "CLS", "INP", "SEO", "A11y", "BP"].map((label, i) => (
          <div
            key={label}
            className="relative overflow-hidden rounded-xl border-2 border-dashed border-[var(--border)] bg-[var(--surface-subtle)] p-4"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-semibold uppercase tracking-widest text-[var(--text-soft)]">
                {label}
              </span>
              <span className="h-2 w-2 rounded-sm border-2 border-[var(--border-strong)] animate-pulse-line" />
            </div>
            <div className="mt-4 h-10 w-16 rounded border-2 border-dashed border-[var(--border-strong)] bg-[var(--surface-subtle)]" />
            <div className="mt-3 space-y-2">
              <div className="h-1.5 w-full rounded border-2 border-dashed border-[var(--border)]" />
              <div className="h-1.5 w-4/5 rounded border-2 border-dashed border-[var(--border)]" />
            </div>
          </div>
        ))}
      </div>

      {/* Report blocks */}
      <div className="space-y-4">
        {[1, 2, 3].map((n) => (
          <div
            key={n}
            className="rounded-2xl border-2 border-dashed border-[var(--border)] bg-[var(--panel-strong)] p-5"
          >
            <div className="h-4 w-1/3 rounded border-2 border-dashed border-[var(--border-strong)]" />
            <div className="mt-4 space-y-2">
              <div className="h-2 w-full rounded border-2 border-dashed border-[var(--border)]" />
              <div className="h-2 w-11/12 rounded border-2 border-dashed border-[var(--border)]" />
              <div className="h-2 w-4/5 rounded border-2 border-dashed border-[var(--border)]" />
            </div>
          </div>
        ))}
      </div>

      <p className="text-center text-xs text-[var(--text-soft)]">
        Lighthouse is profiling the page in headless Chrome—this can take up to a couple of minutes.
      </p>
    </div>
  );
}
