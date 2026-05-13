// app/page.tsx - Home page component
import { Splash } from "@/components/Splash";
import { BackgroundVideo } from "@/components/BackgroundVideo";
import Image from "next/image";

const ETERNAL_PRAISE_BG_PC =
  "https://ewaqnqzivdceurhjxgpf.supabase.co/storage/v1/object/public/assets/A_cinematic_hero_banner_image_in_ultra_high_resolu-1778660492592.png";

// 모바일용 배경 (텍스트가 빠진 마이크 이미지만)
const ETERNAL_PRAISE_BG_MOBILE =
  "https://ewaqnqzivdceurhjxgpf.supabase.co/storage/v1/object/public/assets/Remove_all_text_from_the_bottom_center_area_of_thi-1778661394284.png";

const SHIRBAND_WHITE_LOGO =
  "https://ewaqnqzivdceurhjxgpf.supabase.co/storage/v1/object/public/assets/SHIRBAND%20Sub%20Logotype%2003_WHITE(500).png";

// 데스크탑 이미지에 박혀있는 "ETERNAL PRAISE" 타이포와 동일한 인상을 내는 폰트 스택
// (Impact / Bebas Neue / Anton 계열 — 헤비 + 컨덴스드 디스플레이)
const DISPLAY_FONT_STACK =
  '"Impact", "Bebas Neue", "Anton", "Helvetica Neue Condensed Bold", "Arial Narrow Bold", sans-serif';

export default function HomePage() {
  return (
    <>
      <Splash />
      {/* 히어로 배경: SHIRBAND 이미지 (오버레이 없이 원본 색감 유지) */}
      <BackgroundVideo overlayOpacity={0} />
      <main className="relative">
        {/* HERO 섹션 - 한 화면 가득 (버튼만 노출) */}
        <section className="relative h-[calc(100dvh-3rem)] sm:h-[calc(100dvh-3.5rem)] text-white flex items-end justify-center pb-12 sm:pb-20">
          <div className="relative z-10 w-full flex flex-col gap-3 items-center justify-center max-w-md mx-auto px-3 sm:px-6">
            <a
              href="/about"
              className="w-full border border-white/30 bg-white/10 backdrop-blur-sm px-6 py-3 text-sm sm:text-base rounded-lg hover:bg-white/20 hover:border-white/50 transition-all text-center"
            >
              About Us
            </a>
            <a
              href="/events"
              className="w-full border border-white/30 bg-white/10 backdrop-blur-sm px-6 py-3 text-sm sm:text-base rounded-lg hover:bg-white/20 hover:border-white/50 transition-all text-center"
            >
              Ministry
            </a>
          </div>
        </section>

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
            width={500}
            height={130}
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
            width={500}
            height={130}
            className="md:w-44 lg:w-48 h-auto"
          />
        </div>
      </section>
      </main>
    </>
  );
}
