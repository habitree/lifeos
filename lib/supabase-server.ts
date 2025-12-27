/**
 * Supabase 클라이언트 (서버 컴포넌트/API Routes용)
 * Next.js 서버 사이드에서 실행되는 컴포넌트 및 API Routes에서 사용
 */

import { createClient } from '@supabase/supabase-js';
import type { User, Baseline, DailyLog } from '../types';

// Supabase Database 타입 (향후 Supabase 타입 생성 시 확장 가능)
export interface Database {
  public: {
    Tables: {
      users: {
        Row: User;
        Insert: any;
        Update: any;
      };
      baselines: {
        Row: Baseline;
        Insert: any;
        Update: any;
      };
      daily_logs: {
        Row: DailyLog;
        Insert: any;
        Update: any;
      };
    };
  };
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Please check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your .env.local file.'
  );
}

/**
 * 서버 사이드 Supabase 클라이언트 (레거시)
 * - API Routes에서 사용 (쿠키 기반 세션 미지원)
 * - 익명 사용자 지원
 * - 주의: 세션 관리가 필요한 경우 createSupabaseServerClient() 사용 권장
 * 
 * @deprecated 세션 관리가 필요한 경우 lib/supabase-server-client.ts의 createSupabaseServerClient() 사용
 */
export const supabaseServer = createClient<Database>(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
    realtime: {
      params: {
        eventsPerSecond: 10,
      },
    },
  }
);

