"use client";

import { useEffect, useRef, useState } from "react";
import { PrivacyPolicyModal } from "@/components/PrivacyPolicyModal";
import { POCHEON_CENTRAL_BAPTIST_VENUE } from "@/lib/pocheon-venue";
import {
  TICKET_BANK,
  TICKET_CONTACT_EMAIL,
  formatEarlyBirdPeriodMobileLines,
  formatRefundDeadlineMobile,
  getMobileCurrentFeeDisplay,
  getMobileTicketFormTitle,
  getTicketStep1Title,
  ticketBankCopyText,
  type TicketEvent,
  type TicketPricing,
} from "@/lib/ticket-events";
import { cn } from "@/lib/utils";

const summaryLabelClass =
  "text-left text-[12px] text-neutral-500 font-light leading-none pt-0.5 shrink-0 whitespace-nowrap md:text-[13px]";

const summaryValueClass =
  "text-left text-[14px] leading-[1.45] text-neutral-900 font-normal md:text-[15px]";

export function formatKrw(amount: number) {
  return `${amount.toLocaleString("ko-KR")}원`;
}

export function formatPhone(value: string) {
  const v = value.replace(/[^0-9]/g, "");
  if (v.length <= 3) return v;
  if (v.length <= 7) return `${v.slice(0, 3)}-${v.slice(3)}`;
  return `${v.slice(0, 3)}-${v.slice(3, 7)}-${v.slice(7, 11)}`;
}

export const ticketFormInputClass =
  "ticket-mobile-form-value w-full min-w-0 border-0 bg-transparent text-left focus:outline-none";

export const ticketFormSelectClass =
  "ticket-mobile-form-value w-full min-w-0 border-0 bg-transparent text-left focus:outline-none cursor-pointer appearance-none pr-5";

export function TicketHeadline() {
  return <h1 className="ticket-mobile-headline">TICKET</h1>;
}

export function TicketEventSummary({
  event,
  pricing,
}: {
  event: TicketEvent;
  pricing: TicketPricing;
}) {
  const fee = getMobileCurrentFeeDisplay(event, pricing);
  const earlyBirdLines = event.earlyBird
    ? formatEarlyBirdPeriodMobileLines(event.earlyBird.start, event.earlyBird.end)
    : null;

  const rows: {
    label: string;
    content: React.ReactNode;
    /** 모바일 — 라벨 위·값 아래(전체 너비) */
    stackOnMobile?: boolean;
  }[] = [
    {
      label: "일시",
      stackOnMobile: true,
      content: (
        <div className={cn(summaryValueClass, "space-y-0.5")}>
          <p className="whitespace-nowrap">{event.date}</p>
          {event.dateNote && (
            <p className="text-[12px] text-neutral-600 md:text-[13px]">{event.dateNote}</p>
          )}
        </div>
      ),
    },
    {
      label: "장소",
      content: (
        <div className={cn(summaryValueClass, "space-y-0.5")}>
          <p>{event.venue}</p>
          {event.showPocheonVenueGuide && (
            <p className="text-[12px] text-neutral-600 leading-relaxed md:text-[13px]">
              {POCHEON_CENTRAL_BAPTIST_VENUE.address}
            </p>
          )}
        </div>
      ),
    },
    {
      label: "참가비",
      content: (
        <div className={cn(summaryValueClass, "space-y-0.5")}>
          <p>성인 {formatKrw(event.regularPrice)} / 1매</p>
          {event.studentPrice != null && (
            <p>초·중·고 {formatKrw(event.studentPrice)} / 1매</p>
          )}
        </div>
      ),
    },
    {
      label: "현재 요금",
      content: (
        <div className={cn(summaryValueClass, "space-y-0.5")}>
          <p>{fee.tier}</p>
          {fee.price && <p>{fee.price}</p>}
        </div>
      ),
    },
    ...(earlyBirdLines
      ? [
          {
            label: "얼리버드 예매 기간",
            stackOnMobile: true,
            content: (
              <div className={cn(summaryValueClass, "space-y-0.5")}>
                <p className="ticket-early-bird-period-line whitespace-nowrap">
                  {earlyBirdLines.startLine}
                </p>
                <p className="ticket-early-bird-period-line whitespace-nowrap">
                  {earlyBirdLines.endLine}
                </p>
              </div>
            ),
          },
        ]
      : []),
    {
      label: "입금계좌",
      content: (
        <div className={cn(summaryValueClass, "space-y-0.5")}>
          <p className="tabular-nums">
            {TICKET_BANK.bankName} {TICKET_BANK.accountNumber}
          </p>
          <p>예금주 {TICKET_BANK.manager}</p>
        </div>
      ),
    },
  ];

  return (
    <dl className="border-t border-neutral-300">
      {rows.map((row) => (
        <div
          key={row.label}
          className={cn(
            "ticket-event-summary-row grid items-start gap-y-1 border-b border-neutral-300 py-3 md:py-3.5",
            row.stackOnMobile
              ? "grid-cols-1 gap-x-0 md:grid-cols-[6.75rem_1fr] md:gap-x-4"
              : "grid-cols-[6.75rem_1fr] gap-x-3 md:gap-x-4",
          )}
        >
          <dt className={summaryLabelClass}>{row.label}</dt>
          <dd className="ticket-event-summary-value min-w-0 text-left">
            {row.content}
          </dd>
        </div>
      ))}
    </dl>
  );
}

/** 1단계 신청하기 — 기본 딥그레이, 호버·누름 시 레드 */
export function TicketStep1ApplyCta({
  label,
  onClick,
  disabled,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  const [active, setActive] = useState(false);
  const showRed = active && !disabled;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      onPointerDown={() => !disabled && setActive(true)}
      onPointerUp={() => setActive(false)}
      onPointerLeave={() => setActive(false)}
      onPointerCancel={() => setActive(false)}
      onMouseEnter={() => !disabled && setActive(true)}
      onMouseLeave={() => setActive(false)}
      className={cn(
        "ticket-mobile-cta ticket-desktop-step1-cta w-full py-4 text-[15px] font-medium tracking-[0.06em] md:py-[1.125rem] md:text-base",
        showRed && "ticket-mobile-cta-red",
        disabled && "cursor-not-allowed opacity-45",
      )}
    >
      {label}
    </button>
  );
}

export function TicketPaymentNotices({ event }: { event: TicketEvent }) {
  const refundUntil = formatRefundDeadlineMobile(event.refundDeadlineLabel);

  return (
    <ul className="ticket-mobile-notices mt-4 w-full list-none p-0">
      <li>
        <p className="m-0">- 계좌 입금 후 신청이 확정됩니다.</p>
        <p className="notice-line-indent m-0">
          입금자명은 신청 시 입력하신 신청자 본인 이름과 동일하게 입금해 주세요.
        </p>
      </li>
      <li>
        <p className="notice-nowrap m-0">
          - 신청 후, 3일 이내 미입금 시 자동 취소될 수 있으니 유의해 주세요.
        </p>
      </li>
      <li>
        <p className="m-0">- 입금 확인 후, 집회 시작 7일 전까지({refundUntil})</p>
        <p className="notice-line-indent m-0">
          신청 취소 및 전액 환불이 가능합니다.
        </p>
      </li>
      <li>
        <p className="m-0">
          - 해당 기한 이후에는 취소 · 환불이 어려우니 신청 전에 일정을 확인해 주세요.
        </p>
      </li>
      <li>
        <p className="m-0">
          - 입금이 확인되면 정식 예약이 확정되며, 문자로 안내드립니다.
        </p>
      </li>
    </ul>
  );
}

export function TicketFormRow({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div className="ticket-mobile-form-row flex items-center gap-3 py-2.5 md:gap-4 md:py-3">
      <label htmlFor={htmlFor} className="w-[6rem] shrink-0 leading-tight md:w-[6.5rem]">
        {label}
      </label>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}

export function TicketQtySelect({
  id,
  value,
  unitPrice,
  onChange,
}: {
  id: string;
  value: number;
  unitPrice: number;
  onChange: (quantity: number) => void;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const close = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node;
      if (rootRef.current && !rootRef.current.contains(target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", close);
    document.addEventListener("touchstart", close);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("touchstart", close);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative w-full min-w-0">
      <button
        type="button"
        id={id}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
        className={cn(
          ticketFormSelectClass,
          "flex w-full items-center justify-between gap-2 pr-1",
        )}
      >
        <span className="truncate">
          {value}매 / {formatKrw(unitPrice * value)}
        </span>
        <span className="shrink-0 text-[9px] text-neutral-900" aria-hidden>
          ▼
        </span>
      </button>

      {open && (
        <ul
          role="listbox"
          aria-labelledby={id}
          className="absolute left-0 top-[calc(100%+2px)] z-[100] w-full overflow-hidden rounded-sm border border-neutral-300 bg-white shadow-[0_4px_16px_rgba(0,0,0,0.12)]"
        >
          {[1, 2, 3, 4, 5].map((n) => {
            const selected = n === value;
            return (
              <li key={n} role="option" aria-selected={selected}>
                <button
                  type="button"
                  className={cn(
                    "flex w-full items-center gap-2 px-3 py-2.5 text-left font-medium",
                    selected
                      ? "ticket-mobile-qty-option-selected"
                      : "text-neutral-900 hover:bg-neutral-100",
                  )}
                  onClick={() => {
                    onChange(n);
                    setOpen(false);
                  }}
                >
                  {selected && (
                    <span className="text-[11px]" aria-hidden>
                      ✓
                    </span>
                  )}
                  <span>
                    {n}매 / {formatKrw(unitPrice * n)}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export function TicketCopyAccountButton({
  onCopied,
}: {
  onCopied: () => void;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(ticketBankCopyText());
      setCopied(true);
      onCopied();
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="ticket-mobile-copy-btn mt-2 block w-[8.75rem] py-2 text-center font-medium tracking-[0.02em] md:w-[9.5rem] md:py-2.5"
    >
      {copied ? "복사 완료" : "계좌 복사하기"}
    </button>
  );
}

function useDualNavPress() {
  const [pressed, setPressed] = useState<"prev" | "next" | null>(null);
  const clearPress = () => setPressed(null);
  return { pressed, setPressed, clearPress };
}

export function TicketDualNav({
  onBack,
  onNext,
  nextLabel,
  loading,
  nextEnabled,
  nextRed,
  fixed,
}: {
  onBack: () => void;
  onNext: () => void;
  nextLabel: string;
  loading?: boolean;
  nextEnabled: boolean;
  nextRed: boolean;
  fixed?: boolean;
}) {
  const { pressed, setPressed, clearPress } = useDualNavPress();
  const prevDark = pressed === "prev";

  return (
    <div
      className={cn(
        "grid grid-cols-2",
        fixed &&
          "fixed bottom-0 left-0 right-0 z-50 md:hidden pb-[env(safe-area-inset-bottom)]",
      )}
    >
      <button
        type="button"
        onClick={onBack}
        onPointerDown={() => setPressed("prev")}
        onPointerUp={clearPress}
        onPointerLeave={clearPress}
        onPointerCancel={clearPress}
        className={cn(
          "ticket-mobile-cta py-4 text-[15px] font-medium tracking-[0.04em] md:py-[1.125rem] md:text-base",
          prevDark ? "ticket-mobile-cta-muted-dark" : "ticket-mobile-cta-muted",
        )}
      >
        이전
      </button>
      <button
        type="button"
        onClick={onNext}
        disabled={!nextEnabled}
        onPointerDown={() => nextEnabled && setPressed("next")}
        onPointerUp={clearPress}
        onPointerLeave={clearPress}
        onPointerCancel={clearPress}
        className={cn(
          "ticket-mobile-cta py-4 text-[15px] font-medium tracking-[0.04em] md:py-[1.125rem] md:text-base",
          nextRed
            ? "ticket-mobile-cta-red"
            : nextEnabled
              ? "ticket-mobile-cta"
              : "ticket-mobile-cta-next-idle",
          !nextEnabled && "cursor-not-allowed",
          loading && "cursor-not-allowed",
        )}
      >
        {loading ? "접수 중…" : nextLabel}
      </button>
    </div>
  );
}

export function TicketSingleNav({
  label,
  onClick,
  fixed,
}: {
  label: string;
  onClick: () => void;
  fixed?: boolean;
}) {
  const [active, setActive] = useState(false);

  return (
    <div
      className={cn(
        fixed &&
          "fixed bottom-0 left-0 right-0 z-50 md:hidden pb-[env(safe-area-inset-bottom)]",
      )}
    >
      <button
        type="button"
        onClick={onClick}
        onPointerDown={() => setActive(true)}
        onPointerUp={() => setActive(false)}
        onPointerLeave={() => setActive(false)}
        onPointerCancel={() => setActive(false)}
        className={cn(
          "ticket-mobile-cta w-full py-4 text-[15px] font-medium tracking-[0.06em] md:py-[1.125rem] md:text-base",
          active && "ticket-mobile-cta-red",
        )}
      >
        {label}
      </button>
    </div>
  );
}

export function TicketEventSubhead({ event }: { event: TicketEvent }) {
  return (
    <h2 className="ticket-mobile-subhead border-b border-neutral-300 py-2.5 md:py-3">
      {getMobileTicketFormTitle(event)}
    </h2>
  );
}

export function TicketPrivacyConsent({
  agreed,
  onChange,
}: {
  agreed: boolean;
  onChange: (v: boolean) => void;
}) {
  const [privacyOpen, setPrivacyOpen] = useState(false);

  return (
    <>
      <div className="mt-4 flex items-start gap-2.5 md:mt-5 md:gap-3">
        <input
          id="ticket-privacy-consent"
          type="checkbox"
          checked={agreed}
          onChange={(e) => onChange(e.target.checked)}
          className="mt-0.5 h-3.5 w-3.5 shrink-0 cursor-pointer rounded-sm border border-neutral-500 bg-neutral-800 accent-neutral-900 md:h-4 md:w-4"
        />
        <label htmlFor="ticket-privacy-consent" className="min-w-0 cursor-pointer">
          <span className="ticket-mobile-privacy-title block leading-snug">
            개인정보 수집 및 이용에 동의합니다(필수)
          </span>
          <span className="ticket-mobile-privacy-sub mt-0.5 block leading-relaxed">
            <button
              type="button"
              className="ticket-privacy-policy-trigger underline underline-offset-2"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setPrivacyOpen(true);
              }}
            >
              개인정보 처리방침
            </button>
            에 따라 안전하게 관리됩니다.
          </span>
        </label>
      </div>

      <PrivacyPolicyModal
        open={privacyOpen}
        onClose={() => setPrivacyOpen(false)}
        titleId="ticket-privacy-policy-title"
      />
    </>
  );
}

export {
  TICKET_BANK,
  TICKET_CONTACT_EMAIL,
  getMobileTicketFormTitle,
  getTicketStep1Title,
};
