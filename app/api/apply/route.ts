// app/api/apply/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "잘못된 요청 형식입니다." },
        { status: 400 }
      );
    }

    const { name, phone, email, church, reason } =
      (body ?? {}) as Record<string, unknown>;

    if (
      typeof name !== "string" ||
      typeof phone !== "string" ||
      typeof email !== "string" ||
      typeof church !== "string" ||
      typeof reason !== "string" ||
      !name.trim() ||
      !phone.trim() ||
      !email.trim() ||
      !church.trim() ||
      !reason.trim()
    ) {
      return NextResponse.json(
        { error: "모든 필수 항목을 입력해주세요." },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("applications")
      .insert([
        {
          name,
          phone,
          email,
          church,
          reason,
          created_at: new Date().toISOString(),
        },
      ])
      .select();

    if (error) {
      console.error("Supabase error:", {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
      });
      return NextResponse.json(
        { error: error.message || "데이터 저장 중 오류가 발생했습니다." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "사역 신청이 성공적으로 저장되었습니다.", data },
      { status: 201 }
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "server error";
    console.error("API /apply error:", error);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
