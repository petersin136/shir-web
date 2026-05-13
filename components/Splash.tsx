'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useIntroSplash } from '@/hooks/useIntroSplash';

const SPLASH_PC =
  'https://ewaqnqzivdceurhjxgpf.supabase.co/storage/v1/object/public/assets/SHIRBAND_SPLASH%20SCREEN_PC%20MERGED.jpg';
const SPLASH_MOBILE =
  'https://ewaqnqzivdceurhjxgpf.supabase.co/storage/v1/object/public/assets/SHIRBAND_SPLASH%20SCREEN_M%20MERGED.jpg';

export function Splash() {
  const { showSplash, showSkip, endSplash, fadeDuration } = useIntroSplash();

  return (
    <AnimatePresence>
      {showSplash && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: fadeDuration / 1000, ease: 'easeOut' }}
          className="fixed inset-0 z-[9999] bg-black cursor-pointer overflow-hidden"
          onClick={endSplash}
        >
          {/* 줌인 줌업 애니메이션 래퍼 */}
          <motion.div
            initial={{ scale: 1 }}
            animate={{ scale: 1.45 }}
            transition={{ duration: 2.8, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0"
          >
            {/* 데스크탑 이미지 */}
            <Image
              src={SPLASH_PC}
              alt="SHIR BAND"
              fill
              priority
              sizes="100vw"
              className="hidden md:block object-cover"
            />

            {/* 모바일 이미지 */}
            <Image
              src={SPLASH_MOBILE}
              alt="SHIR BAND"
              fill
              priority
              sizes="100vw"
              className="block md:hidden object-cover"
            />
          </motion.div>

          {/* 스킵 버튼 */}
          <AnimatePresence>
            {showSkip && (
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                onClick={(e) => {
                  e.stopPropagation();
                  endSplash();
                }}
                className="absolute bottom-8 right-8 z-10 bg-black/50 hover:bg-black/70 text-white px-6 py-3 rounded-lg backdrop-blur-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/50 font-medium"
                aria-label="스플래시 화면 건너뛰기"
              >
                Skip
              </motion.button>
            )}
          </AnimatePresence>

          {/* 접근성을 위한 숨김 텍스트 */}
          <div className="sr-only">
            SHIR BAND 스플래시 화면입니다. Enter 키나 Space 키, 또는 클릭으로 건너뛸 수 있습니다.
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
