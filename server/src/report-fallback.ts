import type { AnalyzePayload, CategoryKey, HumanizedFinding, HumanizedSection } from "./types.js";
import { suggestFix } from "./fix-snippets.js";

const CATEGORY_LABEL: Record<CategoryKey, string> = {
  seo: "SEO",
  accessibility: "Accessibility",
  performance: "Performance",
  "best-practices": "Best practices",
  ux: "UX suggestions",
  content: "Content quality",
};

const LH_ORDER = ["seo", "accessibility", "performance", "best-practices"] as const;

function auditToFinding(a: {
  id: string;
  title: string;
  description: string;
  displayValue?: string;
}): HumanizedFinding {
  const impact = stripHtml(a.description).slice(0, 500);
  const suggestion = suggestFix(a.id, a.title, impact);

  const finding: HumanizedFinding = {
    summary: a.title,
    impact,
    fix: suggestion?.fixHint
      ? suggestion.fixHint
      : a.displayValue
        ? `Review Lighthouse for “${a.title}”. Observed: ${a.displayValue}.`
        : `Apply the recommended fix for “${a.title}” from Lighthouse documentation.`,
    relatedAuditIds: [a.id],
  };

  if (suggestion) {
    finding.sampleCode = suggestion.sampleCode;
    finding.codeLanguage = suggestion.codeLanguage;
  }

  return finding;
}

function bundleToFindings(bundle: {
  audits: { id: string; title: string; description: string; displayValue?: string }[];
}): HumanizedFinding[] {
  return bundle.audits.slice(0, 12).map(auditToFinding);
}

function contentFinding(
  summary: string,
  impact: string,
  auditId: string,
  titleForSuggest: string
): HumanizedFinding {
  const suggestion = suggestFix(auditId, titleForSuggest, impact);
  return {
    summary,
    impact,
    fix: suggestion?.fixHint ?? "Update the HTML as shown in the sample below.",
    relatedAuditIds: [auditId],
    ...(suggestion
      ? { sampleCode: suggestion.sampleCode, codeLanguage: suggestion.codeLanguage }
      : {}),
  };
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
    contentFindings.push(
      contentFinding(
        "Missing or empty page title",
        "Search results and browser tabs will not describe the page clearly.",
        "document-title",
        "missing page title"
      )
    );
  }

  if (raw.content.metaDescriptionLength === 0) {
    contentFindings.push(
      contentFinding(
        "Meta description missing",
        "Search snippets may be auto-generated and less compelling.",
        "meta-description",
        "missing meta description"
      )
    );
  }

  if (raw.content.h1Count === 0) {
    contentFindings.push(
      contentFinding(
        "No H1 heading found",
        "Users and search engines get a weaker signal about the primary topic.",
        "ux-h1",
        "missing h1"
      )
    );
  }

  if (raw.content.langAttribute === null) {
    contentFindings.push(
      contentFinding(
        'Missing lang attribute on <html>',
        "Assistive technologies may mispronounce content or pick the wrong language.",
        "html-has-lang",
        "missing lang"
      )
    );
  }

  if (raw.content.imagesMissingAlt > 0) {
    contentFindings.push(
      contentFinding(
        `${raw.content.imagesMissingAlt} image(s) missing alt text`,
        "Screen readers cannot describe images; SEO image context is lost.",
        "ux-image-alt",
        "images missing alt"
      )
    );
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
