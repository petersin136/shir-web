// app/metanoia-2026/page.tsx
"use client";

import { useState } from "react";
import { BackgroundVideo } from "@/components/BackgroundVideo";

export default function MetanoiaPage() {
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
      phone: String(formData.get("phone") || "").trim(),
      church: String(formData.get("church") || "").trim(),
      position: String(formData.get("position") || "").trim(),
      participants: String(formData.get("participants") || "").trim(),
      message: String(formData.get("message") || "").trim(),
    };

    if (!payload.name || !payload.email || !payload.phone || !payload.church) {
      setErr("이름, 이메일, 연락처, 소속교회는 필수 입력사항입니다.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...payload,
          subject: "Metanoia 2026 집회 신청",
          message: `
집회 신청 정보:
- 이름: ${payload.name}
- 이메일: ${payload.email}
- 연락처: ${payload.phone}
- 소속교회: ${payload.church}
- 직책/역할: ${payload.position}
- 참석 예상 인원: ${payload.participants}
- 추가 메시지: ${payload.message}
          `.trim()
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "서버 오류");
      setOk("Metanoia 2026 집회 신청이 완료되었습니다. 감사합니다!");
      form.reset();
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
      <main className="relative mx-auto max-w-3xl px-6 py-16">
        {/* 성경구절 섹션 - 최상단 */}
        <div className="mb-10">
          <p className="text-base sm:text-lg md:text-xl leading-loose text-white font-light mb-4" style={{lineHeight: '1.8'}}>
            &ldquo;내가 복음을 부끄러워하지 아니하노니 이 복음은 모든 믿는자에게 구원을 주시는 하나님의 능력이 됨이라 먼저는 유대인에게요 그리고 헬라인에게로다&rdquo;
          </p>
          <p className="text-sm sm:text-base text-white/80 font-medium text-right mb-6">
            롬 1:16
          </p>
          <p className="text-base sm:text-lg md:text-xl leading-relaxed text-white font-medium">
            예수그리스도의 복음을 통해 개인과 교회와 열방이 하나님과 회복되길 기도하고 예배합니다.
          </p>
        </div>

        <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-wide uppercase mb-10">
          Metanoia 2026
        </h1>
  
        <div className="space-y-8 mb-12">

          <div className="space-y-4">
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold tracking-wide">일정</h3>
            <p className="text-base sm:text-lg md:text-xl text-white font-medium">
              2026년 1월 26일(월) ~ 28일(수)
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold tracking-wide">장소</h3>
            <p className="text-base sm:text-lg md:text-xl text-white font-medium">
              포천중앙침례교회
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold tracking-wide">Speaker</h3>
            <div className="space-y-2">
              <p className="text-base sm:text-lg md:text-xl text-white font-medium">김용의 선교사님</p>
              <p className="text-base sm:text-lg md:text-xl text-white font-medium">송바울 (Dr. One. K)</p>
              <p className="text-base sm:text-lg md:text-xl text-white font-medium">스캇브레너 목사님</p>
            </div>
          </div>

        </div>

        <div id="register-section" className="border-t border-white/20 pt-12 scroll-mt-20">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-wide mb-6">
            집회 신청
          </h2>
          
          <p className="text-base sm:text-lg md:text-xl text-white font-medium mb-10">
            Metanoia 2026 집회 참석을 신청해 주세요.
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
              <label className="block">
                <span className="text-sm sm:text-base md:text-lg text-white font-medium">이메일 *</span>
                <input
                  name="email"
                  type="email"
                  required
                  className="mt-2 w-full rounded-md bg-white/5 ring-1 ring-white/10 px-4 py-3 outline-none focus:ring-white/30 text-base sm:text-lg"
                  placeholder="you@example.com"
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
                <span className="text-sm sm:text-base md:text-lg text-white font-medium">참석 예상 인원</span>
                <input
                  name="participants"
                  type="text"
                  className="mt-2 w-full rounded-md bg-white/5 ring-1 ring-white/10 px-4 py-3 outline-none focus:ring-white/30 text-base sm:text-lg"
                  placeholder="예: 개인 1명, 팀 5명 등"
                />
              </label>
            </div>

            <label className="block">
              <span className="text-sm sm:text-base md:text-lg text-white font-medium">추가 메시지</span>
              <textarea
                name="message"
                rows={5}
                className="mt-2 w-full rounded-md bg-white/5 ring-1 ring-white/10 px-4 py-3 outline-none focus:ring-white/30 text-base sm:text-lg"
                placeholder="집회 관련 문의사항이나 특별한 요청사항이 있으시면 입력해 주세요."
              />
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
  