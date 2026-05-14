// components/Footer.tsx — SHIRBAND_FOOTER_PC 기준 레이아웃 + 기존 개인정보 모달·/manage 연동
"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { Space_Mono } from "next/font/google";

const footerNav = Space_Mono({
  subsets: ["latin"],
  weight: "700",
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

  useEffect(() => {
    if (!showPrivacyModal) return;
    const onKey = (ev: KeyboardEvent) => {
      if (ev.key === "Escape") closePrivacy();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [showPrivacyModal, closePrivacy]);

  return (
    <>
      <footer className="bg-black text-white">
        <div className="mx-auto w-full max-w-[1920px] px-6 pb-10 pt-10 sm:px-10 sm:pb-12 sm:pt-11 md:px-14 md:pb-14 md:pt-12 lg:pl-24 lg:pr-20">
          <nav
            className={`${footerNav.className} flex flex-wrap items-baseline gap-x-7 gap-y-3 text-[17px] uppercase leading-none tracking-[0.14em] sm:gap-x-10 sm:text-[18px] md:gap-x-12 md:text-[19px]`}
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

          <p className="mt-4 max-w-4xl text-[12px] font-normal leading-[1.65] text-white sm:mt-5 sm:text-[13px] md:mt-5 md:text-[13px]">
            쉬르밴드 | 이메일: shirband2025@gmail.com | 주소: 경기도 포천시 중앙로105번길 23-2 |
            등록번호: 000-00-0000
          </p>

          <div className="mt-2 flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
            <p className="min-w-0 flex-1 text-[12px] font-normal uppercase tracking-[0.18em] text-white sm:text-[13px]">
              © 2026 SHIRBAND. ALL RIGHTS RESERVED
            </p>
            <Link
              href="/manage"
              prefetch={false}
              aria-label="관리자 페이지"
              title="관리자 페이지"
              className="inline-flex size-8 shrink-0 items-center justify-center rounded-md border border-white/20 text-white/55 transition-[color,background-color,border-color] duration-200 hover:border-white/45 hover:bg-white/[0.06] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white/70 sm:size-9"
            >
              <AdminAccessIcon className="size-[15px] sm:size-4" />
            </Link>
          </div>
        </div>
      </footer>

      {/* 기존과 동일: 푸터에서 개인정보 처리방침 오버레이 (고정 헤더보다 위) */}
      {showPrivacyModal && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="footer-privacy-title"
        >
          <div className="max-h-[80vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white">
            <div className="p-6">
              <div className="mb-4 flex items-center justify-between gap-4">
                <h2
                  id="footer-privacy-title"
                  className="text-xl font-bold text-gray-900"
                >
                  개인정보 처리방침
                </h2>
                <button
                  type="button"
                  onClick={closePrivacy}
                  className="shrink-0 text-gray-500 hover:text-gray-700"
                  aria-label="닫기"
                >
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="space-y-4 text-sm text-gray-700">
                <div>
                  <h3 className="mb-2 font-semibold text-gray-900">
                    1. 개인정보의 수집 및 이용 목적
                  </h3>
                  <p>SHIR BAND는 다음의 목적을 위하여 개인정보를 처리합니다:</p>
                  <ul className="mt-2 list-inside list-disc space-y-1">
                    <li>사역 참가 신청 및 관리</li>
                    <li>컨퍼런스 및 예배 참석자 관리</li>
                    <li>사역 관련 공지사항 전달</li>
                    <li>문의사항 응답 및 상담</li>
                  </ul>
                </div>

                <div>
                  <h3 className="mb-2 font-semibold text-gray-900">
                    2. 수집하는 개인정보 항목
                  </h3>
                  <ul className="list-inside list-disc space-y-1">
                    <li>필수항목: 성명, 연락처(전화번호), 이메일 주소</li>
                    <li>선택항목: 소속교회, 참가 동기, 기타 문의사항</li>
                  </ul>
                </div>

                <div>
                  <h3 className="mb-2 font-semibold text-gray-900">
                    3. 개인정보의 보유 및 이용기간
                  </h3>
                  <p>
                    수집된 개인정보는 목적 달성 후 지체없이 파기하며, 관련 법령에 따라 보존이
                    필요한 경우에는 해당 기간 동안 보관합니다.
                  </p>
                </div>

                <div>
                  <h3 className="mb-2 font-semibold text-gray-900">
                    4. 개인정보의 제3자 제공
                  </h3>
                  <p>
                    SHIR BAND는 이용자의 개인정보를 원칙적으로 외부에 제공하지 않습니다. 다만,
                    법령의 규정에 의거하거나 수사 목적으로 법령에 정해진 절차와 방법에 따라 수사기관의
                    요구가 있는 경우에는 제공할 수 있습니다.
                  </p>
                </div>

                <div>
                  <h3 className="mb-2 font-semibold text-gray-900">
                    5. 개인정보 처리의 위탁
                  </h3>
                  <p>SHIR BAND는 개인정보 처리업무를 외부에 위탁하지 않습니다.</p>
                </div>

                <div>
                  <h3 className="mb-2 font-semibold text-gray-900">
                    6. 정보주체의 권리
                  </h3>
                  <p>
                    정보주체는 언제든지 개인정보 처리현황에 대한 열람, 정정·삭제, 처리정지를 요구할
                    수 있으며, 요구사항은 shirband2025@gmail.com으로 연락주시기 바랍니다.
                  </p>
                </div>

                <div>
                  <h3 className="mb-2 font-semibold text-gray-900">
                    7. 개인정보 보호책임자
                  </h3>
                  <div className="rounded bg-gray-50 p-3">
                    <p>
                      <strong>개인정보 보호책임자:</strong> SHIR BAND 대표
                    </p>
                    <p>
                      <strong>연락처:</strong> shirband2025@gmail.com
                    </p>
                  </div>
                </div>

                <div>
                  <p className="mt-4 text-xs text-gray-500">
                    본 개인정보 처리방침은 2025년 1월 1일부터 적용됩니다.
                  </p>
                </div>
              </div>

              <p className="mt-6 border-t border-gray-100 pt-4 text-center text-xs text-gray-500">
                <Link
                  href="/privacy-policy"
                  onClick={closePrivacy}
                  className="text-gray-700 underline underline-offset-2 hover:text-gray-900"
                >
                  전체 페이지에서 보기
                </Link>
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
