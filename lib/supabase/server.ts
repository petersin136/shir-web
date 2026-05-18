import { createClient } from "@supabase/supabase-js";
import { getSupabaseAnonKey, getSupabaseUrl, isSupabaseEnvConfigured } from "./config";

/** API Route 등 서버에서 사용하는 Supabase 클라이언트 */
export function createServerSupabaseClient() {
  if (!isSupabaseEnvConfigured()) {
    console.warn(
      "Supabase env가 설정되지 않아 기본 프로젝트 값으로 API를 실행합니다. 배포 환경에서는 .env.local / Vercel env를 설정하세요.",
    );
  }

  return createClient(getSupabaseUrl(), getSupabaseAnonKey());
}
