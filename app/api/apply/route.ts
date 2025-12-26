// app/api/apply/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(url, anon);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, phone, email, church, reason } = body;

    // 필수 필드 및 타입 검증
    if (
      !name ||
      !phone ||
      !email ||
      !church ||
      !reason ||
      typeof name !== "string" ||
      typeof phone !== "string" ||
      typeof email !== "string" ||
      typeof church !== "string" ||
      typeof reason !== "string"
    ) {
      console.error("Invalid payload:", { name, phone, email, church, reason });
      return NextResponse.json(
        { error: "invalid payload" },
        { status: 400 }
      );
    }

    // applications 테이블에 데이터 삽입
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
      console.error("Supabase error:", error);
      console.error("Error details:", {
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
    const errorMessage = error instanceof Error ? error.message : "server error";
    console.error("API error:", error);
    console.error("Error message:", errorMessage);
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
