// app/about/page.tsx
export default function AboutPage() {
    return (
      <main className="mx-auto max-w-4xl px-6 py-16">
        <h1 className="text-3xl sm:text-5xl tracking-wide uppercase mb-8">
          About Us
        </h1>
  
        <p className="text-sm sm:text-base leading-relaxed text-white/90 mb-6">
          SHIR Band는 예배 공동체로서 하나님께 영과 진리로 찬양을 올려드립니다.
          역사와 여정을 간략히 소개하는 영역입니다. (임시 내용)
        </p>
  
        <section className="space-y-3">
          <h2 className="text-lg sm:text-2xl tracking-normal">Vision & Mission</h2>
          <p className="text-sm sm:text-base text-white/80">
            우리는 신령과 진정으로 드리는 예배를 통해 세대와 민족을 변화시키고자 합니다.
          </p>
          <p className="text-xs sm:text-sm text-white/60">
            We desire to see generations and nations transformed through worship in spirit and in truth.
          </p>
        </section>
      </main>
    );
  }
  