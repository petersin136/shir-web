// app/page.tsx
import { createClient } from "@supabase/supabase-js";
import { BackgroundVideo } from "@/components/BackgroundVideo";
import { Splash } from "@/components/Splash";
import Image from "next/image";

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
      <Splash />
      <BackgroundVideo overlayOpacity={s.overlay_opacity ?? 0.5} />
      <main className="relative">
        {/* HERO 섹션 */}
        <section className="relative h-[80vh] text-white flex items-center justify-center">

        {/* 가운데 텍스트 */}
        <div className="relative z-10 text-center px-3 sm:px-6">
          {/* 히어로 제목 */}
          <h1 className="text-3xl sm:text-6xl md:text-8xl lg:text-9xl font-bold tracking-wide leading-tight mb-6 sm:mb-8">
            SHIR BAND
          </h1>

          {/* 로고 */}
          <div className="flex justify-center mb-8 sm:mb-12">
            <div className="bg-white rounded-lg p-4 sm:p-6 shadow-2xl">
              <Image
                src="https://ewaqnqzivdceurhjxgpf.supabase.co/storage/v1/object/public/assets/shir-logo.png"
                alt="SHIR BAND Logo"
                width={120}
                height={120}
                className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 object-contain"
                priority
              />
            </div>
          </div>

          {/* 새로운 설명 텍스트 */}
          <div className="space-y-6 sm:space-y-8 mb-6 sm:mb-12">
            <p className="text-base sm:text-xl md:text-2xl lg:text-3xl leading-relaxed sm:leading-loose md:leading-loose max-w-4xl mx-auto font-light text-white/95" style={{lineHeight: '1.8'}}>
              SHIR BAND는 교회와 한국, 나아가 열방에<br />
              삼위일체 하나님을 찬양하고 선포합니다.<br />
              오직 유일한 구주이신 예수그리스도만을 예배합니다.
            </p>
          </div>

          <div className="mt-4 sm:mt-8 flex flex-col gap-3 items-center justify-center max-w-md mx-auto">
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
        </div>
      </section>
      </main>
    </>
  );
}
