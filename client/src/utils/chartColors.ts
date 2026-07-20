export function scoreBarColor(score: number | null): string {
  if (score === null) return "#94a3b8";
  if (score >= 90) return "#10b981";
  if (score >= 50) return "#f59e0b";
  return "#f43f5e";
}

export function scoreHexFromPercent(score: number | null): string {
  if (score === null) return "#94a3b8";
  if (score >= 90) return "#10b981";
  if (score >= 50) return "#f59e0b";
  return "#f43f5e";
}

export function chartAxis(isDark: boolean): string {
  return isDark ? "#94a3b8" : "#64748b";
}

export function chartGrid(isDark: boolean): string {
  return isDark ? "rgba(255,255,255,0.08)" : "rgba(15,23,42,0.08)";
}

export function chartTooltipBg(isDark: boolean): string {
  return isDark ? "#1e293b" : "#ffffff";
}
