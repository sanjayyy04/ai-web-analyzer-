/** Subtle geometric linework over the site's black background. */
export function VintageBackdrop() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-black" />
      <svg
        className="absolute inset-0 h-full w-full opacity-40"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <defs>
          <pattern id="sq" width="48" height="48" patternUnits="userSpaceOnUse">
            <path
              d="M48 0H0V48"
              fill="none"
              stroke="rgba(180,235,88,0.1)"
              strokeWidth="0.45"
            />
            <path
              d="M0 0H48V48"
              fill="none"
              stroke="rgba(255,255,255,0.035)"
              strokeWidth="0.45"
            />
          </pattern>
          <linearGradient id="diag" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#b4eb58" stopOpacity="0.06" />
            <stop offset="50%" stopColor="#ffffff" stopOpacity="0.025" />
            <stop offset="100%" stopColor="#b4eb58" stopOpacity="0.04" />
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
            strokeWidth="1.2"
            opacity="0.35"
          />
        </g>
      </svg>
    </div>
  );
}
