// app/api/manage/delete-rows/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const ADMIN_ID = "shiradmin";
const ADMIN_PW = "shir2025!";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(url, serviceKey);

export async function POST(request: NextRequest) {
  try {
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

    const { error } = await supabase
      .from(type)
      .delete()
      .in("id", validIds);

    if (error) {
      console.error("Delete error:", error);
      const hint =
        !process.env.SUPABASE_SERVICE_ROLE_KEY && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
          ? " (SUPABASE_SERVICE_ROLE_KEY가 설정되어 있는지 확인해주세요)"
          : "";
      return NextResponse.json(
        { error: (error.message || "삭제 중 오류가 발생했습니다.") + hint },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true, deleted: validIds.length });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "server error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
