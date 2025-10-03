-- SHIR BAND 웹사이트 관리자 페이지 확장 설정

-- 1. 공지사항 테이블 생성
CREATE TABLE IF NOT EXISTS public.notices (
    id BIGSERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    priority INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. 컴포넌트 텍스트 관리 테이블 생성
CREATE TABLE IF NOT EXISTS public.component_texts (
    id BIGSERIAL PRIMARY KEY,
    component_name TEXT NOT NULL UNIQUE,
    texts JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. 이벤트 관리 테이블 생성
CREATE TABLE IF NOT EXISTS public.events (
    id BIGSERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    date DATE NOT NULL,
    time TEXT NOT NULL,
    location TEXT NOT NULL,
    description TEXT,
    link TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 4. RLS 활성화
ALTER TABLE public.notices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.component_texts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- 5. 공개 읽기 권한 정책
CREATE POLICY "Allow public read access" ON public.notices FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON public.component_texts FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON public.events FOR SELECT USING (true);

-- 6. 공개 쓰기 권한 정책 (관리자 페이지용)
CREATE POLICY "Allow public write access" ON public.notices FOR ALL USING (true);
CREATE POLICY "Allow public write access" ON public.component_texts FOR ALL USING (true);
CREATE POLICY "Allow public write access" ON public.events FOR ALL USING (true);

-- 7. 기본 컴포넌트 텍스트 데이터 삽입
INSERT INTO public.component_texts (component_name, texts) VALUES 
('hero', '{
    "title": "SHIR BAND",
    "subtitle": "SPIRIT & TRUTH WORSHIP",
    "verse_english": "that ye present your bodies a living sacrifice holy acceptable unto God, which is your reasonable service",
    "verse_korean": "너희 몸을 하나님이 기뻐하시는 거룩한 산 제물로 드리라 이는 너희가 드릴 영적 예배니라",
    "verse_reference": "Romans 12:1"
}'),
('about', '{
    "title": "About Us",
    "description": "SHIR Band는 예배 공동체로서 하나님께 영과 진리로 찬양을 올려드립니다. 역사와 여정을 간략히 소개하는 영역입니다.",
    "vision_title": "Vision & Mission",
    "vision_korean": "우리는 신령과 진정으로 드리는 예배를 통해 세대와 민족을 변화시키고자 합니다.",
    "vision_english": "We desire to see generations and nations transformed through worship in spirit and in truth."
}'),
('events', '{
    "title": "Events",
    "description": "예배와 찬양 모임 일정을 확인하세요."
}'),
('footer', '{
    "copyright": "© 2024 SHIR BAND. All rights reserved.",
    "subtitle": "Spirit & Truth Worship"
}')
ON CONFLICT (component_name) DO NOTHING;

-- 8. 샘플 공지사항 데이터
INSERT INTO public.notices (title, content, priority) VALUES 
('웹사이트 오픈', '새로운 SHIR BAND 웹사이트가 오픈되었습니다!', 1),
('Metanoia 2026 등록 시작', '회개와 부흥의 3일 집회 등록이 시작되었습니다.', 2)
ON CONFLICT DO NOTHING;

-- 9. 샘플 이벤트 데이터
INSERT INTO public.events (title, date, time, location, description, link) VALUES 
('Worship Night — Seoul', '2025-12-12', '19:00', '서울 ○○교회', '신령과 진정의 예배 모임. 함께 찬양하고 기도합니다.', '/metanoia-2026'),
('Metanoia 2026 (Day 1)', '2026-01-01', '19:30', '장소 추후 공지', '회개와 부흥의 3일 — DAY 1', null),
('Metanoia 2026 (Day 2)', '2026-01-02', '19:30', '장소 추후 공지', '회개와 부흥의 3일 — DAY 2', null)
ON CONFLICT DO NOTHING;
