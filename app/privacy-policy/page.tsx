// app/privacy-policy/page.tsx
import { BackgroundVideo } from "@/components/BackgroundVideo";

export default function PrivacyPolicyPage() {
  return (
    <>
      <BackgroundVideo overlayOpacity={0.85} />
      <main className="relative mx-auto max-w-4xl px-6 py-16">
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-wide uppercase mb-10">
          개인정보 처리방침
        </h1>

        <div className="prose prose-invert max-w-none">
          <div className="bg-white/5 rounded-lg p-6 sm:p-8 border border-white/10 space-y-6">
            <p className="text-sm text-white/80">
              <strong>시행일자:</strong> 2025년 1월 1일
            </p>

            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">1. 개인정보의 수집 및 이용 목적</h2>
              <p className="text-base sm:text-lg text-white/90 mb-4">
                SHIR BAND는 다음의 목적을 위하여 개인정보를 처리합니다:
              </p>
              <ul className="list-disc list-inside space-y-2 text-base sm:text-lg text-white/90 ml-4">
                <li>사역 참가 신청 및 관리</li>
                <li>컨퍼런스 및 예배 참석자 관리</li>
                <li>사역 관련 공지사항 전달</li>
                <li>문의사항 응답 및 상담</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">2. 수집하는 개인정보 항목</h2>
              <ul className="list-disc list-inside space-y-2 text-base sm:text-lg text-white/90 ml-4">
                <li><strong>필수항목:</strong> 성명, 연락처(전화번호), 이메일 주소</li>
                <li><strong>선택항목:</strong> 소속교회, 참가 동기, 기타 문의사항</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">3. 개인정보의 보유 및 이용기간</h2>
              <p className="text-base sm:text-lg text-white/90">
                수집된 개인정보는 목적 달성 후 지체없이 파기하며, 관련 법령에 따라 보존이 필요한 경우에는 해당 기간 동안 보관합니다.
              </p>
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">4. 개인정보의 제3자 제공</h2>
              <p className="text-base sm:text-lg text-white/90">
                SHIR BAND는 이용자의 개인정보를 원칙적으로 외부에 제공하지 않습니다. 다만, 법령의 규정에 의거하거나 수사 목적으로 법령에 정해진 절차와 방법에 따라 수사기관의 요구가 있는 경우에는 제공할 수 있습니다.
              </p>
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">5. 개인정보 처리의 위탁</h2>
              <p className="text-base sm:text-lg text-white/90">
                SHIR BAND는 개인정보 처리업무를 외부에 위탁하지 않습니다.
              </p>
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">6. 정보주체의 권리</h2>
              <p className="text-base sm:text-lg text-white/90">
                정보주체는 언제든지 개인정보 처리현황에 대한 열람, 정정·삭제, 처리정지를 요구할 수 있으며, 요구사항은 shirband2025@gmail.com으로 연락주시기 바랍니다.
              </p>
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">7. 개인정보 보호책임자</h2>
              <div className="bg-white/10 p-4 rounded-lg">
                <p className="text-base sm:text-lg text-white/90 mb-2">
                  <strong>개인정보 보호책임자:</strong> SHIR BAND 대표
                </p>
                <p className="text-base sm:text-lg text-white/90">
                  <strong>연락처:</strong> shirband2025@gmail.com
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-white/20">
              <p className="text-xs text-white/60">
                본 개인정보 처리방침은 2025년 1월 1일부터 적용됩니다.
              </p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
