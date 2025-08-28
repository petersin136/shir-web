// components/MainNav.tsx
"use client";

import Link from "next/link";
import Image from "next/image";

const links = [
  { href: "/", label: "HOME", shortLabel: "HOME" },
  { href: "/about", label: "ABOUT US", shortLabel: "ABOUT" },
  { href: "/metanoia-2026", label: "METANOIA 2026", shortLabel: "META" },
  { href: "/media", label: "MEDIA", shortLabel: "MEDIA" },
  { href: "/events", label: "EVENTS", shortLabel: "EVENT" },
  { href: "/contact", label: "CONTACT", shortLabel: "CONTACT" },
];

export default function MainNav() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/10 backdrop-blur-md border-b border-white/10">
      <nav className="mx-auto max-w-6xl px-3 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
        {/* 왼쪽: 로고 자리 */}
        <Link href="/" className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
          <div className="bg-white rounded-md p-1.5 sm:rounded-lg sm:p-2 flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10">
            <Image 
              src="https://ewaqnqzivdceurhjxgpf.supabase.co/storage/v1/object/public/assets/shir-logo.png" 
              alt="SHIR Logo" 
              width={24}
              height={24}
              className="w-6 h-6 sm:w-8 sm:h-8 object-contain"
            />
          </div>
          <span className="text-base sm:text-xl tracking-wide uppercase font-bold text-white whitespace-nowrap">
            SHIR BAND
          </span>
        </Link>
        {/* 오른쪽: 메뉴 */}
        <ul className="flex items-center gap-1 sm:gap-8 overflow-hidden">
          {links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className="text-xs sm:text-base uppercase tracking-wider text-white hover:text-gray-200 transition-colors font-bold px-1 sm:px-0 whitespace-nowrap"
              >
                <span className="sm:hidden">{l.shortLabel}</span>
                <span className="hidden sm:inline">{l.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}