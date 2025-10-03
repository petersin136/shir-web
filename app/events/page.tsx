// app/events/page.tsx
import { BackgroundVideo } from "@/components/BackgroundVideo";

export default function EventsPage() {
  return (
    <>
      <BackgroundVideo overlayOpacity={0.85} />
      <main className="relative mx-auto max-w-4xl px-6 py-16">
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-wide uppercase mb-12">
          Ministry
        </h1>

        <div className="space-y-12">
          {/* 2026 METANOIA 컨퍼런스 */}
          <section className="bg-white/5 rounded-lg p-6 sm:p-8 border border-white/10">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-wide mb-6">
              2026 METANOIA 컨퍼런스
            </h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-white mb-2">일시</h3>
                <p className="text-base sm:text-lg text-white/90">2026년 1월 26일 ~ 28일</p>
              </div>
              
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-white mb-2">장소</h3>
                <p className="text-base sm:text-lg text-white/90">포천중앙침례교회</p>
              </div>
              
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-white mb-2">Speaker</h3>
                <div className="space-y-2">
                  <p className="text-base sm:text-lg text-white/90">김용의 선교사</p>
                  <p className="text-base sm:text-lg text-white/90">송바울(Dr. One. K)</p>
                  <p className="text-base sm:text-lg text-white/90">스캇브레너 목사</p>
                </div>
              </div>
            </div>
            
            <div className="mt-8">
              <a
                href="/metanoia-2026"
                className="inline-block bg-white text-black font-bold py-3 px-8 rounded-lg hover:bg-white/90 transition-colors"
              >
                자세히 보기
              </a>
            </div>
          </section>

          {/* 2026 ONENESS Worship */}
          <section className="bg-white/5 rounded-lg p-6 sm:p-8 border border-white/10">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-wide mb-6">
              2026 ONENESS Worship
            </h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-white mb-2">일시</h3>
                <p className="text-base sm:text-lg text-white/90">2026년 6월 27일</p>
              </div>
              
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-white mb-2">장소</h3>
                <p className="text-base sm:text-lg text-white/90">추후 공지</p>
              </div>
            </div>
            
            <div className="mt-8">
              <a
                href="/oneness"
                className="inline-block bg-white text-black font-bold py-3 px-8 rounded-lg hover:bg-white/90 transition-colors"
              >
                자세히 보기
              </a>
            </div>
          </section>

          {/* 추가 정보 */}
          <section className="text-center">
            <p className="text-base sm:text-lg text-white/80 font-medium">
              더 자세한 정보와 등록은 각 사역 페이지에서 확인하실 수 있습니다.
            </p>
          </section>
        </div>
      </main>
    </>
  );
}
