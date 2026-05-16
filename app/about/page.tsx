// app/about/page.tsx
import { PageSplitLayout } from "@/components/PageSplitLayout";

export default function AboutPage() {
  return (
    <PageSplitLayout mainClassName="max-w-2xl">
      <header className="mb-14 sm:mb-16">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-light tracking-[0.2em] uppercase text-white">
          About
        </h1>
        <div className="w-10 h-px bg-white/30 mt-5 sm:mt-6" />
      </header>

      <section className="space-y-10 sm:space-y-12 mb-14 sm:mb-16">
        <blockquote className="border-l border-white/15 pl-5 sm:pl-6">
          <p className="text-[16px] sm:text-[17px] leading-loose text-white/85 font-light">
            너희 몸을 하나님이 기뻐하시는 거룩한 산 제물로 드리라 이는 너희가 드릴
            영적 예배니라
          </p>
          <cite className="block mt-3 sm:mt-4 text-[12px] sm:text-[13px] text-white/45 not-italic tracking-[0.2em] uppercase">
            Romans · 로마서 12:1
          </cite>
        </blockquote>

        <blockquote className="border-l border-white/15 pl-5 sm:pl-6">
          <p className="text-[16px] sm:text-[17px] leading-loose text-white/85 font-light">
            이 후에 내가 돌아와서 다윗의 무너진 장막을 다시 지으며 또 그 허물어진
            것을 다시 지어 일으키리니 이는 그 남은 사람들과 내 이름으로 일컬음을
            받는 모든 이방인들로 주를 찾게 하려 함이라 하셨으니
          </p>
          <cite className="block mt-3 sm:mt-4 text-[12px] sm:text-[13px] text-white/45 not-italic tracking-[0.2em] uppercase">
            Acts · 사도행전 15:16-17
          </cite>
        </blockquote>
      </section>

      <div className="w-10 h-px bg-white/20 mb-14 sm:mb-16" />

      <section className="space-y-6 sm:space-y-7">
        <p className="text-[16px] sm:text-[17px] leading-loose text-white/80 font-light">
          &lsquo;쉬르밴드&rsquo;는 길이요 진리이며 영원한 왕이신 예수그리스도만을
          높이고 주님의 교회와 개인의 삶에 예배가 회복되길(행 15:16) 기도하며
          나아갑니다.
        </p>
        <p className="text-[16px] sm:text-[17px] leading-loose text-white/80 font-light">
          복음의 능력을 믿으며(롬1:16) 영원토록 예배받으실 분은 한 분이시며(계5:12-13)
          다시 오실 영원한 왕을 바라보며(계22:20) 예수그리스도 안에서 모든 민족이
          하나님께로 돌아오고 진정한 예배가 회복 될 것을 믿고 참된 복음 안에서
          삼위일체 하나님을 예배하며 선포하는 사역을 합니다.
        </p>
      </section>
    </PageSplitLayout>
  );
}
