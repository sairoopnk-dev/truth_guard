import Link from "next/link";

const navLinks = [
  { href: "/fake-news",       label: "Fake News" },
  { href: "/website-safety",  label: "Website Safety" },
  { href: "/ai-content",      label: "AI Content" },
];

export default function Navbar() {
  return (
    <header
      className="glass sticky top-0 z-50 w-full"
      style={{ borderBottom: "1px solid var(--border)" }}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
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

        {/* Nav links */}
        <nav className="hidden items-center gap-1 sm:flex" aria-label="Main navigation">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              id={`nav-${link.label.toLowerCase().replace(" ", "-")}`}
              href={link.href}
              className="rounded-lg px-4 py-2 text-sm font-medium transition-colors hover:bg-white/10"
              style={{ color: "var(--text-muted)" }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* CTA */}
        <Link
          id="nav-cta"
          href="/fake-news"
          className="btn-glow hidden rounded-xl px-5 py-2 text-sm font-semibold text-white sm:inline-block"
        >
          Try Now
        </Link>
      </div>
    </header>
  );
}
