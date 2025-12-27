# GitHub Actions 배포 vs Vercel 자동 배포 비교 가이드

## 목차

1. [개요](#개요)
2. [GitHub Actions 배포](#github-actions-배포)
3. [Vercel 자동 배포](#vercel-자동-배포)
4. [상세 비교](#상세-비교)
5. [설정 방법](#설정-방법)
6. [처리 방법 및 워크플로우](#처리-방법-및-워크플로우)
7. [언제 어떤 방식을 사용해야 하는가?](#언제-어떤-방식을-사용해야-하는가)
8. [중복 배포 방지](#중복-배포-방지)
9. [트러블슈팅](#트러블슈팅)

---

## 개요

Next.js 프로젝트를 Vercel에 배포하는 방법은 크게 두 가지가 있습니다:

1. **GitHub Actions를 통한 배포**: GitHub Actions 워크플로우를 사용하여 Vercel에 배포
2. **Vercel 자동 배포**: Vercel이 GitHub 저장소와 직접 연동하여 자동으로 배포

각 방식은 장단점이 있으며, 프로젝트의 요구사항에 따라 선택할 수 있습니다.

---

## GitHub Actions 배포

### 작동 원리

1. **트리거**: GitHub 저장소에 코드가 푸시되면 GitHub Actions 워크플로우가 자동 실행
2. **빌드 및 테스트**: GitHub Actions 러너에서 코드 체크아웃, 의존성 설치, 빌드, 테스트 수행
3. **Vercel 배포**: 빌드 성공 후 Vercel CLI 또는 API를 통해 배포
4. **결과 확인**: GitHub Actions 로그에서 배포 결과 확인

### ⚠️ 중요한 이해: GitHub Actions와 Vercel의 관계

**핵심 포인트**: GitHub Actions는 배포를 트리거하는 도구일 뿐, 실제 호스팅은 Vercel이 담당합니다.

```
GitHub Actions (배포 도구)
    ↓
Vercel API 호출 (배포 요청)
    ↓
Vercel 플랫폼 (실제 호스팅)
    ↓
외부 접속 가능한 웹사이트
```

**즉, GitHub Actions로 배포해도:**
- ✅ **Vercel 프로젝트가 필요합니다** (먼저 Vercel에 프로젝트를 생성해야 함)
- ✅ **Vercel의 모든 기능을 사용할 수 있습니다** (도메인, HTTPS, CDN 등)
- ✅ **Vercel 대시보드에서 관리합니다** (배포 이력, 환경 변수, 도메인 설정 등)
- ✅ **외부 연결은 Vercel을 통해 이루어집니다** (커스텀 도메인, HTTPS 등)

**차이점은 배포 방식뿐입니다:**
- **GitHub Actions 배포**: GitHub Actions가 Vercel API를 호출하여 배포
- **Vercel 자동 배포**: Vercel이 직접 GitHub를 감지하여 배포

**둘 다 결과는 동일합니다**: Vercel 플랫폼에서 호스팅되는 웹사이트

### 장점

✅ **빌드 및 테스트 통합**
- 코드 푸시 전에 빌드 및 테스트를 수행
- 테스트 실패 시 배포 차단 가능
- CI/CD 파이프라인 구축 용이

✅ **세밀한 제어**
- 배포 전후 커스텀 스크립트 실행 가능
- 복잡한 배포 로직 구현 가능
- 다양한 조건부 배포 설정 가능

✅ **비용 효율적**
- GitHub Actions 무료 플랜 제공 (제한 있음)
- Vercel 빌드 시간 절약

✅ **다중 플랫폼 배포**
- Vercel 외 다른 플랫폼에도 동시 배포 가능
- 배포 전 알림, 슬랙 연동 등 추가 작업 가능

✅ **배포 이력 관리**
- GitHub Actions에서 모든 배포 이력 확인
- 배포 실패 시 롤백 스크립트 실행 가능

### 단점

❌ **설정 복잡도**
- GitHub Secrets 설정 필요
- Vercel Token, Org ID, Project ID 등 추가 정보 필요
- 워크플로우 파일 작성 및 관리 필요

❌ **빌드 시간**
- GitHub Actions 러너에서 빌드 수행
- Vercel 자동 배포보다 느릴 수 있음

❌ **GitHub Actions 제한**
- 무료 플랜: 월 2,000분 제한
- 동시 실행 제한 (무료: 20개)

### 설정 방법

#### 1. GitHub Secrets 설정

GitHub 저장소에서 다음 Secrets를 설정해야 합니다:

**필수 Secrets:**
- `VERCEL_TOKEN`: Vercel API 토큰
- `VERCEL_ORG_ID`: Vercel 조직 ID
- `VERCEL_PROJECT_ID`: Vercel 프로젝트 ID
- `NEXT_PUBLIC_SUPABASE_URL`: Supabase URL (빌드 시 필요)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase Anon Key (빌드 시 필요)

**Secrets 설정 방법:**
1. GitHub 저장소 > Settings > Secrets and variables > Actions
2. "New repository secret" 클릭
3. Name과 Value 입력 후 저장

#### 2. Vercel 프로젝트 생성 (필수!)

⚠️ **중요**: GitHub Actions로 배포하려면 먼저 Vercel에 프로젝트를 생성해야 합니다!

**Vercel 프로젝트 생성:**
1. [Vercel 대시보드](https://vercel.com/dashboard) 접속
2. "Add New..." > "Project" 클릭
3. GitHub 저장소 선택 (또는 나중에 연결)
4. 프로젝트 이름 입력
5. "Import" 클릭하여 프로젝트 생성

**왜 프로젝트를 먼저 생성해야 하나요?**
- GitHub Actions는 Vercel API를 통해 배포를 요청합니다
- Vercel API는 프로젝트 ID가 필요합니다
- 프로젝트가 없으면 배포할 곳이 없습니다

#### 3. Vercel 정보 확인

**VERCEL_TOKEN 생성:**
1. [Vercel 대시보드](https://vercel.com/account/tokens) 접속
2. "Create Token" 클릭
3. Token 이름 입력 (예: "GitHub Actions")
4. Scope: Full Account 선택
5. 생성된 토큰 복사 (한 번만 표시됨)

**VERCEL_ORG_ID 확인:**
1. Vercel 대시보드 > Settings > General
2. "Team ID" 또는 "Personal Account ID" 확인

**VERCEL_PROJECT_ID 확인:**
1. Vercel 대시보드 > 프로젝트 선택
2. Settings > General
3. "Project ID" 확인

#### 4. Vercel 환경 변수 설정

GitHub Actions로 배포해도 Vercel 대시보드에서 환경 변수를 설정해야 합니다:

1. Vercel 대시보드 > 프로젝트 > Settings > Environment Variables
2. 다음 환경 변수 추가:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. 모든 환경(Production, Preview, Development)에 설정

**왜 Vercel에도 환경 변수를 설정해야 하나요?**
- GitHub Actions는 빌드 시에만 환경 변수를 사용합니다
- 실제 런타임(사용자가 사이트에 접속할 때)에는 Vercel의 환경 변수를 사용합니다
- 따라서 두 곳 모두 설정해야 합니다

#### 5. 워크플로우 파일 생성

`.github/workflows/deploy.yml` 파일 생성:

```yaml
name: Deploy to Vercel

# Workflow가 실행되는 조건
on:
  push:
    branches: [ main ]
  workflow_dispatch:  # 수동 실행 가능

# 환경 변수 설정
env:
  NODE_VERSION: '20.x'

jobs:
  # 빌드 및 테스트 작업
  build:
    name: Build and Test
    runs-on: ubuntu-latest
    
    steps:
      # 1. 코드 체크아웃
      - name: Checkout code
        uses: actions/checkout@v4
      
      # 2. Node.js 설정
      - name: Setup Node.js ${{ env.NODE_VERSION }}
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
      
      # 3. 의존성 설치
      - name: Install dependencies
        run: npm ci
      
      # 4. TypeScript 타입 체크
      - name: TypeScript type check
        run: npx tsc --noEmit
      
      # 5. ESLint 실행
      - name: Run ESLint
        run: npm run lint
        continue-on-error: false
      
      # 6. 빌드 테스트
      - name: Build
        run: npm run build
        env:
          NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.NEXT_PUBLIC_SUPABASE_URL }}
          NEXT_PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.NEXT_PUBLIC_SUPABASE_ANON_KEY }}

  # Vercel 배포 작업
  deploy:
    name: Deploy to Vercel
    runs-on: ubuntu-latest
    needs: build  # 빌드가 성공한 후에만 배포
    if: github.ref == 'refs/heads/main'  # main 브랜치에만 배포
    
    steps:
      # 1. 코드 체크아웃
      - name: Checkout code
        uses: actions/checkout@v4
      
      # 2. 환경 변수 확인
      - name: Verify environment variables
        run: |
          if [ -z "${{ secrets.NEXT_PUBLIC_SUPABASE_URL }}" ]; then
            echo "❌ NEXT_PUBLIC_SUPABASE_URL is not set"
            exit 1
          fi
          if [ -z "${{ secrets.NEXT_PUBLIC_SUPABASE_ANON_KEY }}" ]; then
            echo "❌ NEXT_PUBLIC_SUPABASE_ANON_KEY is not set"
            exit 1
          fi
          if [ -z "${{ secrets.VERCEL_TOKEN }}" ]; then
            echo "❌ VERCEL_TOKEN is not set"
            exit 1
          fi
          if [ -z "${{ secrets.VERCEL_ORG_ID }}" ]; then
            echo "❌ VERCEL_ORG_ID is not set"
            exit 1
          fi
          if [ -z "${{ secrets.VERCEL_PROJECT_ID }}" ]; then
            echo "❌ VERCEL_PROJECT_ID is not set"
            exit 1
          fi
          echo "✅ All environment variables are set"
      
      # 3. Vercel 배포
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        id: vercel-deploy
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
        env:
          NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.NEXT_PUBLIC_SUPABASE_URL }}
          NEXT_PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.NEXT_PUBLIC_SUPABASE_ANON_KEY }}
      
      # 4. 배포 결과 출력
      - name: Deployment URL
        run: |
          echo "🚀 Deployment completed!"
          echo "Preview URL: ${{ steps.vercel-deploy.outputs.preview-url }}"
```

#### 6. 배포 실행

1. 코드를 `main` 브랜치에 푸시
2. GitHub Actions 탭에서 워크플로우 실행 확인
3. 빌드 및 배포 진행 상황 모니터링
4. 배포 완료 후 Vercel 대시보드에서 확인

#### 7. 외부 연결 (도메인, HTTPS 등)

**GitHub Actions로 배포해도 Vercel을 통해 외부 연결을 설정합니다:**

1. **커스텀 도메인 설정:**
   - Vercel 대시보드 > 프로젝트 > Settings > Domains
   - 도메인 추가
   - DNS 설정 (Vercel이 안내)

2. **HTTPS 자동 설정:**
   - Vercel이 자동으로 SSL 인증서 발급
   - 추가 설정 불필요

3. **CDN 자동 설정:**
   - Vercel의 글로벌 CDN 자동 적용
   - 최적화된 성능 제공

**중요**: GitHub Actions는 배포만 담당하고, 외부 연결(도메인, HTTPS, CDN)은 모두 Vercel이 제공합니다.

---

## Vercel 자동 배포

### 작동 원리

1. **GitHub 연동**: Vercel이 GitHub 저장소와 직접 연동
2. **자동 감지**: 코드 푸시 시 Vercel이 자동으로 변경사항 감지
3. **빌드 및 배포**: Vercel 서버에서 자동으로 빌드 및 배포 수행
4. **결과 확인**: Vercel 대시보드에서 배포 결과 확인

### 장점

✅ **설정 간단**
- GitHub 저장소만 연결하면 자동 배포 시작
- 추가 설정 최소화
- 초보자도 쉽게 사용 가능

✅ **빌드 최적화**
- Vercel이 Next.js에 최적화된 빌드 환경 제공
- 빠른 빌드 속도
- 자동 캐싱 및 최적화

✅ **Preview 배포**
- Pull Request마다 자동 Preview 배포
- 각 PR에 고유한 URL 제공
- 팀원과 쉽게 공유 가능

✅ **자동 HTTPS 및 CDN**
- 자동 SSL 인증서 발급
- 글로벌 CDN 자동 설정
- 최적화된 성능

✅ **배포 이력 관리**
- Vercel 대시보드에서 모든 배포 이력 확인
- 이전 배포로 롤백 가능
- 배포 상태 실시간 모니터링

### 단점

❌ **빌드 및 테스트 제한**
- 배포 전 빌드 및 테스트 수행 어려움
- 테스트 실패해도 배포 진행될 수 있음
- CI/CD 파이프라인 구축 제한적

❌ **세밀한 제어 제한**
- 배포 전후 커스텀 스크립트 실행 제한
- 복잡한 배포 로직 구현 어려움

❌ **비용**
- Vercel 빌드 시간 사용
- 무료 플랜: 월 100시간 제한
- 대규모 프로젝트는 유료 플랜 필요

### 설정 방법

#### 1. Vercel 프로젝트 생성

1. [Vercel 대시보드](https://vercel.com/dashboard) 접속
2. "Add New..." > "Project" 클릭
3. GitHub 저장소 선택
4. 프로젝트 이름 입력
5. "Import" 클릭

#### 2. 빌드 설정

Vercel이 Next.js를 자동 감지하지만, 필요시 수정 가능:

- **Framework Preset**: Next.js (자동 감지)
- **Root Directory**: `./` (기본값)
- **Build Command**: `npm run build` (기본값)
- **Output Directory**: `.next` (기본값)
- **Install Command**: `npm install` (기본값)

**`vercel.json` 파일로 설정:**

```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs"
}
```

#### 3. 환경 변수 설정

1. Vercel 대시보드 > 프로젝트 > Settings > Environment Variables
2. "Add New" 클릭
3. 다음 정보 입력:
   - **Name**: `NEXT_PUBLIC_SUPABASE_URL`
   - **Value**: Supabase 프로젝트 URL
   - **Environment**: Production, Preview, Development 모두 선택
4. "Save" 클릭
5. 동일하게 `NEXT_PUBLIC_SUPABASE_ANON_KEY` 추가

#### 4. 자동 배포 설정

**Settings > Git에서 확인:**

- ✅ **Automatic deployments**: 활성화 (기본값)
  - Production 브랜치: `main` (기본값)
  - Preview deployments: Pull Request마다 자동 배포

**설정 변경:**
1. Settings > Git
2. "Production Branch" 변경 가능
3. "Automatic deployments" 비활성화 가능

#### 5. 첫 배포

1. "Deploy" 버튼 클릭
2. 빌드 진행 상황 확인
3. 배포 완료 후 URL 확인

#### 6. 이후 배포

- `main` 브랜치에 푸시하면 자동으로 Production 배포
- Pull Request 생성 시 자동으로 Preview 배포
- 추가 작업 불필요

---

## 상세 비교

| 항목 | GitHub Actions 배포 | Vercel 자동 배포 |
|------|---------------------|------------------|
| **설정 복잡도** | 높음 (워크플로우 작성 필요) | 낮음 (저장소 연결만) |
| **빌드 위치** | GitHub Actions 러너 | Vercel 서버 |
| **빌드 속도** | 보통 | 빠름 (최적화됨) |
| **테스트 통합** | 가능 (워크플로우에 추가) | 제한적 |
| **세밀한 제어** | 높음 | 낮음 |
| **Preview 배포** | 수동 설정 필요 | 자동 (PR마다) |
| **비용** | GitHub Actions 무료 플랜 | Vercel 무료 플랜 |
| **배포 이력** | GitHub Actions 로그 | Vercel 대시보드 |
| **롤백** | 수동 스크립트 필요 | Vercel 대시보드에서 클릭 |
| **다중 플랫폼 배포** | 가능 | 제한적 |
| **환경 변수 관리** | GitHub Secrets | Vercel Environment Variables |
| **보안** | GitHub Secrets | Vercel 보안 |

---

## 처리 방법 및 워크플로우

### GitHub Actions 배포 워크플로우

```
코드 푸시 (main 브랜치)
    ↓
GitHub Actions 트리거
    ↓
코드 체크아웃
    ↓
Node.js 설정
    ↓
의존성 설치
    ↓
TypeScript 타입 체크
    ↓
ESLint 실행
    ↓
빌드 테스트
    ↓
[빌드 성공?]
    ├─ Yes → Vercel 배포
    └─ No → 배포 중단, 에러 로그
    ↓
배포 완료
    ↓
GitHub Actions 로그에 결과 표시
```

### Vercel 자동 배포 워크플로우

```
코드 푸시 (main 브랜치)
    ↓
Vercel이 변경사항 감지
    ↓
Vercel 서버에서 빌드 시작
    ↓
환경 변수 주입
    ↓
의존성 설치
    ↓
빌드 실행
    ↓
[빌드 성공?]
    ├─ Yes → Production 배포
    └─ No → 배포 실패, 에러 로그
    ↓
배포 완료
    ↓
Vercel 대시보드에 결과 표시
```

### Pull Request Preview 배포 (Vercel 자동 배포)

```
Pull Request 생성
    ↓
Vercel이 PR 감지
    ↓
Preview 배포 시작
    ↓
빌드 및 배포
    ↓
PR에 Preview URL 자동 추가
    ↓
코드 리뷰 및 테스트
    ↓
PR 머지
    ↓
Production 배포
```

---

## 언제 어떤 방식을 사용해야 하는가?

### GitHub Actions 배포를 사용해야 하는 경우

✅ **빌드 및 테스트를 배포 전에 수행해야 할 때**
- 코드 품질 검사 필수
- 테스트 실패 시 배포 차단 필요
- CI/CD 파이프라인 구축 필요

✅ **세밀한 배포 제어가 필요할 때**
- 배포 전후 커스텀 스크립트 실행
- 복잡한 배포 로직 구현
- 조건부 배포 설정

✅ **다중 플랫폼 배포가 필요할 때**
- Vercel 외 다른 플랫폼에도 동시 배포
- 배포 전 알림, 슬랙 연동 등 추가 작업

✅ **비용 최적화가 필요할 때**
- Vercel 빌드 시간 절약
- GitHub Actions 무료 플랜 활용

### Vercel 자동 배포를 사용해야 하는 경우

✅ **빠른 설정이 필요할 때**
- 최소한의 설정으로 배포 시작
- 초보자도 쉽게 사용 가능

✅ **Preview 배포가 중요할 때**
- Pull Request마다 자동 Preview 배포
- 팀원과 쉽게 공유

✅ **빌드 최적화가 중요할 때**
- Vercel의 Next.js 최적화 활용
- 빠른 빌드 속도 필요

✅ **간단한 프로젝트일 때**
- 복잡한 CI/CD 파이프라인 불필요
- 빠른 배포가 우선

### 하이브리드 접근법

두 방식을 함께 사용할 수도 있습니다:

1. **GitHub Actions**: 빌드 및 테스트 수행
2. **Vercel 자동 배포**: 테스트 통과 후 자동 배포

이 경우 GitHub Actions에서 테스트만 수행하고, Vercel 자동 배포는 활성화 상태로 유지합니다.

---

## 중복 배포 방지

### 문제 상황

두 배포 방식을 동시에 사용하면 같은 커밋에 대해 중복 배포가 발생할 수 있습니다.

### 해결 방법

#### 방법 1: 하나의 방식만 사용 (권장)

**옵션 A: GitHub Actions만 사용**
1. Vercel 대시보드 > Settings > Git
2. "Automatic deployments" 비활성화
3. GitHub Actions 워크플로우만 사용

**옵션 B: Vercel 자동 배포만 사용**
1. `.github/workflows/deploy.yml` 파일 삭제 또는 비활성화
2. Vercel 자동 배포만 사용

#### 방법 2: 조건부 배포

GitHub Actions 워크플로우에서 특정 조건에서만 배포하도록 설정:

```yaml
deploy:
  name: Deploy to Vercel
  runs-on: ubuntu-latest
  needs: build
  if: |
    github.ref == 'refs/heads/main' &&
    !contains(github.event.head_commit.message, '[skip vercel]')
```

커밋 메시지에 `[skip vercel]`을 포함하면 GitHub Actions 배포를 건너뛸 수 있습니다.

#### 방법 3: Vercel 자동 배포 조건 설정

Vercel 대시보드에서:
1. Settings > Git
2. "Ignore Build Step" 설정
3. 특정 조건에서만 빌드하도록 설정

---

## 트러블슈팅

### GitHub Actions 배포 문제

#### 문제 1: "VERCEL_TOKEN is not set" 에러

**원인**: GitHub Secrets에 `VERCEL_TOKEN`이 설정되지 않음

**해결**:
1. GitHub 저장소 > Settings > Secrets and variables > Actions
2. "New repository secret" 클릭
3. Name: `VERCEL_TOKEN`, Value: Vercel 토큰 입력
4. 저장 후 워크플로우 재실행

#### 문제 2: "Build failed" 에러

**원인**: 빌드 중 에러 발생

**해결**:
1. GitHub Actions 로그 확인
2. 에러 메시지 확인
3. 로컬에서 `npm run build` 실행하여 재현
4. 문제 해결 후 재배포

#### 문제 3: 배포는 성공했지만 사이트가 작동하지 않음

**원인**: 환경 변수 누락 또는 잘못된 설정

**해결**:
1. Vercel 대시보드 > Settings > Environment Variables 확인
2. 필요한 환경 변수 모두 설정 확인
3. 환경 변수 값 확인 (오타, 공백 등)
4. 재배포

### Vercel 자동 배포 문제

#### 문제 1: 배포가 시작되지 않음

**원인**: GitHub 연동 해제 또는 설정 오류

**해결**:
1. Vercel 대시보드 > Settings > Git 확인
2. GitHub 저장소 연결 상태 확인
3. 필요시 재연동

#### 문제 2: 빌드 실패

**원인**: 빌드 중 에러 발생

**해결**:
1. Vercel 대시보드 > Deployments > 실패한 배포 클릭
2. 빌드 로그 확인
3. 에러 메시지 확인
4. 로컬에서 `npm run build` 실행하여 재현
5. 문제 해결 후 재배포

#### 문제 3: 환경 변수 누락

**원인**: 환경 변수가 설정되지 않음

**해결**:
1. Vercel 대시보드 > Settings > Environment Variables
2. 필요한 환경 변수 추가
3. 모든 환경(Production, Preview, Development)에 설정 확인
4. 재배포

### 중복 배포 문제

#### 문제: 같은 커밋에 대해 두 번 배포됨

**원인**: GitHub Actions와 Vercel 자동 배포가 동시에 실행

**해결**:
1. 하나의 방식만 사용하도록 설정
2. 또는 조건부 배포 설정

---

## GitHub Actions 배포 시 외부 연결 방법

### 도메인 설정

**GitHub Actions로 배포해도 Vercel 대시보드에서 도메인을 설정합니다:**

1. **Vercel 대시보드 접속**
   - [Vercel 대시보드](https://vercel.com/dashboard) 로그인
   - 프로젝트 선택

2. **도메인 추가**
   - Settings > Domains 메뉴로 이동
   - "Add Domain" 클릭
   - 도메인 입력 (예: `example.com`)

3. **DNS 설정**
   - Vercel이 DNS 설정 방법을 안내
   - 도메인 제공업체에서 DNS 레코드 추가
   - Vercel이 자동으로 확인

4. **HTTPS 자동 설정**
   - 도메인 추가 후 Vercel이 자동으로 SSL 인증서 발급
   - 추가 설정 불필요

### 외부 접속 URL

**GitHub Actions로 배포해도 Vercel이 제공하는 URL을 사용합니다:**

- **기본 URL**: `https://[프로젝트명].vercel.app`
- **커스텀 도메인**: `https://[도메인명]`

**예시:**
- 프로젝트명이 `lifeos`인 경우: `https://lifeos.vercel.app`
- 커스텀 도메인 `example.com` 설정 시: `https://example.com`

### 중요한 이해

**GitHub Actions의 역할:**
- ✅ 코드 빌드 및 테스트
- ✅ Vercel API를 통한 배포 요청
- ✅ 배포 프로세스 자동화

**Vercel의 역할:**
- ✅ 실제 웹사이트 호스팅
- ✅ 도메인 및 DNS 관리
- ✅ HTTPS 인증서 발급
- ✅ CDN 및 성능 최적화
- ✅ 환경 변수 관리
- ✅ 배포 이력 관리

**즉, GitHub Actions는 "배포 도구"이고, Vercel은 "호스팅 플랫폼"입니다.**

---

## 결론

### 권장 사항

**소규모 프로젝트 또는 빠른 배포가 필요한 경우:**
- ✅ Vercel 자동 배포 사용

**빌드 및 테스트가 중요하거나 복잡한 CI/CD가 필요한 경우:**
- ✅ GitHub Actions 배포 사용

**최적의 방법:**
- ✅ GitHub Actions로 빌드 및 테스트 수행
- ✅ Vercel 자동 배포로 실제 배포 수행
- ✅ 중복 배포 방지를 위해 조건부 설정

### 핵심 요약

**GitHub Actions로 배포할 때:**
1. ✅ Vercel 프로젝트를 먼저 생성해야 합니다
2. ✅ Vercel 대시보드에서 환경 변수를 설정해야 합니다
3. ✅ 외부 연결(도메인, HTTPS)은 Vercel을 통해 설정합니다
4. ✅ 실제 호스팅은 Vercel이 담당합니다
5. ✅ GitHub Actions는 배포를 트리거하는 도구일 뿐입니다

### 최종 체크리스트

**GitHub Actions 배포 사용 시:**
- [ ] GitHub Secrets 설정 완료
- [ ] Vercel Token, Org ID, Project ID 확인
- [ ] 워크플로우 파일 작성 및 테스트
- [ ] Vercel 자동 배포 비활성화 (중복 방지)

**Vercel 자동 배포 사용 시:**
- [ ] GitHub 저장소 연동 완료
- [ ] 환경 변수 설정 완료
- [ ] 빌드 설정 확인
- [ ] GitHub Actions 배포 워크플로우 비활성화 (중복 방지)

---

**작성일**: 2025-01-27  
**버전**: v1.0  
**작성자**: LIFE OS 개발팀

