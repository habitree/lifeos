-- ============================================
-- LIFE OS - Row Level Security (RLS) 정책
-- ============================================
-- 이 파일은 schema.sql 실행 후 실행하세요.
-- Supabase 대시보드 > SQL Editor > New Query에서 실행

-- ============================================
-- 1. users 테이블 RLS 정책
-- ============================================
-- RLS 활성화
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- 기존 정책 삭제 (있는 경우)
DROP POLICY IF EXISTS "Users can access their own data" ON users;
DROP POLICY IF EXISTS "Allow anonymous access to users" ON users;

-- 익명 사용자 포함 모든 사용자가 자신의 데이터에 접근 가능
-- auth.uid() = id: 인증된 사용자는 자신의 데이터만
-- auth.role() = 'anon': 익명 사용자는 모든 데이터 접근 가능 (로컬에서 user_id로 필터링)
CREATE POLICY "Users can access their own data"
    ON users
    FOR ALL
    USING (
        auth.uid() = id OR 
        auth.role() = 'anon'
    )
    WITH CHECK (
        auth.uid() = id OR 
        auth.role() = 'anon'
    );

-- ============================================
-- 2. baselines 테이블 RLS 정책
-- ============================================
-- RLS 활성화
ALTER TABLE baselines ENABLE ROW LEVEL SECURITY;

-- 기존 정책 삭제 (있는 경우)
DROP POLICY IF EXISTS "Users can access their own baselines" ON baselines;
DROP POLICY IF EXISTS "Allow anonymous access to baselines" ON baselines;

-- 익명 사용자 포함 모든 사용자가 자신의 baseline에 접근 가능
CREATE POLICY "Users can access their own baselines"
    ON baselines
    FOR ALL
    USING (
        auth.uid() = user_id OR 
        auth.role() = 'anon'
    )
    WITH CHECK (
        auth.uid() = user_id OR 
        auth.role() = 'anon'
    );

-- ============================================
-- 3. daily_logs 테이블 RLS 정책
-- ============================================
-- RLS 활성화
ALTER TABLE daily_logs ENABLE ROW LEVEL SECURITY;

-- 기존 정책 삭제 (있는 경우)
DROP POLICY IF EXISTS "Users can access their own daily logs" ON daily_logs;
DROP POLICY IF EXISTS "Allow anonymous access to daily logs" ON daily_logs;

-- 익명 사용자 포함 모든 사용자가 자신의 daily_logs에 접근 가능
CREATE POLICY "Users can access their own daily logs"
    ON daily_logs
    FOR ALL
    USING (
        auth.uid() = user_id OR 
        auth.role() = 'anon'
    )
    WITH CHECK (
        auth.uid() = user_id OR 
        auth.role() = 'anon'
    );

-- ============================================
-- 참고사항
-- ============================================
-- 이 RLS 정책은 익명 사용자(anon)도 모든 데이터에 접근할 수 있도록 설정되어 있습니다.
-- 실제 데이터 필터링은 애플리케이션 레벨에서 user_id를 사용하여 수행됩니다.
-- 
-- 보안 고려사항:
-- - 클라이언트에서 항상 user_id를 포함하여 쿼리해야 합니다
-- - 서버 사이드에서 추가 검증을 권장합니다
-- - 프로덕션 환경에서는 더 엄격한 정책을 고려하세요

