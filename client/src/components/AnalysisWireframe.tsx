/** Skeleton wireframe shown while Lighthouse runs — suggests “deep analysis” */
export function AnalysisWireframe() {
  return (
    <div className="mt-10 space-y-8">
      <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.25em] text-indigo-800 dark:text-cyan-300">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal-500 opacity-70 dark:bg-cyan-400 dark:opacity-60" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-teal-600 dark:bg-cyan-500" />
        </span>
        Live wireframe · audit in progress
      </div>

      {/* Fake browser */}
      <div className="overflow-hidden rounded-2xl border-2 border-dashed border-slate-500/50 bg-white/90 dark:border-white/20 dark:bg-black/20">
        <div className="flex items-center gap-2 border-b-2 border-dashed border-slate-400/70 px-4 py-3 dark:border-white/10">
          <div className="flex gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full border-2 border-slate-500/90 dark:border-white/30" />
            <div className="h-2.5 w-2.5 rounded-full border-2 border-slate-500/90 dark:border-white/30" />
            <div className="h-2.5 w-2.5 rounded-full border-2 border-slate-500/90 dark:border-white/30" />
          </div>
          <div className="ml-3 h-8 flex-1 rounded-lg border-2 border-dashed border-indigo-500/55 bg-gradient-to-r from-indigo-500/10 via-cyan-500/15 to-fuchsia-500/10 bg-[length:200%_100%] animate-shimmer dark:border-cyan-400/30 dark:from-indigo-500/5" />
        </div>
        <div className="grid gap-3 p-4 sm:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="space-y-2 rounded-xl border-2 border-dashed border-slate-400/65 p-3 dark:border-white/15"
            >
              <div className="h-3 w-1/2 rounded border-2 border-dashed border-slate-500/70 dark:border-white/20" />
              <div className="h-16 rounded-lg border-2 border-dashed border-indigo-400/50 bg-slate-100/80 dark:border-cyan-500/25 dark:bg-white/5" />
              <div className="h-2 w-full rounded border-2 border-dashed border-slate-400/60 dark:border-white/10" />
            </div>
          ))}
        </div>
      </div>

      {/* Score grid wireframe */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {["LCP", "CLS", "INP", "SEO", "A11y", "BP"].map((label, i) => (
          <div
            key={label}
            className="relative overflow-hidden rounded-xl border-2 border-dashed border-slate-500/55 bg-white/40 p-4 dark:border-white/15 dark:bg-transparent"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-700 dark:text-slate-400">
                {label}
              </span>
              <span className="h-2 w-2 rounded-sm border-2 border-teal-600/70 animate-pulse-line dark:border-cyan-500/50" />
            </div>
            <div className="mt-4 h-10 w-16 rounded border-2 border-dashed border-indigo-500/50 bg-gradient-to-r from-transparent via-indigo-400/15 to-transparent bg-[length:200%_100%] animate-shimmer dark:border-cyan-400/25 dark:via-indigo-500/10" />
            <div className="mt-3 space-y-2">
              <div className="h-1.5 w-full rounded border-2 border-dashed border-slate-400/65 dark:border-white/10" />
              <div className="h-1.5 w-4/5 rounded border-2 border-dashed border-slate-400/55 dark:border-white/10" />
            </div>
          </div>
        ))}
      </div>

      {/* Report blocks */}
      <div className="space-y-4">
        {[1, 2, 3].map((n) => (
          <div
            key={n}
            className="rounded-2xl border-2 border-dashed border-slate-500/50 bg-white/35 p-5 dark:border-white/12 dark:bg-transparent"
          >
            <div className="h-4 w-1/3 rounded border-2 border-dashed border-indigo-500/50 dark:border-cyan-400/30" />
            <div className="mt-4 space-y-2">
              <div className="h-2 w-full rounded border-2 border-dashed border-slate-400/65 dark:border-white/10" />
              <div className="h-2 w-11/12 rounded border-2 border-dashed border-slate-400/55 dark:border-white/10" />
              <div className="h-2 w-4/5 rounded border-2 border-dashed border-slate-400/45 dark:border-white/10" />
            </div>
          </div>
        ))}
      </div>

      <p className="text-center text-xs text-slate-600 dark:text-slate-400">
        Lighthouse is profiling the page in headless Chrome—this can take up to a couple of minutes.
      </p>
    </div>
  );
}
