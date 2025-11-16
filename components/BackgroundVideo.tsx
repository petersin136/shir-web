'use client';

import { createClient } from "@supabase/supabase-js";
import Image from "next/image";
import { useEffect, useState } from "react";

type SettingsRow = {
  hero_video_url: string | null;
  hero_image_url: string | null;
  overlay_opacity: number | null;
  blur_px: number | null;
  video_opacity?: number | null;
};

interface BackgroundVideoProps {
  overlayOpacity?: number; // 페이지별로 다른 투명도 설정 가능
  className?: string;
}

export function BackgroundVideo({ 
  overlayOpacity = 0.3, // 기본값: 다른 페이지에서는 더 어둡게
  className = "fixed inset-0 -z-10" 
}: BackgroundVideoProps) {
  const [settings, setSettings] = useState<SettingsRow | null>(null);
  const [hasError, setHasError] = useState(false);

  // Supabase settings를 못 불러올 때 사용할 기본 영상 URL
  const FALLBACK_VIDEO_URL =
    "https://ewaqnqzivdceurhjxgpf.supabase.co/storage/v1/object/public/assets/hero.mp4";

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

        if (!supabaseUrl || !supabaseAnonKey) {
          console.warn(
            "BackgroundVideo: Supabase env가 없습니다. 기본 배경만 표시합니다.",
          );
          setHasError(true);
          return;
        }

        const supabase = createClient(supabaseUrl, supabaseAnonKey);

        const { data, error } = await supabase
          .from("settings")
          .select("*")
          .limit(1)
          .single();

        if (error) {
          console.error("BackgroundVideo: settings 로드 실패", error);
          setHasError(true);
          return;
        }

        setSettings(data);
      } catch (e) {
        console.error("BackgroundVideo: 알 수 없는 오류", e);
        setHasError(true);
      }
    };

    loadSettings();
  }, []);

  // env가 없거나 오류가 나면 기본 영상 + 어두운 배경만 표시 (앱이 깨지지 않도록)
  if (!settings || hasError) {
    return (
      <div className={className}>
        {/* 기본 배경 비디오 */}
        <video
          className="absolute inset-0 w-full h-full object-cover"
          src={FALLBACK_VIDEO_URL}
          autoPlay
          muted
          loop
          playsInline
        />
        <div
          className="absolute inset-0"
          style={{
            backgroundColor: `rgba(0,0,0,${overlayOpacity})`,
          }}
        />
      </div>
    );
  }

  return (
    <div className={className}>
      {/* 배경 비디오 */}
      {settings.hero_video_url && (
        <video
          className="absolute inset-0 w-full h-full object-cover"
          src={settings.hero_video_url}
          autoPlay
          muted
          loop
          playsInline
          style={{ opacity: settings.video_opacity || 1 }}
        />
      )}

      {/* 블러 이미지 레이어 */}
      {settings.hero_image_url && (
        <Image
          src={settings.hero_image_url}
          alt=""
          fill
          className="object-cover"
          style={{ filter: settings.blur_px ? `blur(${settings.blur_px}px)` : undefined }}
        />
      )}

      {/* 어둡게 오버레이 */}
      <div
        className="absolute inset-0"
        style={{
          backgroundColor: `rgba(0,0,0,${overlayOpacity})`,
        }}
      />
    </div>
  );
}

