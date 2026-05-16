"use client";

import { useState } from "react";
import { POCHEON_CENTRAL_BAPTIST_VENUE } from "@/lib/pocheon-venue";
import { cn } from "@/lib/utils";

type TicketVenueGuideProps = {
  className?: string;
};

const linkBtnClass =
  "inline-flex items-center justify-center border border-white/35 px-3 py-1.5 text-[10px] sm:text-[11px] tracking-[0.18em] uppercase font-light text-white/85 hover:bg-white hover:text-black transition-all shrink-0";

export function TicketVenueGuide({ className }: TicketVenueGuideProps) {
  const [openRoute, setOpenRoute] = useState(
    POCHEON_CENTRAL_BAPTIST_VENUE.routes[0]?.id ?? "car",
  );

  const venue = POCHEON_CENTRAL_BAPTIST_VENUE;
  const activeRoute =
    venue.routes.find((r) => r.id === openRoute) ?? venue.routes[0];

  return (
    <section className={cn("space-y-6", className)} aria-label="오시는 길">
      <div>
        <h3 className="text-[12px] text-white/45 tracking-[0.25em] uppercase mb-4">
          오시는 길
        </h3>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 mb-2">
          <span className="text-[15px] sm:text-[16px] text-white/85 font-light">
            {venue.name}
          </span>
          <a
            href={venue.mapSearchUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={linkBtnClass}
          >
            장소보기
          </a>
        </div>
        <p className="text-[13px] sm:text-[14px] text-white/55 font-light leading-relaxed">
          {venue.address}
        </p>
        <a
          href={venue.mapAddressUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(linkBtnClass, "mt-3")}
        >
          네이버 지도에서 주소 보기
        </a>
      </div>

      <div className="border-t border-white/15 pt-5">
        <p className="text-[12px] text-white/45 tracking-[0.2em] uppercase mb-4">
          교통편별 약도
        </p>

        <div
          className="flex flex-wrap gap-2 mb-5"
          role="tablist"
          aria-label="교통편 선택"
        >
          {venue.routes.map((route) => (
            <button
              key={route.id}
              type="button"
              role="tab"
              aria-selected={openRoute === route.id}
              onClick={() => setOpenRoute(route.id)}
              className={cn(
                "px-3 py-1.5 text-[11px] tracking-[0.15em] uppercase font-light border transition-all",
                openRoute === route.id
                  ? "border-neutral-900 bg-neutral-900 text-white"
                  : "border-white/25 text-white/60 hover:border-white/45",
              )}
            >
              {route.label}
            </button>
          ))}
        </div>

        {activeRoute && (
          <div
            role="tabpanel"
            className="border border-white/12 px-4 py-5 sm:px-5 space-y-4"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-[14px] text-white/85 font-light">
                  {activeRoute.label}
                </p>
                <p className="text-[13px] text-white/50 font-light mt-1">
                  {activeRoute.summary}
                </p>
              </div>
              <a
                href={activeRoute.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={linkBtnClass}
              >
                길찾기
              </a>
            </div>
            <ol className="space-y-2.5 text-[13px] sm:text-[14px] text-white/70 font-light leading-relaxed list-decimal list-inside">
              {activeRoute.steps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </div>
        )}

        <p className="text-[12px] text-white/45 font-light mt-4 leading-relaxed">
          실시간 교통·도로 상황은 네이버 지도 길찾기를 이용해 주세요.
        </p>
      </div>
    </section>
  );
}
