export type CodeLanguage = "html" | "css" | "javascript";

export interface FixSuggestion {
  fixHint?: string;
  sampleCode: string;
  codeLanguage: CodeLanguage;
}

/** Rule-based fix + sample code from audit id or issue text (works without OpenAI). */
export function suggestFix(
  auditId: string,
  title: string,
  description: string
): FixSuggestion | null {
  const id = auditId.toLowerCase();
  const text = `${title} ${description}`.toLowerCase();

  const byId: Record<string, FixSuggestion> = {
    "ux-image-alt": {
      fixHint: "Add descriptive alt text and lazy-load non-critical images.",
      sampleCode: `<img
  src="product.jpg"
  alt="Blue running shoes — side view"
  width="600"
  height="400"
  loading="lazy"
/>`,
      codeLanguage: "html",
    },
    "ux-viewport": {
      fixHint: "Add a responsive viewport meta tag in the document head.",
      sampleCode: `<meta name="viewport" content="width=device-width, initial-scale=1" />`,
      codeLanguage: "html",
    },
    "ux-h1": {
      fixHint: "Use one clear H1 that states the page topic.",
      sampleCode: `<main>
  <h1>AI Website Analyzer — audit any URL in seconds</h1>
  <!-- section content -->
</main>`,
      codeLanguage: "html",
    },
    "document-title": {
      fixHint: "Set a unique, descriptive title (about 50–60 characters).",
      sampleCode: `<head>
  <title>AI Website Analyzer | SEO & Performance Audit</title>
</head>`,
      codeLanguage: "html",
    },
    "meta-description": {
      fixHint: "Add a compelling meta description for search snippets.",
      sampleCode: `<meta
  name="description"
  content="Analyze any website for SEO, accessibility, and performance. Get scores and developer-ready fixes."
/>`,
      codeLanguage: "html",
    },
    "html-has-lang": {
      fixHint: "Declare the page language on the root element.",
      sampleCode: `<html lang="en">`,
      codeLanguage: "html",
    },
    viewport: {
      fixHint: "Add a viewport meta tag for mobile layout.",
      sampleCode: `<meta name="viewport" content="width=device-width, initial-scale=1" />`,
      codeLanguage: "html",
    },
    "image-alt": {
      fixHint: "Every informative image needs alt text; decorative images use alt=\"\".",
      sampleCode: `<!-- Informative -->
<img src="chart.png" alt="Monthly traffic up 24% year over year" />

<!-- Decorative -->
<img src="divider.svg" alt="" role="presentation" />`,
      codeLanguage: "html",
    },
    "offscreen-images": {
      fixHint: "Lazy-load images below the fold to improve initial load.",
      sampleCode: `<img src="hero.webp" alt="Hero" width="1200" height="630" fetchpriority="high" />
<img src="section-below.webp" alt="Feature" loading="lazy" decoding="async" />`,
      codeLanguage: "html",
    },
    "uses-webp-images": {
      fixHint: "Serve modern formats (WebP/AVIF) with a fallback for older browsers.",
      sampleCode: `<picture>
  <source srcset="hero.avif" type="image/avif" />
  <source srcset="hero.webp" type="image/webp" />
  <img src="hero.jpg" alt="Product hero" width="1200" height="630" loading="lazy" />
</picture>`,
      codeLanguage: "html",
    },
    "modern-image-formats": {
      fixHint: "Convert large JPEG/PNG assets to WebP or AVIF.",
      sampleCode: `<picture>
  <source srcset="/images/hero.webp" type="image/webp" />
  <img src="/images/hero.jpg" alt="Hero banner" width="1200" height="630" />
</picture>`,
      codeLanguage: "html",
    },
    "render-blocking-resources": {
      fixHint: "Defer non-critical scripts and preload key assets.",
      sampleCode: `<link rel="preload" href="/fonts/inter.woff2" as="font" type="font/woff2" crossorigin />
<script src="/analytics.js" defer></script>`,
      codeLanguage: "html",
    },
    "unused-css-rules": {
      fixHint: "Remove unused CSS or split critical CSS for above-the-fold content.",
      sampleCode: `/* Load non-critical styles after first paint */
<link rel="preload" href="/styles/main.css" as="style" onload="this.onload=null;this.rel='stylesheet'" />`,
      codeLanguage: "html",
    },
    "color-contrast": {
      fixHint: "Increase contrast between text and background (WCAG AA: 4.5:1 for body text).",
      sampleCode: `body {
  color: #1e293b;
  background-color: #ffffff;
}

a {
  color: #1d4ed8;
}`,
      codeLanguage: "css",
    },
    "label": {
      fixHint: "Associate every input with a visible label.",
      sampleCode: `<label for="email">Email address</label>
<input id="email" name="email" type="email" autocomplete="email" required />`,
      codeLanguage: "html",
    },
  };

  if (byId[id]) return byId[id];

  if (text.includes("lazy") || text.includes("offscreen") || text.includes("below the fold")) {
    return {
      fixHint: "Lazy-load below-the-fold images and prioritize the LCP image.",
      sampleCode: `<img src="hero.webp" alt="Hero" fetchpriority="high" width="1200" height="630" />
<img src="gallery.webp" alt="Gallery" loading="lazy" decoding="async" />`,
      codeLanguage: "html",
    };
  }

  if (
    text.includes("webp") ||
    text.includes("avif") ||
    text.includes("image format") ||
    text.includes("large image") ||
    text.includes("lcp") ||
    text.includes("hero")
  ) {
    return {
      fixHint: "Convert heavy images to WebP/AVIF and compress dimensions.",
      sampleCode: `<img src="hero.webp" alt="Hero section" width="1200" height="630" loading="lazy" />`,
      codeLanguage: "html",
    };
  }

  if (text.includes("alt") && (text.includes("image") || text.includes("img"))) {
    return byId["image-alt"];
  }

  if (text.includes("viewport")) return byId["ux-viewport"];
  if (text.includes("meta description")) return byId["meta-description"];
  if (text.includes("title") && text.includes("document")) return byId["document-title"];
  if (text.includes("lang")) return byId["html-has-lang"];
  if (text.includes("contrast")) return byId["color-contrast"];
  if (text.includes("label") && text.includes("form")) return byId["label"];
  if (text.includes("render-blocking") || text.includes("blocking")) return byId["render-blocking-resources"];

  return null;
}
