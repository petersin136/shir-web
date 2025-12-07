// app/inquiry/page.tsx
"use client";

import { useState } from "react";
import { BackgroundVideo } from "@/components/BackgroundVideo";

export default function InquiryPage() {
  const [loading, setLoading] = useState(false);
  const [ok, setOk] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [privacyAgreed, setPrivacyAgreed] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setOk(null);
    setErr(null);
    setLoading(true);

    if (!privacyAgreed) {
      setErr("개인정보 수집 및 이용에 동의해주세요.");
      setLoading(false);
      return;
    }

    const form = e.currentTarget;
    const formData = new FormData(form);
    const payload = {
      name: String(formData.get("name") || "").trim(),
      email: String(formData.get("email") || "").trim(),
      subject: String(formData.get("subject") || "").trim(),
      message: String(formData.get("message") || "").trim(),
    };

    if (!payload.name || !payload.email || !payload.subject || !payload.message) {
      setErr("모든 필수 항목을 입력해주세요.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...payload,
          subject: `문의하기: ${payload.subject}`,
          message: `제목: ${payload.subject}\n\n${payload.message}`,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "서버 오류");
      setOk("문의가 전송되었습니다. 감사합니다!");
      form.reset();
      setPrivacyAgreed(false);
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : "전송에 실패했습니다.";
      setErr(errorMessage);
    } finally {
      setLoading(false);
    }
  }
  return (
    <>
      <BackgroundVideo overlayOpacity={0.85} />
      <main className="relative mx-auto max-w-4xl px-6 py-16">
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-wide uppercase mb-10">
          문의하기
        </h1>

        {/* 쉬르밴드 소개 */}
        <div className="space-y-6 mb-12">
          <p className="text-base sm:text-lg md:text-xl leading-relaxed text-white font-medium">
            &lsquo;쉬르밴드&rsquo;는 길이요 진리이며 영원한 왕이신 예수그리스도만을 높이고 주님의 교회와 개인의 삶에 예배가 회복되길(행 15:16) 기도하며 나아갑니다.
          </p>
          
          <p className="text-base sm:text-lg md:text-xl leading-relaxed text-white font-medium">
            복음의 능력을 믿으며(롬1:16) 영원토록 예배받으실 분은 한 분이시며(계5:12-13) 다시 오실 영원한 왕을 바라보며(계22:20) 예수그리스도 안에서 모든 민족이 하나님께로 돌아오고 진정한 예배가 회복 될 것을 믿음으로 바라보고 참된 복음 안에서 삼위일체 하나님을 예배하며 선포하는 사역을 합니다.
          </p>
          
          <p className="text-base sm:text-lg md:text-xl leading-relaxed text-white font-medium">
            쉬르밴드 사역에 대해 궁금한 점이 있으시거나<br />
            사역요청이 필요하시면 아래를 통해 연락 바랍니다.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* 연락처 정보 */}
          <section className="space-y-8">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-normal mb-6">
              연락처 정보
            </h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-white mb-2">이메일</h3>
                <p className="text-base text-white/90">
                  <a href="mailto:shirband2025@gmail.com" className="hover:text-white transition-colors">
                    shirband2025@gmail.com
                  </a>
                </p>
              </div>


              <div>
                <h3 className="text-lg font-bold text-white mb-2">소셜미디어</h3>
                <div className="space-y-2">
                  <p className="text-base text-white/90">
                    Instagram: <a href="https://www.instagram.com/shirband_official/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors underline">@shirband_official</a>
                  </p>
                  <p className="text-base text-white/90">
                    YouTube: <a href="https://www.youtube.com/@SHIRBAND" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors underline">@SHIRBAND</a>
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* 문의 양식 */}
          <section>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-normal mb-6">
              문의 양식
            </h2>
            
            <form onSubmit={onSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-white mb-2">
                  이름 *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent"
                  placeholder="성함을 입력해 주세요"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                  이메일 *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent"
                  placeholder="이메일을 입력해 주세요"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-white mb-2">
                  제목 *
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  required
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent"
                  placeholder="문의 제목을 입력해 주세요"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-white mb-2">
                  메시지 *
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={6}
                  required
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent resize-none"
                  placeholder="문의 내용을 자세히 적어 주세요"
                ></textarea>
              </div>

              <div className="space-y-4">
                <label className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    checked={privacyAgreed}
                    onChange={(e) => setPrivacyAgreed(e.target.checked)}
                    className="mt-1 w-4 h-4 text-white bg-white/5 border-white/20 rounded focus:ring-white/30 focus:ring-2"
                    required
                  />
                  <span className="text-sm sm:text-base text-white font-medium">
                    개인정보 수집 및 이용에 동의합니다 (필수)
                  </span>
                </label>
                
                <div className="ml-7 text-xs sm:text-sm text-white/70">
                  <p>
                    입력하신 정보는 사역 신청 및 안내 목적으로 사용되며,<br />
                    <a href="/privacy-policy" className="underline hover:text-white transition-colors">
                      개인정보 처리방침
                    </a>에 따라 안전하게 관리됩니다.
                  </p>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !privacyAgreed}
                className="w-full bg-white text-black font-bold py-3 px-6 rounded-lg hover:bg-white/90 transition-colors focus:outline-none focus:ring-2 focus:ring-white/50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "전송 중..." : "문의하기"}
              </button>

              {ok && <p className="text-emerald-400 text-base sm:text-lg font-medium mt-4">{ok}</p>}
              {err && <p className="text-red-400 text-base sm:text-lg font-medium mt-4">{err}</p>}
            </form>
          </section>
        </div>

      </main>
    </>
  );
}
