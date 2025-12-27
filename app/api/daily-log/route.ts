/**
 * Daily Log API Route
 * Daily Log 조회, 생성, 업데이트
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase-server';
import type { DailyLog } from '@/types';

/**
 * GET: Daily Log 조회
 * Query: userId, date (YYYY-MM-DD)
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');
    const date = searchParams.get('date');

    if (!userId) {
      return NextResponse.json(
        { error: 'userId가 필요합니다.' },
        { status: 400 }
      );
    }

    if (!date) {
      return NextResponse.json(
        { error: 'date가 필요합니다. (YYYY-MM-DD 형식)' },
        { status: 400 }
      );
    }

    // UUID 형식 검증
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(userId)) {
      return NextResponse.json(
        { error: '유효하지 않은 userId 형식입니다.' },
        { status: 400 }
      );
    }

    // 날짜 형식 검증 (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      return NextResponse.json(
        { error: '유효하지 않은 date 형식입니다. (YYYY-MM-DD 형식이어야 합니다)' },
        { status: 400 }
      );
    }

    // Supabase에서 조회
    const { data, error } = await supabaseServer
      .from('daily_logs')
      .select('*')
      .eq('user_id', userId)
      .eq('log_date', date)
      .single();

    if (error) {
      // Daily Log가 없으면 null 반환
      if (error.code === 'PGRST116') {
        return NextResponse.json({ data: null }, { status: 200 });
      }

      return NextResponse.json(
        { error: `Daily Log 조회 실패: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    console.error('Daily Log API GET 오류:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

/**
 * POST: Daily Log 생성
 * Body: { userId, log }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, log } = body;

    if (!userId) {
      return NextResponse.json(
        { error: 'userId가 필요합니다.' },
        { status: 400 }
      );
    }

    if (!log) {
      return NextResponse.json(
        { error: 'log 데이터가 필요합니다.' },
        { status: 400 }
      );
    }

    // UUID 형식 검증
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(userId)) {
      return NextResponse.json(
        { error: '유효하지 않은 userId 형식입니다.' },
        { status: 400 }
      );
    }

    // Log 데이터 검증
    if (!log.id || !log.user_id || !log.log_date) {
      return NextResponse.json(
        { error: 'log.id, log.user_id, log.log_date가 필요합니다.' },
        { status: 400 }
      );
    }

    if (log.user_id !== userId) {
      return NextResponse.json(
        { error: 'userId와 log.user_id가 일치하지 않습니다.' },
        { status: 400 }
      );
    }

    // 날짜 형식 검증
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(log.log_date)) {
      return NextResponse.json(
        { error: '유효하지 않은 log_date 형식입니다. (YYYY-MM-DD 형식이어야 합니다)' },
        { status: 400 }
      );
    }

    // Supabase에 저장
    const insertData = {
      id: log.id,
      user_id: log.user_id,
      log_date: log.log_date,
      baseline_check: log.baseline_check || {
        sleep: false,
        movement: false,
        record: false,
      },
      one_line: log.one_line || '',
      body_state: log.body_state || null,
      memo: log.memo || null,
      created_at: log.created_at || new Date().toISOString(),
      updated_at: log.updated_at || new Date().toISOString(),
    };
    
    const { data, error } = await supabaseServer
      .from('daily_logs')
      .insert(insertData as any)
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: `Daily Log 생성 실패: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({ data }, { status: 201 });
  } catch (error) {
    console.error('Daily Log API POST 오류:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

/**
 * PUT: Daily Log 업데이트
 * Body: { userId, date, log }
 */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, date, log } = body;

    if (!userId) {
      return NextResponse.json(
        { error: 'userId가 필요합니다.' },
        { status: 400 }
      );
    }

    if (!date) {
      return NextResponse.json(
        { error: 'date가 필요합니다. (YYYY-MM-DD 형식)' },
        { status: 400 }
      );
    }

    if (!log) {
      return NextResponse.json(
        { error: 'log 데이터가 필요합니다.' },
        { status: 400 }
      );
    }

    // UUID 형식 검증
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(userId)) {
      return NextResponse.json(
        { error: '유효하지 않은 userId 형식입니다.' },
        { status: 400 }
      );
    }

    // 날짜 형식 검증
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      return NextResponse.json(
        { error: '유효하지 않은 date 형식입니다. (YYYY-MM-DD 형식이어야 합니다)' },
        { status: 400 }
      );
    }

    // Log 데이터 검증
    if (!log.id || !log.user_id || !log.log_date) {
      return NextResponse.json(
        { error: 'log.id, log.user_id, log.log_date가 필요합니다.' },
        { status: 400 }
      );
    }

    if (log.user_id !== userId || log.log_date !== date) {
      return NextResponse.json(
        { error: 'userId, date와 log의 user_id, log_date가 일치하지 않습니다.' },
        { status: 400 }
      );
    }

    // Supabase에 upsert
    const upsertData = {
      id: log.id,
      user_id: log.user_id,
      log_date: log.log_date,
      baseline_check: log.baseline_check || {
        sleep: false,
        movement: false,
        record: false,
      },
      one_line: log.one_line || '',
      body_state: log.body_state || null,
      memo: log.memo || null,
      updated_at: log.updated_at || new Date().toISOString(),
    };
    
    const { data, error } = await supabaseServer
      .from('daily_logs')
      .upsert(upsertData as any, {
        onConflict: 'user_id,log_date',
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: `Daily Log 업데이트 실패: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    console.error('Daily Log API PUT 오류:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

