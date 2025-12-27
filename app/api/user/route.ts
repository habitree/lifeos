/**
 * User API Route
 * 사용자 정보 조회 및 생성
 * 인증된 사용자는 auth_user_id로 조회, 익명 사용자는 기존 로직 유지
 */

import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase-server-client';
import { supabaseServer } from '@/lib/supabase-server';
import type { User } from '@/types';

/**
 * GET: 사용자 정보 조회
 * Query: userId (선택적, 인증된 사용자는 세션에서 가져옴)
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = createSupabaseServerClient();
    
    // 세션 확인
    const { data: { session } } = await supabase.auth.getSession();
    
    let userId: string | null = null;
    let user: User | null = null;

    // 인증된 사용자가 있으면 auth_user_id로 조회
    if (session?.user) {
      const { data: authUserData, error: authUserError } = await supabaseServer
        .from('users')
        .select('*')
        .eq('auth_user_id', session.user.id)
        .single();

      if (authUserError && authUserError.code !== 'PGRST116') {
        return NextResponse.json(
          { error: `사용자 조회 실패: ${authUserError.message}` },
          { status: 500 }
        );
      }

      if (authUserData) {
        return NextResponse.json({ data: authUserData }, { status: 200 });
      }
    }

    // 익명 사용자 또는 userId 쿼리 파라미터로 조회
    const searchParams = request.nextUrl.searchParams;
    userId = searchParams.get('userId');

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
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      // 사용자가 없으면 생성 후 반환
      if (error.code === 'PGRST116') {
        // 새 사용자 생성
        const newUser: Omit<User, 'id' | 'created_at'> = {
          current_phase: 1,
          is_anonymous: true,
        };

        const { data: createdUser, error: createError } = await supabaseServer
          .from('users')
          .insert({
            id: userId,
            ...newUser,
          } as any)
          .select()
          .single();

        if (createError) {
          return NextResponse.json(
            { error: `사용자 생성 실패: ${createError.message}` },
            { status: 500 }
          );
        }

        return NextResponse.json({ data: createdUser }, { status: 200 });
      }

      return NextResponse.json(
        { error: `사용자 조회 실패: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    console.error('User API GET 오류:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

/**
 * POST: 사용자 생성
 * Body: { userId?, currentPhase? }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, currentPhase = 1 } = body;

    // userId가 없으면 UUID 생성
    let finalUserId = userId;
    if (!finalUserId) {
      // UUID v4 생성
      finalUserId = crypto.randomUUID();
    }

    // UUID 형식 검증
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(finalUserId)) {
      return NextResponse.json(
        { error: '유효하지 않은 userId 형식입니다.' },
        { status: 400 }
      );
    }

    // Phase 유효성 검사
    if (currentPhase < 1 || currentPhase > 4) {
      return NextResponse.json(
        { error: 'currentPhase는 1-4 사이의 값이어야 합니다.' },
        { status: 400 }
      );
    }

    // Supabase에 저장
    const { data, error } = await supabaseServer
      .from('users')
      .insert({
        id: finalUserId,
        current_phase: currentPhase,
        is_anonymous: true,
      } as any)
      .select()
      .single();

    if (error) {
      // 이미 존재하는 경우 조회하여 반환
      if (error.code === '23505') {
        const { data: existingUser } = await supabaseServer
          .from('users')
          .select('*')
          .eq('id', finalUserId)
          .single();

        if (existingUser) {
          return NextResponse.json({ data: existingUser }, { status: 200 });
        }
      }

      return NextResponse.json(
        { error: `사용자 생성 실패: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({ data }, { status: 201 });
  } catch (error) {
    console.error('User API POST 오류:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

