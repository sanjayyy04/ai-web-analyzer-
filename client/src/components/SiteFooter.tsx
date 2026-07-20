import type { ReactNode } from "react";

const PRODUCT_LINKS = [
  { label: "Launch audit", href: "#analyze" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Features", href: "#features" },
  { label: "Guides", href: "#audit-guides" },
] as const;

const RESOURCE_LINKS = [
  { label: "Analyze URL", href: "#analyze" },
  { label: "View results", href: "#results" },
  { label: "Lighthouse", href: "https://developer.chrome.com/docs/lighthouse/overview" },
  { label: "Gemini API", href: "https://aistudio.google.com/apikey" },
] as const;

const LEGAL_LINKS = [
  { label: "About", href: "#how-it-works" },
  { label: "Open source", href: "https://github.com" },
  { label: "Privacy", href: "#top" },
  { label: "Terms", href: "#top" },
] as const;

function FooterLink({ href, children }: { href: string; children: ReactNode }) {
  const external = href.startsWith("http");
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className="text-sm text-black/80 transition hover:text-black dark:text-white/75 dark:hover:text-white"
    >
      {children}
    </a>
  );
}

export function SiteFooter() {
  return (
    <footer
      id="footer"
      className="relative z-10 mt-16 border-t border-black/10 bg-white text-black dark:border-white/10 dark:bg-black dark:text-white"
    >
      <div className="mx-auto max-w-6xl px-6 py-16 sm:px-8 lg:px-12">
        <div className="flex flex-col gap-12 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-xs">
            <p className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
              Experience the audit
            </p>
            <p className="mt-3 text-sm leading-relaxed text-black/60 dark:text-white/55">
              Lighthouse scores, performance charts, and AI-powered fixes — in one report.
            </p>
            <a
              href="#analyze"
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-black underline decoration-black/30 underline-offset-4 transition hover:decoration-black dark:text-white dark:decoration-white/40 dark:hover:decoration-white"
            >
              Launch audit
              <span aria-hidden>→</span>
            </a>
          </div>

          <div className="flex gap-16 sm:gap-24">
            <nav aria-label="Product">
              <ul className="space-y-3">
                {PRODUCT_LINKS.map((item) => (
                  <li key={item.href + item.label}>
                    <FooterLink href={item.href}>{item.label}</FooterLink>
                  </li>
                ))}
              </ul>
            </nav>
            <nav aria-label="Resources">
              <ul className="space-y-3">
                {RESOURCE_LINKS.map((item) => (
                  <li key={item.href + item.label}>
                    <FooterLink href={item.href}>{item.label}</FooterLink>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>

        <div className="pointer-events-none mt-14 select-none" aria-hidden>
          <p className="text-xs font-medium uppercase tracking-[0.35em] text-black/50 dark:text-white/45">
            AI Web
          </p>
          <p
            className="font-display font-bold leading-[0.88] tracking-tight text-black dark:text-white"
            style={{ fontSize: "clamp(3.25rem, 14vw, 9.5rem)" }}
          >
            Analyzer
          </p>
        </div>
        <p className="sr-only">AI Web Analyzer</p>
      </div>

      <div className="border-t border-black/10 dark:border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-6 py-6 sm:flex-row sm:items-center sm:px-8 lg:px-12">
          <a
            href="#top"
            className="flex items-center gap-2.5 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-black/30 dark:focus-visible:ring-white/40"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-md border border-black/20 dark:border-white/25">
              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                aria-hidden
              >
                <path strokeLinecap="round" d="M4 7h16M4 12h10M4 17h6" />
                <circle cx="17" cy="12" r="3" />
              </svg>
            </span>
            <span className="text-sm font-semibold tracking-tight">AI Web Analyzer</span>
          </a>

          <nav
            className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-black/70 dark:text-white/60"
            aria-label="Legal"
          >
            {LEGAL_LINKS.map((item) => (
              <FooterLink key={item.label} href={item.href}>
                {item.label}
              </FooterLink>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
