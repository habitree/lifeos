/**
 * Supabase 클라이언트 초기화 테스트
 * 
 * 이 파일은 타입 체크 및 클라이언트 초기화를 검증합니다.
 * 실제 Supabase 연결 테스트는 환경 변수 설정 후 진행하세요.
 */

import { supabaseClient } from '../supabase-client';
import { supabaseServer } from '../supabase-server';

// 타입 체크: 클라이언트가 제대로 export 되는지 확인
export const testClientExport = supabaseClient;
export const testServerExport = supabaseServer;

// 타입 체크: Database 타입이 제대로 적용되는지 확인
export type TestDatabaseType = typeof supabaseClient;

/**
 * 클라이언트 초기화 확인
 * 
 * 실제 사용 시:
 * 1. .env.local 파일에 Supabase 환경 변수 설정
 * 2. 환경 변수가 없으면 에러가 발생합니다
 * 3. 환경 변수가 있으면 클라이언트가 정상적으로 초기화됩니다
 */
export function checkSupabaseClient() {
  try {
    // 클라이언트가 초기화되었는지 확인
    if (!supabaseClient) {
      throw new Error('Supabase client is not initialized');
    }
    
    // 서버 클라이언트가 초기화되었는지 확인
    if (!supabaseServer) {
      throw new Error('Supabase server client is not initialized');
    }
    
    return {
      client: true,
      server: true,
      message: 'Supabase clients initialized successfully',
    };
  } catch (error) {
    return {
      client: false,
      server: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

