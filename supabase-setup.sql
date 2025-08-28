-- SHIR BAND 웹사이트 관리자 페이지를 위한 Supabase 설정

-- 1. settings 테이블 생성
CREATE TABLE IF NOT EXISTS public.settings (
    id BIGINT PRIMARY KEY DEFAULT 1,
    hero_title TEXT,
    hero_subtitle TEXT,
    hero_image_url TEXT,
    hero_video_url TEXT,
    logo_url TEXT,
    overlay_opacity DECIMAL(3,2) DEFAULT 0.5,
    blur_px INTEGER DEFAULT 0,
    video_opacity DECIMAL(3,2) DEFAULT 1.0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. RLS (Row Level Security) 활성화
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- 3. 공개 읽기 권한 정책
CREATE POLICY "Allow public read access" ON public.settings
FOR SELECT
USING (true);

-- 4. 공개 쓰기 권한 정책 (관리자 페이지용)
CREATE POLICY "Allow public write access" ON public.settings
FOR ALL
USING (true);

-- 5. 기본 설정 데이터 삽입
INSERT INTO public.settings (
    id,
    hero_title,
    hero_subtitle,
    overlay_opacity,
    blur_px,
    video_opacity
) VALUES (
    1,
    'SHIR BAND
SPIRIT & TRUTH WORSHIP',
    'that ye present your bodies a living sacrifice holy acceptable unto God, which is your reasonable service

너희 몸을 하나님이 기뻐하시는 거룩한 산 제물로 드리라 이는 너희가 드릴 영적 예배니라

Romans 12:1',
    0.5,
    0,
    1.0
) ON CONFLICT (id) DO NOTHING;

-- 6. Storage 버킷 생성 (이미지/비디오 업로드용)
INSERT INTO storage.buckets (id, name, public)
VALUES ('website-assets', 'website-assets', true)
ON CONFLICT (id) DO NOTHING;

-- 7. Storage 정책 (공개 읽기/쓰기)
CREATE POLICY "Public Access"
ON storage.objects FOR ALL
USING (bucket_id = 'website-assets');
