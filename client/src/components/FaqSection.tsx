const QUESTIONS = [
  {
    question: "What does the analyzer check?",
    answer:
      "It runs Lighthouse checks for performance, accessibility, SEO, and best practices, then adds content signals and UX heuristics from the page.",
  },
  {
    question: "Do I need an API key to run an audit?",
    answer:
      "No. Lighthouse audits and rule-based report guidance work without an AI key. Configure GEMINI_API_KEY on the server if you want AI-enhanced explanations.",
  },
  {
    question: "How long does an audit take?",
    answer:
      "The first Lighthouse run can take one to three minutes while headless Chrome starts and the page is measured. Keep the tab open until the report appears.",
  },
  {
    question: "Can I compare these scores with Chrome DevTools?",
    answer:
      "The audit form factor affects Lighthouse scores. This app uses mobile by default; set LIGHTHOUSE_FORM_FACTOR=desktop on the server to use desktop mode.",
  },
  {
    question: "Which websites can I analyze?",
    answer:
      "The analyzer accepts public HTTP or HTTPS URLs that the server can reach. The website must be accessible to the server running the audit.",
  },
] as const;

export function FaqSection() {
  return (
    <section id="faq" className="scroll-mt-24" aria-labelledby="faq-heading">
      <div className="content-container py-16 sm:py-20">
        <div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:gap-16">
          <div>
            <p className="section-kicker">Good to know</p>
            <h2 id="faq-heading" className="section-title mt-3">
              Frequently asked questions
            </h2>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-[var(--text-soft)]">
              A few details to help you get a useful first report.
            </p>
            <a href="#analyze" className="btn-secondary mt-6">
              Start an audit
            </a>
          </div>

          <div className="divide-y divide-[var(--border)] border-y border-[var(--border)]">
            {QUESTIONS.map((item) => (
              <details key={item.question} className="group py-4">
                <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 text-left text-sm font-semibold text-[var(--text)] marker:hidden focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent-strong)] [&::-webkit-details-marker]:hidden">
                  {item.question}
                  <span
                    aria-hidden
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[var(--border)] text-lg font-normal text-[var(--text-soft)] transition-transform group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <p className="max-w-2xl pb-2 pr-10 pt-2 text-sm leading-relaxed text-[var(--text-soft)]">
                  {item.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
