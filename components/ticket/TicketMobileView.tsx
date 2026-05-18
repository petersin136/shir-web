"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  TicketEventSummary,
  TicketPrivacyConsent,
} from "@/components/ticket/ticket-flow-ui";
import {
  TICKET_BANK,
  TICKET_CONTACT_EMAIL,
  formatRefundDeadlineMobile,
  getMobileTicketFormTitle,
  getTicketStep1Title,
  ticketBankCopyText,
  type TicketEvent,
  type TicketPricing,
  type TicketEventId,
} from "@/lib/ticket-events";
import { cn } from "@/lib/utils";

type FormState = {
  name: string;
  phone: string;
  church: string;
  quantity: number;
};

function formatKrw(amount: number) {
  return `${amount.toLocaleString("ko-KR")}원`;
}

function formatPhone(value: string) {
  const v = value.replace(/[^0-9]/g, "");
  if (v.length <= 3) return v;
  if (v.length <= 7) return `${v.slice(0, 3)}-${v.slice(3)}`;
  return `${v.slice(0, 3)}-${v.slice(3, 7)}-${v.slice(7, 11)}`;
}

function MobileFixedCTA({
  label,
  onClick,
  disabled,
  variant,
  type = "button",
}: {
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  variant: "black" | "red";
  type?: "button" | "submit";
}) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden pb-[env(safe-area-inset-bottom)]">
      <button
        type={type}
        onClick={onClick}
        disabled={disabled}
        className={cn(
          "ticket-mobile-cta w-full py-4 text-[15px] font-medium tracking-[0.06em]",
          variant === "red" && "ticket-mobile-cta-red",
          disabled && "cursor-not-allowed",
        )}
      >
        {label}
      </button>
    </div>
  );
}

function MobilePoster({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="w-full">
      <Image
        src={src}
        alt={alt}
        width={900}
        height={1200}
        className="block w-full h-auto"
        priority
        sizes="100vw"
      />
    </div>
  );
}

const mobileFormInputClass =
  "ticket-mobile-form-value w-full min-w-0 border-0 bg-transparent text-left focus:outline-none";

const mobileFormSelectClass =
  "ticket-mobile-form-value w-full min-w-0 border-0 bg-transparent text-left focus:outline-none cursor-pointer appearance-none pr-5";

function useScrollEndCta(active: boolean) {
  const [atEnd, setAtEnd] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!active) {
      setAtEnd(false);
      return;
    }

    const el = sentinelRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => setAtEnd(entry.isIntersecting),
      {
        threshold: 0,
        rootMargin: "0px 0px -76px 0px",
      },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [active]);

  return { atEnd, sentinelRef };
}

function MobileTicketStep2Notices({ event }: { event: TicketEvent }) {
  const refundUntil = formatRefundDeadlineMobile(event.refundDeadlineLabel);

  return (
    <ul className="ticket-mobile-notices mt-4 w-full list-none p-0">
      <li>
        <p className="m-0">- 계좌 입금 후 신청이 확정됩니다.</p>
        <p className="notice-line-indent m-0">
          입금자명은 신청 시 입력하신 신청자 본인 이름과 동일하게
        </p>
        <p className="notice-line-indent m-0">입금해 주세요.</p>
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
          - 해당 기한 이후에는 취소 · 환불이 어려우니 신청 전에 일정을
        </p>
        <p className="notice-line-indent m-0">확인해 주세요.</p>
      </li>
      <li>
        <p className="m-0">
          - 입금이 확인되면 정식 예약이 확정되며, 문자로 안내드립니다.
        </p>
      </li>
    </ul>
  );
}

function MobileFormRow({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div className="ticket-mobile-form-row flex items-center gap-3 py-2.5">
      <label htmlFor={htmlFor} className="w-[6rem] shrink-0 leading-tight">
        {label}
      </label>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}

function MobileTicketQtySelect({
  value,
  unitPrice,
  onChange,
}: {
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
        id="m-ticket-qty"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
        className={cn(
          mobileFormSelectClass,
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
          aria-labelledby="m-ticket-qty"
          className="absolute left-0 top-[calc(100%+2px)] z-[100] w-full overflow-hidden rounded-sm border border-neutral-300 bg-white shadow-[0_4px_16px_rgba(0,0,0,0.12)]"
        >
          {[1, 2, 3, 4, 5].map((n) => {
            const selected = n === value;
            return (
              <li key={n} role="option" aria-selected={selected}>
                <button
                  type="button"
                  className={cn(
                    "flex w-full items-center gap-2 px-3 py-2.5 text-left text-[13px] font-medium",
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

function MobileTicketCopyAccountButton({
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
      className="ticket-mobile-copy-btn mt-2 block w-[8.75rem] py-2 text-center text-[12px] font-medium tracking-[0.02em]"
    >
      {copied ? "복사 완료" : "계좌 복사하기"}
    </button>
  );
}

function MobileStep3DualNav({
  onBack,
  onComplete,
  loading,
  accountCopied,
}: {
  onBack: () => void;
  onComplete: () => void;
  loading: boolean;
  accountCopied: boolean;
}) {
  const [pressed, setPressed] = useState<"prev" | "next" | null>(null);

  const clearPress = () => setPressed(null);

  const prevDark = pressed === "prev";
  const nextEnabled = !loading;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 grid grid-cols-2 md:hidden pb-[env(safe-area-inset-bottom)]">
      <button
        type="button"
        onClick={onBack}
        onPointerDown={() => setPressed("prev")}
        onPointerUp={clearPress}
        onPointerLeave={clearPress}
        onPointerCancel={clearPress}
        className={cn(
          "ticket-mobile-cta py-4 text-[15px] font-medium tracking-[0.04em]",
          prevDark ? "ticket-mobile-cta-muted-dark" : "ticket-mobile-cta-muted",
        )}
      >
        이전
      </button>
      <button
        type="button"
        onClick={onComplete}
        disabled={!nextEnabled}
        onPointerDown={() => nextEnabled && setPressed("next")}
        onPointerUp={clearPress}
        onPointerLeave={clearPress}
        onPointerCancel={clearPress}
        className={cn(
          "ticket-mobile-cta py-4 text-[15px] font-medium tracking-[0.04em]",
          accountCopied ? "ticket-mobile-cta-red" : "ticket-mobile-cta",
          loading && "cursor-not-allowed",
        )}
      >
        {loading ? "접수 중…" : "예매 신청하기"}
      </button>
    </div>
  );
}

function MobileStep2DualNav({
  onBack,
  onNext,
  loading,
  privacyAgreed,
}: {
  onBack: () => void;
  onNext: () => void;
  loading: boolean;
  privacyAgreed: boolean;
}) {
  const [pressed, setPressed] = useState<"prev" | "next" | null>(null);

  const clearPress = () => setPressed(null);

  const prevDark = pressed === "prev";
  const nextEnabled = privacyAgreed && !loading;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 grid grid-cols-2 md:hidden pb-[env(safe-area-inset-bottom)]">
      <button
        type="button"
        onClick={onBack}
        onPointerDown={() => setPressed("prev")}
        onPointerUp={clearPress}
        onPointerLeave={clearPress}
        onPointerCancel={clearPress}
        className={cn(
          "ticket-mobile-cta py-4 text-[15px] font-medium tracking-[0.04em]",
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
          "ticket-mobile-cta py-4 text-[15px] font-medium tracking-[0.04em]",
          privacyAgreed && "ticket-mobile-cta-red",
          !privacyAgreed && "ticket-mobile-cta-next-idle",
          loading && "cursor-not-allowed",
        )}
      >
        {loading ? "접수 중…" : "다음"}
      </button>
    </div>
  );
}

function TicketMobileStep2({
  event,
  pricing,
  form,
  privacyAgreed,
  loading,
  error,
  onFormChange,
  onPrivacyChange,
  onBack,
  onNext,
}: {
  event: TicketEvent;
  pricing: TicketPricing;
  form: FormState;
  privacyAgreed: boolean;
  loading: boolean;
  error: string | null;
  onFormChange: (next: FormState) => void;
  onPrivacyChange: (v: boolean) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  return (
    <div className="md:hidden relative z-10 w-full bg-white pb-[3.25rem]">
      <div className="px-5 pt-5">
        <h1 className="ticket-mobile-headline">TICKET</h1>

        <MobileTicketStep2Notices event={event} />

        <section className="ticket-mobile-form-section mt-5 border-t border-neutral-300">
          <h2 className="ticket-mobile-subhead border-b border-neutral-300 py-2.5">
            {getMobileTicketFormTitle(event)}
          </h2>

          <div className="ticket-mobile-form-fields border-b border-neutral-300">
          <MobileFormRow label="이름" htmlFor="m-ticket-name">
            <input
              id="m-ticket-name"
              type="text"
              required
              value={form.name}
              onChange={(e) => onFormChange({ ...form, name: e.target.value })}
              placeholder="홍길동"
              className={mobileFormInputClass}
            />
          </MobileFormRow>

          <MobileFormRow label="휴대폰 번호" htmlFor="m-ticket-phone">
            <input
              id="m-ticket-phone"
              type="tel"
              required
              maxLength={13}
              value={form.phone}
              onChange={(e) =>
                onFormChange({ ...form, phone: formatPhone(e.target.value) })
              }
              placeholder="010-1234-5678"
              className={mobileFormInputClass}
            />
          </MobileFormRow>

          <MobileFormRow label="소속 교회" htmlFor="m-ticket-church">
            <input
              id="m-ticket-church"
              type="text"
              required
              value={form.church}
              onChange={(e) => onFormChange({ ...form, church: e.target.value })}
              placeholder="OO교회"
              className={mobileFormInputClass}
            />
          </MobileFormRow>

          <MobileFormRow label="티켓 매수" htmlFor="m-ticket-qty">
            <MobileTicketQtySelect
              value={form.quantity}
              unitPrice={pricing.unitPrice}
              onChange={(quantity) => onFormChange({ ...form, quantity })}
            />
          </MobileFormRow>
          </div>
        </section>

        <TicketPrivacyConsent agreed={privacyAgreed} onChange={onPrivacyChange} />

        {error && (
          <p className="mt-4 text-[13px] text-red-600 font-light">{error}</p>
        )}
      </div>

      <MobileStep2DualNav
        onBack={onBack}
        onNext={onNext}
        loading={loading}
        privacyAgreed={privacyAgreed}
      />
    </div>
  );
}

function TicketMobileStep3({
  event,
  pricing,
  form,
  loading,
  error,
  onBack,
  onComplete,
}: {
  event: TicketEvent;
  pricing: TicketPricing;
  form: FormState;
  loading: boolean;
  error: string | null;
  onBack: () => void;
  onComplete: () => void;
}) {
  const [accountCopied, setAccountCopied] = useState(false);
  const depositAmount = pricing.unitPrice * form.quantity;

  return (
    <div className="md:hidden relative z-10 w-full bg-white pb-[3.25rem]">
      <div className="px-5 pt-5">
        <h1 className="ticket-mobile-headline">TICKET</h1>

        <MobileTicketStep2Notices event={event} />

        <section className="ticket-mobile-form-section mt-5 border-t border-neutral-300">
          <h2 className="ticket-mobile-subhead border-b border-neutral-300 py-2.5">
            {getMobileTicketFormTitle(event)}
          </h2>

          <div className="ticket-mobile-form-fields border-b border-neutral-300">
            <div className="ticket-mobile-form-row flex items-start gap-3 py-2.5">
              <span className="ticket-mobile-form-label w-[6rem] shrink-0 pt-0.5 text-left font-light leading-tight text-neutral-500">
                입금 계좌
              </span>
              <div className="flex min-w-0 flex-1 flex-col items-start">
                <p className="ticket-mobile-form-value m-0 font-medium text-neutral-900">
                  {TICKET_BANK.bankName}
                </p>
                <p className="ticket-mobile-account-number m-0 mt-0.5 tabular-nums">
                  {TICKET_BANK.accountNumber}
                </p>
                <p className="ticket-mobile-form-value m-0 mt-0.5 font-medium text-neutral-900">
                  예금주: {TICKET_BANK.manager}
                </p>
                <MobileTicketCopyAccountButton onCopied={() => setAccountCopied(true)} />
              </div>
            </div>

            <MobileFormRow label="입금 금액" htmlFor="m-ticket-deposit-amount">
              <p
                id="m-ticket-deposit-amount"
                className="ticket-mobile-form-value m-0 font-medium text-neutral-900"
              >
                {form.quantity}매 / {formatKrw(depositAmount)}
              </p>
            </MobileFormRow>

            <MobileFormRow label="문의" htmlFor="m-ticket-inquiry">
              <p
                id="m-ticket-inquiry"
                className="ticket-mobile-form-value m-0 break-all font-medium text-neutral-900"
              >
                {TICKET_CONTACT_EMAIL}
              </p>
            </MobileFormRow>
          </div>
        </section>

        {error && (
          <p className="mt-4 text-[13px] text-red-600 font-light">{error}</p>
        )}
      </div>

      <MobileStep3DualNav
        onBack={onBack}
        onComplete={onComplete}
        loading={loading}
        accountCopied={accountCopied}
      />
    </div>
  );
}

function TicketMobileStep4({
  event,
  orderId,
  onReset,
}: {
  event: TicketEvent;
  orderId: string;
  onReset: () => void;
}) {
  return (
    <div className="md:hidden relative z-10 w-full bg-white pb-[3.25rem]">
      <div className="px-5 pt-5 pb-6">
        <h1 className="ticket-mobile-headline">TICKET</h1>

        <div className="mt-4">
          <p className="ticket-mobile-step4-title m-0 leading-snug">
            신청 정보가 접수되었습니다.
          </p>
          <p className="ticket-mobile-step4-body m-0 mt-3">
            아직 예약이 확정된 상태는 아닙니다.
          </p>
          <p className="ticket-mobile-step4-body m-0">
            {event.name} 참가를 위해 안내드린 계좌로
          </p>
          <p className="ticket-mobile-step4-body m-0">
            입금해 주시면, 입금 확인 후 정식 예약 확정 안내를
          </p>
          <p className="ticket-mobile-step4-body m-0">
            문자로 보내 드립니다.
          </p>
        </div>

        <h2 className="ticket-mobile-subhead mt-8">{getMobileTicketFormTitle(event)}</h2>

        {orderId && (
          <div className="ticket-mobile-form-row flex items-center gap-3 border-t border-b border-neutral-300 py-2.5">
            <span className="ticket-mobile-form-label w-[6rem] shrink-0 text-left font-medium leading-tight text-neutral-900">
              신청번호
            </span>
            <span className="ticket-mobile-order-id min-w-0 tabular-nums tracking-wide">
              {orderId}
            </span>
          </div>
        )}

        <ul className="ticket-mobile-notices mt-4 w-full list-none p-0">
          <li>
            <p className="m-0">- 입금 확인까지 1~2일이 소요될 수 있습니다.</p>
          </li>
          <li>
            <p className="m-0">- 입금 확인 문자를 받기 전까지는 예약이 확정되지 않습니다.</p>
          </li>
          <li>
            <p className="m-0">
              - 입금 후에도 안내 문자가 없으면{" "}
              <Link
                href="/inquiry"
                className="ticket-mobile-inquiry-link underline underline-offset-2"
              >
                Inquiry
              </Link>
              로 문의해 주세요.
            </p>
          </li>
        </ul>
      </div>

      <MobileFixedCTA label="처음으로" variant="black" onClick={onReset} />
    </div>
  );
}

export type TicketMobileViewProps = {
  step: number;
  event: TicketEvent | undefined;
  pricing: TicketPricing | null;
  eventId: TicketEventId;
  form: FormState;
  privacyAgreed: boolean;
  loading: boolean;
  error: string | null;
  orderId: string;
  totalAmount: number;
  onEventChange: (id: TicketEventId) => void;
  onFormChange: (next: FormState) => void;
  onPrivacyChange: (v: boolean) => void;
  onStep1Next: () => void;
  onStep2Back: () => void;
  onStep2Next: () => void;
  onStep3Back: () => void;
  onStep3Complete: () => void;
  onReset: () => void;
};

export function TicketMobileView({
  step,
  event,
  pricing,
  form,
  privacyAgreed,
  loading,
  error,
  orderId,
  totalAmount,
  onFormChange,
  onPrivacyChange,
  onStep1Next,
  onStep2Back,
  onStep2Next,
  onStep3Back,
  onStep3Complete,
  onReset,
}: TicketMobileViewProps) {
  const scrollCtaActive = step === 1;
  const { atEnd: scrolledToEnd, sentinelRef } = useScrollEndCta(scrollCtaActive);

  if (step === 2 && event && pricing) {
    return (
      <TicketMobileStep2
        event={event}
        pricing={pricing}
        form={form}
        privacyAgreed={privacyAgreed}
        loading={loading}
        error={error}
        onFormChange={onFormChange}
        onPrivacyChange={onPrivacyChange}
        onBack={onStep2Back}
        onNext={onStep2Next}
      />
    );
  }

  if (step === 3 && event && pricing) {
    return (
      <TicketMobileStep3
        event={event}
        pricing={pricing}
        form={form}
        loading={loading}
        error={error}
        onBack={onStep3Back}
        onComplete={onStep3Complete}
      />
    );
  }

  if (step === 4 && event) {
    return (
      <TicketMobileStep4 event={event} orderId={orderId} onReset={onReset} />
    );
  }

  const showSummary = step === 1 && event && pricing;
  const ctaVariant: "black" | "red" = scrolledToEnd ? "red" : "black";

  return (
    <div className="md:hidden pb-[4.5rem] bg-white">
      {step === 1 && event?.posterUrl && (
        <MobilePoster src={event.posterUrl} alt={`${event.name} 포스터`} />
      )}

      <div className="px-5">
        {showSummary && (
          <>
            <h2 className="mt-5 mb-3 text-[20px] font-extrabold leading-snug tracking-tight text-neutral-900 uppercase">
              {getTicketStep1Title(event)}
            </h2>
            <TicketEventSummary event={event} pricing={pricing} />
          </>
        )}


        {error && (
          <p className="mt-4 text-[14px] text-red-600 font-light">{error}</p>
        )}

        {scrollCtaActive && (
          <div ref={sentinelRef} className="h-px w-full" aria-hidden />
        )}
      </div>

      {step === 1 && (
        <MobileFixedCTA
          label="신청하기"
          variant={ctaVariant}
          onClick={onStep1Next}
          disabled={!event?.registrationOpen}
        />
      )}
    </div>
  );
}
