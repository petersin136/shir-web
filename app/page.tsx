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

/** SPLIT 서브타이틀 — [THE SOURCE] / WHERE THE SONG BURSTS FORTH (PC: IBM Plex Mono Text 450) */
const splitSubtitleFont = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
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

/** SPLIT 레이아웃 좌·우 이미지 */
const SPLIT_LAYOUT_IMG_1_PC =
  "https://ewaqnqzivdceurhjxgpf.supabase.co/storage/v1/object/public/assets/SHIRBAND_SPLIT%20LAYOUT%20IMG%201_PC.jpg";
const SPLIT_LAYOUT_IMG_2_PC =
  "https://ewaqnqzivdceurhjxgpf.supabase.co/storage/v1/object/public/assets/SHIRBAND_SPLIT%20LAYOUT%20IMG%202_PC.jpg";
const SPLIT_LAYOUT_IMG_3_PC =
  "https://ewaqnqzivdceurhjxgpf.supabase.co/storage/v1/object/public/assets/SHIRBAND_SPLIT%20LAYOUT%20IMG%203_PC.jpg";

const splitImageSizes = "(max-width: 768px) 30vw, 55vw";

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
      </main>
    </>
  );
}
