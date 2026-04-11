import { useTheme } from "../ThemeContext";

/** Colored geometric lines + film grain + vignette; theme-aware */
export function VintageBackdrop() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const gridStrokeA = isDark ? "rgba(99,102,241,0.38)" : "rgba(67,56,202,0.42)";
  const gridStrokeB = isDark ? "rgba(34,211,238,0.22)" : "rgba(14,116,144,0.35)";
  const gridW = isDark ? 0.5 : 0.65;
  const diagSecondary = isDark ? "rgba(244,114,182,0.14)" : "rgba(190,24,93,0.2)";

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* Base */}
      <div
        className={
          isDark
            ? "absolute inset-0 bg-[#06080f]"
            : "absolute inset-0 bg-[#f0ebe3]"
        }
      />

      {/* Colored line grid + diagonals — stronger contrast in light mode */}
      <svg
        className={
          isDark
            ? "absolute inset-0 h-full w-full opacity-[0.55]"
            : "absolute inset-0 h-full w-full opacity-[0.88]"
        }
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <defs>
          <pattern id="sq" width="48" height="48" patternUnits="userSpaceOnUse">
            <path
              d="M48 0H0V48"
              fill="none"
              stroke={gridStrokeA}
              strokeWidth={gridW}
            />
            <path
              d="M0 0H48V48"
              fill="none"
              stroke={gridStrokeB}
              strokeWidth={gridW}
            />
          </pattern>
          <linearGradient id="diag" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={isDark ? "#6366f1" : "#4f46e5"} stopOpacity={isDark ? 0.18 : 0.35} />
            <stop offset="50%" stopColor={isDark ? "#22d3ee" : "#0d9488"} stopOpacity={isDark ? 0.14 : 0.28} />
            <stop offset="100%" stopColor={isDark ? "#f472b6" : "#db2777"} stopOpacity={isDark ? 0.12 : 0.22} />
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#sq)" />
        <g>
          <line
            x1="0"
            y1="100%"
            x2="100%"
            y2="0"
            stroke="url(#diag)"
            strokeWidth={isDark ? 1.2 : 1.85}
            opacity={isDark ? 0.5 : 0.72}
          />
          <line
            x1="0"
            y1="0"
            x2="100%"
            y2="100%"
            stroke={diagSecondary}
            strokeWidth={isDark ? 0.8 : 1.2}
            opacity={isDark ? 1 : 0.85}
          />
        </g>
      </svg>

      {/* Floating orbs — softer in light mode so text stays readable */}
      <div
        className={
          isDark
            ? "absolute -left-32 top-1/4 h-72 w-72 rounded-full bg-indigo-500/25 blur-3xl animate-float"
            : "absolute -left-32 top-1/4 h-72 w-72 rounded-full bg-indigo-400/25 blur-3xl animate-float"
        }
        aria-hidden
      />
      <div
        className={
          isDark
            ? "absolute -right-24 bottom-1/4 h-80 w-80 rounded-full bg-cyan-400/20 blur-3xl animate-float-slow"
            : "absolute -right-24 bottom-1/4 h-80 w-80 rounded-full bg-teal-400/20 blur-3xl animate-float-slow"
        }
        style={{ animationDelay: "1s" }}
        aria-hidden
      />
      <div
        className={
          isDark
            ? "absolute left-1/3 top-10 h-40 w-40 rounded-full bg-fuchsia-500/15 blur-2xl animate-float"
            : "absolute left-1/3 top-10 h-40 w-40 rounded-full bg-fuchsia-400/15 blur-2xl animate-float"
        }
        style={{ animationDelay: "2s" }}
        aria-hidden
      />

      {/* Vintage vignette — lighter edge in light mode so UI text pops */}
      <div
        className={
          isDark
            ? "absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.55)_100%)]"
            : "absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(71,60,50,0.07)_100%)]"
        }
      />

      {/* Film grain — much lighter on light theme */}
      <div
        className={
          isDark
            ? "vintage-grain absolute inset-0 opacity-[0.22] mix-blend-overlay"
            : "vintage-grain absolute inset-0 opacity-[0.06] mix-blend-multiply"
        }
        aria-hidden
      />
    </div>
  );
}
