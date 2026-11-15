export function scoreBarColor(score: number | null): string {
  if (score === null) return "#858b82";
  if (score >= 90) return "#a7e44c";
  if (score >= 50) return "#ead35a";
  return "#777d75";
}

export function scoreHexFromPercent(score: number | null): string {
  if (score === null) return "#858b82";
  if (score >= 90) return "#a7e44c";
  if (score >= 50) return "#ead35a";
  return "#777d75";
}

export function chartAxis(isDark: boolean): string {
  return isDark ? "#a5aaa1" : "#5d625b";
}

export function chartGrid(isDark: boolean): string {
  return isDark ? "rgba(255,255,255,0.12)" : "rgba(23,25,22,0.12)";
}

export function chartTooltipBg(isDark: boolean): string {
  return isDark ? "#111311" : "#ffffff";
}
