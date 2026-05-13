// components/VideoCard.tsx
"use client";

import { useState } from "react";

interface VideoCardProps {
  title: string;
  url: string;
}

export default function VideoCard({ title, url }: VideoCardProps) {
  const [hasError, setHasError] = useState(false);

  const getEmbedUrl = (url: string) => {
    try {
      if (url.includes("youtube.com") || url.includes("youtu.be")) {
        let videoId;

        if (url.includes("youtu.be")) {
          const urlParts = url.split("/");
          const lastPart = urlParts[urlParts.length - 1];
          videoId = lastPart.split("?")[0];
        } else {
          const urlObj = new URL(url);
          videoId = urlObj.searchParams.get("v");
        }

        if (videoId) {
          return `https://www.youtube.com/embed/${videoId}`;
        }
      }

      if (url.includes("vimeo.com")) {
        const videoId = url.split("/").pop()?.split("?")[0];
        return `https://player.vimeo.com/video/${videoId}`;
      }
    } catch (error) {
      console.error("Error parsing video URL:", error, "URL:", url);
    }

    return url;
  };

  const embedUrl = getEmbedUrl(url);

  return (
    <div className="group">
      <div className="aspect-video relative overflow-hidden bg-white/5 ring-1 ring-white/10 transition-all group-hover:ring-white/20">
        {hasError ? (
          <div className="w-full h-full flex items-center justify-center text-white/50">
            <div className="text-center px-4">
              <p className="text-[11px] tracking-wider uppercase mb-2 font-light">
                Unable to load
              </p>
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] text-white/70 hover:text-white underline underline-offset-2 transition-colors"
              >
                Watch on YouTube
              </a>
            </div>
          </div>
        ) : (
          <iframe
            src={embedUrl}
            className="w-full h-full"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title={title}
            onError={() => setHasError(true)}
          />
        )}
      </div>
      <p className="mt-3 text-[13px] text-white/70 font-light tracking-wider">
        {title}
      </p>
    </div>
  );
}
