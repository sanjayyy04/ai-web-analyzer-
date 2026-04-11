import type { CategoryBundle, ContentSignals, RawAuditItem } from "./types.js";

export function buildSyntheticUxCategory(
  content: ContentSignals,
  perfScore: number | null,
  a11yScore: number | null
): CategoryBundle {
  const audits: RawAuditItem[] = [];

  if (!content.hasViewportMeta) {
    audits.push({
      id: "ux-viewport",
      title: "Viewport meta tag missing or not detected",
      description:
        "Mobile browsers rely on a viewport meta tag to scale content correctly. Without it, tap targets and layout can feel broken on phones.",
      score: 0,
    });
  }

  if (content.h1Count === 0) {
    audits.push({
      id: "ux-h1",
      title: "No H1 heading detected",
      description:
        "A clear page title in an H1 helps users quickly understand what the page is about and improves scanability.",
      score: 0,
    });
  } else if (content.h1Count > 1) {
    audits.push({
      id: "ux-multiple-h1",
      title: "Multiple H1 headings",
      description:
        "Multiple H1 elements can confuse the page outline. Consider a single H1 and use H2–H6 for sections.",
      score: 0.5,
    });
  }

  if (content.imagesTotal > 0 && content.imagesMissingAlt > 0) {
    audits.push({
      id: "ux-image-alt",
      title: "Images missing alternative text",
      description:
        "Alt text helps users who rely on assistive technology and improves understanding when images fail to load.",
      score: 0,
      displayValue: `${content.imagesMissingAlt}/${content.imagesTotal} images`,
    });
  }

  if (content.wordCountApprox > 0 && content.wordCountApprox < 120) {
    audits.push({
      id: "ux-thin-content",
      title: "Page body text looks very short",
      description:
        "Thin content can reduce clarity and trust. Consider adding more helpful context where appropriate.",
      score: 0.5,
      displayValue: `~${content.wordCountApprox} words`,
    });
  }

  if (perfScore !== null && perfScore < 50) {
    audits.push({
      id: "ux-slow-perf",
      title: "Perceived performance risk (low Lighthouse performance score)",
      description:
        "Slow pages increase bounce rate and make interactions feel sluggish, especially on mobile networks.",
      score: 0,
      displayValue: `Performance score ${perfScore}/100`,
    });
  }

  if (a11yScore !== null && a11yScore < 80) {
    audits.push({
      id: "ux-a11y-friction",
      title: "Accessibility friction likely affects usability",
      description:
        "Many accessibility issues also create UX friction for all users (focus, contrast, form labels).",
      score: 0,
      displayValue: `Accessibility score ${a11yScore}/100`,
    });
  }

  let score = 100;
  for (const a of audits) {
    if (a.score === 0) score -= 15;
    else if (a.score !== null && a.score < 1) score -= 8;
  }

  return {
    score: Math.max(0, Math.min(100, score)),
    audits,
  };
}
