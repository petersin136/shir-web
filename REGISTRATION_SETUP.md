# METANOIA 2026 등록 폼 설정 가이드

## 🎯 개요
METANOIA 2026 행사를 위한 구글폼 기반 등록 시스템이 구현되어 있습니다.

## 🚀 빠른 설정 방법

### 1단계: 구글폼 생성
1. [Google Forms](https://forms.google.com)에서 새로운 폼 생성
2. METANOIA 2026 등록에 필요한 필드 추가 (이름, 이메일, 연락처, 소속 등)
3. 폼 설정 완료 후 "공유" 버튼 클릭
4. "링크로 공유" 선택하여 URL 복사

### 2단계: 환경변수 설정
프로젝트 루트에 `.env.local` 파일을 생성하고 다음 내용 추가:

```bash
# Supabase Configuration (기존)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Registration Form Configuration
NEXT_PUBLIC_REG_FORM_URL=https://docs.google.com/forms/d/e/YOUR_FORM_ID/viewform

# Admin Contact (선택사항)
NEXT_PUBLIC_ADMIN_EMAIL=admin@shirband.org
```

### 3단계: 테스트
1. `npm run dev` 실행
2. 홈페이지의 "자세히 보기 / 등록하기" 버튼 클릭
3. 모달에서 구글폼이 정상적으로 로딩되는지 확인

## 🎨 사용 가능한 기능

### 메인 기능
- **모달 등록**: 홈페이지에서 버튼 클릭 시 모달로 폼 열기
- **새 창 열기**: 드롭다운에서 구글폼을 새 창으로 열기
- **전용 페이지**: `/register` 경로로 전체 화면 등록 페이지

### 접근성 기능
- ESC 키로 모달 닫기
- 포커스 트랩 (모달 내에서만 탭 이동)
- 키보드 네비게이션 지원
- `prefers-reduced-motion` 대응

### 예외 처리
- 폼 URL이 설정되지 않은 경우 관리자 이메일 안내
- iframe 로딩 실패 시 새 창 열기 옵션 제공

## 🔧 고급 설정

### 폼 URL 미설정 시 동작
`NEXT_PUBLIC_REG_FORM_URL`이 비어있는 경우:
- 모달/페이지에서 안내 메시지 표시
- 관리자 이메일로 문의하기 버튼 제공
- 기본 이메일: `info@shirband.org`

### GA/Analytics 연동 (추후 확장)
등록 버튼 클릭, 모달 열기 등의 이벤트를 추적하려면 `lib/analytics.ts`에 추가 구현 가능

## 📱 모바일 최적화
- 375px ~ 430px 모바일 환경에서 가로 스크롤 없음
- iframe 세로 스크롤만 허용
- 터치 친화적 버튼 크기

## 🚀 배포 시 주의사항
1. Vercel 환경변수에 `NEXT_PUBLIC_REG_FORM_URL` 추가
2. 구글폼 공유 설정이 "링크가 있는 모든 사용자"로 설정되어 있는지 확인
3. 폼 응답 수집이 활성화되어 있는지 확인

## 🛠️ 문제 해결

### 폼이 로딩되지 않는 경우
1. 구글폼 URL이 올바른지 확인
2. 폼 공유 설정 확인
3. 브라우저 콘솔에서 CORS 오류 확인

### 모달이 열리지 않는 경우
1. JavaScript 오류 확인 (브라우저 콘솔)
2. Framer Motion 설치 확인: `npm install framer-motion`

## 📞 문의
- 기술적 문제: 개발팀 문의
- 폼 설정 관련: 행사 기획팀 문의

