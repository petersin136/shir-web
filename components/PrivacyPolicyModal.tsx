"use client";

import Link from "next/link";
import { useEffect } from "react";
import { createPortal } from "react-dom";

function PrivacyPolicyBody() {
  return (
    <div className="space-y-5 text-[15px] leading-relaxed text-gray-700">
      <div>
        <h3 className="mb-2 text-base font-semibold text-gray-900">1. 개인정보의 수집 및 이용 목적</h3>
        <p>SHIR BAND는 다음의 목적을 위하여 개인정보를 처리합니다:</p>
        <ul className="mt-2 list-inside list-disc space-y-1">
          <li>사역 참가 신청 및 관리</li>
          <li>컨퍼런스 및 예배 참석자 관리</li>
          <li>사역 관련 공지사항 전달</li>
          <li>문의사항 응답 및 상담</li>
        </ul>
      </div>

      <div>
        <h3 className="mb-2 text-base font-semibold text-gray-900">2. 수집하는 개인정보 항목</h3>
        <ul className="list-inside list-disc space-y-1">
          <li>필수항목: 성명, 연락처(전화번호), 이메일 주소</li>
          <li>선택항목: 소속교회, 참가 동기, 기타 문의사항</li>
        </ul>
      </div>

      <div>
        <h3 className="mb-2 text-base font-semibold text-gray-900">3. 개인정보의 보유 및 이용기간</h3>
        <p>
          수집된 개인정보는 목적 달성 후 지체없이 파기하며, 관련 법령에 따라 보존이 필요한
          경우에는 해당 기간 동안 보관합니다.
        </p>
      </div>

      <div>
        <h3 className="mb-2 text-base font-semibold text-gray-900">4. 개인정보의 제3자 제공</h3>
        <p>
          SHIR BAND는 이용자의 개인정보를 원칙적으로 외부에 제공하지 않습니다. 다만, 법령의
          규정에 의거하거나 수사 목적으로 법령에 정해진 절차와 방법에 따라 수사기관의 요구가
          있는 경우에는 제공할 수 있습니다.
        </p>
      </div>

      <div>
        <h3 className="mb-2 text-base font-semibold text-gray-900">5. 개인정보 처리의 위탁</h3>
        <p>SHIR BAND는 개인정보 처리업무를 외부에 위탁하지 않습니다.</p>
      </div>

      <div>
        <h3 className="mb-2 text-base font-semibold text-gray-900">6. 정보주체의 권리</h3>
        <p>
          정보주체는 언제든지 개인정보 처리현황에 대한 열람, 정정·삭제, 처리정지를 요구할 수
          있으며, 요구사항은 shirband2025@gmail.com으로 연락주시기 바랍니다.
        </p>
      </div>

      <div>
        <h3 className="mb-2 text-base font-semibold text-gray-900">7. 개인정보 보호책임자</h3>
        <div className="rounded bg-gray-50 p-3">
          <p>
            <strong>개인정보 보호책임자:</strong> SHIR BAND 대표
          </p>
          <p>
            <strong>연락처:</strong> shirband2025@gmail.com
          </p>
        </div>
      </div>

      <p className="text-sm text-gray-500">본 개인정보 처리방침은 2025년 1월 1일부터 적용됩니다.</p>
    </div>
  );
}

export type PrivacyPolicyModalProps = {
  open: boolean;
  onClose: () => void;
  showFullPageLink?: boolean;
  titleId?: string;
};

export function PrivacyPolicyModal({
  open,
  onClose,
  showFullPageLink = false,
  titleId = "privacy-policy-modal-title",
}: PrivacyPolicyModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (ev: KeyboardEvent) => {
      if (ev.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      onClick={onClose}
    >
      <div
        className="max-h-[80vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="mb-4 flex items-center justify-between gap-4">
            <h2 id={titleId} className="text-2xl font-bold text-gray-900">
              개인정보 처리방침
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="shrink-0 text-gray-500 hover:text-gray-700"
              aria-label="닫기"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <PrivacyPolicyBody />

          {showFullPageLink && (
            <p className="mt-6 border-t border-gray-100 pt-4 text-center text-sm text-gray-500">
              <Link
                href="/privacy-policy"
                onClick={onClose}
                className="text-gray-700 underline underline-offset-2 hover:text-gray-900"
              >
                전체 페이지에서 보기
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}
