"use client";

import { SplitSectionCta } from "@/components/SplitSectionCta";

export function HomeSplitPromoLeft() {
  return (
    <div className="w-full max-w-full text-left md:max-w-[min(28rem,calc(100%-1rem))] lg:max-w-[min(32rem,88%)]">
      <p
        className="split-about-latin split-about-subtitle split-about-subtitle-bracket text-[13px] font-bold uppercase tracking-[0.1em] md:text-[20px] md:font-normal md:tracking-[0.1em]"
        style={{ color: "#C0504D" }}
      >
        [REGULAR 05.25 - 06.26]
      </p>
      <p className="split-about-latin split-about-subtitle mt-1 text-[12px] font-bold uppercase tracking-[0.2em] text-black md:mt-2 md:text-[20px] md:font-normal md:tracking-[0.1em]">
        2026 ONENESS WORSHIP
      </p>
      <h2 className="split-about-headline split-about-headline-heavy mt-4 max-w-full text-[clamp(1.15rem,3.6vw,1.45rem)] uppercase leading-[0.95] tracking-[0.03em] text-black md:mt-[clamp(4.25rem,14vw,7.5rem)] md:text-[clamp(2.75rem,min(3.45vw+1.2rem),3.5rem)] md:leading-none md:tracking-[0.04em] md:whitespace-nowrap">
        ONE HEART, ONE SOUND
      </h2>
      <div className="split-about-body mt-5 max-w-[36rem] text-[12px] font-normal leading-[1.5] text-black md:mt-10 md:text-[20px] md:leading-[1.58]">
        <p>
          하나 된 마음과 하나의 소리로 높여드리는 시간,
          <br />
          2026 ONENESS WORSHIP 자리에 여러분을 초대합니다.
        </p>
        <p className="mt-3.5 md:mt-4">
          일반 예매는 6월 26일까지만 진행됩니다.
          <br />
          전석 30,000원으로 지금 함께하세요.
        </p>
      </div>
      <SplitSectionCta href="/ticket" label="GET TICKET" ariaLabel="티켓 페이지로 이동" />
    </div>
  );
}
