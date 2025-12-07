// app/metanoia-2026/page.tsx
"use client";

import { useState, useEffect } from "react";
import { BackgroundVideo } from "@/components/BackgroundVideo";

export default function MetanoiaPage() {
  const [loading, setLoading] = useState(false);
  const [ok, setOk] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [privacyAgreed, setPrivacyAgreed] = useState(false);
  const [sessionType, setSessionType] = useState<"" | "all" | "evening">("");
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const images = [
    "https://ewaqnqzivdceurhjxgpf.supabase.co/storage/v1/object/public/media/KakaoTalk_Photo_2025-12-07-12-17-55.jpg",
    "https://ewaqnqzivdceurhjxgpf.supabase.co/storage/v1/object/public/media/KakaoTalk_Photo_2025-12-07-12-18-39.jpg",
    "https://ewaqnqzivdceurhjxgpf.supabase.co/storage/v1/object/public/media/KakaoTalk_Photo_2025-12-07-12-18-45.jpg",
  ];

  // 최소 스와이프 거리 (픽셀)
  const minSwipeDistance = 50;

  // 브라우저 뒤로가기 처리
  useEffect(() => {
    const handlePopState = () => {
      setSelectedImageIndex(null);
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  // 이미지 열기
  const openImage = (index: number) => {
    setSelectedImageIndex(index);
    window.history.pushState({ modal: true }, '', '#image');
  };

  // 이미지 닫기
  const closeImage = () => {
    setSelectedImageIndex(null);
    // URL에 해시가 있으면 제거 (뒤로가기 하지 않음)
    if (window.location.hash === '#image') {
      window.history.replaceState(null, '', window.location.pathname);
    }
  };

  // 이전 이미지
  const previousImage = () => {
    if (selectedImageIndex !== null && selectedImageIndex > 0) {
      setSelectedImageIndex(selectedImageIndex - 1);
    }
  };

  // 다음 이미지
  const nextImage = () => {
    if (selectedImageIndex !== null && selectedImageIndex < images.length - 1) {
      setSelectedImageIndex(selectedImageIndex + 1);
    }
  };

  // 터치 시작
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  // 터치 이동
  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  // 터치 종료
  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      nextImage();
    }
    if (isRightSwipe) {
      previousImage();
    }
  };

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
    
    // 세션 타입 확인
    if (!sessionType) {
      setErr("참석 세션을 선택해주세요.");
      setLoading(false);
      return;
    }

    const sessionText = sessionType === "all" 
      ? "신청 1: 모든 시간 참석" 
      : "신청 2: 저녁 시간 참석 (METANOIA part 1, 2, 3)";

    const payload = {
      name: String(formData.get("name") || "").trim(),
      email: String(formData.get("email") || "").trim(),
      phone: String(formData.get("phone") || "").trim(),
      church: String(formData.get("church") || "").trim(),
      position: String(formData.get("position") || "").trim(),
      participants: String(formData.get("participants") || "").trim(),
      message: String(formData.get("message") || "").trim(),
      sessions: sessionText,
    };

    if (!payload.name || !payload.email || !payload.phone || !payload.church || !payload.participants) {
      setErr("이름, 이메일, 연락처, 소속교회, 참석 예상 인원은 필수 입력사항입니다.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...payload,
          subject: "Metanoia 2026 집회 신청",
          message: `
집회 신청 정보:
- 이름: ${payload.name}
- 이메일: ${payload.email}
- 연락처: ${payload.phone}
- 소속교회: ${payload.church}
- 직책/역할: ${payload.position}
- 참석 예상 인원: ${payload.participants}명
- 참석 세션: ${payload.sessions}
- 추가 메시지: ${payload.message}
          `.trim()
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "서버 오류");
      setOk("Metanoia 2026 집회 신청이 완료되었습니다. 감사합니다!");
      form.reset();
      setPrivacyAgreed(false);
      setSessionType("");
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
        {/* 성경구절 섹션 - 최상단 */}
        <div className="mb-10">
          <p className="text-base sm:text-lg md:text-xl leading-loose text-white font-light mb-4" style={{lineHeight: '1.8'}}>
            &ldquo;내가 복음을 부끄러워하지 아니하노니 이 복음은 모든 믿는자에게 구원을 주시는 하나님의 능력이 됨이라 먼저는 유대인에게요 그리고 헬라인에게로다&rdquo;
          </p>
          <p className="text-sm sm:text-base text-white/80 font-medium text-right mb-6">
            롬 1:16
          </p>
          <p className="text-base sm:text-lg md:text-xl leading-relaxed text-white font-medium">
            예수그리스도의 복음을 통해 개인과 교회와 열방이 하나님과 회복되길 기도하고 예배합니다.
          </p>
        </div>

        <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-wide uppercase mb-10">
          Metanoia 2026
        </h1>
  
        <div className="space-y-8 mb-12">

          <div className="space-y-4">
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold tracking-wide">일정</h3>
            <p className="text-base sm:text-lg md:text-xl text-white font-medium">
              2026년 1월 26일(월) ~ 28일(수)
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold tracking-wide">장소</h3>
            <p className="text-base sm:text-lg md:text-xl text-white font-medium">
              포천중앙침례교회
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold tracking-wide">Speaker</h3>
            <div className="space-y-2">
              <p className="text-base sm:text-lg md:text-xl text-white font-medium">김용의 선교사님</p>
              <p className="text-base sm:text-lg md:text-xl text-white font-medium">송바울 (Dr. One. K)</p>
              <p className="text-base sm:text-lg md:text-xl text-white font-medium">스캇브레너 목사님</p>
            </div>
          </div>

          {/* 이미지 갤러리 */}
          <div className="space-y-4">
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold tracking-wide">집회 안내</h3>
            
            <div className="grid grid-cols-3 gap-2 sm:gap-4">
              <div 
                className="relative cursor-pointer overflow-hidden rounded-lg ring-1 ring-white/10 hover:ring-white/30 transition-all bg-white/5"
                onClick={() => openImage(0)}
              >
                <img
                  src={images[0]}
                  alt="Metanoia 2026 집회 안내 1"
                  className="w-full h-auto object-contain hover:opacity-80 transition-opacity duration-300"
                />
              </div>

              <div 
                className="relative cursor-pointer overflow-hidden rounded-lg ring-1 ring-white/10 hover:ring-white/30 transition-all bg-white/5"
                onClick={() => openImage(1)}
              >
                <img
                  src={images[1]}
                  alt="Metanoia 2026 집회 안내 2"
                  className="w-full h-auto object-contain hover:opacity-80 transition-opacity duration-300"
                />
              </div>

              <div 
                className="relative cursor-pointer overflow-hidden rounded-lg ring-1 ring-white/10 hover:ring-white/30 transition-all bg-white/5"
                onClick={() => openImage(2)}
              >
                <img
                  src={images[2]}
                  alt="Metanoia 2026 집회 안내 3"
                  className="w-full h-auto object-contain hover:opacity-80 transition-opacity duration-300"
                />
              </div>
            </div>
          </div>

        </div>

        {/* 이미지 모달 */}
        {selectedImageIndex !== null && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
            onClick={closeImage}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            {/* 닫기 버튼 */}
            <button
              className="absolute top-4 right-4 text-white text-4xl font-bold hover:text-white/70 transition-colors z-10"
              onClick={closeImage}
            >
              ×
            </button>

            {/* 이전 버튼 */}
            {selectedImageIndex > 0 && (
              <button
                className="absolute left-4 text-white text-5xl font-bold hover:text-white/70 transition-colors z-10"
                onClick={(e) => {
                  e.stopPropagation();
                  previousImage();
                }}
              >
                ‹
              </button>
            )}

            {/* 이미지 */}
            <img
              src={images[selectedImageIndex]}
              alt={`Metanoia 2026 집회 안내 ${selectedImageIndex + 1}`}
              className="max-w-full max-h-full object-contain"
              onClick={(e) => e.stopPropagation()}
            />

            {/* 다음 버튼 */}
            {selectedImageIndex < images.length - 1 && (
              <button
                className="absolute right-4 text-white text-5xl font-bold hover:text-white/70 transition-colors z-10"
                onClick={(e) => {
                  e.stopPropagation();
                  nextImage();
                }}
              >
                ›
              </button>
            )}

            {/* 이미지 인디케이터 */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
              {images.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === selectedImageIndex ? 'bg-white' : 'bg-white/30'
                  }`}
                />
              ))}
            </div>
          </div>
        )}

        <div id="register-section" className="pt-8 scroll-mt-20">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-wide mb-6">
            집회 신청
          </h2>
          
          <p className="text-base sm:text-lg md:text-xl text-white font-medium mb-6">
            Metanoia 2026 집회 참석을 신청해 주세요.
          </p>

          <form onSubmit={onSubmit} className="space-y-6">
            {/* 참석 세션 선택 - 상단에 배치 */}
            <div className="space-y-4">
              <span className="text-sm sm:text-base md:text-lg text-white font-medium">참석 세션 선택 *</span>
              
              <div className="space-y-3">
                <label className="flex items-center space-x-3 cursor-pointer bg-white/5 rounded-lg p-4 ring-1 ring-white/10 hover:bg-white/10 transition-colors">
                  <input
                    type="radio"
                    name="sessionType"
                    value="all"
                    checked={sessionType === "all"}
                    onChange={(e) => setSessionType(e.target.value as "all")}
                    className="w-5 h-5 text-white bg-white/5 border-white/20 focus:ring-white/30 focus:ring-2"
                  />
                  <div>
                    <div className="text-base sm:text-lg text-white font-semibold">신청 1: 모든 시간 참석</div>
                    <div className="text-xs sm:text-sm text-white/70 mt-1">
                      DAY1~3 모든 WORSHIP, COMMUNION 및 METANOIA 세션
                    </div>
                  </div>
                </label>

                <label className="flex items-center space-x-3 cursor-pointer bg-white/5 rounded-lg p-4 ring-1 ring-white/10 hover:bg-white/10 transition-colors">
                  <input
                    type="radio"
                    name="sessionType"
                    value="evening"
                    checked={sessionType === "evening"}
                    onChange={(e) => setSessionType(e.target.value as "evening")}
                    className="w-5 h-5 text-white bg-white/5 border-white/20 focus:ring-white/30 focus:ring-2"
                  />
                  <div>
                    <div className="text-base sm:text-lg text-white font-semibold">신청 2: 저녁 시간 참석</div>
                    <div className="text-xs sm:text-sm text-white/70 mt-1">
                      METANOIA part 1, 2, 3 (19:30-22:00)
                    </div>
                  </div>
                </label>
              </div>
            </div>
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
                <span className="text-sm sm:text-base md:text-lg text-white font-medium">이메일 *</span>
                <input
                  name="email"
                  type="email"
                  required
                  className="mt-2 w-full rounded-md bg-white/5 ring-1 ring-white/10 px-4 py-3 outline-none focus:ring-white/30 text-base sm:text-lg"
                  placeholder="you@example.com"
                />
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <label className="block">
                <span className="text-sm sm:text-base md:text-lg text-white font-medium">직책/역할</span>
                <input
                  name="position"
                  type="text"
                  className="mt-2 w-full rounded-md bg-white/5 ring-1 ring-white/10 px-4 py-3 outline-none focus:ring-white/30 text-base sm:text-lg"
                  placeholder="목사, 전도사, 청년부장 등"
                />
              </label>
              <label className="block">
                <span className="text-sm sm:text-base md:text-lg text-white font-medium">참석 예상 인원 *</span>
                <select
                  name="participants"
                  required
                  className="mt-2 w-full rounded-md bg-white/5 ring-1 ring-white/10 px-4 py-3 outline-none focus:ring-white/30 text-base sm:text-lg"
                >
                  <option value="">선택해주세요</option>
                  <option value="1">1명</option>
                  <option value="2">2명</option>
                  <option value="3">3명</option>
                  <option value="4">4명</option>
                  <option value="5">5명</option>
                  <option value="6">6명</option>
                  <option value="7">7명</option>
                  <option value="8">8명</option>
                  <option value="9">9명</option>
                  <option value="10">10명</option>
                  <option value="15">15명</option>
                  <option value="20">20명</option>
                  <option value="30">30명 이상</option>
                </select>
                <p className="mt-1 text-xs sm:text-sm text-white/70">본인 포함 총 참석 인원을 선택해주세요.</p>
              </label>
            </div>

            <label className="block">
              <span className="text-sm sm:text-base md:text-lg text-white font-medium">추가 메시지</span>
              <textarea
                name="message"
                rows={5}
                className="mt-2 w-full rounded-md bg-white/5 ring-1 ring-white/10 px-4 py-3 outline-none focus:ring-white/30 text-base sm:text-lg"
                placeholder="집회 관련 문의사항이나 특별한 요청사항을 입력해 주세요.

※ 단체로 오실 경우 함께 참석하시는 분들의 정보를 입력해주세요.
예시:
- 김철수 / 010-1234-5678
- 이영희 / 010-2345-6789"
              />
              <p className="mt-1 text-xs sm:text-sm text-white/70">
                단체 참석 시 함께 오시는 분들의 이름과 연락처를 입력해주시면 더 원활한 준비가 가능합니다.
              </p>
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
                <span className="text-sm sm:text-base text-white font-medium">개인정보 수집 및 이용에 동의합니다 (필수)</span>
              </label>
              <div className="ml-7 text-xs sm:text-sm text-white/70">
                <p>
                  입력하신 정보는 사역 신청 및 안내 목적으로 사용되며,<br />
                  <a href="/privacy-policy" className="underline hover:text-white transition-colors">개인정보 처리방침</a>에 따라 안전하게 관리됩니다.
                </p>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !privacyAgreed}
              className="mt-6 inline-flex items-center justify-center rounded border border-white px-8 py-4 text-base sm:text-lg md:text-xl font-medium hover:bg-white hover:text-black transition-colors disabled:opacity-50"
            >
              {loading ? "신청 중..." : "집회 신청하기"}
          </button>

            {ok && <p className="text-emerald-400 text-base sm:text-lg font-medium mt-4">{ok}</p>}
            {err && <p className="text-red-400 text-base sm:text-lg font-medium mt-4">{err}</p>}
          </form>
        </div>
        </main>
      </>
    );
  }
  