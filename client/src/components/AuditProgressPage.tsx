import { AnalysisWireframe } from "./AnalysisWireframe";
import { SiteHeader } from "./SiteHeader";

type AuditProgressPageProps = {
  url: string;
  loading: boolean;
  error: string | null;
  completed: boolean;
  onBack: () => void;
  onRetry: () => void;
  onViewReport: () => void;
};

export function AuditProgressPage({
  url,
  loading,
  error,
  completed,
  onBack,
  onRetry,
  onViewReport,
}: AuditProgressPageProps) {
  const interrupted = !loading && !error && !completed;

  return (
    <div className="app-shell min-h-screen">
      <SiteHeader mode="analyze" onBack={onBack} />

      <main className="content-container pb-16 pt-8 sm:pt-12">
        <section className="mb-8 flex flex-col gap-5 border-b border-[var(--border)] pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <p className="section-kicker">
              {completed ? "Audit complete" : loading ? "Live website audit" : "Audit status"}
            </p>
            <h1 className="mt-2 font-display text-2xl font-semibold tracking-tight text-[var(--text)] sm:text-3xl">
              {completed
                ? "Your analysis is ready."
                : loading
                  ? "Analyzing your website"
                  : error
                    ? "The audit could not be completed."
                    : "No active audit found."}
            </h1>
            {url && (
              <p className="mt-2 break-all text-sm text-[var(--text-soft)]" aria-live="polite">
                {url}
              </p>
            )}
            {loading && (
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[var(--text-soft)]">
                Running performance, accessibility, SEO, content, and security best-practice checks.
                This can take 1–3 minutes.
              </p>
            )}
          </div>

          {completed && (
            <button type="button" className="btn-primary shrink-0" onClick={onViewReport}>
              View audit report
            </button>
          )}
        </section>

        {loading && (
          <div aria-live="polite" aria-busy="true">
            <AnalysisWireframe />
          </div>
        )}

        {error && (
          <section className="surface-panel mx-auto max-w-2xl p-6 sm:p-8" role="alert">
            <p className="text-sm leading-relaxed text-[var(--text-soft)]">{error}</p>
            <div className="mt-5 flex flex-wrap gap-3">
              <button type="button" className="btn-primary" onClick={onRetry} disabled={!url}>
                Try audit again
              </button>
              <button type="button" className="btn-secondary" onClick={onBack}>
                Change URL
              </button>
            </div>
          </section>
        )}

        {interrupted && (
          <section className="surface-panel mx-auto max-w-2xl p-6 sm:p-8">
            <p className="text-sm leading-relaxed text-[var(--text-soft)]">
              {url
                ? "This page was refreshed or opened without an active scan. Restart the audit to continue checking this website."
                : "This page was opened without an active scan. Start an audit from the URL form to see its live progress here."}
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              {url && (
                <button type="button" className="btn-primary" onClick={onRetry}>
                  Restart audit
                </button>
              )}
              <button type="button" className="btn-secondary" onClick={onBack}>
                Return to URL form
              </button>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
