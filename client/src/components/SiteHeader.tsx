import { useEffect, useRef, useState } from "react";

const NAV = [
  { label: "Home", href: "#top" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Guides", href: "#audit-guides" },
  { label: "Features", href: "#features" },
  { label: "Preview", href: "#preview" },
  { label: "FAQ", href: "#faq" },
  { label: "Analyze", href: "#analyze" },
] as const;

type SiteHeaderProps = {
  mode?: "home" | "analyze" | "report";
  onBack?: () => void;
  onNewAudit?: () => void;
};

export function SiteHeader({ mode = "home", onBack, onNewAudit }: SiteHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    }
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [menuOpen]);

  return (
    <header className="sticky top-0 z-50 pt-3">
      <div className="content-container relative flex items-center justify-between gap-3 rounded-xl border border-[var(--border)] bg-[var(--panel)] py-2.5 shadow-[0_10px_30px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:gap-5 sm:py-2.5">
        <a
          href={mode !== "home" ? "/" : "#top"}
          className="shrink-0 rounded-lg px-1 py-1 outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-strong)]"
          onClick={mode !== "home" ? (event) => {
            event.preventDefault();
            onBack?.();
          } : undefined}
        >
          <div className="min-w-0">
            <p className="font-display text-sm font-bold leading-tight tracking-tight text-[var(--text)] sm:text-base">
              AI Web <span className="text-[var(--accent-strong)]">Analyzer</span>
            </p>
            <p className="hidden text-[9px] font-medium uppercase tracking-[0.16em] text-[var(--text-soft)] sm:block">
              Lighthouse + AI
            </p>
          </div>
        </a>

        {mode === "home" ? (
          <nav className="hidden items-center gap-0.5 rounded-lg bg-[var(--surface-subtle)] p-1 lg:flex" aria-label="Main">
            {NAV.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="rounded-md px-3 py-2 text-xs font-medium text-[var(--text-soft)] transition hover:bg-[var(--panel-strong)] hover:text-[var(--text)]"
              >
                {item.label}
              </a>
            ))}
          </nav>
        ) : (
          <button type="button" onClick={onBack} className="hidden rounded-lg px-4 py-2 text-sm font-medium text-[var(--text-soft)] hover:bg-[var(--surface-subtle)] hover:text-[var(--text)] sm:inline-flex">
            Back to analyzer
          </button>
        )}

        <div className="flex shrink-0 items-center gap-2">
          {mode === "home" ? (
            <a href="#analyze" className="hidden min-h-10 items-center justify-center rounded-lg bg-[var(--accent)] px-4 text-xs font-semibold text-[#151b15] transition hover:-translate-y-0.5 sm:inline-flex">
              Analyze a site
            </a>
          ) : mode === "report" ? (
            <button type="button" onClick={onNewAudit} className="hidden min-h-10 items-center justify-center rounded-lg bg-[var(--accent)] px-4 text-xs font-semibold text-[#151b15] transition hover:-translate-y-0.5 sm:inline-flex">
              New audit
            </button>
          ) : null}
          {mode === "home" && (
            <button
              ref={menuButtonRef}
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--panel-strong)] text-[var(--text)] hover:bg-[var(--surface-subtle)] lg:hidden"
              aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={menuOpen}
              aria-controls="mobile-navigation"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
                {menuOpen ? (
                  <path strokeLinecap="round" d="m6 6 12 12M18 6 6 18" />
                ) : (
                  <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
                )}
              </svg>
            </button>
          )}
        </div>

        {mode === "home" && (
          <nav
            id="mobile-navigation"
            className={`absolute inset-x-0 top-[calc(100%+0.5rem)] z-50 grid gap-1 rounded-xl border border-[var(--border)] bg-[var(--panel-strong)] p-2 shadow-lg lg:hidden ${
              menuOpen ? "" : "hidden"
            }`}
            aria-label="Mobile"
          >
            {NAV.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="flex min-h-11 items-center rounded-md px-4 text-sm font-medium text-[var(--text-soft)] transition hover:bg-[var(--surface-subtle)] hover:text-[var(--text)]"
              >
                {item.label}
              </a>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
