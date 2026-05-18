"use client";

import Link from "next/link";
import { useState } from "react";
import type { TicketEvent, TicketPricing } from "@/lib/ticket-events";
import {
  TICKET_BANK,
  TICKET_CONTACT_EMAIL,
  TicketCopyAccountButton,
  TicketDualNav,
  TicketEventSubhead,
  TicketFormRow,
  TicketHeadline,
  TicketPaymentNotices,
  TicketPrivacyConsent,
  TicketQtySelect,
  TicketSingleNav,
  formatKrw,
  formatPhone,
  ticketFormInputClass,
} from "@/components/ticket/ticket-flow-ui";

export type TicketDesktopFormState = {
  name: string;
  phone: string;
  church: string;
  quantity: number;
};

export type TicketDesktopViewProps = {
  step: number;
  event: TicketEvent;
  pricing: TicketPricing;
  form: TicketDesktopFormState;
  privacyAgreed: boolean;
  loading: boolean;
  error: string | null;
  orderId: string;
  onFormChange: (next: TicketDesktopFormState) => void;
  onPrivacyChange: (v: boolean) => void;
  onStep2Back: () => void;
  onStep2Next: () => void;
  onStep3Back: () => void;
  onStep3Complete: () => void;
  onReset: () => void;
};

function DesktopPanel({
  children,
  footer,
}: {
  children: React.ReactNode;
  footer: React.ReactNode;
}) {
  return (
    <div className="ticket-desktop-panel hidden w-full max-w-full flex-col md:flex">
      <div className="flex-1">{children}</div>
      <div className="mt-10 shrink-0">{footer}</div>
    </div>
  );
}

function TicketDesktopStep2({
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
  form: TicketDesktopFormState;
  privacyAgreed: boolean;
  loading: boolean;
  error: string | null;
  onFormChange: (next: TicketDesktopFormState) => void;
  onPrivacyChange: (v: boolean) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  return (
    <DesktopPanel
      footer={
        <TicketDualNav
          onBack={onBack}
          onNext={onNext}
          nextLabel="다음"
          loading={loading}
          nextEnabled={privacyAgreed && !loading}
          nextRed={privacyAgreed}
        />
      }
    >
      <TicketHeadline />
      <TicketPaymentNotices event={event} />

      <section className="ticket-mobile-form-section mt-5 border-t border-neutral-300 md:mt-6">
        <TicketEventSubhead event={event} />

        <div className="ticket-mobile-form-fields border-b border-neutral-300">
          <TicketFormRow label="이름" htmlFor="pc-ticket-name">
            <input
              id="pc-ticket-name"
              type="text"
              required
              value={form.name}
              onChange={(e) => onFormChange({ ...form, name: e.target.value })}
              placeholder="홍길동"
              className={ticketFormInputClass}
            />
          </TicketFormRow>

          <TicketFormRow label="휴대폰 번호" htmlFor="pc-ticket-phone">
            <input
              id="pc-ticket-phone"
              type="tel"
              required
              maxLength={13}
              value={form.phone}
              onChange={(e) =>
                onFormChange({ ...form, phone: formatPhone(e.target.value) })
              }
              placeholder="010-1234-5678"
              className={ticketFormInputClass}
            />
          </TicketFormRow>

          <TicketFormRow label="소속 교회" htmlFor="pc-ticket-church">
            <input
              id="pc-ticket-church"
              type="text"
              required
              value={form.church}
              onChange={(e) => onFormChange({ ...form, church: e.target.value })}
              placeholder="OO교회"
              className={ticketFormInputClass}
            />
          </TicketFormRow>

          <TicketFormRow label="티켓 매수" htmlFor="pc-ticket-qty">
            <TicketQtySelect
              id="pc-ticket-qty"
              value={form.quantity}
              unitPrice={pricing.unitPrice}
              onChange={(quantity) => onFormChange({ ...form, quantity })}
            />
          </TicketFormRow>
        </div>
      </section>

      <TicketPrivacyConsent agreed={privacyAgreed} onChange={onPrivacyChange} />

      {error && (
        <p className="mt-4 text-[14px] font-light text-red-600 md:text-[15px]">{error}</p>
      )}
    </DesktopPanel>
  );
}

function TicketDesktopStep3({
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
  form: TicketDesktopFormState;
  loading: boolean;
  error: string | null;
  onBack: () => void;
  onComplete: () => void;
}) {
  const [accountCopied, setAccountCopied] = useState(false);
  const depositAmount = pricing.unitPrice * form.quantity;

  return (
    <DesktopPanel
      footer={
        <TicketDualNav
          onBack={onBack}
          onNext={onComplete}
          nextLabel="예매 신청하기"
          loading={loading}
          nextEnabled={!loading}
          nextRed={accountCopied}
        />
      }
    >
      <TicketHeadline />
      <TicketPaymentNotices event={event} />

      <section className="ticket-mobile-form-section mt-5 border-t border-neutral-300 md:mt-6">
        <TicketEventSubhead event={event} />

        <div className="ticket-mobile-form-fields border-b border-neutral-300">
          <div className="ticket-mobile-form-row flex items-start gap-3 py-2.5 md:gap-4 md:py-3">
            <span className="ticket-mobile-form-label w-[6rem] shrink-0 pt-0.5 text-left font-light leading-tight text-neutral-500 md:w-[6.5rem]">
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
              <TicketCopyAccountButton onCopied={() => setAccountCopied(true)} />
            </div>
          </div>

          <TicketFormRow label="입금 금액" htmlFor="pc-ticket-deposit-amount">
            <p
              id="pc-ticket-deposit-amount"
              className="ticket-mobile-form-value m-0 font-medium text-neutral-900"
            >
              {form.quantity}매 / {formatKrw(depositAmount)}
            </p>
          </TicketFormRow>

          <TicketFormRow label="문의" htmlFor="pc-ticket-inquiry">
            <p
              id="pc-ticket-inquiry"
              className="ticket-mobile-form-value m-0 break-all font-medium text-neutral-900"
            >
              {TICKET_CONTACT_EMAIL}
            </p>
          </TicketFormRow>
        </div>
      </section>

      {error && (
        <p className="mt-4 text-[14px] font-light text-red-600 md:text-[15px]">{error}</p>
      )}
    </DesktopPanel>
  );
}

function TicketDesktopStep4({
  event,
  orderId,
  onReset,
}: {
  event: TicketEvent;
  orderId: string;
  onReset: () => void;
}) {
  return (
    <DesktopPanel footer={<TicketSingleNav label="처음으로" onClick={onReset} />}>
      <TicketHeadline />

      <div className="mt-4 md:mt-5">
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
        <p className="ticket-mobile-step4-body m-0">문자로 보내 드립니다.</p>
      </div>

      <h2 className="ticket-mobile-subhead mt-8 md:mt-10">
        {event.id === "oneness-2026"
          ? "2026 ONENESS WORSHIP EARLY BIRD"
          : event.name.toUpperCase()}
      </h2>

      {orderId && (
        <div className="ticket-mobile-form-row flex items-center gap-3 border-t border-b border-neutral-300 py-2.5 md:gap-4 md:py-3">
          <span className="ticket-mobile-form-label w-[6rem] shrink-0 text-left font-medium leading-tight text-neutral-900 md:w-[6.5rem]">
            신청번호
          </span>
          <span className="ticket-mobile-order-id min-w-0 tabular-nums tracking-wide">
            {orderId}
          </span>
        </div>
      )}

      <ul className="ticket-mobile-notices mt-4 w-full list-none p-0 md:mt-5">
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
    </DesktopPanel>
  );
}

export function TicketDesktopView({
  step,
  event,
  pricing,
  form,
  privacyAgreed,
  loading,
  error,
  orderId,
  onFormChange,
  onPrivacyChange,
  onStep2Back,
  onStep2Next,
  onStep3Back,
  onStep3Complete,
  onReset,
}: TicketDesktopViewProps) {
  if (step === 2) {
    return (
      <TicketDesktopStep2
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

  if (step === 3) {
    return (
      <TicketDesktopStep3
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

  if (step === 4) {
    return (
      <TicketDesktopStep4 event={event} orderId={orderId} onReset={onReset} />
    );
  }

  return null;
}
