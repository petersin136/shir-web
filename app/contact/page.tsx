// app/contact/page.tsx
"use client";

import { useState } from "react";
import { BackgroundVideo } from "@/components/BackgroundVideo";

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [ok, setOk] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [privacyAgreed, setPrivacyAgreed] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setOk(null);
    setErr(null);
    setLoading(true);

    const form = e.currentTarget;
    const formData = new FormData(form);
    const payload = {
      name: String(formData.get("name") || "").trim(),
      email: String(formData.get("email") || "").trim(),
      message: String(formData.get("message") || "").trim(),
    };

    if (!privacyAgreed) {
      setErr("개인정보 수집 및 이용에 동의해주세요.");
      setLoading(false);
      return;
    }

    if (!payload.name || !payload.email || !payload.message) {
      setErr("이름/이메일/메시지를 모두 입력해 주세요.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "서버 오류");
      setOk("메시지가 전송되었습니다. 감사합니다.");
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
        {/* Header */}
        <header className="mb-14 sm:mb-16">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-light tracking-[0.2em] uppercase text-white">
            Contact
          </h1>
          <div className="w-10 h-px bg-white/30 mt-5 sm:mt-6" />
          <p className="text-[16px] text-white/70 font-light leading-loose mt-6 sm:mt-8">
            사역초청 내용을 남겨주세요.
          </p>
        </header>

        <form onSubmit={onSubmit} className="space-y-10">
          <Field label="Name" htmlFor="name">
            <input
              id="name"
              name="name"
              type="text"
              required
              placeholder="홍길동"
              className="w-full bg-transparent border-b border-white/20 px-0 py-3 text-[16px] text-white placeholder-white/25 font-light focus:border-white/60 focus:outline-none transition-colors"
            />
          </Field>

          <Field label="Email" htmlFor="email">
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="you@example.com"
              className="w-full bg-transparent border-b border-white/20 px-0 py-3 text-[16px] text-white placeholder-white/25 font-light focus:border-white/60 focus:outline-none transition-colors"
            />
          </Field>

          <Field label="Message" htmlFor="message">
            <textarea
              id="message"
              name="message"
              rows={6}
              required
              placeholder="내용을 입력해 주세요"
              className="w-full bg-transparent border-b border-white/20 px-0 py-3 text-[16px] text-white placeholder-white/25 font-light leading-loose focus:border-white/60 focus:outline-none transition-colors resize-none"
            />
          </Field>

          <PrivacyConsent
            agreed={privacyAgreed}
            onChange={setPrivacyAgreed}
          />

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading || !privacyAgreed}
              className="border border-white/40 px-8 py-3.5 text-[12px] tracking-[0.3em] uppercase font-light text-white hover:bg-white hover:text-black hover:border-white transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-white"
            >
              {loading ? "Sending…" : "Send Message"}
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
      <label className="flex items-start gap-3 cursor-pointer group">
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
