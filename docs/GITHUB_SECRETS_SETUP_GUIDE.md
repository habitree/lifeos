# GitHub Secrets 설정 가이드
## LIFE OS - GitHub Actions Secret 설정 방법

**작성일**: 2025-01-27

---

## 📋 결론

**GitHub Secrets 설정이 필요합니다.**

현재 프로젝트에 다음 워크플로우가 설정되어 있습니다:
- ✅ `.github/workflows/ci.yml` - CI (빌드 및 테스트)
- ✅ `.github/workflows/deploy.yml` - Vercel 배포 (GitHub Actions)
- ✅ `.github/workflows/pages.yml` - GitHub Pages 배포

---

## 🔍 필요한 Secrets 목록

### 필수 Secrets (모든 워크플로우)

#### 1. Supabase 관련 (필수)

| Secret 이름 | 설명 | 예시 |
|------------|------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 프로젝트 URL | `https://xxxxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon public 키 | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |

**사용 위치**:
- `ci.yml` - 빌드 테스트
- `deploy.yml` - 배포 시 빌드

---

### 선택적 Secrets (deploy.yml 사용 시)

#### 2. Vercel 관련 (GitHub Actions로 배포하는 경우만)

| Secret 이름 | 설명 | 예시 |
|------------|------|------|
| `VERCEL_TOKEN` | Vercel API 토큰 | `xxxxx` |
| `VERCEL_ORG_ID` | Vercel 조직/팀 ID | `team_xxxxx` 또는 `user_xxxxx` |
| `VERCEL_PROJECT_ID` | Vercel 프로젝트 ID | `prj_xxxxx` |

**사용 위치**:
- `deploy.yml` - Vercel 배포

**참고**: Vercel 자동 배포를 사용한다면 이 Secrets는 불필요합니다.

---

## 🎯 설정 시나리오

### 시나리오 1: Vercel 자동 배포 사용 (권장)

**설정**:
- ✅ GitHub Secrets: Supabase 관련만 설정
- ✅ Vercel 환경 변수: Supabase 관련 설정
- ❌ Vercel 관련 Secrets: 불필요

**장점**:
- 설정이 간단함
- Vercel 대시보드에서 직접 관리
- 프리뷰 배포 자동 생성

**필요한 Secrets**:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

### 시나리오 2: GitHub Actions로 Vercel 배포

**설정**:
- ✅ GitHub Secrets: Supabase + Vercel 관련 모두 설정
- ✅ Vercel 환경 변수: Supabase 관련 설정

**장점**:
- GitHub Actions에서 배포 프로세스 제어
- 커스텀 배포 스크립트 가능

**필요한 Secrets**:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

---

## 🔧 GitHub Secrets 설정 방법

### 1단계: GitHub 저장소 접속

1. [GitHub](https://github.com) 접속
2. 프로젝트 저장소로 이동
3. **Settings** 탭 클릭
4. 왼쪽 메뉴에서 **Secrets and variables** > **Actions** 클릭

### 2단계: Supabase Secrets 추가

#### Secret 1: NEXT_PUBLIC_SUPABASE_URL

1. **New repository secret** 버튼 클릭
2. **Name**: `NEXT_PUBLIC_SUPABASE_URL`
3. **Secret**: Supabase Project URL
   - Supabase 대시보드 > Settings > API > Project URL 복사
   - 예: `https://abcdefghijklmnop.supabase.co`
4. **Add secret** 클릭

#### Secret 2: NEXT_PUBLIC_SUPABASE_ANON_KEY

1. **New repository secret** 버튼 클릭
2. **Name**: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. **Secret**: Supabase anon public key
   - Supabase 대시보드 > Settings > API > anon public 키 복사
   - 예: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
4. **Add secret** 클릭

### 3단계: Vercel Secrets 추가 (선택)

GitHub Actions로 Vercel 배포를 사용하는 경우만 설정:

#### Secret 3: VERCEL_TOKEN

1. **Vercel 토큰 생성**:
   - Vercel 대시보드 > Settings > Tokens
   - **Create Token** 클릭
   - Token name: `lifeos-github-actions`
   - **Create Token** 클릭
   - 토큰 복사 (한 번만 표시!)

2. **GitHub Secret 추가**:
   - **New repository secret** 클릭
   - **Name**: `VERCEL_TOKEN`
   - **Secret**: 복사한 토큰
   - **Add secret** 클릭

#### Secret 4: VERCEL_ORG_ID

1. **Vercel 조직 ID 확인**:
   - Vercel 대시보드 > Settings > General
   - **Team ID** 또는 **User ID** 확인
   - 형식: `team_xxxxx` 또는 `user_xxxxx`

2. **GitHub Secret 추가**:
   - **New repository secret** 클릭
   - **Name**: `VERCEL_ORG_ID`
   - **Secret**: 조직 ID
   - **Add secret** 클릭

#### Secret 5: VERCEL_PROJECT_ID

1. **Vercel 프로젝트 ID 확인**:
   - Vercel 대시보드 > 프로젝트 선택
   - Settings > General
   - **Project ID** 확인
   - 형식: `prj_xxxxx`

2. **GitHub Secret 추가**:
   - **New repository secret** 클릭
   - **Name**: `VERCEL_PROJECT_ID`
   - **Secret**: 프로젝트 ID
   - **Add secret** 클릭

---

## ✅ 설정 확인

### GitHub Secrets 확인

1. GitHub 저장소 > **Settings** > **Secrets and variables** > **Actions**
2. 다음 Secrets가 표시되어야 합니다:

**필수**:
- ✅ `NEXT_PUBLIC_SUPABASE_URL`
- ✅ `NEXT_PUBLIC_SUPABASE_ANON_KEY`

**선택 (deploy.yml 사용 시)**:
- ✅ `VERCEL_TOKEN`
- ✅ `VERCEL_ORG_ID`
- ✅ `VERCEL_PROJECT_ID`

### GitHub Actions 테스트

1. GitHub 저장소 > **Actions** 탭 클릭
2. **CI** 워크플로우 선택
3. **Run workflow** 클릭 (또는 코드 푸시)
4. 워크플로우 실행 확인
5. 빌드 성공 확인

---

## 📊 설정 요약

### 최소 설정 (Vercel 자동 배포 사용)

**GitHub Secrets**:
- ✅ `NEXT_PUBLIC_SUPABASE_URL`
- ✅ `NEXT_PUBLIC_SUPABASE_ANON_KEY`

**Vercel 환경 변수**:
- ✅ `NEXT_PUBLIC_SUPABASE_URL`
- ✅ `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

### 전체 설정 (GitHub Actions 배포 사용)

**GitHub Secrets**:
- ✅ `NEXT_PUBLIC_SUPABASE_URL`
- ✅ `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- ✅ `VERCEL_TOKEN`
- ✅ `VERCEL_ORG_ID`
- ✅ `VERCEL_PROJECT_ID`

**Vercel 환경 변수**:
- ✅ `NEXT_PUBLIC_SUPABASE_URL`
- ✅ `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

## 🚨 중요 주의사항

### 1. Secret 값 확인

- ⚠️ **절대 `service_role` 키를 사용하지 마세요**
- ✅ **`anon public` 키만 사용하세요**
- ✅ Supabase 대시보드 > Settings > API에서 확인

### 2. Secret 이름 확인

- ✅ 정확히 일치해야 합니다 (대소문자 구분)
- ✅ `NEXT_PUBLIC_` 접두사 확인

### 3. Secret 보안

- ✅ GitHub Secrets는 안전하게 저장됩니다
- ✅ 워크플로우에서만 사용 가능
- ✅ 로그에 표시되지 않음
- ⚠️ Secret 값은 한 번 설정하면 다시 볼 수 없습니다

---

## 🔄 Vercel 자동 배포 vs GitHub Actions 배포

### Vercel 자동 배포 (권장)

**설정**:
- Vercel 대시보드에서 GitHub 저장소 연결
- Vercel 환경 변수만 설정
- GitHub Secrets는 Supabase 관련만 설정

**장점**:
- ✅ 설정이 간단함
- ✅ 프리뷰 배포 자동 생성
- ✅ Vercel 대시보드에서 직접 관리

**단점**:
- ❌ GitHub Actions와 통합 어려움

---

### GitHub Actions 배포

**설정**:
- GitHub Secrets에 Vercel 관련 Secrets 추가
- `deploy.yml` 워크플로우 사용

**장점**:
- ✅ GitHub Actions에서 배포 프로세스 제어
- ✅ 커스텀 배포 스크립트 가능

**단점**:
- ❌ 설정이 복잡함
- ❌ Vercel Secrets 추가 필요

---

## 📋 설정 체크리스트

### 필수 설정

- [ ] GitHub 저장소 접속
- [ ] Settings > Secrets and variables > Actions 이동
- [ ] `NEXT_PUBLIC_SUPABASE_URL` Secret 추가
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` Secret 추가
- [ ] Vercel 환경 변수 설정 확인

### 선택 설정 (GitHub Actions 배포 사용 시)

- [ ] `VERCEL_TOKEN` Secret 추가
- [ ] `VERCEL_ORG_ID` Secret 추가
- [ ] `VERCEL_PROJECT_ID` Secret 추가

### 확인

- [ ] GitHub Actions CI 실행 확인
- [ ] 빌드 성공 확인
- [ ] Vercel 배포 확인

---

## 📚 참고 문서

- [GitHub Secrets 설정 가이드](./doc/question/GITHUB_SECRETS_SETUP.md)
- [GitHub Actions 설정 가이드](./doc/question/GITHUB_ACTIONS_SETUP.md)
- [Vercel 환경 변수 설정](./VERCEL_ENV_SETUP.md)
- [배포 가이드](./DEPLOYMENT.md)

---

## ✅ 결론

**GitHub Secrets 설정이 필요합니다.**

**최소 설정** (Vercel 자동 배포 사용):
- GitHub Secrets: Supabase 관련 2개
- Vercel 환경 변수: Supabase 관련 2개

**전체 설정** (GitHub Actions 배포 사용):
- GitHub Secrets: Supabase 관련 2개 + Vercel 관련 3개
- Vercel 환경 변수: Supabase 관련 2개

---

> **LIFE OS v0.1**  
> 기준으로 돌아오는 루틴 앱

