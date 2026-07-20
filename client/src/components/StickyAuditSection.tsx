import { useEffect, useRef, useState } from "react";

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
    iconClass: "bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300",
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
    iconClass: "bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300",
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
    iconClass: "bg-sky-100 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300",
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
    iconClass: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300",
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
    iconClass: "bg-fuchsia-100 text-fuchsia-700 dark:bg-fuchsia-950/60 dark:text-fuchsia-300",
  },
] as const;

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
      className={`flex gap-4 rounded-xl border border-slate-200/90 bg-white p-5 shadow-sm transition-all duration-700 ease-out dark:border-white/10 dark:bg-white/[0.07] ${
        visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
      }`}
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${iconClass}`}>
        {icon}
      </div>
      <div className="min-w-0">
        <h3 className="font-display text-base font-semibold text-slate-900 dark:text-white">{title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{description}</p>
      </div>
    </article>
  );
}

export function StickyAuditSection() {
  return (
    <div
      className="w-full rounded-2xl border border-slate-200/80 bg-[#f8f9fb] px-6 py-12 dark:border-white/10 dark:bg-white/[0.04] sm:px-10 sm:py-14"
      aria-labelledby="audit-guides-heading"
    >
      <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-14 xl:gap-20">
        <aside className="mb-10 lg:sticky lg:top-[max(5.5rem,calc(50vh-10rem))] lg:mb-0 lg:self-start">
          <h2
            id="audit-guides-heading"
            className="font-display text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-[1.75rem]"
          >
            Ways to get started
          </h2>
          <p className="mt-4 max-w-md text-base leading-relaxed text-slate-600 dark:text-slate-400">
            Jump into automated audits, category scores, and AI-friendly reports—everything you need to
            understand and improve your site in one workflow.
          </p>
          <a
            href="#analyze"
            className="mt-8 inline-flex items-center justify-center rounded-full bg-sky-100 px-7 py-3 text-sm font-semibold text-sky-900 transition hover:bg-sky-200 dark:bg-cyan-950/80 dark:text-cyan-200 dark:hover:bg-cyan-900/60"
          >
            Launch audit
          </a>
        </aside>

        <div className="min-w-0">
          <h2 className="mb-6 font-display text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-[1.75rem]">
            What we analyze
          </h2>
          <div className="flex flex-col gap-5 pb-8 lg:pb-32">
            {AUDIT_AREAS.map((area, i) => (
              <AuditCard key={area.id} {...area} index={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
