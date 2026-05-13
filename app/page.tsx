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

// 푸터 직전 마지막 섹션 - SONG TO SING FOREVER 그래픽
const SONG_TO_SING_IMAGE =
  "https://ewaqnqzivdceurhjxgpf.supabase.co/storage/v1/object/public/assets/9.12.17.png";
// 이미지의 크림톤 배경과 동일한 색 (이미지에서 직접 샘플링)
const SONG_TO_SING_BG = "#F8F4E9";

// 데스크탑 이미지에 박혀있는 "ETERNAL PRAISE" 타이포와 동일한 인상을 내는 폰트 스택
// (Impact / Bebas Neue / Anton 계열 — 헤비 + 컨덴스드 디스플레이)
const DISPLAY_FONT_STACK =
  '"Impact", "Bebas Neue", "Anton", "Helvetica Neue Condensed Bold", "Arial Narrow Bold", sans-serif';

export default function HomePage() {
  return (
    <>
      <Splash />
      {/* 히어로 배경: SHIRBAND 이미지 (오버레이 없이 원본 색감 유지, 모바일에서는 텍스트 잘리지 않도록 contain) */}
      <BackgroundVideo
        overlayOpacity={0}
        mobileFit="contain"
        bgColor="#E63329"
      />
      <main className="relative">
        {/* HERO 섹션 - 한 화면 가득 (배경만 노출) */}
        <section className="relative h-[calc(100dvh-3rem)] sm:h-[calc(100dvh-3.5rem)]" />

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

      {/* 마지막 섹션 - SONG TO SING FOREVER 그래픽 + 카피 (푸터 직전) */}
      <section
        className="relative w-full pt-12 md:pt-8 pb-12 md:pb-8"
        style={{ backgroundColor: SONG_TO_SING_BG }}
      >
        <div className="flex flex-col md:flex-row md:items-end gap-y-12 md:gap-x-8 lg:gap-x-14 px-6 sm:px-10 md:pl-12 lg:pl-20 xl:pl-28 md:pr-10 lg:pr-16">
          {/* 좌측 - 그래픽 이미지 (위아래 거의 꽉, 자연 비율 그대로) */}
          <div className="w-full md:w-auto md:flex-shrink-0">
            <Image
              src={SONG_TO_SING_IMAGE}
              alt="SHIRBAND — Song to Sing Forever"
              width={2048}
              height={1448}
              sizes="(max-width: 768px) 100vw, 80vh"
              className="block w-full h-auto md:w-auto md:h-[calc(100dvh-3.5rem-4rem)]"
              priority={false}
            />
          </div>

          {/* 우측 - 타이포 카피 (이미지 하단보다 약 3cm 위로 올림) */}
          <div className="w-full md:flex-1 flex flex-col text-neutral-900 md:mb-[120px]">
          {/* 아이브로우 (영문 — 세리프 small caps 느낌) */}
          <p
            className="text-[11px] sm:text-[12px] tracking-[0.45em] uppercase font-light text-neutral-500/80 mb-7 sm:mb-8"
            style={{ fontFamily: "var(--font-serif-en), 'EB Garamond', Georgia, serif" }}
          >
            Song to Sing Forever
          </p>

          {/* 메인 카피 (국문 — 노토 세리프 KR 라이트) */}
          <h2
            className="leading-[1.35] tracking-[-0.01em] text-neutral-900"
            style={{
              fontFamily:
                "var(--font-serif-kr), 'Noto Serif KR', 'Nanum Myeongjo', serif",
              fontWeight: 300,
              fontSize: "clamp(1.75rem, 3vw, 2.625rem)",
            }}
          >
            영원히 부를
            <br />
            구원의 노래
            <span className="text-neutral-400 font-light">…</span>
          </h2>

          {/* 디바이더 */}
          <div className="w-12 h-px bg-neutral-400/60 my-8 sm:my-10" />

          {/* 영문 부카피 (EB Garamond Italic) */}
          <p
            className="leading-[1.7] text-neutral-600 max-w-md"
            style={{
              fontFamily:
                "var(--font-serif-en), 'EB Garamond', Georgia, serif",
              fontStyle: "italic",
              fontWeight: 400,
              fontSize: "clamp(0.95rem, 1.1vw, 1.0625rem)",
              letterSpacing: "0.01em",
            }}
          >
            A song of salvation,
            <br />
            to be sung for eternity.
          </p>

          {/* 푸트노트 (메타 라인) */}
          <p
            className="mt-10 sm:mt-14 text-[10.5px] sm:text-[11px] tracking-[0.4em] uppercase text-neutral-400"
            style={{ fontFamily: "var(--font-serif-en), 'EB Garamond', Georgia, serif" }}
          >
            SHIRBAND · ID 01 / ETERNITY
          </p>
          </div>
        </div>
      </section>
      </main>
    </>
  );
}
