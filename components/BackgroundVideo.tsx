// components/BackgroundVideo.tsx
// (이름은 호환성 유지를 위해 그대로 두지만, 더 이상 영상이 아닌
//  SHIRBAND 히어로 이미지를 전역 배경으로 렌더합니다.)
'use client';

import Image from 'next/image';

const HERO_BG_PC =
  'https://ewaqnqzivdceurhjxgpf.supabase.co/storage/v1/object/public/assets/SHIRBAND_SPLASH%20SCREEN_PC%20MERGED.jpg';
const HERO_BG_MOBILE =
  'https://ewaqnqzivdceurhjxgpf.supabase.co/storage/v1/object/public/assets/SHIRBAND_SPLASH%20SCREEN_M%20MERGED.jpg';

interface BackgroundVideoProps {
  overlayOpacity?: number;
  className?: string;
}

export function BackgroundVideo({
  overlayOpacity = 0.5,
  className = 'fixed inset-0 -z-10',
}: BackgroundVideoProps) {
  return (
    <div className={`${className} bg-black`}>
      <Image
        src={HERO_BG_PC}
        alt=""
        fill
        priority
        sizes="100vw"
        className="hidden md:block object-cover"
      />
      <Image
        src={HERO_BG_MOBILE}
        alt=""
        fill
        priority
        sizes="100vw"
        className="block md:hidden object-cover"
      />
      {overlayOpacity > 0 && (
        <div
          className="absolute inset-0"
          style={{ backgroundColor: `rgba(0,0,0,${overlayOpacity})` }}
        />
      )}
    </div>
  );
}
