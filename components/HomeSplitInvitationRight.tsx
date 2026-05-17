"use client";

import Link from "next/link";

export function HomeSplitInvitationRight() {
  return (
    <div className="w-full max-w-full text-left md:max-w-[min(28rem,calc(100%-1rem))] lg:max-w-[min(32rem,88%)]">
      <div className="split-about-subtitles">
        <p className="split-about-subtitle split-about-subtitle-accent">[INVITATION]</p>
        <p className="split-about-subtitle text-black">MINISTRY PARTNERSHIP</p>
      </div>
      <h2 className="split-about-headline split-about-headline-heavy mt-4 max-w-full text-[clamp(1.15rem,3.6vw,1.45rem)] uppercase leading-[0.95] tracking-[0.03em] text-black md:mt-[clamp(4.25rem,14vw,7.5rem)] md:text-[clamp(2.75rem,min(3.45vw+1.2rem),3.5rem)] md:leading-none md:tracking-[0.04em] md:whitespace-nowrap">
        THE CALLING
      </h2>
      <div className="split-about-body mt-5 max-w-[36rem] text-[12px] font-normal leading-[1.5] text-black md:mt-10 md:text-[20px] md:leading-[1.58]">
        <p>
          예배의 회복이 필요한 곳 어디든, 쉬르밴드가 함께합니다.
          <br />
          다음 세대를 깨우는 그 걸음에 우리를 초대해 주세요.
        </p>
        <p className="mt-3.5 md:mt-4">
          주님의 교회와 삶의 자리에 진정한 예배가 회복되길
          <br />
          기도하며 기다립니다.
        </p>
      </div>
      <Link
        href="/apply"
        aria-label="사역 파트너십 신청 페이지로 이동"
        className="split-about-latin group mt-8 inline-flex flex-col items-start gap-1 text-black md:mt-16 md:gap-1.5"
      >
        <span className="text-[10px] font-semibold uppercase tracking-[0.22em] transition-opacity group-hover:opacity-55 md:text-[13px] md:tracking-[0.28em]">
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
  );
}
