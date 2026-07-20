import { useTheme } from "../ThemeContext";

const NAV = [
  { label: "Home", href: "#top" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Guides", href: "#audit-guides" },
  { label: "Features", href: "#features" },
  { label: "Analyze", href: "#analyze" },
] as const;

function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const isDark = theme === "dark";
  return (
    <button
      type="button"
      onClick={toggle}
      className="inline-flex items-center gap-2 rounded-full border border-slate-400/50 bg-white/70 px-3 py-2 text-xs font-semibold uppercase tracking-widest text-slate-700 shadow-sm backdrop-blur transition hover:border-indigo-400/60 dark:border-white/15 dark:bg-white/10 dark:text-slate-200 dark:hover:border-cyan-400/40"
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
    >
      {isDark ? (
        <svg className="h-4 w-4 text-amber-300" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M12 3a9 9 0 109 9c0-.46-.04-.92-.1-1.36a5.5 5.5 0 01-7.74-7.74A8.96 8.96 0 0012 3z" />
        </svg>
      ) : (
        <svg className="h-4 w-4 text-amber-500" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M12 7a5 5 0 100 10 5 5 0 000-10zM12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
        </svg>
      )}
      <span className="hidden sm:inline">{isDark ? "Light" : "Dark"}</span>
    </button>
  );
}

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-400/40 bg-white/80 backdrop-blur-md dark:border-white/10 dark:bg-[#06080f]/80">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <a
          href="#top"
          className="flex items-center gap-3 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50"
        >
          <span className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-indigo-500/40 bg-gradient-to-br from-indigo-600/20 to-cyan-500/20 dark:border-cyan-400/30">
            <svg
              className="h-5 w-5 text-indigo-700 dark:text-cyan-300"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              aria-hidden
            >
              <path strokeLinecap="round" d="M4 7h16M4 12h10M4 17h6" />
              <circle cx="17" cy="12" r="3" />
            </svg>
            <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-cyan-500 shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
          </span>
          <div className="hidden min-w-0 sm:block">
            <p className="font-display text-sm font-bold leading-tight text-slate-900 dark:text-white">
              AI Web Analyzer
            </p>
            <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-indigo-800 dark:text-cyan-400/90">
              Lighthouse + AI
            </p>
          </div>
        </a>

        <nav className="flex items-center gap-0.5 sm:gap-1" aria-label="Main">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-lg px-2 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-900/5 hover:text-indigo-700 sm:px-3 sm:py-2 sm:text-sm dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-cyan-300"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <ThemeToggle />
      </div>
      <div
        className="h-px w-full bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent dark:via-cyan-400/40"
        aria-hidden
      />
    </header>
  );
}
