// app/api/upload/route.ts
import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const path = formData.get("path") as string;

    if (!file || !path) {
      return NextResponse.json({ error: "파일과 경로가 필요합니다." }, { status: 400 });
    }

    // 파일 확장자 추출
    const fileExt = file.name.split('.').pop();
    const fileName = `${path}.${fileExt}`;

    // 파일을 ArrayBuffer로 변환
    const fileBuffer = await file.arrayBuffer();

    // Supabase Storage에 업로드
    const { error: uploadError } = await supabase.storage
      .from('assets')
      .upload(fileName, fileBuffer, {
        contentType: file.type,
        upsert: true,
      });

    if (uploadError) {
      console.error("업로드 에러:", uploadError);
      throw uploadError;
    }

    // 공개 URL 생성
    const { data } = supabase.storage
      .from('assets')
      .getPublicUrl(fileName);

    return NextResponse.json({ 
      url: data.publicUrl,
      message: "파일이 성공적으로 업로드되었습니다."
    });

  } catch (error) {
    console.error("서버 에러:", error);
    return NextResponse.json(
      { error: "파일 업로드에 실패했습니다." },
      { status: 500 }
    );
  }
}
