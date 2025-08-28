// app/register/page.tsx
import Link from 'next/link';
import { BackgroundVideo } from "@/components/BackgroundVideo";
import { getRegFormUrl, formatFormUrlForEmbed, getAdminEmail } from '@/lib/env';

export const metadata = {
  title: 'METANOIA 2026 등록 | SHIR BAND',
  description: 'METANOIA 2026 회개와 부흥의 집회에 참석 신청하세요.',
};

export default function RegisterPage() {
  const url = getRegFormUrl();
  const adminEmail = getAdminEmail();

  return (
    <>
      <BackgroundVideo overlayOpacity={0.9} />
      <main className="relative min-h-screen">
        {/* 헤더 */}
        <div className="relative z-10 pt-20 pb-8">
          <div className="mx-auto max-w-4xl px-6">
            <div className="text-center space-y-4 mb-8">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors text-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                홈으로 돌아가기
              </Link>
              <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold text-white">
                METANOIA 2026 등록
              </h1>
              <p className="text-base sm:text-lg text-white/80 max-w-2xl mx-auto">
                회개와 부흥의 3일, 2026년 1월<br />
                SHIR Band가 준비하는 특별한 집회에 참석하세요
              </p>
            </div>
          </div>
        </div>

        {/* 메인 컨텐츠 */}
        <div className="relative z-10 pb-20">
          <div className="mx-auto max-w-4xl px-6">
            {url ? (
              <div className="space-y-6">
                {/* 폼 컨테이너 */}
                <div className="bg-neutral-950/50 backdrop-blur-sm rounded-2xl border border-white/10 p-6 shadow-2xl">
                  <div className="space-y-4 mb-6">
                    <h2 className="text-xl sm:text-2xl font-semibold text-white">
                      참석 신청 폼
                    </h2>
                    <p className="text-white/70 text-sm sm:text-base">
                      아래 폼을 작성하여 METANOIA 2026에 참석 신청해 주세요.
                    </p>
                  </div>

                  {/* iframe 폼 */}
                  <div className="relative">
                    <iframe
                      src={formatFormUrlForEmbed(url)}
                      title="METANOIA 2026 등록 폼"
                      className="w-full min-h-[1200px] rounded-lg bg-white"
                      referrerPolicy="no-referrer"
                      loading="lazy"
                    />
                  </div>

                  {/* 도움말 */}
                  <div className="mt-4 p-4 bg-white/5 rounded-lg border border-white/10">
                    <div className="flex items-start gap-3 text-sm text-white/70">
                      <span className="text-blue-400 text-lg">💡</span>
                      <div className="space-y-2">
                        <p>폼이 제대로 로딩되지 않나요?</p>
                        <div className="flex flex-wrap gap-4">
                          <a
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-white hover:text-blue-300 transition-colors underline"
                          >
                            새 창에서 열기
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </a>
                          <a
                            href={`mailto:${adminEmail}?subject=METANOIA 2026 등록 문의&body=폼 접속에 문제가 있어 이메일로 문의드립니다.`}
                            className="inline-flex items-center gap-1 text-white hover:text-green-300 transition-colors underline"
                          >
                            이메일로 문의
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 002 2z" />
                            </svg>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* 폼이 설정되지 않은 경우 */
              <div className="text-center py-20">
                <div className="bg-neutral-950/50 backdrop-blur-sm rounded-2xl border border-white/10 p-12 shadow-2xl max-w-2xl mx-auto">
                  <div className="space-y-6">
                    <div className="w-16 h-16 mx-auto bg-white/10 rounded-full flex items-center justify-center">
                      <svg className="w-8 h-8 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div className="space-y-3">
                      <h2 className="text-2xl sm:text-3xl font-bold text-white">
                        등록 폼 준비 중
                      </h2>
                      <p className="text-white/70 text-base sm:text-lg">
                        METANOIA 2026 등록 폼이 아직 준비되지 않았습니다.<br />
                        참석을 원하시는 분은 관리자에게 직접 문의해 주세요.
                      </p>
                    </div>
                    <div className="space-y-3">
                      <a
                        href={`mailto:${adminEmail}?subject=METANOIA 2026 참석 문의&body=안녕하세요,%0D%0A%0D%0AMETANOIA 2026 참석을 희망합니다.%0D%0A%0D%0A이름:%0D%0A연락처:%0D%0A소속:%0D%0A기타 문의사항:`}
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-white hover:bg-white hover:text-black transition-colors text-base sm:text-lg font-medium focus:outline-none focus:ring-2 focus:ring-white/50"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 002 2z" />
                        </svg>
                        관리자에게 이메일 보내기
                      </a>
                      <p className="text-xs sm:text-sm text-white/50">
                        {adminEmail}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}

