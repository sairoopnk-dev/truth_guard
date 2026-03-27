import Link from "next/link";

const footerLinks = [
  { href: "/fake-news",      label: "Fake News" },
  { href: "/website-safety", label: "Website Safety" },
  { href: "/ai-content",     label: "AI Content" },
];

export default function Footer() {
  return (
    <footer
      className="w-full"
      style={{
        borderTop: "1px solid var(--border)",
        background: "var(--bg-secondary)",
      }}
    >
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-between">
          {/* Brand */}
          <p className="text-sm font-semibold" style={{ color: "var(--text-muted)" }}>
            <span
              className="bg-clip-text text-transparent font-extrabold"
              style={{ backgroundImage: "linear-gradient(135deg, #6366f1, #a78bfa)" }}
            >
              TruthGuard AI
            </span>{" "}
            — Fighting misinformation with AI.
          </p>

          {/* Links */}
          <nav className="flex gap-4" aria-label="Footer navigation">
            {footerLinks.map((link) => (
              <Link
                key={link.href}
                id={`footer-${link.label.toLowerCase().replace(" ", "-")}`}
                href={link.href}
                className="text-sm transition-colors hover:text-indigo-400"
                style={{ color: "var(--text-muted)" }}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <p className="mt-6 text-center text-xs" style={{ color: "var(--text-muted)" }}>
          © {new Date().getFullYear()} TruthGuard AI. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
