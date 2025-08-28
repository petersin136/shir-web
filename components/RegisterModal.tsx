'use client';

import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getRegFormUrl, formatFormUrlForEmbed, getAdminEmail } from '@/lib/env';

interface RegisterModalProps {
  open: boolean;
  onClose: () => void;
}

export function RegisterModal({ open, onClose }: RegisterModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (open) {
      // 현재 포커스된 요소 저장
      previousActiveElement.current = document.activeElement as HTMLElement;
      
      // 모달이 열릴 때 body 스크롤 잠금
      document.body.style.overflow = 'hidden';
      
      // 모달에 포커스
      setTimeout(() => {
        modalRef.current?.focus();
      }, 100);
    } else {
      // 모달이 닫힐 때 body 스크롤 복원
      document.body.style.overflow = 'unset';
      
      // 이전 포커스된 요소로 포커스 복원
      if (previousActiveElement.current) {
        previousActiveElement.current.focus();
      }
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [open]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const url = getRegFormUrl();
  const adminEmail = getAdminEmail();

  const modalVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.95,
      transition: { duration: 0.2 }
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.3 }
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={handleOverlayClick}
          style={{
            // prefers-reduced-motion 사용자를 위한 애니메이션 비활성화
            animation: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'none' : undefined
          }}
        >
          <motion.div
            ref={modalRef}
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="relative w-full max-w-4xl max-h-[90vh] rounded-2xl bg-neutral-950 border border-white/10 shadow-xl overflow-hidden focus:outline-none focus:ring-2 focus:ring-white/50"
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            {/* 모달 헤더 */}
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <h2 id="modal-title" className="text-xl sm:text-2xl font-bold text-white">
                METANOIA 2026 등록
              </h2>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-white/50"
                aria-label="모달 닫기"
              >
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* 모달 컨텐츠 */}
            <div className="p-6">
              {url ? (
                <div className="space-y-4">
                  <p className="text-white/80 text-sm sm:text-base">
                    아래 폼을 작성하여 METANOIA 2026에 참석 신청해 주세요.
                  </p>
                  <iframe
                    src={formatFormUrlForEmbed(url)}
                    title="METANOIA 2026 등록 폼"
                    className="w-full h-[60vh] rounded-lg bg-white"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                  />
                  <div className="flex gap-2 text-xs sm:text-sm text-white/60">
                    <span>💡</span>
                    <span>폼이 로딩되지 않나요?</span>
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline hover:text-white transition-colors"
                    >
                      새 창에서 열기
                    </a>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 space-y-6">
                  <div className="space-y-3">
                    <h3 className="text-xl font-semibold text-white">
                      등록 폼이 아직 준비되지 않았습니다
                    </h3>
                    <p className="text-white/70 max-w-md mx-auto">
                      METANOIA 2026 참석을 원하시는 분은 관리자에게 직접 문의해 주세요.
                    </p>
                  </div>
                  <a
                    href={`mailto:${adminEmail}?subject=METANOIA 2026 참석 문의&body=안녕하세요,%0D%0A%0D%0AMETANOIA 2026 참석을 희망합니다.%0D%0A%0D%0A이름:%0D%0A연락처:%0D%0A소속:%0D%0A기타 문의사항:`}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-white hover:bg-white hover:text-black transition-colors focus:outline-none focus:ring-2 focus:ring-white/50"
                    aria-label={`${adminEmail}로 문의 이메일 보내기`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    관리자에게 이메일 보내기
                  </a>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

