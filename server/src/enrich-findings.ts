import { suggestFix } from "./fix-snippets.js";
import type { AnalyzePayload, HumanizedFinding, HumanizedSection } from "./types.js";

function enrichOne(finding: HumanizedFinding): HumanizedFinding {
  let sampleCode = finding.sampleCode?.trim();
  let codeLanguage = finding.codeLanguage;
  let fix = finding.fix;

  if (!sampleCode) {
    const ids = finding.relatedAuditIds ?? [];
    for (const id of ids) {
      const suggestion = suggestFix(id, finding.summary, finding.impact + " " + finding.fix);
      if (suggestion) {
        sampleCode = suggestion.sampleCode;
        codeLanguage = suggestion.codeLanguage;
        if (suggestion.fixHint && fix.length < 120) {
          fix = `${fix} ${suggestion.fixHint}`.trim();
        }
        break;
      }
    }
  }

  if (!sampleCode) {
    const suggestion = suggestFix("", finding.summary, finding.impact + " " + finding.fix);
    if (suggestion) {
      sampleCode = suggestion.sampleCode;
      codeLanguage = suggestion.codeLanguage;
      if (suggestion.fixHint) fix = suggestion.fixHint;
    }
  }

  return {
    ...finding,
    fix,
    ...(sampleCode ? { sampleCode, codeLanguage: codeLanguage ?? "html" } : {}),
  };
}

export function enrichReport(
  report: HumanizedSection[],
  _raw: AnalyzePayload
): HumanizedSection[] {
  return report.map((section) => ({
    ...section,
    findings: section.findings.map(enrichOne),
  }));
}
