/**
 * Supabase 서버 클라이언트 (쿠키 기반 세션 관리)
 * Next.js App Router의 서버 컴포넌트 및 API Routes에서 사용
 * 쿠키를 통한 세션 관리 지원
 */

import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { User, Baseline, DailyLog } from '../types';

// Supabase Database 타입
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
 * 서버 사이드 Supabase 클라이언트 생성
 * 쿠키를 통한 세션 관리
 */
export function createSupabaseServerClient() {
  const cookieStore = cookies();

  return createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        try {
          cookieStore.set({ name, value, ...options });
        } catch (error) {
          // 쿠키 설정 실패 시 무시 (서버 컴포넌트에서만 발생 가능)
        }
      },
      remove(name: string, options: CookieOptions) {
        try {
          cookieStore.set({ name, value: '', ...options });
        } catch (error) {
          // 쿠키 삭제 실패 시 무시
        }
      },
    },
  });
}

