# Supabase 설정 가이드

이 가이드는 LIFE OS 프로젝트를 위한 Supabase 설정 방법을 설명합니다.

## 목차

1. [Supabase 프로젝트 생성](#1-supabase-프로젝트-생성)
2. [환경 변수 설정](#2-환경-변수-설정)
3. [데이터베이스 스키마 설정](#3-데이터베이스-스키마-설정)
4. [RLS 정책 설정](#4-rls-정책-설정)
5. [설정 확인](#5-설정-확인)

---

## 1. Supabase 프로젝트 생성

### 1.1 프로젝트 생성

1. [Supabase 대시보드](https://app.supabase.com)에 로그인
2. **New Project** 클릭
3. 프로젝트 정보 입력:
   - **Name**: `life-os` (또는 원하는 이름)
   - **Database Password**: 강력한 비밀번호 설정 (저장해두세요)
   - **Region**: 가장 가까운 리전 선택
4. **Create new project** 클릭
5. 프로젝트 생성 완료 대기 (약 2-3분)

### 1.2 API 키 확인

프로젝트 생성 후:

1. **Settings** > **API** 메뉴로 이동
2. 다음 정보를 복사해두세요:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public** 키: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

---

## 2. 환경 변수 설정

### 2.1 .env.local 파일 생성

프로젝트 루트에 `.env.local` 파일을 생성합니다:

```bash
# Windows
type nul > .env.local

# Mac/Linux
touch .env.local
```

### 2.2 환경 변수 추가

`.env.local` 파일에 다음 내용을 추가하세요:

```env
# Supabase 프로젝트 URL
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co

# Supabase Anon (Public) Key
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

> ⚠️ **주의**: 실제 키 값으로 교체하세요!

### 2.3 환경 변수 확인

개발 서버를 재시작하여 환경 변수가 로드되는지 확인:

```bash
npm run dev
```

---

## 3. 데이터베이스 스키마 설정

### 3.1 SQL Editor 열기

1. Supabase 대시보드에서 프로젝트 선택
2. 왼쪽 메뉴에서 **SQL Editor** 클릭
3. **New Query** 클릭

### 3.2 스키마 실행

1. `supabase/schema.sql` 파일의 내용을 복사
2. SQL Editor에 붙여넣기
3. **Run** 버튼 클릭 (또는 `Ctrl+Enter` / `Cmd+Enter`)
4. 성공 메시지 확인

### 3.3 테이블 확인

1. 왼쪽 메뉴에서 **Table Editor** 클릭
2. 다음 테이블이 생성되었는지 확인:
   - `users`
   - `baselines`
   - `daily_logs`

---

## 4. RLS 정책 설정

### 4.1 RLS 정책 실행

1. SQL Editor에서 **New Query** 클릭
2. `supabase/rls.sql` 파일의 내용을 복사
3. SQL Editor에 붙여넣기
4. **Run** 버튼 클릭
5. 성공 메시지 확인

### 4.2 RLS 정책 확인

1. **Authentication** > **Policies** 메뉴로 이동
2. 각 테이블에 정책이 생성되었는지 확인:
   - `users`: "Users can access their own data"
   - `baselines`: "Users can access their own baselines"
   - `daily_logs`: "Users can access their own daily logs"

---

## 5. 설정 확인

### 5.1 연결 테스트

프로젝트에서 Supabase 연결을 테스트할 수 있습니다:

```typescript
// 테스트 파일 생성 (예: lib/test-connection.ts)
import { supabaseClient } from './supabase-client';

async function testConnection() {
  try {
    const { data, error } = await supabaseClient
      .from('users')
      .select('count');
    
    if (error) {
      console.error('Connection error:', error);
    } else {
      console.log('Connection successful!');
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

testConnection();
```

### 5.2 데이터베이스 구조 확인

Supabase 대시보드에서:

1. **Table Editor**에서 각 테이블의 구조 확인
2. **Database** > **Tables**에서 인덱스 확인
3. **SQL Editor**에서 다음 쿼리로 테스트:

```sql
-- 테이블 목록 확인
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';

-- users 테이블 구조 확인
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'users';
```

---

## 문제 해결

### 환경 변수가 로드되지 않는 경우

1. `.env.local` 파일이 프로젝트 루트에 있는지 확인
2. 파일 이름이 정확한지 확인 (`.env.local` - 점으로 시작)
3. 개발 서버를 재시작
4. 환경 변수 이름이 `NEXT_PUBLIC_`로 시작하는지 확인

### RLS 정책 오류

1. `schema.sql`이 먼저 실행되었는지 확인
2. SQL Editor에서 오류 메시지 확인
3. 기존 정책이 있는 경우 `DROP POLICY` 명령으로 삭제 후 재생성

### 연결 오류

1. Supabase 프로젝트가 활성화되어 있는지 확인
2. API 키가 올바른지 확인
3. 네트워크 연결 확인
4. Supabase 대시보드에서 프로젝트 상태 확인

---

## 다음 단계

설정이 완료되면:

1. ✅ 로컬 저장소 서비스 구현 (작업 4)
2. ✅ 동기화 서비스 구현 (작업 5)
3. ✅ API Routes 구현 (작업 13)

---

## 참고 자료

- [Supabase 공식 문서](https://supabase.com/docs)
- [Row Level Security 가이드](https://supabase.com/docs/guides/auth/row-level-security)
- [프로젝트 환경 변수 설정](./ENV_SETUP.md)

