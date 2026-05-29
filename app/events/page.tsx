// app/events/page.tsx
import Link from "next/link";
import { PageSplitLayout } from "@/components/PageSplitLayout";

type Archive = {
  year: string;
  label: string;
  href: string;
};

type Ministry = {
  eyebrow: string;
  title: string;
  subtitle: string;
  description: string;
  archives: Archive[];
};

const METANOIA: Ministry = {
  eyebrow: "Conference",
  title: "METANOIA",
  subtitle: "회개로 돌아서는 세대",
  description:
    "복음의 능력으로 회개의 자리에 서며, 그리스도의 십자가 앞에서 개인과 교회와 열방이 하나님께로 돌아오는 예배의 시간을 함께 합니다.",
  archives: [
    {
      year: "2026",
      label: "METANOIA 2026",
      href: "/metanoia-2026",
    },
  ],
};

const ONENESS: Ministry = {
  eyebrow: "Worship",
  title: "ONENESS WORSHIP",
  subtitle: "복음 안에서 하나되는 예배",
  description:
    "깨어졌던 개인과 교회와 열방이 하나님과 하나되고, 교회와 교회가, 더 나아가 남·북한이 복음으로 하나되길 기도하며 함께 예배합니다.",
  archives: [
    {
      year: "2026",
      label: "ONENESS Worship 2026",
      href: "/oneness",
    },
  ],
};

export default function EventsPage() {
  return (
    <PageSplitLayout mainClassName="max-w-6xl">
        <header className="mb-16 sm:mb-20">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-light tracking-[0.2em] uppercase text-white">
            Archive
          </h1>
          <div className="w-10 h-px bg-white/30 mt-5 sm:mt-6" />
          <p className="text-[16px] sm:text-[17px] text-white/70 font-light leading-loose mt-6 sm:mt-8 max-w-2xl">
            쉬르밴드는 예수 그리스도의 복음 안에서 회개와 예배의 사역을 감당합니다.
          </p>
        </header>

        {/* Two-column ministries */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-12 lg:gap-20">
          <MinistryColumn data={METANOIA} />
          <MinistryColumn data={ONENESS} />
        </div>
    </PageSplitLayout>
  );
}

function MinistryColumn({ data }: { data: Ministry }) {
  return (
    <section>
      {/* 카테고리 라벨 */}
      <p className="text-[13px] text-white/45 tracking-[0.25em] uppercase mb-3">
        {data.eyebrow}
      </p>

      {/* 메인 타이틀 */}
      <h2 className="text-xl sm:text-2xl md:text-[28px] font-light tracking-wider text-white">
        {data.title}
      </h2>

      <div className="w-10 h-px bg-white/25 mt-5 mb-6" />

      {/* 서브타이틀 + 설명 */}
      <p className="text-[14px] sm:text-[15px] text-white/55 font-light italic tracking-wider mb-5">
        {data.subtitle}
      </p>
      <p className="text-[16px] sm:text-[17px] text-white/80 font-light leading-loose mb-10 sm:mb-12">
        {data.description}
      </p>

      {/* 아카이브 라벨 */}
      <p className="text-[12px] text-white/40 tracking-[0.25em] uppercase mb-4">
        Archive
      </p>

      {/* 연도별 리스트 */}
      <ul className="border-t border-white/10">
        {data.archives.map((archive) => (
          <li key={archive.href}>
            <Link
              href={archive.href}
              className="group flex items-baseline justify-between gap-4 px-4 sm:px-5 py-4 sm:py-5 border-b border-white/10 transition-colors hover:bg-white/[0.02]"
            >
              <div className="flex items-baseline gap-5 sm:gap-6">
                <span className="text-[13px] text-white/40 tracking-wider font-light tabular-nums">
                  {archive.year}
                </span>
                <span className="text-[15px] sm:text-base text-white/85 font-light tracking-wider group-hover:text-white transition-colors">
                  {archive.label}
                </span>
              </div>
              <span className="text-white/30 group-hover:text-white/70 group-hover:translate-x-1 transition-all text-base font-light pl-2">
                →
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
