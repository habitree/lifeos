# 환경 변수 설정 가이드

## Supabase 설정

이 프로젝트는 Supabase를 백엔드로 사용합니다. 환경 변수를 설정해야 합니다.

> 📖 **상세 가이드**: [Supabase 설정 가이드](./SUPABASE_SETUP.md)를 참고하세요.

### 1. .env.local 파일 생성

프로젝트 루트에 `.env.local` 파일을 생성하고 다음 내용을 추가하세요:

```env
# Supabase 프로젝트 URL
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co

# Supabase Anon (Public) Key
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

> 💡 **참고**: 프로젝트 루트에 `.env.example` 파일이 있습니다. 이를 참고하여 `.env.local` 파일을 생성하세요.

### 2. Supabase 키 찾기

1. [Supabase 대시보드](https://app.supabase.com)에 로그인
2. 프로젝트 선택
3. Settings > API 메뉴로 이동
4. **Project URL**을 `NEXT_PUBLIC_SUPABASE_URL`에 복사
5. **Project API keys** 섹션에서 **anon public** 키를 `NEXT_PUBLIC_SUPABASE_ANON_KEY`에 복사

### 3. 환경 변수 확인

환경 변수가 제대로 설정되었는지 확인:

```bash
# 개발 서버 실행 시 환경 변수 로드 확인
npm run dev
```

### 4. 주의사항

- ⚠️ **절대 실제 키를 Git에 커밋하지 마세요**
- `.env.local` 파일은 `.gitignore`에 포함되어 있습니다
- `NEXT_PUBLIC_` 접두사가 붙은 변수는 클라이언트 사이드에서 접근 가능합니다
- 프로덕션 배포 시에도 환경 변수를 설정해야 합니다

### 5. 카카오 OAuth 설정 (선택)

카카오 로그인을 사용하려면 다음 설정이 필요합니다:

#### 5.1 Supabase 대시보드 설정

1. [Supabase 대시보드](https://app.supabase.com)에 로그인
2. 프로젝트 선택
3. **Authentication** > **Providers** 메뉴로 이동
4. **Kakao** 제공자 활성화
5. 카카오 개발자 콘솔에서 받은 **Client ID**와 **Client Secret** 입력
6. **Redirect URL** 설정:
   ```
   https://your-project.supabase.co/auth/v1/callback
   ```

#### 5.2 카카오 개발자 콘솔 설정

1. [카카오 개발자 콘솔](https://developers.kakao.com/)에 로그인
2. 내 애플리케이션 > 애플리케이션 추가하기
3. **플랫폼 설정** > **Web 플랫폼 등록**
   - 사이트 도메인: `https://your-project.supabase.co`
4. **제품 설정** > **카카오 로그인** 활성화
5. **Redirect URI** 등록:
   ```
   https://your-project.supabase.co/auth/v1/callback
   ```
6. **Client ID**와 **Client Secret** 복사하여 Supabase에 입력

#### 5.3 환경 변수 (선택)

카카오 OAuth는 Supabase 대시보드에서 설정하므로 추가 환경 변수는 필요하지 않습니다.
다만, 개발 환경에서 테스트할 경우:

```env
# 카카오 앱 키 (선택, Supabase에서 자동 처리)
NEXT_PUBLIC_KAKAO_CLIENT_ID=your-kakao-client-id
```

> 💡 **참고**: 카카오 OAuth는 Supabase Auth를 통해 처리되므로, 대부분의 설정은 Supabase 대시보드에서만 하면 됩니다.

### 6. 익명 사용자 지원

이 프로젝트는 로그인 없이도 사용할 수 있도록 설계되었습니다:
- 익명 사용자: UUID 기반 로컬 사용자
- 인증된 사용자: 카카오 로그인 사용자
- 두 방식 모두 지원하며, 카카오 로그인 시 기존 데이터가 자동으로 병합됩니다

### 7. 다음 단계

환경 변수 설정 후:
1. [Supabase 프로젝트 생성 및 스키마 설정](./SUPABASE_SETUP.md#3-데이터베이스-스키마-설정)
2. [RLS 정책 설정](./SUPABASE_SETUP.md#4-rls-정책-설정)
3. [카카오 OAuth 설정](#5-카카오-oauth-설정-선택) (선택)

