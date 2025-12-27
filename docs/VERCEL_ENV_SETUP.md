# Vercel 환경 변수 설정 가이드

## 개요

Vercel에 배포할 때 환경 변수를 설정하는 방법을 안내합니다.

---

## 환경 변수 설정 방법

### 1. Vercel 대시보드에서 설정

1. [Vercel 대시보드](https://vercel.com/dashboard)에 로그인
2. 프로젝트 선택
3. **Settings** > **Environment Variables** 메뉴로 이동
4. 환경 변수 추가

### 2. 필요한 환경 변수

다음 환경 변수를 설정하세요:

| 변수 이름 | 설명 | 예시 |
|---------|------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 프로젝트 URL | `https://xxxxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase Anon (Public) Key | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |

### 3. 환경별 설정

각 환경 변수는 다음 환경에 적용할 수 있습니다:

- **Production**: 프로덕션 배포에 사용
- **Preview**: Preview 배포 (Pull Request 등)에 사용
- **Development**: 개발 브랜치 배포에 사용

**권장**: 모든 환경에 동일한 값을 설정하거나, 환경별로 다른 Supabase 프로젝트를 사용할 수 있습니다.

---

## Supabase 키 찾기

### 1. Supabase 대시보드 접속

1. [Supabase 대시보드](https://app.supabase.com)에 로그인
2. 프로젝트 선택

### 2. Project URL 찾기

1. **Settings** > **API** 메뉴로 이동
2. **Project URL** 섹션에서 URL 복사
3. Vercel에 `NEXT_PUBLIC_SUPABASE_URL`로 추가

### 3. Anon Key 찾기

1. **Settings** > **API** 메뉴로 이동
2. **Project API keys** 섹션에서 **anon public** 키 복사
3. Vercel에 `NEXT_PUBLIC_SUPABASE_ANON_KEY`로 추가

> ⚠️ **주의**: `anon public` 키를 사용하세요. `service_role` 키는 절대 사용하지 마세요.

---

## 환경 변수 추가 단계

### Vercel 대시보드에서

1. 프로젝트 > **Settings** > **Environment Variables**
2. **Add New** 클릭
3. 다음 정보 입력:
   - **Key**: `NEXT_PUBLIC_SUPABASE_URL`
   - **Value**: Supabase 프로젝트 URL
   - **Environment**: Production, Preview, Development 모두 선택 (또는 원하는 환경만)
4. **Save** 클릭
5. 동일하게 `NEXT_PUBLIC_SUPABASE_ANON_KEY` 추가

---

## 환경 변수 확인

### 배포 후 확인

1. 배포된 사이트 접속
2. 브라우저 개발자 도구 > Console 확인
3. Supabase 연결 오류가 없는지 확인

### 로컬에서 확인

로컬 개발 환경에서도 동일한 환경 변수를 사용하려면 `.env.local` 파일을 생성하세요:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

---

## 환경 변수 업데이트

환경 변수를 변경한 경우:

1. Vercel 대시보드에서 환경 변수 수정
2. **Redeploy** 실행 (자동으로 재배포되지 않음)
3. 또는 새로운 커밋을 푸시하여 자동 재배포

---

## 보안 주의사항

### ✅ 안전한 것

- `NEXT_PUBLIC_` 접두사가 붙은 변수는 클라이언트에서 접근 가능
- Supabase Anon Key는 공개되어도 안전 (RLS 정책으로 보호)

### ⚠️ 주의할 것

- `service_role` 키는 절대 사용하지 마세요
- 환경 변수는 Vercel 대시보드에서만 관리
- Git에 실제 키를 커밋하지 마세요

---

## 트러블슈팅

### 환경 변수가 적용되지 않음

1. **재배포 확인**
   - 환경 변수 변경 후 재배포 필요
   - Vercel 대시보드 > Deployments > Redeploy

2. **변수 이름 확인**
   - `NEXT_PUBLIC_` 접두사 확인
   - 대소문자 정확히 일치하는지 확인

3. **환경 확인**
   - Production, Preview, Development 중 올바른 환경에 설정되었는지 확인

### Supabase 연결 오류

1. **URL 확인**
   - Supabase 프로젝트 URL이 정확한지 확인
   - `https://`로 시작하는지 확인

2. **Key 확인**
   - Anon Key가 정확한지 확인
   - `anon public` 키를 사용하는지 확인

3. **RLS 정책 확인**
   - Supabase RLS 정책이 올바르게 설정되었는지 확인
   - 익명 사용자 접근이 허용되어 있는지 확인

---

## 참고 문서

- [Vercel 환경 변수 문서](https://vercel.com/docs/concepts/projects/environment-variables)
- [환경 변수 설정 가이드](./ENV_SETUP.md)
- [Supabase 설정 가이드](./SUPABASE_SETUP.md)
- [배포 가이드](./DEPLOYMENT.md)

---

> **LIFE OS v0.1**  
> 기준으로 돌아오는 루틴 앱

