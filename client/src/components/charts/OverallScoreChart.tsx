import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useTheme } from "../../ThemeContext";
import { chartAxis, chartGrid, chartTooltipBg, scoreHexFromPercent } from "../../utils/chartColors";

const CATEGORIES: { key: string; label: string }[] = [
  { key: "performance", label: "Performance" },
  { key: "accessibility", label: "Accessibility" },
  { key: "seo", label: "SEO" },
  { key: "best-practices", label: "Best practices" },
  { key: "ux", label: "UX" },
  { key: "content", label: "Content" },
];

interface Props {
  scores: Record<string, number | null>;
}

function averageScore(scores: Record<string, number | null>): number | null {
  const values = CATEGORIES.map((c) => scores[c.key]).filter((v): v is number => v !== null);
  if (values.length === 0) return null;
  return Math.round(values.reduce((a, b) => a + b, 0) / values.length);
}

export function OverallScoreChart({ scores }: Props) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const axis = chartAxis(isDark);
  const grid = chartGrid(isDark);
  const overall = averageScore(scores);

  const barData = CATEGORIES.map(({ key, label }) => ({
    name: label,
    score: scores[key] ?? 0,
    hasScore: scores[key] !== null,
  }));

  const radarData = CATEGORIES.map(({ key, label }) => ({
    category: label,
    score: scores[key] ?? 0,
    fullMark: 100,
  }));

  return (
    <div className="space-y-8">
      <div className="flex flex-col items-center gap-6 lg:flex-row lg:items-stretch">
        <div className="flex shrink-0 flex-col items-center justify-center rounded-2xl border border-indigo-200/60 bg-indigo-50/80 px-10 py-8 dark:border-indigo-500/30 dark:bg-indigo-950/40">
          <p className="text-xs font-medium uppercase tracking-wider text-indigo-700 dark:text-indigo-300">
            Overall score
          </p>
          <p
            className="mt-2 font-display text-6xl font-bold tabular-nums"
            style={{ color: scoreHexFromPercent(overall) }}
          >
            {overall === null ? "—" : overall}
          </p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Average across all categories
          </p>
        </div>

        <div className="min-h-[280px] flex-1">
          <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
            Category overview (radar)
          </h3>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Shape shows balance across performance, a11y, SEO, and more.
          </p>
          <div className="mt-4 h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="75%">
                <PolarGrid stroke={grid} />
                <PolarAngleAxis dataKey="category" tick={{ fill: axis, fontSize: 10 }} />
                <Radar
                  name="Score"
                  dataKey="score"
                  stroke="#6366f1"
                  fill="#6366f1"
                  fillOpacity={isDark ? 0.35 : 0.25}
                  strokeWidth={2}
                />
                <Tooltip
                  contentStyle={{
                    background: chartTooltipBg(isDark),
                    border: `1px solid ${grid}`,
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                  formatter={(value) => [`${value ?? 0}/100`, "Score"]}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
          All category scores
        </h3>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Final comparison bar chart — green 90+, amber 50–89, red below 50.
        </p>
        <div className="mt-4 h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} margin={{ top: 8, right: 8, left: 0, bottom: 48 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={grid} vertical={false} />
              <XAxis
                dataKey="name"
                tick={{ fill: axis, fontSize: 10 }}
                axisLine={{ stroke: grid }}
                tickLine={false}
                interval={0}
                angle={-28}
                textAnchor="end"
                height={56}
              />
              <YAxis
                domain={[0, 100]}
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
                formatter={(value) => [`${value ?? 0}/100`, "Score"]}
              />
              <Bar dataKey="score" radius={[8, 8, 0, 0]} maxBarSize={56}>
                {barData.map((entry) => (
                  <Cell
                    key={entry.name}
                    fill={scoreHexFromPercent(entry.hasScore ? entry.score : null)}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
