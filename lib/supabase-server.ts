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
        Insert: Omit<User, 'id' | 'created_at'>;
        Update: Partial<Omit<User, 'id' | 'created_at'>>;
      };
      baselines: {
        Row: Baseline;
        Insert: Baseline;
        Update: Partial<Baseline>;
      };
      daily_logs: {
        Row: DailyLog;
        Insert: DailyLog;
        Update: Partial<DailyLog>;
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
 * 서버 사이드 Supabase 클라이언트
 * - API Routes 및 Server Components에서 사용
 * - 익명 사용자 지원 (로그인 없이 사용)
 * - persistSession: false
 * - autoRefreshToken: false
 */
export const supabaseServer = createClient<Database>(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      persistSession: false, // 로그인 없이 사용
      autoRefreshToken: false,
    },
    realtime: {
      params: {
        eventsPerSecond: 10,
      },
    },
  }
);

