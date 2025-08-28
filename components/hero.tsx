// components/Hero.tsx
export default function Hero() {
  return (
    <section className="relative w-full h-[80vh] flex items-center justify-center text-center text-white">
      {/* ✅ 배경 비디오 */}
      <video
        className="absolute top-0 left-0 w-full h-full object-cover"
        src="https://ewaqnqzivdceurhjxgpf.supabase.co/storage/v1/object/public/assets/hero.mp4"
        autoPlay
        muted
        loop
        playsInline
      />

      {/* ✅ 반투명 오버레이 */}
      <div className="absolute top-0 left-0 w-full h-full bg-black/50" />

      {/* ✅ 콘텐츠 */}
      <div className="relative z-10 max-w-3xl px-4">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">SHIR BAND</h1>
        <p className="text-lg md:text-2xl">
          that ye present your bodies a living sacrifice, holy, acceptable unto God,
          which is your reasonable service — Romans 12:1
        </p>
      </div>
    </section>
  );
}
