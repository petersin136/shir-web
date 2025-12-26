// app/api/contact/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(url, anon);

export async function POST(req: Request) {
  try {
    const { name, email, message } = await req.json();

    // name과 message는 필수, email은 선택적
    if (
      !name ||
      !message ||
      typeof name !== "string" ||
      typeof message !== "string" ||
      (email !== undefined && email !== null && typeof email !== "string")
    ) {
      return NextResponse.json({ error: "invalid payload" }, { status: 400 });
    }

    // email이 없으면 빈 문자열 또는 기본값 사용
    const emailValue = email && typeof email === "string" ? email.trim() : "";

    const { error } = await supabase.from("contact_messages").insert({
      name,
      email: emailValue,
      message,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    const errorMessage = e instanceof Error ? e.message : "server error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
