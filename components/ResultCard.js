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
  return (
    <div
      id="result-card"
      className="glass rounded-2xl p-6"
      role="region"
      aria-label="Analysis Result"
    >
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-base font-semibold" style={{ color: "var(--text-primary)" }}>
          {title ?? "Analysis Result"}
        </h3>
        {verdict && (
          <span
            className="rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide text-white"
            style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}
          >
            {verdict}
          </span>
        )}
      </div>

      {/* Score bar placeholder */}
      <div className="mb-4">
        <div className="mb-1 flex justify-between text-xs" style={{ color: "var(--text-muted)" }}>
          <span>Confidence</span>
          <span>{score != null ? `${score}%` : "—"}</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full" style={{ background: "var(--bg-primary)" }}>
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: score != null ? `${score}%` : "0%",
              background: "linear-gradient(90deg, #6366f1, #a78bfa)",
            }}
          />
        </div>
      </div>

      {/* Details placeholder */}
      <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
        {details ?? "Run an analysis to see results here."}
      </p>
    </div>
  );
}
