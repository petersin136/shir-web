// app/oneness/page.tsx
import { BackgroundVideo } from "@/components/BackgroundVideo";

export default function OnenessPage() {
  return (
    <>
      <BackgroundVideo overlayOpacity={0.85} />
      <main className="relative mx-auto max-w-4xl px-6 py-16">
        <div className="space-y-8 mb-12">
          {/* 성경구절 섹션 */}
          <div className="space-y-6">
            <div>
              <p className="text-base sm:text-lg md:text-xl leading-loose text-white font-light mb-4" style={{lineHeight: '1.8'}}>
                &ldquo;아버지여, 아버지께서 내안에, 내가 아버지 안에 있는 것 같이 그들도 다 하나가 되어 우리 안에 있게 하사 세상으로 아버지께서 나를 보내시 것을 믿게 하옵소서&rdquo;
              </p>
              <p className="text-sm sm:text-base text-white/80 font-medium text-right">
                요 17:21
              </p>
            </div>

            <div>
              <p className="text-base sm:text-lg md:text-xl leading-loose text-white font-light mb-4" style={{lineHeight: '1.8'}}>
                &ldquo;평안의 매는 줄로 성령이 하나되게 하신 것을 힘써 지키라&rdquo;
              </p>
              <p className="text-sm sm:text-base text-white/80 font-medium text-right">
                엡 4:3
              </p>
            </div>
          </div>

          <p className="text-base sm:text-lg md:text-xl leading-relaxed text-white font-medium mb-8">
            깨어졌던 개인과 교회와 열방이 하나님과 하나되고 개인과 개인이 교회와 교회가 더 나아가 남.북한이 복음으로 하나되길 기도하고 예배합니다.
          </p>

          <div className="space-y-4">
            <div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-wide uppercase mb-6">
                ONENESS Worship 2026
              </h2>
            </div>
            
            <div>
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold tracking-wide">일시</h3>
              <p className="text-base sm:text-lg md:text-xl text-white font-medium">
                2026년 6월 27일
              </p>
            </div>

            <div>
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold tracking-wide">장소</h3>
              <p className="text-base sm:text-lg md:text-xl text-white font-medium">
                추후 공지
              </p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
