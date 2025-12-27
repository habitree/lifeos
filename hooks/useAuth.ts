/**
 * useAuth 훅
 * 인증 상태 확인 및 로그인/로그아웃 함수 제공
 */

'use client';

import { useAuth as useAuthContext } from '@/contexts/AuthContext';

/**
 * useAuth 훅
 * AuthContext를 사용하기 위한 편의 훅
 */
export function useAuth() {
  return useAuthContext();
}

