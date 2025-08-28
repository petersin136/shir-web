
// app/page.tsx
import { createClient } from "@supabase/supabase-js";
import { BackgroundVideo } from "@/components/BackgroundVideo";
import { MetanoiaRegisterButton } from "@/components/MetanoiaRegisterButton";

type SettingsRow = {
  hero_title: string | null;
  hero_subtitle: string | null;
  hero_video_url: string | null;
  hero_image_url: string | null;
  overlay_opacity: number | null;
  blur_px: number | null;
  video_opacity?: number | null;
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
    <>
      <BackgroundVideo overlayOpacity={s.overlay_opacity ?? 0.5} />
      <main className="relative">
        {/* HERO 섹션 */}
        <section className="relative h-[80vh] text-white flex items-center justify-center">

        {/* 가운데 텍스트 */}
        <div className="relative z-10 text-center px-3 sm:px-6">
          {/* 히어로 제목 - 안전한 렌더링 */}
          <h1 className="text-3xl sm:text-6xl md:text-8xl lg:text-9xl font-bold tracking-wide leading-tight mb-2 sm:mb-4">
            SHIR BAND
          </h1>
          <h2 className="text-lg sm:text-3xl md:text-5xl font-bold tracking-wide leading-tight mb-4 sm:mb-8">
            SPIRIT & TRUTH WORSHIP
          </h2>

          {/* 성경구절 - 관리자에서 수정 가능하지만 안전하게 렌더링 */}
          {s.hero_subtitle && s.hero_subtitle.trim() ? (
            <div className="text-xs sm:text-lg md:text-xl lg:text-2xl leading-snug sm:leading-relaxed mb-6 sm:mb-12 max-w-4xl mx-auto">
              {s.hero_subtitle.replace(/\\n/g, ' ').replace(/\n/g, ' ')}
            </div>
          ) : (
            <>
              {/* 기본 영어 성경구절 */}
              <p className="text-xs sm:text-lg md:text-xl lg:text-2xl leading-snug sm:leading-relaxed mb-3 sm:mb-6 max-w-4xl mx-auto">
                <span className="hidden sm:inline">
                  &ldquo;that ye present your bodies a living sacrifice holy acceptable unto God<br />
                  which is your reasonable service&rdquo;
                </span>
                <span className="sm:hidden">
                  &ldquo;that ye present your bodies a living sacrifice<br />
                  holy acceptable unto God which is your reasonable service&rdquo;
                </span>
              </p>

              {/* 기본 한국어 성경구절 */}
              <p className="text-xs sm:text-lg md:text-xl lg:text-2xl leading-snug sm:leading-relaxed mb-2 sm:mb-4 max-w-4xl mx-auto">
                <span className="hidden sm:inline">
                  &ldquo;너희 몸을 하나님이 기뻐하시는 거룩한 산 제물로 드리라 이는 너희가 드릴 영적 예배니라&rdquo;
                </span>
                <span className="sm:hidden">
                  &ldquo;너희 몸을 하나님이 기뻐하시는 거룩한 산 제물로 드리라<br />
                  이는 너희가 드릴 영적 예배니라&rdquo;
                </span>
              </p>

              {/* 기본 성경 출처 */}
              <p className="text-sm sm:text-base md:text-lg font-medium mb-6 sm:mb-12">
                Romans 12:1
              </p>
            </>
          )}

          <div className="mt-4 sm:mt-8 flex flex-col sm:flex-row gap-2 sm:gap-4 justify-center">
            <a
              href="/about"
              className="border px-4 py-2 text-sm sm:text-base rounded hover:bg-white hover:text-black transition"
            >
              About Us
            </a>
            <MetanoiaRegisterButton />
          </div>
        </div>
      </section>
      </main>
    </>
  );
}
