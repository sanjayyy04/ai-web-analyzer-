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
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-subtle)] p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-lg font-semibold text-[var(--text)]">
            Download full report
          </h2>
          <p className="mt-1 text-sm text-[var(--text-soft)]">
            Export scores, findings, AI fixes, and sample code in one file.
          </p>
          {lastFormat && (
            <p className="mt-2 text-xs text-[var(--score-good)]">
              Downloaded {FORMATS.find((f) => f.id === lastFormat)?.label}
            </p>
          )}
        </div>

        <div className="relative flex shrink-0 flex-col gap-2 sm:flex-row">
          <button
            type="button"
            onClick={() => handleDownload("markdown")}
            className="btn-primary min-h-[44px]"
          >
            <DownloadIcon />
            Download report
          </button>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className="btn-secondary min-h-[44px]"
            aria-expanded={open}
            aria-haspopup="menu"
          >
            More formats
            <ChevronIcon open={open} />
          </button>

          {open && (
            <div
              className="absolute right-0 top-full z-20 mt-2 w-56 overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--panel-strong)] shadow-lg"
              role="menu"
            >
              {FORMATS.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  role="menuitem"
                  onClick={() => handleDownload(f.id)}
                  className="flex w-full flex-col items-start px-4 py-3 text-left transition hover:bg-[var(--surface-subtle)]"
                >
                  <span className="text-sm font-medium text-[var(--text)]">{f.label}</span>
                  <span className="text-xs text-[var(--text-soft)]">{f.hint}</span>
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
