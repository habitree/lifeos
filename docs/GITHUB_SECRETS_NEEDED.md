# GitHub Secrets 설정 필요 여부
## LIFE OS - GitHub Actions Secret 설정 가이드

**작성일**: 2025-01-27

---

## 📋 결론: GitHub Secrets 설정이 필요합니다

현재 프로젝트에 GitHub Actions 워크플로우가 설정되어 있으므로, **GitHub Secrets 설정이 필요합니다**.

---

## 🔍 현재 상황 확인

### GitHub Actions 워크플로우 파일

프로젝트에 다음 워크플로우 파일이 있습니다:

1. `.github/workflows/ci.yml` - CI (빌드 및 테스트)
2. `.github/workflows/deploy.yml` - 배포 워크플로우
3. `.github/workflows/pages.yml` - GitHub Pages 배포

### 현재 설정 상태

`ci.yml` 파일에서 환경 변수를 사용하고 있습니다:

```yaml
- name: Build
  run: npm run build
  env:
    NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co' }}
    NEXT_PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key' }}
```

**현재 상태**: Placeholder 값을 사용하고 있어 빌드는 통과하지만, 실제 기능 테스트는 불가능합니다.

---

## ✅ GitHub Secrets 설정이 필요한 이유

### 1. GitHub Actions CI 실행 시

- 코드 푸시 시 자동으로 CI가 실행됩니다
- 빌드 단계에서 환경 변수가 필요합니다
- Placeholder 값으로는 실제 기능 테스트가 불가능합니다

### 2. 실제 빌드 테스트

- GitHub Actions에서 실제 빌드가 성공하는지 확인하려면
- 실제 Supabase 환경 변수가 필요합니다

### 3. Vercel과의 일관성

- Vercel 환경 변수와 GitHub Secrets를 동일하게 설정하면
- 로컬, CI, 배포 환경 모두 일관성 있게 테스트 가능합니다

---

## 🔧 GitHub Secrets 설정 방법

### 1단계: GitHub 저장소 접속

1. [GitHub](https://github.com) 접속
2. 프로젝트 저장소로 이동 (`habitree/lifeos` 또는 해당 저장소)

### 2단계: Secrets 설정

1. 저장소 페이지에서 **Settings** 탭 클릭
2. 왼쪽 메뉴에서 **Secrets and variables** > **Actions** 클릭
3. **New repository secret** 버튼 클릭

### 3단계: Secret 추가

**Secret 1: NEXT_PUBLIC_SUPABASE_URL**

1. **Name**: `NEXT_PUBLIC_SUPABASE_URL`
2. **Secret**: Supabase Project URL (`https://xxxxx.supabase.co`)
3. **Add secret** 클릭

**Secret 2: NEXT_PUBLIC_SUPABASE_ANON_KEY**

1. **New repository secret** 버튼 다시 클릭
2. **Name**: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. **Secret**: Supabase anon public key (`eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)
4. **Add secret** 클릭

### 4단계: 확인

설정 완료 후 다음 Secrets가 표시되어야 합니다:

- ✅ `NEXT_PUBLIC_SUPABASE_URL`
- ✅ `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

## 📝 Vercel vs GitHub Secrets

### Vercel 환경 변수

- **용도**: Vercel 배포 시 사용
- **위치**: Vercel 대시보드 > Settings > Environment Variables
- **필수**: ✅ **반드시 설정 필요**

### GitHub Secrets

- **용도**: GitHub Actions CI 실행 시 사용
- **위치**: GitHub 저장소 > Settings > Secrets and variables > Actions
- **필수**: ✅ **설정 권장** (CI가 정상 작동하려면)

---

## 🎯 권장 설정

### 옵션 1: 둘 다 설정 (권장)

**Vercel 환경 변수** + **GitHub Secrets** 모두 설정

**장점**:
- Vercel 배포 정상 작동
- GitHub Actions CI 정상 작동
- 로컬, CI, 배포 환경 모두 일관성 있게 테스트 가능

**설정 위치**:
1. Vercel: 대시보드 > Settings > Environment Variables
2. GitHub: 저장소 > Settings > Secrets and variables > Actions

### 옵션 2: Vercel만 설정

**Vercel 환경 변수**만 설정

**장점**:
- Vercel 배포는 정상 작동
- 설정이 간단함

**단점**:
- GitHub Actions CI는 placeholder 값으로 빌드됨
- 실제 기능 테스트 불가능
- CI에서 빌드 에러를 미리 발견하기 어려움

---

## ⚠️ 중요 주의사항

### 1. Secret 값 확인

- ⚠️ **절대 `service_role` 키를 사용하지 마세요**
- ✅ **`anon public` 키만 사용하세요**
- ✅ Supabase 대시보드 > Settings > API에서 확인

### 2. Secret 이름 확인

- ✅ 정확히 일치해야 합니다:
  - `NEXT_PUBLIC_SUPABASE_URL` (대소문자 정확히)
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY` (대소문자 정확히)

### 3. Secret 보안

- ✅ GitHub Secrets는 안전하게 저장됩니다
- ✅ 워크플로우에서만 사용 가능
- ✅ 로그에 표시되지 않음
- ⚠️ Secret 값은 한 번 설정하면 다시 볼 수 없습니다 (수정만 가능)

---

## 🔍 현재 워크플로우 확인

### CI 워크플로우 (`.github/workflows/ci.yml`)

**실행 시점**:
- `main`, `develop` 브랜치에 푸시 시
- Pull Request 생성/업데이트 시
- 수동 실행 시

**필요한 Secrets**:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Deploy 워크플로우 (`.github/workflows/deploy.yml`)

**확인 필요**: 이 워크플로우의 내용을 확인하여 추가 Secret이 필요한지 확인해야 합니다.

---

## 📋 설정 체크리스트

### GitHub Secrets 설정

- [ ] GitHub 저장소 접속
- [ ] Settings > Secrets and variables > Actions 이동
- [ ] `NEXT_PUBLIC_SUPABASE_URL` Secret 추가
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` Secret 추가
- [ ] Secret 설정 확인

### Vercel 환경 변수 설정

- [ ] Vercel 대시보드 접속
- [ ] 프로젝트 > Settings > Environment Variables 이동
- [ ] `NEXT_PUBLIC_SUPABASE_URL` 환경 변수 추가
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` 환경 변수 추가
- [ ] 모든 환경(Production, Preview, Development)에 설정 확인

---

## 🚀 설정 후 확인

### GitHub Actions 확인

1. GitHub 저장소 > **Actions** 탭 클릭
2. 최신 워크플로우 실행 확인
3. 빌드 성공 확인 (초록색 체크)
4. 빌드 로그에서 환경 변수 사용 확인

### Vercel 배포 확인

1. Vercel 대시보드에서 배포 상태 확인
2. 빌드 성공 확인
3. 배포된 사이트 접속 테스트

---

## 📚 참고 문서

- [GitHub Secrets 설정 가이드](./doc/question/GITHUB_SECRETS_SETUP.md)
- [GitHub Actions 설정 가이드](./doc/question/GITHUB_ACTIONS_SETUP.md)
- [Vercel 환경 변수 설정](./VERCEL_ENV_SETUP.md)
- [배포 가이드](./DEPLOYMENT.md)

---

## ✅ 결론

**GitHub Secrets 설정이 필요합니다.**

이유:
1. ✅ GitHub Actions CI가 정상 작동하려면 필요
2. ✅ 실제 빌드 테스트를 위해 필요
3. ✅ Vercel과 일관성 있게 테스트하기 위해 필요

**설정 순서**:
1. Supabase에서 API 키 확인
2. GitHub Secrets 설정
3. Vercel 환경 변수 설정
4. 재배포 및 CI 실행 확인

---

> **LIFE OS v0.1**  
> 기준으로 돌아오는 루틴 앱

