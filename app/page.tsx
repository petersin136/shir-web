// app/page.tsx - Home page component
import type { CSSProperties } from "react";
import { Splash } from "@/components/Splash";
import { BackgroundVideo } from "@/components/BackgroundVideo";
import Image from "next/image";
import { Bebas_Neue, Inter } from "next/font/google";
import { HomeSplitAboutRight } from "@/components/HomeSplitAboutRight";
import { HomeSplitPromoLeft } from "@/components/HomeSplitPromoLeft";
import { HomeSplitInvitationRight } from "@/components/HomeSplitInvitationRight";

/** SPLIT 헤드라인 — 레퍼런스: 각진 콘덴스드(Bebas, Rubik보다 덜 둥글게) */
const splitHeadlineFont = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-split-headline",
  display: "swap",
});

/** 태그라인·MORE 등 라틴 소제 */
const splitLatinFont = Inter({
  subsets: ["latin"],
  weight: ["500", "600"],
  variable: "--font-split-latin",
  display: "swap",
});

const ETERNAL_PRAISE_BG_PC =
  "https://ewaqnqzivdceurhjxgpf.supabase.co/storage/v1/object/public/assets/A_cinematic_hero_banner_image_in_ultra_high_resolu-1778660492592.png";

// 모바일용 배경 (텍스트가 빠진 마이크 이미지만)
const ETERNAL_PRAISE_BG_MOBILE =
  "https://ewaqnqzivdceurhjxgpf.supabase.co/storage/v1/object/public/assets/Remove_all_text_from_the_bottom_center_area_of_thi-1778661394284.png";

const SHIRBAND_WHITE_LOGO =
  "https://ewaqnqzivdceurhjxgpf.supabase.co/storage/v1/object/public/assets/SHIRBAND%20Sub%20Logotype%2002_WHITE(1000X1000).png";

// 데스크탑 이미지에 박혀있는 "ETERNAL PRAISE" 타이포와 동일한 인상을 내는 폰트 스택
// (Impact / Bebas Neue / Anton 계열 — 헤비 + 컨덴스드 디스플레이)
const DISPLAY_FONT_STACK =
  '"Impact", "Bebas Neue", "Anton", "Helvetica Neue Condensed Bold", "Arial Narrow Bold", sans-serif';

/** PC(md+) 구간 사이 세로 여백 — 디자인 스펙: 140px, #FFFFFF (Tailwind 이슈 방지용 인라인) */
const PC_SECTION_GAP: CSSProperties = {
  height: 140,
  minHeight: 140,
  backgroundColor: "#ffffff",
};

export default function HomePage() {
  return (
    <>
      <Splash />
      {/* 히어로 배경: 모바일은 헤더 아래부터 채워 상단 검정 여백 제거, contain + object-top */}
      <BackgroundVideo
        overlayOpacity={0}
        mobileFit="contain"
        bgColor="#000000"
        mobileObjectClass="object-top"
        className="fixed -z-10 left-0 right-0 top-12 bottom-0 sm:top-14 md:inset-0"
      />
      <main className="relative z-10">
        {/* HERO 섹션 - 한 화면 가득 (배경만 노출) */}
        <section className="relative h-[calc(100dvh-3rem)] sm:h-[calc(100dvh-3.5rem)]" />

        {/* 메인 배너 바로 아래 여백 (세로 140px, #FFFFFF) — 모바일·데스크탑 동일 스펙 */}
        <div
          className="h-[140px] w-full shrink-0 bg-white"
          aria-hidden
        />

        {/* SPLIT: 55:45 = minmax(0,55fr):minmax(0,45fr) — 컬럼이 넘칠 때도 비율 유지 */}
        <section className="relative w-full bg-white">
          <div
            className="grid w-full grid-cols-1 md:grid-cols-[minmax(0,55fr)_minmax(0,45fr)] md:min-h-[700px] md:max-h-[800px] md:h-[clamp(700px,min(800px,calc(100vw*760/1920)),800px)]"
          >
            <div
              className="min-h-[200px] w-full min-w-0 bg-black md:min-h-0"
              aria-hidden
            />
            {/* 우측: 순백 */}
            <div
              className={`split-about-panel ${splitHeadlineFont.variable} ${splitLatinFont.variable} flex min-h-[min(90vw,420px)] w-full min-w-0 flex-col items-center justify-center bg-white px-6 py-14 sm:px-8 sm:py-16 md:min-h-0 md:px-6 md:py-10 lg:px-10`}
            >
              <HomeSplitAboutRight />
            </div>
          </div>
        </section>

        {/* PC: 구간 사이 세로 여백 140px #FFFFFF */}
        <div
          className="hidden w-full shrink-0 md:block"
          style={PC_SECTION_GAP}
          aria-hidden
        />

        {/* SPLIT 2: 지그재그 — 흰 45% | 검 55% (첫 스플릿과 동일 비중, 좌우만 반전) */}
        <section className="relative w-full bg-white">
          <div
            className="grid w-full grid-cols-1 md:grid-cols-[minmax(0,45fr)_minmax(0,55fr)] md:min-h-[700px] md:max-h-[800px] md:h-[clamp(700px,min(800px,calc(100vw*760/1920)),800px)]"
          >
            <div
              className={`split-about-panel ${splitHeadlineFont.variable} ${splitLatinFont.variable} flex min-h-[min(90vw,420px)] w-full min-w-0 flex-col items-center justify-center bg-white px-6 py-14 sm:px-8 sm:py-16 md:min-h-0 md:px-6 md:py-10 lg:px-10`}
            >
              <HomeSplitPromoLeft />
            </div>
            <div
              className="min-h-[200px] w-full min-w-0 bg-black md:min-h-0"
              aria-hidden
            />
          </div>
        </section>

        <div
          className="hidden w-full shrink-0 md:block"
          style={PC_SECTION_GAP}
          aria-hidden
        />

        {/* SPLIT 3: 지그재그 — 검 55% | 흰 45% (첫 스플릿과 동일 비중·행 높이) */}
        <section className="relative w-full bg-white">
          <div
            className="grid w-full grid-cols-1 md:grid-cols-[minmax(0,55fr)_minmax(0,45fr)] md:min-h-[700px] md:max-h-[800px] md:h-[clamp(700px,min(800px,calc(100vw*760/1920)),800px)]"
          >
            <div
              className="order-2 min-h-[200px] w-full min-w-0 bg-black md:order-1 md:min-h-0"
              aria-hidden
            />
            <div
              className={`split-about-panel order-1 ${splitHeadlineFont.variable} ${splitLatinFont.variable} flex min-h-[min(90vw,420px)] w-full min-w-0 flex-col items-center justify-center bg-white px-6 py-14 sm:px-8 sm:py-16 md:order-2 md:min-h-0 md:px-6 md:py-10 lg:px-10`}
            >
              <HomeSplitInvitationRight />
            </div>
          </div>
        </section>

        <div
          className="hidden w-full shrink-0 md:block"
          style={PC_SECTION_GAP}
          aria-hidden
        />

      {/* 히어로 아래 섹션 - ETERNAL PRAISE 배너 */}
      <section className="relative h-[calc(100dvh-3rem)] sm:h-[calc(100dvh-3.5rem)] bg-black overflow-hidden">
        {/* 배경 이미지: 데스크탑은 텍스트 포함 원본, 모바일은 마이크만 (텍스트 빠진 버전) */}
        <Image
          src={ETERNAL_PRAISE_BG_PC}
          alt="Eternal Praise"
          fill
          sizes="100vw"
          className="hidden md:block object-cover"
        />
        <Image
          src={ETERNAL_PRAISE_BG_MOBILE}
          alt="Eternal Praise"
          fill
          sizes="100vw"
          className="block md:hidden object-cover"
        />

        {/* ───── 모바일 전용 레이아웃 (상단부터 ETERNAL PRAISE → 슬로건 → 로고) ───── */}
        <div className="md:hidden absolute z-10 top-6 left-6 right-6 space-y-5">
          {/* ETERNAL PRAISE 스택드 타이포 */}
          <h2
            className="text-white uppercase leading-[0.85]"
            style={{
              fontFamily: DISPLAY_FONT_STACK,
              fontWeight: 900,
              letterSpacing: "0.01em",
            }}
          >
            <span
              className="block"
              style={{ fontSize: "clamp(3rem, 16vw, 4.5rem)" }}
            >
              ETERNAL
            </span>
            <span
              className="block"
              style={{ fontSize: "clamp(3rem, 16vw, 4.5rem)" }}
            >
              PRAISE
            </span>
          </h2>

          {/* 슬로건 */}
          <div className="max-w-[260px]">
            <p className="text-white font-light italic text-sm tracking-wider leading-relaxed mb-1.5">
              Praising the triune God.
              <br />
              Worshiping Christ alone.
            </p>
            <div className="w-8 h-px bg-white/40 my-2" />
            <p className="text-white/65 font-light text-[11px] tracking-wide leading-relaxed">
              삼위일체 하나님을 찬양하고,
              <br />
              오직 그리스도만을 경배합니다.
            </p>
          </div>

          {/* SHIRBAND 로고 */}
          <Image
            src={SHIRBAND_WHITE_LOGO}
            alt="SHIR BAND"
            width={1000}
            height={1000}
            className="w-28 h-auto"
          />
        </div>

        {/* ───── 데스크탑 전용 — 좌측 하단 슬로건 + 로고 (격자 라인 끝에 맞춤) ───── */}
        <div className="hidden md:block absolute z-10 md:bottom-32 md:left-20 lg:bottom-40 lg:left-28 md:max-w-md">
          <div className="mb-6 md:mb-7">
            <p className="text-white font-light italic text-base md:text-lg lg:text-xl tracking-wider leading-relaxed mb-2">
              Praising the triune God.
              <br />
              Worshiping Christ alone.
            </p>
            <div className="w-10 md:w-12 h-px bg-white/40 my-2.5" />
            <p className="text-white/65 font-light text-xs md:text-sm tracking-wide leading-relaxed">
              삼위일체 하나님을 찬양하고,
              <br />
              오직 그리스도만을 경배합니다.
            </p>
          </div>
          <Image
            src={SHIRBAND_WHITE_LOGO}
            alt="SHIR BAND"
            width={1000}
            height={1000}
            className="md:w-44 lg:w-48 h-auto"
          />
        </div>
      </section>
      </main>
    </>
  );
}
