import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    console.log('Environment check:', {
      hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      url: process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 20) + '...'
    });

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );

    // public.contact_messages 테이블에 간단한 쿼리로 DB 활성 상태 유지
    // 최근 1개 레코드만 조회 (실제 데이터는 사용하지 않음)
    const { data, error } = await supabase
      .from('contact_messages')
      .select('id')
      .limit(1);

    if (error) {
      console.error('❌ Ping error:', error);
      return NextResponse.json({
        ok: false,
        error: error.message,
        timestamp: new Date().toISOString()
      }, { status: 500 });
    }

    console.log('✅ Ping successful - DB active');
    return NextResponse.json({
      ok: true,
      dbActive: true,
      timestamp: new Date().toISOString(),
      queryResult: 'success',
      recordsChecked: data?.length || 0
    });

  } catch (err) {
    console.error('❌ Ping error:', err);
    return NextResponse.json({
      ok: false,
      error: err.message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

