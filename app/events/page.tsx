// app/events/page.tsx
import EventCard from "../../components/EventCard";
import { BackgroundVideo } from "@/components/BackgroundVideo";

export default function EventsPage() {
  // ✍️ 추후 Supabase에서 불러올 예정. 지금은 더미 데이터.
  const events = [
    {
      title: "Worship Night — Seoul",
      date: "2025-12-12",
      time: "19:00",
      location: "서울 ○○교회",
      description: "신령과 진정의 예배 모임. 함께 찬양하고 기도합니다.",
      link: "/metanoia-2026",
    },
    {
      title: "Metanoia 2026 (Day 1)",
      date: "2026-01-01",
      time: "19:30",
      location: "장소 추후 공지",
      description: "회개와 부흥의 3일 — DAY 1",
    },
    {
      title: "Metanoia 2026 (Day 2)",
      date: "2026-01-02",
      time: "19:30",
      location: "장소 추후 공지",
      description: "회개와 부흥의 3일 — DAY 2",
    },
  ];

  return (
    <>
      <BackgroundVideo overlayOpacity={0.85} />
      <main className="relative mx-auto max-w-6xl px-6 py-16">
      <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-wide uppercase mb-12">
        Events
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((e) => (
          <EventCard key={`${e.title}-${e.date}`} {...e} />
        ))}
      </div>
      </main>
    </>
  );
}
