# GitHub Secrets 설정 가이드

GitHub Actions와 Vercel 배포를 위한 GitHub Secrets 설정 방법을 설명합니다.

## 목차

1. [GitHub Secrets란?](#1-github-secrets란)
2. [필요한 Secrets 목록](#2-필요한-secrets-목록)
3. [GitHub Secrets 설정 방법](#3-github-secrets-설정-방법)
4. [Vercel Secrets 설정](#4-vercel-secrets-설정)
5. [Supabase Secrets 설정](#5-supabase-secrets-설정)
6. [Secrets 확인 방법](#6-secrets-확인-방법)

---

## 1. GitHub Secrets란?

GitHub Secrets는 민감한 정보(API 키, 토큰, 비밀번호 등)를 안전하게 저장하고 GitHub Actions에서 사용할 수 있게 해주는 기능입니다.

- ✅ **안전**: 저장소에 노출되지 않음
- ✅ **암호화**: GitHub에서 암호화되어 저장됨
- ✅ **접근 제어**: 저장소 관리자만 설정 가능

---

## 2. 필요한 Secrets 목록

이 프로젝트에 필요한 GitHub Secrets:

### 2.1 Supabase 관련

| Secret 이름 | 설명 | 예시 |
|------------|------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 프로젝트 URL | `https://xxxxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase Anon (Public) Key | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |

### 2.2 Vercel 관련 (GitHub Actions 배포 시)

| Secret 이름 | 설명 | 예시 |
|------------|------|------|
| `VERCEL_TOKEN` | Vercel API 토큰 | `xxxxx` |
| `VERCEL_ORG_ID` | Vercel 조직 ID | `team_xxxxx` |
| `VERCEL_PROJECT_ID` | Vercel 프로젝트 ID | `prj_xxxxx` |

---

## 3. GitHub Secrets 설정 방법

### 3.1 저장소로 이동

1. GitHub 저장소 페이지로 이동: `https://github.com/habitree/lifeos`
2. **Settings** 탭 클릭
3. 왼쪽 메뉴에서 **Secrets and variables** > **Actions** 클릭

### 3.2 Secret 추가

1. **New repository secret** 버튼 클릭
2. **Name**: Secret 이름 입력 (예: `NEXT_PUBLIC_SUPABASE_URL`)
3. **Secret**: 값 입력
4. **Add secret** 버튼 클릭

### 3.3 모든 Secrets 추가

위의 [필요한 Secrets 목록](#2-필요한-secrets-목록)에 따라 모든 Secrets를 추가하세요.

---

## 4. Vercel Secrets 설정

GitHub Actions를 통해 Vercel에 배포하려면 Vercel 관련 Secrets가 필요합니다.

### 4.1 Vercel 토큰 생성

1. [Vercel 대시보드](https://vercel.com)에 로그인
2. 우측 상단 프로필 클릭 > **Settings** 클릭
3. 왼쪽 메뉴에서 **Tokens** 클릭
4. **Create Token** 버튼 클릭
5. **Token name**: `lifeos-github-actions` (원하는 이름)
6. **Expiration**: 원하는 기간 선택
7. **Create Token** 클릭
8. **토큰 복사** (한 번만 표시되므로 저장해두세요!)
9. GitHub Secrets에 `VERCEL_TOKEN`으로 추가

### 4.2 Vercel 조직 ID 확인

1. Vercel 대시보드에서 **Settings** > **General** 클릭
2. **Team ID** 또는 **User ID** 확인
3. GitHub Secrets에 `VERCEL_ORG_ID`로 추가

### 4.3 Vercel 프로젝트 ID 확인

#### 방법 1: Vercel 대시보드에서 확인

1. 프로젝트 페이지로 이동
2. **Settings** > **General** 클릭
3. **Project ID** 확인
4. GitHub Secrets에 `VERCEL_PROJECT_ID`로 추가

#### 방법 2: Vercel CLI로 확인

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

---

## 5. Supabase Secrets 설정

### 5.1 Supabase 프로젝트 URL 확인

1. [Supabase 대시보드](https://app.supabase.com)에 로그인
2. 프로젝트 선택
3. **Settings** > **API** 메뉴로 이동
4. **Project URL** 복사
5. GitHub Secrets에 `NEXT_PUBLIC_SUPABASE_URL`로 추가

### 5.2 Supabase Anon Key 확인

1. Supabase 대시보드 > **Settings** > **API** 메뉴
2. **Project API keys** 섹션에서 **anon public** 키 복사
3. GitHub Secrets에 `NEXT_PUBLIC_SUPABASE_ANON_KEY`로 추가

---

## 6. Secrets 확인 방법

### 6.1 GitHub에서 확인

1. 저장소 > **Settings** > **Secrets and variables** > **Actions**
2. 설정한 Secrets 목록 확인
3. ⚠️ **주의**: Secrets 값은 보안상 다시 확인할 수 없습니다

### 6.2 GitHub Actions에서 확인

1. 저장소 > **Actions** 탭 클릭
2. 워크플로우 실행 로그 확인
3. Secrets가 올바르게 사용되는지 확인

### 6.3 테스트 방법

```bash
# 로컬에서 GitHub Actions 테스트 (act 사용)
# 또는 GitHub에서 workflow_dispatch로 수동 실행
```

---

## 7. 주의사항

### 7.1 보안

- ⚠️ **절대 Secrets 값을 코드에 직접 작성하지 마세요**
- ⚠️ **Secrets 값을 커밋 메시지에 포함하지 마세요**
- ⚠️ **Secrets 값을 공개 채널에 공유하지 마세요**

### 7.2 Secrets 업데이트

Secrets 값을 변경하려면:

1. GitHub > **Settings** > **Secrets and variables** > **Actions**
2. 해당 Secret 옆의 **연필 아이콘** 클릭
3. 새 값 입력
4. **Update secret** 클릭

### 7.3 Secrets 삭제

더 이상 필요하지 않은 Secrets는 삭제하세요:

1. GitHub > **Settings** > **Secrets and variables** > **Actions**
2. 해당 Secret 옆의 **휴지통 아이콘** 클릭
3. 확인

---

## 8. Vercel 자동 배포 (대안)

GitHub Actions를 통한 배포 대신, Vercel 자동 배포를 사용할 수도 있습니다:

### 8.1 Vercel 자동 배포 설정

1. [Vercel 대시보드](https://vercel.com)에 로그인
2. **New Project** 클릭
3. GitHub 저장소 선택: `habitree/lifeos`
4. **Import** 클릭
5. 환경 변수 설정:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
6. **Deploy** 클릭

### 8.2 자동 배포의 장점

- ✅ GitHub Actions Secrets 설정 불필요
- ✅ Vercel 대시보드에서 직접 관리
- ✅ 프리뷰 배포 자동 생성
- ✅ 더 간단한 설정

### 8.3 자동 배포의 단점

- ❌ GitHub Actions와 통합 어려움
- ❌ 커스텀 배포 스크립트 제한

---

## 9. 다음 단계

Secrets 설정이 완료되면:

1. ✅ [GitHub Actions 워크플로우 테스트](./GITHUB_ACTIONS_SETUP.md#워크플로우-테스트)
2. ✅ [Vercel 배포 확인](./GITHUB_ACTIONS_SETUP.md#배포-확인)
3. ✅ [환경 변수 확인](./ENV_SETUP.md)

---

## 참고 자료

- [GitHub Secrets 문서](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- [Vercel 환경 변수 문서](https://vercel.com/docs/concepts/projects/environment-variables)
- [Supabase API 키 문서](https://supabase.com/docs/guides/api/api-keys)

