/**
 * Supabase 클라이언트 통합 Export
 * 
 * 사용 가이드:
 * - 클라이언트 컴포넌트: lib/supabase-client.ts의 supabaseClient 사용
 * - 서버 컴포넌트/API Routes: lib/supabase-server.ts의 supabaseServer 사용
 */

// 클라이언트 컴포넌트용 (브라우저에서 실행)
export { supabaseClient } from './supabase-client';
export type { Database as DatabaseClient } from './supabase-client';

// 서버 컴포넌트/API Routes용 (서버에서 실행)
export { supabaseServer } from './supabase-server';
export type { Database as DatabaseServer } from './supabase-server';

