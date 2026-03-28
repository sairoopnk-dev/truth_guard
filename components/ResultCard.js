/**
 * ResultCard — placeholder UI component.
 * Will display AI analysis results once feature logic is implemented.
 *
 * Props (future):
 *   - title    : string  — result title
 *   - verdict  : string  — e.g. "Fake", "Safe", "AI-Generated"
 *   - score    : number  — confidence percentage
 *   - details  : string  — detailed explanation
 */
export default function ResultCard({ title, verdict, score, details }) {
  // Determine color theme based on verdict
  let theme = "indigo"; // default fallback
  const v = verdict?.toLowerCase();
  
  if (v === "safe" || v === "real" || v === "likely human") {
    theme = "green";
  } else if (v === "uncertain") {
    theme = "yellow";
  } else if (v === "fake" || v === "likely fake" || v === "suspicious" || v === "likely ai-generated") {
    theme = "red";
  }

  const badgeColors = {
    green: "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-emerald-500/30",
    yellow: "bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-amber-500/30",
    red: "bg-gradient-to-r from-rose-500 to-red-600 text-white shadow-rose-500/30",
    indigo: "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-indigo-500/30",
  };

  const progressColors = {
    green: "from-emerald-400 to-teal-400",
    yellow: "from-amber-400 to-orange-400",
    red: "from-rose-400 to-red-400",
    indigo: "from-indigo-400 to-purple-400",
  };

  const borderOutline = {
    green: "border-emerald-500/30",
    yellow: "border-amber-500/30",
    red: "border-rose-500/30",
    indigo: "border-indigo-500/30",
  };

  return (
    <div
      id="result-card"
      className={`glass rounded-2xl p-6 shadow-xl border transition-all duration-300 ${borderOutline[theme]}`}
      role="region"
      aria-label="Analysis Result"
    >
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h3 className="text-xl font-bold tracking-tight" style={{ color: "var(--text-primary)" }}>
          {title ?? "Analysis Result"}
        </h3>
        {verdict && (
          <span
            className={`rounded-full px-4 py-1.5 text-sm font-extrabold uppercase tracking-wider shadow-lg ${badgeColors[theme]}`}
          >
            {verdict}
          </span>
        )}
      </div>

      {/* Score bar */}
      <div className="mb-6">
        <div className="mb-2 flex justify-between text-sm font-semibold" style={{ color: "var(--text-muted)" }}>
          <span>Confidence Score</span>
          <span className="text-white">{score != null ? `${score}%` : "—"}</span>
        </div>
        <div className="h-3 w-full overflow-hidden rounded-full bg-black/40 shadow-inner">
          <div
            className={`h-full rounded-full transition-all duration-1000 ease-out bg-gradient-to-r ${progressColors[theme]}`}
            style={{ width: score != null ? `${score}%` : "0%" }}
          />
        </div>
      </div>

      {/* Details */}
      <div className="rounded-xl bg-white/5 p-4 border border-white/10">
        <p className="text-base leading-relaxed font-medium" style={{ color: "var(--text-primary)" }}>
          {details ?? "Run an analysis to see results here."}
        </p>
      </div>
    </div>
  );
}
