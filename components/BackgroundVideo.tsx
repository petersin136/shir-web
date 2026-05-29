// components/BackgroundVideo.tsx
// (이름은 호환성 유지를 위해 그대로 두지만, 더 이상 영상이 아닌
//  SHIRBAND 히어로 이미지를 전역 배경으로 렌더합니다.)
'use client';

import Image from 'next/image';

const HERO_BG_PC =
  'https://ewaqnqzivdceurhjxgpf.supabase.co/storage/v1/object/public/assets/SHIRBAND_MAIN%20BANNER_PC.jpg';
const HERO_BG_MOBILE =
  'https://ewaqnqzivdceurhjxgpf.supabase.co/storage/v1/object/public/assets/SHIRBAND_MAIN%20BANNER_M.jpg';

interface BackgroundVideoProps {
  overlayOpacity?: number;
  className?: string;
  /** 모바일 이미지가 화면을 벗어날 때 자르지 않고 전체를 보여주려면 'contain' 사용. */
  mobileFit?: 'cover' | 'contain';
  /** 컨테이너 기본 배경색 (object-contain 사용 시 레터박스 영역에 보임). */
  bgColor?: string;
  /** 모바일 <Image> object-position (Tailwind), 예: object-top */
  mobileObjectClass?: string;
}

export function BackgroundVideo({
  overlayOpacity = 0.5,
  className = 'fixed inset-0 -z-10',
  mobileFit = 'contain',
  bgColor = '#000000',
  mobileObjectClass = 'object-center',
}: BackgroundVideoProps) {
  const mobileFitClass =
    mobileFit === 'contain' ? 'object-contain' : 'object-cover';

  // 메인 배너는 정적·고정 — 스크롤/뷰포트 변화에 따른 transform·scale 일체 차단
  const staticStyle = {
    backgroundColor: bgColor,
    transform: 'none',
    transition: 'none',
    willChange: 'auto' as const,
  };

  const staticImageStyle = {
    transform: 'none',
    transition: 'none',
  };

  return (
    <div className={`background-hero-static ${className}`} style={staticStyle}>
      <Image
        src={HERO_BG_PC}
        alt=""
        fill
        priority
        sizes="(min-width: 768px) 100vw, 0px"
        className="hidden md:block object-cover"
        style={staticImageStyle}
      />
      <Image
        src={HERO_BG_MOBILE}
        alt=""
        fill
        priority
        sizes="(max-width: 767px) 100vw, 0px"
        className={`block md:hidden ${mobileFitClass} ${mobileObjectClass}`}
        style={staticImageStyle}
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
