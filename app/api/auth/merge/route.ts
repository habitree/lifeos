/**
 * 사용자 병합 API
 * 기존 로컬 사용자 데이터를 카카오 계정에 병합
 */

import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase-server-client';
import { supabaseServer } from '@/lib/supabase-server';
import type { User, Baseline, DailyLog } from '@/types';

/**
 * POST: 사용자 데이터 병합
 * Body: { localUserId: string }
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = createSupabaseServerClient();
    
    // 세션 확인
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError || !session?.user) {
      return NextResponse.json(
        { error: '인증되지 않은 사용자입니다.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { localUserId } = body;

    if (!localUserId) {
      return NextResponse.json(
        { error: 'localUserId가 필요합니다.' },
        { status: 400 }
      );
    }

    // 1. 카카오 계정의 users 테이블 레코드 확인
    const { data: authUserData, error: authUserError } = await supabaseServer
      .from('users')
      .select('*')
      .eq('auth_user_id', session.user.id)
      .single();

    if (authUserError && authUserError.code !== 'PGRST116') {
      return NextResponse.json(
        { error: `카카오 계정 조회 실패: ${authUserError.message}` },
        { status: 500 }
      );
    }

    if (!authUserData) {
      return NextResponse.json(
        { error: '카카오 계정을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // 2. 기존 로컬 사용자 데이터 조회
    const localUserResult = await supabaseServer
      .from('users')
      .select('*')
      .eq('id', localUserId)
      .single();
    const localUserData = localUserResult.data as User | null;
    const localUserError = localUserResult.error;

    if (localUserError || !localUserData) {
      // 로컬 사용자가 없으면 병합할 데이터 없음
      return NextResponse.json({
        success: true,
        message: '병합할 로컬 데이터가 없습니다.',
        mergedUser: authUserData as User,
      });
    }

    // 3. 기존 로컬 데이터 조회
    const { data: localBaselines } = await supabaseServer
      .from('baselines')
      .select('*')
      .eq('user_id', localUserId);

    const { data: localDailyLogs } = await supabaseServer
      .from('daily_logs')
      .select('*')
      .eq('user_id', localUserId)
      .order('log_date', { ascending: false });

    // 4. 사용자 정보 업데이트 (Phase 유지)
    const { data: updatedUser, error: updateUserError }: any = await (supabaseServer as any)
      .from('users')
      .update({
        current_phase: localUserData.current_phase,
        is_anonymous: false,
      })
      .eq('auth_user_id', session.user.id)
      .select()
      .single();

    if (updateUserError) {
      return NextResponse.json(
        { error: `사용자 업데이트 실패: ${updateUserError.message}` },
        { status: 500 }
      );
    }

    // 5. Baseline 병합
    let mergedBaseline: Baseline | null = null;
    if (localBaselines && localBaselines.length > 0) {
      const localBaseline = localBaselines[0] as Baseline;

      const { data: existingBaseline } = await supabaseServer
        .from('baselines')
        .select('*')
        .eq('user_id', (updatedUser as any).id)
        .single();

      if (existingBaseline) {
        // 업데이트
        const { data: updatedBaseline, error: baselineError } = await (supabaseServer as any)
          .from('baselines')
          .update({
            sleep: localBaseline.sleep,
            movement: localBaseline.movement,
            record: localBaseline.record,
            updated_at: localBaseline.updated_at,
          } as any)
          .eq('user_id', (updatedUser as any).id)
          .select()
          .single();

        if (!baselineError) {
          mergedBaseline = updatedBaseline as Baseline;
        }
      } else {
        // 생성
        const { data: newBaseline, error: baselineError } = await supabaseServer
          .from('baselines')
            .insert({
              user_id: (updatedUser as any).id,
              sleep: localBaseline.sleep,
            movement: localBaseline.movement,
            record: localBaseline.record,
            updated_at: localBaseline.updated_at,
          } as any)
          .select()
          .single();

        if (!baselineError) {
          mergedBaseline = newBaseline as Baseline;
        }
      }
    }

    // 6. DailyLogs 병합
    const mergedDailyLogs: DailyLog[] = [];
    if (localDailyLogs) {
      for (const localLog of localDailyLogs as DailyLog[]) {
        const { data: existingLog } = await supabaseServer
          .from('daily_logs')
          .select('*')
          .eq('user_id', (updatedUser as any).id)
          .eq('log_date', localLog.log_date)
          .single();

        if (existingLog) {
          const existingLogTyped = existingLog as DailyLog;
          // 업데이트
          const { data: updatedLog, error: logError } = await (supabaseServer as any)
            .from('daily_logs')
            .update({
              baseline_check: localLog.baseline_check,
              one_line: localLog.one_line,
              body_state: localLog.body_state,
              memo: localLog.memo,
              updated_at: localLog.updated_at,
            } as any)
            .eq('id', existingLogTyped.id)
            .select()
            .single();

          if (!logError && updatedLog) {
            mergedDailyLogs.push(updatedLog as DailyLog);
          }
        } else {
          // 생성
          const { data: newLog, error: logError } = await supabaseServer
            .from('daily_logs')
            .insert({
              user_id: (updatedUser as any).id,
              log_date: localLog.log_date,
              baseline_check: localLog.baseline_check,
              one_line: localLog.one_line,
              body_state: localLog.body_state,
              memo: localLog.memo,
              created_at: localLog.created_at,
              updated_at: localLog.updated_at,
            } as any)
            .select()
            .single();

          if (!logError && newLog) {
            mergedDailyLogs.push(newLog as DailyLog);
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      mergedUser: updatedUser as User,
      mergedBaseline,
      mergedDailyLogs,
    });
  } catch (error) {
    console.error('사용자 병합 API 오류:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : '서버 오류가 발생했습니다.',
      },
      { status: 500 }
    );
  }
}

