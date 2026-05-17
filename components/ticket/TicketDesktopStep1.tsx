"use client";

import Image from "next/image";
import {
  TicketEventSummary,
  TicketHeadline,
  TicketStep1ApplyCta,
  getTicketStep1Title,
} from "@/components/ticket/ticket-flow-ui";
import type { TicketEvent, TicketPricing } from "@/lib/ticket-events";

export type TicketDesktopStep1Props = {
  event: TicketEvent;
  pricing: TicketPricing;
  error: string | null;
  onNext: () => void;
};

export function TicketDesktopStep1({
  event,
  pricing,
  error,
  onNext,
}: TicketDesktopStep1Props) {
  return (
    <div className="ticket-desktop-panel hidden w-full max-w-[32rem] flex-col md:flex">
      <TicketHeadline />

      {event.posterUrl && (
        <div className="mt-6 w-full md:mt-7">
          <Image
            src={event.posterUrl}
            alt={`${event.name} 집회 포스터`}
            width={900}
            height={1200}
            className="block h-auto w-full"
            priority
            sizes="(min-width: 768px) 32rem, 100vw"
          />
        </div>
      )}

      <h2 className="ticket-desktop-step1-title mt-8 mb-1 md:mt-9">
        {getTicketStep1Title(event)}
      </h2>

      <TicketEventSummary event={event} pricing={pricing} />

      {error && (
        <p className="mt-4 text-[14px] font-light text-red-600 md:text-[15px]">{error}</p>
      )}

      <div className="mt-10 shrink-0 md:mt-12">
        <TicketStep1ApplyCta
          label="신청하기"
          onClick={onNext}
          disabled={!event.registrationOpen}
        />
      </div>
    </div>
  );
}
