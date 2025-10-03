// app/manage/media/page.tsx
"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";

interface Settings {
  id: number;
  hero_title: string;
  hero_subtitle: string;
  hero_image_url: string;
  hero_video_url: string;
  logo_url: string;
  overlay_opacity: number;
  blur_px: number;
  video_opacity: number;
  updated_at: string;
}

export default function MediaPage() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const supabase = createClient();

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const { data, error } = await supabase
        .from("settings")
        .select("*")
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      setSettings(data || {
        id: 1,
        hero_title: "",
        hero_subtitle: "",
        hero_image_url: "",
        hero_video_url: "",
        logo_url: "",
        overlay_opacity: 0.5,
        blur_px: 0,
        video_opacity: 1.0,
        updated_at: new Date().toISOString(),
      });
    } catch (error) {
      console.error("설정 로드 실패:", error);
      setMessage("❌ 설정을 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const uploadFile = async (file: File, path: string) => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${path}-${Date.now()}.${fileExt}`;
      const filePath = fileName;

      const { error: uploadError } = await supabase.storage
        .from('website-assets')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('website-assets')
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error) {
      console.error("파일 업로드 실패:", error);
      throw error;
    }
  };

  const updateSettings = async (updates: Partial<Settings>) => {
    if (!settings) return;

    try {
      const { error } = await supabase
        .from("settings")
        .upsert([{
          ...settings,
          ...updates,
          updated_at: new Date().toISOString(),
        }]);

      if (error) throw error;

      setSettings(prev => prev ? { ...prev, ...updates } : null);
      setMessage("✅ 설정이 저장되었습니다!");
    } catch (error) {
      console.error("설정 저장 실패:", error);
      setMessage("❌ 설정 저장에 실패했습니다.");
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 파일 크기 제한 (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setMessage("❌ 파일 크기는 5MB 이하여야 합니다.");
      return;
    }

    // 파일 형식 확인
    if (!file.type.startsWith('image/')) {
      setMessage("❌ 이미지 파일만 업로드 가능합니다.");
      return;
    }

    setUploading("logo");
    try {
      const url = await uploadFile(file, 'logo');
      await updateSettings({ logo_url: url });
    } catch (error) {
      setMessage("❌ 로고 업로드에 실패했습니다.");
    } finally {
      setUploading(null);
    }
  };

  const handleHeroImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 파일 크기 제한 (10MB)
    if (file.size > 10 * 1024 * 1024) {
      setMessage("❌ 파일 크기는 10MB 이하여야 합니다.");
      return;
    }

    // 파일 형식 확인
    if (!file.type.startsWith('image/')) {
      setMessage("❌ 이미지 파일만 업로드 가능합니다.");
      return;
    }

    setUploading("hero-image");
    try {
      const url = await uploadFile(file, 'hero-image');
      await updateSettings({ hero_image_url: url });
    } catch (error) {
      setMessage("❌ 히어로 이미지 업로드에 실패했습니다.");
    } finally {
      setUploading(null);
    }
  };

  const handleHeroVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 파일 크기 제한 (100MB)
    if (file.size > 100 * 1024 * 1024) {
      setMessage("❌ 파일 크기는 100MB 이하여야 합니다.");
      return;
    }

    // 파일 형식 확인
    const allowedTypes = ['video/mp4', 'video/webm', 'video/ogg'];
    if (!allowedTypes.includes(file.type)) {
      setMessage("❌ MP4, WebM, OGG 형식의 비디오 파일만 업로드 가능합니다.");
      return;
    }

    setUploading("hero-video");
    try {
      const url = await uploadFile(file, 'hero-video');
      await updateSettings({ hero_video_url: url });
    } catch (error) {
      setMessage("❌ 히어로 비디오 업로드에 실패했습니다.");
    } finally {
      setUploading(null);
    }
  };

  const handleSliderChange = async (key: keyof Settings, value: number) => {
    if (!settings) return;
    
    const updates = { [key]: value };
    setSettings(prev => prev ? { ...prev, ...updates } : null);
    
    // 디바운스를 위해 즉시 저장하지 않고 상태만 업데이트
  };

  const saveSliderSettings = async () => {
    if (!settings) return;

    try {
      const { error } = await supabase
        .from("settings")
        .upsert([{
          ...settings,
          updated_at: new Date().toISOString(),
        }]);

      if (error) throw error;
      setMessage("✅ 설정이 저장되었습니다!");
    } catch (error) {
      console.error("설정 저장 실패:", error);
      setMessage("❌ 설정 저장에 실패했습니다.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">미디어 설정을 불러오는 중...</span>
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">설정을 불러올 수 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">미디어 관리</h1>
        <p className="text-gray-600">웹사이트의 이미지, 비디오 및 시각적 설정을 관리할 수 있습니다.</p>
      </div>

      {/* 메시지 */}
      {message && (
        <div className={`p-4 rounded-lg ${
          message.includes("✅") 
            ? "bg-green-50 text-green-700 border border-green-200" 
            : "bg-red-50 text-red-700 border border-red-200"
        }`}>
          {message}
        </div>
      )}

      {/* 로고 관리 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">로고</h2>
        <div className="flex items-center gap-6">
          <div className="bg-gray-50 rounded-lg p-4">
            {settings.logo_url ? (
              <Image
                src={settings.logo_url}
                alt="현재 로고"
                width={80}
                height={80}
                className="object-contain"
              />
            ) : (
              <div className="w-20 h-20 bg-gray-200 rounded flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}
          </div>
          <div className="flex-1">
            <label className="block">
              <span className="sr-only">로고 이미지 선택</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                disabled={uploading === "logo"}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50"
              />
            </label>
            <p className="text-xs text-gray-500 mt-2">
              PNG, JPG, JPEG 파일 (최대 5MB)
            </p>
            {uploading === "logo" && (
              <p className="text-sm text-blue-600 mt-2">업로드 중...</p>
            )}
          </div>
        </div>
      </div>

      {/* 히어로 이미지 관리 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">히어로 배경 이미지</h2>
        <div className="space-y-4">
          {settings.hero_image_url && (
            <div className="relative w-full h-48 bg-gray-50 rounded-lg overflow-hidden">
              <Image
                src={settings.hero_image_url}
                alt="히어로 배경 이미지"
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
                onChange={handleHeroImageUpload}
                disabled={uploading === "hero-image"}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100 disabled:opacity-50"
              />
            </label>
            <p className="text-xs text-gray-500 mt-2">
              배경으로 사용할 이미지 (최대 10MB)
            </p>
            {uploading === "hero-image" && (
              <p className="text-sm text-green-600 mt-2">업로드 중...</p>
            )}
          </div>
        </div>
      </div>

      {/* 히어로 비디오 관리 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">히어로 배경 비디오</h2>
        <div className="space-y-4">
          {settings.hero_video_url && (
            <div className="relative w-full h-48 bg-black rounded-lg overflow-hidden">
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
                onChange={handleHeroVideoUpload}
                disabled={uploading === "hero-video"}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100 disabled:opacity-50"
              />
            </label>
            <p className="text-xs text-gray-500 mt-2">
              배경으로 사용할 비디오 (최대 100MB, MP4/WebM/OGG 형식)
            </p>
            {uploading === "hero-video" && (
              <p className="text-sm text-purple-600 mt-2">업로드 중...</p>
            )}
          </div>
        </div>
      </div>

      {/* 시각적 설정 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">시각적 효과 설정</h2>
          <button
            onClick={saveSliderSettings}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            설정 저장
          </button>
        </div>

        <div className="space-y-6">
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
              onChange={(e) => handleSliderChange('overlay_opacity', parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>투명</span>
              <span>불투명</span>
            </div>
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
              onChange={(e) => handleSliderChange('blur_px', parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>블러 없음</span>
              <span>강한 블러</span>
            </div>
          </div>

          {/* 비디오 투명도 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              비디오 투명도: {Math.round(settings.video_opacity * 100)}%
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={settings.video_opacity}
              onChange={(e) => handleSliderChange('video_opacity', parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>투명</span>
              <span>불투명</span>
            </div>
          </div>
        </div>

        {/* 미리보기 */}
        <div className="mt-8 p-4 bg-gray-900 rounded-lg relative overflow-hidden">
          <div 
            className="absolute inset-0 bg-black"
            style={{ opacity: settings.overlay_opacity }}
          ></div>
          {settings.hero_image_url && (
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{ 
                backgroundImage: `url(${settings.hero_image_url})`,
                filter: `blur(${settings.blur_px}px)`,
                opacity: settings.video_opacity
              }}
            ></div>
          )}
          <div className="relative z-10 text-center text-white py-8">
            <h3 className="text-xl font-bold mb-2">미리보기</h3>
            <p className="text-sm opacity-80">현재 설정이 적용된 모습입니다</p>
          </div>
        </div>
      </div>

      {/* 도움말 */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex">
          <svg className="w-5 h-5 text-blue-600 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h3 className="text-sm font-medium text-blue-800">사용 안내</h3>
            <div className="mt-2 text-sm text-blue-700">
              <ul className="list-disc pl-5 space-y-1">
                <li>로고는 네비게이션 바에 표시됩니다.</li>
                <li>히어로 이미지와 비디오 중 하나만 배경으로 사용됩니다 (비디오 우선).</li>
                <li>오버레이 투명도를 조정하여 텍스트 가독성을 높일 수 있습니다.</li>
                <li>블러 효과는 배경 이미지에만 적용됩니다.</li>
                <li>설정 변경 후 반드시 "설정 저장" 버튼을 클릭해주세요.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

