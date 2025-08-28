// app/manage/page.tsx
"use client";

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import Image from "next/image";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Settings = {
  hero_title: string;
  hero_subtitle: string;
  hero_video_url: string;
  hero_image_url: string;
  overlay_opacity: number;
  blur_px: number;
  video_opacity?: number;
};

export default function ManagePage() {
  const [settings, setSettings] = useState<Settings>({
    hero_title: "",
    hero_subtitle: "",
    hero_video_url: "",
    hero_image_url: "",
    overlay_opacity: 0.5,
    blur_px: 0,
    video_opacity: 1.0,
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"text" | "images">("text");
  const [connectionStatus, setConnectionStatus] = useState<"checking" | "connected" | "error">("checking");

  // 설정 불러오기
  useEffect(() => {
    checkConnection();
    loadSettings();
  }, []);

  const checkConnection = async () => {
    try {
      const { error } = await supabase
        .from("settings")
        .select("count", { count: "exact", head: true });
      
      if (error) {
        console.error("연결 테스트 실패:", error);
        setConnectionStatus("error");
        setMessage(`데이터베이스 연결 실패: ${error.message}`);
      } else {
        console.log("Supabase 연결 성공");
        setConnectionStatus("connected");
      }
    } catch (error) {
      console.error("연결 확인 실패:", error);
      setConnectionStatus("error");
      setMessage("데이터베이스 연결을 확인할 수 없습니다.");
    }
  };

  const loadSettings = async () => {
    try {
      const { data, error } = await supabase
        .from("settings")
        .select("*")
        .limit(1)
        .single();

      if (error) {
        console.error("설정 불러오기 에러:", error);
        // 테이블이 비어있거나 없는 경우 기본값 유지
        if (error.code === 'PGRST116') {
          console.log("설정 테이블이 비어있습니다. 기본값을 사용합니다.");
          return;
        }
        throw error;
      }
      if (data) {
        console.log("불러온 설정:", data);
        setSettings(data);
      }
    } catch (error) {
      console.error("설정 불러오기 실패:", error);
      setMessage("설정을 불러오는데 실패했습니다. 기본값을 사용합니다.");
    }
  };

  // 설정 저장 - 간단한 버전
  const saveSettings = async () => {
    setLoading(true);
    setMessage(null);

    try {
      console.log("저장 시도:", settings.hero_subtitle);
      
      // 간단한 저장 시도
      const { error } = await supabase
        .from("settings")
        .upsert([{
          id: 1,
          hero_subtitle: settings.hero_subtitle || ""
        }]);

      if (error) {
        throw error;
      }
      
      setMessage("✅ 저장 완료! 홈페이지를 새로고침해보세요.");
      
    } catch (error) {
      console.error("저장 실패:", error);
      setMessage(`❌ 저장 실패: ${error instanceof Error ? error.message : '오류'}`);
    } finally {
      setLoading(false);
    }
  };

  // 이미지 업로드
  const uploadImage = async (file: File, path: string) => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${path}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('assets')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('assets')
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error) {
      console.error("이미지 업로드 실패:", error);
      throw error;
    }
  };

  // 로고 이미지 변경
  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    try {
      await uploadImage(file, 'shir-logo');
      setMessage("로고가 성공적으로 업로드되었습니다!");
    } catch {
      setMessage("로고 업로드에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 히어로 이미지 변경
  const handleHeroImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    try {
      const url = await uploadImage(file, 'hero-image');
      setSettings(prev => ({ ...prev, hero_image_url: url }));
      setMessage("히어로 이미지가 성공적으로 업로드되었습니다!");
    } catch {
      setMessage("히어로 이미지 업로드에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 비디오 업로드
  const uploadVideo = async (file: File, path: string) => {
    try {
      // 파일 크기 확인 (50MB = 50 * 1024 * 1024 bytes)
      const maxSize = 50 * 1024 * 1024;
      if (file.size > maxSize) {
        throw new Error("파일 크기가 50MB를 초과합니다.");
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${path}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('assets')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('assets')
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error) {
      console.error("비디오 업로드 실패:", error);
      throw error;
    }
  };

  // 히어로 비디오 변경
  const handleHeroVideoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 비디오 파일 형식 확인
    const allowedTypes = ['video/mp4', 'video/webm', 'video/ogg'];
    if (!allowedTypes.includes(file.type)) {
      setMessage("MP4, WebM, OGG 형식의 비디오 파일만 업로드 가능합니다.");
      return;
    }

    setLoading(true);
    try {
      const url = await uploadVideo(file, 'hero-video');
      setSettings(prev => ({ ...prev, hero_video_url: url }));
      setMessage("히어로 비디오가 성공적으로 업로드되었습니다!");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "히어로 비디오 업로드에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 text-gray-800">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* 헤더 */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-3xl font-bold text-gray-800">
              웹사이트 관리
            </h1>
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${
                connectionStatus === "connected" ? "bg-green-500" : 
                connectionStatus === "error" ? "bg-red-500" : "bg-yellow-500"
              }`}></div>
              <span className="text-sm text-gray-600">
                {connectionStatus === "connected" ? "연결됨" : 
                 connectionStatus === "error" ? "연결 실패" : "확인 중..."}
              </span>
            </div>
          </div>
          <p className="text-gray-600">
            웹사이트의 텍스트와 이미지를 관리할 수 있습니다.
          </p>
        </div>

        {/* 탭 메뉴 */}
        <div className="bg-white rounded-2xl shadow-lg mb-8">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab("text")}
              className={`flex-1 py-4 px-6 text-center font-medium rounded-t-2xl transition-colors ${
                activeTab === "text"
                  ? "bg-blue-500 text-white"
                  : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
              }`}
            >
              텍스트 설정
            </button>
            <button
              onClick={() => setActiveTab("images")}
              className={`flex-1 py-4 px-6 text-center font-medium rounded-t-2xl transition-colors ${
                activeTab === "images"
                  ? "bg-blue-500 text-white"
                  : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
              }`}
            >
              이미지 설정
            </button>
          </div>

          <div className="p-6">
            {activeTab === "text" && (
              <div className="space-y-6">
                {/* 간단한 텍스트 편집기 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    성경구절 텍스트 ✏️
                  </label>
                  <textarea
                    value={settings.hero_subtitle}
                    onChange={(e) => setSettings(prev => ({ ...prev, hero_subtitle: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-gray-800 bg-white"
                    rows={8}
                    placeholder="성경구절을 입력하세요..."
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    ⚠️ 주의: 특수문자나 줄바꿈은 공백으로 변환되어 표시됩니다.
                  </p>
                </div>

                {/* 비디오 URL */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    배경 비디오 URL
                  </label>
                  <input
                    type="url"
                    value={settings.hero_video_url}
                    onChange={(e) => setSettings(prev => ({ ...prev, hero_video_url: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 bg-white"
                    placeholder="https://example.com/video.mp4"
                  />
                </div>

                {/* 오버레이 투명도 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    오버레이 투명도: {Math.round(settings.overlay_opacity * 100)}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={settings.overlay_opacity}
                    onChange={(e) => setSettings(prev => ({ ...prev, overlay_opacity: parseFloat(e.target.value) }))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>

                {/* 블러 효과 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    배경 블러 효과: {settings.blur_px}px
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="20"
                    step="1"
                    value={settings.blur_px}
                    onChange={(e) => setSettings(prev => ({ ...prev, blur_px: parseInt(e.target.value) }))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>

                {/* 비디오 투명도 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    비디오 투명도: {Math.round((settings.video_opacity || 1) * 100)}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={settings.video_opacity || 1}
                    onChange={(e) => setSettings(prev => ({ ...prev, video_opacity: parseFloat(e.target.value) }))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>
              </div>
            )}

            {activeTab === "images" && (
              <div className="space-y-8">
                {/* 로고 이미지 */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-lg font-medium text-gray-800 mb-4">로고 이미지</h3>
                  <div className="flex items-center gap-6">
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <Image
                        src="https://ewaqnqzivdceurhjxgpf.supabase.co/storage/v1/object/public/assets/shir-logo.png"
                        alt="현재 로고"
                        width={64}
                        height={64}
                        className="object-contain"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block">
                        <span className="sr-only">로고 이미지 선택</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleLogoChange}
                          className="block w-full text-sm text-gray-800 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                      </label>
                      <p className="text-xs text-gray-500 mt-2">
                        PNG, JPG, JPEG 파일만 업로드 가능합니다.
                      </p>
                    </div>
                  </div>
                </div>

                {/* 히어로 이미지 */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-lg font-medium text-gray-800 mb-4">히어로 배경 이미지</h3>
                  <div className="space-y-4">
                    {settings.hero_image_url && (
                      <div className="relative w-full h-32 bg-white rounded-lg overflow-hidden shadow-sm">
                        <Image
                          src={settings.hero_image_url}
                          alt="히어로 배경"
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div>
                      <label className="block">
                        <span className="sr-only">히어로 이미지 선택</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleHeroImageChange}
                          className="block w-full text-sm text-gray-800 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                      </label>
                      <p className="text-xs text-gray-500 mt-2">
                        배경으로 사용할 이미지를 업로드하세요.
                      </p>
                    </div>
                  </div>
                </div>

                {/* 히어로 비디오 */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-lg font-medium text-gray-800 mb-4">히어로 배경 비디오</h3>
                  <div className="space-y-4">
                    {settings.hero_video_url && (
                      <div className="relative w-full h-32 bg-black rounded-lg overflow-hidden shadow-sm">
                        <video
                          src={settings.hero_video_url}
                          className="w-full h-full object-cover"
                          muted
                          loop
                          autoPlay
                        />
                      </div>
                    )}
                    <div>
                      <label className="block">
                        <span className="sr-only">히어로 비디오 선택</span>
                        <input
                          type="file"
                          accept="video/mp4,video/webm,video/ogg"
                          onChange={handleHeroVideoChange}
                          className="block w-full text-sm text-gray-800 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                        />
                      </label>
                      <p className="text-xs text-gray-500 mt-2">
                        배경으로 사용할 비디오를 업로드하세요. (최대 50MB, MP4/WebM/OGG 형식)
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 저장 버튼 및 메시지 */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          {message && (
            <div className={`mb-4 p-4 rounded-lg ${
              message.includes("성공") 
                ? "bg-green-50 text-green-700 border border-green-200" 
                : "bg-red-50 text-red-700 border border-red-200"
            }`}>
              {message}
            </div>
          )}
          
          <div className="flex gap-4">
            <button
              onClick={saveSettings}
              disabled={loading || connectionStatus === "error"}
              className="flex-1 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white font-medium py-3 px-6 rounded-lg transition-colors"
            >
              {loading ? "저장 중..." : "설정 저장"}
            </button>
            
            <button
              onClick={loadSettings}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              새로고침
            </button>

            <button
              onClick={() => {
                console.log("환경 변수 확인:");
                console.log("SUPABASE_URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);
                console.log("SUPABASE_ANON_KEY:", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
                checkConnection();
              }}
              className="px-4 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm"
            >
              연결 테스트
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
