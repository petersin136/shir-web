// components/Footer.tsx — SHIRBAND_FOOTER_PC 기준 레이아웃 + 기존 개인정보 모달·/manage 연동
"use client";

import Link from "next/link";
import { useCallback, useState } from "react";
import { IBM_Plex_Mono } from "next/font/google";
import LiveIndicator from "@/components/LiveIndicator";
import { PrivacyPolicyModal } from "@/components/PrivacyPolicyModal";

const footerNavFont = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-footer-nav",
  display: "swap",
});

const navLinkClass =
  "text-white transition-opacity hover:opacity-75 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white/80";

const externalLinkProps = {
  target: "_blank" as const,
  rel: "noopener noreferrer" as const,
};

/** 관리자 링크 — 열쇠 대신 미니멀 자물쇠(스트로크만, 텍스트 없음) */
function AdminAccessIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      stroke="currentColor"
      strokeWidth="1.35"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect x="5.5" y="10.75" width="13" height="10.25" rx="1.75" />
      <path d="M8.25 10.75V7.25a3.75 3.75 0 0 1 7.5 0v3.5" />
    </svg>
  );
}

export default function Footer() {
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

  const closePrivacy = useCallback(() => setShowPrivacyModal(false), []);

  return (
    <>
      <footer className={`bg-black text-white ${footerNavFont.variable}`}>
        <div className="mx-auto w-full max-w-[1920px] px-4 pb-7 pt-7 sm:px-8 sm:pb-9 sm:pt-8 md:px-14 md:pb-14 md:pt-12 lg:pl-24 lg:pr-20">
          <nav
            className="footer-nav-menu flex flex-wrap items-baseline uppercase leading-none"
            aria-label="푸터 링크"
          >
            <button
              type="button"
              onClick={() => setShowPrivacyModal(true)}
              className={`${navLinkClass} border-0 bg-transparent p-0 text-left uppercase`}
            >
              Privacy Policy
            </button>
            <Link href="/terms-and-conditions" className={navLinkClass}>
              Terms and Conditions
            </Link>
            <a
                href="https://www.youtube.com/@SHIRBAND"
                className={navLinkClass}
                {...externalLinkProps}
              >
                YouTube
              </a>
              <a
                href="https://www.instagram.com/shirband.official"
                className={navLinkClass}
                {...externalLinkProps}
              >
                Instagram
              </a>
              <a
                href="https://www.facebook.com/"
                className={navLinkClass}
                {...externalLinkProps}
                aria-label="Facebook (공식 페이지 연결 예정)"
              >
                Facebook
            </a>
          </nav>

          <p className="mt-3 max-w-4xl text-[10px] font-normal leading-relaxed text-white/90 sm:mt-4 sm:text-[11px] md:mt-5 md:text-[13px] md:leading-[1.65]">
            쉬르밴드 | 이메일: shirband2025@gmail.com | 등록번호: 000-00-0000
          </p>

          <div className="mt-2 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 md:mt-2 md:gap-x-6 md:gap-y-2">
            <p className="footer-copyright min-w-0 flex-1 uppercase text-white">
              <span className="footer-copyright-symbol">©</span> 2026 SHIRBAND. ALL RIGHTS RESERVED
            </p>
            <div className="flex w-full shrink-0 flex-wrap items-center justify-end gap-x-3 gap-y-1.5 sm:w-auto sm:gap-x-4 md:gap-x-5">
              <Link
                href="/manage"
                prefetch={false}
                aria-label="관리자 페이지"
                title="관리자 페이지"
                className="inline-flex size-6 shrink-0 items-center justify-center rounded border border-white/18 text-white/50 transition-[color,background-color,border-color] duration-200 hover:border-white/45 hover:bg-white/[0.06] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white/70 md:size-9 md:rounded-md md:border-white/20 md:text-white/55"
              >
                <AdminAccessIcon className="size-[10px] md:size-4" />
              </Link>
              <LiveIndicator variant="onDark" className="opacity-95" />
            </div>
          </div>
        </div>
      </footer>

      <PrivacyPolicyModal
        open={showPrivacyModal}
        onClose={closePrivacy}
        showFullPageLink
        titleId="footer-privacy-title"
      />
    </>
  );
}
