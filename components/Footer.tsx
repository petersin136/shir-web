// components/Footer.tsx
"use client";

import Link from "next/link";
import { useState } from "react";

export default function Footer() {
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

  return (
    <>
      <footer className="bg-black/30 backdrop-blur-sm border-t border-white/10 py-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* 왼쪽: 단체 정보 */}
            <div className="text-center md:text-left">
              <h3 className="text-lg font-bold text-white mb-3">SHIR BAND</h3>
              <p className="text-sm text-white/70 mb-2">
                삼위일체 하나님을 예배하며 선포하는 사역
              </p>
              <p className="text-xs text-white/50">
                Spirit & Truth Worship
              </p>
            </div>

            {/* 가운데: 연락처 */}
            <div className="text-center">
              <h4 className="text-base font-semibold text-white mb-3">Contact</h4>
              <div className="space-y-1 text-sm text-white/70">
                <p>
                  <a href="mailto:shirband2025@gmail.com" className="hover:text-white transition-colors">
                    shirband2025@gmail.com
                  </a>
                </p>
                <p>010-5738-0570</p>
                <p>010-4003-4442</p>
              </div>
            </div>

            {/* 오른쪽: 소셜미디어 */}
            <div className="text-center md:text-right">
              <h4 className="text-base font-semibold text-white mb-3">Social Media</h4>
              <div className="flex justify-center md:justify-end gap-3">
                <a
                  href="https://www.instagram.com/shir_band/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center hover:scale-110 transition-transform"
                >
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                <a
                  href="https://www.youtube.com/@SHIRBAND"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center hover:scale-110 transition-transform"
                >
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>
                <a
                  href="#"
                  className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center hover:scale-110 transition-transform opacity-50 cursor-not-allowed"
                  title="Coming Soon"
                >
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a
                  href="#"
                  className="w-8 h-8 bg-black rounded-lg flex items-center justify-center hover:scale-110 transition-transform opacity-50 cursor-not-allowed"
                  title="Coming Soon"
                >
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.347-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24c6.624 0 11.99-5.367 11.99-11.987C24.007 5.367 18.641.001 12.017.001z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* 하단: 저작권 및 개인정보 처리방침 */}
          <div className="mt-8 pt-6 border-t border-white/10">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-center sm:text-left">
                <p className="text-sm text-white/70">
                  © 2025 SHIR BAND. All rights reserved.
                </p>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <button
                  onClick={() => setShowPrivacyModal(true)}
                  className="text-white/60 hover:text-white transition-colors underline"
                >
                  개인정보 처리방침
                </button>
                <Link
                  href="/inquiry"
                  className="text-white/60 hover:text-white transition-colors"
                >
                  문의하기
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* 개인정보 처리방침 모달 */}
      {showPrivacyModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">개인정보 처리방침</h2>
                <button
                  onClick={() => setShowPrivacyModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-4 text-sm text-gray-700">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">1. 개인정보의 수집 및 이용 목적</h3>
                  <p>SHIR BAND는 다음의 목적을 위하여 개인정보를 처리합니다:</p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>사역 참가 신청 및 관리</li>
                    <li>컨퍼런스 및 예배 참석자 관리</li>
                    <li>사역 관련 공지사항 전달</li>
                    <li>문의사항 응답 및 상담</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">2. 수집하는 개인정보 항목</h3>
                  <ul className="list-disc list-inside space-y-1">
                    <li>필수항목: 성명, 연락처(전화번호), 이메일 주소</li>
                    <li>선택항목: 소속교회, 참가 동기, 기타 문의사항</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">3. 개인정보의 보유 및 이용기간</h3>
                  <p>수집된 개인정보는 목적 달성 후 지체없이 파기하며, 관련 법령에 따라 보존이 필요한 경우에는 해당 기간 동안 보관합니다.</p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">4. 개인정보의 제3자 제공</h3>
                  <p>SHIR BAND는 이용자의 개인정보를 원칙적으로 외부에 제공하지 않습니다. 다만, 법령의 규정에 의거하거나 수사 목적으로 법령에 정해진 절차와 방법에 따라 수사기관의 요구가 있는 경우에는 제공할 수 있습니다.</p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">5. 개인정보 처리의 위탁</h3>
                  <p>SHIR BAND는 개인정보 처리업무를 외부에 위탁하지 않습니다.</p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">6. 정보주체의 권리</h3>
                  <p>정보주체는 언제든지 개인정보 처리현황에 대한 열람, 정정·삭제, 처리정지를 요구할 수 있으며, 요구사항은 shirband2025@gmail.com으로 연락주시기 바랍니다.</p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">7. 개인정보 보호책임자</h3>
                  <div className="bg-gray-50 p-3 rounded">
                    <p><strong>개인정보 보호책임자:</strong> SHIR BAND 대표</p>
                    <p><strong>연락처:</strong> shirband2025@gmail.com</p>
                    <p><strong>전화:</strong> 010-5738-0570</p>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-gray-500 mt-4">
                    본 개인정보 처리방침은 2025년 1월 1일부터 적용됩니다.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
