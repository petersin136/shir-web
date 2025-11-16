"use client";

import { useEffect, useMemo, useState } from "react";

type ContactMessage = {
  id: number;
  name: string | null;
  email: string | null;
  message: string | null;
  created_at: string | null;
};

type ParsedContact = {
  name?: string;
  email?: string;
  phone?: string;
  church?: string;
  role?: string;
  expectedText?: string;
  expectedCount?: number;
  extraMessage?: string;
};

// 메시지 본문을 분석해서 필드별로 분리
function parseContactMessage(message: string | null): ParsedContact {
  if (!message) return {};

  const lines = message
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  const result: ParsedContact = {};
  const extraMessageLines: string[] = [];
  let inExtraMessage = false;

  for (const line of lines) {
    const clean = line.replace(/^[-•]\s*/, ""); // "- " or "• " 제거

    if (clean.startsWith("이름:")) {
      result.name = clean.replace("이름:", "").trim();
      continue;
    }
    if (clean.startsWith("이메일:")) {
      result.email = clean.replace("이메일:", "").trim();
      continue;
    }
    if (clean.startsWith("연락처:")) {
      result.phone = clean.replace("연락처:", "").trim();
      continue;
    }
    if (clean.startsWith("소속교회:")) {
      result.church = clean.replace("소속교회:", "").trim();
      continue;
    }
    if (clean.startsWith("직책/역할:")) {
      result.role = clean.replace("직책/역할:", "").trim();
      continue;
    }
    if (clean.startsWith("참석 예상 인원:")) {
      const text = clean.replace("참석 예상 인원:", "").trim();
      result.expectedText = text;

      const numMatch = text.match(/(\d+)\s*명/);
      if (numMatch) {
        const n = Number(numMatch[1]);
        if (!Number.isNaN(n)) {
          result.expectedCount = n;
        }
      }
      continue;
    }
    if (clean.startsWith("추가 메시지:")) {
      inExtraMessage = true;
      const rest = clean.replace("추가 메시지:", "").trim();
      if (rest) extraMessageLines.push(rest);
      continue;
    }

    if (inExtraMessage) {
      extraMessageLines.push(clean);
    }
  }

  if (extraMessageLines.length > 0) {
    result.extraMessage = extraMessageLines.join("\n");
  }

  return result;
}

export default function ManagePage() {
  const [data, setData] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [authed, setAuthed] = useState(false);
  const [idInput, setIdInput] = useState("");
  const [pwInput, setPwInput] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);

  useEffect(() => {
    const stored =
      typeof window !== "undefined"
        ? window.localStorage.getItem("shir-admin-authed")
        : null;
    if (stored === "1") {
      setAuthed(true);
    }
  }, []);

  useEffect(() => {
    if (!authed) {
      setLoading(false);
      return;
    }

    async function load() {
      try {
        const { createClient } = await import("@/lib/supabase/client");
        const supabase = createClient();

        const { data, error } = await supabase
          .from("contact_messages")
          .select("id, name, email, message, created_at")
          .order("created_at", { ascending: false })
          .limit(100);

        if (error) {
          console.error("Supabase error (contact_messages):", error);
          setError(error.message || "데이터를 불러오는 중 오류가 발생했습니다.");
          setData([]);
          return;
        }

        setData(data ?? []);
      } catch (e) {
        console.error("Unexpected error (manage page):", e);
        setError("알 수 없는 오류가 발생했습니다.");
        setData([]);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [authed]);

  const rowsWithMeta = useMemo(
    () =>
      data.map((row, idx) => {
        const parsed = parseContactMessage(row.message);

        return {
          ...row,
          index: idx + 1,
          parsed,
          attendees: parsed.expectedCount ?? 0,
        };
      }),
    [data],
  );

  const totalAttendees = useMemo(
    () => rowsWithMeta.reduce((sum, row) => sum + (row.attendees ?? 0), 0),
    [rowsWithMeta],
  );

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginError(null);

    const ADMIN_ID = "shiradmin";
    const ADMIN_PW = "shir2025!";

    if (idInput === ADMIN_ID && pwInput === ADMIN_PW) {
      setAuthed(true);
      if (typeof window !== "undefined") {
        window.localStorage.setItem("shir-admin-authed", "1");
      }
      setIdInput("");
      setPwInput("");
    } else {
      setLoginError("아이디 또는 비밀번호가 올바르지 않습니다.");
    }
  }

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-12 sm:py-16 mt-8 sm:mt-12 bg-slate-50 text-slate-900 rounded-xl shadow-lg">
      <h1 className="text-3xl sm:text-4xl font-bold mb-4">
        관리자 - 문의/집회 신청 목록
      </h1>

      {/* 로그인 폼 */}
      {!authed && (
        <section className="max-w-md">
          <p className="text-base text-slate-600 mb-4">
            관리자 아이디와 비밀번호를 입력하세요.
          </p>
          <form onSubmit={handleLogin} className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-slate-700">
                아이디
              </label>
              <input
                type="text"
                value={idInput}
                onChange={(e) => setIdInput(e.target.value)}
                className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-base outline-none focus:ring-2 focus:ring-slate-400"
                autoComplete="username"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">
                비밀번호
              </label>
              <input
                type="password"
                value={pwInput}
                onChange={(e) => setPwInput(e.target.value)}
                className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-base outline-none focus:ring-2 focus:ring-slate-400"
                autoComplete="current-password"
              />
            </div>
            {loginError && (
              <p className="text-sm text-red-600">{loginError}</p>
            )}
            <button
              type="submit"
              className="mt-1 inline-flex items-center justify-center rounded-md bg-slate-900 px-4 py-2 text-base font-medium text-white hover:bg-slate-800"
            >
              로그인
            </button>
          </form>
        </section>
      )}

      {authed && !loading && !error && (
        <div className="mb-6 flex flex-wrap gap-4 text-sm">
          <div className="rounded-md bg-slate-100 px-4 py-2">
            <span className="font-semibold">총 신청 건수</span>{" "}
            <span className="ml-2 text-slate-700">{data.length}건</span>
          </div>
          <div className="rounded-md bg-slate-100 px-4 py-2">
            <span className="font-semibold">총 예상 참석 인원</span>{" "}
            <span className="ml-2 text-slate-700">{totalAttendees}명</span>
          </div>
        </div>
      )}

      {authed && loading && (
        <div className="text-sm text-slate-600">불러오는 중입니다...</div>
      )}

      {authed && error && (
        <div className="mb-4 rounded-md border border-red-500/40 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {authed && !loading && !error && data.length === 0 && (
        <div className="text-lg text-slate-600">데이터가 없습니다.</div>
      )}

      {authed && !loading && rowsWithMeta.length > 0 && (
        <>
          {/* 모바일: 극단적으로 간단한 카드 리스트 */}
          <div className="space-y-3 sm:hidden">
            {rowsWithMeta.map((row) => (
              <div
                key={row.id}
                className="rounded-lg border border-slate-200 bg-white px-4 py-4 shadow-sm"
              >
                <div className="flex items-center justify-between text-sm text-slate-500">
                  <span>No. {row.index}</span>
                  <span>
                    {row.created_at
                      ? new Date(row.created_at).toLocaleDateString("ko-KR")
                      : "-"}
                  </span>
                </div>
                <div className="mt-1 text-lg font-semibold">
                  {row.parsed.name || row.name || "-"}
                </div>
                <div className="mt-0.5 text-sm text-slate-600 break-all">
                  {row.parsed.email || row.email ? (
                    <a
                      href={`mailto:${row.parsed.email || row.email}`}
                      className="text-blue-600 hover:underline"
                    >
                      {row.parsed.email || row.email}
                    </a>
                  ) : (
                    "-"
                  )}
                </div>
                {(row.parsed.expectedText || row.parsed.church || row.parsed.role) && (
                  <div className="mt-1 text-sm text-slate-600 space-y-0.5">
                    {row.parsed.expectedText && (
                      <div>참석: {row.parsed.expectedText}</div>
                    )}
                    {row.parsed.church && (
                      <div>교회: {row.parsed.church}</div>
                    )}
                    {row.parsed.role && (
                      <div>직분: {row.parsed.role}</div>
                    )}
                  </div>
                )}
                {row.parsed.extraMessage && (
                  <div className="mt-1 text-sm text-slate-500 whitespace-pre-wrap">
                    {row.parsed.extraMessage}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* 데스크톱: 전체 정보 테이블 */}
          <div className="hidden sm:block">
            <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
              <table className="min-w-full text-left text-base">
                <thead className="bg-slate-100">
                  <tr>
                    <th className="px-4 py-3 font-semibold text-sm">No.</th>
                    <th className="px-4 py-3 font-semibold text-sm">이름</th>
                    <th className="px-4 py-3 font-semibold text-sm">이메일</th>
                    <th className="px-4 py-3 font-semibold text-sm">연락처</th>
                    <th className="px-4 py-3 font-semibold text-sm">
                      소속교회
                    </th>
                    <th className="px-4 py-3 font-semibold text-sm">
                      직책/역할
                    </th>
                    <th className="px-4 py-3 font-semibold text-sm whitespace-nowrap">
                      참석 예상 인원
                    </th>
                    <th className="px-4 py-3 font-semibold text-sm">
                      추가 메시지
                    </th>
                    <th className="px-4 py-3 font-semibold whitespace-nowrap">
                      받은 시간
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {rowsWithMeta.map((row) => (
                    <tr key={row.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 align-top text-sm text-slate-500">
                        {row.index}
                      </td>
                      <td className="px-4 py-3 align-top text-base font-medium">
                        {row.parsed.name || row.name || "-"}
                      </td>
                      <td className="px-4 py-3 align-top text-sm text-slate-600">
                        {row.parsed.email || row.email ? (
                          <a
                            href={`mailto:${row.parsed.email || row.email}`}
                            className="text-blue-600 hover:underline"
                          >
                            {row.parsed.email || row.email}
                          </a>
                        ) : (
                          "-"
                        )}
                      </td>
                      <td className="px-4 py-3 align-top text-sm text-slate-600 whitespace-nowrap">
                        {row.parsed.phone || "-"}
                      </td>
                      <td className="px-4 py-3 align-top text-sm text-slate-600">
                        {row.parsed.church || "-"}
                      </td>
                      <td className="px-4 py-3 align-top text-sm text-slate-600 whitespace-nowrap">
                        {row.parsed.role || "-"}
                      </td>
                      <td className="px-4 py-3 align-top text-sm text-slate-700 whitespace-nowrap">
                        {row.parsed.expectedText
                          ? row.parsed.expectedText
                          : row.attendees > 0
                            ? `${row.attendees}명`
                            : "-"}
                      </td>
                      <td className="px-4 py-3 align-top text-sm text-slate-600 max-w-xs">
                        <div className="whitespace-pre-wrap break-words">
                          {row.parsed.extraMessage || "-"}
                        </div>
                      </td>
                      <td className="px-4 py-3 align-top text-sm text-slate-500 whitespace-nowrap">
                        {row.created_at
                          ? new Date(row.created_at).toLocaleString("ko-KR")
                          : "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </main>
  );
}


