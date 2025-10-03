// app/contact/page.tsx
"use client";

import { useState } from "react";
import { BackgroundVideo } from "@/components/BackgroundVideo";

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [ok, setOk] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

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
      setOk("메시지가 전송되었습니다. 감사합니다!");
      form.reset();
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
      <main className="relative mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-wide uppercase mb-10">
        Contact
      </h1>

      <p className="text-base sm:text-lg md:text-xl text-white font-medium mb-10">
        교회 협력/집회 요청/문의 사항을 남겨 주세요.
      </p>

      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <label className="block">
            <span className="text-sm sm:text-base md:text-lg text-white font-medium">이름</span>
            <input
              name="name"
              type="text"
              required
              className="mt-2 w-full rounded-md bg-white/5 ring-1 ring-white/10 px-4 py-3 outline-none focus:ring-white/30 text-base sm:text-lg"
              placeholder="홍길동"
            />
          </label>
          <label className="block">
            <span className="text-sm sm:text-base md:text-lg text-white font-medium">이메일</span>
            <input
              name="email"
              type="email"
              required
              className="mt-2 w-full rounded-md bg-white/5 ring-1 ring-white/10 px-4 py-3 outline-none focus:ring-white/30 text-base sm:text-lg"
              placeholder="you@example.com"
            />
          </label>
        </div>

        <label className="block">
          <span className="text-sm sm:text-base md:text-lg text-white font-medium">메시지</span>
          <textarea
            name="message"
            rows={7}
            required
            className="mt-2 w-full rounded-md bg-white/5 ring-1 ring-white/10 px-4 py-3 outline-none focus:ring-white/30 text-base sm:text-lg"
            placeholder="내용을 입력해 주세요."
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          className="mt-4 inline-flex items-center justify-center rounded border border-white px-8 py-4 text-base sm:text-lg md:text-xl font-medium hover:bg-white hover:text-black transition-colors disabled:opacity-50"
        >
          {loading ? "전송 중..." : "메시지 보내기"}
        </button>

        {ok && <p className="text-emerald-400 text-base sm:text-lg font-medium mt-4">{ok}</p>}
        {err && <p className="text-red-400 text-base sm:text-lg font-medium mt-4">{err}</p>}
      </form>
      </main>
    </>
  );
}
