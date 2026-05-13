// components/MainNav.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

const links = [
  { href: "/", label: "HOME", shortLabel: "HOME" },
  { href: "/about", label: "ABOUT", shortLabel: "ABOUT" },
  { href: "/metanoia-2026", label: "METANOIA", shortLabel: "META" },
  { href: "/oneness", label: "ONENESS WORSHIP", shortLabel: "ONENESS" },
  { href: "/media", label: "MEDIA", shortLabel: "MEDIA" },
  { href: "/events", label: "MINISTRY", shortLabel: "MINISTRY" },
  { href: "/apply", label: "APPLY", shortLabel: "APPLY" },
  { href: "/inquiry", label: "CONTACT", shortLabel: "CONTACT" },
];

export default function MainNav() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-black border-b border-white/10">
        <nav className="mx-auto max-w-6xl px-3 sm:px-6 lg:px-8 h-12 sm:h-14 flex items-center justify-between">
          {/* 왼쪽: 로고 자리 */}
          <Link href="/" className="flex items-center flex-shrink-0">
            <Image
              src="https://ewaqnqzivdceurhjxgpf.supabase.co/storage/v1/object/public/assets/SHIRBAND%20Sub%20Logotype%2003_WHITE(500).png"
              alt="SHIR BAND"
              width={500}
              height={130}
              priority
              className="h-7 sm:h-9 w-auto object-contain"
            />
          </Link>

          {/* 데스크톱 메뉴 */}
          <ul className="hidden sm:flex items-center gap-6">
            {links.map((l) => (
              <li key={l.href} className="flex-shrink-0">
                <Link
                  href={l.href}
                  className="text-sm uppercase tracking-wider text-white hover:text-gray-200 transition-colors font-bold whitespace-nowrap block"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* 모바일 햄버거 버튼 */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="sm:hidden flex flex-col items-center justify-center w-8 h-8 space-y-1"
            aria-label="Menu"
          >
            <span className={`block w-6 h-0.5 bg-white transition-transform duration-300 ${isOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
            <span className={`block w-6 h-0.5 bg-white transition-opacity duration-300 ${isOpen ? 'opacity-0' : ''}`}></span>
            <span className={`block w-6 h-0.5 bg-white transition-transform duration-300 ${isOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
          </button>
        </nav>
      </header>

      {/* 모바일 메뉴 오버레이 */}
      {isOpen && (
        <div className="fixed inset-0 z-40 sm:hidden">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsOpen(false)}></div>
          <div className="fixed top-12 left-0 right-0 bg-black/95 backdrop-blur-md border-b border-white/20">
            <ul className="py-4">
              {links.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="block px-6 py-4 text-lg uppercase tracking-wider text-white hover:text-gray-200 hover:bg-white/10 transition-colors font-bold"
                    onClick={() => setIsOpen(false)}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </>
  );
}