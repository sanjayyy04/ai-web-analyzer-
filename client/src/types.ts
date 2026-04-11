export interface HumanizedFinding {
  summary: string;
  impact: string;
  fix: string;
  relatedAuditIds?: string[];
}

export interface HumanizedSection {
  category: string;
  headline: string;
  findings: HumanizedFinding[];
}

export interface AnalyzeResponse {
  url: string;
  fetchedAt: string;
  scores: Record<string, number | null>;
  report: HumanizedSection[];
  aiModel?: string;
  note?: string;
}
