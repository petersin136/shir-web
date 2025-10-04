// app/about/page.tsx
import { BackgroundVideo } from "@/components/BackgroundVideo";
import Image from "next/image";

export default function AboutPage() {
    return (
      <>
        <BackgroundVideo overlayOpacity={0.85} />
        <main className="relative mx-auto max-w-4xl px-6 py-16">
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-wide uppercase mb-10">
          About Us
        </h1>

        {/* 성경구절 섹션 - 맨 위로 이동 */}
        <section className="space-y-8 mb-12">
          <div className="bg-white/5 rounded-lg p-6 sm:p-8 border border-white/10">
            <p className="text-base sm:text-lg md:text-xl leading-loose text-white font-light mb-4" style={{lineHeight: '1.8'}}>
              &ldquo;너희 몸을 하나님이 기뻐하시는 거룩한 산 제물로 드리라 이는 너희가 드릴 영적 예배니라&rdquo;
            </p>
            <p className="text-sm sm:text-base text-white/80 font-medium text-right">
              로마서 12:1
            </p>
          </div>

          <div className="bg-white/5 rounded-lg p-6 sm:p-8 border border-white/10">
            <p className="text-base sm:text-lg md:text-xl leading-loose text-white font-light mb-4" style={{lineHeight: '1.8'}}>
              &ldquo;이 후에 내가 돌아와서 다윗의 무너진 장막을 다시 지으며 또 그 허물어진 것을 다시 지어 일으키리니 이는 그 남은 사람들과 내 이름으로 일컬음을 받는 모든 이방인들로 주를 찾게 하려 함이라 하셨으니&rdquo;
            </p>
            <p className="text-sm sm:text-base text-white/80 font-medium text-right">
              사도행전 15:16-17
            </p>
          </div>
        </section>

        {/* 로고 섹션 */}
        <div className="flex justify-center mb-12">
          <div className="bg-white rounded-lg p-6 sm:p-8 shadow-2xl">
            <Image
              src="https://ewaqnqzivdceurhjxgpf.supabase.co/storage/v1/object/public/assets/shir-logo.png"
              alt="쉬르밴드 로고"
              width={150}
              height={150}
              className="w-24 h-24 sm:w-32 sm:h-32 md:w-36 md:h-36 object-contain"
              priority
            />
          </div>
        </div>

        {/* 쉬르밴드 소개 및 사역 내용 */}
        <section className="space-y-8">
          <div>
            <p className="text-base sm:text-lg md:text-xl leading-relaxed text-white font-medium mb-8">
              &lsquo;쉬르밴드&rsquo;는 길이요 진리이며 영원한 왕이신 예수그리스도만을 높이고 주님의 교회와 개인의 삶에 예배가 회복되길(행 15:16) 기도하며 나아갑니다.
            </p>
            
            <p className="text-base sm:text-lg md:text-xl leading-relaxed text-white font-medium mb-8">
              복음의 능력을 믿으며(롬1:16) 영원토록 예배받으실 분은 한 분이시며(계5:12-13) 다시 오실 영원한 왕을 바라보며(계22:20) 예수그리스도 안에서 모든 민족이 하나님께로 돌아오고 진정한 예배가 회복 될 것을 믿고 참된 복음 안에서 삼위일체 하나님을 예배하며 선포하는 사역을 합니다.
            </p>
            
          </div>
        </section>
        </main>
      </>
    );
  }
  