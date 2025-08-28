'use client';

import { useState } from 'react';
import Link from 'next/link';
import { RegisterModal } from './RegisterModal';
import { getRegFormUrl } from '@/lib/env';

export function MetanoiaRegisterButton() {
  const [modalOpen, setModalOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const url = getRegFormUrl();

  const handleMainClick = () => {
    // 기본 동작: 모달 열기
    setModalOpen(true);
    setDropdownOpen(false);
  };

  const handleDropdownToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <>
      <div className="relative">
        {/* 메인 버튼 그룹 */}
        <div className="flex">
          {/* 주 버튼 */}
          <button
            onClick={handleMainClick}
            className="border border-white px-4 py-2 text-sm sm:text-base rounded-l hover:bg-white hover:text-black transition-colors focus:outline-none focus:ring-2 focus:ring-white/50"
            aria-label="METANOIA 2026 등록 모달 열기"
          >
            자세히 보기 / 등록하기
          </button>
          
          {/* 드롭다운 토글 버튼 */}
          <button
            onClick={handleDropdownToggle}
            className="border border-l-0 border-white px-2 py-2 rounded-r hover:bg-white hover:text-black transition-colors focus:outline-none focus:ring-2 focus:ring-white/50"
            aria-label="등록 옵션 더보기"
            aria-expanded={dropdownOpen}
            aria-haspopup="true"
          >
            <svg 
              className={`w-4 h-4 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        {/* 드롭다운 메뉴 */}
        {dropdownOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-neutral-950/95 backdrop-blur-sm border border-white/20 rounded-lg shadow-xl z-10">
            <div className="py-2">
              <button
                onClick={() => {
                  setModalOpen(true);
                  setDropdownOpen(false);
                }}
                className="w-full px-4 py-2 text-left text-sm text-white hover:bg-white/10 transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                모달로 등록하기
              </button>
              
              {url && (
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full px-4 py-2 text-left text-sm text-white hover:bg-white/10 transition-colors flex items-center gap-2"
                  onClick={() => setDropdownOpen(false)}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  새 창에서 열기
                </a>
              )}
              
              <Link
                href="/register"
                className="w-full px-4 py-2 text-left text-sm text-white hover:bg-white/10 transition-colors flex items-center gap-2"
                onClick={() => setDropdownOpen(false)}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                등록 페이지로 이동
              </Link>
              
              <Link
                href="/metanoia-2026"
                className="w-full px-4 py-2 text-left text-sm text-white hover:bg-white/10 transition-colors flex items-center gap-2"
                onClick={() => setDropdownOpen(false)}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                행사 자세히 보기
              </Link>
            </div>
          </div>
        )}

        {/* 드롭다운 닫기를 위한 오버레이 */}
        {dropdownOpen && (
          <div
            className="fixed inset-0 z-0"
            onClick={() => setDropdownOpen(false)}
          />
        )}
      </div>

      {/* 등록 모달 */}
      <RegisterModal 
        open={modalOpen} 
        onClose={() => setModalOpen(false)} 
      />
    </>
  );
}

