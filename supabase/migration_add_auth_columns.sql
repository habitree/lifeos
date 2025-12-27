-- ============================================
-- 마이그레이션: users 테이블에 인증 관련 컬럼 추가
-- ============================================
-- 이 파일은 기존 users 테이블이 있는 경우 실행하세요.
-- schema.sql을 처음 실행하는 경우에는 이 파일이 필요 없습니다.
-- 
-- 실행 순서:
-- 1. schema.sql (또는 이미 테이블이 있다면 이 파일)
-- 2. rls.sql
-- ============================================

-- users 테이블에 인증 관련 컬럼 추가
-- 각 컬럼을 개별 DO 블록으로 분리하여 안전하게 추가
-- 1. auth_user_id 컬럼 추가
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'users' 
        AND column_name = 'auth_user_id'
    ) THEN
        ALTER TABLE users 
        ADD COLUMN auth_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;
    END IF;
END $$;

-- 2. kakao_id 컬럼 추가
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'users' 
        AND column_name = 'kakao_id'
    ) THEN
        ALTER TABLE users 
        ADD COLUMN kakao_id BIGINT;
        
        -- UNIQUE 제약조건 추가 (이미 존재하면 에러 무시)
        BEGIN
            ALTER TABLE users 
            ADD CONSTRAINT users_kakao_id_unique UNIQUE (kakao_id);
        EXCEPTION WHEN duplicate_object THEN
            NULL;
        END;
    END IF;
END $$;

-- 3. email 컬럼 추가
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'users' 
        AND column_name = 'email'
    ) THEN
        ALTER TABLE users 
        ADD COLUMN email TEXT;
    END IF;
END $$;

-- 4. nickname 컬럼 추가
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'users' 
        AND column_name = 'nickname'
    ) THEN
        ALTER TABLE users 
        ADD COLUMN nickname TEXT;
    END IF;
END $$;

-- 5. profile_image 컬럼 추가
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'users' 
        AND column_name = 'profile_image'
    ) THEN
        ALTER TABLE users 
        ADD COLUMN profile_image TEXT;
    END IF;
END $$;

-- 6. is_anonymous 컬럼 추가 (UPDATE 포함)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'users' 
        AND column_name = 'is_anonymous'
    ) THEN
        ALTER TABLE users 
        ADD COLUMN is_anonymous BOOLEAN DEFAULT true;
        
        -- 기존 데이터의 is_anonymous 기본값 설정
        UPDATE users 
        SET is_anonymous = true 
        WHERE is_anonymous IS NULL;
    END IF;
END $$;

-- 인덱스 추가 (이미 존재하면 무시)
CREATE INDEX IF NOT EXISTS idx_users_auth_user_id ON users(auth_user_id);
CREATE INDEX IF NOT EXISTS idx_users_kakao_id ON users(kakao_id);

-- 7. 컬럼 코멘트 추가
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'users' 
        AND column_name = 'auth_user_id'
    ) THEN
        COMMENT ON COLUMN users.auth_user_id IS 'Supabase Auth 사용자 ID';
    END IF;
    
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'users' 
        AND column_name = 'kakao_id'
    ) THEN
        COMMENT ON COLUMN users.kakao_id IS '카카오 사용자 ID';
    END IF;
    
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'users' 
        AND column_name = 'email'
    ) THEN
        COMMENT ON COLUMN users.email IS '이메일';
    END IF;
    
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'users' 
        AND column_name = 'nickname'
    ) THEN
        COMMENT ON COLUMN users.nickname IS '닉네임';
    END IF;
    
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'users' 
        AND column_name = 'profile_image'
    ) THEN
        COMMENT ON COLUMN users.profile_image IS '프로필 이미지 URL';
    END IF;
    
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'users' 
        AND column_name = 'is_anonymous'
    ) THEN
        COMMENT ON COLUMN users.is_anonymous IS '익명 사용자 여부';
    END IF;
END $$;

