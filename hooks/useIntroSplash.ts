'use client';

import { useEffect, useState } from 'react';

const SPLASH_SESSION_KEY = 'shir-splash-shown';
// 데스크탑은 1.5초 (페이드 포함), 모바일은 회전 클라이맥스 위해 약간 길게
const SPLASH_DURATION_DESKTOP = 1500;
const SPLASH_DURATION_MOBILE = 2400;
const FADE_DURATION = 500;

export function useIntroSplash() {
  // SSR 안전을 위해 false로 시작 → 클라이언트에서 첫 방문 여부 확인 후 결정
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

    // 이미 이번 세션에서 스플래시를 본 경우엔 노출하지 않음
    const hasShownSplash = sessionStorage.getItem(SPLASH_SESSION_KEY);
    if (hasShownSplash) {
      return;
    }

    setShowSplash(true);

    const isDesktop = window.matchMedia('(min-width: 768px)').matches;
    const splashDuration = isDesktop
      ? SPLASH_DURATION_DESKTOP
      : SPLASH_DURATION_MOBILE;

    const skipTimer = setTimeout(() => {
      setShowSkip(true);
    }, 600);

    const autoEndTimer = setTimeout(() => {
      endSplash();
    }, splashDuration);

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
    fadeDuration: FADE_DURATION,
  };
}
