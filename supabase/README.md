# Supabase 데이터베이스 설정 파일

이 디렉토리에는 Supabase 데이터베이스 설정을 위한 SQL 파일들이 포함되어 있습니다.

## 파일 목록

- `schema.sql`: 데이터베이스 스키마 (테이블, 인덱스, 트리거)
- `rls.sql`: Row Level Security (RLS) 정책

## 사용 방법

### 1. Supabase 프로젝트 생성

1. [Supabase 대시보드](https://app.supabase.com)에 로그인
2. 새 프로젝트 생성
3. 프로젝트 URL과 API 키 확인

### 2. 스키마 실행

1. Supabase 대시보드 > SQL Editor > New Query
2. `schema.sql` 파일 내용 복사 후 실행
3. 테이블 생성 확인

### 3. RLS 정책 실행

1. SQL Editor > New Query
2. `rls.sql` 파일 내용 복사 후 실행
3. 정책 생성 확인

## 상세 가이드

자세한 설정 방법은 [Supabase 설정 가이드](../docs/SUPABASE_SETUP.md)를 참고하세요.

## 주의사항

- ⚠️ `schema.sql`을 먼저 실행한 후 `rls.sql`을 실행하세요
- ⚠️ 프로덕션 환경에서는 더 엄격한 RLS 정책을 고려하세요
- ⚠️ 데이터베이스 백업을 정기적으로 수행하세요

