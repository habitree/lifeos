/**
 * Baseline API Route
 * Baseline 조회 및 업데이트
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase-server';
import type { Baseline } from '@/types';

/**
 * GET: Baseline 조회
 * Query: userId
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'userId가 필요합니다.' },
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

    // Supabase에서 조회
    const { data, error } = await supabaseServer
      .from('baselines')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      // Baseline이 없으면 null 반환
      if (error.code === 'PGRST116') {
        return NextResponse.json({ data: null }, { status: 200 });
      }

      return NextResponse.json(
        { error: `Baseline 조회 실패: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    console.error('Baseline API GET 오류:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

/**
 * PUT: Baseline 업데이트
 * Body: { userId, baseline }
 */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, baseline } = body;

    if (!userId) {
      return NextResponse.json(
        { error: 'userId가 필요합니다.' },
        { status: 400 }
      );
    }

    if (!baseline) {
      return NextResponse.json(
        { error: 'baseline 데이터가 필요합니다.' },
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

    // Baseline 데이터 검증
    if (!baseline.id || !baseline.user_id) {
      return NextResponse.json(
        { error: 'baseline.id와 baseline.user_id가 필요합니다.' },
        { status: 400 }
      );
    }

    if (baseline.user_id !== userId) {
      return NextResponse.json(
        { error: 'userId와 baseline.user_id가 일치하지 않습니다.' },
        { status: 400 }
      );
    }

    // Supabase에 upsert
    const upsertData = {
      id: baseline.id,
      user_id: baseline.user_id,
      sleep: baseline.sleep,
      movement: baseline.movement,
      record: baseline.record,
      updated_at: baseline.updated_at || new Date().toISOString(),
    };
    
    const { data, error } = await supabaseServer
      .from('baselines')
      .upsert(upsertData as any, {
        onConflict: 'user_id',
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: `Baseline 업데이트 실패: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    console.error('Baseline API PUT 오류:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

