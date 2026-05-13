'use client';

import { useEffect, useState } from 'react';

const SPLASH_SESSION_KEY = 'shir-splash-shown';
// 데스크탑은 2초 (페이드 포함), 모바일은 회전 클라이맥스 위해 약간 길게
const SPLASH_DURATION_DESKTOP = 1500;
const SPLASH_DURATION_MOBILE = 2400;
const FADE_DURATION = 500; // 0.5초

export function useIntroSplash() {
  const [showSplash, setShowSplash] = useState(true); // 기본값을 true로 변경
  const [showSkip, setShowSkip] = useState(false);

  useEffect(() => {
    // prefers-reduced-motion 체크
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    // 세션스토리지 체크 (테스트를 위해 임시 비활성화)
    // const hasShownSplash = sessionStorage.getItem(SPLASH_SESSION_KEY);
    
    if (prefersReducedMotion) {
      setShowSplash(false); // 즉시 숨김
      return;
    }

    // 디바이스별 splash duration 결정
    const isDesktop = window.matchMedia('(min-width: 768px)').matches;
    const splashDuration = isDesktop ? SPLASH_DURATION_DESKTOP : SPLASH_DURATION_MOBILE;

    // 0.6초 후 스킵 버튼 표시
    const skipTimer = setTimeout(() => {
      setShowSkip(true);
    }, 600);

    // 디바이스별 시간 후 자동 종료
    const autoEndTimer = setTimeout(() => {
      endSplash();
    }, splashDuration);

    // 키보드 이벤트 리스너
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        endSplash();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      clearTimeout(skipTimer);
      clearTimeout(autoEndTimer);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const endSplash = () => {
    setShowSplash(false);
    // sessionStorage.setItem(SPLASH_SESSION_KEY, 'true'); // 테스트를 위해 임시 비활성화
  };

  return {
    showSplash,
    showSkip,
    endSplash,
    fadeDuration: FADE_DURATION
  };
}
