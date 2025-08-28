// components/MainNav.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

const links = [
  { href: "/", label: "HOME", shortLabel: "HOME" },
  { href: "/about", label: "ABOUT US", shortLabel: "ABOUT" },
  { href: "/metanoia-2026", label: "METANOIA 2026", shortLabel: "META" },
  { href: "/media", label: "MEDIA", shortLabel: "MEDIA" },
  { href: "/events", label: "EVENTS", shortLabel: "EVENT" },
  { href: "/contact", label: "CONTACT", shortLabel: "CONTACT" },
];

export default function MainNav() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
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

          {/* 데스크톱 메뉴 */}
          <ul className="hidden sm:flex items-center gap-8">
            {links.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="text-base uppercase tracking-wider text-white hover:text-gray-200 transition-colors font-bold"
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
          <div className="fixed top-16 left-0 right-0 bg-black/95 backdrop-blur-md border-b border-white/20">
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