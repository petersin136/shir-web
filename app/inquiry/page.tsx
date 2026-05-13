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
      setOk("문의가 전송되었습니다. 감사합니다.");
      form.reset();
      setPrivacyAgreed(false);
    } catch (e: unknown) {
      const errorMessage =
        e instanceof Error ? e.message : "전송에 실패했습니다.";
      setErr(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <BackgroundVideo overlayOpacity={0.85} />
      <main className="relative max-w-2xl px-6 sm:px-10 md:pl-24 md:pr-16 lg:pl-48 lg:pr-20 py-20 sm:py-24 md:py-28 min-h-[calc(100dvh-3rem)] sm:min-h-[calc(100dvh-3.5rem)]">
        <header className="mb-14 sm:mb-16">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-light tracking-[0.2em] uppercase text-white">
            Inquiry
          </h1>
          <div className="w-10 h-px bg-white/30 mt-5 sm:mt-6" />
          <p className="text-[16px] text-white/70 font-light leading-loose mt-6 sm:mt-8">
            쉬르밴드 사역에 대해 궁금한 점이나 사역요청이 있으시면 아래로
            연락 바랍니다.
          </p>
        </header>

        {/* 연락처 정보 */}
        <section className="mb-14 sm:mb-16">
          <h2 className="text-[12px] sm:text-[13px] text-white/45 tracking-[0.25em] uppercase mb-6">
            Contact
          </h2>
          <dl className="space-y-5">
            <div className="grid grid-cols-[90px_1fr] sm:grid-cols-[110px_1fr] gap-x-4 sm:gap-x-6">
              <dt className="text-white/45 font-light tracking-wider text-[13px] uppercase pt-0.5">
                Email
              </dt>
              <dd>
                <a
                  href="mailto:shirband2025@gmail.com"
                  className="text-[16px] text-white/85 font-light hover:text-white transition-colors"
                >
                  shirband2025@gmail.com
                </a>
              </dd>
            </div>
            <div className="grid grid-cols-[90px_1fr] sm:grid-cols-[110px_1fr] gap-x-4 sm:gap-x-6">
              <dt className="text-white/45 font-light tracking-wider text-[13px] uppercase pt-0.5">
                Instagram
              </dt>
              <dd>
                <a
                  href="https://www.instagram.com/shirband.official"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[16px] text-white/85 font-light hover:text-white transition-colors"
                >
                  @shirband.official
                </a>
              </dd>
            </div>
            <div className="grid grid-cols-[90px_1fr] sm:grid-cols-[110px_1fr] gap-x-4 sm:gap-x-6">
              <dt className="text-white/45 font-light tracking-wider text-[13px] uppercase pt-0.5">
                YouTube
              </dt>
              <dd>
                <a
                  href="https://www.youtube.com/@SHIRBAND"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[16px] text-white/85 font-light hover:text-white transition-colors"
                >
                  @SHIRBAND
                </a>
              </dd>
            </div>
          </dl>
        </section>

        <div className="w-10 h-px bg-white/15 mb-14 sm:mb-16" />

        {/* 문의 양식 */}
        <section>
          <h2 className="text-[12px] sm:text-[13px] text-white/45 tracking-[0.25em] uppercase mb-8">
            Send a Message
          </h2>

          <form onSubmit={onSubmit} className="space-y-10">
            <Field label="Name" htmlFor="name">
              <input
                id="name"
                name="name"
                type="text"
                required
                placeholder="성함을 입력해 주세요"
                className="w-full bg-transparent border-b border-white/20 px-0 py-3 text-[16px] text-white placeholder-white/25 font-light focus:border-white/60 focus:outline-none transition-colors"
              />
            </Field>

            <Field label="Email" htmlFor="email">
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="이메일을 입력해 주세요"
                className="w-full bg-transparent border-b border-white/20 px-0 py-3 text-[16px] text-white placeholder-white/25 font-light focus:border-white/60 focus:outline-none transition-colors"
              />
            </Field>

            <Field label="Subject" htmlFor="subject">
              <input
                id="subject"
                name="subject"
                type="text"
                required
                placeholder="문의 제목을 입력해 주세요"
                className="w-full bg-transparent border-b border-white/20 px-0 py-3 text-[16px] text-white placeholder-white/25 font-light focus:border-white/60 focus:outline-none transition-colors"
              />
            </Field>

            <Field label="Message" htmlFor="message">
              <textarea
                id="message"
                name="message"
                rows={6}
                required
                placeholder="문의 내용을 자세히 적어 주세요"
                className="w-full bg-transparent border-b border-white/20 px-0 py-3 text-[16px] text-white placeholder-white/25 font-light leading-loose focus:border-white/60 focus:outline-none transition-colors resize-none"
              />
            </Field>

            <PrivacyConsent agreed={privacyAgreed} onChange={setPrivacyAgreed} />

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading || !privacyAgreed}
                className="border border-white/40 px-8 py-3.5 text-[12px] tracking-[0.3em] uppercase font-light text-white hover:bg-white hover:text-black hover:border-white transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-white"
              >
                {loading ? "Sending…" : "Send Inquiry"}
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
