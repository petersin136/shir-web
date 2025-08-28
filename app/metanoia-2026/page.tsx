// app/metanoia-2026/page.tsx
export default function MetanoiaPage() {
    return (
      <main className="mx-auto max-w-4xl px-6 py-16">
        <h1 className="text-3xl sm:text-5xl tracking-widest uppercase mb-8">
          Metanoia 2026
        </h1>
  
        <p className="text-sm sm:text-base leading-relaxed text-white/90 mb-6">
          회개와 부흥의 3일, 2026년 1월. <br />
          SHIR Band가 준비하는 특별한 집회에 여러분을 초대합니다.
        </p>
  
        <section className="space-y-3">
          <h2 className="text-lg sm:text-2xl tracking-wide">Schedule</h2>
          <ul className="list-disc list-inside text-sm sm:text-base text-white/80">
            <li>2026년 1월 1일 — Opening Worship</li>
            <li>2026년 1월 2일 — Repentance & Revival</li>
            <li>2026년 1월 3일 — Celebration & Sending</li>
          </ul>
          <p className="text-xs sm:text-sm text-white/60">
            장소는 추후 공지 예정입니다.
          </p>
        </section>
  
        <div className="mt-10">
          <button className="px-6 py-2 border border-white rounded hover:bg-white hover:text-black transition-colors">
            자세히 보기 / 등록하기
          </button>
        </div>
      </main>
    );
  }
  