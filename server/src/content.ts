import * as cheerio from "cheerio";
import type { ContentSignals } from "./types.js";

export function emptyContentSignals(): ContentSignals {
  return {
    title: null,
    titleLength: 0,
    metaDescription: null,
    metaDescriptionLength: 0,
    h1Count: 0,
    imagesTotal: 0,
    imagesMissingAlt: 0,
    wordCountApprox: 0,
    hasViewportMeta: false,
    langAttribute: null,
  };
}

export async function analyzeContentSignals(url: string): Promise<ContentSignals> {
  const res = await fetch(url, {
    headers: {
      "user-agent":
        "Mozilla/5.0 (compatible; AIWebAnalyzer/1.0; +https://example.local)",
      accept: "text/html,application/xhtml+xml",
    },
    redirect: "follow",
  });

  if (!res.ok) {
    return emptyContentSignals();
  }

  const html = await res.text();
  const $ = cheerio.load(html);

  const title = $("title").first().text().trim() || null;
  const metaDescription =
    $('meta[name="description"]').attr("content")?.trim() ||
    $('meta[property="og:description"]').attr("content")?.trim() ||
    null;

  const h1Count = $("h1").length;
  const images = $("img");
  let imagesMissingAlt = 0;
  images.each((_, el) => {
    const alt = $(el).attr("alt");
    if (alt === undefined || alt === null) imagesMissingAlt += 1;
  });

  const bodyText = $("body").text().replace(/\s+/g, " ").trim();
  const wordCountApprox = bodyText ? bodyText.split(/\s+/).length : 0;

  const hasViewportMeta = $('meta[name="viewport"]').length > 0;
  const langAttribute = $("html").attr("lang")?.trim() || null;

  return {
    title,
    titleLength: title?.length ?? 0,
    metaDescription,
    metaDescriptionLength: metaDescription?.length ?? 0,
    h1Count,
    imagesTotal: images.length,
    imagesMissingAlt,
    wordCountApprox,
    hasViewportMeta,
    langAttribute,
  };
}
