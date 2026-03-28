import Link from "next/link";

export default function Navbar() {
  return (
    <header
      className="glass w-full"
      style={{ borderBottom: "1px solid var(--border)" }}
    >
      <div className="flex w-full items-center justify-between px-6 py-4">
        {/* Brand */}
        <Link
          id="nav-brand"
          href="/"
          className="flex items-center gap-2 text-xl font-extrabold tracking-tight"
        >
          <span
            className="bg-clip-text text-transparent"
            style={{ backgroundImage: "linear-gradient(135deg, #6366f1, #a78bfa)" }}
          >
            TruthGuard
          </span>
          <span style={{ color: "var(--text-primary)" }}>AI</span>
        </Link>


      </div>
    </header>
  );
}
