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

    if (
      !payload.name ||
      !payload.phone ||
      !payload.email ||
      !payload.church ||
      !payload.reason
    ) {
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

      const contentType = res.headers.get("content-type") || "";
      let data: { error?: string; message?: string } | null = null;
      if (contentType.includes("application/json")) {
        data = await res.json().catch(() => null);
      } else {
        await res.text().catch(() => "");
      }

      if (!res.ok) {
        throw new Error(
          data?.error ||
            `요청 처리에 실패했습니다. (HTTP ${res.status})`
        );
      }
      setOk("사역 신청이 완료되었습니다. 감사합니다.");
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
        <header className="mb-14 sm:mb-16">
          <p className="text-[12px] sm:text-[13px] text-white/45 tracking-[0.25em] uppercase mb-3">
            Ministry Invitation
          </p>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-light tracking-[0.2em] uppercase text-white">
            Apply
          </h1>
          <div className="w-10 h-px bg-white/30 mt-5 sm:mt-6" />
          <p className="text-[16px] text-white/70 font-light leading-loose mt-6 sm:mt-8">
            SHIR BAND 사역초청을 원하신다면 아래 양식을 작성해주세요.
          </p>
        </header>

        <form onSubmit={onSubmit} className="space-y-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-10">
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
            <Field label="Phone" htmlFor="phone">
              <input
                id="phone"
                name="phone"
                type="tel"
                required
                placeholder="010-1234-5678"
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
            <Field label="Church" htmlFor="church">
              <input
                id="church"
                name="church"
                type="text"
                required
                placeholder="○○교회"
                className="w-full bg-transparent border-b border-white/20 px-0 py-3 text-[16px] text-white placeholder-white/25 font-light focus:border-white/60 focus:outline-none transition-colors"
              />
            </Field>
          </div>

          <Field label="Invitation Details" htmlFor="reason">
            <textarea
              id="reason"
              name="reason"
              rows={6}
              required
              placeholder="SHIR BAND 사역초청을 원하는 이유와 상세 내용을 적어주세요."
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
              {loading ? "Sending…" : "Submit Application"}
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
