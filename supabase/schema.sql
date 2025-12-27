-- ============================================
-- LIFE OS - Supabase 데이터베이스 스키마
-- ============================================
-- 이 파일은 Supabase SQL Editor에서 실행하세요.
-- Supabase 대시보드 > SQL Editor > New Query에서 실행

-- ============================================
-- 1. users 테이블
-- ============================================
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    current_phase INTEGER NOT NULL DEFAULT 1 CHECK (current_phase >= 1 AND current_phase <= 4),
    auth_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    kakao_id BIGINT UNIQUE,
    email TEXT,
    nickname TEXT,
    profile_image TEXT,
    is_anonymous BOOLEAN DEFAULT true
);

-- 익명 사용자 지원을 위한 인덱스
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);
CREATE INDEX IF NOT EXISTS idx_users_auth_user_id ON users(auth_user_id);
CREATE INDEX IF NOT EXISTS idx_users_kakao_id ON users(kakao_id);

COMMENT ON TABLE users IS '사용자 정보 테이블';
COMMENT ON COLUMN users.id IS '사용자 고유 ID (UUID)';
COMMENT ON COLUMN users.created_at IS '생성 일시';
COMMENT ON COLUMN users.current_phase IS '현재 Phase (1-4)';
COMMENT ON COLUMN users.auth_user_id IS 'Supabase Auth 사용자 ID';
COMMENT ON COLUMN users.kakao_id IS '카카오 사용자 ID';
COMMENT ON COLUMN users.email IS '이메일';
COMMENT ON COLUMN users.nickname IS '닉네임';
COMMENT ON COLUMN users.profile_image IS '프로필 이미지 URL';
COMMENT ON COLUMN users.is_anonymous IS '익명 사용자 여부';

-- ============================================
-- 2. baselines 테이블
-- ============================================
CREATE TABLE IF NOT EXISTS baselines (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    sleep TEXT NOT NULL DEFAULT '22:00-05:00',
    movement NUMERIC(5,2) NOT NULL DEFAULT 1.0,
    record TEXT NOT NULL DEFAULT '3줄',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

CREATE INDEX IF NOT EXISTS idx_baselines_user_id ON baselines(user_id);

COMMENT ON TABLE baselines IS 'Baseline (절대 기준) 정보 테이블';
COMMENT ON COLUMN baselines.user_id IS '사용자 ID (외래키)';
COMMENT ON COLUMN baselines.sleep IS '수면 시간 범위 (예: "22:00-05:00")';
COMMENT ON COLUMN baselines.movement IS '이동 거리 (단위: km)';
COMMENT ON COLUMN baselines.record IS '기록 기준 (예: "3줄")';

-- ============================================
-- 3. daily_logs 테이블
-- ============================================
CREATE TABLE IF NOT EXISTS daily_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    log_date DATE NOT NULL,
    baseline_check JSONB NOT NULL DEFAULT '{"sleep": false, "movement": false, "record": false}',
    one_line TEXT NOT NULL DEFAULT '',
    body_state TEXT CHECK (body_state IN ('good', 'normal', 'heavy')),
    memo TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, log_date)
);

CREATE INDEX IF NOT EXISTS idx_daily_logs_user_id ON daily_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_daily_logs_date ON daily_logs(log_date);
CREATE INDEX IF NOT EXISTS idx_daily_logs_user_date ON daily_logs(user_id, log_date);

COMMENT ON TABLE daily_logs IS '일일 로그 테이블';
COMMENT ON COLUMN daily_logs.user_id IS '사용자 ID (외래키)';
COMMENT ON COLUMN daily_logs.log_date IS '로그 날짜 (YYYY-MM-DD)';
COMMENT ON COLUMN daily_logs.baseline_check IS 'Baseline 체크 상태 (JSONB)';
COMMENT ON COLUMN daily_logs.one_line IS '오늘의 기준 한 줄';
COMMENT ON COLUMN daily_logs.body_state IS '몸 상태 (good, normal, heavy)';
COMMENT ON COLUMN daily_logs.memo IS '자유 메모';

-- ============================================
-- 4. updated_at 자동 업데이트 함수
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- baselines 테이블의 updated_at 자동 업데이트 트리거
CREATE TRIGGER update_baselines_updated_at
    BEFORE UPDATE ON baselines
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- daily_logs 테이블의 updated_at 자동 업데이트 트리거
CREATE TRIGGER update_daily_logs_updated_at
    BEFORE UPDATE ON daily_logs
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 5. 사용자 테이블 마이그레이션 (기존 테이블에 컬럼 추가)
-- ============================================
-- ⚠️ 주의: 기존 테이블이 있는 경우 migration_add_auth_columns.sql 파일을 별도로 실행하세요.
-- 이 부분은 CREATE TABLE IF NOT EXISTS로 테이블이 생성되지 않은 경우에만 실행됩니다.
-- 
-- 기존 테이블에 컬럼을 추가하려면:
-- migration_add_auth_columns.sql 파일을 실행하세요.

