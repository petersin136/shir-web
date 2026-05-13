// components/ImageCard.tsx
"use client";

import Image from "next/image";

interface ImageCardProps {
  src: string;
  alt: string;
  caption?: string;
  index?: number;
}

export default function ImageCard({
  src,
  alt,
  caption,
  index,
}: ImageCardProps) {
  return (
    <article className="group">
      <div className="relative aspect-video overflow-hidden rounded-xl bg-neutral-950 transition-shadow duration-500 group-hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.6)]">
        {/* 내부 라인 */}
        <div className="pointer-events-none absolute inset-0 z-20 rounded-xl ring-1 ring-inset ring-white/10 transition-all duration-500 group-hover:ring-white/30" />

        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        {/* 어두운 베일 (호버 시 옅어짐) */}
        <div className="absolute inset-0 bg-black/20 transition-colors duration-500 group-hover:bg-black/0" />

        {/* 하단 그라데이션 */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/45 via-black/10 to-transparent" />

        {/* 좌상단 라벨 */}
        {index !== undefined && (
          <span className="absolute top-4 left-4 text-[10px] text-white/65 tracking-[0.3em] font-light tabular-nums">
            IMG {String(index).padStart(2, "0")}
          </span>
        )}
      </div>

      {caption && (
        <div className="mt-5 flex items-baseline gap-5">
          {index !== undefined && (
            <span className="text-[12px] text-white/35 tracking-[0.2em] font-light tabular-nums shrink-0">
              {String(index).padStart(2, "0")}
            </span>
          )}
          <p className="text-[14px] sm:text-[15px] text-white/85 font-light tracking-wider leading-relaxed transition-colors group-hover:text-white">
            {caption}
          </p>
        </div>
      )}
    </article>
  );
}
