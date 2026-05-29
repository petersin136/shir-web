"use client";

import { SplitSectionCta } from "@/components/SplitSectionCta";

export function HomeSplitAboutRight() {
  return (
    <div className="w-full max-w-full text-left md:max-w-[min(28rem,calc(100%-1rem))] lg:max-w-[min(32rem,88%)]">
      <p
        className="split-about-latin split-about-subtitle split-about-subtitle-bracket text-[13px] font-bold uppercase tracking-[0.1em] md:text-[20px] md:font-normal md:tracking-[0.1em]"
        style={{ color: "#C0504D" }}
      >
        [THE SOURCE]
      </p>
      <p className="split-about-latin split-about-subtitle mt-1 text-[12px] font-bold uppercase tracking-[0.2em] text-black md:mt-2 md:text-[20px] md:font-normal md:tracking-[0.1em]">
        WHERE THE SONG BURSTS FORTH
      </p>
      <h2 className="split-about-headline split-about-headline-heavy mt-4 max-w-full text-[clamp(1.15rem,3.6vw,1.45rem)] uppercase leading-[0.95] tracking-[0.03em] text-black md:mt-[clamp(4.25rem,14vw,7.5rem)] md:text-[clamp(2.75rem,min(3.45vw+1.2rem),3.5rem)] md:leading-none md:tracking-[0.04em] md:whitespace-nowrap">
        SONG TO SING FOREVER
      </h2>
      <div className="split-about-body mt-5 max-w-[36rem] text-[12px] font-normal leading-[1.5] text-black md:mt-10 md:text-[20px] md:leading-[1.58]">
        <p>
          쉬르는 구원의 감격에서 견딜 수 없어 터져 나온 노래,
          <br />
          십자가의 은혜를 맛본 자가 영원히 부를 수 밖에 없는
          <br />
          노래입니다.
        </p>
        <p className="mt-3.5 md:mt-4">
          쉬르밴드는 그 구원의 노래를 이 시대에 함께 부르고
          <br />
          함께 선포하는 찬양 공동체입니다.
        </p>
      </div>
      <SplitSectionCta href="/about" label="MORE" ariaLabel="About 페이지로 이동" />
    </div>
  );
}
