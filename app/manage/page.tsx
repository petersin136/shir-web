"use client";

import { useEffect, useMemo, useState } from "react";
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

  const PAGE_SIZE = 20;
  const refreshData = () => setRefreshTrigger((t) => t + 1);

  useEffect(() => {
    setPage(1);
  }, [activeTab]);

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

  const metanoiaRows = useMemo(() => {
    const filtered = data.filter((r) => isMetanoiaMessage(r.message));
    return filtered.map((row, idx) => {
      const parsed = parseContactMessage(row.message);
      return {
        ...row,
        index: idx + 1,
        parsed,
        attendees: parsed.expectedCount ?? 0,
      };
    });
  }, [data]);

  const onenessRows = useMemo(() => {
    const filtered = data.filter((r) => isOnenessMessage(r.message));
    return filtered.map((row, idx) => {
      const parsed = parseContactMessage(row.message);
      return {
        ...row,
        index: idx + 1,
        parsed,
        attendees: parsed.expectedCount ?? 0,
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
        const worksheetData = rows.map((row) => ({
          No: row.index,
          이름: row.parsed.name || row.name || "-",
          연락처: row.parsed.phone || "-",
          소속교회: row.parsed.church || "-",
          직책역할: row.parsed.role || "-",
          참석예상인원: row.parsed.expectedText || (row.attendees > 0 ? `${row.attendees}명` : "-"),
          참석세션: row.parsed.sessions || "-",
          추가메시지: row.parsed.extraMessage || "-",
          받은시간: row.created_at ? new Date(row.created_at).toLocaleString("ko-KR") : "-",
        }));
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
        doc.text(`총 ${pdfRows.length}건, 총 예상 참석 인원: ${pdfTotal}명`, 14, 27);
      }

      // 테이블 데이터 준비
      let tableData: string[][];
      let tableHead: string[][];

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
          ["No.", "이름", "연락처", "소속교회", "직책/역할", "참석 예상 인원", "참석 세션", "추가 메시지", "받은 시간"],
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
            String(sessions.length > 50 ? sessions.substring(0, 50) + "..." : sessions),
            String(extraMsg.length > 30 ? extraMsg.substring(0, 30) + "..." : extraMsg),
            row.created_at
              ? new Date(row.created_at).toLocaleDateString("ko-KR")
              : "-",
          ];
        });
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
    <main className="mx-auto w-full max-w-[90rem] px-4 py-12 sm:py-16 mt-8 sm:mt-12 bg-slate-50 text-slate-900 rounded-xl shadow-lg">
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
        <div className="mb-6">
          {/* 탭 */}
          <div className="flex flex-wrap gap-2 mb-6 border-b border-slate-200">
            <button
              type="button"
              onClick={() => setActiveTab("metanoia")}
              className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors whitespace-nowrap ${
                activeTab === "metanoia"
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              METANOIA 2026
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("oneness")}
              className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors whitespace-nowrap ${
                activeTab === "oneness"
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              ONENESS Worship 2026
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("inquiry")}
              className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors whitespace-nowrap ${
                activeTab === "inquiry"
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              문의하기
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("applications")}
              className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors whitespace-nowrap ${
                activeTab === "applications"
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              사역 신청
            </button>
          </div>

          <div className="mb-4 flex flex-wrap gap-4 text-sm">
            {activeTab === "metanoia" && (
              <>
                <div className="rounded-md bg-slate-100 px-4 py-2">
                  <span className="font-semibold">총 신청 건수</span>{" "}
                  <span className="ml-2 text-slate-700">{metanoiaRows.length}건</span>
                </div>
                <div className="rounded-md bg-slate-100 px-4 py-2">
                  <span className="font-semibold">총 예상 참석 인원</span>{" "}
                  <span className="ml-2 text-slate-700">{totalAttendeesMetanoia}명</span>
                </div>
              </>
            )}
            {activeTab === "oneness" && (
              <>
                <div className="rounded-md bg-slate-100 px-4 py-2">
                  <span className="font-semibold">총 신청 건수</span>{" "}
                  <span className="ml-2 text-slate-700">{onenessRows.length}건</span>
                </div>
                <div className="rounded-md bg-slate-100 px-4 py-2">
                  <span className="font-semibold">총 예상 참석 인원</span>{" "}
                  <span className="ml-2 text-slate-700">{totalAttendeesOneness}명</span>
                </div>
              </>
            )}
            {activeTab === "inquiry" && (
              <div className="rounded-md bg-slate-100 px-4 py-2">
                <span className="font-semibold">총 문의 건수</span>{" "}
                <span className="ml-2 text-slate-700">{inquiryRows.length}건</span>
              </div>
            )}
            {activeTab === "applications" && (
              <div className="rounded-md bg-slate-100 px-4 py-2">
                <span className="font-semibold">총 사역 신청 건수</span>{" "}
                <span className="ml-2 text-slate-700">{applications.length}건</span>
              </div>
            )}
          </div>
          {((activeTab === "metanoia" && metanoiaRows.length > 0) ||
            (activeTab === "inquiry" && inquiryRows.length > 0) ||
            (activeTab === "oneness" && onenessRows.length > 0) ||
            (activeTab === "inquiry" && inquiryRows.length > 0) ||
            (activeTab === "applications" && applications.length > 0)) && (
            <div className="flex flex-wrap gap-3 items-center">
              <button
                onClick={handleExportExcel}
                className="inline-flex items-center justify-center rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 transition-colors"
              >
                📊 엑셀 다운로드
              </button>
              <button
                onClick={handleExportPDF}
                className="inline-flex items-center justify-center rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 transition-colors"
              >
                📄 PDF 다운로드
              </button>
              <button
                onClick={handleDeleteAll}
                disabled={deleting || currentTabIds.length === 0}
                className="inline-flex items-center justify-center rounded-md bg-slate-700 px-4 py-2 text-sm font-medium text-white hover:bg-slate-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {deleting ? "삭제 중..." : "🗑️ 전체 삭제"}
              </button>
            </div>
          )}
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

      {authed && !loading && !error &&
        ((activeTab === "metanoia" && metanoiaRows.length === 0) ||
          (activeTab === "oneness" && onenessRows.length === 0) ||
          (activeTab === "inquiry" && inquiryRows.length === 0) ||
          (activeTab === "applications" && applications.length === 0)) && (
        <div className="text-lg text-slate-600">
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
                className="rounded-lg border border-slate-200 bg-white px-4 py-4 shadow-sm"
              >
                <div className="flex items-center justify-between text-sm text-slate-500">
                  <span>No. {row.index}</span>
                  <div className="flex items-center gap-2">
                    <span>
                      {row.created_at
                        ? new Date(row.created_at).toLocaleDateString("ko-KR")
                        : "-"}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleDelete([row.id])}
                      disabled={deleting}
                      className="text-red-600 hover:text-red-700 text-xs font-medium disabled:opacity-50"
                    >
                      삭제
                    </button>
                  </div>
                </div>
                <div className="mt-1 text-lg font-semibold">
                  {row.parsed.name || row.name || "-"}
                </div>
                {row.parsed.phone && (
                  <div className="mt-0.5 text-sm text-slate-600">
                    연락처: {row.parsed.phone}
                  </div>
                )}
                {(row.parsed.expectedText || row.parsed.church || row.parsed.role || row.parsed.sessions) && (
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
                    {row.parsed.sessions && (
                      <div className="text-xs bg-blue-50 text-blue-700 p-2 rounded mt-1">
                        세션: {row.parsed.sessions}
                      </div>
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
                    <th className="px-4 py-3 font-semibold text-sm w-12">No.</th>
                    <th className="px-4 py-3 font-semibold text-sm whitespace-nowrap min-w-[4rem]">이름</th>
                    <th className="px-4 py-3 font-semibold text-sm whitespace-nowrap">연락처</th>
                    <th className="px-4 py-3 font-semibold text-sm min-w-[120px]">소속교회</th>
                    <th className="px-4 py-3 font-semibold text-sm whitespace-nowrap">직책/역할</th>
                    <th className="px-4 py-3 font-semibold text-sm whitespace-nowrap w-24">참석 예상 인원</th>
                    <th className="px-4 py-3 font-semibold text-sm min-w-[220px]">참석 세션</th>
                    <th className="px-4 py-3 font-semibold text-sm max-w-[120px]">추가 메시지</th>
                    <th className="px-4 py-3 font-semibold text-sm whitespace-nowrap">받은 시간</th>
                    <th className="px-4 py-3 font-semibold text-sm w-16">삭제</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {currentPaginatedRows.map((row) => (
                    <tr key={row.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 align-top text-sm text-slate-500">
                        {row.index}
                      </td>
                      <td className="px-4 py-3 align-top text-base font-medium whitespace-nowrap">
                        {row.parsed.name || row.name || "-"}
                      </td>
                      <td className="px-4 py-3 align-top text-sm text-slate-600 whitespace-nowrap">
                        {row.parsed.phone || "-"}
                      </td>
                      <td className="px-4 py-3 align-top text-sm text-slate-600 min-w-[120px]">
                        <span className="break-words">{row.parsed.church || "-"}</span>
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
                      <td className="px-4 py-3 align-top text-sm text-slate-600 whitespace-nowrap">
                        {row.parsed.sessions || "-"}
                      </td>
                      <td className="px-4 py-3 align-top text-sm text-slate-600 max-w-[120px]">
                        <div className="break-words" title={row.parsed.extraMessage || ""}>
                          {row.parsed.extraMessage || "-"}
                        </div>
                      </td>
                      <td className="px-4 py-3 align-top text-sm text-slate-500 whitespace-nowrap">
                        {row.created_at
                          ? new Date(row.created_at).toLocaleString("ko-KR")
                          : "-"}
                      </td>
                      <td className="px-4 py-3 align-top">
                        <button
                          type="button"
                          onClick={() => handleDelete([row.id])}
                          disabled={deleting}
                          className="text-red-600 hover:text-red-700 text-sm font-medium disabled:opacity-50"
                        >
                          삭제
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-4">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="px-3 py-1 rounded bg-slate-200 text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-300"
              >
                이전
              </button>
              <span className="text-sm text-slate-600">
                {page} / {totalPages}
              </span>
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="px-3 py-1 rounded bg-slate-200 text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-300"
              >
                다음
              </button>
            </div>
          )}
        </>
      )}

      {authed && !loading && !error && activeTab === "inquiry" && inquiryRows.length > 0 && (
        <>
          <div className="space-y-3 sm:hidden">
            {paginatedInquiry.map((row) => (
              <div
                key={row.id}
                className="rounded-lg border border-slate-200 bg-white px-4 py-4 shadow-sm"
              >
                <div className="flex items-center justify-between text-sm text-slate-500">
                  <span>No. {row.index}</span>
                  <div className="flex items-center gap-2">
                    <span>
                      {row.created_at
                        ? new Date(row.created_at).toLocaleDateString("ko-KR")
                        : "-"}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleDelete([row.id])}
                      disabled={deleting}
                      className="text-red-600 hover:text-red-700 text-xs font-medium disabled:opacity-50"
                    >
                      삭제
                    </button>
                  </div>
                </div>
                <div className="mt-1 text-lg font-semibold">{row.name || "-"}</div>
                {row.message && (
                  <div className="mt-2 text-sm text-slate-600 whitespace-pre-wrap border-t border-slate-100 pt-2">
                    {row.message}
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="hidden sm:block">
            <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
              <table className="min-w-full text-left text-base">
                <thead className="bg-slate-100">
                  <tr>
                    <th className="px-4 py-3 font-semibold text-sm w-12">No.</th>
                    <th className="px-4 py-3 font-semibold text-sm whitespace-nowrap">이름</th>
                    <th className="px-4 py-3 font-semibold text-sm min-w-[200px]">메시지</th>
                    <th className="px-4 py-3 font-semibold text-sm whitespace-nowrap">받은 시간</th>
                    <th className="px-4 py-3 font-semibold text-sm w-16">삭제</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paginatedInquiry.map((row) => (
                    <tr key={row.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 align-top text-sm text-slate-500">{row.index}</td>
                      <td className="px-4 py-3 align-top text-base font-medium whitespace-nowrap">{row.name || "-"}</td>
                      <td className="px-4 py-3 align-top text-sm text-slate-600">
                        <div className="whitespace-pre-wrap break-words line-clamp-3 max-w-md">
                          {row.message || "-"}
                        </div>
                      </td>
                      <td className="px-4 py-3 align-top text-sm text-slate-500 whitespace-nowrap">
                        {row.created_at
                          ? new Date(row.created_at).toLocaleString("ko-KR")
                          : "-"}
                      </td>
                      <td className="px-4 py-3 align-top">
                        <button
                          type="button"
                          onClick={() => handleDelete([row.id])}
                          disabled={deleting}
                          className="text-red-600 hover:text-red-700 text-sm font-medium disabled:opacity-50"
                        >
                          삭제
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-4">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="px-3 py-1 rounded bg-slate-200 text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-300"
              >
                이전
              </button>
              <span className="text-sm text-slate-600">
                {page} / {totalPages}
              </span>
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="px-3 py-1 rounded bg-slate-200 text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-300"
              >
                다음
              </button>
            </div>
          )}
        </>
      )}

      {authed && !loading && !error && activeTab === "applications" && applications.length > 0 && (
        <>
          {/* 모바일: 사역 신청 카드 리스트 */}
          <div className="space-y-3 sm:hidden">
            {paginatedApplications.map((row, idx) => (
              <div
                key={row.id}
                className="rounded-lg border border-slate-200 bg-white px-4 py-4 shadow-sm"
              >
                <div className="flex items-center justify-between text-sm text-slate-500">
                  <span>No. {(page - 1) * PAGE_SIZE + idx + 1}</span>
                  <div className="flex items-center gap-2">
                    <span>
                      {row.created_at
                        ? new Date(row.created_at).toLocaleDateString("ko-KR")
                        : "-"}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleDelete([row.id])}
                      disabled={deleting}
                      className="text-red-600 hover:text-red-700 text-xs font-medium disabled:opacity-50"
                    >
                      삭제
                    </button>
                  </div>
                </div>
                <div className="mt-1 text-lg font-semibold">{row.name || "-"}</div>
                {row.phone && (
                  <div className="mt-0.5 text-sm text-slate-600">연락처: {row.phone}</div>
                )}
                {row.church && (
                  <div className="mt-0.5 text-sm text-slate-600">소속교회: {row.church}</div>
                )}
                {row.reason && (
                  <div className="mt-2 text-sm text-slate-600 whitespace-pre-wrap border-t border-slate-100 pt-2">
                    {row.reason}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* 데스크톱: 사역 신청 테이블 */}
          <div className="hidden sm:block">
            <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
              <table className="min-w-full text-left text-base">
                <thead className="bg-slate-100">
                  <tr>
                    <th className="px-4 py-3 font-semibold text-sm w-12">No.</th>
                    <th className="px-4 py-3 font-semibold text-sm whitespace-nowrap">이름</th>
                    <th className="px-4 py-3 font-semibold text-sm whitespace-nowrap">연락처</th>
                    <th className="px-4 py-3 font-semibold text-sm min-w-[100px]">소속교회</th>
                    <th className="px-4 py-3 font-semibold text-sm min-w-[180px]">사역 초청 내용</th>
                    <th className="px-4 py-3 font-semibold text-sm whitespace-nowrap">받은 시간</th>
                    <th className="px-4 py-3 font-semibold text-sm w-16">삭제</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paginatedApplications.map((row, idx) => (
                    <tr key={row.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 align-top text-sm text-slate-500">{(page - 1) * PAGE_SIZE + idx + 1}</td>
                      <td className="px-4 py-3 align-top text-base font-medium whitespace-nowrap">{row.name || "-"}</td>
                      <td className="px-4 py-3 align-top text-sm text-slate-600 whitespace-nowrap">
                        {row.phone || "-"}
                      </td>
                      <td className="px-4 py-3 align-top text-sm text-slate-600 min-w-[100px]">
                        <span className="break-words">{row.church || "-"}</span>
                      </td>
                      <td className="px-4 py-3 align-top text-sm text-slate-600 max-w-xs">
                        <div className="whitespace-pre-wrap break-words">{row.reason || "-"}</div>
                      </td>
                      <td className="px-4 py-3 align-top text-sm text-slate-500 whitespace-nowrap">
                        {row.created_at
                          ? new Date(row.created_at).toLocaleString("ko-KR")
                          : "-"}
                      </td>
                      <td className="px-4 py-3 align-top">
                        <button
                          type="button"
                          onClick={() => handleDelete([row.id])}
                          disabled={deleting}
                          className="text-red-600 hover:text-red-700 text-sm font-medium disabled:opacity-50"
                        >
                          삭제
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-4">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="px-3 py-1 rounded bg-slate-200 text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-300"
              >
                이전
              </button>
              <span className="text-sm text-slate-600">
                {page} / {totalPages}
              </span>
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="px-3 py-1 rounded bg-slate-200 text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-300"
              >
                다음
              </button>
            </div>
          )}
        </>
      )}
    </main>
  );
}


