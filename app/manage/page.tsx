"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import * as XLSX from "xlsx";

// jspdf와 jspdf-autotable은 클라이언트 사이드에서만 사용
async function loadPDFLibraries() {
  if (typeof window === "undefined") {
    throw new Error("PDF 라이브러리는 브라우저에서만 사용할 수 있습니다.");
  }

  try {
    // jspdf-autotable v5.x는 autoTable을 함수로 직접 import
    const [jsPDFModule, autoTableModule] = await Promise.all([
      import("jspdf"),
      import("jspdf-autotable"),
    ]);

    // jspdf는 default export 또는 named export일 수 있음
    const jsPDF = jsPDFModule.jsPDF || jsPDFModule.default;
    const autoTable = autoTableModule.autoTable || autoTableModule.default;

    if (!jsPDF) {
      throw new Error("jsPDF를 로드할 수 없습니다.");
    }
    if (!autoTable) {
      throw new Error("autoTable을 로드할 수 없습니다.");
    }

    return { jsPDF, autoTable };
  } catch (error) {
    console.error("PDF 라이브러리 로드 오류:", error);
    throw new Error(`PDF 라이브러리를 로드할 수 없습니다: ${error instanceof Error ? error.message : String(error)}`);
  }
}

type ContactMessage = {
  id: number;
  name: string | null;
  email: string | null;
  message: string | null;
  created_at: string | null;
};

type Application = {
  id: number;
  name: string | null;
  phone: string | null;
  email: string | null;
  church: string | null;
  reason: string | null;
  created_at: string | null;
};

type TabId = "metanoia" | "oneness" | "inquiry" | "applications";

/** 연도 pill — 데이터 필터는 `activeTab`과 동일 */
const METANOIA_ARCHIVE: { year: number; tab: TabId }[] = [
  { year: 2026, tab: "metanoia" },
];

const ONENESS_ARCHIVE: { year: number; tab: TabId }[] = [
  { year: 2026, tab: "oneness" },
];

function isOnenessMessage(msg: string | null): boolean {
  if (!msg) return false;
  return msg.includes("ONENESS Worship 2026");
}

function isMetanoiaMessage(msg: string | null): boolean {
  if (!msg) return false;
  if (isOnenessMessage(msg)) return false;
  return msg.includes("참석 세션:") || msg.includes("Metanoia 2026") || msg.includes("집회 신청 정보:");
}

function isInquiryMessage(msg: string | null): boolean {
  if (!msg) return false;
  return msg.trim().startsWith("제목:");
}

type ParsedContact = {
  name?: string;
  email?: string;
  phone?: string;
  church?: string;
  role?: string;
  expectedText?: string;
  expectedCount?: number;
  sessions?: string;
  extraMessage?: string;
  unitPrice?: number;
  paidAmount?: number;
};

function parseAmount(raw: string): number | undefined {
  const digits = raw.replace(/[^\d]/g, "");
  if (!digits) return undefined;
  const value = Number(digits);
  return Number.isNaN(value) ? undefined : value;
}

function formatKRW(amount: number): string {
  return `${amount.toLocaleString("ko-KR")}원`;
}

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
    if (clean.startsWith("소속교회:") || clean.startsWith("소속 교회:")) {
      result.church = clean.replace(/^소속\s*교회:\s*/, "").trim();
      continue;
    }
    if (clean.startsWith("티켓 매수:")) {
      const text = clean.replace("티켓 매수:", "").trim();
      result.expectedText = text;
      const numMatch = text.match(/(\d+)/);
      if (numMatch) {
        const count = Number(numMatch[1]);
        if (!Number.isNaN(count) && count > 0) result.expectedCount = count;
      }
      continue;
    }
    if (clean.startsWith("요금 구분:")) {
      result.role = clean.replace("요금 구분:", "").trim();
      continue;
    }
    if (clean.startsWith("1매 단가:")) {
      const text = clean.replace("1매 단가:", "").trim();
      const value = parseAmount(text);
      if (value !== undefined) result.unitPrice = value;
      extraMessageLines.push(clean);
      continue;
    }
    if (clean.startsWith("입금 금액:")) {
      const text = clean.replace("입금 금액:", "").trim();
      const value = parseAmount(text);
      if (value !== undefined) result.paidAmount = value;
      extraMessageLines.push(clean);
      continue;
    }
    if (
      clean.startsWith("신청번호:") ||
      clean.startsWith("집회:") ||
      clean.startsWith("일시:") ||
      clean.startsWith("장소:") ||
      clean.startsWith("입금 계좌:") ||
      clean.startsWith("담당자:") ||
      clean.startsWith("입금자명:") ||
      clean.includes("[SHIR BAND 티켓 신청]")
    ) {
      extraMessageLines.push(clean);
      continue;
    }
    if (clean.startsWith("직책/역할:")) {
      result.role = clean.replace("직책/역할:", "").trim();
      continue;
    }
    if (clean.startsWith("참석 예상 인원:")) {
      const text = clean.replace("참석 예상 인원:", "").trim();
      result.expectedText = text;

      // 빈 값이거나 "-"인 경우 1명으로 기본 처리 (신청자 본인)
      if (!text || text === "-" || text === "") {
        result.expectedCount = 1;
        continue;
      }

      // 숫자 추출 (여러 패턴 지원)
      let count = 0;
      
      // "본인외X명" 또는 "본인.X명" 패턴 (본인 포함해서 X+1명)
      const selfPlusMatch = text.match(/본인\s*[외.]\s*(\d+)\s*명/i);
      if (selfPlusMatch) {
        count = Number(selfPlusMatch[1]) + 1; // 본인 포함
      }
      // "보은,보은맘(해외전사님)" 같이 쉼표로 구분된 이름 패턴
      // 괄호 안 내용 제거 후 쉼표로 분리
      else if (text.includes(',') || text.includes('，')) {
        const cleanText = text.replace(/\([^)]*\)/g, ''); // 괄호 제거
        const names = cleanText.split(/[,，]/).filter(n => n.trim().length > 0);
        count = names.length;
      }
      // "X명" 패턴 (첫 번째 숫자만 추출)
      else if (text.match(/(\d+)\s*명/)) {
        const numMatch = text.match(/(\d+)\s*명/);
        if (numMatch) {
          count = Number(numMatch[1]);
        }
      }
      // 숫자만 있는 경우 (예: "2", "5")
      else if (/^\d+$/.test(text)) {
        count = Number(text);
      }
      // "개인 1명", "팀 5명" 등 (첫 번째 숫자 추출)
      else if (text.match(/(\d+)/)) {
        const numMatch = text.match(/(\d+)/);
        if (numMatch) {
          count = Number(numMatch[1]);
        }
      }
      // 아무 패턴도 매칭 안 되면 1명 (신청자 본인)
      else {
        count = 1;
      }

      if (!Number.isNaN(count) && count > 0) {
        result.expectedCount = count;
      } else {
        result.expectedCount = 1; // 기본값
      }
      continue;
    }
    if (clean.startsWith("참석 세션:")) {
      result.sessions = clean.replace("참석 세션:", "").trim();
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

const PAGE_SIZE = 15;
const MAX_PAGE_NUMBERS = 10;

function getVisiblePageNumbers(current: number, total: number, max = MAX_PAGE_NUMBERS): number[] {
  if (total <= max) return Array.from({ length: total }, (_, i) => i + 1);
  let start = Math.max(1, current - Math.floor(max / 2));
  let end = start + max - 1;
  if (end > total) {
    end = total;
    start = Math.max(1, end - max + 1);
  }
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}

type ConferenceRow = ContactMessage & {
  index: number;
  parsed: ParsedContact;
  attendees: number;
  amount: number;
};

function computeRowAmount(parsed: ParsedContact, attendees: number): number {
  if (parsed.paidAmount !== undefined) return parsed.paidAmount;
  if (parsed.unitPrice !== undefined && attendees > 0) {
    return parsed.unitPrice * attendees;
  }
  return 0;
}

type DetailModalState =
  | { kind: "conference"; row: ConferenceRow }
  | { kind: "inquiry"; row: { index: number } & ContactMessage }
  | { kind: "application"; row: Application; displayIndex: number };

/** 페이지마다 행 수가 달라져도 페이지네이션 위치가 흔들리지 않도록 tbody 하단에 빈 행을 채웁니다. */
function AdminTablePadRows({ colSpan, padCount }: { colSpan: number; padCount: number }) {
  if (padCount <= 0) return null;
  return (
    <>
      {Array.from({ length: padCount }, (_, i) => (
        <tr
          key={`admin-table-pad-${i}`}
          aria-hidden
          className="pointer-events-none select-none border-b border-white/5"
        >
          {Array.from({ length: colSpan }, (_, j) => (
            <td key={j} className="h-[3.5rem] bg-[#141414]/40 px-4 py-0 align-middle" />
          ))}
        </tr>
      ))}
    </>
  );
}

function AdminPagination({
  page,
  totalPages,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  onPageChange: (p: number) => void;
}) {
  if (totalPages <= 1) return null;
  const pages = getVisiblePageNumbers(page, totalPages);
  return (
    <div className="flex flex-wrap items-center justify-center gap-1.5 pt-4 sm:gap-2">
      <button
        type="button"
        onClick={() => onPageChange(Math.max(1, page - 1))}
        disabled={page <= 1}
        className="rounded border border-white/15 bg-transparent px-2.5 py-1.5 text-xs text-white/65 transition-colors duration-150 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40 sm:px-3 sm:text-sm"
      >
        Prev
      </button>
      {pages.map((p) => (
        <button
          key={p}
          type="button"
          onClick={() => onPageChange(p)}
          className={`min-w-[2rem] rounded border px-2 py-1.5 text-xs tabular-nums transition-colors duration-150 sm:min-w-[2.25rem] sm:text-sm ${
            p === page
              ? "border-white bg-white font-medium text-black"
              : "border-white/15 text-white/70 hover:border-white/30 hover:bg-white/5"
          }`}
        >
          {p}
        </button>
      ))}
      <button
        type="button"
        onClick={() => onPageChange(Math.min(totalPages, page + 1))}
        disabled={page >= totalPages}
        className="rounded border border-white/15 bg-transparent px-2.5 py-1.5 text-xs text-white/65 transition-colors duration-150 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40 sm:px-3 sm:text-sm"
      >
        Next
      </button>
    </div>
  );
}

function DetailBlock({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <div className="text-xs font-semibold uppercase tracking-[0.18em] text-white/50 sm:text-sm">
        {label}
      </div>
      <div className="mt-2 text-base leading-relaxed text-white sm:text-lg">{children}</div>
    </div>
  );
}

export default function ManagePage() {
  const [data, setData] = useState<ContactMessage[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [authed, setAuthed] = useState(false);
  const [idInput, setIdInput] = useState("");
  const [pwInput, setPwInput] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabId>("metanoia");
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const [page, setPage] = useState(1);
  const [detailModal, setDetailModal] = useState<DetailModalState | null>(null);

  const refreshData = () => setRefreshTrigger((t) => t + 1);

  useEffect(() => {
    setPage(1);
  }, [activeTab]);

  useEffect(() => {
    setDetailModal(null);
  }, [activeTab]);

  useEffect(() => {
    if (!detailModal) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setDetailModal(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [detailModal]);

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

    async function load(retryCount = 0) {
      const MAX_RETRIES = 2; // 최대 2번 재시도
      const RETRY_DELAY = 3000; // 3초 대기

      try {
        const { createClient } = await import("@/lib/supabase/client");
        const supabase = createClient();

        const [contactRes, applicationsRes] = await Promise.all([
          supabase
            .from("contact_messages")
            .select("id, name, email, message, created_at")
            .order("created_at", { ascending: false })
            .limit(200),
          supabase
            .from("applications")
            .select("id, name, phone, email, church, reason, created_at")
            .order("created_at", { ascending: false })
            .limit(200),
        ]);

        const { data: contactData, error } = contactRes;
        const { data: applicationsData, error: applicationsError } = applicationsRes;

        if (error) {
          console.error("Supabase error (contact_messages):", error);
          
          // Supabase 프로젝트가 복원 중이거나 일시 중지된 경우 자동 재시도
          const isServerError = 
            error.code === "PGRST116" || 
            error.message?.includes("500") || 
            error.message?.includes("Internal Server Error") ||
            error.message?.includes("Failed to fetch");

          if (isServerError && retryCount < MAX_RETRIES) {
            console.log(`Supabase 서버 오류 감지. ${RETRY_DELAY / 1000}초 후 재시도... (${retryCount + 1}/${MAX_RETRIES})`);
            setError(`Supabase 프로젝트가 복원 중일 수 있습니다. 자동으로 재시도 중... (${retryCount + 1}/${MAX_RETRIES})`);
            
            // 재시도
            setTimeout(() => {
              load(retryCount + 1);
            }, RETRY_DELAY);
            return;
          }
          
          // 재시도 횟수 초과 또는 다른 오류
          let errorMsg = "데이터를 불러오는 중 오류가 발생했습니다.";
          
          if (isServerError) {
            errorMsg = "Supabase 프로젝트가 복원 중이거나 일시 중지되었을 수 있습니다. Supabase 대시보드에서 프로젝트를 재시작해주세요.";
          } else if (error.message?.includes("CORS") || error.message?.includes("fetch")) {
            errorMsg = "네트워크 연결 오류가 발생했습니다. Supabase 설정을 확인해주세요.";
          } else if (error.message) {
            errorMsg = error.message;
          } else if (error.details) {
            errorMsg = error.details;
          } else if (error.hint) {
            errorMsg = error.hint;
          }
          
          setError(errorMsg);
          setData([]);
          setLoading(false);
          return;
        }

        // 성공
        setData(contactData ?? []);
        setApplications(applicationsData ?? []);
        if (applicationsError) {
          console.warn("applications 로드 경고:", applicationsError);
        }
        setError(null);
        setLoading(false);
      } catch (e) {
        console.error("Unexpected error (manage page):", e);
        
        // 네트워크 오류인 경우 재시도
        const errorMessage = e instanceof Error ? e.message : String(e);
        const isNetworkError = 
          errorMessage.includes("Failed to fetch") || 
          errorMessage.includes("CORS") ||
          errorMessage.includes("NetworkError");

        if (isNetworkError && retryCount < MAX_RETRIES) {
          console.log(`네트워크 오류 감지. ${RETRY_DELAY / 1000}초 후 재시도... (${retryCount + 1}/${MAX_RETRIES})`);
          setError(`네트워크 연결 오류. 자동으로 재시도 중... (${retryCount + 1}/${MAX_RETRIES})`);
          
          setTimeout(() => {
            load(retryCount + 1);
          }, RETRY_DELAY);
          return;
        }
        
        // 재시도 횟수 초과 또는 다른 오류
        let errorMsg = "알 수 없는 오류가 발생했습니다.";
        if (errorMessage.includes("Failed to fetch") || errorMessage.includes("CORS")) {
          errorMsg = "네트워크 연결 오류가 발생했습니다. 인터넷 연결과 Supabase 설정을 확인해주세요.";
        } else if (errorMessage) {
          errorMsg = errorMessage;
        }
        
        setError(errorMsg);
        setData([]);
        setLoading(false);
      }
    }

    load();
  }, [authed, refreshTrigger]);

  const metanoiaRows = useMemo<ConferenceRow[]>(() => {
    const filtered = data.filter((r) => isMetanoiaMessage(r.message));
    return filtered.map((row, idx) => {
      const parsed = parseContactMessage(row.message);
      const attendees = parsed.expectedCount ?? 0;
      return {
        ...row,
        index: idx + 1,
        parsed,
        attendees,
        amount: computeRowAmount(parsed, attendees),
      };
    });
  }, [data]);

  const onenessRows = useMemo<ConferenceRow[]>(() => {
    const filtered = data.filter((r) => isOnenessMessage(r.message));
    return filtered.map((row, idx) => {
      const parsed = parseContactMessage(row.message);
      const attendees = parsed.expectedCount ?? 0;
      return {
        ...row,
        index: idx + 1,
        parsed,
        attendees,
        amount: computeRowAmount(parsed, attendees),
      };
    });
  }, [data]);

  const inquiryRows = useMemo(() => {
    const filtered = data.filter((r) => isInquiryMessage(r.message));
    return filtered.map((row, idx) => ({
      ...row,
      index: idx + 1,
    }));
  }, [data]);

  const paginatedMetanoia = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return metanoiaRows.slice(start, start + PAGE_SIZE);
  }, [metanoiaRows, page]);
  const paginatedOneness = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return onenessRows.slice(start, start + PAGE_SIZE);
  }, [onenessRows, page]);
  const paginatedInquiry = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return inquiryRows.slice(start, start + PAGE_SIZE);
  }, [inquiryRows, page]);
  const paginatedApplications = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return applications.slice(start, start + PAGE_SIZE);
  }, [applications, page]);

  const currentPaginatedRows = useMemo(() => {
    if (activeTab === "metanoia") return paginatedMetanoia;
    if (activeTab === "oneness") return paginatedOneness;
    return [];
  }, [activeTab, paginatedMetanoia, paginatedOneness]);

  const totalPages = useMemo(() => {
    const total =
      activeTab === "metanoia"
        ? metanoiaRows.length
        : activeTab === "oneness"
          ? onenessRows.length
          : activeTab === "inquiry"
            ? inquiryRows.length
            : applications.length;
    return Math.max(1, Math.ceil(total / PAGE_SIZE));
  }, [activeTab, metanoiaRows.length, onenessRows.length, inquiryRows.length, applications.length]);

  const currentRows = useMemo(() => {
    if (activeTab === "metanoia") return metanoiaRows;
    if (activeTab === "oneness") return onenessRows;
    if (activeTab === "inquiry") return inquiryRows;
    return [];
  }, [activeTab, metanoiaRows, onenessRows, inquiryRows]);

  const totalAttendeesMetanoia = useMemo(
    () => metanoiaRows.reduce((sum, row) => sum + (row.attendees ?? 0), 0),
    [metanoiaRows],
  );
  const totalAttendeesOneness = useMemo(
    () => onenessRows.reduce((sum, row) => sum + (row.attendees ?? 0), 0),
    [onenessRows],
  );
  const totalAmountMetanoia = useMemo(
    () => metanoiaRows.reduce((sum, row) => sum + (row.amount ?? 0), 0),
    [metanoiaRows],
  );
  const totalAmountOneness = useMemo(
    () => onenessRows.reduce((sum, row) => sum + (row.amount ?? 0), 0),
    [onenessRows],
  );

  const currentTabIds = useMemo(() => {
    if (activeTab === "metanoia") return metanoiaRows.map((r) => r.id);
    if (activeTab === "oneness") return onenessRows.map((r) => r.id);
    if (activeTab === "inquiry") return inquiryRows.map((r) => r.id);
    if (activeTab === "applications") return applications.map((r) => r.id);
    return [];
  }, [activeTab, metanoiaRows, onenessRows, inquiryRows, applications]);

  const currentTabType = useMemo(
    () => (activeTab === "applications" ? "applications" : "contact_messages"),
    [activeTab]
  );

  async function handleDelete(ids: (number | string)[]) {
    const validIds = ids.filter((id) => id != null && id !== "");
    if (validIds.length === 0) return;
    if (!confirm("정말 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.")) return;
    setDeleting(true);
    try {
      const res = await fetch("/api/manage/delete-rows", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          adminId: "shiradmin",
          adminPw: "shir2025!",
          type: currentTabType,
          ids: validIds,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "삭제 실패");
      refreshData();
    } catch (e) {
      alert(e instanceof Error ? e.message : "삭제 중 오류가 발생했습니다.");
    } finally {
      setDeleting(false);
    }
  }

  function handleDeleteAll() {
    if (currentTabIds.length === 0) return;
    if (!confirm(`정말 ${currentTabIds.length}건을 모두 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.`)) return;
    handleDelete(currentTabIds);
  }

  // 엑셀 다운로드 함수
  async function handleExportExcel() {
    try {
      let fileName: string;
      if (activeTab === "applications") {
        const worksheetData = applications.map((row, idx) => ({
          No: idx + 1,
          이름: row.name || "-",
          연락처: row.phone || "-",
          소속교회: row.church || "-",
          사역초청내용: row.reason || "-",
          받은시간: row.created_at ? new Date(row.created_at).toLocaleString("ko-KR") : "-",
        }));
        const worksheet = XLSX.utils.json_to_sheet(worksheetData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "사역신청");
        fileName = `사역신청목록_${new Date().toISOString().split("T")[0]}.xlsx`;
        XLSX.writeFile(workbook, fileName);
      } else if (activeTab === "inquiry") {
        const worksheetData = inquiryRows.map((row) => ({
          No: row.index,
          이름: row.name || "-",
          메시지: row.message || "-",
          받은시간: row.created_at ? new Date(row.created_at).toLocaleString("ko-KR") : "-",
        }));
        const worksheet = XLSX.utils.json_to_sheet(worksheetData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "문의목록");
        fileName = `문의하기_목록_${new Date().toISOString().split("T")[0]}.xlsx`;
        XLSX.writeFile(workbook, fileName);
      } else {
        const rows = activeTab === "metanoia" ? metanoiaRows : onenessRows;
        const totalAttendees =
          activeTab === "metanoia" ? totalAttendeesMetanoia : totalAttendeesOneness;
        const totalAmount =
          activeTab === "metanoia" ? totalAmountMetanoia : totalAmountOneness;
        const worksheetData: Array<Record<string, string | number>> = rows.map((row) => ({
          No: row.index,
          이름: row.parsed.name || row.name || "-",
          연락처: row.parsed.phone || "-",
          소속교회: row.parsed.church || "-",
          직책역할: row.parsed.role || "-",
          참석예상인원: row.parsed.expectedText || (row.attendees > 0 ? `${row.attendees}명` : "-"),
          금액: row.amount > 0 ? formatKRW(row.amount) : "-",
          참석세션: row.parsed.sessions || "-",
          추가메시지: row.parsed.extraMessage || "-",
          받은시간: row.created_at ? new Date(row.created_at).toLocaleString("ko-KR") : "-",
        }));
        worksheetData.push({
          No: "",
          이름: "합계",
          연락처: "",
          소속교회: "",
          직책역할: "",
          참석예상인원: `${totalAttendees}명`,
          금액: totalAmount > 0 ? formatKRW(totalAmount) : "무료",
          참석세션: "",
          추가메시지: "",
          받은시간: "",
        });
        const worksheet = XLSX.utils.json_to_sheet(worksheetData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "신청목록");
        fileName = `${activeTab === "metanoia" ? "METANOIA" : "ONENESS"}_신청목록_${new Date().toISOString().split("T")[0]}.xlsx`;
        XLSX.writeFile(workbook, fileName);
      }
      const recordCount =
        activeTab === "applications"
          ? applications.length
          : activeTab === "inquiry"
            ? inquiryRows.length
            : activeTab === "metanoia"
              ? metanoiaRows.length
              : onenessRows.length;
      const totalCount =
        activeTab === "applications" || activeTab === "inquiry"
          ? 0
          : activeTab === "metanoia"
            ? totalAttendeesMetanoia
            : totalAttendeesOneness;
      await saveDownloadRecord("excel", fileName, recordCount, totalCount);
    } catch (error) {
      console.error("엑셀 다운로드 오류:", error);
      alert("엑셀 다운로드 중 오류가 발생했습니다.");
    }
  }

  // 모바일 디바이스 감지
  function isMobileDevice(): boolean {
    if (typeof window === "undefined") return false;
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    ) || window.innerWidth < 768;
  }

  // PDF 다운로드 함수
  async function handleExportPDF() {
    try {
      const isMobile = isMobileDevice();
      
      // PDF 라이브러리 로드
      const { jsPDF, autoTable } = await loadPDFLibraries();

      const doc = new jsPDF("landscape", "mm", "a4");
      
      // 한글 폰트 추가 (Noto Sans KR)
      // jsPDF에서 한글을 지원하려면 한글 폰트를 추가해야 함
      let fontLoaded = false;
      const fontName = "NotoSansKR";
      
      // 모바일에서는 폰트 로드를 더 안전하게 처리
      if (!isMobile) {
        try {
          // 여러 폰트 소스 시도 (우선순위 순서)
          const fontUrls = [
            "https://fonts.gstatic.com/s/notosanskr/v38/PbyxFmXiEBPT4ITbgNA5Cgms3VYcOA-vvnIzzuoyeLQ.ttf",
            "https://cdn.jsdelivr.net/gh/google/fonts@main/ofl/notosanskr/NotoSansKR-Regular.ttf",
          ];
          
          let fontLoadedSuccess = false;
          
          for (const fontUrl of fontUrls) {
            try {
              const fontResponse = await fetch(fontUrl, {
                mode: 'cors',
                cache: 'default'
              });
              
              if (!fontResponse.ok) {
                continue; // 다음 URL 시도
              }
              
              const fontArrayBuffer = await fontResponse.arrayBuffer();
              const fontBytes = new Uint8Array(fontArrayBuffer);
              
              // Base64 인코딩 - 큰 파일도 처리 가능하도록
              let binaryString = '';
              const len = fontBytes.length;
              for (let i = 0; i < len; i++) {
                binaryString += String.fromCharCode(fontBytes[i]);
              }
              const fontBase64 = btoa(binaryString);
              
              // 폰트를 jsPDF에 추가
              doc.addFileToVFS("NotoSansKR-Regular.ttf", fontBase64);
              doc.addFont("NotoSansKR-Regular.ttf", fontName, "normal");
              doc.setFont(fontName);
              
              // 폰트가 제대로 추가되었는지 확인
              const testFont = doc.getFontList();
              if (testFont[fontName]) {
                fontLoaded = true;
                fontLoadedSuccess = true;
                console.log("한글 폰트가 성공적으로 로드되었습니다.");
                break; // 성공하면 루프 종료
              }
            } catch (urlError) {
              console.warn(`폰트 URL 실패 (${fontUrl}):`, urlError);
              continue; // 다음 URL 시도
            }
          }
          
          if (!fontLoadedSuccess) {
            throw new Error("모든 폰트 소스에서 로드 실패");
          }
        } catch (fontError) {
          console.error("한글 폰트 로드 실패:", fontError);
          fontLoaded = false;
        }
      } else {
        // 모바일에서는 폰트 로드를 시도하되, 실패해도 계속 진행
        try {
          // 모바일에서는 타임아웃을 짧게 설정
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 10000); // 10초 타임아웃
          
          const fontUrl = "https://fonts.gstatic.com/s/notosanskr/v38/PbyxFmXiEBPT4ITbgNA5Cgms3VYcOA-vvnIzzuoyeLQ.ttf";
          const fontResponse = await fetch(fontUrl, {
            mode: 'cors',
            cache: 'default',
            signal: controller.signal
          });
          
          clearTimeout(timeoutId);
          
          if (fontResponse.ok) {
            const fontArrayBuffer = await fontResponse.arrayBuffer();
            const fontBytes = new Uint8Array(fontArrayBuffer);
            
            // 모바일에서는 청크 단위로 처리하여 메모리 부족 방지
            let binaryString = '';
            const chunkSize = 1024; // 작은 청크로 처리
            for (let i = 0; i < fontBytes.length; i += chunkSize) {
              const chunk = fontBytes.slice(i, i + chunkSize);
              binaryString += String.fromCharCode(...new Uint8Array(chunk));
            }
            const fontBase64 = btoa(binaryString);
            
            // 폰트를 jsPDF에 추가
            doc.addFileToVFS("NotoSansKR-Regular.ttf", fontBase64);
            doc.addFont("NotoSansKR-Regular.ttf", fontName, "normal");
            doc.setFont(fontName);
            
            // 폰트가 제대로 추가되었는지 확인
            const testFont = doc.getFontList();
            if (testFont[fontName]) {
              fontLoaded = true;
              console.log("한글 폰트가 성공적으로 로드되었습니다.");
            }
          }
        } catch (fontError) {
          console.warn("모바일에서 한글 폰트 로드 실패 (계속 진행):", fontError);
          fontLoaded = false;
        }
      }
      
      // 제목 추가 - 폰트가 로드된 경우에만 한글 폰트 사용
      if (fontLoaded) {
        doc.setFont(fontName);
      }
      const pdfRows =
        activeTab === "metanoia"
          ? metanoiaRows
          : activeTab === "oneness"
            ? onenessRows
            : [];
      const pdfTotal =
        activeTab === "metanoia" ? totalAttendeesMetanoia : totalAttendeesOneness;
      const pdfAmountTotal =
        activeTab === "metanoia" ? totalAmountMetanoia : totalAmountOneness;
      const pdfAmountText = pdfAmountTotal > 0 ? formatKRW(pdfAmountTotal) : "무료";
      const pdfTitle =
        activeTab === "metanoia"
          ? "METANOIA 2026 신청 목록"
          : activeTab === "oneness"
            ? "ONENESS Worship 2026 신청 목록"
            : "문의하기 목록";

      doc.setFontSize(16);
      doc.text(
        activeTab === "applications"
          ? "사역 신청 목록"
          : activeTab === "inquiry"
            ? "문의하기 목록"
            : pdfTitle,
        14,
        15
      );
      doc.setFontSize(10);
      doc.text(`생성일: ${new Date().toLocaleString("ko-KR")}`, 14, 22);
      if (activeTab === "applications") {
        doc.text(`총 ${applications.length}건`, 14, 27);
      } else if (activeTab === "inquiry") {
        doc.text(`총 ${inquiryRows.length}건`, 14, 27);
      } else {
        doc.text(
          `총 ${pdfRows.length}건  ·  총 예상 참석 인원: ${pdfTotal}명  ·  총 금액: ${pdfAmountText}`,
          14,
          27
        );
      }

      // 테이블 데이터 준비
      let tableData: string[][];
      let tableHead: string[][];
      let tableFoot: string[][] | undefined;

      if (activeTab === "applications") {
        tableHead = [["No.", "이름", "연락처", "소속교회", "사역초청내용", "받은 시간"]];
        tableData = applications.map((row, idx) => [
          String(idx + 1),
          String(row.name || "-"),
          String(row.phone || "-"),
          String(row.church || "-"),
          String((row.reason || "-").length > 40 ? (row.reason || "").substring(0, 40) + "..." : row.reason || "-"),
          row.created_at ? new Date(row.created_at).toLocaleDateString("ko-KR") : "-",
        ]);
      } else if (activeTab === "inquiry") {
        tableHead = [["No.", "이름", "메시지", "받은 시간"]];
        tableData = inquiryRows.map((row) => [
          String(row.index || ""),
          String(row.name || "-"),
          String((row.message || "-").length > 50 ? (row.message || "").substring(0, 50) + "..." : row.message || "-"),
          row.created_at ? new Date(row.created_at).toLocaleDateString("ko-KR") : "-",
        ]);
      } else {
        tableHead = [
          [
            "No.",
            "이름",
            "연락처",
            "소속교회",
            "직책/역할",
            "참석 예상 인원",
            "금액",
            "참석 세션",
            "추가 메시지",
            "받은 시간",
          ],
        ];
        tableData = pdfRows.map((row) => {
          const extraMsg = row.parsed?.extraMessage || "-";
          const sessions = row.parsed?.sessions || "-";
          return [
            String(row.index || ""),
            String(row.parsed?.name || row.name || "-"),
            String(row.parsed?.phone || "-"),
            String(row.parsed?.church || "-"),
            String(row.parsed?.role || "-"),
            String(
              row.parsed?.expectedText ||
                (row.attendees > 0 ? `${row.attendees}명` : "-")
            ),
            row.amount > 0 ? formatKRW(row.amount) : "-",
            String(sessions.length > 50 ? sessions.substring(0, 50) + "..." : sessions),
            String(extraMsg.length > 30 ? extraMsg.substring(0, 30) + "..." : extraMsg),
            row.created_at
              ? new Date(row.created_at).toLocaleDateString("ko-KR")
              : "-",
          ];
        });
        tableFoot = [
          [
            "합계",
            "",
            "",
            "",
            "",
            `${pdfTotal}명`,
            pdfAmountText,
            "",
            "",
            `총 ${pdfRows.length}건`,
          ],
        ];
      }

      // 테이블 생성 - jspdf-autotable v5.x는 autoTable을 함수로 직접 호출
      // jspdf-autotable의 타입을 사용하기 위해 any로 선언 (라이브러리 타입 정의가 불완전함)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const tableOptions: any = {
        head: tableHead,
        body: tableData,
        startY: 32,
        styles: { 
          fontSize: 7,
        },
        headStyles: { 
          fillColor: [51, 65, 85], 
          textColor: 255,
        },
        alternateRowStyles: { 
          fillColor: [245, 247, 250],
        },
        margin: { top: 32 },
      };

      // 집회 신청 탭에서는 합계 행을 추가
      if (tableFoot) {
        tableOptions.foot = tableFoot;
        tableOptions.footStyles = {
          fillColor: [30, 41, 59],
          textColor: 255,
          fontStyle: "bold",
          halign: "right",
        };
        tableOptions.columnStyles = {
          6: { halign: "right" },
        };
      }
      
      // 폰트가 로드된 경우에만 폰트 설정 추가
      if (fontLoaded) {
        // 기본 스타일에 폰트 설정
        tableOptions.styles = {
          ...tableOptions.styles,
          font: fontName,
          fontStyle: "normal",
        };
        
        // 헤더 스타일에 폰트 설정
        tableOptions.headStyles = {
          ...tableOptions.headStyles,
          font: fontName,
          fontStyle: "normal",
        };
        
        // 교대 행 스타일에 폰트 설정
        tableOptions.alternateRowStyles = {
          ...tableOptions.alternateRowStyles,
          font: fontName,
          fontStyle: "normal",
        };

        // 푸터 행 스타일에 폰트 설정
        if (tableOptions.footStyles) {
          tableOptions.footStyles = {
            ...tableOptions.footStyles,
            font: fontName,
            fontStyle: "normal",
          };
        }
        
        // 모든 셀에 폰트를 강제로 적용하는 콜백
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        tableOptions.didParseCell = function(data: any) {
          if (data.cell && data.cell.styles) {
            data.cell.styles.font = fontName;
            data.cell.styles.fontStyle = "normal";
          }
        };
        
        // 테이블 그리기 전에 폰트 설정
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        tableOptions.willDrawCell = function(data: any) {
          if (data.cell && data.cell.styles) {
            data.cell.styles.font = fontName;
            data.cell.styles.fontStyle = "normal";
          }
        };
      }
      
      autoTable(doc, tableOptions);

      const fileName =
        activeTab === "applications"
          ? `사역신청목록_${new Date().toISOString().split("T")[0]}.pdf`
          : activeTab === "inquiry"
            ? `문의하기_목록_${new Date().toISOString().split("T")[0]}.pdf`
            : `${activeTab === "metanoia" ? "METANOIA" : "ONENESS"}_신청목록_${new Date().toISOString().split("T")[0]}.pdf`;
      
      // 모바일에서는 파일 저장 방식 조정
      if (isMobileDevice()) {
        // 모바일에서는 blob으로 변환하여 다운로드
        const pdfBlob = doc.output("blob");
        const url = URL.createObjectURL(pdfBlob);
        const link = document.createElement("a");
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      } else {
        doc.save(fileName);
      }

      // DB에 다운로드 기록 저장
      const recordCount =
        activeTab === "applications"
          ? applications.length
          : activeTab === "inquiry"
            ? inquiryRows.length
            : pdfRows.length;
      const totalCount =
        activeTab === "applications" || activeTab === "inquiry" ? 0 : pdfTotal;
      await saveDownloadRecord("pdf", fileName, recordCount, totalCount);
    } catch (error) {
      console.error("PDF 다운로드 오류:", error);
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      
      // 모바일에서는 더 자세한 에러 메시지
      if (isMobileDevice()) {
        alert(`PDF 다운로드 중 오류가 발생했습니다.\n\n오류: ${errorMessage}\n\n모바일에서는 네트워크 연결이 안정적이어야 합니다. Wi-Fi에 연결되어 있는지 확인해주세요.`);
      } else {
        alert(`PDF 다운로드 중 오류가 발생했습니다: ${errorMessage}`);
      }
    }
  }

  // DB에 다운로드 기록 저장
  async function saveDownloadRecord(
    format: "excel" | "pdf",
    fileName: string,
    recordCount: number,
    totalAttendeesCount: number
  ) {
    try {
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();

      const { error } = await supabase.from("download_logs").insert({
        format,
        file_name: fileName,
        record_count: recordCount,
        total_attendees: totalAttendeesCount,
        created_at: new Date().toISOString(),
      });

      if (error) {
        // 테이블이 없거나 권한 문제인 경우 조용히 처리
        // 콘솔 오류를 표시하지 않음 (다운로드는 성공했으므로)
        // 오류가 있어도 다운로드는 성공했으므로 사용자에게 알리지 않음
      }
    } catch (error) {
      // 콘솔 오류를 표시하지 않음 (다운로드는 성공했으므로)
      // 오류가 있어도 다운로드는 성공했으므로 사용자에게 알리지 않음
    }
  }

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
    <main className="mx-auto mt-2 w-full max-w-[90rem] rounded-xl bg-[#0A0A0A] px-4 py-10 text-white transition-colors duration-150 sm:mt-4 sm:py-14">
      <div className="mb-8 border-b border-white/10 pb-8 transition-colors duration-150">
        <p className="font-mono text-sm font-semibold uppercase tracking-[0.32em] text-white/70 sm:text-base md:text-lg md:tracking-[0.38em] lg:text-xl">
          SHIR BAND
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Admin Console
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-white/50 sm:text-lg">
          문의 · 집회 신청 · 사역 지원을 한곳에서 관리합니다.
        </p>
      </div>

      {/* 로그인 폼 */}
      {!authed && (
        <section className="max-w-md rounded-lg border border-white/10 bg-[#141414] p-4 transition-colors duration-150">
          <p className="mb-4 text-base text-white/60 transition-colors duration-150">
            관리자 아이디와 비밀번호를 입력하세요.
          </p>
          <form onSubmit={handleLogin} className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-white/80 transition-colors duration-150">
                아이디
              </label>
              <input
                type="text"
                value={idInput}
                onChange={(e) => setIdInput(e.target.value)}
                className="mt-1 w-full rounded-md border border-white/10 bg-[#1C1C1C] px-3 py-2 text-base text-white outline-none transition-colors duration-150 placeholder:text-white/30 focus:border-white/40"
                autoComplete="username"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/80 transition-colors duration-150">
                비밀번호
              </label>
              <input
                type="password"
                value={pwInput}
                onChange={(e) => setPwInput(e.target.value)}
                className="mt-1 w-full rounded-md border border-white/10 bg-[#1C1C1C] px-3 py-2 text-base text-white outline-none transition-colors duration-150 placeholder:text-white/30 focus:border-white/40"
                autoComplete="current-password"
              />
            </div>
            {loginError && (
              <p className="text-sm text-red-400 transition-colors duration-150">{loginError}</p>
            )}
            <button
              type="submit"
              className="mt-1 inline-flex items-center justify-center rounded-md bg-white px-4 py-2 text-base font-medium text-black transition-colors duration-150 hover:bg-white/90"
            >
              로그인
            </button>
          </form>
        </section>
      )}

      {authed && !loading && !error && (
        <div className="mb-6 transition-colors duration-150">
          {/* 탭 */}
          <div className="mb-6 flex flex-col gap-4 border-b border-white/10 pb-6 transition-colors duration-150 lg:flex-row lg:flex-wrap lg:items-center lg:justify-between lg:gap-5">
            <div className="flex flex-wrap items-center gap-3 sm:gap-4">
              <div className="flex flex-wrap items-center gap-2 rounded-xl border border-white/10 bg-[#141414] px-3 py-2 sm:px-4 sm:py-2.5">
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-white/55 sm:text-sm sm:tracking-[0.22em]">
                  Metanoia Conference
                </span>
                <span className="hidden h-4 w-px bg-white/15 sm:block" aria-hidden />
                <div className="flex flex-wrap gap-1.5">
                  {METANOIA_ARCHIVE.map((entry) => (
                    <button
                      key={entry.year}
                      type="button"
                      onClick={() => setActiveTab(entry.tab)}
                      className={`rounded-md px-3 py-1.5 text-xs font-semibold tabular-nums transition-colors duration-150 sm:text-sm ${
                        activeTab === entry.tab
                          ? "bg-white text-black"
                          : "bg-white/5 text-white/75 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      {entry.year}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2 rounded-xl border border-white/10 bg-[#141414] px-3 py-2 sm:px-4 sm:py-2.5">
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-white/55 sm:text-sm sm:tracking-[0.22em]">
                  ONENESS Worship
                </span>
                <span className="hidden h-4 w-px bg-white/15 sm:block" aria-hidden />
                <div className="flex flex-wrap gap-1.5">
                  {ONENESS_ARCHIVE.map((entry) => (
                    <button
                      key={entry.year}
                      type="button"
                      onClick={() => setActiveTab(entry.tab)}
                      className={`rounded-md px-3 py-1.5 text-xs font-semibold tabular-nums transition-colors duration-150 sm:text-sm ${
                        activeTab === entry.tab
                          ? "bg-white text-black"
                          : "bg-white/5 text-white/75 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      {entry.year}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 lg:ml-auto">
              <button
                type="button"
                onClick={() => setActiveTab("inquiry")}
                className={`rounded-lg border px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.2em] transition-colors duration-150 sm:text-sm ${
                  activeTab === "inquiry"
                    ? "border-white bg-white text-black"
                    : "border-white/15 bg-transparent text-white/70 hover:border-white/30 hover:bg-white/5 hover:text-white"
                }`}
              >
                Inquiry
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("applications")}
                className={`rounded-lg border px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.2em] transition-colors duration-150 sm:text-sm ${
                  activeTab === "applications"
                    ? "border-white bg-white text-black"
                    : "border-white/15 bg-transparent text-white/70 hover:border-white/30 hover:bg-white/5 hover:text-white"
                }`}
              >
                Ministry
              </button>
            </div>
          </div>

          <div className="mb-4 flex flex-wrap gap-4 text-sm sm:text-base transition-colors duration-150">
            {activeTab === "metanoia" && (
              <>
                <div className="rounded-md border border-white/10 bg-[#1C1C1C] px-3 py-2 transition-colors duration-150 sm:px-4">
                  <span className="text-sm text-white/50">총 신청 건수</span>{" "}
                  <span className="ml-2 font-mono font-semibold text-white">{metanoiaRows.length}건</span>
                </div>
                <div className="rounded-md border border-white/10 bg-[#1C1C1C] px-3 py-2 transition-colors duration-150 sm:px-4">
                  <span className="text-sm text-white/50">총 예상 참석 인원</span>{" "}
                  <span className="ml-2 font-mono font-semibold text-white">{totalAttendeesMetanoia}명</span>
                </div>
                <div className="rounded-md border border-white/10 bg-[#1C1C1C] px-3 py-2 transition-colors duration-150 sm:px-4">
                  <span className="text-sm text-white/50">총 금액</span>{" "}
                  <span className="ml-2 font-mono font-semibold text-white">
                    {totalAmountMetanoia > 0 ? formatKRW(totalAmountMetanoia) : "무료"}
                  </span>
                </div>
              </>
            )}
            {activeTab === "oneness" && (
              <>
                <div className="rounded-md border border-white/10 bg-[#1C1C1C] px-3 py-2 transition-colors duration-150 sm:px-4">
                  <span className="text-sm text-white/50">총 신청 건수</span>{" "}
                  <span className="ml-2 font-mono font-semibold text-white">{onenessRows.length}건</span>
                </div>
                <div className="rounded-md border border-white/10 bg-[#1C1C1C] px-3 py-2 transition-colors duration-150 sm:px-4">
                  <span className="text-sm text-white/50">총 예상 참석 인원</span>{" "}
                  <span className="ml-2 font-mono font-semibold text-white">{totalAttendeesOneness}명</span>
                </div>
                <div className="rounded-md border border-white/10 bg-[#1C1C1C] px-3 py-2 transition-colors duration-150 sm:px-4">
                  <span className="text-sm text-white/50">총 금액</span>{" "}
                  <span className="ml-2 font-mono font-semibold text-white">
                    {totalAmountOneness > 0 ? formatKRW(totalAmountOneness) : "무료"}
                  </span>
                </div>
              </>
            )}
            {activeTab === "inquiry" && (
              <div className="rounded-md border border-white/10 bg-[#1C1C1C] px-3 py-2 transition-colors duration-150 sm:px-4">
                <span className="text-sm text-white/50">총 문의 건수</span>{" "}
                <span className="ml-2 font-mono font-semibold text-white">{inquiryRows.length}건</span>
              </div>
            )}
            {activeTab === "applications" && (
              <div className="rounded-md border border-white/10 bg-[#1C1C1C] px-3 py-2 transition-colors duration-150 sm:px-4">
                <span className="text-sm text-white/50">총 사역 신청 건수</span>{" "}
                <span className="ml-2 font-mono font-semibold text-white">{applications.length}건</span>
              </div>
            )}
          </div>
          {((activeTab === "metanoia" && metanoiaRows.length > 0) ||
            (activeTab === "inquiry" && inquiryRows.length > 0) ||
            (activeTab === "oneness" && onenessRows.length > 0) ||
            (activeTab === "inquiry" && inquiryRows.length > 0) ||
            (activeTab === "applications" && applications.length > 0)) && (
            <div className="flex flex-wrap items-center gap-3 transition-colors duration-150">
              <button
                onClick={handleExportExcel}
                className="inline-flex items-center justify-center rounded-md border border-[#4ADE80] bg-transparent px-4 py-2.5 text-sm font-medium text-[#4ADE80] transition-colors duration-150 hover:bg-[#4ADE80]/10 sm:px-5 sm:text-base"
              >
                📊 엑셀 다운로드
              </button>
              <button
                onClick={handleExportPDF}
                className="inline-flex items-center justify-center rounded-md border border-[#EF4444] bg-transparent px-4 py-2.5 text-sm font-medium text-[#EF4444] transition-colors duration-150 hover:bg-[#EF4444]/10 sm:px-5 sm:text-base"
              >
                📄 PDF 다운로드
              </button>
              <button
                onClick={handleDeleteAll}
                disabled={deleting || currentTabIds.length === 0}
                className="inline-flex items-center justify-center rounded-md border border-white/20 bg-transparent px-4 py-2.5 text-sm font-medium text-white transition-colors duration-150 hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-50 sm:px-5 sm:text-base"
              >
                {deleting ? "삭제 중..." : "🗑️ 전체 삭제"}
              </button>
            </div>
          )}
        </div>
      )}

      {authed && loading && (
        <div className="text-sm text-white/60 transition-colors duration-150">불러오는 중입니다...</div>
      )}

      {authed && error && (
        <div className="mb-4 rounded-md border border-red-500/40 bg-red-950/30 px-4 py-3 text-sm text-red-300 transition-colors duration-150">
          {error}
        </div>
      )}

      {authed && !loading && !error &&
        ((activeTab === "metanoia" && metanoiaRows.length === 0) ||
          (activeTab === "oneness" && onenessRows.length === 0) ||
          (activeTab === "inquiry" && inquiryRows.length === 0) ||
          (activeTab === "applications" && applications.length === 0)) && (
        <div className="text-lg text-white/60 transition-colors duration-150">
          {activeTab === "applications" ? "사역 신청 데이터가 없습니다." : activeTab === "inquiry" ? "문의 데이터가 없습니다." : "해당 탭에 데이터가 없습니다."}
        </div>
      )}

      {authed && !loading && !error && (activeTab === "metanoia" || activeTab === "oneness") && currentPaginatedRows.length > 0 && (
        <>
          {/* 모바일: 극단적으로 간단한 카드 리스트 (집회 신청) */}
          <div className="space-y-3 sm:hidden">
            {currentPaginatedRows.map((row) => (
              <div
                key={row.id}
                role="button"
                tabIndex={0}
                onClick={() => setDetailModal({ kind: "conference", row })}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setDetailModal({ kind: "conference", row });
                  }
                }}
                className="cursor-pointer rounded-lg border border-white/10 bg-[#141414] p-4 transition-colors duration-150 hover:border-white/20"
              >
                <div className="flex items-center justify-between text-sm text-white/50 transition-colors duration-150">
                  <span className="font-mono">No. {row.index}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono">
                      {row.created_at
                        ? new Date(row.created_at).toLocaleDateString("ko-KR")
                        : "-"}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete([row.id]);
                      }}
                      disabled={deleting}
                      className="inline-flex shrink-0 items-center justify-center whitespace-nowrap rounded border border-white/15 bg-transparent px-3 py-1.5 text-xs font-medium text-white/70 transition-colors duration-150 hover:border-[#EF4444] hover:text-[#EF4444] disabled:opacity-50"
                    >
                      삭제
                    </button>
                  </div>
                </div>
                <div className="mt-1 text-lg font-semibold text-white transition-colors duration-150">
                  {row.parsed.name || row.name || "-"}
                </div>
                {row.parsed.phone && (
                  <div className="mt-0.5 text-sm font-mono text-white/70 transition-colors duration-150">
                    연락처: {row.parsed.phone}
                  </div>
                )}
                {(row.parsed.expectedText || row.parsed.church || row.parsed.role || row.parsed.sessions || row.amount > 0) && (
                  <div className="mt-1 space-y-0.5 text-sm text-white/60 transition-colors duration-150">
                    {row.parsed.expectedText && (
                      <div className="font-mono">참석: {row.parsed.expectedText}</div>
                    )}
                    {row.amount > 0 && (
                      <div className="font-mono text-white/80">금액: {formatKRW(row.amount)}</div>
                    )}
                    {row.parsed.church && (
                      <div className="font-medium">교회: {row.parsed.church}</div>
                    )}
                    {row.parsed.role && (
                      <div>직분: {row.parsed.role}</div>
                    )}
                    {row.parsed.sessions && (
                      <div className="mt-1 rounded bg-blue-950/40 p-2 text-xs text-blue-300 transition-colors duration-150">
                        세션: {row.parsed.sessions}
                      </div>
                    )}
                  </div>
                )}
                {row.parsed.extraMessage && (
                  <div className="mt-1 whitespace-pre-wrap text-sm text-white/50 transition-colors duration-150">
                    {row.parsed.extraMessage}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* 데스크톱: 전체 정보 테이블 */}
          <div className="hidden sm:block">
            <div className="overflow-x-auto rounded-lg border border-white/10 bg-[#141414] transition-colors duration-150">
              <table className="w-full min-w-[1180px] table-fixed border-collapse text-left text-base transition-colors duration-150">
                <colgroup>
                  <col className="w-14" />
                  <col className="w-[10%]" />
                  <col className="w-[10%]" />
                  <col className="w-[13%]" />
                  <col className="w-[7%]" />
                  <col className="w-[7%]" />
                  <col className="w-[10%]" />
                  <col className="w-[6%]" />
                  <col className="w-[6%]" />
                  <col className="w-[15%]" />
                  <col className="w-[88px]" />
                </colgroup>
                <thead className="bg-[#1C1C1C] transition-colors duration-150">
                  <tr>
                    <th className="px-3 py-3 text-left text-xs font-medium uppercase tracking-[0.15em] text-white/40 sm:px-4 sm:text-sm">
                      No.
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium uppercase tracking-[0.15em] text-white/40 sm:px-4 sm:text-sm">
                      Name
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium uppercase tracking-[0.15em] text-white/40 sm:px-4 sm:text-sm">
                      Phone
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium uppercase tracking-[0.15em] text-white/40 sm:px-4 sm:text-sm">
                      Church
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium uppercase tracking-[0.15em] text-white/40 sm:px-4 sm:text-sm">
                      Role
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium uppercase tracking-[0.15em] text-white/40 sm:px-4 sm:text-sm">
                      Attendees
                    </th>
                    <th className="px-3 py-3 text-right text-xs font-medium uppercase tracking-[0.15em] text-white/40 sm:px-4 sm:text-sm">
                      Amount
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium uppercase tracking-[0.15em] text-white/40 sm:px-4 sm:text-sm">
                      Sessions
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium uppercase tracking-[0.15em] text-white/40 sm:px-4 sm:text-sm">
                      Note
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium uppercase tracking-[0.15em] text-white/40 sm:px-4 sm:text-sm">
                      Received
                    </th>
                    <th className="px-2 py-3 text-left text-xs font-medium uppercase tracking-[0.15em] text-white/40 sm:text-sm">
                      Delete
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 transition-colors duration-150">
                  {currentPaginatedRows.map((row) => (
                    <tr
                      key={row.id}
                      onClick={() => setDetailModal({ kind: "conference", row })}
                      className="h-[3.5rem] cursor-pointer border-b border-white/5 transition-colors duration-150 hover:bg-[#1C1C1C]"
                    >
                      <td className="overflow-hidden px-3 py-2 align-middle font-mono text-sm text-white/70 sm:px-4">
                        {row.index}
                      </td>
                      <td className="overflow-hidden truncate px-3 py-2 align-middle text-sm font-medium text-white/90 sm:px-4 sm:text-base">
                        {row.parsed.name || row.name || "-"}
                      </td>
                      <td className="overflow-hidden truncate px-3 py-2 align-middle font-mono text-sm text-white/70 sm:px-4">
                        {row.parsed.phone || "-"}
                      </td>
                      <td className="overflow-hidden truncate px-3 py-2 align-middle text-sm font-medium text-white/90 sm:px-4">
                        {row.parsed.church || "-"}
                      </td>
                      <td className="overflow-hidden truncate px-3 py-2 align-middle text-sm text-white/90 sm:px-4">
                        {row.parsed.role || "-"}
                      </td>
                      <td className="overflow-hidden truncate px-3 py-2 align-middle font-mono text-sm text-white/70 sm:px-4">
                        {row.parsed.expectedText
                          ? row.parsed.expectedText
                          : row.attendees > 0
                            ? `${row.attendees}명`
                            : "-"}
                      </td>
                      <td className="overflow-hidden truncate px-3 py-2 text-right align-middle font-mono text-sm text-white/85 sm:px-4">
                        {row.amount > 0 ? formatKRW(row.amount) : "—"}
                      </td>
                      <td className="overflow-hidden px-3 py-2 align-middle text-sm text-white/90 sm:px-4">
                        {row.parsed.sessions ? (
                          <span className="text-white/55 underline decoration-white/25 underline-offset-2">내용 보기</span>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td className="overflow-hidden px-3 py-2 align-middle text-sm text-white/90 sm:px-4">
                        {row.parsed.extraMessage ? (
                          <span className="text-white/55 underline decoration-white/25 underline-offset-2">내용 보기</span>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td className="overflow-hidden truncate px-3 py-2 align-middle font-mono text-xs text-white/70 sm:px-4 sm:text-sm">
                        {row.created_at
                          ? new Date(row.created_at).toLocaleString("ko-KR")
                          : "-"}
                      </td>
                      <td className="px-2 py-2 align-middle sm:px-3">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete([row.id]);
                          }}
                          disabled={deleting}
                          className="inline-flex w-full max-w-[4.5rem] shrink-0 items-center justify-center whitespace-nowrap rounded border border-white/15 bg-transparent px-2 py-1.5 text-xs font-medium text-white/70 transition-colors duration-150 hover:border-[#EF4444] hover:text-[#EF4444] disabled:opacity-50"
                        >
                          삭제
                        </button>
                      </td>
                    </tr>
                  ))}
                  <AdminTablePadRows colSpan={11} padCount={PAGE_SIZE - currentPaginatedRows.length} />
                </tbody>
                <tfoot className="bg-[#1C1C1C] transition-colors duration-150">
                  <tr className="border-t border-white/15">
                    <td
                      colSpan={5}
                      className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-[0.18em] text-white/55 sm:px-4 sm:text-sm"
                    >
                      Total
                    </td>
                    <td className="px-3 py-3 text-left align-middle font-mono text-sm font-semibold text-white sm:px-4">
                      {activeTab === "metanoia"
                        ? `${totalAttendeesMetanoia}명`
                        : `${totalAttendeesOneness}명`}
                    </td>
                    <td className="px-3 py-3 text-right align-middle font-mono text-sm font-semibold text-white sm:px-4">
                      {(activeTab === "metanoia" ? totalAmountMetanoia : totalAmountOneness) > 0
                        ? formatKRW(activeTab === "metanoia" ? totalAmountMetanoia : totalAmountOneness)
                        : "무료"}
                    </td>
                    <td colSpan={4} className="px-3 py-3 sm:px-4">
                      <span className="text-xs text-white/40 sm:text-sm">
                        총 {activeTab === "metanoia" ? metanoiaRows.length : onenessRows.length}건
                      </span>
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* 하단 합계 요약 */}
          <div className="mt-4 flex flex-wrap gap-3 text-sm sm:text-base">
            <div className="rounded-md border border-white/10 bg-[#1C1C1C] px-3 py-2 sm:px-4">
              <span className="text-sm text-white/50">총 신청 건수</span>{" "}
              <span className="ml-2 font-mono font-semibold text-white">
                {activeTab === "metanoia" ? metanoiaRows.length : onenessRows.length}건
              </span>
            </div>
            <div className="rounded-md border border-white/10 bg-[#1C1C1C] px-3 py-2 sm:px-4">
              <span className="text-sm text-white/50">총 예상 참석 인원</span>{" "}
              <span className="ml-2 font-mono font-semibold text-white">
                {activeTab === "metanoia" ? totalAttendeesMetanoia : totalAttendeesOneness}명
              </span>
            </div>
            <div className="rounded-md border border-white/10 bg-[#1C1C1C] px-3 py-2 sm:px-4">
              <span className="text-sm text-white/50">총 금액</span>{" "}
              <span className="ml-2 font-mono font-semibold text-white">
                {(activeTab === "metanoia" ? totalAmountMetanoia : totalAmountOneness) > 0
                  ? formatKRW(activeTab === "metanoia" ? totalAmountMetanoia : totalAmountOneness)
                  : "무료"}
              </span>
            </div>
          </div>

          <AdminPagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}

      {authed && !loading && !error && activeTab === "inquiry" && inquiryRows.length > 0 && (
        <>
          <div className="space-y-3 sm:hidden">
            {paginatedInquiry.map((row) => (
              <div
                key={row.id}
                role="button"
                tabIndex={0}
                onClick={() => setDetailModal({ kind: "inquiry", row })}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setDetailModal({ kind: "inquiry", row });
                  }
                }}
                className="cursor-pointer rounded-lg border border-white/10 bg-[#141414] p-4 transition-colors duration-150 hover:border-white/20"
              >
                <div className="flex items-center justify-between text-sm text-white/50 transition-colors duration-150">
                  <span className="font-mono">No. {row.index}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono">
                      {row.created_at
                        ? new Date(row.created_at).toLocaleDateString("ko-KR")
                        : "-"}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete([row.id]);
                      }}
                      disabled={deleting}
                      className="inline-flex shrink-0 items-center justify-center whitespace-nowrap rounded border border-white/15 bg-transparent px-3 py-1.5 text-xs font-medium text-white/70 transition-colors duration-150 hover:border-[#EF4444] hover:text-[#EF4444] disabled:opacity-50"
                    >
                      삭제
                    </button>
                  </div>
                </div>
                <div className="mt-1 text-lg font-semibold text-white transition-colors duration-150">{row.name || "-"}</div>
                {row.message && (
                  <div className="mt-2 whitespace-pre-wrap border-t border-white/10 pt-2 text-sm text-white/60 transition-colors duration-150">
                    {row.message}
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="hidden sm:block">
            <div className="overflow-x-auto rounded-lg border border-white/10 bg-[#141414] transition-colors duration-150">
              <table className="w-full min-w-[720px] table-fixed border-collapse text-left text-base transition-colors duration-150">
                <colgroup>
                  <col className="w-14" />
                  <col className="w-[18%]" />
                  <col className="w-[46%]" />
                  <col className="w-[26%]" />
                  <col className="w-[88px]" />
                </colgroup>
                <thead className="bg-[#1C1C1C] transition-colors duration-150">
                  <tr>
                    <th className="px-3 py-3 text-left text-xs font-medium uppercase tracking-[0.15em] text-white/40 sm:px-4 sm:text-sm">
                      No.
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium uppercase tracking-[0.15em] text-white/40 sm:px-4 sm:text-sm">
                      Name
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium uppercase tracking-[0.15em] text-white/40 sm:px-4 sm:text-sm">
                      Message
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium uppercase tracking-[0.15em] text-white/40 sm:px-4 sm:text-sm">
                      Received
                    </th>
                    <th className="px-2 py-3 text-left text-xs font-medium uppercase tracking-[0.15em] text-white/40 sm:text-sm">
                      Delete
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 transition-colors duration-150">
                  {paginatedInquiry.map((row) => (
                    <tr
                      key={row.id}
                      onClick={() => setDetailModal({ kind: "inquiry", row })}
                      className="h-[3.5rem] cursor-pointer border-b border-white/5 transition-colors duration-150 hover:bg-[#1C1C1C]"
                    >
                      <td className="overflow-hidden px-3 py-2 align-middle font-mono text-sm text-white/70 sm:px-4">{row.index}</td>
                      <td className="overflow-hidden truncate px-3 py-2 align-middle text-sm font-medium text-white/90 sm:px-4 sm:text-base">{row.name || "-"}</td>
                      <td className="overflow-hidden px-3 py-2 align-middle text-sm text-white/90 sm:px-4">
                        {row.message ? (
                          <span className="text-white/55 underline decoration-white/25 underline-offset-2">내용 보기</span>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td className="overflow-hidden truncate px-3 py-2 align-middle font-mono text-xs text-white/70 sm:px-4 sm:text-sm">
                        {row.created_at
                          ? new Date(row.created_at).toLocaleString("ko-KR")
                          : "-"}
                      </td>
                      <td className="px-2 py-2 align-middle sm:px-3">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete([row.id]);
                          }}
                          disabled={deleting}
                          className="inline-flex w-full max-w-[4.5rem] shrink-0 items-center justify-center whitespace-nowrap rounded border border-white/15 bg-transparent px-2 py-1.5 text-xs font-medium text-white/70 transition-colors duration-150 hover:border-[#EF4444] hover:text-[#EF4444] disabled:opacity-50"
                        >
                          삭제
                        </button>
                      </td>
                    </tr>
                  ))}
                  <AdminTablePadRows colSpan={5} padCount={PAGE_SIZE - paginatedInquiry.length} />
                </tbody>
              </table>
            </div>
          </div>
          <AdminPagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}

      {authed && !loading && !error && activeTab === "applications" && applications.length > 0 && (
        <>
          {/* 모바일: 사역 신청 카드 리스트 */}
          <div className="space-y-3 sm:hidden">
            {paginatedApplications.map((row, idx) => (
              <div
                key={row.id}
                role="button"
                tabIndex={0}
                onClick={() =>
                  setDetailModal({
                    kind: "application",
                    row,
                    displayIndex: (page - 1) * PAGE_SIZE + idx + 1,
                  })
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setDetailModal({
                      kind: "application",
                      row,
                      displayIndex: (page - 1) * PAGE_SIZE + idx + 1,
                    });
                  }
                }}
                className="cursor-pointer rounded-lg border border-white/10 bg-[#141414] p-4 transition-colors duration-150 hover:border-white/20"
              >
                <div className="flex items-center justify-between text-sm text-white/50 transition-colors duration-150">
                  <span className="font-mono">No. {(page - 1) * PAGE_SIZE + idx + 1}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono">
                      {row.created_at
                        ? new Date(row.created_at).toLocaleDateString("ko-KR")
                        : "-"}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete([row.id]);
                      }}
                      disabled={deleting}
                      className="inline-flex shrink-0 items-center justify-center whitespace-nowrap rounded border border-white/15 bg-transparent px-3 py-1.5 text-xs font-medium text-white/70 transition-colors duration-150 hover:border-[#EF4444] hover:text-[#EF4444] disabled:opacity-50"
                    >
                      삭제
                    </button>
                  </div>
                </div>
                <div className="mt-1 text-lg font-semibold text-white transition-colors duration-150">{row.name || "-"}</div>
                {row.phone && (
                  <div className="mt-0.5 text-sm font-mono text-white/70 transition-colors duration-150">연락처: {row.phone}</div>
                )}
                {row.church && (
                  <div className="mt-0.5 text-sm font-medium text-white/90 transition-colors duration-150">소속교회: {row.church}</div>
                )}
                {row.reason && (
                  <div className="mt-2 whitespace-pre-wrap border-t border-white/10 pt-2 text-sm text-white/60 transition-colors duration-150">
                    {row.reason}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* 데스크톱: 사역 신청 테이블 */}
          <div className="hidden sm:block">
            <div className="overflow-x-auto rounded-lg border border-white/10 bg-[#141414] transition-colors duration-150">
              <table className="w-full min-w-[900px] table-fixed border-collapse text-left text-base transition-colors duration-150">
                <colgroup>
                  <col className="w-14" />
                  <col className="w-[14%]" />
                  <col className="w-[12%]" />
                  <col className="w-[16%]" />
                  <col className="w-[30%]" />
                  <col className="w-[20%]" />
                  <col className="w-[88px]" />
                </colgroup>
                <thead className="bg-[#1C1C1C] transition-colors duration-150">
                  <tr>
                    <th className="px-3 py-3 text-left text-xs font-medium uppercase tracking-[0.15em] text-white/40 sm:px-4 sm:text-sm">
                      No.
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium uppercase tracking-[0.15em] text-white/40 sm:px-4 sm:text-sm">
                      Name
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium uppercase tracking-[0.15em] text-white/40 sm:px-4 sm:text-sm">
                      Phone
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium uppercase tracking-[0.15em] text-white/40 sm:px-4 sm:text-sm">
                      Church
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium uppercase tracking-[0.15em] text-white/40 sm:px-4 sm:text-sm">
                      Request
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium uppercase tracking-[0.15em] text-white/40 sm:px-4 sm:text-sm">
                      Received
                    </th>
                    <th className="px-2 py-3 text-left text-xs font-medium uppercase tracking-[0.15em] text-white/40 sm:text-sm">
                      Delete
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 transition-colors duration-150">
                  {paginatedApplications.map((row, idx) => (
                    <tr
                      key={row.id}
                      onClick={() =>
                        setDetailModal({
                          kind: "application",
                          row,
                          displayIndex: (page - 1) * PAGE_SIZE + idx + 1,
                        })
                      }
                      className="h-[3.5rem] cursor-pointer border-b border-white/5 transition-colors duration-150 hover:bg-[#1C1C1C]"
                    >
                      <td className="overflow-hidden px-3 py-2 align-middle font-mono text-sm text-white/70 sm:px-4">{(page - 1) * PAGE_SIZE + idx + 1}</td>
                      <td className="overflow-hidden truncate px-3 py-2 align-middle text-sm font-medium text-white/90 sm:px-4 sm:text-base">{row.name || "-"}</td>
                      <td className="overflow-hidden truncate px-3 py-2 align-middle font-mono text-sm text-white/70 sm:px-4">
                        {row.phone || "-"}
                      </td>
                      <td className="overflow-hidden truncate px-3 py-2 align-middle text-sm font-medium text-white/90 sm:px-4">
                        {row.church || "-"}
                      </td>
                      <td className="overflow-hidden px-3 py-2 align-middle text-sm text-white/90 sm:px-4">
                        {row.reason ? (
                          <span className="text-white/55 underline decoration-white/25 underline-offset-2">내용 보기</span>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td className="overflow-hidden truncate px-3 py-2 align-middle font-mono text-xs text-white/70 sm:px-4 sm:text-sm">
                        {row.created_at
                          ? new Date(row.created_at).toLocaleString("ko-KR")
                          : "-"}
                      </td>
                      <td className="px-2 py-2 align-middle sm:px-3">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete([row.id]);
                          }}
                          disabled={deleting}
                          className="inline-flex w-full max-w-[4.5rem] shrink-0 items-center justify-center whitespace-nowrap rounded border border-white/15 bg-transparent px-2 py-1.5 text-xs font-medium text-white/70 transition-colors duration-150 hover:border-[#EF4444] hover:text-[#EF4444] disabled:opacity-50"
                        >
                          삭제
                        </button>
                      </td>
                    </tr>
                  ))}
                  <AdminTablePadRows colSpan={7} padCount={PAGE_SIZE - paginatedApplications.length} />
                </tbody>
              </table>
            </div>
          </div>
          <AdminPagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}

      {detailModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="admin-detail-title"
          onClick={() => setDetailModal(null)}
        >
          <div
            className="max-h-[88vh] w-full max-w-lg overflow-y-auto rounded-xl border border-white/10 bg-[#141414] shadow-2xl sm:max-w-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 z-[1] flex items-start justify-between gap-4 border-b border-white/10 bg-[#141414] px-5 py-4">
              <h2 id="admin-detail-title" className="text-xl font-semibold tracking-tight text-white sm:text-2xl">
                {detailModal.kind === "conference" && "Registration"}
                {detailModal.kind === "inquiry" && "Inquiry"}
                {detailModal.kind === "application" && "Ministry application"}
              </h2>
              <button
                type="button"
                onClick={() => setDetailModal(null)}
                className="shrink-0 rounded border border-white/15 px-3 py-1.5 text-sm font-medium uppercase tracking-wider text-white/70 transition-colors hover:border-white/35 hover:text-white"
              >
                Close
              </button>
            </div>
            <div className="space-y-5 px-5 py-6 text-base text-white/90 sm:space-y-6 sm:px-6 sm:py-7 sm:text-lg">
              {detailModal.kind === "conference" && (
                <>
                  <DetailBlock label="No.">{detailModal.row.index}</DetailBlock>
                  <DetailBlock label="Name">{detailModal.row.parsed.name || detailModal.row.name || "—"}</DetailBlock>
                  <DetailBlock label="Phone">{detailModal.row.parsed.phone || "—"}</DetailBlock>
                  <DetailBlock label="Church">{detailModal.row.parsed.church || "—"}</DetailBlock>
                  <DetailBlock label="Role">{detailModal.row.parsed.role || "—"}</DetailBlock>
                  <DetailBlock label="Expected attendees">
                    {detailModal.row.parsed.expectedText
                      ? detailModal.row.parsed.expectedText
                      : detailModal.row.attendees > 0
                        ? `${detailModal.row.attendees}명`
                        : "—"}
                  </DetailBlock>
                  <DetailBlock label="Amount">
                    {detailModal.row.amount > 0 ? formatKRW(detailModal.row.amount) : "—"}
                    {detailModal.row.parsed.unitPrice !== undefined && (
                      <span className="ml-2 font-mono text-sm text-white/55">
                        (단가 {formatKRW(detailModal.row.parsed.unitPrice)})
                      </span>
                    )}
                  </DetailBlock>
                  <DetailBlock label="Sessions">{detailModal.row.parsed.sessions || "—"}</DetailBlock>
                  <DetailBlock label="Additional message">{detailModal.row.parsed.extraMessage || "—"}</DetailBlock>
                  <DetailBlock label="Received">
                    {detailModal.row.created_at
                      ? new Date(detailModal.row.created_at).toLocaleString("ko-KR")
                      : "—"}
                  </DetailBlock>
                  {detailModal.row.message && (
                    <DetailBlock label="Raw message">
                      <span className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-white/80 sm:text-base">
                        {detailModal.row.message}
                      </span>
                    </DetailBlock>
                  )}
                </>
              )}
              {detailModal.kind === "inquiry" && (
                <>
                  <DetailBlock label="No.">{detailModal.row.index}</DetailBlock>
                  <DetailBlock label="Name">{detailModal.row.name || "—"}</DetailBlock>
                  <DetailBlock label="Message">
                    <span className="whitespace-pre-wrap">{detailModal.row.message || "—"}</span>
                  </DetailBlock>
                  <DetailBlock label="Received">
                    {detailModal.row.created_at
                      ? new Date(detailModal.row.created_at).toLocaleString("ko-KR")
                      : "—"}
                  </DetailBlock>
                </>
              )}
              {detailModal.kind === "application" && (
                <>
                  <DetailBlock label="No.">{detailModal.displayIndex}</DetailBlock>
                  <DetailBlock label="Name">{detailModal.row.name || "—"}</DetailBlock>
                  <DetailBlock label="Phone">{detailModal.row.phone || "—"}</DetailBlock>
                  <DetailBlock label="Email">{detailModal.row.email || "—"}</DetailBlock>
                  <DetailBlock label="Church">{detailModal.row.church || "—"}</DetailBlock>
                  <DetailBlock label="Request">
                    <span className="whitespace-pre-wrap">{detailModal.row.reason || "—"}</span>
                  </DetailBlock>
                  <DetailBlock label="Received">
                    {detailModal.row.created_at
                      ? new Date(detailModal.row.created_at).toLocaleString("ko-KR")
                      : "—"}
                  </DetailBlock>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}


