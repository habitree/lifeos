/**
 * OAuth 콜백 처리
 * Supabase Auth OAuth 콜백을 처리하고 사용자 병합 수행
 */

import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase-server-client';
import { userMergeService } from '@/services/UserMergeService';

/**
 * GET: OAuth 콜백 처리
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = createSupabaseServerClient();
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get('code');

    if (code) {
      // OAuth 코드를 세션으로 교환
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);

      if (error) {
        console.error('OAuth 콜백 오류:', error);
        return NextResponse.redirect(
          new URL(`/login?error=${encodeURIComponent(error.message)}`, requestUrl.origin)
        );
      }

      if (data.session?.user) {
        // 기존 로컬 사용자 ID 확인
        const localUserId = request.cookies.get('life-os:user-id')?.value || null;

        // 사용자 병합 (서버 사이드에서는 직접 처리하지 않고 클라이언트에서 처리)
        // 여기서는 세션만 설정하고 리다이렉트

        // 성공 시 홈으로 리다이렉트
        const response = NextResponse.redirect(new URL('/', requestUrl.origin));
        
        // 로컬 사용자 ID를 쿠키에 저장 (병합 시 사용)
        if (localUserId) {
          response.cookies.set('life-os:local-user-id', localUserId, {
            httpOnly: false,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24, // 24시간
          });
        }

        return response;
      }
    }

    // 에러 처리
    const error = requestUrl.searchParams.get('error');
    if (error) {
      return NextResponse.redirect(
        new URL(`/login?error=${encodeURIComponent(error)}`, requestUrl.origin)
      );
    }

    // 기본적으로 홈으로 리다이렉트
    return NextResponse.redirect(new URL('/', requestUrl.origin));
  } catch (error) {
    console.error('OAuth 콜백 처리 오류:', error);
    return NextResponse.redirect(
      new URL(
        `/login?error=${encodeURIComponent('인증 처리 중 오류가 발생했습니다.')}`,
        request.url
      )
    );
  }
}

