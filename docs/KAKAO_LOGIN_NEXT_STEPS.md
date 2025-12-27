# 카카오 로그인 통합 - 다음 단계 가이드

## ✅ 완료된 작업

- [x] 데이터베이스 마이그레이션 완료 (`migration_add_auth_columns.sql`)
- [x] 인증 관련 컬럼 추가 완료:
  - `auth_user_id` (Supabase Auth 사용자 ID)
  - `kakao_id` (카카오 사용자 ID)
  - `email` (이메일)
  - `nickname` (닉네임)
  - `profile_image` (프로필 이미지 URL)
  - `is_anonymous` (익명 사용자 여부)

## 📋 다음 단계

### 1단계: RLS 정책 설정 (필수)

**파일**: `supabase/rls.sql`

**실행 방법**:
1. Supabase 대시보드 > SQL Editor > New Query
2. `supabase/rls.sql` 파일 내용 복사 후 붙여넣기
3. Run 버튼 클릭

**확인**:
- "Success. No rows returned" 메시지 확인
- 오류 없이 완료 확인

### 2단계: 마이그레이션 확인

**확인 쿼리 실행**:

```sql
-- users 테이블의 모든 컬럼 확인
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'users'
AND column_name IN ('auth_user_id', 'kakao_id', 'email', 'nickname', 'profile_image', 'is_anonymous')
ORDER BY column_name;
```

**예상 결과**: 6개의 컬럼이 모두 표시되어야 합니다.

### 3단계: Supabase Auth 설정

#### 3.1 카카오 OAuth 제공자 설정

1. **Supabase 대시보드** > **Authentication** > **Providers**
2. **Kakao** 선택
3. 다음 정보 입력:
   - **Kakao Client ID**: 카카오 개발자 콘솔에서 발급받은 REST API 키
   - **Kakao Client Secret**: 카카오 개발자 콘솔에서 발급받은 Client Secret
   - **Redirect URL**: `https://[your-project-ref].supabase.co/auth/v1/callback`

#### 3.2 카카오 개발자 콘솔 설정

1. [카카오 개발자 콘솔](https://developers.kakao.com/) 접속
2. 내 애플리케이션 > 앱 설정 > 플랫폼
3. **Redirect URI** 추가:

   ```
   https://ckqfhacovakmaofcsxzy.supabase.co/auth/v1/callback
   https://[your-project-ref].supabase.co/auth/v1/callback
   ```
4. **REST API 키** 복사 (Supabase에 입력)

### 4단계: 환경 변수 설정

**로컬 개발 환경** (`.env.local`):

```env
# Supabase (기존)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# 카카오 OAuth (신규)
NEXT_PUBLIC_KAKAO_CLIENT_ID=your_kakao_client_id
KAKAO_CLIENT_SECRET=your_kakao_client_secret
```

**Vercel 배포 환경**:
1. Vercel 대시보드 > 프로젝트 > Settings > Environment Variables
2. 위의 환경 변수들을 모두 추가

### 5단계: 애플리케이션 테스트

#### 5.1 로컬 테스트

```bash
# 개발 서버 실행
npm run dev
```

**테스트 항목**:
1. 홈 화면 접속 확인
2. 로그인 페이지 접속 (`/login`)
3. 카카오 로그인 버튼 클릭
4. 카카오 로그인 완료 후 리다이렉트 확인
5. 사용자 프로필 표시 확인

#### 5.2 기능 테스트

- [ ] 익명 사용자로 데이터 저장 (기존 기능)
- [ ] 카카오 로그인
- [ ] 로그인 후 기존 데이터 병합 확인
- [ ] 로그아웃
- [ ] 재로그인 시 데이터 유지 확인

### 6단계: 배포

1. **GitHub에 커밋 및 푸시**
   ```bash
   git add .
   git commit -m "feat: 카카오 로그인 통합 완료"
   git push
   ```

2. **Vercel 자동 배포 확인**
   - GitHub Actions 또는 Vercel이 자동으로 배포합니다

3. **프로덕션 환경 변수 확인**
   - Vercel 대시보드에서 환경 변수가 올바르게 설정되었는지 확인

## 🔍 문제 해결

### 문제: RLS 정책 오류

**증상**: "column auth_user_id does not exist"

**해결**:
1. `migration_add_auth_columns.sql`이 성공적으로 실행되었는지 확인
2. 확인 쿼리로 컬럼 존재 여부 확인
3. 필요시 마이그레이션 재실행

### 문제: 카카오 로그인 실패

**확인 사항**:
1. Supabase Auth 설정에서 Kakao 제공자가 활성화되어 있는지
2. Redirect URL이 정확한지
3. 카카오 개발자 콘솔의 Redirect URI가 Supabase URL과 일치하는지
4. 환경 변수가 올바르게 설정되었는지

### 문제: 데이터 병합 실패

**확인 사항**:
1. 브라우저 콘솔에서 오류 메시지 확인
2. `/api/auth/merge` API 엔드포인트 로그 확인
3. Supabase 로그에서 SQL 오류 확인

## 📚 참고 문서

- `supabase/MIGRATION_GUIDE.md`: 마이그레이션 가이드
- `docs/ENV_SETUP.md`: 환경 변수 설정 가이드
- `docs/DEPLOYMENT.md`: 배포 가이드

## ✅ 체크리스트

- [ ] RLS 정책 설정 완료
- [ ] 마이그레이션 확인 완료
- [ ] Supabase Auth 카카오 제공자 설정 완료
- [ ] 카카오 개발자 콘솔 설정 완료
- [ ] 환경 변수 설정 완료 (로컬)
- [ ] 로컬 테스트 완료
- [ ] 환경 변수 설정 완료 (Vercel)
- [ ] 프로덕션 배포 완료
- [ ] 프로덕션 테스트 완료

