// app/apply/page.tsx
"use client";

import { useState } from "react";
import { BackgroundVideo } from "@/components/BackgroundVideo";

export default function ApplyPage() {
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
      email: String(formData.get("email") || "").trim(),
      church: String(formData.get("church") || "").trim(),
      reason: String(formData.get("reason") || "").trim(),
    };

    if (!payload.name || !payload.phone || !payload.email || !payload.church || !payload.reason) {
      setErr("모든 필수 항목을 입력해주세요.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "서버 오류");
      setOk("사역 신청이 완료되었습니다. 감사합니다!");
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
      <main className="relative mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-wide uppercase mb-10">
          사역 신청
        </h1>

        <p className="text-base sm:text-lg md:text-xl text-white font-medium mb-10">
          SHIR BAND 사역에 참여하고 싶으시다면 아래 양식을 작성해주세요.
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
              <span className="text-sm sm:text-base md:text-lg text-white font-medium">연락처 *</span>
              <input
                name="phone"
                type="tel"
                required
                className="mt-2 w-full rounded-md bg-white/5 ring-1 ring-white/10 px-4 py-3 outline-none focus:ring-white/30 text-base sm:text-lg"
                placeholder="010-1234-5678"
              />
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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

          <label className="block">
            <span className="text-sm sm:text-base md:text-lg text-white font-medium">참가동기 *</span>
            <textarea
              name="reason"
              rows={5}
              required
              className="mt-2 w-full rounded-md bg-white/5 ring-1 ring-white/10 px-4 py-3 outline-none focus:ring-white/30 text-base sm:text-lg"
              placeholder="SHIR BAND 사역에 참여하고 싶은 이유를 자세히 적어주세요."
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
            className="mt-6 inline-flex items-center justify-center rounded border border-white px-8 py-4 text-base sm:text-lg md:text-xl font-medium hover:bg-white hover:text-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "신청 중..." : "사역 신청하기"}
          </button>

          {ok && <p className="text-emerald-400 text-base sm:text-lg font-medium mt-4">{ok}</p>}
          {err && <p className="text-red-400 text-base sm:text-lg font-medium mt-4">{err}</p>}
        </form>
      </main>
    </>
  );
}
