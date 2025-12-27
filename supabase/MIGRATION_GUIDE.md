# 데이터베이스 마이그레이션 가이드

## 상황별 실행 순서

### 시나리오 1: 처음 데이터베이스 설정 (테이블이 없는 경우)

1. **schema.sql** 실행
   - 모든 테이블과 컬럼이 생성됩니다
   - `auth_user_id` 컬럼이 포함되어 있습니다

2. **rls.sql** 실행
   - RLS 정책이 설정됩니다

### 시나리오 2: 기존 데이터베이스에 인증 기능 추가 (테이블이 이미 있는 경우)

1. **migration_add_auth_columns.sql** 실행
   - 기존 `users` 테이블에 인증 관련 컬럼을 추가합니다
   - 안전하게 실행 가능 (이미 컬럼이 있으면 스킵)

2. **rls.sql** 실행
   - RLS 정책이 업데이트됩니다

## 오류 해결

### 오류: "column auth_user_id does not exist"

이 오류가 발생하면:

1. **현재 users 테이블 구조 확인**
   ```sql
   SELECT column_name, data_type 
   FROM information_schema.columns 
   WHERE table_name = 'users';
   ```

2. **마이그레이션 실행**
   - `migration_add_auth_columns.sql` 파일을 실행하세요
   - 이 파일은 컬럼이 이미 있는지 확인하고 안전하게 추가합니다

3. **RLS 정책 실행**
   - 마이그레이션 후 `rls.sql`을 실행하세요

## 실행 방법

### Supabase 대시보드에서 실행

1. [Supabase 대시보드](https://app.supabase.com)에 로그인
2. 프로젝트 선택
3. **SQL Editor** 메뉴로 이동
4. **New Query** 클릭
5. 해당 SQL 파일 내용을 복사하여 붙여넣기
6. **Run** 버튼 클릭

### 실행 순서 체크리스트

- [ ] `migration_add_auth_columns.sql` 실행 완료
- [ ] `rls.sql` 실행 완료
- [ ] 오류 없이 완료 확인

## 확인 쿼리

마이그레이션이 성공했는지 확인:

```sql
-- users 테이블의 모든 컬럼 확인
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'users'
ORDER BY ordinal_position;

-- auth_user_id 컬럼이 있는지 확인
SELECT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'users' AND column_name = 'auth_user_id'
) AS has_auth_user_id;
```

