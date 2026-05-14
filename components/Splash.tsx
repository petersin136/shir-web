'use client';

import Image from 'next/image';
import { useIntroSplash } from '@/hooks/useIntroSplash';

const SPLASH_PC =
  'https://ewaqnqzivdceurhjxgpf.supabase.co/storage/v1/object/public/assets/SHIRBAND_SPLASH%20SCREEN_PC%20BG.jpg';
const SPLASH_MOBILE =
  'https://ewaqnqzivdceurhjxgpf.supabase.co/storage/v1/object/public/assets/SHIRBAND_SPLASH%20SCREEN_M%20BG.jpg';

const SPLASH_BG = '#E63329';

export function Splash() {
  const { showSplash, showSkip, endSplash } = useIntroSplash();

  if (!showSplash) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] cursor-pointer overflow-hidden"
      style={{ backgroundColor: SPLASH_BG }}
      onClick={endSplash}
    >
      <div className="hidden md:block absolute inset-0">
        <Image
          src={SPLASH_PC}
          alt="SHIR BAND"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </div>

      <div className="block md:hidden absolute inset-0">
        <Image
          src={SPLASH_MOBILE}
          alt="SHIR BAND"
          fill
          priority
          sizes="100vw"
          className="object-contain"
        />
      </div>

      {showSkip && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            endSplash();
          }}
          className="absolute bottom-8 right-8 z-10 bg-black/50 hover:bg-black/70 text-white px-6 py-3 rounded-lg backdrop-blur-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white/50 font-medium"
          aria-label="스플래시 화면 건너뛰기"
        >
          Skip
        </button>
      )}

      <div className="sr-only">
        SHIR BAND 스플래시 화면입니다. Enter 키나 Space 키, 또는 클릭으로 건너뛸 수 있습니다.
      </div>
    </div>
  );
}
