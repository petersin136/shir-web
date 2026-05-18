/** 브라우저·API 공통 Supabase 연결 값 (env 미설정 시 프로젝트 기본값) */
export function getSupabaseUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    "https://ewaqnqzivdceurhjxgpf.supabase.co"
  );
}

export function getSupabaseAnonKey(): string {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY ||
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV3YXFucXppdmRjZXVyaGp4Z3BmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYzNjcwNjYsImV4cCI6MjA3MTk0MzA2Nn0.VE6gXfuPdAqXDzvjcsvWJ7SYR3uvLNsVSbms3cHWnns"
  );
}

export function isSupabaseEnvConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY),
  );
}
