"use client";

import Link from "next/link";
import { useId } from "react";

/** About 스플릿과 동일 톤의 태그 색 */
const PROMO_TAG_COLOR = "#C0504D";

export function HomeSplitPromoLeft() {
  const grainFilterId = `split-promo-grain-${useId().replace(/:/g, "")}`;

  return (
    <>
      <svg
        className="pointer-events-none absolute h-0 w-0 overflow-hidden"
        aria-hidden
      >
        <defs>
          <filter
            id={grainFilterId}
            x="-8%"
            y="-8%"
            width="116%"
            height="116%"
            colorInterpolationFilters="sRGB"
          >
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.85"
              numOctaves="3"
              seed="23"
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="0.65"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>
      <div className="w-full max-w-[min(28rem,calc(100%-1rem))] text-left md:max-w-[min(32rem,88%)]">
        <p
          className="split-about-latin text-[15px] font-medium uppercase tracking-[0.12em] md:text-[17px]"
          style={{ color: PROMO_TAG_COLOR }}
        >
          [PROMO 05.18-05.24]
        </p>
        <p className="split-about-latin mt-1.5 text-[14px] font-medium uppercase tracking-[0.32em] text-black md:mt-2 md:text-[16px]">
          2026 ONENESS WORSHIP
        </p>
        <h2
          className="split-about-headline split-about-headline-heavy mt-[clamp(3rem,10vw,5.5rem)] max-w-full text-[clamp(2.35rem,5.8vw,3.15rem)] uppercase leading-none tracking-[0.04em] text-black md:mt-[clamp(4.25rem,14vw,7.5rem)] md:text-[clamp(2.75rem,min(3.45vw+1.2rem),3.5rem)] md:whitespace-nowrap"
          style={{ filter: `url(#${grainFilterId})` }}
        >
          ONE HEART, ONE SOUND
        </h2>
        <div className="split-about-body mt-8 max-w-[36rem] text-[17px] font-normal leading-[1.55] text-black md:mt-10 md:text-[20px] md:leading-[1.58]">
          <p>
            하나 된 마음과 하나의 소리로 높여드리는 시간,
            <br />
            2026 ONENESS WORSHIP 자리에 여러분을 초대합니다.
          </p>
          <p className="mt-3.5 md:mt-4">
            5월 18일부터 단 7일간 진행되는
            <br />
            얼리버드 혜택으로 가장 먼저 함께하세요.
          </p>
        </div>
        <Link
          href="/ticket"
          aria-label="티켓 페이지로 이동"
          className="split-about-latin group mt-14 inline-flex flex-col items-start gap-1.5 text-black md:mt-16"
        >
          <span className="text-[12px] font-semibold uppercase tracking-[0.28em] transition-opacity group-hover:opacity-55 md:text-[13px]">
            GET TICKET
          </span>
          <svg
            width="96"
            height="10"
            viewBox="0 0 96 10"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-black"
            aria-hidden
          >
            <path
              d="M0 8 H76 L86 1.5"
              stroke="currentColor"
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Link>
      </div>
    </>
  );
}
