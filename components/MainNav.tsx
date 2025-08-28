// components/MainNav.tsx
"use client";

import Link from "next/link";

const links = [
  { href: "/", label: "HOME" },
  { href: "/about", label: "ABOUT US" },
  { href: "/metanoia-2026", label: "METANOIA 2026" },
  { href: "/media", label: "MEDIA" },
  { href: "/events", label: "EVENTS" },
  { href: "/contact", label: "CONTACT" },
];

export default function MainNav() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm">
      <nav className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* 왼쪽: 로고 자리 */}
        <Link href="/" className="flex items-center gap-3">
          <img 
            src="/logo-shir.svg" 
            alt="SHIR Logo" 
            className="h-6 w-6 object-contain"
          />
          <span className="text-base tracking-widest uppercase font-semibold text-gray-900">
            SHIR
          </span>
        </Link>
        {/* 오른쪽: 메뉴 */}
        <ul className="flex items-center gap-6">
          {links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className="text-xs sm:text-sm uppercase tracking-[0.2em] text-gray-700 hover:text-gray-900 transition-colors font-medium"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}