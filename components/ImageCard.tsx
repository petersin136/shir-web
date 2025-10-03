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
    <div className="bg-white/5 backdrop-blur-sm rounded-lg overflow-hidden">
      <div className="aspect-video relative">
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      {caption && (
        <div className="p-4">
          <p className="text-sm text-white/70">{caption}</p>
        </div>
      )}
    </div>
  );
}
