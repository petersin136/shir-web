// app/contact/page.tsx
"use client";

import { useState } from "react";

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
    } catch (e: any) {
      setErr(e.message || "전송에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl sm:text-5xl tracking-widest uppercase mb-8">
        Contact
      </h1>

      <p className="text-sm sm:text-base text-white/80 mb-8">
        교회 협력/집회 요청/문의 사항을 남겨 주세요.
      </p>

      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className="block">
            <span className="text-xs sm:text-sm text-white/70">이름</span>
            <input
              name="name"
              type="text"
              required
              className="mt-1 w-full rounded-md bg-white/5 ring-1 ring-white/10 px-3 py-2 outline-none focus:ring-white/30"
              placeholder="홍길동"
            />
          </label>
          <label className="block">
            <span className="text-xs sm:text-sm text-white/70">이메일</span>
            <input
              name="email"
              type="email"
              required
              className="mt-1 w-full rounded-md bg-white/5 ring-1 ring-white/10 px-3 py-2 outline-none focus:ring-white/30"
              placeholder="you@example.com"
            />
          </label>
        </div>

        <label className="block">
          <span className="text-xs sm:text-sm text-white/70">메시지</span>
          <textarea
            name="message"
            rows={6}
            required
            className="mt-1 w-full rounded-md bg-white/5 ring-1 ring-white/10 px-3 py-2 outline-none focus:ring-white/30"
            placeholder="내용을 입력해 주세요."
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          className="mt-2 inline-flex items-center justify-center rounded border border-white px-5 py-2 text-sm sm:text-base hover:bg-white hover:text-black transition-colors disabled:opacity-50"
        >
          {loading ? "전송 중..." : "메시지 보내기"}
        </button>

        {ok && <p className="text-emerald-400 text-sm mt-2">{ok}</p>}
        {err && <p className="text-red-400 text-sm mt-2">{err}</p>}
      </form>
    </main>
  );
}
