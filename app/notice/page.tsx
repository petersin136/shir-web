// app/notice/page.tsx
import { BackgroundVideo } from "@/components/BackgroundVideo";

export default function NoticePage() {
  return (
    <>
      <BackgroundVideo overlayOpacity={0.85} />
      <main className="relative max-w-2xl px-6 sm:px-10 md:pl-24 md:pr-16 lg:pl-48 lg:pr-20 py-20 sm:py-24 md:py-28 min-h-[calc(100dvh-3rem)] sm:min-h-[calc(100dvh-3.5rem)]">
        <header className="mb-10 sm:mb-12">
          <p className="text-[12px] sm:text-[13px] text-white/45 tracking-[0.25em] uppercase mb-3">
            News
          </p>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-light tracking-[0.2em] uppercase text-white">
            Notice
          </h1>
          <div className="w-10 h-px bg-white/30 mt-5 sm:mt-6" />
        </header>
        <p className="text-[16px] text-white/70 font-light leading-loose">
          공지사항 페이지입니다. 내용은 준비 중입니다.
        </p>
      </main>
    </>
  );
}
