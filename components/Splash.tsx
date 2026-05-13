'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useIntroSplash } from '@/hooks/useIntroSplash';

const SPLASH_PC =
  'https://ewaqnqzivdceurhjxgpf.supabase.co/storage/v1/object/public/assets/SHIRBAND_SPLASH%20SCREEN_PC%20MERGED.jpg';
const SPLASH_MOBILE =
  'https://ewaqnqzivdceurhjxgpf.supabase.co/storage/v1/object/public/assets/SHIRBAND_SPLASH%20SCREEN_M%20MERGED.jpg';

// 이미지의 빨강과 맞춘 배경색 (레터박스 자연스럽게 처리)
const SPLASH_BG = '#E63329';

export function Splash() {
  const { showSplash, showSkip, endSplash, fadeDuration } = useIntroSplash();

  return (
    <AnimatePresence>
      {showSplash && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: fadeDuration / 1000, ease: 'easeOut' }}
          className="fixed inset-0 z-[9999] cursor-pointer overflow-hidden"
          style={{ backgroundColor: SPLASH_BG }}
          onClick={endSplash}
        >
          {/* 데스크탑: 시네마틱 클로즈업 + 임팩트 펀치 + 카메라 셰이크 */}
          <motion.div
            initial={{ scale: 1, x: 0, rotate: 0 }}
            animate={{
              scale: [1, 1.12, 1.5, 2.7, 2.6, 2.55],
              x: [0, 0, 0, -6, 4, 0],
              rotate: [0, 0, 0, -1.2, 0.6, 0],
            }}
            transition={{
              duration: 3.0,
              times: [0, 0.35, 0.65, 0.9, 0.96, 1],
              ease: [0.7, 0, 0.25, 1],
            }}
            className="hidden md:block absolute inset-0"
            style={{ transformOrigin: 'center center' }}
          >
            <Image
              src={SPLASH_PC}
              alt="SHIR BAND"
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          </motion.div>

          {/* 모바일: 잔잔한 클로즈업 → 반시계 90° 회전 + 글씨 꽉 차게 확대 */}
          <motion.div
            initial={{ scale: 1, rotate: 0 }}
            animate={{
              scale: [1, 1.15, 2.2],
              rotate: [0, 0, -90],
            }}
            transition={{
              duration: 3.0,
              times: [0, 0.5, 1],
              ease: [0.45, 0, 0.2, 1],
            }}
            className="block md:hidden absolute inset-0"
            style={{ transformOrigin: 'center center' }}
          >
            <Image
              src={SPLASH_MOBILE}
              alt="SHIR BAND"
              fill
              priority
              sizes="100vw"
              className="object-contain"
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
