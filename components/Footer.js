import Link from "next/link";

export default function Footer() {
  return (
    <footer
      className="w-full"
      style={{
        borderTop: "1px solid var(--border)",
        background: "var(--bg-secondary)",
      }}
    >
      <div className="mx-auto max-w-6xl px-6 py-2">
        <p className="text-center text-xs" style={{ color: "var(--text-muted)" }}>
          © {new Date().getFullYear()} TruthGuard AI. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
