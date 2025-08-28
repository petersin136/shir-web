// components/EventCard.tsx
type EventItem = {
    title: string;
    date: string;        // 예: "2026-01-01"
    time?: string;       // 예: "19:00"
    location?: string;   // 예: "서울 OO교회"
    description?: string;
    link?: string;       // 등록/자세히보기 URL
  };
  
  export default function EventCard({
    title,
    date,
    time,
    location,
    description,
    link,
  }: EventItem) {
    const d = new Date(date);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
  
    return (
      <article className="rounded-2xl bg-white/5 ring-1 ring-white/10 p-4 flex flex-col gap-3">
        <div className="flex items-baseline justify-between">
          <h3 className="text-base sm:text-lg font-medium">{title}</h3>
          <span className="text-xs sm:text-sm text-white/70">{`${yyyy}-${mm}-${dd}${time ? ` ${time}` : ""}`}</span>
        </div>
        {location && <p className="text-xs sm:text-sm text-white/80">{location}</p>}
        {description && (
          <p className="text-xs sm:text-sm text-white/70 leading-relaxed">{description}</p>
        )}
        {link && (
          <a
            href={link}
            className="self-start text-xs sm:text-sm mt-1 px-4 py-1.5 border border-white rounded hover:bg-white hover:text-black transition-colors"
          >
            자세히 보기 / 등록
          </a>
        )}
      </article>
    );
  }
  