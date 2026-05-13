// app/api/contact/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) return null;
  return createClient(url, anon);
}

export async function POST(req: Request) {
  try {
    const supabase = getSupabase();
    if (!supabase) {
      console.error(
        "Supabase env vars missing: NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY"
      );
      return NextResponse.json(
        {
          error:
            "서버 설정 오류입니다. 잠시 후 다시 시도해 주세요. (env not configured)",
        },
        { status: 500 }
      );
    }

    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { error: "잘못된 요청 형식입니다." },
        { status: 400 }
      );
    }

    const { name, email, message } = (body ?? {}) as Record<string, unknown>;

    if (
      typeof name !== "string" ||
      typeof message !== "string" ||
      !name.trim() ||
      !message.trim() ||
      (email !== undefined && email !== null && typeof email !== "string")
    ) {
      return NextResponse.json({ error: "invalid payload" }, { status: 400 });
    }

    const emailValue = typeof email === "string" ? email.trim() : "";

    const { error } = await supabase.from("contact_messages").insert({
      name,
      email: emailValue,
      message,
    });

    if (error) {
      console.error("Supabase error (contact):", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    const errorMessage = e instanceof Error ? e.message : "server error";
    console.error("API /contact error:", e);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
