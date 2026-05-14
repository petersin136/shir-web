"use client";

import Link from "next/link";
import { useId } from "react";

const SPLIT_SOURCE_RED = "#C0504D";

export function HomeSplitAboutRight() {
  const grainFilterId = `split-headline-grain-${useId().replace(/:/g, "")}`;

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
              seed="19"
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
          style={{ color: SPLIT_SOURCE_RED }}
        >
          [THE SOURCE]
        </p>
        <p className="split-about-latin mt-1.5 text-[14px] font-medium uppercase tracking-[0.32em] text-black md:mt-2 md:text-[16px]">
          WHERE THE SONG BURSTS FORTH
        </p>
        <h2
          className="split-about-headline split-about-headline-heavy mt-[clamp(3rem,10vw,5.5rem)] max-w-full text-[clamp(2.35rem,5.8vw,3.15rem)] uppercase leading-none tracking-[0.04em] text-black md:mt-[clamp(4.25rem,14vw,7.5rem)] md:text-[clamp(2.75rem,min(3.45vw+1.2rem),3.5rem)] md:whitespace-nowrap"
          style={{ filter: `url(#${grainFilterId})` }}
        >
          SONG TO SING FOREVER
        </h2>
        <div className="split-about-body mt-8 max-w-[36rem] text-[17px] font-normal leading-[1.55] text-black md:mt-10 md:text-[20px] md:leading-[1.58]">
          <p>
            쉬르는 구원의 감격에서 견딜 수 없어 터져 나온 노래,
            <br />
            십자가의 은혜를 맛본 자가 영원히 부를 수 밖에 없는 노래입니다.
          </p>
          <p className="mt-3.5 md:mt-4">
            쉬르밴드는 그 구원의 노래를 이 시대에 함께 부르고
            <br />
            함께 선포하는 찬양 공동체입니다.
          </p>
        </div>
        <Link
          href="/about"
          aria-label="About 페이지로 이동"
          className="split-about-latin group mt-14 inline-flex flex-col items-start gap-1.5 text-black md:mt-16"
        >
          <span className="text-[12px] font-semibold uppercase tracking-[0.28em] transition-opacity group-hover:opacity-55 md:text-[13px]">
            MORE
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
