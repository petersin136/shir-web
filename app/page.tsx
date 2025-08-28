// app/page.tsx
import { createClient } from "@supabase/supabase-js";
import Image from "next/image";

type SettingsRow = {
  hero_title: string | null;
  hero_subtitle: string | null;
  hero_video_url: string | null;
  hero_image_url: string | null;
  overlay_opacity: number | null;
  blur_px: number | null;
};

export default async function HomePage() {
  // Supabase 클라이언트(서버 컴포넌트에서도 사용 가능)
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // settings 테이블의 첫 행만 읽기
  const { data } = await supabase
    .from("settings")
    .select("*")
    .limit(1)
    .single();

  const s = (data || {}) as SettingsRow;

  return (
    <main className="relative">
      {/* HERO 섹션 */}
      <section className="relative h-[80vh] text-white flex items-center justify-center">
        {/* 배경 비디오 (URL이 있으면 재생) */}
        {s.hero_video_url && (
          <video
            className="absolute inset-0 w-full h-full object-cover"
            src={s.hero_video_url}
            autoPlay
            muted
            loop
            playsInline
          />
        )}

        {/* 블러 이미지 레이어 (선택) */}
        {s.hero_image_url && (
          <Image
            src={s.hero_image_url}
            alt=""
            fill
            className="object-cover"
            style={{ filter: s.blur_px ? `blur(${s.blur_px}px)` : undefined }}
          />
        )}

        {/* 어둡게 오버레이 */}
        <div
          className="absolute inset-0"
          style={{
            backgroundColor: `rgba(0,0,0,${s.overlay_opacity ?? 0.5})`,
          }}
        />

        {/* 가운데 텍스트 */}
        <div className="relative z-10 text-center px-3 sm:px-6">
          {/* SHIR BAND - 가장 큰 제목 */}
          <h1 className="text-3xl sm:text-6xl md:text-8xl lg:text-9xl font-bold tracking-wide leading-tight mb-2 sm:mb-4">
            SHIR BAND
          </h1>

          {/* SPIRIT & TRUTH WORSHIP - 부제목 */}
          <h2 className="text-lg sm:text-3xl md:text-5xl font-bold tracking-wide leading-tight mb-4 sm:mb-8">
            SPIRIT & TRUTH WORSHIP
          </h2>

          {/* 영어 성경구절 - 큰 크기 */}
          <p className="text-xs sm:text-lg md:text-xl lg:text-2xl leading-snug sm:leading-relaxed mb-3 sm:mb-6 max-w-4xl mx-auto">
            &ldquo;that ye present your bodies a living sacrifice holy acceptable unto God, which is your reasonable service&rdquo;
          </p>

          {/* 한국어 성경구절 - 같은 크기 */}
          <p className="text-xs sm:text-lg md:text-xl lg:text-2xl leading-snug sm:leading-relaxed mb-2 sm:mb-4 max-w-4xl mx-auto">
            &ldquo;너희 몸을 하나님이 기뻐하시는 거룩한 산 제물로 드리라 이는 너희가 드릴 영적 예배니라&rdquo;
          </p>

          {/* 성경 출처 */}
          <p className="text-sm sm:text-base md:text-lg font-medium mb-6 sm:mb-12">
            Romans 12:1
          </p>

          <div className="mt-4 sm:mt-8 flex flex-col sm:flex-row gap-2 sm:gap-4 justify-center">
            <a
              href="/about"
              className="border px-4 py-2 text-sm sm:text-base rounded hover:bg-white hover:text-black transition"
            >
              About Us
            </a>
            <a
              href="/metanoia-2026"
              className="border px-4 py-2 text-sm sm:text-base rounded hover:bg-white hover:text-black transition"
            >
              Metanoia 2026
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
