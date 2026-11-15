import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { AuditProgressPage } from "./components/AuditProgressPage";
import { AuditReportPage } from "./components/AuditReportPage";
import { FeatureGrid } from "./components/FeatureGrid";
import { FaqSection } from "./components/FaqSection";
import { HowItWorks } from "./components/HowItWorks";
import { ProductShowcase } from "./components/ProductShowcase";
import { SnapSection } from "./components/SnapSection";
import { SiteFooter } from "./components/SiteFooter";
import { SiteHeader } from "./components/SiteHeader";
import { StickyAuditSection } from "./components/StickyAuditSection";
import { VintageBackdrop } from "./components/VintageBackdrop";
import type { AnalyzeResponse } from "./types";

const ANALYZE_PATH = "/analyze";
const REPORT_PATH = "/report";
const APP_BASE_PATH = import.meta.env.BASE_URL.replace(/\/$/, "");
const REPORT_STORAGE_KEY = "ai-analyzer-latest-report";

type AppPage = "home" | "analyze" | "report";

function appPath(path: string): string {
  const withLeadingSlash = path.startsWith("/") ? path : `/${path}`;
  return `${APP_BASE_PATH}${withLeadingSlash}` || "/";
}

function getPageFromPath(): AppPage {
  let pathname = window.location.pathname;
  if (
    APP_BASE_PATH &&
    (pathname === APP_BASE_PATH || pathname.startsWith(`${APP_BASE_PATH}/`))
  ) {
    pathname = pathname.slice(APP_BASE_PATH.length) || "/";
  }
  const path = pathname.replace(/\/$/, "") || "/";
  if (path === ANALYZE_PATH) return "analyze";
  if (path === REPORT_PATH) return "report";
  return "home";
}

function normalizeTargetUrl(input: string): string | null {
  const trimmed = input.trim();
  if (!trimmed) return null;
  const candidate = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  try {
    const parsed = new URL(candidate);
    if (!["http:", "https:"].includes(parsed.protocol) || !parsed.hostname) return null;
    return parsed.href;
  } catch {
    return null;
  }
}

function isAnalyzeResponse(value: unknown): value is AnalyzeResponse {
  if (typeof value !== "object" || value === null) return false;
  if (!("url" in value) || typeof value.url !== "string") return false;
  if (!("fetchedAt" in value) || typeof value.fetchedAt !== "string") return false;
  if (!("scores" in value) || typeof value.scores !== "object" || value.scores === null) return false;
  if (!("report" in value) || !Array.isArray(value.report)) return false;
  return value.report.every(
    (section: unknown) =>
      typeof section === "object" &&
      section !== null &&
      "category" in section &&
      typeof section.category === "string" &&
      "headline" in section &&
      typeof section.headline === "string" &&
      "findings" in section &&
      Array.isArray(section.findings) &&
      section.findings.every(
        (finding: unknown) =>
          typeof finding === "object" &&
          finding !== null &&
          "summary" in finding &&
          typeof finding.summary === "string" &&
          "impact" in finding &&
          typeof finding.impact === "string" &&
          "fix" in finding &&
          typeof finding.fix === "string",
      ),
  );
}

function readSavedReport(): AnalyzeResponse | null {
  try {
    const saved = window.sessionStorage.getItem(REPORT_STORAGE_KEY);
    if (!saved) return null;
    const parsed: unknown = JSON.parse(saved);
    return isAnalyzeResponse(parsed) ? parsed : null;
  } catch (error) {
    console.warn("Could not restore the saved audit report.", error);
    return null;
  }
}

export default function App() {
  const [url, setUrl] = useState("https://web.dev");
  const [analysisUrl, setAnalysisUrl] = useState(() => {
    const stateUrl = window.history.state?.url;
    return typeof stateUrl === "string" ? stateUrl : "";
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<AnalyzeResponse | null>(() => readSavedReport());
  const [page, setPage] = useState<AppPage>(getPageFromPath);
  const requestController = useRef<AbortController | null>(null);

  const canSubmit = useMemo(
    () => normalizeTargetUrl(url) !== null && !loading,
    [url, loading],
  );

  useEffect(() => {
    function syncRoute() {
      const currentPage = getPageFromPath();
      setPage(currentPage);
      if (currentPage === "analyze" && typeof window.history.state?.url === "string") {
        setAnalysisUrl(window.history.state.url);
      }
      if (currentPage === "report") {
        setData((current) => current ?? readSavedReport());
      } else if (window.location.hash) {
        window.requestAnimationFrame(() => {
          document.getElementById(window.location.hash.slice(1))?.scrollIntoView({ block: "start" });
        });
      }
    }

    window.addEventListener("popstate", syncRoute);
    return () => window.removeEventListener("popstate", syncRoute);
  }, []);

  useEffect(() => {
    if (page !== "analyze") requestController.current?.abort();
  }, [page]);

  useEffect(() => {
    document.title =
      page === "report"
        ? "Audit Report | AI Website Analyzer"
        : page === "analyze"
          ? "Analyzing Website | AI Website Analyzer"
          : "AI Website Analyzer";
  }, [page]);

  async function runAnalysis(targetUrl: string) {
    setError(null);
    setData(null);
    setAnalysisUrl(targetUrl);
    setUrl(targetUrl);
    setLoading(true);
    const controller = new AbortController();
    requestController.current?.abort();
    requestController.current = controller;

    try {
      const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/+$/, "");
      const res = await fetch(`${apiBaseUrl}/api/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: targetUrl }),
        signal: controller.signal,
      });
      const json: unknown = await res.json();
      if (controller.signal.aborted) return;
      if (!res.ok) {
        const message =
          typeof json === "object" && json !== null && "error" in json && typeof json.error === "string"
            ? json.error
            : "Request failed";
        setError(message);
        return;
      }
      if (!isAnalyzeResponse(json)) {
        setError("The analyzer returned an unexpected response. Please try again.");
        return;
      }
      setData(json);
      try {
        window.sessionStorage.setItem(REPORT_STORAGE_KEY, JSON.stringify(json));
      } catch (storageError) {
        console.warn("Could not save the audit report for refresh.", storageError);
      }
      window.history.replaceState(
        { page: "analyze", url: targetUrl, completed: true },
        "",
        appPath(ANALYZE_PATH),
      );
      window.history.pushState({ page: "report" }, "", appPath(REPORT_PATH));
      setPage("report");
      window.scrollTo({ top: 0, behavior: "instant" });
    } catch (requestError) {
      if (requestError instanceof DOMException && requestError.name === "AbortError") return;
      setError("Could not reach the analyzer API. Check its URL and availability.");
    } finally {
      if (requestController.current === controller) {
        requestController.current = null;
        setLoading(false);
      }
    }
  }

  async function onAnalyze(e: FormEvent) {
    e.preventDefault();
    const targetUrl = normalizeTargetUrl(url);
    if (!targetUrl) {
      setError("Enter a valid http(s) website URL.");
      return;
    }
    window.history.pushState({ page: "analyze", url: targetUrl }, "", appPath(ANALYZE_PATH));
    setPage("analyze");
    window.scrollTo({ top: 0, behavior: "instant" });
    await runAnalysis(targetUrl);
  }

  function returnToAnalyzer() {
    window.history.pushState({ page: "home" }, "", appPath("/"));
    setPage("home");
    window.scrollTo({ top: 0, behavior: "instant" });
  }

  function startNewAudit() {
    if (data) setUrl(data.url);
    setData(null);
    setError(null);
    window.history.pushState({ page: "home" }, "", appPath("/#analyze"));
    setPage("home");
    window.requestAnimationFrame(() => {
      document.getElementById("analyze")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  function returnToUrlForm() {
    setError(null);
    window.history.pushState({ page: "home" }, "", appPath("/#analyze"));
    setPage("home");
    window.requestAnimationFrame(() => {
      document.getElementById("analyze")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  if (page === "analyze") {
    return (
      <>
        <VintageBackdrop />
        <AuditProgressPage
          url={analysisUrl}
          loading={loading}
          error={error}
          completed={Boolean(
            data &&
              data.url === analysisUrl &&
              window.history.state?.completed === true,
          )}
          onBack={returnToUrlForm}
          onRetry={() => void runAnalysis(analysisUrl)}
          onViewReport={() => {
            window.history.pushState({ page: "report" }, "", appPath(REPORT_PATH));
            setPage("report");
          }}
        />
      </>
    );
  }

  if (page === "report") {
    return (
      <>
        <VintageBackdrop />
        <AuditReportPage data={data} onBack={returnToAnalyzer} onNewAudit={startNewAudit} />
      </>
    );
  }

  return (
    <div className="app-shell">
      <VintageBackdrop />
      <SiteHeader />

      <main className="w-full">
        {/* Hero — full viewport snap panel */}
        <section
          id="top"
          className="snap-section snap-section-screen relative flex w-full flex-col justify-center scroll-mt-[4.5rem]"
        >
          <div className="content-container">
            <div className="max-w-2xl text-center sm:text-left">
              <p className="hero-orbit-badge">
                <svg viewBox="0 0 300 44" preserveAspectRatio="none" aria-hidden>
                  <rect
                    className="hero-orbit-stroke"
                    x="0.75"
                    y="0.75"
                    width="298.5"
                    height="42.5"
                    rx="21"
                    pathLength="354"
                  />
                </svg>
                <span className="h-2 w-2 rounded-full bg-[var(--accent)]" aria-hidden />
                AI-powered website analysis
              </p>
              <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-[var(--text)] sm:text-5xl lg:text-6xl">
                Decode Your Website’s Intelligence Layer
              </h1>
              <p className="mt-4 text-lg text-[var(--text-soft)] sm:text-xl">
                Dive into the hidden layers of your website. Reveal performance, structure, and
                usability issues — translated into actionable intelligence.
              </p>
              <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:items-start">
                <a href="#analyze" className="btn-primary">
                  Launch audit
                </a>
                <a href="#how-it-works" className="btn-secondary">
                  How it works
                </a>
              </div>
            </div>
          </div>
          <a
            href="#how-it-works"
            className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-1 text-xs font-medium uppercase tracking-widest text-[var(--text-soft)] transition hover:text-[var(--text)]"
            aria-label="Scroll to next section"
          >
            <span>Scroll</span>
            <svg
              className="h-5 w-5 animate-bounce"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden
            >
              <path strokeLinecap="round" d="M12 5v14M6 13l6 6 6-6" />
            </svg>
          </a>
        </section>

        <ProductShowcase />

        <SnapSection id="how-it-works">
          <HowItWorks />
        </SnapSection>

        <SnapSection id="audit-guides" size="auto" innerClassName="py-8">
          <StickyAuditSection
            url={url}
            onUrlChange={setUrl}
            onAnalyze={onAnalyze}
            canSubmit={canSubmit}
            error={error}
          />
        </SnapSection>

        <SnapSection id="features">
          <h2 className="section-title mb-8 text-center sm:text-left">
            What we measure
          </h2>
          <FeatureGrid />
        </SnapSection>

        <FaqSection />

        <section className="content-container pb-14 sm:pb-20">
          <div className="relative overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface-subtle)] px-6 py-10 sm:px-10 sm:py-12">
            <div className="pointer-events-none absolute -right-12 -top-20 h-56 w-56 rounded-full border border-[var(--border-strong)] opacity-50" aria-hidden />
            <div className="pointer-events-none absolute -right-2 -top-10 h-36 w-36 rounded-full border border-[var(--border-strong)] opacity-50" aria-hidden />
            <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="max-w-2xl">
                <p className="section-kicker">Make your next change count</p>
                <h2 className="mt-3 font-display text-2xl font-semibold tracking-tight text-[var(--text)] sm:text-3xl">
                  Start with a clearer picture of your website.
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-[var(--text-soft)] sm:text-base">
                  Run a Lighthouse audit and turn the results into practical next steps.
                </p>
              </div>
              <a href="#analyze" className="btn-primary shrink-0">
                Run an audit
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m-6-6 6 6-6 6" />
                </svg>
              </a>
            </div>
          </div>
        </section>

      </main>

      <SiteFooter />
    </div>
  );
}
