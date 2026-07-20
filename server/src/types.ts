export type CategoryKey =
  | "seo"
  | "accessibility"
  | "performance"
  | "best-practices"
  | "ux"
  | "content";

export interface RawAuditItem {
  id: string;
  title: string;
  description: string;
  score: number | null;
  displayValue?: string;
  detailsSummary?: string;
}

export interface CategoryBundle {
  score: number | null;
  audits: RawAuditItem[];
}

/** Core Web Vitals and Lighthouse timing metrics for charts */
export interface PerformanceMetric {
  id: string;
  title: string;
  shortLabel: string;
  value: number;
  unit: string;
  displayValue: string;
  /** Lighthouse audit score 0–1 (null if not scored) */
  score: number | null;
}

export interface ContentSignals {
  title: string | null;
  titleLength: number;
  metaDescription: string | null;
  metaDescriptionLength: number;
  h1Count: number;
  imagesTotal: number;
  imagesMissingAlt: number;
  wordCountApprox: number;
  hasViewportMeta: boolean;
  langAttribute: string | null;
}

export interface AnalyzePayload {
  url: string;
  fetchedAt: string;
  lighthouseVersion?: string;
  categories: Record<string, CategoryBundle>;
  content: ContentSignals;
}

export type CodeLanguage = "html" | "css" | "javascript";

export interface HumanizedFinding {
  /** Issue title */
  summary: string;
  impact: string;
  /** AI Fix — actionable steps */
  fix: string;
  /** Copy-paste ready snippet */
  sampleCode?: string;
  codeLanguage?: CodeLanguage;
  relatedAuditIds?: string[];
}

export interface HumanizedSection {
  category: CategoryKey;
  headline: string;
  findings: HumanizedFinding[];
}

export interface AuditMeta {
  lighthouseVersion: string;
  /** mobile (Lighthouse default) or desktop — affects performance scoring */
  formFactor: "mobile" | "desktop";
  /** UX and Content are computed by this app, not Chrome Lighthouse */
  extraCategories: string[];
}

export interface AnalyzeResponse {
  url: string;
  fetchedAt: string;
  scores: Record<string, number | null>;
  performanceMetrics: PerformanceMetric[];
  auditMeta: AuditMeta;
  raw: AnalyzePayload;
  report: HumanizedSection[];
  aiModel?: string;
  note?: string;
}
