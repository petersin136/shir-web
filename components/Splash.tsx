'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useIntroSplash } from '@/hooks/useIntroSplash';

export function Splash() {
  const { showSplash, showSkip, endSplash, fadeDuration } = useIntroSplash();

  // 디버깅용 로그
  console.log('Splash component - showSplash:', showSplash);

  return (
    <AnimatePresence>
      {showSplash && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: fadeDuration / 1000, ease: 'easeOut' }}
          className="fixed inset-0 z-[9999] flex items-center justify-center"
          style={{
            background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 25%, #991b1b 50%, #7f1d1d 75%, #dc2626 100%)',
            backgroundSize: '400% 400%',
            animation: 'gradient 3s ease infinite'
          }}
          onClick={endSplash}
        >
          {/* 스플래시 로고 - 첨부 이미지 스타일 */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="flex items-center space-x-6 relative"
          >
            {/* 로고 영역 */}
            <motion.div
              initial={{ x: -50 }}
              animate={{ x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative"
            >
              <div className="bg-white p-3 rounded-sm shadow-2xl transform rotate-3">
                <Image
                  src="https://ewaqnqzivdceurhjxgpf.supabase.co/storage/v1/object/public/assets/shir-logo.png"
                  alt="SHIR BAND Logo"
                  width={80}
                  height={80}
                  className="w-16 h-16 sm:w-20 sm:h-20"
                  priority
                />
              </div>
            </motion.div>
            
            {/* 텍스트 영역 */}
            <motion.div
              initial={{ x: 50 }}
              animate={{ x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-white relative"
            >
              <h1 className="text-5xl sm:text-7xl font-black tracking-wider drop-shadow-2xl">
                SHIR BAND
              </h1>
              {/* 브러시 효과 */}
              <div className="absolute -bottom-2 left-0 right-0 h-2 bg-white/20 rounded-full blur-sm"></div>
            </motion.div>
          </motion.div>

          {/* 스킵 버튼 */}
          <AnimatePresence>
            {showSkip && (
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                onClick={endSplash}
                className="absolute bottom-8 right-8 bg-black/50 hover:bg-black/70 text-white px-6 py-3 rounded-lg backdrop-blur-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/50 font-medium"
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
