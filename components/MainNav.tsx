// components/MainNav.tsx
"use client";

import Link from "next/link";
import Image from "next/image";

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
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/10 backdrop-blur-md border-b border-white/10">
      <nav className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* 왼쪽: 로고 자리 */}
        <Link href="/" className="flex items-center gap-4">
          <div className="bg-white rounded-lg p-2 flex items-center justify-center">
            <Image 
              src="https://ewaqnqzivdceurhjxgpf.supabase.co/storage/v1/object/public/assets/shir-logo.png" 
              alt="SHIR Logo" 
              width={32}
              height={32}
              className="object-contain"
            />
          </div>
          <span className="text-xl tracking-wide uppercase font-bold text-white">
            SHIR BAND
          </span>
        </Link>
        {/* 오른쪽: 메뉴 */}
        <ul className="flex items-center gap-8">
          {links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className="text-sm sm:text-base uppercase tracking-wider text-white hover:text-gray-200 transition-colors font-bold"
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