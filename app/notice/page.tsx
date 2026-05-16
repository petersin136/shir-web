// app/notice/page.tsx
import { PageSplitLayout } from "@/components/PageSplitLayout";

export default function NoticePage() {
  return (
    <PageSplitLayout mainClassName="max-w-2xl">
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
    </PageSplitLayout>
  );
}
