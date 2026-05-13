// components/VideoCard.tsx
"use client";

import { useState } from "react";

interface VideoCardProps {
  title: string;
  url: string;
  index?: number;
}

const getVideoId = (url: string): string | null => {
  try {
    if (url.includes("youtu.be")) {
      return url.split("/").pop()?.split("?")[0] ?? null;
    }
    if (url.includes("youtube.com")) {
      const u = new URL(url);
      return u.searchParams.get("v");
    }
  } catch {
    /* noop */
  }
  return null;
};

export default function VideoCard({ title, url, index }: VideoCardProps) {
  const [activated, setActivated] = useState(false);
  const [thumbError, setThumbError] = useState(false);

  const videoId = getVideoId(url);
  const thumbnail =
    videoId && !thumbError
      ? `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`
      : videoId
        ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`
        : null;
  const embedUrl = videoId
    ? `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`
    : url;

  return (
    <article className="group">
      {/* 비디오 프레임 */}
      <div className="relative aspect-video overflow-hidden rounded-xl bg-neutral-950 transition-shadow duration-500 group-hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.6)]">
        {/* 내부 라인 (호버 시 강조) */}
        <div className="pointer-events-none absolute inset-0 z-20 rounded-xl ring-1 ring-inset ring-white/10 transition-all duration-500 group-hover:ring-white/30" />

        {activated ? (
          <iframe
            src={embedUrl}
            className="w-full h-full"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title={title}
          />
        ) : (
          <button
            type="button"
            onClick={() => setActivated(true)}
            className="absolute inset-0 block w-full h-full"
            aria-label={`재생: ${title}`}
          >
            {thumbnail && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={thumbnail}
                alt={title}
                onError={() => setThumbError(true)}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
              />
            )}

            {/* 어두운 베일 (호버 시 옅어짐) */}
            <div className="absolute inset-0 bg-black/35 transition-colors duration-500 group-hover:bg-black/15" />

            {/* 하단 그라데이션 (디테일감) */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/55 via-black/15 to-transparent" />

            {/* 좌상단 라벨 */}
            {index !== undefined && (
              <span className="absolute top-4 left-4 text-[10px] text-white/65 tracking-[0.3em] font-light tabular-nums">
                VID {String(index).padStart(2, "0")}
              </span>
            )}

            {/* 우상단 외부 링크 표시 */}
            <span className="absolute top-4 right-4 text-[10px] text-white/55 tracking-[0.25em] font-light">
              YouTube
            </span>

            {/* 중앙 플레이 버튼 */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                {/* 외부 링 (호버 시 펄스 느낌) */}
                <div className="absolute inset-0 rounded-full border border-white/0 transition-all duration-700 group-hover:scale-125 group-hover:border-white/20" />
                <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full border border-white/45 bg-black/15 backdrop-blur-sm flex items-center justify-center transition-all duration-500 group-hover:border-white/85 group-hover:bg-black/25 group-hover:scale-105">
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5 text-white/85 transition-colors group-hover:text-white"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    style={{ marginLeft: "2px" }}
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
            </div>
          </button>
        )}
      </div>

      {/* 캡션 */}
      <div className="mt-5 flex items-baseline gap-5">
        {index !== undefined && (
          <span className="text-[12px] text-white/35 tracking-[0.2em] font-light tabular-nums shrink-0">
            {String(index).padStart(2, "0")}
          </span>
        )}
        <h3 className="text-[14px] sm:text-[15px] text-white/85 font-light tracking-wider leading-relaxed transition-colors group-hover:text-white">
          {title}
        </h3>
      </div>
    </article>
  );
}
