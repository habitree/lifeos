# 작업 3: Supabase 클라이언트 설정

## 작업 개요
Supabase 클라이언트를 초기화하고 설정합니다. 이 작업은 API Routes와 동기화 서비스에서 사용됩니다.

## 목표
- Supabase 클라이언트 초기화
- 환경 변수 설정
- 클라이언트 및 서버용 클라이언트 분리
- 타입 안전성 확보

## 의존성
- 작업 1: 프로젝트 초기 설정 (완료 필요)
- 작업 2: 타입 정의 (완료 필요)

## 작업 내용

### 1. Supabase 클라이언트 생성 (`lib/supabase.ts`)
- 클라이언트 사이드 클라이언트
- 서버 사이드 클라이언트 (선택)
- 익명 사용자 지원 설정

### 2. 환경 변수 설정
- `.env.local` 예시 파일 생성
- `.env.example` 생성

### 3. 타입 생성 (선택)
- Supabase 타입 자동 생성 스크립트

## 결과물
- `lib/supabase.ts`
- `lib/supabase-client.ts` (클라이언트용)
- `lib/supabase-server.ts` (서버용, 선택)
- `.env.example`
- 환경 변수 설정 가이드

## 프롬프트

```
다음 요구사항에 따라 Supabase 클라이언트를 설정해주세요:

1. Supabase 클라이언트 생성 (lib/supabase.ts):
   - @supabase/supabase-js 사용
   - 환경 변수에서 URL과 Anon Key 읽기
   - 익명 사용자 지원 (로그인 없이 사용)
   - persistSession: false
   - autoRefreshToken: false
   - Realtime 설정 (eventsPerSecond: 10)

2. 클라이언트 및 서버 분리:
   - lib/supabase-client.ts: 클라이언트 컴포넌트용
   - lib/supabase-server.ts: 서버 컴포넌트/API Routes용 (선택)

3. 환경 변수 설정:
   - .env.local 예시 생성
   - .env.example 생성 (실제 키 제외)
   - NEXT_PUBLIC_SUPABASE_URL
   - NEXT_PUBLIC_SUPABASE_ANON_KEY

4. 타입 안전성:
   - Database 타입 정의 (작업 2에서 정의한 타입 사용)
   - 클라이언트에 타입 적용

참고 문서:
- software_design.md (섹션 5.3)
- Supabase 공식 문서
```

## 참고 문서
- [software_design.md](../../software_design.md) - 섹션 5.3 (Supabase 클라이언트 설정)
- [lifeos_PRD.md](../../lifeos_PRD.md) - 섹션 6.1.2 (Supabase)
- [Supabase Documentation](https://supabase.com/docs)

## 체크리스트
- [x] Supabase 클라이언트 생성 완료
- [x] 환경 변수 설정 완료
- [x] 클라이언트/서버 분리 완료
- [x] 타입 안전성 확보
- [x] .env.example 파일 생성
- [x] 클라이언트 초기화 테스트 완료

