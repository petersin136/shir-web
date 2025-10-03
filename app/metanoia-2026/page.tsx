// app/metanoia-2026/page.tsx
"use client";

import { useState } from "react";
import { BackgroundVideo } from "@/components/BackgroundVideo";

export default function MetanoiaPage() {
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
      phone: String(formData.get("phone") || "").trim(),
      church: String(formData.get("church") || "").trim(),
      position: String(formData.get("position") || "").trim(),
      participants: String(formData.get("participants") || "").trim(),
      message: String(formData.get("message") || "").trim(),
    };

    if (!payload.name || !payload.email || !payload.phone || !payload.church) {
      setErr("이름, 이메일, 연락처, 소속교회는 필수 입력사항입니다.");
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
- 참석 예상 인원: ${payload.participants}
- 추가 메시지: ${payload.message}
          `.trim()
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "서버 오류");
      setOk("Metanoia 2026 집회 신청이 완료되었습니다. 감사합니다!");
      form.reset();
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
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-wide uppercase mb-10">
          Metanoia 2026
        </h1>
  
        <div className="space-y-8 mb-12">
          <div className="space-y-4">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-wide">Metanoia Conference 기도제목</h2>
            <p className="text-lg sm:text-xl md:text-2xl leading-relaxed text-white font-medium italic">
              Pray Together. Believe Together.
            </p>
          </div>

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
              <p className="text-base sm:text-lg md:text-xl text-white font-medium">첫째날: 김용의 선교사님</p>
              <p className="text-base sm:text-lg md:text-xl text-white font-medium">둘째날: 송바울 (Dr. One. K)</p>
              <p className="text-base sm:text-lg md:text-xl text-white font-medium">셋째날: 스캇브레너 목사님</p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold tracking-wide">약속의 말씀</h3>
            <div className="space-y-3 text-sm sm:text-base md:text-lg text-white/90 font-medium">
              <p>사도행전 2장 14절-42절 / 로마서 1장 16절-17절</p>
              <p>사도행전 15장 16절 / 요일 2장 18절-32절</p>
              <p>사도행전 2장 16절-21절</p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold tracking-wide">기도제목</h3>
            <div className="space-y-3 text-sm sm:text-base md:text-lg text-white/90 font-medium">
              <p>1. 주님의 복음이 전파되어 복음 앞에 반응하는 이방인들과 
                 하나님의 사람들이 일어날 기도합니다.</p>
              
              <p>2. 주님의 복음이 전파되어 그 복음 앞에 반응하는 교회가 
                 일어날 기도합니다.</p>
              
              <p>3. 말씀을 전하시는 강사님들의 건강과 사역지를 위하여 그리고 
                 강사님들의 건강과 성령충만을 위해 기도합니다.</p>
              
              <p>4. 복음을 통해 주님이 말씀하신 무너진 다윗의 장막이 회복되고 
                 예배의 회복이 일어날 기도합니다.</p>
              
              <p>5. 모든 어두움들이 주님의 이름으로 떠나갈 기도합니다.</p>
              
              <p>6. 집회 준비부터 마칠 때까지 사고 없이 지켜주실 기도합니다.</p>
              
              <p>7. 예배와 말씀 선포에 방해가 없도록 음향/조명/영상 등 
                 주님의 보혈로 덮으시고 단 하나의 문제가 발생되지 않도록 기도합니다.</p>
              
              <p>8. 좋은 날씨를 허락하셔서 강사님들과 집회 참석자들의 
                 이동에 문제가 없길 기도합니다.</p>
              
              <p>9. 성령님이 없이는 아무것도 할 수 없기에 성령님의 역사하심을 
                 기대하며 약속의 말씀을 이루실 것을 믿고 기도합니다.</p>
              
              <p>10. 모든 영광은 주님께, 겸손함으로 준비하여 주님만 높임 받으시고 
                  주님의 일이 나타날 기도합니다.</p>
              
              <p>11. 예배 인도하는 SHIR BAND와 컨퍼런스를 준비하는 모든 분들의 
                  건강과 성령충만을 위해 기도합니다.</p>
              
              <p>12. 집회에 필요한 모든 재정을 주님이 채워주실 것을 믿고 기도합니다.</p>
              
              <p>13. 컨퍼런스에 참석하는 모든 성도들이 은혜 받고 변화되는 
                  시간이 되도록 기도합니다.</p>
              
              <p>14. 온라인으로 참석하는 분들도 현장과 같은 은혜를 
                  경험할 수 있도록 기도합니다.</p>
              
              <p>15. 컨퍼런스를 통해 주님의 마음이 전달되고 새로운 비전이 
                  주어지도록 기도합니다.</p>
              
              <p>16. 모든 섬김이들과 자원봉사자들이 주님의 사랑으로 
                  섬길 수 있도록 기도합니다.</p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold tracking-wide">주최/주관</h3>
            <p className="text-base sm:text-lg md:text-xl text-white font-medium">
              SHIR BAND
            </p>
          </div>
        </div>

        <div id="register-section" className="border-t border-white/20 pt-12 scroll-mt-20">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-wide mb-6">
            집회 신청
          </h2>
          
          <p className="text-base sm:text-lg md:text-xl text-white font-medium mb-10">
            Metanoia 2026 집회 참석을 신청해 주세요.
          </p>

          <form onSubmit={onSubmit} className="space-y-6">
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
                <span className="text-sm sm:text-base md:text-lg text-white font-medium">참석 예상 인원</span>
                <input
                  name="participants"
                  type="text"
                  className="mt-2 w-full rounded-md bg-white/5 ring-1 ring-white/10 px-4 py-3 outline-none focus:ring-white/30 text-base sm:text-lg"
                  placeholder="예: 개인 1명, 팀 5명 등"
                />
              </label>
            </div>

            <label className="block">
              <span className="text-sm sm:text-base md:text-lg text-white font-medium">추가 메시지</span>
              <textarea
                name="message"
                rows={5}
                className="mt-2 w-full rounded-md bg-white/5 ring-1 ring-white/10 px-4 py-3 outline-none focus:ring-white/30 text-base sm:text-lg"
                placeholder="집회 관련 문의사항이나 특별한 요청사항이 있으시면 입력해 주세요."
              />
            </label>

            <button
              type="submit"
              disabled={loading}
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
  