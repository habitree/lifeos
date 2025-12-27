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

### 5. 익명 사용자 지원

이 프로젝트는 로그인 없이 사용할 수 있도록 설계되었습니다:
- `persistSession: false` - 세션 저장 비활성화
- `autoRefreshToken: false` - 토큰 자동 갱신 비활성화
- Supabase RLS 정책에서 익명 사용자 접근 허용 필요

### 6. 다음 단계

환경 변수 설정 후:
1. [Supabase 프로젝트 생성 및 스키마 설정](./SUPABASE_SETUP.md#3-데이터베이스-스키마-설정)
2. [RLS 정책 설정](./SUPABASE_SETUP.md#4-rls-정책-설정)

