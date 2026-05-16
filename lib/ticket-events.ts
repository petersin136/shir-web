export type TicketEventId = "oneness-2026" | "metanoia-2026";

export type TicketPricingPhase =
  | "before-early-bird"
  | "early-bird"
  | "regular";

export type TicketEvent = {
  id: TicketEventId;
  name: string;
  eyebrow: string;
  date: string;
  dateNote?: string;
  venue: string;
  regularPrice: number;
  earlyBirdPrice: number;
  earlyBird?: { start: Date; end: Date; label: string };
  refundDeadlineLabel: string;
  registrationOpen: boolean;
  registrationNote?: string;
  posterUrl?: string;
  /** 포천중앙 등 장소 안내·약도 표시 */
  showPocheonVenueGuide?: boolean;
};

export const ONENESS_2026_POSTER_URL =
  "https://ewaqnqzivdceurhjxgpf.supabase.co/storage/v1/object/public/assets/KakaoTalk_Photo_2026-05-17-00-09-35.jpeg";

export const TICKET_PAYMENT_DEADLINE_NOTICE =
  "계좌 입금 후 신청이 확정됩니다. 신청 후 3일 이내 미입금 시 자동 취소될 수 있으니 유의해 주세요.";

export const TICKET_EVENTS: TicketEvent[] = [
  {
    id: "oneness-2026",
    name: "ONENESS Worship 2026",
    eyebrow: "Worship",
    date: "2026년 6월 27일(토) 13:00 — 21:00",
    dateNote: "8시간 연속 예배",
    venue: "포천중앙침례교회",
    regularPrice: 30_000,
    earlyBirdPrice: 20_000,
    earlyBird: {
      start: new Date("2026-05-18T11:00:00+09:00"),
      end: new Date("2026-05-24T12:00:00+09:00"),
      label: "2026년 5월 18일(월) 11:00부터 — 5월 24일(일) 12:00까지",
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

export function getTicketEvent(id: TicketEventId): TicketEvent | undefined {
  return TICKET_EVENTS.find((e) => e.id === id);
}

/** 얼리버드 전·중·후 자동 요금 (5/24 12:00 이후 정가 30,000원) */
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

export const TICKET_BANK = {
  bankName: process.env.NEXT_PUBLIC_TICKET_BANK_NAME ?? "IBK기업은행",
  accountNumber:
    process.env.NEXT_PUBLIC_TICKET_ACCOUNT_NUMBER ?? "015-082585-02-011",
  manager: process.env.NEXT_PUBLIC_TICKET_BANK_MANAGER ?? "최연주",
};

export function ticketBankCopyText() {
  return `${TICKET_BANK.bankName} ${TICKET_BANK.accountNumber} (담당자 ${TICKET_BANK.manager})`;
}

export const TICKET_CONTACT_EMAIL = "shirband2025@gmail.com";
