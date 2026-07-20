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
      "Get category scores plus impact and fix guidance for each issue—optionally rewritten into plain language when an OpenAI API key is configured.",
  },
] as const;

function StepBadge({ n }: { n: number }) {
  return (
    <span
      className="mx-auto flex h-11 w-11 items-center justify-center rounded-lg bg-sky-100 text-lg font-semibold text-sky-800 dark:bg-cyan-950/80 dark:text-cyan-300"
      aria-hidden
    >
      {n}
    </span>
  );
}

export function HowItWorks() {
  return (
    <div
      className="w-full rounded-2xl border border-slate-200/80 bg-white/95 px-6 py-14 shadow-sm dark:border-white/10 dark:bg-white/[0.06] sm:px-10"
      aria-labelledby="how-it-works-heading"
    >
      <h2
        id="how-it-works-heading"
        className="text-center font-display text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl"
      >
        How to get started with AI Website Analyzer
      </h2>

      <ol className="mt-12 grid list-none gap-10 p-0 md:grid-cols-3 md:gap-8">
        {STEPS.map((item) => (
          <li key={item.step} className="flex flex-col items-center text-center">
            <StepBadge n={item.step} />
            <h3 className="mt-5 font-display text-lg font-semibold text-slate-900 dark:text-white">
              {item.title}
            </h3>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              {item.description}
            </p>
          </li>
        ))}
      </ol>
    </div>
  );
}
