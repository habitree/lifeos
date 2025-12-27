# GitHub Secrets 설정 단계별 가이드

## ⚠️ 중요: Variables가 아닌 Secrets를 사용하세요!

**Variables**는 일반 텍스트로 노출되므로 민감한 정보에는 사용하지 마세요.  
**Secrets**는 암호화되어 마스킹되므로 API 키, 토큰 등에 사용하세요.

---

## 📍 Secrets 설정 페이지로 이동

### 방법 1: Variables 페이지에서 이동

1. 현재 보이는 **Variables** 페이지에서
2. 상단 노트의 **"create a secret"** (파란색 링크) 클릭
3. Secrets 설정 페이지로 이동

### 방법 2: 직접 이동

1. GitHub 저장소 페이지: `https://github.com/habitree/lifeos`
2. **Settings** 탭 클릭
3. 왼쪽 메뉴에서 **Secrets and variables** > **Actions** 클릭
4. 상단 탭에서 **Secrets** 선택 (Variables가 아닌 Secrets!)

---

## 🔐 Secrets 설정 단계

### 1단계: Supabase Secrets 설정

#### 1-1. NEXT_PUBLIC_SUPABASE_URL 설정

1. **New repository secret** 버튼 클릭
2. **Name** 입력: `NEXT_PUBLIC_SUPABASE_URL`
3. **Secret** 입력: Supabase 프로젝트 URL
   - 예시: `https://xxxxx.supabase.co`
   - Supabase 대시보드 > Settings > API > Project URL에서 확인
4. **Add secret** 버튼 클릭

#### 1-2. NEXT_PUBLIC_SUPABASE_ANON_KEY 설정

1. **New repository secret** 버튼 클릭
2. **Name** 입력: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. **Secret** 입력: Supabase Anon Key
   - 예시: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   - Supabase 대시보드 > Settings > API > anon public 키에서 확인
4. **Add secret** 버튼 클릭

---

### 2단계: Vercel Secrets 설정 (GitHub Actions 배포 시)

> 💡 **참고**: Vercel 자동 배포를 사용한다면 이 단계는 건너뛰어도 됩니다.

#### 2-1. Vercel 토큰 생성 및 설정

**Vercel에서 토큰 생성:**

1. [Vercel 대시보드](https://vercel.com)에 로그인
2. 우측 상단 프로필 클릭 > **Settings** 클릭
3. 왼쪽 메뉴에서 **Tokens** 클릭
4. **Create Token** 버튼 클릭
5. **Token name**: `lifeos-github-actions` (원하는 이름)
6. **Expiration**: 원하는 기간 선택
7. **Create Token** 클릭
8. **토큰 복사** (한 번만 표시되므로 저장해두세요!)

**GitHub Secrets에 추가:**

1. GitHub 저장소 > Settings > Secrets and variables > Actions
2. **New repository secret** 버튼 클릭
3. **Name** 입력: `VERCEL_TOKEN`
4. **Secret** 입력: 복사한 Vercel 토큰 붙여넣기
5. **Add secret** 버튼 클릭

#### 2-2. Vercel 조직 ID 설정

**Vercel에서 확인:**

1. Vercel 대시보드 > **Settings** > **General** 클릭
2. **Team ID** 또는 **User ID** 확인
   - 예시: `team_xxxxx` 또는 `user_xxxxx`

**GitHub Secrets에 추가:**

1. GitHub 저장소 > Settings > Secrets and variables > Actions
2. **New repository secret** 버튼 클릭
3. **Name** 입력: `VERCEL_ORG_ID`
4. **Secret** 입력: 확인한 Team ID 또는 User ID
5. **Add secret** 버튼 클릭

#### 2-3. Vercel 프로젝트 ID 설정

**Vercel에서 확인 (프로젝트가 이미 있는 경우):**

1. Vercel 대시보드에서 프로젝트 선택
2. **Settings** > **General** 클릭
3. **Project ID** 확인
   - 예시: `prj_xxxxx`

**프로젝트가 없는 경우:**

프로젝트를 먼저 생성하거나, Vercel CLI로 확인:

```bash
# Vercel CLI 설치 (없는 경우)
npm i -g vercel

# 프로젝트 디렉토리에서 로그인
vercel login

# 프로젝트 링크
vercel link

# 프로젝트 정보 확인
vercel inspect
```

`.vercel/project.json` 파일에서 `projectId` 확인 가능

**GitHub Secrets에 추가:**

1. GitHub 저장소 > Settings > Secrets and variables > Actions
2. **New repository secret** 버튼 클릭
3. **Name** 입력: `VERCEL_PROJECT_ID`
4. **Secret** 입력: 확인한 Project ID
5. **Add secret** 버튼 클릭

---

## ✅ 설정 확인

### Secrets 목록 확인

1. GitHub 저장소 > Settings > Secrets and variables > Actions
2. **Secrets** 탭에서 설정한 Secrets 목록 확인

**설정해야 할 Secrets:**

- ✅ `NEXT_PUBLIC_SUPABASE_URL`
- ✅ `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- ✅ `VERCEL_TOKEN` (GitHub Actions 배포 시)
- ✅ `VERCEL_ORG_ID` (GitHub Actions 배포 시)
- ✅ `VERCEL_PROJECT_ID` (GitHub Actions 배포 시)

### GitHub Actions 테스트

1. 저장소 > **Actions** 탭 클릭
2. 최근 워크플로우 실행 확인
3. Secrets가 올바르게 사용되는지 확인

---

## 🔍 Variables vs Secrets 비교

| 항목 | Variables | Secrets |
|------|-----------|---------|
| **노출 방식** | 일반 텍스트 | 암호화 + 마스킹 |
| **용도** | 공개해도 되는 값 | 민감한 정보 (API 키, 토큰) |
| **로그 표시** | 값이 그대로 표시됨 | `***`로 마스킹됨 |
| **우리 프로젝트** | ❌ 사용 안 함 | ✅ 사용 권장 |

---

## ⚠️ 주의사항

1. **절대 Variables에 API 키나 토큰을 넣지 마세요!**
2. **Secrets 값은 한 번 설정하면 다시 확인할 수 없습니다** (보안상 이유)
3. **Secrets를 업데이트하려면** 기존 Secret을 수정하거나 삭제 후 새로 생성하세요

---

## 📚 참고 자료

- [GitHub Secrets 설정 가이드](./GITHUB_SECRETS_SETUP.md)
- [Supabase 설정 가이드](../SUPABASE_SETUP.md)
- [GitHub Actions 설정 가이드](./GITHUB_ACTIONS_SETUP.md)

