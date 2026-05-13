// components/MainNav.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

const links = [
  { href: "/", label: "HOME" },
  { href: "/about", label: "ABOUT" },
  { href: "/media", label: "MEDIA" },
  { href: "/events", label: "MINISTRY" },
  { href: "/apply", label: "APPLY" },
  { href: "/inquiry", label: "CONTACT" },
];

export default function MainNav() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-black border-b border-white/10">
        <nav className="w-full px-4 sm:px-6 md:px-10 lg:px-14 h-12 sm:h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center flex-shrink-0">
            <Image
              src="https://ewaqnqzivdceurhjxgpf.supabase.co/storage/v1/object/public/assets/SHIRBAND%20Main%20Logotype_WHITE(1000).png"
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

          {/* 모바일 햄버거 */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="sm:hidden flex flex-col items-center justify-center w-8 h-8 space-y-1"
            aria-label="Menu"
          >
            <span
              className={`block w-6 h-0.5 bg-white transition-transform duration-300 ${
                isOpen ? "rotate-45 translate-y-1.5" : ""
              }`}
            ></span>
            <span
              className={`block w-6 h-0.5 bg-white transition-opacity duration-300 ${
                isOpen ? "opacity-0" : ""
              }`}
            ></span>
            <span
              className={`block w-6 h-0.5 bg-white transition-transform duration-300 ${
                isOpen ? "-rotate-45 -translate-y-1.5" : ""
              }`}
            ></span>
          </button>
        </nav>
      </header>

      {/* 모바일 오버레이 */}
      {isOpen && (
        <div className="fixed inset-0 z-40 sm:hidden">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          ></div>
          <div className="fixed top-12 left-0 right-0 bg-black/95 backdrop-blur-md border-b border-white/20">
            <ul className="py-2">
              {links.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="block px-6 py-3 text-sm uppercase tracking-[0.2em] text-white/90 hover:text-white hover:bg-white/5 transition-colors font-medium"
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
