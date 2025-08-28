// components/VideoCard.tsx
"use client";

import { useState } from 'react';

interface VideoCardProps {
  title: string;
  url: string;
}

export default function VideoCard({ title, url }: VideoCardProps) {
  const [hasError, setHasError] = useState(false);
  
  const getEmbedUrl = (url: string) => {
    try {
      if (url.includes('youtube.com') || url.includes('youtu.be')) {
        let videoId;
        
        if (url.includes('youtu.be')) {
          // youtu.be/VIDEO_ID?feature=shared 형태 처리
          const urlParts = url.split('/');
          const lastPart = urlParts[urlParts.length - 1];
          videoId = lastPart.split('?')[0];
        } else {
          // youtube.com/watch?v=VIDEO_ID 형태 처리
          const urlObj = new URL(url);
          videoId = urlObj.searchParams.get('v');
        }
        
        if (videoId) {
          return `https://www.youtube.com/embed/${videoId}`;
        }
      }
      
      if (url.includes('vimeo.com')) {
        const videoId = url.split('/').pop()?.split('?')[0];
        return `https://player.vimeo.com/video/${videoId}`;
      }
    } catch (error) {
      console.error('Error parsing video URL:', error, 'URL:', url);
    }
    
    return url;
  };

  const embedUrl = getEmbedUrl(url);
  console.log('Original URL:', url, 'Embed URL:', embedUrl);

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-lg overflow-hidden">
      <div className="aspect-video relative">
        {hasError ? (
          <div className="w-full h-full flex items-center justify-center bg-gray-800 text-white/70">
            <div className="text-center">
              <p className="text-sm mb-2">영상을 로드할 수 없습니다</p>
              <a 
                href={url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 underline text-xs"
              >
                YouTube에서 보기
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
      <div className="p-4">
        <h3 className="text-sm font-medium text-white/90">{title}</h3>
        {hasError && (
          <p className="text-xs text-red-400 mt-1">영상 로딩 실패</p>
        )}
      </div>
    </div>
  );
}
