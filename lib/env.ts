// lib/env.ts
/**
 * 클라이언트 사이드에서 안전하게 환경변수에 접근하는 헬퍼 함수들
 */

/**
 * 등록 폼 URL을 가져옵니다
 * @returns 구글폼 URL 또는 null (설정되지 않은 경우)
 */
export function getRegFormUrl(): string | null {
  const url = process.env.NEXT_PUBLIC_REG_FORM_URL;
  return url && url.trim() !== '' ? url.trim() : null;
}

/**
 * 관리자 이메일을 가져옵니다
 * @returns 관리자 이메일 또는 기본값
 */
export function getAdminEmail(): string {
  return process.env.NEXT_PUBLIC_ADMIN_EMAIL?.trim() || 'info@shirband.org';
}

/**
 * 구글폼 URL을 iframe 임베드용으로 변환합니다
 * @param url 원본 구글폼 URL
 * @returns 임베드용 URL
 */
export function formatFormUrlForEmbed(url: string): string {
  // 이미 embedded=true가 있는지 확인
  if (url.includes('embedded=true')) {
    return url;
  }
  
  // URL에 embedded=true 파라미터 추가
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}embedded=true`;
}

