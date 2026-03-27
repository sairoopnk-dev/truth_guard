/**
 * HistoryList — placeholder UI component.
 * Will display past analysis records once feature logic is implemented.
 *
 * Props (future):
 *   - items : Array<{ id, label, verdict, date }>
 */
export default function HistoryList({ items = [] }) {
  return (
    <div id="history-list" className="glass rounded-2xl p-6">
      <h2 className="mb-4 text-base font-semibold" style={{ color: "var(--text-primary)" }}>
        Recent History
      </h2>

      {items.length === 0 ? (
        <div className="flex flex-col items-center py-10 text-center">
          <span className="mb-3 text-4xl">🗂️</span>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            No history yet. Start analysing content to see results here.
          </p>
        </div>
      ) : (
        <ul className="divide-y" style={{ borderColor: "var(--border)" }}>
          {items.map((item) => (
            <li
              key={item.id}
              className="flex items-center justify-between py-3 text-sm"
            >
              <span style={{ color: "var(--text-primary)" }}>{item.label}</span>
              <div className="flex items-center gap-3">
                <span
                  className="rounded-full px-2 py-0.5 text-xs font-semibold text-white"
                  style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}
                >
                  {item.verdict}
                </span>
                <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                  {item.date}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
