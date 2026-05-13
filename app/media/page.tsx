// app/media/page.tsx
import VideoCard from "../../components/VideoCard";
import ImageCard from "../../components/ImageCard";
import { BackgroundVideo } from "@/components/BackgroundVideo";

export default function MediaPage() {
  const videos = [
    {
      title: "SHIR Worship Live — Video 1",
      url: "https://youtu.be/Hm-0Er8d8a8?feature=shared",
    },
    {
      title: "SHIR Worship Live — Video 2",
      url: "https://youtu.be/r1oBC3shdbg?feature=shared",
    },
    {
      title: "SHIR Worship Live — Video 3",
      url: "https://youtu.be/Xlbb-oeIu2g?si=4NHGebjIGmeMsX4O",
    },
  ];

  const photos = [
    { src: "/placeholder/hero-1.jpg", caption: "Worship Moment" },
    { src: "/placeholder/hero-2.jpg", caption: "Rehearsal" },
    { src: "/placeholder/hero-3.jpg", caption: "Concert" },
  ];

  const socials: {
    name: string;
    handle: string;
    href: string;
    available: boolean;
  }[] = [
    {
      name: "Instagram",
      handle: "@shirband.official",
      href: "https://www.instagram.com/shirband.official",
      available: true,
    },
    {
      name: "YouTube",
      handle: "@SHIRBAND",
      href: "https://www.youtube.com/@SHIRBAND",
      available: true,
    },
    { name: "Facebook", handle: "Coming soon", href: "#", available: false },
    { name: "Threads", handle: "Coming soon", href: "#", available: false },
  ];

  return (
    <>
      <BackgroundVideo overlayOpacity={0.85} />
      <main className="relative max-w-5xl px-6 sm:px-10 md:pl-24 md:pr-16 lg:pl-48 lg:pr-20 py-20 sm:py-24 md:py-28 min-h-[calc(100dvh-3rem)] sm:min-h-[calc(100dvh-3.5rem)]">
        {/* Header */}
        <header className="mb-16 sm:mb-20">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-light tracking-[0.2em] uppercase text-white">
            Media
          </h1>
          <div className="w-10 h-px bg-white/30 mt-5 sm:mt-6" />
        </header>

        {/* Videos */}
        <section className="mb-20 sm:mb-24">
          <div className="flex items-baseline justify-between mb-8 sm:mb-10">
            <h2 className="text-[12px] sm:text-[13px] text-white/45 tracking-[0.25em] uppercase">
              Videos
            </h2>
            <p className="text-[12px] text-white/35 font-light tracking-wider hidden sm:block">
              YouTube · Vimeo
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {videos.map((v) => (
              <VideoCard key={v.title} title={v.title} url={v.url} />
            ))}
          </div>
        </section>

        <div className="w-10 h-px bg-white/15 mb-20 sm:mb-24" />

        {/* Photos */}
        <section className="mb-20 sm:mb-24">
          <h2 className="text-[12px] sm:text-[13px] text-white/45 tracking-[0.25em] uppercase mb-8 sm:mb-10">
            Photos
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {photos.map((p) => (
              <ImageCard
                key={p.src}
                src={p.src}
                alt={p.caption}
                caption={p.caption}
              />
            ))}
          </div>
        </section>

        <div className="w-10 h-px bg-white/15 mb-20 sm:mb-24" />

        {/* Social */}
        <section>
          <h2 className="text-[12px] sm:text-[13px] text-white/45 tracking-[0.25em] uppercase mb-8 sm:mb-10">
            Follow
          </h2>

          <ul className="divide-y divide-white/10 border-y border-white/10">
            {socials.map((s) => (
              <li key={s.name}>
                {s.available ? (
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between py-5 sm:py-6 group transition-colors"
                  >
                    <div className="flex items-baseline gap-6">
                      <span className="text-base sm:text-lg text-white font-light tracking-wider group-hover:text-white/80 transition-colors">
                        {s.name}
                      </span>
                      <span className="text-[14px] text-white/45 font-light">
                        {s.handle}
                      </span>
                    </div>
                    <span className="text-white/30 group-hover:text-white/70 group-hover:translate-x-1 transition-all text-lg font-light">
                      →
                    </span>
                  </a>
                ) : (
                  <div className="flex items-center justify-between py-5 sm:py-6 opacity-40">
                    <div className="flex items-baseline gap-6">
                      <span className="text-base sm:text-lg text-white font-light tracking-wider">
                        {s.name}
                      </span>
                      <span className="text-[14px] text-white/45 font-light">
                        {s.handle}
                      </span>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </section>
      </main>
    </>
  );
}
