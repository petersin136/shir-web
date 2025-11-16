import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    "https://ewaqnqzivdceurhjxgpf.supabase.co";

  const supabaseAnonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY ||
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV3YXFucXppdmRjZXVyaGp4Z3BmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYzNjcwNjYsImV4cCI6MjA3MTk0MzA2Nn0.VE6gXfuPdAqXDzvjcsvWJ7SYR3uvLNsVSbms3cHWnns";

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.warn(
      "Supabase env가 설정되지 않아 하드코딩된 기본 값으로 동작합니다. 로컬/배포 환경에서는 .env.local을 설정하는 것이 좋습니다.",
    );
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
