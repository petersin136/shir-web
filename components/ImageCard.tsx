// components/ImageCard.tsx
"use client";

import Image from "next/image";

interface ImageCardProps {
  src: string;
  alt: string;
  caption?: string;
}

export default function ImageCard({ src, alt, caption }: ImageCardProps) {
  return (
    <div className="group">
      <div className="aspect-video relative overflow-hidden bg-white/5 ring-1 ring-white/10 transition-all group-hover:ring-white/20">
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      {caption && (
        <p className="mt-3 text-[13px] text-white/70 font-light tracking-wider">
          {caption}
        </p>
      )}
    </div>
  );
}
