'use client';

import { useEffect, useState } from 'react';

const SPLASH_SESSION_KEY = 'shir-splash-shown';
/** 모션 없음 — 데스크탑·모바일 동일한 정적 표시 시간 후 자동 종료 */
const SPLASH_DURATION_MS = 1500;

export function useIntroSplash() {
  const [showSplash, setShowSplash] = useState(false);
  const [showSkip, setShowSkip] = useState(false);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReducedMotion) {
      sessionStorage.setItem(SPLASH_SESSION_KEY, 'true');
      return;
    }

    const hasShownSplash = sessionStorage.getItem(SPLASH_SESSION_KEY);
    if (hasShownSplash) {
      return;
    }

    setShowSplash(true);

    const skipTimer = setTimeout(() => {
      setShowSkip(true);
    }, 600);

    const autoEndTimer = setTimeout(() => {
      endSplash();
    }, SPLASH_DURATION_MS);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const endSplash = () => {
    setShowSplash(false);
    sessionStorage.setItem(SPLASH_SESSION_KEY, 'true');
  };

  return {
    showSplash,
    showSkip,
    endSplash,
  };
}
