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

    if (
      !payload.name ||
      !payload.phone ||
      !payload.church ||
      !payload.participants
    ) {
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
          `.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "서버 오류");
      setOk("ONENESS Worship 2026 신청이 완료되었습니다. 감사합니다.");
      form.reset();
      setPrivacyAgreed(false);
    } catch (e: unknown) {
      const errorMessage =
        e instanceof Error ? e.message : "신청에 실패했습니다.";
      setErr(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <BackgroundVideo overlayOpacity={0.85} />
      <main className="relative max-w-2xl px-6 sm:px-10 md:pl-24 md:pr-16 lg:pl-48 lg:pr-20 py-20 sm:py-24 md:py-28 min-h-[calc(100dvh-3rem)] sm:min-h-[calc(100dvh-3.5rem)]">
        {/* Header */}
        <header className="mb-14 sm:mb-16">
          <p className="text-[12px] sm:text-[13px] text-white/45 tracking-[0.25em] uppercase mb-3">
            Worship · 2026.06
          </p>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-light tracking-[0.2em] uppercase text-white">
            Oneness
          </h1>
          <div className="w-10 h-px bg-white/30 mt-5 sm:mt-6" />
        </header>

        {/* 성경구절 */}
        <section className="space-y-10 sm:space-y-12 mb-14 sm:mb-16">
          <blockquote className="border-l border-white/15 pl-5 sm:pl-6">
            <p className="text-[16px] sm:text-[17px] leading-loose text-white/85 font-light">
              아버지여, 아버지께서 내안에, 내가 아버지 안에 있는 것 같이 그들도
              다 하나가 되어 우리 안에 있게 하사 세상으로 아버지께서 나를
              보내신 것을 믿게 하옵소서
            </p>
            <cite className="block mt-3 sm:mt-4 text-[12px] sm:text-[13px] text-white/45 not-italic tracking-[0.2em] uppercase">
              John · 요한복음 17:21
            </cite>
          </blockquote>

          <blockquote className="border-l border-white/15 pl-5 sm:pl-6">
            <p className="text-[16px] sm:text-[17px] leading-loose text-white/85 font-light">
              평안의 매는 줄로 성령이 하나되게 하신 것을 힘써 지키라
            </p>
            <cite className="block mt-3 sm:mt-4 text-[12px] sm:text-[13px] text-white/45 not-italic tracking-[0.2em] uppercase">
              Ephesians · 에베소서 4:3
            </cite>
          </blockquote>
        </section>

        <p className="text-[16px] sm:text-[17px] leading-loose text-white/80 font-light mb-14 sm:mb-16">
          깨어졌던 개인과 교회와 열방이 하나님과 하나되고 개인과 개인이, 교회와
          교회가, 더 나아가 남·북한이 복음으로 하나되길 기도하고 예배합니다.
        </p>

        <div className="w-10 h-px bg-white/15 mb-14 sm:mb-16" />

        {/* 행사 정보 */}
        <section className="mb-14 sm:mb-16">
          <h2 className="text-xl sm:text-2xl font-light tracking-wider text-white mb-8">
            ONENESS Worship 2026
          </h2>

          <dl className="space-y-5 text-[16px] sm:text-[17px]">
            <div className="grid grid-cols-[80px_1fr] sm:grid-cols-[100px_1fr] gap-x-4 sm:gap-x-6">
              <dt className="text-white/45 font-light tracking-wider text-xs uppercase pt-0.5">
                Date
              </dt>
              <dd className="text-white/85 font-light leading-relaxed">
                2026년 6월 27일 1시
                <span className="block text-white/50 text-sm mt-0.5">
                  7시간 연속 예배
                </span>
              </dd>
            </div>
            <div className="grid grid-cols-[80px_1fr] sm:grid-cols-[100px_1fr] gap-x-4 sm:gap-x-6">
              <dt className="text-white/45 font-light tracking-wider text-xs uppercase pt-0.5">
                Venue
              </dt>
              <dd className="text-white/85 font-light leading-relaxed">
                장소 미정
              </dd>
            </div>
            <div className="grid grid-cols-[80px_1fr] sm:grid-cols-[100px_1fr] gap-x-4 sm:gap-x-6">
              <dt className="text-white/45 font-light tracking-wider text-xs uppercase pt-0.5">
                Speaker
              </dt>
              <dd className="text-white/85 font-light leading-relaxed space-y-1">
                <p>송바울 (Dr. One. K)</p>
                <p>이재진 선교사 (에클레시아 선교회 대표)</p>
                <p>우홍식 목사</p>
                <p>신승용 그날 미니스트리 대표</p>
              </dd>
            </div>
            <div className="grid grid-cols-[80px_1fr] sm:grid-cols-[100px_1fr] gap-x-4 sm:gap-x-6">
              <dt className="text-white/45 font-light tracking-wider text-xs uppercase pt-0.5">
                Team
              </dt>
              <dd className="text-white/85 font-light leading-relaxed space-y-1">
                <p>쉬르밴드 (SHIR BAND)</p>
                <p>로드웨이브 (LORD WAVE)</p>
                <p>팀 다니엘초이 (Daniel Choi)</p>
              </dd>
            </div>
          </dl>

          <p className="text-[14px] sm:text-[15px] text-white/55 font-light mt-6 leading-relaxed">
            6월 27일 1시부터 7시간 연속 자율 금식집회입니다.
          </p>
        </section>

        <div className="w-10 h-px bg-white/15 mb-14 sm:mb-16" />

        {/* 집회 신청 */}
        <section id="register-section" className="scroll-mt-20">
          <h2 className="text-[12px] sm:text-[13px] text-white/45 tracking-[0.25em] uppercase mb-8">
            Registration
          </h2>

          <p className="text-[16px] text-white/80 font-light leading-loose mb-10">
            ONENESS Worship 2026 참석을 신청해 주세요.
          </p>

          <form onSubmit={onSubmit} className="space-y-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-10">
              <Field label="Name *" htmlFor="name">
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  placeholder="홍길동"
                  className={inputClass}
                />
              </Field>
              <Field label="Phone *" htmlFor="phone">
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  placeholder="010-1234-5678"
                  className={inputClass}
                />
              </Field>
              <Field label="Church *" htmlFor="church">
                <input
                  id="church"
                  name="church"
                  type="text"
                  required
                  placeholder="○○교회"
                  className={inputClass}
                />
              </Field>
              <Field label="Position" htmlFor="position">
                <input
                  id="position"
                  name="position"
                  type="text"
                  placeholder="목사, 전도사, 청년부장 등"
                  className={inputClass}
                />
              </Field>
              <Field label="Participants *" htmlFor="participants">
                <select
                  id="participants"
                  name="participants"
                  required
                  className={`${inputClass} appearance-none cursor-pointer`}
                  style={{
                    backgroundImage:
                      "url(\"data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3e%3cpath fill='%23ffffff60' d='M6 8L2 4h8z'/%3e%3c/svg%3e\")",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "right 0 center",
                  }}
                >
                  <option value="" className="bg-black">
                    선택해주세요
                  </option>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 20].map((n) => (
                    <option key={n} value={n} className="bg-black">
                      {n}명
                    </option>
                  ))}
                  <option value="30" className="bg-black">
                    30명 이상
                  </option>
                </select>
                <p className="mt-2 text-[12px] text-white/40 font-light">
                  본인 포함 총 참석 인원을 선택해주세요.
                </p>
              </Field>
            </div>

            <Field label="Message" htmlFor="message">
              <textarea
                id="message"
                name="message"
                rows={5}
                placeholder="집회 관련 문의사항이나 특별한 요청사항을 입력해 주세요."
                className={`${inputClass} leading-loose resize-none`}
              />
              <p className="mt-2 text-[12px] text-white/40 font-light leading-relaxed">
                단체 참석 시 함께 오시는 분들의 이름과 연락처를 입력해주시면
                더 원활한 준비가 가능합니다.
              </p>
            </Field>

            <PrivacyConsent agreed={privacyAgreed} onChange={setPrivacyAgreed} />

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading || !privacyAgreed}
                className="border border-white/40 px-8 py-3.5 text-[12px] tracking-[0.3em] uppercase font-light text-white hover:bg-white hover:text-black hover:border-white transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-white"
              >
                {loading ? "Sending…" : "Register"}
              </button>
            </div>

            {ok && (
              <p className="text-emerald-300/90 text-[14px] tracking-wider font-light pt-2">
                {ok}
              </p>
            )}
            {err && (
              <p className="text-red-300/90 text-[14px] tracking-wider font-light pt-2">
                {err}
              </p>
            )}
          </form>
        </section>
      </main>
    </>
  );
}

const inputClass =
  "w-full bg-transparent border-b border-white/20 px-0 py-3 text-[16px] text-white placeholder-white/25 font-light focus:border-white/60 focus:outline-none transition-colors";

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="block text-[12px] text-white/45 tracking-[0.25em] uppercase mb-2"
      >
        {label}
      </label>
      {children}
    </div>
  );
}

function PrivacyConsent({
  agreed,
  onChange,
}: {
  agreed: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="space-y-3 pt-4">
      <label className="flex items-start gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={agreed}
          onChange={(e) => onChange(e.target.checked)}
          className="mt-1 w-3.5 h-3.5 accent-white"
          required
        />
        <span className="text-[14px] sm:text-[15px] text-white/75 font-light leading-relaxed">
          개인정보 수집 및 이용에 동의합니다 (필수)
        </span>
      </label>
      <p className="ml-7 text-[12px] sm:text-[13px] text-white/45 font-light leading-relaxed">
        입력하신 정보는 사역 신청 및 안내 목적으로 사용되며,{" "}
        <a
          href="/privacy-policy"
          className="underline underline-offset-2 hover:text-white/80 transition-colors"
        >
          개인정보 처리방침
        </a>
        에 따라 안전하게 관리됩니다.
      </p>
    </div>
  );
}
