// app/privacy-policy/page.tsx
import { BackgroundVideo } from "@/components/BackgroundVideo";

export default function PrivacyPolicyPage() {
  return (
    <>
      <BackgroundVideo overlayOpacity={0.85} />
      <main className="relative max-w-2xl px-6 sm:px-10 md:pl-24 md:pr-16 lg:pl-48 lg:pr-20 py-20 sm:py-24 md:py-28 min-h-[calc(100dvh-3rem)] sm:min-h-[calc(100dvh-3.5rem)]">
        {/* Header */}
        <header className="mb-14 sm:mb-16">
          <p className="text-[12px] sm:text-[13px] text-white/45 tracking-[0.25em] uppercase mb-3">
            시행일자 · 2025.01.01
          </p>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-light tracking-[0.2em] uppercase text-white">
            Privacy
          </h1>
          <div className="w-10 h-px bg-white/30 mt-5 sm:mt-6" />
        </header>

        <div className="space-y-12 sm:space-y-14">
          <Section number="01" title="개인정보의 수집 및 이용 목적">
            <p>SHIR BAND는 다음의 목적을 위하여 개인정보를 처리합니다.</p>
            <ul className="mt-3 space-y-1.5 text-white/70">
              <li>· 사역 참가 신청 및 관리</li>
              <li>· 컨퍼런스 및 예배 참석자 관리</li>
              <li>· 사역 관련 공지사항 전달</li>
              <li>· 문의사항 응답 및 상담</li>
            </ul>
          </Section>

          <Section number="02" title="수집하는 개인정보 항목">
            <ul className="space-y-1.5 text-white/70">
              <li>
                <span className="text-white/85">필수항목</span> · 성명, 연락처,
                이메일 주소
              </li>
              <li>
                <span className="text-white/85">선택항목</span> · 소속교회, 참가
                동기, 기타 문의사항
              </li>
            </ul>
          </Section>

          <Section number="03" title="개인정보의 보유 및 이용기간">
            <p>
              수집된 개인정보는 목적 달성 후 지체없이 파기하며, 관련 법령에 따라
              보존이 필요한 경우에는 해당 기간 동안 보관합니다.
            </p>
          </Section>

          <Section number="04" title="개인정보의 제3자 제공">
            <p>
              SHIR BAND는 이용자의 개인정보를 원칙적으로 외부에 제공하지
              않습니다. 다만, 법령의 규정에 의거하거나 수사 목적으로 법령에
              정해진 절차와 방법에 따라 수사기관의 요구가 있는 경우에는 제공할
              수 있습니다.
            </p>
          </Section>

          <Section number="05" title="개인정보 처리의 위탁">
            <p>SHIR BAND는 개인정보 처리업무를 외부에 위탁하지 않습니다.</p>
          </Section>

          <Section number="06" title="정보주체의 권리">
            <p>
              정보주체는 언제든지 개인정보 처리현황에 대한 열람, 정정·삭제,
              처리정지를 요구할 수 있으며, 요구사항은{" "}
              <a
                href="mailto:shirband2025@gmail.com"
                className="text-white/85 underline underline-offset-4 hover:text-white transition-colors"
              >
                shirband2025@gmail.com
              </a>
              으로 연락주시기 바랍니다.
            </p>
          </Section>

          <Section number="07" title="개인정보 보호책임자">
            <dl className="space-y-2 text-[16px]">
              <div className="grid grid-cols-[100px_1fr] gap-x-4">
                <dt className="text-white/45 text-[13px] uppercase tracking-wider pt-0.5">
                  Responsible
                </dt>
                <dd className="text-white/85 font-light">SHIR BAND 대표</dd>
              </div>
              <div className="grid grid-cols-[100px_1fr] gap-x-4">
                <dt className="text-white/45 text-[13px] uppercase tracking-wider pt-0.5">
                  Contact
                </dt>
                <dd className="text-white/85 font-light">
                  shirband2025@gmail.com
                </dd>
              </div>
            </dl>
          </Section>

          <div className="pt-6 border-t border-white/10">
            <p className="text-[12px] text-white/40 tracking-wider">
              본 개인정보 처리방침은 2025년 1월 1일부터 적용됩니다.
            </p>
          </div>
        </div>
      </main>
    </>
  );
}

function Section({
  number,
  title,
  children,
}: {
  number: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="flex items-baseline gap-3 mb-4">
        <span className="text-[12px] text-white/40 tracking-[0.2em] font-light">
          {number}
        </span>
        <h2 className="text-base sm:text-lg font-light text-white tracking-wider">
          {title}
        </h2>
      </div>
      <div className="text-[15px] sm:text-[16px] leading-loose text-white/75 font-light pl-8">
        {children}
      </div>
    </section>
  );
}
