import type { ReactNode } from "react";

const PRODUCT_LINKS = [
  { label: "Launch audit", href: "#analyze" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Features", href: "#features" },
  { label: "Guides", href: "#audit-guides" },
  { label: "Preview", href: "#preview" },
  { label: "FAQ", href: "#faq" },
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
      className="text-sm text-[var(--text-soft)] transition hover:text-[var(--text)]"
    >
      {children}
    </a>
  );
}

export function SiteFooter() {
  return (
    <footer
      id="footer"
      className="relative z-10 mt-16 border-t border-[var(--border)] bg-[var(--panel-strong)] text-[var(--text)]"
    >
      <div className="content-container py-16">
        <div className="flex flex-col gap-12 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-xs">
            <p className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
              Experience the audit
            </p>
            <p className="mt-3 text-sm leading-relaxed text-[var(--text-soft)]">
              Lighthouse scores, performance charts, and AI-powered fixes — in one report.
            </p>
            <a
              href="#analyze"
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[var(--text)] underline decoration-[var(--border-strong)] underline-offset-4 transition hover:decoration-[var(--text)]"
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
          <p className="text-xs font-medium uppercase tracking-[0.35em] text-[var(--text-soft)]">
            AI Web
          </p>
          <p
            className="font-display font-bold leading-[0.88] tracking-tight text-[var(--text)]"
            style={{ fontSize: "clamp(3.25rem, 14vw, 9.5rem)" }}
          >
            Analyzer
          </p>
        </div>
        <p className="sr-only">AI Web Analyzer</p>
      </div>

      <div className="border-t border-[var(--border)]">
        <div className="content-container flex flex-col items-start justify-between gap-6 py-6 sm:flex-row sm:items-center">
          <a
            href="#top"
            className="flex items-center gap-2.5 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-black/30 dark:focus-visible:ring-white/40"
          >
            <span className="text-sm font-semibold tracking-tight">AI Web Analyzer</span>
          </a>

          <nav className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-[var(--text-soft)]" aria-label="Legal">
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
