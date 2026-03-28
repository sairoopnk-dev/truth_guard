"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const sidebarLinks = [
  { href: "/",               label: "Home",           icon: "🏠" },
  { href: "/fake-news",      label: "Fake News",      icon: "🗞️" },
  { href: "/website-safety", label: "Website Safety", icon: "🔒" },
  { href: "/ai-content",     label: "AI Content",     icon: "🤖" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="glass w-64 flex-shrink-0"
      style={{ borderRight: "1px solid var(--border)", minHeight: "100%" }}
    >
      <div className="flex flex-col gap-4 p-6">
        <nav className="flex flex-col gap-2">
          {sidebarLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`group flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                  isActive ? "bg-white/10" : "hover:bg-white/5"
                }`}
                style={{ color: isActive ? "#fff" : "var(--text-primary)" }}
              >
                <span className={`text-lg transition-transform duration-200 ${isActive ? "scale-110 opacity-100" : "opacity-70 group-hover:opacity-100 group-hover:scale-110"}`}>
                  {link.icon}
                </span>
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
