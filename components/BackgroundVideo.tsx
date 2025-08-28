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

  useEffect(() => {
    const loadSettings = async () => {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );

      const { data } = await supabase
        .from("settings")
        .select("*")
        .limit(1)
        .single();

      setSettings(data);
    };

    loadSettings();
  }, []);

  if (!settings) return null;

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

