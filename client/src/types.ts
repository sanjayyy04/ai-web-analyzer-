export type CodeLanguage = "html" | "css" | "javascript";

export interface HumanizedFinding {
  summary: string;
  impact: string;
  fix: string;
  sampleCode?: string;
  codeLanguage?: CodeLanguage;
  relatedAuditIds?: string[];
}

export interface HumanizedSection {
  category: string;
  headline: string;
  findings: HumanizedFinding[];
}

export interface PerformanceMetric {
  id: string;
  title: string;
  shortLabel: string;
  value: number;
  unit: string;
  displayValue: string;
  score: number | null;
}

export interface AuditMeta {
  lighthouseVersion: string;
  formFactor: "mobile" | "desktop";
  extraCategories: string[];
}

export interface AnalyzeResponse {
  url: string;
  fetchedAt: string;
  scores: Record<string, number | null>;
  performanceMetrics?: PerformanceMetric[];
  auditMeta?: AuditMeta;
  report: HumanizedSection[];
  aiModel?: string;
  note?: string;
}
