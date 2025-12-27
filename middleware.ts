/**
 * Next.js Middleware
 * 라우트 보호 및 인증 리다이렉트
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * 보호된 라우트 목록 (인증 필요)
 * 현재는 모든 라우트를 선택적으로 보호 (필요시 추가)
 */
const protectedRoutes: string[] = [
  // 예: '/dashboard', '/settings'
];

/**
 * 공개 라우트 목록 (인증 불필요)
 */
const publicRoutes: string[] = [
  '/login',
  '/api/auth',
];

/**
 * 미들웨어 실행
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 공개 라우트는 통과
  if (publicRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // 보호된 라우트 체크 (현재는 비활성화)
  // 실제로는 세션 쿠키를 확인하여 인증 여부 판단
  // const session = request.cookies.get('sb-access-token');
  // if (protectedRoutes.some((route) => pathname.startsWith(route)) && !session) {
  //   return NextResponse.redirect(new URL('/login', request.url));
  // }

  return NextResponse.next();
}

/**
 * 미들웨어가 실행될 경로
 */
export const config = {
  matcher: [
    /*
     * 다음 경로를 제외한 모든 요청 경로와 일치:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};

