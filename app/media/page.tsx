// app/media/page.tsx
import VideoCard from "../../components/VideoCard";
import ImageCard from "../../components/ImageCard";
import { BackgroundVideo } from "@/components/BackgroundVideo";

export default function MediaPage() {
  // ✍️ 여기 배열만 추후 관리자에서 Supabase로 대체할 예정
  const videos = [
    { title: "SHIR Worship Live — Video 1", url: "https://youtu.be/Hm-0Er8d8a8?feature=shared" },
    { title: "SHIR Worship Live — Video 2", url: "https://youtu.be/r1oBC3shdbg?feature=shared" },
    { title: "SHIR Worship Live — Video 3", url: "https://youtu.be/U-crsDRiLW0?feature=shared" },
  ];

  const photos = [
    { src: "/placeholder/hero-1.jpg", caption: "SHIR Band — Worship Moment" },
    { src: "/placeholder/hero-2.jpg", caption: "Rehearsal" },
    { src: "/placeholder/hero-3.jpg", caption: "Concert" },
  ];

  return (
    <>
      <BackgroundVideo overlayOpacity={0.85} />
      <main className="relative mx-auto max-w-6xl px-6 py-16">
      {/* 타이틀 */}
      <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-wide uppercase mb-12">
        Media
      </h1>

      {/* 동영상 섹션 */}
      <section className="mb-16">
        <div className="flex items-end justify-between mb-6">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold uppercase tracking-wide">Videos</h2>
          <p className="text-sm sm:text-base text-white/70 font-medium">
            YouTube/Vimeo 링크를 붙여넣으면 자동 임베드됩니다.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((v) => (
            <VideoCard key={v.title} title={v.title} url={v.url} />
          ))}
        </div>
      </section>

      {/* 사진 섹션 */}
      <section>
        <div className="flex items-end justify-between mb-6">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold uppercase tracking-wide">Photos</h2>
          <p className="text-sm sm:text-base text-white/70 font-medium">
            /public/placeholder 폴더의 샘플 이미지를 사용 중입니다.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {photos.map((p) => (
            <ImageCard key={p.src} src={p.src} alt={p.caption} caption={p.caption} />
          ))}
        </div>
      </section>
      </main>
    </>
  );
}
