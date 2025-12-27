/**
 * Supabase 클라이언트 (클라이언트 컴포넌트용)
 * 브라우저에서 실행되는 클라이언트 컴포넌트에서 사용
 */

import { createClient } from '@supabase/supabase-js';
import type { User, Baseline, DailyLog } from '../types';

// Supabase Database 타입 (향후 Supabase 타입 생성 시 확장 가능)
export interface Database {
  public: {
    Tables: {
      users: {
        Row: User;
        Insert: Omit<User, 'id' | 'created_at'>;
        Update: Partial<Omit<User, 'id' | 'created_at'>>;
      };
      baselines: {
        Row: Baseline;
        Insert: Omit<Baseline, 'id' | 'updated_at'>;
        Update: Partial<Omit<Baseline, 'id' | 'updated_at'>>;
      };
      daily_logs: {
        Row: DailyLog;
        Insert: Omit<DailyLog, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<DailyLog, 'id' | 'created_at' | 'updated_at'>>;
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
 * 클라이언트 사이드 Supabase 클라이언트
 * - persistSession: true - 세션 유지 활성화 (카카오 로그인 지원)
 * - autoRefreshToken: true - 토큰 자동 갱신
 * - detectSessionInUrl: true - URL에서 세션 감지 (OAuth 콜백 처리)
 * - Realtime: eventsPerSecond: 10 - 실시간 이벤트 제한
 */
export const supabaseClient = createClient<Database>(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      persistSession: true, // 세션 유지 활성화
      autoRefreshToken: true, // 토큰 자동 갱신
      detectSessionInUrl: true, // URL에서 세션 감지 (OAuth 콜백)
    },
    realtime: {
      params: {
        eventsPerSecond: 10,
      },
    },
  }
);

