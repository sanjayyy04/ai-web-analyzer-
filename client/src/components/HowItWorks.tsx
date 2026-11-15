const STEPS = [
  {
    step: 1,
    title: "Enter your website URL",
    description:
      "Paste any public http(s) address into the analyzer. We validate the link and prepare it for a full technical scan.",
  },
  {
    step: 2,
    title: "Run automated Lighthouse audits",
    description:
      "Headless Chrome runs Lighthouse for performance, accessibility, SEO, and best practices. We also parse your HTML for content and UX signals.",
  },
  {
    step: 3,
    title: "Review your developer report",
    description:
      "Get category scores plus impact and fix guidance for each issue—optionally rewritten into plain language when a Gemini API key is configured.",
  },
] as const;

function StepBadge({ n }: { n: number }) {
  return (
    <span
      className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--accent-soft)] text-lg font-semibold text-[var(--accent-strong)]"
      aria-hidden
    >
      {n}
    </span>
  );
}

export function HowItWorks() {
  return (
    <div
      className="surface-panel w-full px-6 py-12 sm:px-10 sm:py-14"
      aria-labelledby="how-it-works-heading"
    >
      <h2
        id="how-it-works-heading"
        className="section-title text-center"
      >
        How to get started with AI Website Analyzer
      </h2>

      <ol className="mt-12 grid list-none gap-10 p-0 md:grid-cols-3 md:gap-8">
        {STEPS.map((item) => (
          <li key={item.step} className="flex flex-col items-center text-center">
            <StepBadge n={item.step} />
            <h3 className="mt-5 font-display text-lg font-semibold text-[var(--text)]">
              {item.title}
            </h3>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-[var(--text-soft)]">
              {item.description}
            </p>
          </li>
        ))}
      </ol>
    </div>
  );
}
