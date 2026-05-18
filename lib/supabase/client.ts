import { createBrowserClient } from "@supabase/ssr";
import {
  getSupabaseAnonKey,
  getSupabaseUrl,
  isSupabaseEnvConfigured,
} from "./config";

export function createClient() {
  if (!isSupabaseEnvConfigured()) {
    console.warn(
      "Supabase env가 설정되지 않아 기본 프로젝트 값으로 동작합니다. 로컬/배포 환경에서는 .env.local을 설정하는 것이 좋습니다.",
    );
  }

  return createBrowserClient(getSupabaseUrl(), getSupabaseAnonKey());
}
