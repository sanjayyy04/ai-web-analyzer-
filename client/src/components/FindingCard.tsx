import type { HumanizedFinding } from "../types";
import { CodeSnippet } from "./CodeSnippet";

export function FindingCard({ finding }: { finding: HumanizedFinding }) {
  return (
    <li className="rounded-xl border border-[var(--border)] bg-[var(--panel-strong)] p-5">
      <p className="text-xs font-semibold uppercase tracking-widest text-[var(--text-soft)]">
        Issue
      </p>
      <p className="mt-1 font-medium text-[var(--text)]">{finding.summary}</p>

      <p className="mt-4 text-xs font-semibold uppercase tracking-widest text-[var(--text-soft)]">
        Impact
      </p>
      <p className="mt-1 text-sm leading-relaxed text-[var(--text-soft)]">{finding.impact}</p>

      <p className="mt-4 text-xs font-semibold uppercase tracking-widest text-[var(--text-soft)]">
        AI Fix
      </p>
      <p className="mt-1 text-sm leading-relaxed text-[var(--text-soft)]">{finding.fix}</p>

      {finding.sampleCode && (
        <CodeSnippet code={finding.sampleCode} language={finding.codeLanguage ?? "html"} />
      )}
    </li>
  );
}
