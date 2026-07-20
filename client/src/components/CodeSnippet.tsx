import { useState } from "react";

export function CodeSnippet({
  code,
  language = "html",
}: {
  code: string;
  language?: string;
}) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  }

  return (
    <div className="mt-3 overflow-hidden rounded-xl border border-slate-300/80 bg-slate-950 dark:border-white/15">
      <div className="flex items-center justify-between border-b border-white/10 bg-slate-900 px-3 py-2">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">
          Sample code · {language}
        </span>
        <button
          type="button"
          onClick={copy}
          className="rounded-md bg-white/10 px-2.5 py-1 text-xs font-medium text-slate-200 transition hover:bg-white/20"
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="overflow-x-auto p-4 text-xs leading-relaxed text-emerald-100/95 sm:text-sm">
        <code>{code}</code>
      </pre>
    </div>
  );
}
