import type { AnalyzePayload, CategoryKey, HumanizedFinding, HumanizedSection } from "./types.js";

const CATEGORY_LABEL: Record<CategoryKey, string> = {
  seo: "SEO",
  accessibility: "Accessibility",
  performance: "Performance",
  "best-practices": "Best practices",
  ux: "UX suggestions",
  content: "Content quality",
};

const LH_ORDER = ["seo", "accessibility", "performance", "best-practices"] as const;

function bundleToFindings(bundle: { audits: { id: string; title: string; description: string; displayValue?: string }[] }): HumanizedFinding[] {
  return bundle.audits.slice(0, 12).map((a) => ({
    summary: a.title,
    impact: stripHtml(a.description).slice(0, 500),
    fix: a.displayValue
      ? `Start with Lighthouse for “${a.title}”. Observed: ${a.displayValue}.`
      : `Review Lighthouse guidance for “${a.title}” and apply the recommended fix.`,
    relatedAuditIds: [a.id],
  }));
}

export function buildFallbackReport(raw: AnalyzePayload): HumanizedSection[] {
  const sections: HumanizedSection[] = [];

  for (const key of LH_ORDER) {
    const bundle = raw.categories[key];
    if (!bundle) continue;
    sections.push({
      category: key,
      headline: `${CATEGORY_LABEL[key]} — score ${bundle.score ?? "—"}/100`,
      findings: bundleToFindings(bundle),
    });
  }

  const contentFindings: HumanizedFinding[] = [];

  if (raw.content.titleLength === 0) {
    contentFindings.push({
      summary: "Missing or empty page title",
      impact: "Search results and browser tabs will not describe the page clearly.",
      fix: "Add a concise <title> in the document head (typically 50–60 characters).",
    });
  }

  if (raw.content.metaDescriptionLength === 0) {
    contentFindings.push({
      summary: "Meta description missing",
      impact: "Search snippets may be auto-generated and less compelling.",
      fix: 'Add <meta name="description" content="…"> with a clear summary of the page.',
    });
  }

  if (raw.content.h1Count === 0) {
    contentFindings.push({
      summary: "No H1 heading found",
      impact: "Users and search engines get a weaker signal about the primary topic.",
      fix: "Use a single descriptive H1 near the top of the main content.",
    });
  }

  if (raw.content.langAttribute === null) {
    contentFindings.push({
      summary: 'Missing lang attribute on <html>',
      impact: "Assistive technologies may mispronounce content or pick the wrong language model.",
      fix: 'Set <html lang="en"> (or the correct language code) on the root element.',
    });
  }

  sections.push({
    category: "content",
    headline: `${CATEGORY_LABEL.content} — signals`,
    findings:
      contentFindings.length > 0
        ? contentFindings
        : [
            {
              summary: "No major content structure issues detected from a quick HTML scan",
              impact: "This does not guarantee perfect SEO—Lighthouse SEO audits still matter.",
              fix: "Keep iterating on headings, internal links, and helpful copy based on your audience.",
            },
          ],
  });

  const uxBundle = raw.categories["ux"];
  if (uxBundle) {
    sections.push({
      category: "ux",
      headline: `${CATEGORY_LABEL.ux} — heuristics (${uxBundle.score ?? "—"}/100)`,
      findings:
        uxBundle.audits.length > 0
          ? bundleToFindings(uxBundle)
          : [
              {
                summary: "No obvious UX heuristics flagged from the quick scan",
                impact: "You should still test on real devices and with real users.",
                fix: "Validate navigation, forms, and key flows on mobile and desktop.",
              },
            ],
    });
  }

  return sections;
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}
