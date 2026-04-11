export function normalizeUrl(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) throw new Error("URL is required");
  const withScheme = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  const u = new URL(withScheme);
  if (!["http:", "https:"].includes(u.protocol)) {
    throw new Error("Only http(s) URLs are supported");
  }
  return u.href;
}
