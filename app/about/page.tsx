// app/about/page.tsx
import { BackgroundVideo } from "@/components/BackgroundVideo";

export default function AboutPage() {
    return (
      <>
        <BackgroundVideo overlayOpacity={0.85} />
        <main className="relative mx-auto max-w-4xl px-6 py-16">
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-wide uppercase mb-10">
          About Us
        </h1>
  
        <p className="text-base sm:text-lg md:text-xl leading-relaxed text-white font-medium mb-8">
          SHIR Band는 예배 공동체로서 하나님께 영과 진리로 찬양을 올려드립니다.
          역사와 여정을 간략히 소개하는 영역입니다. (임시 내용)
        </p>
  
        <section className="space-y-6">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-normal">Vision & Mission</h2>
          <p className="text-base sm:text-lg md:text-xl text-white font-medium">
            우리는 신령과 진정으로 드리는 예배를 통해 세대와 민족을 변화시키고자 합니다.
          </p>
          <p className="text-sm sm:text-base md:text-lg text-white/80 font-medium">
            We desire to see generations and nations transformed through worship in spirit and in truth.
          </p>
        </section>
        </main>
      </>
    );
  }
  