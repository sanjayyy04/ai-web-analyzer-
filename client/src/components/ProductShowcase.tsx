import { useState, type KeyboardEvent } from "react";

const PREVIEWS = [
  {
    label: "Overview",
    heading: "See the whole picture",
    description:
      "A compact overview brings your audit categories and report context together in one place.",
    url: "example.com",
    status: "Audit overview",
  },
  {
    label: "Performance",
    heading: "Understand what slows pages down",
    description:
      "Explore Lighthouse performance metrics and see the timing story behind the score.",
    url: "example.com / performance",
    status: "Performance details",
  },
  {
    label: "Recommendations",
    heading: "Know what to fix next",
    description:
      "Review issues with their impact, suggested fixes, and sample code where available.",
    url: "example.com / report",
    status: "Developer report",
  },
] as const;

function ArrowIcon({ direction }: { direction: "previous" | "next" }) {
  return (
    <svg
      className={`h-4 w-4 ${direction === "previous" ? "rotate-180" : ""}`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m-6-6 6 6-6 6" />
    </svg>
  );
}

function OverviewPreview() {
  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          ["Performance", "Lighthouse"],
          ["Accessibility", "Inclusive UX"],
          ["SEO", "Discoverability"],
          ["Best practices", "Web standards"],
        ].map(([label, helper]) => (
          <div key={label} className="rounded-xl border border-[var(--border)] bg-[var(--panel-strong)] p-3">
            <p className="text-[11px] font-medium text-[var(--text-soft)]">{label}</p>
            <p className="mt-3 h-1.5 rounded-full bg-[var(--surface-muted)]">
              <span className="block h-full w-3/4 rounded-full bg-[var(--accent-strong)] opacity-80" />
            </p>
            <p className="mt-2 text-[10px] text-[var(--text-soft)]">{helper}</p>
          </div>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[var(--border)] bg-[var(--panel-strong)] px-4 py-3">
        <div>
          <p className="text-xs font-semibold text-[var(--text)]">Audit summary</p>
          <p className="mt-1 text-[11px] text-[var(--text-soft)]">
            Scores, page signals, and report details in one view
          </p>
        </div>
        <span className="rounded-full bg-[var(--accent-soft)] px-3 py-1 text-[10px] font-semibold text-[var(--accent-strong)]">
          Overview
        </span>
      </div>
    </>
  );
}

function PerformancePreview() {
  return (
    <div className="grid gap-3 sm:grid-cols-[1.4fr_1fr]">
      <div className="rounded-xl border border-[var(--border)] bg-[var(--panel-strong)] p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold text-[var(--text)]">Performance timeline</p>
            <p className="mt-1 text-[10px] text-[var(--text-soft)]">Illustrative chart preview</p>
          </div>
          <span className="rounded-md border border-[var(--border)] px-2 py-1 text-[10px] text-[var(--text-soft)]">
            Mobile
          </span>
        </div>
        <svg
          className="mt-4 h-32 w-full overflow-visible"
          viewBox="0 0 480 120"
          preserveAspectRatio="none"
          role="img"
          aria-label="Illustrative performance timeline chart"
        >
          <path d="M0 102H480M0 65H480M0 28H480" stroke="var(--border)" strokeDasharray="4 5" />
          <path
            d="M0 92C40 88 40 77 80 79S120 72 160 65 200 68 240 52 280 57 320 40 360 44 400 28 440 34 480 18"
            fill="none"
            stroke="var(--accent-strong)"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <circle cx="320" cy="40" r="4" fill="var(--accent)" stroke="var(--accent-strong)" strokeWidth="2" />
        </svg>
        <div className="mt-2 flex justify-between text-[10px] text-[var(--text-soft)]">
          <span>Page load</span>
          <span>Interactive</span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-1">
        {[
          ["LCP", "Largest contentful paint"],
          ["CLS", "Layout stability"],
          ["TBT", "Blocking time"],
        ].map(([metric, name]) => (
          <div key={metric} className="rounded-xl border border-[var(--border)] bg-[var(--panel-strong)] p-3">
            <p className="text-xs font-semibold text-[var(--text)]">{metric}</p>
            <p className="mt-1 text-[10px] text-[var(--text-soft)]">{name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function RecommendationsPreview() {
  return (
    <div className="space-y-3">
      {[
        ["Accessibility", "Add descriptive labels to form controls", "Review"],
        ["SEO", "Write a concise page description", "Improve"],
        ["Performance", "Inspect render-blocking resources", "Optimize"],
      ].map(([category, title, action], index) => (
        <div
          key={title}
          className="flex flex-col gap-3 rounded-xl border border-[var(--border)] bg-[var(--panel-strong)] p-3 sm:flex-row sm:items-center"
        >
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--surface-muted)] text-[10px] font-semibold text-[var(--text-soft)]">
            0{index + 1}
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-medium uppercase tracking-wide text-[var(--text-soft)]">
              {category}
            </p>
            <p className="mt-1 text-xs font-medium text-[var(--text)]">{title}</p>
          </div>
          <span className="self-start rounded-full border border-[var(--border)] px-2.5 py-1 text-[10px] font-medium text-[var(--text-soft)] sm:self-auto">
            {action}
          </span>
        </div>
      ))}
    </div>
  );
}

function PreviewScreen({ index }: { index: number }) {
  const active = PREVIEWS[index];

  return (
    <div className="overflow-hidden rounded-2xl border border-[var(--border-strong)] bg-[var(--panel-strong)] shadow-[0_24px_70px_rgba(10,15,20,0.12)]">
      <div className="flex items-center gap-3 border-b border-[var(--border)] bg-[var(--surface-subtle)] px-4 py-3">
        <div className="flex gap-1.5" aria-hidden>
          <span className="h-2 w-2 rounded-full bg-[var(--border-strong)]" />
          <span className="h-2 w-2 rounded-full bg-[var(--border-strong)]" />
          <span className="h-2 w-2 rounded-full bg-[var(--border-strong)]" />
        </div>
        <div className="flex min-w-0 flex-1 items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--panel-strong)] px-3 py-1.5">
          <svg className="h-3 w-3 shrink-0 text-[var(--text-soft)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3 4 6v5c0 5 3.5 8.5 8 10 4.5-1.5 8-5 8-10V6l-8-3z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="m9 12 2 2 4-4" />
          </svg>
          <span className="truncate font-mono text-[10px] text-[var(--text-soft)]">{active.url}</span>
        </div>
        <span className="hidden text-[10px] font-medium text-[var(--text-soft)] sm:inline">
          {active.status}
        </span>
      </div>

      <div
        key={index}
        className="min-h-[260px] p-4 animate-[preview-enter_240ms_ease-out] sm:min-h-[300px] sm:p-6"
      >
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="h-7 w-7 rounded-lg bg-[var(--accent)]" aria-hidden />
            <span className="text-xs font-semibold text-[var(--text)]">AI Web Analyzer</span>
          </div>
          <span className="rounded-full border border-[var(--border)] px-2.5 py-1 text-[10px] text-[var(--text-soft)]">
            Sample interface
          </span>
        </div>

        {index === 0 && <OverviewPreview />}
        {index === 1 && <PerformancePreview />}
        {index === 2 && <RecommendationsPreview />}
      </div>
    </div>
  );
}

export function ProductShowcase() {
  const [activeIndex, setActiveIndex] = useState(0);
  const preview = PREVIEWS[activeIndex];

  function showPreview(index: number) {
    setActiveIndex((index + PREVIEWS.length) % PREVIEWS.length);
  }

  function handleTabKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      showPreview(activeIndex + 1);
      document.getElementById(`preview-tab-${(activeIndex + 1) % PREVIEWS.length}`)?.focus();
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      showPreview(activeIndex - 1);
      document.getElementById(`preview-tab-${(activeIndex - 1 + PREVIEWS.length) % PREVIEWS.length}`)?.focus();
    } else if (event.key === "Home" || event.key === "End") {
      event.preventDefault();
      const index = event.key === "Home" ? 0 : PREVIEWS.length - 1;
      showPreview(index);
      document.getElementById(`preview-tab-${index}`)?.focus();
    }
  }

  return (
    <section
      id="preview"
      className="snap-section snap-section-auto scroll-mt-24 py-16 sm:py-24"
      aria-labelledby="preview-heading"
    >
      <div className="content-container">
        <div className="mb-8 grid gap-5 md:grid-cols-[1fr_auto] md:items-end">
          <div className="max-w-2xl">
            <p className="section-kicker">A closer look</p>
            <h2 id="preview-heading" className="section-title mt-3">
              An audit report that turns findings into next steps.
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-[var(--text-soft)] sm:text-base">
              Browse a preview of the score overview, performance details, and developer
              recommendations you can explore after an audit.
            </p>
          </div>
          <a href="#analyze" className="btn-secondary w-fit">
            Try it on your site
            <ArrowIcon direction="next" />
          </a>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:items-center lg:gap-10">
          <div>
            <div className="mb-5 inline-flex max-w-full gap-1 overflow-x-auto rounded-xl border border-[var(--border)] bg-[var(--surface-subtle)] p-1" role="tablist" aria-label="Product preview">
              {PREVIEWS.map((item, index) => (
                <button
                  key={item.label}
                  id={`preview-tab-${index}`}
                  type="button"
                  role="tab"
                  aria-selected={activeIndex === index}
                  aria-controls="preview-panel"
                  tabIndex={activeIndex === index ? 0 : -1}
                  onClick={() => showPreview(index)}
                  onKeyDown={handleTabKeyDown}
                  className={`min-h-10 whitespace-nowrap rounded-lg px-3 text-xs font-semibold ${
                    activeIndex === index
                      ? "bg-[var(--panel-strong)] text-[var(--text)] shadow-sm"
                      : "text-[var(--text-soft)] hover:text-[var(--text)]"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div
              id="preview-panel"
              role="tabpanel"
              aria-labelledby={`preview-tab-${activeIndex}`}
              className="min-h-36"
            >
              <p className="section-kicker">{preview.label}</p>
              <h3 className="mt-2 font-display text-xl font-semibold tracking-tight text-[var(--text)] sm:text-2xl">
                {preview.heading}
              </h3>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-[var(--text-soft)]">
                {preview.description}
              </p>
            </div>

            <div className="mt-6 flex items-center gap-3">
              <button
                type="button"
                onClick={() => showPreview(activeIndex - 1)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--panel-strong)] text-[var(--text)] hover:bg-[var(--surface-muted)]"
                aria-label="Previous preview"
              >
                <ArrowIcon direction="previous" />
              </button>
              <button
                type="button"
                onClick={() => showPreview(activeIndex + 1)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--panel-strong)] text-[var(--text)] hover:bg-[var(--surface-muted)]"
                aria-label="Next preview"
              >
                <ArrowIcon direction="next" />
              </button>
              <div className="ml-1 flex items-center gap-2" aria-label="Choose preview">
                {PREVIEWS.map((item, index) => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => showPreview(index)}
                    className={`h-2 rounded-full transition-all ${
                      activeIndex === index
                        ? "w-6 bg-[var(--accent-strong)]"
                        : "w-2 bg-[var(--border-strong)] hover:bg-[var(--text-soft)]"
                    }`}
                    aria-label={`Show ${item.label} preview`}
                    aria-current={activeIndex === index ? "true" : undefined}
                  />
                ))}
              </div>
              <span className="ml-auto text-xs tabular-nums text-[var(--text-soft)]">
                0{activeIndex + 1} / 0{PREVIEWS.length}
              </span>
            </div>
          </div>

          <div aria-live="polite">
            <PreviewScreen index={activeIndex} />
            <p className="mt-3 text-center text-[10px] text-[var(--text-soft)]">
              Illustrative interface preview. Results shown by the analyzer are generated for the URL you submit.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
