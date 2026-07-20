import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useTheme } from "../../ThemeContext";
import type { PerformanceMetric } from "../../types";
import { chartAxis, chartGrid, chartTooltipBg, scoreHexFromPercent } from "../../utils/chartColors";

interface Props {
  performanceScore: number | null;
  metrics: PerformanceMetric[];
}

function metricScorePercent(m: PerformanceMetric): number | null {
  if (m.score === null) return null;
  return Math.round(m.score * 100);
}

export function PerformanceCharts({ performanceScore, metrics }: Props) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const axis = chartAxis(isDark);
  const grid = chartGrid(isDark);

  const timingData = metrics
    .filter((m) => m.unit === "millisecond")
    .map((m) => ({
      name: m.shortLabel,
      ms: Math.round(m.value),
      display: m.displayValue,
      scorePct: metricScorePercent(m),
    }));

  const healthData = metrics.map((m) => ({
    name: m.shortLabel,
    score: metricScorePercent(m) ?? 0,
    display: m.displayValue,
  }));

  if (metrics.length === 0) {
    return (
      <p className="text-sm text-slate-500 dark:text-slate-400">
        No performance timing data from this audit run.
      </p>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
        <div className="flex shrink-0 flex-col items-center rounded-2xl border border-slate-200/80 bg-white/70 px-8 py-6 dark:border-white/10 dark:bg-ink-900/60">
          <p className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Performance score
          </p>
          <p
            className="mt-2 font-display text-5xl font-bold tabular-nums"
            style={{ color: scoreHexFromPercent(performanceScore) }}
          >
            {performanceScore === null ? "—" : performanceScore}
          </p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">out of 100</p>
        </div>
      </div>

      {timingData.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
            Load timing (milliseconds)
          </h3>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Lower bars are better for FCP, LCP, TBT, Speed Index, and TTI.
          </p>
          <div className="mt-4 h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={timingData} margin={{ top: 8, right: 8, left: 0, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={grid} vertical={false} />
                <XAxis
                  dataKey="name"
                  tick={{ fill: axis, fontSize: 12 }}
                  axisLine={{ stroke: grid }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: axis, fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  unit=" ms"
                />
                <Tooltip
                  contentStyle={{
                    background: chartTooltipBg(isDark),
                    border: `1px solid ${grid}`,
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                  formatter={(value, _name, item) => [
                    `${value ?? 0} ms (${(item?.payload as { display?: string })?.display ?? ""})`,
                    "Time",
                  ]}
                />
                <Bar dataKey="ms" radius={[6, 6, 0, 0]} maxBarSize={48}>
                  {timingData.map((entry) => (
                    <Cell key={entry.name} fill={scoreHexFromPercent(entry.scorePct)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      <div>
        <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
          Metric health (Lighthouse score per metric)
        </h3>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          How each Core Web Vital and timing audit scored (0–100).
        </p>
        <div className="mt-4 h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={healthData}
              layout="vertical"
              margin={{ top: 4, right: 16, left: 4, bottom: 4 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke={grid} horizontal={false} />
              <XAxis
                type="number"
                domain={[0, 100]}
                tick={{ fill: axis, fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                type="category"
                dataKey="name"
                width={72}
                tick={{ fill: axis, fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  background: chartTooltipBg(isDark),
                  border: `1px solid ${grid}`,
                  borderRadius: 8,
                  fontSize: 12,
                }}
                formatter={(value, _name, item) => [
                  `${value ?? 0}/100 · ${(item?.payload as { display?: string })?.display ?? ""}`,
                  "Score",
                ]}
              />
              <Bar dataKey="score" radius={[0, 6, 6, 0]} maxBarSize={20}>
                {healthData.map((entry) => (
                  <Cell key={entry.name} fill={scoreHexFromPercent(entry.score)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
