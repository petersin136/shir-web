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
      <section className="mb-16">
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

      {/* SNS 섹션 */}
      <section>
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold uppercase tracking-wide mb-6">SNS</h2>
          <p className="text-base sm:text-lg text-white/80 font-medium mb-8">
            SHIR BAND의 최신 소식과 영상을 SNS에서 만나보세요.
          </p>
        </div>
        
        <div className="flex flex-wrap gap-6 justify-center sm:justify-start">
          {/* Instagram */}
          <a
            href="https://www.instagram.com/shir_band/"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg p-4 sm:p-6 transition-all duration-300 hover:scale-105 border border-white/20"
          >
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-white/90 transition-colors">Instagram</h3>
              <p className="text-sm sm:text-base text-white/70 group-hover:text-white/80 transition-colors">@shir_band</p>
            </div>
          </a>

          {/* YouTube */}
          <a
            href="https://www.youtube.com/@SHIRBAND"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg p-4 sm:p-6 transition-all duration-300 hover:scale-105 border border-white/20"
          >
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-red-600 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-white/90 transition-colors">YouTube</h3>
              <p className="text-sm sm:text-base text-white/70 group-hover:text-white/80 transition-colors">@SHIRBAND</p>
            </div>
          </a>

          {/* Facebook - 준비 중 */}
          <a
            href="#"
            className="group flex items-center gap-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg p-4 sm:p-6 transition-all duration-300 hover:scale-105 border border-white/20 opacity-50 cursor-not-allowed"
          >
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-600 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-white/50">Facebook</h3>
              <p className="text-sm sm:text-base text-white/40">준비 중</p>
            </div>
          </a>

          {/* Threads - 준비 중 */}
          <a
            href="#"
            className="group flex items-center gap-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg p-4 sm:p-6 transition-all duration-300 hover:scale-105 border border-white/20 opacity-50 cursor-not-allowed"
          >
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-black rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.914 3.589 12c.027 3.086.718 5.496 2.057 7.164 1.43 1.781 3.631 2.695 6.54 2.717 2.623-.02 4.358-.631 5.8-2.045 1.647-1.613 1.618-3.593 1.09-4.798-.31-.71-.873-1.3-1.634-1.75-.192 1.352-.622 2.446-1.284 3.272-.886 1.102-2.14 1.704-3.73 1.79-1.202.065-2.361-.218-3.259-.801-1.063-.689-1.685-1.74-1.752-2.964-.065-1.19.408-2.285 1.33-3.082.88-.76 2.119-1.207 3.583-1.291a13.853 13.853 0 0 1 3.02.142c-.126-.742-.375-1.332-.74-1.755-.365-.424-.866-.636-1.491-.636-1.06 0-1.711.753-1.894 2.186l-1.758-.35C8.775 7.777 10.049 6.81 12.006 6.81c.517 0 .991.097 1.404.287 1.312.605 2.188 1.877 2.188 3.175 0 .379-.05.759-.148 1.129.418.005.832.062 1.23.166 1.307.342 2.395 1.015 3.154 1.949.949 1.166 1.394 2.684 1.284 4.393-.138 2.156-1.072 4.103-2.708 5.644C16.655 24.058 14.462 24 12.186 24zm1.147-9.94c-.319-.007-.644-.014-.973-.014-1.107 0-2.086.306-2.756.864-.223.186-.4.44-.5.731-.17.494-.154 1.043.045 1.499.2.456.55.808 1.005 1.02.455.212.956.297 1.5.255.544-.042 1.076-.254 1.495-.595.42-.341.751-.799.931-1.296.18-.497.18-1.016.18-1.516v-.948z"/>
              </svg>
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-white/50">Threads</h3>
              <p className="text-sm sm:text-base text-white/40">준비 중</p>
            </div>
          </a>
        </div>
      </section>
      </main>
    </>
  );
}
