import { useState } from "react";
import type { AnalyzeResponse } from "../types";
import { downloadFullReport, type ReportFormat } from "../utils/downloadReport";

const FORMATS: { id: ReportFormat; label: string; hint: string }[] = [
  { id: "markdown", label: "Markdown (.md)", hint: "Best for docs & GitHub" },
  { id: "html", label: "HTML (.html)", hint: "Open in browser · Print to PDF" },
  { id: "json", label: "JSON (.json)", hint: "Full raw data export" },
];

export function DownloadReport({ data }: { data: AnalyzeResponse }) {
  const [open, setOpen] = useState(false);
  const [lastFormat, setLastFormat] = useState<ReportFormat | null>(null);

  function handleDownload(format: ReportFormat) {
    downloadFullReport(data, format);
    setLastFormat(format);
    setOpen(false);
  }

  return (
    <div className="rounded-2xl border border-indigo-300/50 bg-gradient-to-r from-indigo-50/90 to-cyan-50/50 p-5 dark:border-cyan-500/30 dark:from-indigo-950/40 dark:to-cyan-950/20">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-lg font-semibold text-slate-900 dark:text-white">
            Download full report
          </h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Export scores, findings, AI fixes, and sample code in one file.
          </p>
          {lastFormat && (
            <p className="mt-2 text-xs text-emerald-700 dark:text-emerald-400">
              Downloaded {FORMATS.find((f) => f.id === lastFormat)?.label}
            </p>
          )}
        </div>

        <div className="relative flex shrink-0 flex-col gap-2 sm:flex-row">
          <button
            type="button"
            onClick={() => handleDownload("markdown")}
            className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-indigo-500 dark:bg-indigo-500"
          >
            <DownloadIcon />
            Download report
          </button>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl border border-slate-400/60 bg-white/80 px-4 py-2.5 text-sm font-semibold text-slate-800 transition hover:border-indigo-400 dark:border-white/15 dark:bg-white/10 dark:text-slate-200"
            aria-expanded={open}
            aria-haspopup="menu"
          >
            More formats
            <ChevronIcon open={open} />
          </button>

          {open && (
            <div
              className="absolute right-0 top-full z-20 mt-2 w-56 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg dark:border-white/10 dark:bg-slate-900"
              role="menu"
            >
              {FORMATS.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  role="menuitem"
                  onClick={() => handleDownload(f.id)}
                  className="flex w-full flex-col items-start px-4 py-3 text-left transition hover:bg-slate-50 dark:hover:bg-white/5"
                >
                  <span className="text-sm font-medium text-slate-900 dark:text-white">{f.label}</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">{f.hint}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function DownloadIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path strokeLinecap="round" d="M12 3v12M8 11l4 4 4-4M5 21h14" />
    </svg>
  );
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      className={`h-4 w-4 transition ${open ? "rotate-180" : ""}`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden
    >
      <path strokeLinecap="round" d="M6 9l6 6 6-6" />
    </svg>
  );
}
