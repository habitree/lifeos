/**
 * Sync API Route
 * 동기화 요청 및 상태 확인
 * 인증된 사용자는 세션에서 userId 확인, 익명 사용자는 기존 로직 유지
 */

import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase-server-client';
import { supabaseServer } from '@/lib/supabase-server';
import type { LocalData } from '@/types/services';

/**
 * POST: 동기화 요청
 * Body: { userId?, localData }
 * 로컬 우선 원칙: 로컬 데이터가 우선
 * 인증된 사용자는 세션에서 userId 확인
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = createSupabaseServerClient();
    
    // 세션 확인
    const { data: { session } } = await supabase.auth.getSession();
    
    const body = await request.json();
    let { userId, localData } = body;

    // 인증된 사용자가 있으면 세션에서 userId 가져오기
    if (session?.user) {
      const { data: authUserData } = await supabaseServer
        .from('users')
        .select('id')
        .eq('auth_user_id', session.user.id)
        .single();

      if (authUserData) {
        userId = (authUserData as { id: string }).id;
      }
    }

    if (!userId) {
      return NextResponse.json(
        { error: 'userId가 필요합니다.' },
        { status: 400 }
      );
    }

    if (!localData) {
      return NextResponse.json(
        { error: 'localData가 필요합니다.' },
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

    const errors: string[] = [];

    // 1. User 동기화
    if (localData.user) {
      if (localData.user.id !== userId) {
        return NextResponse.json(
          { error: 'userId와 localData.user.id가 일치하지 않습니다.' },
          { status: 400 }
        );
      }

      const { error: userError } = await supabaseServer
        .from('users')
        .upsert({
          id: localData.user.id,
          created_at: localData.user.created_at,
          current_phase: localData.user.current_phase,
        } as any);

      if (userError) {
        errors.push(`User 동기화 실패: ${userError.message}`);
      }
    }

    // 2. Baseline 동기화
    if (localData.baseline) {
      if (localData.baseline.user_id !== userId) {
        return NextResponse.json(
          { error: 'userId와 localData.baseline.user_id가 일치하지 않습니다.' },
          { status: 400 }
        );
      }

      const { error: baselineError } = await supabaseServer
        .from('baselines')
        .upsert({
          id: localData.baseline.id,
          user_id: localData.baseline.user_id,
          sleep: localData.baseline.sleep,
          movement: localData.baseline.movement,
          record: localData.baseline.record,
          updated_at: localData.baseline.updated_at,
        } as any, {
          onConflict: 'user_id',
        });

      if (baselineError) {
        errors.push(`Baseline 동기화 실패: ${baselineError.message}`);
      }
    }

    // 3. DailyLogs 동기화
    const dailyLogErrors: string[] = [];
    if (localData.dailyLogs && Array.isArray(localData.dailyLogs)) {
      for (const log of localData.dailyLogs) {
        if (log.user_id !== userId) {
          dailyLogErrors.push(`DailyLog ${log.id}: user_id 불일치`);
          continue;
        }

        const { error: logError } = await supabaseServer
          .from('daily_logs')
          .upsert({
            id: log.id,
            user_id: log.user_id,
            log_date: log.log_date,
            baseline_check: log.baseline_check,
            one_line: log.one_line,
            body_state: log.body_state,
            memo: log.memo,
            created_at: log.created_at,
            updated_at: log.updated_at,
          } as any, {
            onConflict: 'user_id,log_date',
          });

        if (logError) {
          dailyLogErrors.push(`DailyLog ${log.id}: ${logError.message}`);
        }
      }
    }

    if (dailyLogErrors.length > 0) {
      errors.push(`DailyLogs 동기화 오류: ${dailyLogErrors.join(', ')}`);
    }

    // 에러가 있으면 부분 성공으로 반환
    if (errors.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: errors.join('; '),
          partial: true,
        },
        { status: 207 } // Multi-Status
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: '동기화가 완료되었습니다.',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Sync API POST 오류:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

/**
 * GET: 동기화 상태 확인
 * Query: userId (선택, 인증된 사용자는 세션에서 가져옴)
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = createSupabaseServerClient();
    
    // 세션 확인
    const { data: { session } } = await supabase.auth.getSession();
    
    const searchParams = request.nextUrl.searchParams;
    let userId = searchParams.get('userId');

    // 인증된 사용자가 있으면 세션에서 userId 가져오기
    if (session?.user && !userId) {
      const { data: authUserData } = await supabaseServer
        .from('users')
        .select('id')
        .eq('auth_user_id', session.user.id)
        .single();

      if (authUserData) {
        userId = (authUserData as { id: string }).id;
      }
    }

    // userId가 제공되면 해당 사용자의 마지막 동기화 시간 확인
    if (userId) {
      // UUID 형식 검증
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(userId)) {
        return NextResponse.json(
          { error: '유효하지 않은 userId 형식입니다.' },
          { status: 400 }
        );
      }

      // 사용자의 마지막 업데이트 시간 확인
      const [userResult, baselineResult, dailyLogsResult] = await Promise.all([
        supabaseServer
          .from('users')
          .select('created_at')
          .eq('id', userId)
          .single() as any,
        supabaseServer
          .from('baselines')
          .select('updated_at')
          .eq('user_id', userId)
          .single() as any,
        supabaseServer
          .from('daily_logs')
          .select('updated_at')
          .eq('user_id', userId)
          .order('updated_at', { ascending: false })
          .limit(1) as any,
      ]);

      const lastSyncTimes = [
        (userResult.data as any)?.created_at,
        (baselineResult.data as any)?.updated_at,
        (dailyLogsResult.data as any)?.[0]?.updated_at,
      ].filter(Boolean) as string[];

      const lastSyncAt = lastSyncTimes.length > 0
        ? lastSyncTimes.sort().reverse()[0]
        : null;

      return NextResponse.json({
        status: 'idle',
        lastSyncAt,
        hasData: {
          user: !!userResult.data,
          baseline: !!baselineResult.data,
          dailyLogs: (dailyLogsResult.data?.length || 0) > 0,
        },
      });
    }

    // userId가 없으면 일반 동기화 상태 반환
    return NextResponse.json({
      status: 'idle',
      message: '동기화 서비스가 실행 중입니다.',
    });
  } catch (error) {
    console.error('Sync API GET 오류:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

