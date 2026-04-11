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

export interface HumanizedFinding {
  summary: string;
  impact: string;
  fix: string;
  relatedAuditIds?: string[];
}

export interface HumanizedSection {
  category: CategoryKey;
  headline: string;
  findings: HumanizedFinding[];
}

export interface AnalyzeResponse {
  url: string;
  fetchedAt: string;
  scores: Record<string, number | null>;
  raw: AnalyzePayload;
  report: HumanizedSection[];
  aiModel?: string;
  note?: string;
}
