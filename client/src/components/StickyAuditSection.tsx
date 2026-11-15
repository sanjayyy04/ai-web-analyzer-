import { useEffect, useRef, useState, type FormEvent } from "react";
import { ResponsiveCarousel } from "./ResponsiveCarousel";

const AUDIT_AREAS = [
  {
    id: "lighthouse",
    title: "Lighthouse performance",
    description:
      "Core Web Vitals, LCP, CLS, and load-time audits show what slows your site down and which assets to optimize first.",
    icon: (
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
        <path strokeLinecap="round" d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
    ),
    iconClass: "bg-[var(--accent-soft)] text-[var(--accent-strong)]",
  },
  {
    id: "seo",
    title: "SEO & discoverability",
    description:
      "Meta tags, titles, crawl hints, and on-page structure—summarized so you can improve search snippets and indexing.",
    icon: (
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
        <circle cx="11" cy="11" r="7" />
        <path strokeLinecap="round" d="M20 20l-3-3" />
      </svg>
    ),
    iconClass: "bg-[var(--surface-muted)] text-[var(--text)]",
  },
  {
    id: "a11y",
    title: "Accessibility",
    description:
      "Contrast, semantics, labels, and keyboard paths—issues are explained with impact and fixes your team can ship.",
    icon: (
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
        <circle cx="12" cy="4" r="2" />
        <path strokeLinecap="round" d="M12 6v6M8 20l4-6 4 6M6 10h12" />
      </svg>
    ),
    iconClass: "bg-[var(--surface-muted)] text-[var(--text)]",
  },
  {
    id: "best-practices",
    title: "Best practices & security",
    description:
      "HTTPS, console errors, deprecated APIs, and modern baseline checks—catch risky patterns before they reach production.",
    icon: (
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
        <path strokeLinecap="round" d="M12 3l7 4v5c0 4-3 7-7 9-4-2-7-5-7-9V7l7-4z" />
      </svg>
    ),
    iconClass: "bg-[var(--surface-muted)] text-[var(--text)]",
  },
  {
    id: "content",
    title: "Content & UX signals",
    description:
      "Headings, meta descriptions, image alt text, viewport, and body copy heuristics—quick HTML insights beyond Lighthouse alone.",
    icon: (
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
        <path strokeLinecap="round" d="M4 6h16M4 12h10M4 18h14" />
      </svg>
    ),
    iconClass: "bg-[var(--surface-muted)] text-[var(--text)]",
  },
] as const;

type StickyAuditSectionProps = {
  url: string;
  onUrlChange: (value: string) => void;
  onAnalyze: (event: FormEvent<HTMLFormElement>) => void;
  canSubmit: boolean;
  error: string | null;
};

function AuditCard({
  title,
  description,
  icon,
  iconClass,
  index,
}: (typeof AUDIT_AREAS)[number] & { index: number }) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.15, rootMargin: "-40px 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <article
      ref={ref}
      className={`flex gap-4 rounded-xl border border-[var(--border)] bg-[var(--panel-strong)] p-5 shadow-sm transition-all duration-300 ease-out ${
        visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
      }`}
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${iconClass}`}>
        {icon}
      </div>
      <div className="min-w-0">
        <h3 className="font-display text-base font-semibold text-[var(--text)]">{title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-[var(--text-soft)]">{description}</p>
      </div>
    </article>
  );
}

export function StickyAuditSection({
  url,
  onUrlChange,
  onAnalyze,
  canSubmit,
  error,
}: StickyAuditSectionProps) {
  return (
    <div
      className="surface-panel w-full px-6 py-12 sm:px-10 sm:py-14"
      aria-labelledby="audit-guides-heading"
    >
      <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-14 xl:gap-20">
        <aside className="mb-10 lg:sticky lg:top-[max(5.5rem,calc(50vh-10rem))] lg:mb-0 lg:self-start">
          <h2
            id="audit-guides-heading"
            className="font-display text-2xl font-semibold tracking-tight text-[var(--text)] sm:text-[1.75rem]"
          >
            Ways to get started
          </h2>
          <p className="mt-4 max-w-md text-base leading-relaxed text-[var(--text-soft)]">
            Jump into automated audits, category scores, and AI-friendly reports—everything you need to
            understand and improve your site in one workflow.
          </p>
          <form
            id="analyze"
            onSubmit={onAnalyze}
            className="mt-8 rounded-2xl border border-[var(--border)] bg-[var(--panel-strong)] p-4"
          >
            <label htmlFor="url" className="block text-sm font-medium text-[var(--text)]">
              Target URL
            </label>
            <input
              id="url"
              name="url"
              type="url"
              placeholder="https://example.com"
              value={url}
              onChange={(event) => onUrlChange(event.target.value)}
              className="input-control mt-2"
            />
            <button type="submit" disabled={!canSubmit} className="btn-primary mt-3 w-full">
              Launch audit
            </button>
            <p className="mt-3 text-xs leading-relaxed text-[var(--text-soft)]">
              First run may take 1–3 minutes. Keep this tab open.
            </p>
            {error && (
              <p
                className="mt-3 rounded-lg border border-[var(--score-warning)] bg-[var(--surface-subtle)] px-3 py-2 text-sm text-[var(--text)]"
                role="alert"
              >
                {error}
              </p>
            )}
          </form>

        </aside>

        <div className="min-w-0">
          <h2 className="mb-6 font-display text-2xl font-semibold tracking-tight text-[var(--text)] sm:text-[1.75rem]">
            What we analyze
          </h2>
          <ResponsiveCarousel ariaLabel="Website analysis areas" className="flex flex-col gap-5 pb-8 lg:pb-32">
            {AUDIT_AREAS.map((area, i) => (
              <AuditCard key={area.id} {...area} index={i} />
            ))}
          </ResponsiveCarousel>
        </div>
      </div>
    </div>
  );
}
