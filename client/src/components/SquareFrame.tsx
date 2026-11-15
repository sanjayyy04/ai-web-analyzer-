import type { ReactNode } from "react";

export function SquareFrame({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="group relative rounded-2xl border border-[var(--border)] bg-[var(--panel-strong)] p-5 transition-transform duration-200 hover:-translate-y-1">
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--accent-soft)] text-[10px] font-bold uppercase tracking-wide text-[var(--accent-strong)]">
          {title.toUpperCase().slice(0, 4)}
        </span>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--text-soft)]">
          {title}
        </p>
      </div>
      <div className="mt-4 text-sm leading-relaxed text-[var(--text-soft)]">{children}</div>
    </div>
  );
}
