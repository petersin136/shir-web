// app/api/manage/delete-rows/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const ADMIN_ID = "shiradmin";
const ADMIN_PW = "shir2025!";

function decodeJwtPayload(jwt: string): Record<string, unknown> | null {
  const parts = jwt.trim().split(".");
  if (parts.length !== 3) return null;
  try {
    const json = Buffer.from(parts[1], "base64url").toString("utf8");
    return JSON.parse(json) as Record<string, unknown>;
  } catch {
    return null;
  }
}

/** Service / elevated 키인지 확인 (anon·publishable 거부) */
function validateSupabaseServiceRoleKey(key: string): { ok: true } | { ok: false; message: string } {
  const trimmed = key.trim();
  if (!trimmed) {
    return { ok: false, message: "SUPABASE_SERVICE_ROLE_KEY가 비어 있습니다." };
  }
  // Supabase 신규 API 키: service_role JWT가 아닌 sb_secret_… 형식
  if (trimmed.startsWith("sb_publishable_")) {
    return {
      ok: false,
      message:
        "SUPABASE_SERVICE_ROLE_KEY에 publishable(공개) 키가 들어가 있습니다. Dashboard의 **Secret** 키(sb_secret_…) 또는 레거시 **service_role** JWT를 사용하세요.",
    };
  }
  if (trimmed.startsWith("sb_secret_")) {
    return { ok: true };
  }

  const payload = decodeJwtPayload(trimmed);
  if (!payload) {
    return {
      ok: false,
      message:
        "SUPABASE_SERVICE_ROLE_KEY를 인식할 수 없습니다. Supabase → Settings → API에서 **Secret (sb_secret_…)** 또는 레거시 **service_role** JWT 한 줄 전체를 복사했는지 확인하세요. (앞뒤 따옴표·줄바꿈 제거)",
    };
  }
  const role = payload.role;
  if (role === "anon" || role === "authenticated") {
    return {
      ok: false,
      message:
        "SUPABASE_SERVICE_ROLE_KEY에 anon(또는 authenticated) 키가 들어가 있습니다. **Secret** 키(sb_secret_…) 또는 service_role JWT를 사용해야 합니다.",
    };
  }
  if (role !== "service_role") {
    return {
      ok: false,
      message: `SUPABASE_SERVICE_ROLE_KEY의 JWT role이 service_role이 아닙니다 (현재: ${String(role)}).`,
    };
  }
  return { ok: true };
}

/** service_role 우선, 없으면 예전처럼 anon 키로 시도 (Vercel에 service 키 없을 때) */
function resolveAdminSupabaseKey():
  | { ok: true; key: string; usingAnonFallback: boolean }
  | { ok: false; message: string } {
  const serviceKeyRaw = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const serviceKey =
    typeof serviceKeyRaw === "string" ? serviceKeyRaw.trim() : "";

  if (serviceKey) {
    const keyCheck = validateSupabaseServiceRoleKey(serviceKey);
    if (!keyCheck.ok) {
      return { ok: false, message: keyCheck.message };
    }
    return { ok: true, key: serviceKey, usingAnonFallback: false };
  }

  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  if (anonKey) {
    return { ok: true, key: anonKey, usingAnonFallback: true };
  }

  return {
    ok: false,
    message:
      "서버 환경 변수 NEXT_PUBLIC_SUPABASE_URL 및 (SUPABASE_SERVICE_ROLE_KEY 또는 NEXT_PUBLIC_SUPABASE_ANON_KEY)가 필요합니다. " +
      "삭제가 안 되면 Supabase → Settings → API → service_role secret을 SUPABASE_SERVICE_ROLE_KEY로 Vercel에 추가하세요.",
  };
}

export async function POST(request: NextRequest) {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
    if (!url) {
      return NextResponse.json(
        { error: "NEXT_PUBLIC_SUPABASE_URL 환경 변수가 필요합니다." },
        { status: 503 },
      );
    }

    const keyResult = resolveAdminSupabaseKey();
    if (!keyResult.ok) {
      return NextResponse.json({ error: keyResult.message }, { status: 503 });
    }

    const supabase = createClient(url, keyResult.key, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const body = await request.json();
    const { adminId, adminPw, type, ids } = body;

    if (adminId !== ADMIN_ID || adminPw !== ADMIN_PW) {
      return NextResponse.json({ error: "인증 실패" }, { status: 401 });
    }

    if (!type || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { error: "type과 ids 배열이 필요합니다." },
        { status: 400 }
      );
    }

    if (type !== "contact_messages" && type !== "applications") {
      return NextResponse.json({ error: "잘못된 타입입니다." }, { status: 400 });
    }

    const validIds = ids.filter(
      (id: unknown) => id != null && id !== "" && (typeof id === "number" || typeof id === "string")
    );
    if (validIds.length === 0) {
      return NextResponse.json({ error: "유효한 id가 없습니다." }, { status: 400 });
    }

    const { data, error } = await supabase
      .from(type)
      .delete()
      .in("id", validIds)
      .select("id");

    if (error) {
      console.error("Delete error:", error);
      const msg = error.message || "삭제 중 오류가 발생했습니다.";
      const isAuthKey =
        /invalid api key|jwt expired|invalid jwt|jwt/i.test(msg) ||
        (typeof error === "object" &&
          error !== null &&
          "code" in error &&
          (error as { code?: string }).code === "PGRST301");

      if (isAuthKey) {
        return NextResponse.json(
          {
            error:
              "Supabase가 API 키를 거부했습니다. SUPABASE_SERVICE_ROLE_KEY가 **이 프로젝트**의 service_role 키인지, 앞뒤 공백·따옴표 없이 붙여넣었는지 확인하세요. (NEXT_PUBLIC_SUPABASE_URL과 같은 프로젝트여야 합니다.)",
          },
          { status: 401 },
        );
      }

      return NextResponse.json({ error: msg }, { status: 500 });
    }

    const deletedCount = data?.length ?? 0;
    if (deletedCount === 0) {
      const anonHint = keyResult.usingAnonFallback
        ? " Vercel에 SUPABASE_SERVICE_ROLE_KEY(service_role)를 설정한 뒤 재배포해 주세요. anon 키만으로는 DB 정책(RLS) 때문에 삭제가 막힐 수 있습니다."
        : "";
      return NextResponse.json(
        {
          error:
            "삭제된 행이 없습니다. id가 DB와 일치하는지 확인하세요." + anonHint,
        },
        { status: 400 }
      );
    }

    return NextResponse.json({ ok: true, deleted: deletedCount });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "server error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
