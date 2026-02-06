-- 사역 신청(applications) 테이블 생성
-- Supabase 대시보드 → SQL Editor에서 이 파일 내용을 붙여넣고 실행하세요.

CREATE TABLE IF NOT EXISTS public.applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  phone text NOT NULL,
  email text NOT NULL,
  church text NOT NULL,
  reason text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- RLS 활성화
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

-- 사역 신청 폼: 누구나(anon) INSERT 가능
CREATE POLICY "applications_insert_anon"
  ON public.applications
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- 관리자/서비스에서 조회 가능 (anon으로 읽기 허용 — manage 페이지용)
CREATE POLICY "applications_select_anon"
  ON public.applications
  FOR SELECT
  TO anon
  USING (true);

-- 테이블 설명
COMMENT ON TABLE public.applications IS '사역 신청 폼(/apply) 제출 데이터';
