export type TicketEventId = "oneness-2026" | "metanoia-2026";

export type TicketPricingPhase =
  | "before-early-bird"
  | "early-bird"
  | "regular";

export type TicketAudience = "adult" | "student";

export type TicketEvent = {
  id: TicketEventId;
  name: string;
  eyebrow: string;
  date: string;
  dateNote?: string;
  venue: string;
  regularPrice: number;
  earlyBirdPrice: number;
  /** 참가비 표 — 학생(초·중·고) 정가 (없으면 표시 생략) */
  studentPrice?: number;
  earlyBird?: { start: Date; end: Date; label: string };
  refundDeadlineLabel: string;
  registrationOpen: boolean;
  registrationNote?: string;
  posterUrl?: string;
  /** 포천중앙 등 장소 안내·약도 표시 */
  showPocheonVenueGuide?: boolean;
};

export const ONENESS_2026_POSTER_URL =
  "https://ewaqnqzivdceurhjxgpf.supabase.co/storage/v1/object/public/assets/ONENESS%20WORSHIP%20POSTER%20.jpg";

export const TICKET_PAYMENT_DEADLINE_NOTICE =
  "계좌 입금 후 신청이 확정됩니다. 신청 후 3일 이내 미입금 시 자동 취소될 수 있으니 유의해 주세요.";

export const TICKET_EVENTS: TicketEvent[] = [
  {
    id: "oneness-2026",
    name: "ONENESS Worship 2026",
    eyebrow: "Worship",
    date: "2026. 06. 27. 토요일 13:00 -\u00A021:00",
    dateNote: "8시간 연속 예배",
    venue: "포천중앙침례교회",
    regularPrice: 30_000,
    earlyBirdPrice: 20_000,
    studentPrice: 15_000,
    earlyBird: {
      start: new Date("2026-05-18T11:00:00+09:00"),
      end: new Date("2026-05-24T23:59:59+09:00"),
      label: "2026년 5월 18일(월) 11:00부터 — 5월 24일(일) 24:00까지",
    },
    refundDeadlineLabel: "2026년 6월 20일(토) 23:59까지",
    registrationOpen: true,
    posterUrl: ONENESS_2026_POSTER_URL,
    showPocheonVenueGuide: true,
  },
  {
    id: "metanoia-2026",
    name: "METANOIA 2026",
    eyebrow: "Conference",
    date: "2026년 1월 26일(월) — 28일(수)",
    venue: "포천중앙침례교회",
    regularPrice: 30_000,
    earlyBirdPrice: 20_000,
    refundDeadlineLabel: "집회 시작 7일 전까지",
    registrationOpen: false,
    registrationNote:
      "참가 신청이 마감되었습니다. 문의는 Inquiry로 연락해 주세요.",
  },
];

export type TicketPricing = {
  unitPrice: number;
  tierLabel: string;
  isEarlyBird: boolean;
  phase: TicketPricingPhase;
  /** 현재 요금 행에 붙는 보조 설명 */
  currentPriceDetail: string;
};

export function getTicketAudienceLabel(ticketAudience: TicketAudience) {
  return ticketAudience === "adult" ? "성인" : "초·중·고(학생)";
}

export function getTicketAudienceUnitPrice(
  event: TicketEvent,
  ticketAudience: TicketAudience,
) {
  if (ticketAudience === "student" && event.studentPrice != null) {
    return event.studentPrice;
  }
  return event.regularPrice;
}

export function getTicketEvent(id: TicketEventId): TicketEvent | undefined {
  return TICKET_EVENTS.find((e) => e.id === id);
}

/** 얼리버드 전·중·후 자동 요금 (5/24 24:00 이후 정가 30,000원) */
export function getTicketPricing(
  event: TicketEvent,
  now: Date = new Date(),
): TicketPricing {
  if (!event.earlyBird) {
    return {
      unitPrice: event.regularPrice,
      tierLabel: "정가",
      isEarlyBird: false,
      phase: "regular",
      currentPriceDetail: `${formatKrw(event.regularPrice)} / 1매`,
    };
  }

  const { start, end, label } = event.earlyBird;

  if (now < start) {
    return {
      unitPrice: event.earlyBirdPrice,
      tierLabel: "얼리버드 예정",
      isEarlyBird: false,
      phase: "before-early-bird",
      currentPriceDetail: `${formatKrw(event.earlyBirdPrice)} / 1매 (${label} 오픈 · 이후 정가 ${formatKrw(event.regularPrice)})`,
    };
  }

  if (now <= end) {
    return {
      unitPrice: event.earlyBirdPrice,
      tierLabel: "얼리버드",
      isEarlyBird: true,
      phase: "early-bird",
      currentPriceDetail: `${formatKrw(event.earlyBirdPrice)} / 1매 (${label})`,
    };
  }

  return {
    unitPrice: event.regularPrice,
    tierLabel: "정가",
    isEarlyBird: false,
    phase: "regular",
    currentPriceDetail: `${formatKrw(event.regularPrice)} / 1매 (얼리버드 종료)`,
  };
}

function formatKrw(amount: number) {
  return `${amount.toLocaleString("ko-KR")}원`;
}

const KST = "Asia/Seoul";

/** 모바일 티켓 표 — 얼리버드 예매 기간 (레퍼런스 줄바꿈) */
export function formatEarlyBirdPeriodMobileLines(start: Date, end: Date) {
  const line = (d: Date, suffix: "부터" | "까지") => {
    const parts = new Intl.DateTimeFormat("ko-KR", {
      timeZone: KST,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      weekday: "long",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).formatToParts(d);

    const pick = (type: Intl.DateTimeFormatPartTypes) =>
      parts.find((p) => p.type === type)?.value ?? "";

    const year = pick("year");
    const month = pick("month");
    const day = pick("day");
    const weekday = pick("weekday");
    const hour = pick("hour");
    const minute = pick("minute");

    return `${year}. ${month}. ${day}. ${weekday} ${hour}:${minute}\u00A0${suffix}`;
  };

  return {
    startLine: line(start, "부터"),
    endLine: line(end, "까지"),
  };
}

/** 모바일·PC 티켓 표 — 현재 요금 */
export function getMobileCurrentFeeDisplay(
  event: TicketEvent,
  pricing: TicketPricing,
) {
  if (pricing.phase === "regular") {
    return {
      tier: `성인 정가 ${formatKrw(event.regularPrice)} / 1매`,
      price:
        event.studentPrice != null
          ? `초·중·고 정가 ${formatKrw(event.studentPrice)} / 1매`
          : undefined,
    };
  }
  return {
    tier: "얼리버드 특가",
    price: `성인 ${formatKrw(pricing.unitPrice)} / 1매`,
  };
}

export const TICKET_BANK = {
  bankName: process.env.NEXT_PUBLIC_TICKET_BANK_NAME ?? "신협",
  accountNumber:
    process.env.NEXT_PUBLIC_TICKET_ACCOUNT_NUMBER ?? "131-022-991995",
  manager:
    process.env.NEXT_PUBLIC_TICKET_BANK_MANAGER ?? "그날 미니스트리 앤 쉬르밴드",
};

export function ticketBankCopyText() {
  return `${TICKET_BANK.bankName} ${TICKET_BANK.accountNumber} (예금주 ${TICKET_BANK.manager})`;
}

export const TICKET_CONTACT_EMAIL = "shirband2025@gmail.com";

/** 모바일 2단계 환불 기한 — `2026. 06. 20. 토 23:59까지` */
export function formatRefundDeadlineMobile(refundDeadlineLabel: string) {
  const match = refundDeadlineLabel.match(
    /^(\d{4})년\s*(\d{1,2})월\s*(\d{1,2})일\(([^)]+)\)\s*(.+)$/,
  );
  if (!match) return refundDeadlineLabel;
  const [, y, m, d, dow, rest] = match;
  return `${y}. ${m.padStart(2, "0")}. ${d.padStart(2, "0")}. ${dow} ${rest}`;
}

/** 1단계·안내 표 상단 집회명 */
export function getTicketStep1Title(event: TicketEvent) {
  if (event.id === "oneness-2026") return "2026 ONENESS WORSHIP";
  return event.name.toUpperCase();
}

/** 모바일 2단계 폼 상단 집회명 */
export function getMobileTicketFormTitle(event: TicketEvent) {
  if (event.id === "oneness-2026") return "2026 ONENESS WORSHIP";
  return event.name.toUpperCase();
}
