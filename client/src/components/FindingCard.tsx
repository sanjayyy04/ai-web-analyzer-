import type { HumanizedFinding } from "../types";
import { CodeSnippet } from "./CodeSnippet";

export function FindingCard({ finding }: { finding: HumanizedFinding }) {
  return (
    <li className="rounded-xl border border-slate-200/90 bg-white/60 p-5 dark:border-white/10 dark:bg-black/20">
      <p className="text-xs font-semibold uppercase tracking-widest text-indigo-700 dark:text-cyan-400">
        Issue
      </p>
      <p className="mt-1 font-medium text-slate-900 dark:text-slate-100">{finding.summary}</p>

      <p className="mt-4 text-xs font-semibold uppercase tracking-widest text-indigo-700 dark:text-cyan-400">
        Impact
      </p>
      <p className="mt-1 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
        {finding.impact}
      </p>

      <p className="mt-4 text-xs font-semibold uppercase tracking-widest text-indigo-700 dark:text-cyan-400">
        AI Fix
      </p>
      <p className="mt-1 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{finding.fix}</p>

      {finding.sampleCode && (
        <CodeSnippet code={finding.sampleCode} language={finding.codeLanguage ?? "html"} />
      )}
    </li>
  );
}
