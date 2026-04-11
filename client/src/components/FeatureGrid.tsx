import { SquareFrame } from "./SquareFrame";

const ITEMS = [
  {
    k: "SEO",
    body: "Meta tags, crawl hints, and on-page signals—summarized so you can ship better snippets.",
  },
  {
    k: "A11y",
    body: "Contrast, semantics, and keyboard paths—turned into fixes your whole team understands.",
  },
  {
    k: "Perf",
    body: "Core Web Vitals and load stories—what slows users down and what to change first.",
  },
  {
    k: "Best",
    body: "Security and modern baseline checks—HTTPS, console noise, and risky patterns flagged.",
  },
  {
    k: "UX",
    body: "Heuristic pass on structure and friction—headings, viewport, and perceived speed cues.",
  },
  {
    k: "AI",
    body: "Raw Lighthouse lines become impact + fix blocks—readable, developer-first, demo-ready.",
  },
] as const;

export function FeatureGrid() {
  return (
    <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {ITEMS.map((item, i) => (
        <SquareFrame
          key={item.k}
          title={item.k}
          delayClass={i % 2 === 0 ? "animate-float" : "animate-float-slow"}
          style={{ animationDelay: `${i * 0.12}s` }}
        >
          {item.body}
        </SquareFrame>
      ))}
    </div>
  );
}
