// app/page.tsx - Home page component
import { Splash } from "@/components/Splash";
import { BackgroundVideo } from "@/components/BackgroundVideo";
import Image from "next/image";
import { Bebas_Neue, IBM_Plex_Mono, Inter } from "next/font/google";
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

/** About 서브타이틀 — [THE SOURCE] / WHERE THE SONG BURSTS FORTH */
const splitSubtitleFont = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["500"],
  variable: "--font-split-subtitle",
  display: "swap",
});

const splitPanelClass = [
  "split-about-panel",
  splitHeadlineFont.variable,
  splitLatinFont.variable,
  splitSubtitleFont.variable,
  "flex h-full min-h-0 w-full min-w-0 flex-col items-center justify-center bg-[#FAFAFA]",
  "px-3 py-8 sm:px-5 sm:py-10 md:px-6 md:py-10 lg:px-10",
].join(" ");

const ETERNAL_PRAISE_BG_PC =
  "https://ewaqnqzivdceurhjxgpf.supabase.co/storage/v1/object/public/assets/A_cinematic_hero_banner_image_in_ultra_high_resolu-1778660492592.png";

// 모바일용 배경 (텍스트가 빠진 마이크 이미지만)
const ETERNAL_PRAISE_BG_MOBILE =
  "https://ewaqnqzivdceurhjxgpf.supabase.co/storage/v1/object/public/assets/Remove_all_text_from_the_bottom_center_area_of_thi-1778661394284.png";

const SHIRBAND_WHITE_LOGO =
  "https://ewaqnqzivdceurhjxgpf.supabase.co/storage/v1/object/public/assets/SHIRBAND%20Sub%20Logotype%2002_WHITE(1000X1000).png";

/** SPLIT 레이아웃 좌·우 이미지 */
const SPLIT_LAYOUT_IMG_1_PC =
  "https://ewaqnqzivdceurhjxgpf.supabase.co/storage/v1/object/public/assets/SHIRBAND_SPLIT%20LAYOUT%20IMG%201_PC.jpg";
const SPLIT_LAYOUT_IMG_2_PC =
  "https://ewaqnqzivdceurhjxgpf.supabase.co/storage/v1/object/public/assets/SHIRBAND_SPLIT%20LAYOUT%20IMG%202_PC.jpg";
const SPLIT_LAYOUT_IMG_3_PC =
  "https://ewaqnqzivdceurhjxgpf.supabase.co/storage/v1/object/public/assets/SHIRBAND_SPLIT%20LAYOUT%20IMG%203_PC.jpg";

const splitImageSizes = "(max-width: 768px) 30vw, 55vw";

// 데스크탑 이미지에 박혀있는 "ETERNAL PRAISE" 타이포와 동일한 인상을 내는 폰트 스택
// (Impact / Bebas Neue / Anton 계열 — 헤비 + 컨덴스드 디스플레이)
const DISPLAY_FONT_STACK =
  '"Impact", "Bebas Neue", "Anton", "Helvetica Neue Condensed Bold", "Arial Narrow Bold", sans-serif';

/** 구간 사이 흰 띠 — 모바일 짧게, md+ 140px */
const sectionGapClass =
  "h-12 w-full shrink-0 bg-white md:h-[140px] md:min-h-[140px]";

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

        {/* 메인 배너 바로 아래 흰 띠 — 모바일 짧게, md+ 140px */}
        <div className={sectionGapClass} aria-hidden />

        {/* SPLIT: 모바일 검 30% / 흰 70%, md+ 55/45 */}
        <section className="relative w-full bg-white">
          <div
            className="grid w-full grid-cols-[minmax(0,30fr)_minmax(0,70fr)] items-stretch min-h-0 md:grid-cols-[minmax(0,55fr)_minmax(0,45fr)] md:min-h-[700px] md:max-h-[800px] md:h-[clamp(700px,min(800px,calc(100vw*760/1920)),800px)]"
          >
            <div className="relative min-h-0 w-full min-w-0 self-stretch overflow-hidden bg-black">
              <Image
                src={SPLIT_LAYOUT_IMG_1_PC}
                alt=""
                fill
                className="object-cover object-center"
                sizes={splitImageSizes}
              />
            </div>
            <div className={splitPanelClass}>
              <HomeSplitAboutRight />
            </div>
          </div>
        </section>

        {/* 구간 사이 흰 띠 */}
        <div className={sectionGapClass} aria-hidden />

        {/* SPLIT 2: 모바일 흰 70% / 검 30%, md+ 45/55 */}
        <section className="relative w-full bg-white">
          <div
            className="grid w-full grid-cols-[minmax(0,70fr)_minmax(0,30fr)] items-stretch min-h-0 md:grid-cols-[minmax(0,45fr)_minmax(0,55fr)] md:min-h-[700px] md:max-h-[800px] md:h-[clamp(700px,min(800px,calc(100vw*760/1920)),800px)]"
          >
            <div
              className={splitPanelClass}
            >
              <HomeSplitPromoLeft />
            </div>
            <div className="relative min-h-0 w-full min-w-0 self-stretch overflow-hidden bg-black">
              <Image
                src={SPLIT_LAYOUT_IMG_2_PC}
                alt=""
                fill
                className="object-cover object-center"
                sizes={splitImageSizes}
              />
            </div>
          </div>
        </section>

        <div className={sectionGapClass} aria-hidden />

        {/* SPLIT 3: 모바일 검 30% / 흰 70%, md+ 55/45 */}
        <section className="relative w-full bg-white">
          <div
            className="grid w-full grid-cols-[minmax(0,30fr)_minmax(0,70fr)] items-stretch min-h-0 md:grid-cols-[minmax(0,55fr)_minmax(0,45fr)] md:min-h-[700px] md:max-h-[800px] md:h-[clamp(700px,min(800px,calc(100vw*760/1920)),800px)]"
          >
            <div className="relative min-h-0 w-full min-w-0 self-stretch overflow-hidden bg-black">
              <Image
                src={SPLIT_LAYOUT_IMG_3_PC}
                alt=""
                fill
                className="object-cover object-center"
                sizes={splitImageSizes}
              />
            </div>
            <div className={splitPanelClass}>
              <HomeSplitInvitationRight />
            </div>
          </div>
        </section>

        <div className={sectionGapClass} aria-hidden />

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

        <div className={sectionGapClass} aria-hidden />
      </main>
    </>
  );
}
