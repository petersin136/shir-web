// app/oneness/page.tsx
import { BackgroundVideo } from "@/components/BackgroundVideo";

export default function OnenessPage() {
  return (
    <>
      <BackgroundVideo overlayOpacity={0.85} />
      <main className="relative mx-auto max-w-4xl px-6 py-16">
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-wide uppercase mb-10">
          ONENESS Worship
        </h1>

        <p className="text-base sm:text-lg md:text-xl leading-relaxed text-white font-medium mb-12">
          깨어졌던 개인과 교회와 열방이 하나님과 하나되고 개인과 개인이 교회와 교회가 더 나아가 남.북한이 성령안에서 복음으로 하나되길 기도하고 예배하는 사역을 합니다.
        </p>

        <section className="space-y-10">
          <div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-normal mb-6">
              Vision
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-white font-medium mb-4">
              &ldquo;그들이 다 하나가 되어 아버지께서 내 안에, 내가 아버지 안에 있는 것 같이 그들도 우리 안에 있어 세상으로 아버지께서 나를 보내신 것을 믿게 하옵소서&rdquo;
            </p>
            <p className="text-sm sm:text-base md:text-lg text-white/80 font-medium mb-6">
              요한복음 17:21
            </p>
            <p className="text-base sm:text-lg text-white font-medium">
              분열되고 깨어진 개인과 교회, 나아가 남북한이 예수 그리스도 안에서 하나 되어 하나님의 영광을 드러내는 것입니다.
            </p>
          </div>

          <div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-normal mb-6">
              Mission
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-white font-medium mb-4">
              &ldquo;성령이 하나 되게 하신 것을 힘써 지키라&rdquo;
            </p>
            <p className="text-sm sm:text-base md:text-lg text-white/80 font-medium mb-6">
              에베소서 4:3
            </p>
            <p className="text-base sm:text-lg text-white font-medium">
              성령 안에서 연합 예배를 통해 개인과 교회의 회복과 치유를 경험하며, 복음으로 하나 되는 통일 한국을 준비하는 예배 사역을 감당합니다.
            </p>
          </div>

          <div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-normal mb-6">
              Values
            </h2>
            <ul className="space-y-4 text-base sm:text-lg text-white font-medium">
              <li>• <strong>회복(Restoration)</strong> - 하나님과의 관계 회복을 통한 개인과 공동체의 치유</li>
              <li>• <strong>연합(Unity)</strong> - 성령 안에서 교회와 교회, 개인과 개인의 진정한 하나 됨</li>
              <li>• <strong>화해(Reconciliation)</strong> - 복음을 통한 남북한의 영적 통일과 화해</li>
              <li>• <strong>예배(Worship)</strong> - 삼위일체 하나님께 드리는 신령과 진정의 예배</li>
              <li>• <strong>소망(Hope)</strong> - 재림하실 예수 그리스도를 바라보는 종말론적 소망</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-normal mb-6">
              일정
            </h2>
            <div className="bg-white/5 rounded-lg p-6 sm:p-8 border border-white/10">
              <p className="text-xl sm:text-2xl md:text-3xl text-white font-bold text-center">
                2026년 6월
              </p>
              <p className="text-base sm:text-lg text-white/80 text-center mt-4">
                자세한 일정은 추후 공지 예정입니다.
              </p>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
