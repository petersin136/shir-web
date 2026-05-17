// components/MainNav.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

const projectLinks = [
  { href: "/metanoia-2026", label: "Metanoia Conference" },
  { href: "/oneness", label: "ONENESS Worship" },
] as const;

const newsChildren = [
  { href: "/notice", label: "Notice" },
  { href: "/events", label: "Event" },
] as const;

const dropdownPanelClass =
  "absolute left-0 top-full pt-1 min-w-[14rem] rounded-md border border-neutral-200/90 bg-white py-1.5 shadow-lg shadow-black/5 opacity-0 pointer-events-none translate-y-0.5 group-hover:opacity-100 group-hover:pointer-events-auto group-hover:translate-y-0 group-focus-within:opacity-100 group-focus-within:pointer-events-auto group-focus-within:translate-y-0 transition-all duration-150 z-50";

function DesktopDropdown({
  label,
  items,
}: {
  label: string;
  items: readonly { href: string; label: string }[];
}) {
  return (
    <li className="relative flex-shrink-0 group">
      <button
        type="button"
        className="text-sm uppercase tracking-wider text-neutral-900 group-hover:text-neutral-600 transition-colors font-bold whitespace-nowrap block py-1"
        aria-haspopup="menu"
      >
        {label}
      </button>
      <ul className={dropdownPanelClass} role="menu">
        {items.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              role="menuitem"
              className="block px-4 py-2.5 text-[13px] font-medium tracking-wide text-neutral-800 hover:bg-neutral-50 hover:text-neutral-950 transition-colors"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </li>
  );
}

function DesktopProjectArchive() {
  return (
    <li className="relative flex-shrink-0 group">
      <button
        type="button"
        className="whitespace-nowrap py-1 text-sm font-bold uppercase tracking-wider text-neutral-900 transition-colors group-hover:text-neutral-600"
        aria-haspopup="menu"
      >
        PROJECT
      </button>
      <ul className={dropdownPanelClass} role="menu">
        {projectLinks.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              role="menuitem"
              className="block px-4 py-2.5 text-[13px] font-medium tracking-wide text-neutral-800 transition-colors hover:bg-neutral-50 hover:text-neutral-950"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </li>
  );
}

export default function MainNav() {
  const [isOpen, setIsOpen] = useState(false);
  const [projectOpen, setProjectOpen] = useState(false);
  const [newsOpen, setNewsOpen] = useState(false);

  const closeMobile = () => {
    setIsOpen(false);
    setProjectOpen(false);
    setNewsOpen(false);
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-neutral-200/80 shadow-[0_1px_0_rgba(0,0,0,0.04)]">
        <nav className="w-full px-4 sm:px-6 md:px-10 lg:px-14 h-12 sm:h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center flex-shrink-0">
            <Image
              src="https://ewaqnqzivdceurhjxgpf.supabase.co/storage/v1/object/public/assets/SHIRBAND%20Main%20Logotype_BLACK(1000).png"
              alt="SHIR BAND"
              width={500}
              height={130}
              priority
              className="h-6 sm:h-7 w-auto object-contain"
            />
          </Link>

          {/* 데스크톱 메뉴 — ABOUT · PROJECT · TICKET · NEWS · APPLY · CONTACT */}
          <ul className="hidden sm:flex items-center gap-5 lg:gap-6">
            <li className="flex-shrink-0">
              <Link
                href="/about"
                className="text-sm uppercase tracking-wider text-neutral-900 hover:text-neutral-600 transition-colors font-bold whitespace-nowrap block"
              >
                ABOUT
              </Link>
            </li>
            <DesktopProjectArchive />
            <li className="flex-shrink-0">
              <Link
                href="/ticket"
                className="text-sm uppercase tracking-wider text-neutral-900 hover:text-neutral-600 transition-colors font-bold whitespace-nowrap block"
              >
                TICKET
              </Link>
            </li>
            <DesktopDropdown label="NEWS" items={newsChildren} />
            <li className="flex-shrink-0">
              <Link
                href="/apply"
                className="text-sm uppercase tracking-wider text-neutral-900 hover:text-neutral-600 transition-colors font-bold whitespace-nowrap block"
              >
                APPLY
              </Link>
            </li>
            <li className="flex-shrink-0">
              <Link
                href="/inquiry"
                className="text-sm uppercase tracking-wider text-neutral-900 hover:text-neutral-600 transition-colors font-bold whitespace-nowrap block"
              >
                CONTACT
              </Link>
            </li>
          </ul>

          {/* 모바일 햄버거 */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="sm:hidden flex flex-col items-center justify-center w-8 h-8 space-y-1"
            aria-label="Menu"
          >
            <span
              className={`block w-6 h-0.5 bg-neutral-900 transition-transform duration-300 ${
                isOpen ? "rotate-45 translate-y-1.5" : ""
              }`}
            ></span>
            <span
              className={`block w-6 h-0.5 bg-neutral-900 transition-opacity duration-300 ${
                isOpen ? "opacity-0" : ""
              }`}
            ></span>
            <span
              className={`block w-6 h-0.5 bg-neutral-900 transition-transform duration-300 ${
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
            onClick={closeMobile}
          ></div>
          <div className="fixed top-12 left-0 right-0 max-h-[calc(100dvh-3rem)] overflow-y-auto bg-white backdrop-blur-md border-b border-neutral-200/80 shadow-sm">
            <ul className="py-2">
              <li>
                <Link
                  href="/about"
                  className="block px-6 py-3 text-sm uppercase tracking-[0.2em] text-neutral-800 hover:text-neutral-950 hover:bg-neutral-100 transition-colors font-medium"
                  onClick={closeMobile}
                >
                  ABOUT
                </Link>
              </li>
              <li>
                <button
                  type="button"
                  className="flex w-full items-center justify-between px-6 py-3 text-left text-sm uppercase tracking-[0.2em] text-neutral-800 hover:bg-neutral-100 transition-colors font-medium"
                  aria-expanded={projectOpen}
                  onClick={() => setProjectOpen((v) => !v)}
                >
                  PROJECT
                  <span className="text-xs opacity-60" aria-hidden>
                    {projectOpen ? "▴" : "▾"}
                  </span>
                </button>
                {projectOpen && (
                  <ul className="border-t border-neutral-100 bg-neutral-50/80">
                    {projectLinks.map((item) => (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          className="block py-2.5 pl-10 pr-6 text-[13px] tracking-wide text-neutral-700 transition-colors hover:bg-neutral-100 hover:text-neutral-950"
                          onClick={closeMobile}
                        >
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
              <li>
                <Link
                  href="/ticket"
                  className="block px-6 py-3 text-sm uppercase tracking-[0.2em] text-neutral-800 hover:text-neutral-950 hover:bg-neutral-100 transition-colors font-medium"
                  onClick={closeMobile}
                >
                  TICKET
                </Link>
              </li>
              <li>
                <button
                  type="button"
                  className="flex w-full items-center justify-between px-6 py-3 text-left text-sm uppercase tracking-[0.2em] text-neutral-800 hover:bg-neutral-100 transition-colors font-medium"
                  aria-expanded={newsOpen}
                  onClick={() => setNewsOpen((v) => !v)}
                >
                  NEWS
                  <span className="text-xs opacity-60" aria-hidden>
                    {newsOpen ? "▴" : "▾"}
                  </span>
                </button>
                {newsOpen && (
                  <ul className="border-t border-neutral-100 bg-neutral-50/80">
                    {newsChildren.map((item) => (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          className="block pl-10 pr-6 py-2.5 text-[13px] tracking-wide text-neutral-700 hover:text-neutral-950 hover:bg-neutral-100 transition-colors"
                          onClick={closeMobile}
                        >
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
              <li>
                <Link
                  href="/apply"
                  className="block px-6 py-3 text-sm uppercase tracking-[0.2em] text-neutral-800 hover:text-neutral-950 hover:bg-neutral-100 transition-colors font-medium"
                  onClick={closeMobile}
                >
                  APPLY
                </Link>
              </li>
              <li>
                <Link
                  href="/inquiry"
                  className="block px-6 py-3 text-sm uppercase tracking-[0.2em] text-neutral-800 hover:text-neutral-950 hover:bg-neutral-100 transition-colors font-medium"
                  onClick={closeMobile}
                >
                  CONTACT
                </Link>
              </li>
            </ul>
          </div>
        </div>
      )}
    </>
  );
}
