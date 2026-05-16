"use client";

import Link from "next/link";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import { PageSplitLayout } from "@/components/PageSplitLayout";
import { TicketEventPoster } from "@/components/TicketEventPoster";
import { TicketBankInfo } from "@/components/TicketBankInfo";
import { CopyTextButton } from "@/components/CopyTextButton";
import { POCHEON_CENTRAL_BAPTIST_VENUE } from "@/lib/pocheon-venue";
import {
  TICKET_BANK,
  TICKET_CONTACT_EMAIL,
  TICKET_EVENTS,
  TICKET_PAYMENT_DEADLINE_NOTICE,
  ticketBankCopyText,
  type TicketEvent,
  type TicketPricing,
  type TicketEventId,
  getTicketEvent,
  getTicketPricing,
} from "@/lib/ticket-events";

const STEPS = [
  { n: 1, label: "안내" },
  { n: 2, label: "정보입력" },
  { n: 3, label: "입금" },
  { n: 4, label: "완료" },
] as const;

const inputClass =
  "w-full bg-transparent border-b border-white/20 px-0 py-3 text-[16px] text-white placeholder-white/25 font-light focus:border-white/60 focus:outline-none transition-colors";

const selectClass =
  "w-full bg-transparent border-b border-white/20 px-0 py-3 text-[16px] text-white font-light focus:border-white/60 focus:outline-none transition-colors cursor-pointer appearance-none";

type FormState = {
  name: string;
  phone: string;
  church: string;
  quantity: number;
};

function formatPhone(value: string) {
  const v = value.replace(/[^0-9]/g, "");
  if (v.length <= 3) return v;
  if (v.length <= 7) return `${v.slice(0, 3)}-${v.slice(3)}`;
  return `${v.slice(0, 3)}-${v.slice(3, 7)}-${v.slice(7, 11)}`;
}

function formatKrw(amount: number) {
  return `${amount.toLocaleString("ko-KR")}원`;
}

function buildOrderId(eventId: TicketEventId) {
  const suffix = Date.now().toString(36).slice(-5).toUpperCase();
  const prefix = eventId === "oneness-2026" ? "ONE" : "MET";
  return `T-${prefix}-${suffix}`;
}

export default function TicketPage() {
  const defaultEventId = TICKET_EVENTS.find((e) => e.registrationOpen)?.id ?? "oneness-2026";
  const [step, setStep] = useState(1);
  const [eventId, setEventId] = useState<TicketEventId>(defaultEventId);
  const [form, setForm] = useState<FormState>({
    name: "",
    phone: "",
    church: "",
    quantity: 1,
  });
  const [privacyAgreed, setPrivacyAgreed] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(timer);
  }, []);

  const event = useMemo(() => getTicketEvent(eventId), [eventId]);
  const pricing = useMemo(
    () => (event ? getTicketPricing(event, now) : null),
    [event, now],
  );
  const totalAmount = (pricing?.unitPrice ?? 0) * form.quantity;

  const goStep = useCallback((n: number) => {
    setErr(null);
    setStep(n);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  async function submitApplication() {
    if (!event?.registrationOpen) {
      setErr(event?.registrationNote ?? "현재 신청할 수 없는 집회입니다.");
      return;
    }

    const name = form.name.trim();
    const phone = form.phone.trim();
    const church = form.church.trim();

    if (!name || !phone || !church) {
      setErr("이름, 연락처, 소속 교회를 모두 입력해 주세요.");
      return;
    }
    if (!privacyAgreed) {
      setErr("개인정보 수집 및 이용에 동의해 주세요.");
      return;
    }

    setLoading(true);
    setErr(null);

    const id = buildOrderId(eventId);
    const message = [
      `[SHIR BAND 티켓 신청] ${event.name}`,
      `신청번호: ${id}`,
      "",
      `집회: ${event.name}`,
      `일시: ${event.date}${event.dateNote ? ` (${event.dateNote})` : ""}`,
      `장소: ${event.venue}`,
      `티켓 매수: ${form.quantity}매`,
      `요금 구분: ${pricing?.tierLabel ?? "-"}`,
      `1매 단가: ${formatKrw(pricing?.unitPrice ?? 0)}`,
      `입금 금액: ${formatKrw(totalAmount)}`,
      "",
      `이름: ${name}`,
      `연락처: ${phone}`,
      `소속교회: ${church}`,
      "",
      `입금 계좌: ${TICKET_BANK.bankName} ${TICKET_BANK.accountNumber}`,
      `담당자: ${TICKET_BANK.manager}`,
      `입금자명: ${name}`,
    ].join("\n");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email: "", message }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "서버 오류");

      setOrderId(id);
      goStep(3);
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "신청 접수에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  }

  function resetFlow() {
    setStep(1);
    setForm({ name: "", phone: "", church: "", quantity: 1 });
    setPrivacyAgreed(false);
    setOrderId("");
    setErr(null);
    setEventId(defaultEventId);
  }

  return (
    <PageSplitLayout mainClassName="max-w-none md:max-w-[40rem] lg:max-w-none">
      <div className="flex flex-col lg:flex-row lg:items-start gap-8 lg:gap-10">
        <div className="flex-1 min-w-0 lg:max-w-[36rem]">
      <header className="mb-10 sm:mb-12">
        <p className="text-[12px] sm:text-[13px] text-white/45 tracking-[0.25em] uppercase mb-3">
          Registration
        </p>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-light tracking-[0.2em] uppercase text-white">
          Ticket
        </h1>
        <div className="w-10 h-px bg-white/30 mt-5 sm:mt-6" />
        <p className="text-[16px] text-white/70 font-light leading-loose mt-6 sm:mt-8">
          <span className="text-white/90">{event?.name ?? "집회"}</span> 참가 티켓을
          신청합니다. 입금이 확인되면 정식 예약이 확정되며, 확인 후 문자로
          안내드립니다.
        </p>
      </header>

      <TicketSteps current={step} />

      {event?.posterUrl && (
        <div className="lg:hidden mb-10 max-w-[220px] mx-auto border border-white/20 shadow-[0_8px_24px_rgba(0,0,0,0.1)]">
          <div className="relative aspect-[3/4] w-full">
            <Image
              src={event.posterUrl}
              alt={`${event.name} poster`}
              fill
              sizes="220px"
              className="object-cover"
              priority
            />
          </div>
        </div>
      )}

      {step === 1 && (
        <StepInfo
          eventId={eventId}
          event={event}
          pricing={pricing}
          onEventChange={setEventId}
          onNext={() => {
            if (!event?.registrationOpen) {
              setErr(event?.registrationNote ?? "신청이 마감된 집회입니다.");
              return;
            }
            goStep(2);
          }}
          error={err}
        />
      )}

      {step === 2 && event && pricing && (
        <StepForm
          event={event}
          pricing={pricing}
          form={form}
          privacyAgreed={privacyAgreed}
          loading={loading}
          error={err}
          onFormChange={setForm}
          onPrivacyChange={setPrivacyAgreed}
          onBack={() => goStep(1)}
          onNext={submitApplication}
        />
      )}

      {step === 3 && event && pricing && (
        <StepPayment
          event={event}
          pricing={pricing}
          form={form}
          totalAmount={totalAmount}
          orderId={orderId}
          onBack={() => goStep(2)}
          onComplete={() => goStep(4)}
        />
      )}

      {step === 4 && event && (
        <StepComplete
          event={event}
          orderId={orderId}
          onReset={resetFlow}
        />
      )}
        </div>

        {event?.posterUrl && (
          <TicketEventPoster
            src={event.posterUrl}
            alt={`${event.name} 집회 포스터`}
          />
        )}
      </div>
    </PageSplitLayout>
  );
}

function TicketSteps({ current }: { current: number }) {
  return (
    <nav
      className="mb-12 sm:mb-14 grid grid-cols-4 gap-2 border-b border-white/15 pb-8"
      aria-label="신청 단계"
    >
      {STEPS.map(({ n, label }) => {
        const done = current > n;
        const active = current === n;
        return (
          <div key={n} className="text-center">
            <div
              className={[
                "mx-auto mb-2 flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-light tracking-wider transition-colors",
                done || active
                  ? "bg-neutral-900 text-white"
                  : "border border-white/25 text-white/45",
              ].join(" ")}
              aria-hidden
            >
              {n}
            </div>
            <span
              className={[
                "text-[10px] sm:text-[11px] tracking-[0.12em] uppercase",
                active ? "text-white/90 font-normal" : "text-white/45 font-light",
              ].join(" ")}
            >
              {label}
            </span>
          </div>
        );
      })}
    </nav>
  );
}

function StepInfo({
  eventId,
  event,
  pricing,
  onEventChange,
  onNext,
  error,
}: {
  eventId: TicketEventId;
  event: TicketEvent | undefined;
  pricing: TicketPricing | null;
  onEventChange: (id: TicketEventId) => void;
  onNext: () => void;
  error: string | null;
}) {
  return (
    <section className="space-y-8">
      <h2 className="text-[12px] sm:text-[13px] text-white/45 tracking-[0.25em] uppercase">
        집회 선택
      </h2>

      <select
        id="event-select"
        aria-label="집회 선택"
        value={eventId}
        onChange={(e) => onEventChange(e.target.value as TicketEventId)}
        className={selectClass}
      >
          {TICKET_EVENTS.map((ev) => (
            <option key={ev.id} value={ev.id} className="bg-neutral-900 text-white">
              {ev.name}
              {!ev.registrationOpen ? " — 마감" : ""}
            </option>
          ))}
      </select>

      {event && (
        <>
          {pricing && <EventCard event={event} pricing={pricing} />}
          <NoticeBox>{TICKET_PAYMENT_DEADLINE_NOTICE}</NoticeBox>
          <p className="text-[13px] sm:text-[14px] text-white/60 font-light leading-relaxed">
            입금 확인 후, 집회 시작 7일 전(
            <span className="text-white/75">{event.refundDeadlineLabel}</span>
            )까지 신청 취소 및 전액 환불이 가능합니다. 해당 기한 이후에는
            취소·환불이 어려우니 신청 전 일정을 확인해 주세요.
          </p>
          {event.registrationNote && (
            <p className="text-[14px] text-white/60 font-light leading-relaxed">
              {event.registrationNote}
            </p>
          )}
        </>
      )}

      {error && (
        <p className="text-red-300/90 text-[14px] tracking-wider font-light">
          {error}
        </p>
      )}

      <div className="flex justify-center pt-4">
        <PrimaryButton
          type="button"
          onClick={onNext}
          disabled={!event?.registrationOpen}
          prominent
        >
          신청하기
        </PrimaryButton>
      </div>
    </section>
  );
}

function StepForm({
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
    <section className="space-y-10">
      <div>
        <h2 className="text-[12px] sm:text-[13px] text-white/45 tracking-[0.25em] uppercase mb-2">
          신청자 정보
        </h2>
        <p className="text-[14px] text-white/55 font-light">
          {event.name} · {pricing.tierLabel}{" "}
          {formatKrw(pricing.unitPrice)}/매
        </p>
      </div>

      <Field label="이름" htmlFor="ticket-name">
        <input
          id="ticket-name"
          type="text"
          required
          value={form.name}
          onChange={(e) => onFormChange({ ...form, name: e.target.value })}
          placeholder="홍길동"
          className={inputClass}
        />
      </Field>

      <Field label="휴대폰 번호" htmlFor="ticket-phone">
        <input
          id="ticket-phone"
          type="tel"
          required
          maxLength={13}
          value={form.phone}
          onChange={(e) =>
            onFormChange({ ...form, phone: formatPhone(e.target.value) })
          }
          placeholder="010-1234-5678"
          className={inputClass}
        />
      </Field>

      <Field label="소속 교회" htmlFor="ticket-church">
        <input
          id="ticket-church"
          type="text"
          required
          value={form.church}
          onChange={(e) => onFormChange({ ...form, church: e.target.value })}
          placeholder="○○교회"
          className={inputClass}
        />
      </Field>

      <Field label="티켓 매수" htmlFor="ticket-qty">
        <select
          id="ticket-qty"
          value={form.quantity}
          onChange={(e) =>
            onFormChange({ ...form, quantity: Number(e.target.value) })
          }
          className={selectClass}
        >
          {[1, 2, 3, 4, 5].map((n) => (
            <option key={n} value={n} className="bg-neutral-900 text-white">
              {n}매 · {formatKrw(pricing.unitPrice * n)}
            </option>
          ))}
        </select>
      </Field>

      <PrivacyConsent agreed={privacyAgreed} onChange={onPrivacyChange} />

      {error && (
        <p className="text-red-300/90 text-[14px] tracking-wider font-light">
          {error}
        </p>
      )}

      <div className="flex flex-wrap gap-3 pt-2">
        <SecondaryButton type="button" onClick={onBack}>
          이전
        </SecondaryButton>
        <PrimaryButton
          type="button"
          onClick={onNext}
          disabled={loading || !privacyAgreed}
        >
          {loading ? "접수 중…" : "다음"}
        </PrimaryButton>
      </div>
    </section>
  );
}

function StepPayment({
  event,
  pricing,
  form,
  totalAmount,
  orderId,
  onBack,
  onComplete,
}: {
  event: TicketEvent;
  pricing: TicketPricing;
  form: FormState;
  totalAmount: number;
  orderId: string;
  onBack: () => void;
  onComplete: () => void;
}) {
  return (
    <section className="space-y-10">
      <h2 className="text-[12px] sm:text-[13px] text-white/45 tracking-[0.25em] uppercase">
        입금 안내
      </h2>

      <TicketBankInfo />
      <div className="border border-white/20 px-5 py-6 sm:px-6 sm:py-8">
        <p className="text-[12px] text-white/45 tracking-[0.2em] uppercase mb-1">
          입금 금액
        </p>
        <p className="text-2xl sm:text-3xl font-light text-white/90 tabular-nums">
          {formatKrw(totalAmount)}
        </p>
        <p className="text-[13px] text-white/50 font-light mt-2">
          {event.name} · {pricing.tierLabel} · {form.quantity}매 ·{" "}
          {formatKrw(pricing.unitPrice)}/매
        </p>
      </div>
      <ul className="space-y-3 text-[14px] text-white/70 font-light leading-relaxed">
        <InfoLine>
          입금자명은 신청 시 입력하신 <strong className="font-normal text-white/90">신청자 본인 이름</strong>
          과 동일하게 입금해 주세요.
        </InfoLine>
        <InfoLine>입금 마감 · 신청 후 3일 이내</InfoLine>
        <InfoLine>미입금 시 신청은 자동 취소될 수 있습니다.</InfoLine>
        <InfoLine>
          환불 · 집회 시작 7일 전({event.refundDeadlineLabel})까지 취소·전액 환불
          가능
        </InfoLine>
        <InfoLine>
          문의 ·{" "}
          <a
            href={`mailto:${TICKET_CONTACT_EMAIL}`}
            className="underline underline-offset-2 hover:text-white/90 transition-colors"
          >
            {TICKET_CONTACT_EMAIL}
          </a>
        </InfoLine>
        {orderId && (
          <InfoLine>
            신청번호 · <span className="text-white/90">{orderId}</span>
          </InfoLine>
        )}
      </ul>

      <div className="flex flex-wrap gap-3 pt-2">
        <SecondaryButton type="button" onClick={onBack}>
          이전
        </SecondaryButton>
        <PrimaryButton type="button" onClick={onComplete}>
          안내 확인
        </PrimaryButton>
      </div>
    </section>
  );
}

function StepComplete({
  event,
  orderId,
  onReset,
}: {
  event: TicketEvent;
  orderId: string;
  onReset: () => void;
}) {
  return (
    <section className="space-y-10 text-center sm:text-left">
      <div className="mx-auto sm:mx-0 flex h-14 w-14 items-center justify-center rounded-full border border-white/25 text-2xl text-white/80 font-light">
        ✓
      </div>
      <div>
        <h2 className="text-xl sm:text-2xl font-light tracking-wider text-white mb-3">
          신청 정보가 접수되었습니다
        </h2>
        <p className="text-[16px] text-white/70 font-light leading-loose">
          아직 예약이 확정된 상태는 아닙니다.{" "}
          <span className="text-white/90">{event.name}</span> 참가를 위해 안내드린
          계좌로 입금해 주시면, 입금 확인 후 정식 예약 확정 안내를 문자로 보내
          드립니다.
        </p>
      </div>

      {orderId && (
        <div className="border border-white/15 px-5 py-4 text-[14px] text-white/70 font-light">
          신청번호 ·{" "}
          <span className="text-white/90 tracking-wide">{orderId}</span>
        </div>
      )}

      <ul className="space-y-3 text-[14px] text-white/65 font-light leading-relaxed text-left">
        <InfoLine>입금 확인까지 1~2일이 소요될 수 있습니다.</InfoLine>
        <InfoLine>
          입금 확인 문자를 받기 전까지는 예약이 확정되지 않습니다.
        </InfoLine>
        <InfoLine>
          입금 후에도 안내 문자가 없으면{" "}
          <Link
            href="/inquiry"
            className="underline underline-offset-2 hover:text-white/90"
          >
            Inquiry
          </Link>
          로 문의해 주세요.
        </InfoLine>
      </ul>

      <div className="pt-2">
        <PrimaryButton type="button" onClick={onReset}>
          처음으로
        </PrimaryButton>
      </div>
    </section>
  );
}

const venueLinkClass =
  "inline-flex items-center border border-white/35 px-2.5 py-1 text-[10px] tracking-[0.15em] uppercase font-light text-white/80 hover:bg-white hover:text-black transition-all shrink-0";

function EventCard({
  event,
  pricing,
}: {
  event: TicketEvent;
  pricing: TicketPricing;
}) {
  const venueDirectionsUrl = event.showPocheonVenueGuide
    ? POCHEON_CENTRAL_BAPTIST_VENUE.directionUrls.car
    : null;

  const rows: {
    label: string;
    content: React.ReactNode;
    highlight?: boolean;
  }[] = [
    {
      label: "일시",
      content: (
        <div className="space-y-1">
          <p>{event.date}</p>
          {event.dateNote && (
            <p className="text-[13px] text-white/55">{event.dateNote}</p>
          )}
        </div>
      ),
    },
    {
      label: "참가비",
      content: (
        <div className="space-y-1.5">
          <p>정가 {formatKrw(event.regularPrice)} / 1매</p>
          <p>얼리버드 {formatKrw(event.earlyBirdPrice)} / 1매</p>
        </div>
      ),
    },
    ...(event.earlyBird
      ? [
          {
            label: "얼리버드 기간",
            content: (
              <p className="text-[14px] leading-relaxed">{event.earlyBird.label}</p>
            ),
          },
        ]
      : []),
    {
      label: "현재 요금",
      highlight: true,
      content: <CurrentPricingBlock event={event} pricing={pricing} />,
    },
    {
      label: "입금 계좌",
      content: (
        <div className="space-y-2">
          <p className="tabular-nums">
            {TICKET_BANK.bankName} {TICKET_BANK.accountNumber}
          </p>
          <p className="text-[13px] text-white/55">담당자 · {TICKET_BANK.manager}</p>
          <CopyTextButton
            text={ticketBankCopyText()}
            label="복사하기"
            className="!px-3 !py-1.5 !text-[10px]"
          />
        </div>
      ),
    },
    {
      label: "장소",
      content: (
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-2">
            <span>{event.venue}</span>
            {venueDirectionsUrl && (
              <a
                href={venueDirectionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={venueLinkClass}
              >
                오시는 길
              </a>
            )}
          </div>
          {event.showPocheonVenueGuide && (
            <p className="text-[13px] text-white/55 leading-relaxed">
              {POCHEON_CENTRAL_BAPTIST_VENUE.address}
            </p>
          )}
        </div>
      ),
    },
    {
      label: "신청",
      content: event.registrationOpen ? "접수 중" : "마감",
      highlight: event.registrationOpen,
    },
  ];

  return (
    <dl className="border-t border-white/15">
      {rows.map((row) => (
        <div
          key={row.label}
          className="grid grid-cols-[88px_1fr] sm:grid-cols-[100px_1fr] gap-x-4 py-4 border-b border-white/10 text-[15px] sm:text-[16px]"
        >
          <dt className="text-white/45 font-light tracking-wider text-[12px] uppercase pt-0.5">
            {row.label}
          </dt>
          <dd
            className={[
              "font-light leading-relaxed",
              row.highlight ? "text-white/90" : "text-white/80",
            ].join(" ")}
          >
            {row.content}
          </dd>
        </div>
      ))}
    </dl>
  );
}

function CurrentPricingBlock({
  event,
  pricing,
}: {
  event: TicketEvent;
  pricing: TicketPricing;
}) {
  return (
    <div className="space-y-2.5 text-[14px] sm:text-[15px] leading-relaxed">
      <p className="text-white/90">{pricing.tierLabel}</p>
      <p className="text-white/85 tabular-nums">
        {formatKrw(pricing.unitPrice)} / 1매
      </p>
      {pricing.phase === "before-early-bird" && event.earlyBird && (
        <>
          <p className="text-[13px] text-white/55 pt-1">
            {event.earlyBird.label}부터 얼리버드 적용
          </p>
          <p className="text-[13px] text-white/55">
            이후 정가 {formatKrw(event.regularPrice)} / 1매
          </p>
        </>
      )}
      {pricing.phase === "early-bird" && event.earlyBird && (
        <p className="text-[13px] text-white/55 pt-1">{event.earlyBird.label}까지</p>
      )}
      {pricing.phase === "regular" && (
        <p className="text-[13px] text-white/55 pt-1">얼리버드 종료 · 정가 적용</p>
      )}
    </div>
  );
}

function NoticeBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="border-l border-white/30 pl-5 py-3 -mr-6 sm:-mr-10 md:-mr-14 lg:-mr-16 overflow-x-auto">
      <p className="text-[13px] sm:text-[14px] text-white/70 font-light whitespace-nowrap min-w-max">
        {children}
      </p>
    </div>
  );
}

function InfoLine({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex gap-2">
      <span className="text-white/35 shrink-0" aria-hidden>
        ·
      </span>
      <span>{children}</span>
    </li>
  );
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="block text-[12px] text-white/45 tracking-[0.25em] uppercase mb-2"
      >
        {label}
      </label>
      {children}
    </div>
  );
}

function PrivacyConsent({
  agreed,
  onChange,
}: {
  agreed: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="space-y-3 pt-2">
      <label className="flex items-start gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={agreed}
          onChange={(e) => onChange(e.target.checked)}
          className="mt-1 w-3.5 h-3.5 accent-neutral-900"
          required
        />
        <span className="text-[14px] sm:text-[15px] text-white/75 font-light leading-relaxed">
          개인정보 수집 및 이용에 동의합니다 (필수)
        </span>
      </label>
      <p className="ml-7 text-[12px] sm:text-[13px] text-white/45 font-light leading-relaxed">
        <Link
          href="/privacy-policy"
          className="underline underline-offset-2 hover:text-white/80 transition-colors"
        >
          개인정보 처리방침
        </Link>
        에 따라 안전하게 관리됩니다.
      </p>
    </div>
  );
}

const btnBase =
  "text-[12px] tracking-[0.3em] uppercase font-light transition-all disabled:opacity-30 disabled:cursor-not-allowed";

function PrimaryButton({
  children,
  prominent = false,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { prominent?: boolean }) {
  return (
    <button
      type="button"
      className={[
        btnBase,
        prominent
          ? "ticket-cta-primary min-w-[12rem] px-10 py-4 border shadow-[0_2px_14px_rgba(0,0,0,0.18)]"
          : "px-8 py-3.5 border border-white/40 text-white hover:bg-white hover:text-black hover:border-white disabled:hover:bg-transparent disabled:hover:text-white",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {children}
    </button>
  );
}

function SecondaryButton({
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className={`${btnBase} border border-white/20 text-white/80 hover:border-white/40 hover:text-white disabled:hover:text-white/80`}
      {...props}
    >
      {children}
    </button>
  );
}
