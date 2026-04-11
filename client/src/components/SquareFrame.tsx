import type { CSSProperties, ReactNode } from "react";

/** Square corner brackets + inner copy */
export function SquareFrame({
  title,
  children,
  delayClass = "",
  style,
}: {
  title: string;
  children: ReactNode;
  delayClass?: string;
  style?: CSSProperties;
}) {
  return (
    <div
      className={`group relative p-5 transition-transform duration-500 hover:-translate-y-1 ${delayClass}`}
      style={style}
    >
      <div className="pointer-events-none absolute inset-0">
        <span className="absolute left-0 top-0 h-4 w-4 border-l-2 border-t-2 border-indigo-600/90 dark:border-cyan-400/70" />
        <span className="absolute right-0 top-0 h-4 w-4 border-r-2 border-t-2 border-teal-600/85 dark:border-indigo-400/60" />
        <span className="absolute bottom-0 left-0 h-4 w-4 border-b-2 border-l-2 border-fuchsia-600/80 dark:border-fuchsia-400/50" />
        <span className="absolute bottom-0 right-0 h-4 w-4 border-b-2 border-r-2 border-indigo-600/85 dark:border-cyan-300/50" />
      </div>
      <div className="relative border border-slate-400/70 bg-white/95 px-4 py-4 shadow-sm dark:border-white/10 dark:bg-white/5 dark:shadow-none">
        <div className="absolute left-3 top-0 -translate-y-1/2 bg-[#f0ebe3] px-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-indigo-800 dark:bg-[#06080f] dark:text-cyan-300">
          {title}
        </div>
        <div className="pt-2 text-sm leading-relaxed text-slate-800 dark:text-slate-300">{children}</div>
      </div>
    </div>
  );
}
