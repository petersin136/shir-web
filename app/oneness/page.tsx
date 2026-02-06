// app/oneness/page.tsx
"use client";

import { useState } from "react";
import { BackgroundVideo } from "@/components/BackgroundVideo";

export default function OnenessPage() {
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
      phone: String(formData.get("phone") || "").trim(),
      church: String(formData.get("church") || "").trim(),
      position: String(formData.get("position") || "").trim(),
      participants: String(formData.get("participants") || "").trim(),
      message: String(formData.get("message") || "").trim(),
    };

    if (!payload.name || !payload.phone || !payload.church || !payload.participants) {
      setErr("이름, 연락처, 소속교회, 참석 예상 인원은 필수 입력사항입니다.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: payload.name,
          subject: "ONENESS Worship 2026 신청",
          message: `
ONENESS Worship 2026 신청 정보:
- 이름: ${payload.name}
- 연락처: ${payload.phone}
- 소속교회: ${payload.church}
- 직책/역할: ${payload.position}
- 참석 예상 인원: ${payload.participants}명
- 추가 메시지: ${payload.message}
          `.trim()
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "서버 오류");
      setOk("ONENESS Worship 2026 신청이 완료되었습니다. 감사합니다!");
      form.reset();
      setPrivacyAgreed(false);
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : "신청에 실패했습니다.";
      setErr(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <BackgroundVideo overlayOpacity={0.85} />
      <main className="relative mx-auto max-w-4xl px-6 py-16">
        <div className="space-y-8 mb-12">
          {/* 성경구절 섹션 - 그대로 유지 */}
          <div className="space-y-6">
            <div>
              <p className="text-base sm:text-lg md:text-xl leading-loose text-white font-light mb-4" style={{lineHeight: '1.8'}}>
                &ldquo;아버지여, 아버지께서 내안에, 내가 아버지 안에 있는 것 같이 그들도 다 하나가 되어 우리 안에 있게 하사 세상으로 아버지께서 나를 보내시 것을 믿게 하옵소서&rdquo;
              </p>
              <p className="text-sm sm:text-base text-white/80 font-medium text-right">
                요 17:21
              </p>
            </div>

            <div>
              <p className="text-base sm:text-lg md:text-xl leading-loose text-white font-light mb-4" style={{lineHeight: '1.8'}}>
                &ldquo;평안의 매는 줄로 성령이 하나되게 하신 것을 힘써 지키라&rdquo;
              </p>
              <p className="text-sm sm:text-base text-white/80 font-medium text-right">
                엡 4:3
              </p>
            </div>
          </div>

          <p className="text-base sm:text-lg md:text-xl leading-relaxed text-white font-medium mb-8">
            깨어졌던 개인과 교회와 열방이 하나님과 하나되고 개인과 개인이 교회와 교회가 더 나아가 남.북한이 복음으로 하나되길 기도하고 예배합니다.
          </p>

          {/* ONENESS Worship 2026 섹션 */}
          <div className="space-y-6">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-wide uppercase mb-6">
              ONENESS Worship 2026
            </h2>
            
            <div>
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold tracking-wide">일시</h3>
              <p className="text-base sm:text-lg md:text-xl text-white font-medium">
                2026년 6월 27일 1시~ (7시간 연속 예배)
              </p>
            </div>

            <div>
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold tracking-wide">장소</h3>
              <p className="text-base sm:text-lg md:text-xl text-white font-medium">
                장소 미정
              </p>
            </div>

            <div>
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold tracking-wide">Speaker</h3>
              <div className="space-y-2">
                <p className="text-base sm:text-lg md:text-xl text-white font-medium">송바울 (Dr. One. K)</p>
                <p className="text-base sm:text-lg md:text-xl text-white font-medium">이재진 선교사</p>
                <p className="text-base sm:text-lg md:text-xl text-white font-medium">우홍식 목사</p>
                <p className="text-base sm:text-lg md:text-xl text-white font-medium">신승용 대표</p>
              </div>
            </div>

            <div>
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold tracking-wide">워십팀</h3>
              <div className="space-y-2">
                <p className="text-base sm:text-lg md:text-xl text-white font-medium">쉬르밴드 (SHIR BAND)</p>
                <p className="text-base sm:text-lg md:text-xl text-white font-medium">로드웨이브 (LORD WAVE)</p>
                <p className="text-base sm:text-lg md:text-xl text-white font-medium">팀 다니엘초이 (Daniel Choi)</p>
              </div>
            </div>

            <p className="text-base sm:text-lg md:text-xl text-white/90 font-medium">
              6월 27일 1시부터 7시간 연속 자율 금식집회입니다.
            </p>
          </div>
        </div>

        {/* 집회 신청 */}
        <div id="register-section" className="pt-8 scroll-mt-20">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-wide mb-6">
            집회 신청
          </h2>
          
          <p className="text-base sm:text-lg md:text-xl text-white font-medium mb-6">
            ONENESS Worship 2026 참석을 신청해 주세요.
          </p>

          <form onSubmit={onSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <label className="block">
                <span className="text-sm sm:text-base md:text-lg text-white font-medium">이름 *</span>
                <input
                  name="name"
                  type="text"
                  required
                  className="mt-2 w-full rounded-md bg-white/5 ring-1 ring-white/10 px-4 py-3 outline-none focus:ring-white/30 text-base sm:text-lg"
                  placeholder="홍길동"
                />
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <label className="block">
                <span className="text-sm sm:text-base md:text-lg text-white font-medium">연락처 *</span>
                <input
                  name="phone"
                  type="tel"
                  required
                  className="mt-2 w-full rounded-md bg-white/5 ring-1 ring-white/10 px-4 py-3 outline-none focus:ring-white/30 text-base sm:text-lg"
                  placeholder="010-1234-5678"
                />
              </label>
              <label className="block">
                <span className="text-sm sm:text-base md:text-lg text-white font-medium">소속교회 *</span>
                <input
                  name="church"
                  type="text"
                  required
                  className="mt-2 w-full rounded-md bg-white/5 ring-1 ring-white/10 px-4 py-3 outline-none focus:ring-white/30 text-base sm:text-lg"
                  placeholder="○○교회"
                />
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <label className="block">
                <span className="text-sm sm:text-base md:text-lg text-white font-medium">직책/역할</span>
                <input
                  name="position"
                  type="text"
                  className="mt-2 w-full rounded-md bg-white/5 ring-1 ring-white/10 px-4 py-3 outline-none focus:ring-white/30 text-base sm:text-lg"
                  placeholder="목사, 전도사, 청년부장 등"
                />
              </label>
              <label className="block">
                <span className="text-sm sm:text-base md:text-lg text-white font-medium">참석 예상 인원 *</span>
                <select
                  name="participants"
                  required
                  className="mt-2 w-full rounded-md bg-white/5 ring-1 ring-white/10 px-4 py-3 outline-none focus:ring-white/30 text-base sm:text-lg"
                >
                  <option value="">선택해주세요</option>
                  <option value="1">1명</option>
                  <option value="2">2명</option>
                  <option value="3">3명</option>
                  <option value="4">4명</option>
                  <option value="5">5명</option>
                  <option value="6">6명</option>
                  <option value="7">7명</option>
                  <option value="8">8명</option>
                  <option value="9">9명</option>
                  <option value="10">10명</option>
                  <option value="15">15명</option>
                  <option value="20">20명</option>
                  <option value="30">30명 이상</option>
                </select>
                <p className="mt-1 text-xs sm:text-sm text-white/70">본인 포함 총 참석 인원을 선택해주세요.</p>
              </label>
            </div>

            <label className="block">
              <span className="text-sm sm:text-base md:text-lg text-white font-medium">추가 메시지</span>
              <textarea
                name="message"
                rows={5}
                className="mt-2 w-full rounded-md bg-white/5 ring-1 ring-white/10 px-4 py-3 outline-none focus:ring-white/30 text-base sm:text-lg"
                placeholder="집회 관련 문의사항이나 특별한 요청사항을 입력해 주세요.

※ 단체로 오실 경우 함께 참석하시는 분들의 정보를 입력해주세요.
예시:
- 김철수 / 010-1234-5678
- 이영희 / 010-2345-6789"
              />
              <p className="mt-1 text-xs sm:text-sm text-white/70">
                단체 참석 시 함께 오시는 분들의 이름과 연락처를 입력해주시면 더 원활한 준비가 가능합니다.
              </p>
            </label>

            <div className="space-y-4">
              <label className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  checked={privacyAgreed}
                  onChange={(e) => setPrivacyAgreed(e.target.checked)}
                  className="mt-1 w-4 h-4 text-white bg-white/5 border-white/20 rounded focus:ring-white/30 focus:ring-2"
                  required
                />
                <span className="text-sm sm:text-base text-white font-medium">개인정보 수집 및 이용에 동의합니다 (필수)</span>
              </label>
              <div className="ml-7 text-xs sm:text-sm text-white/70">
                <p>
                  입력하신 정보는 사역 신청 및 안내 목적으로 사용되며,<br />
                  <a href="/privacy-policy" className="underline hover:text-white transition-colors">개인정보 처리방침</a>에 따라 안전하게 관리됩니다.
                </p>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !privacyAgreed}
              className="mt-6 inline-flex items-center justify-center rounded border border-white px-8 py-4 text-base sm:text-lg md:text-xl font-medium hover:bg-white hover:text-black transition-colors disabled:opacity-50"
            >
              {loading ? "신청 중..." : "집회 신청하기"}
            </button>

            {ok && <p className="text-emerald-400 text-base sm:text-lg font-medium mt-4">{ok}</p>}
            {err && <p className="text-red-400 text-base sm:text-lg font-medium mt-4">{err}</p>}
          </form>
        </div>
      </main>
    </>
  );
}
