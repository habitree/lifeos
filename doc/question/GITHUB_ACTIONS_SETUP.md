# GitHub Actions 설정 가이드

이 가이드는 LIFE OS 프로젝트를 GitHub에 푸시하고 GitHub Actions를 설정하는 방법을 초보자도 따라할 수 있도록 자세히 설명합니다.

## 목차

1. [GitHub 저장소 연결](#1-github-저장소-연결)
2. [GitHub Actions 기본 개념](#2-github-actions-기본-개념)
3. [GitHub Actions Workflow 설정](#3-github-actions-workflow-설정)
4. [자동 실행 기준](#4-자동-실행-기준)
5. [환경 변수 설정](#5-환경-변수-설정)
6. [배포 설정 (선택)](#6-배포-설정-선택)
7. [문제 해결](#7-문제-해결)

---

## 1. GitHub 저장소 연결

### 1.1 원격 저장소 추가

현재 프로젝트를 GitHub 저장소(`https://github.com/habitree/lifeos.git`)에 연결합니다.

```bash
# 원격 저장소 추가
git remote add origin https://github.com/habitree/lifeos.git

# 원격 저장소 확인
git remote -v
```

**출력 예시:**
```
origin  https://github.com/habitree/lifeos.git (fetch)
origin  https://github.com/habitree/lifeos.git (push)
```

### 1.2 브랜치 이름 확인 및 변경

```bash
# 현재 브랜치 확인
git branch

# 브랜치 이름을 main으로 변경 (필요한 경우)
git branch -M main
```

### 1.3 첫 푸시

```bash
# 모든 변경사항 커밋 확인
git status

# 변경사항이 있다면 커밋
git add .
git commit -m "커밋 메시지"

# GitHub에 푸시
git push -u origin main
```

**주의사항:**
- GitHub 인증이 필요할 수 있습니다 (Personal Access Token 또는 SSH 키)
- 저장소에 대한 쓰기 권한이 있어야 합니다

---

## 2. GitHub Actions 기본 개념

### 2.1 GitHub Actions란?

GitHub Actions는 GitHub 저장소에서 자동으로 작업을 실행할 수 있는 CI/CD(Continuous Integration/Continuous Deployment) 플랫폼입니다.

**주요 용어:**
- **Workflow**: 자동화된 작업 프로세스
- **Job**: 하나의 작업 단위 (예: 빌드, 테스트)
- **Step**: Job 내의 개별 명령어
- **Action**: 재사용 가능한 작업 단위

### 2.2 GitHub Actions가 실행되는 시점

1. **코드 푸시 시**: `push` 이벤트
2. **Pull Request 생성/업데이트 시**: `pull_request` 이벤트
3. **수동 실행**: `workflow_dispatch` 이벤트
4. **스케줄 실행**: `schedule` 이벤트 (cron 형식)

### 2.3 Workflow 파일 위치

GitHub Actions workflow 파일은 다음 위치에 저장됩니다:

```
.github/workflows/
└── ci.yml  (또는 원하는 이름.yml)
```

---

## 3. GitHub Actions Workflow 설정

### 3.1 Workflow 파일 생성

프로젝트 루트에 `.github/workflows` 디렉토리를 생성하고 workflow 파일을 만듭니다.

**디렉토리 생성:**
```bash
mkdir -p .github/workflows
```

### 3.2 기본 CI Workflow 생성

`.github/workflows/ci.yml` 파일을 생성합니다:

```yaml
name: CI

# Workflow가 실행되는 조건
on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]
  workflow_dispatch:  # 수동 실행 가능

jobs:
  # 빌드 및 테스트 작업
  build-and-test:
    runs-on: ubuntu-latest
    
    strategy:
      matrix:
        node-version: [18.x, 20.x]
    
    steps:
      # 1. 코드 체크아웃
      - name: Checkout code
        uses: actions/checkout@v4
      
      # 2. Node.js 설정
      - name: Setup Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
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
      
      # 6. 빌드 테스트
      - name: Build
        run: npm run build
        env:
          NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.NEXT_PUBLIC_SUPABASE_URL }}
          NEXT_PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.NEXT_PUBLIC_SUPABASE_ANON_KEY }}
```

### 3.3 Workflow 파일 설명

#### `name: CI`
- Workflow의 이름입니다. GitHub Actions 탭에서 표시됩니다.

#### `on:` 섹션
- **`push`**: 특정 브랜치에 푸시할 때 실행
- **`pull_request`**: Pull Request가 생성/업데이트될 때 실행
- **`workflow_dispatch`**: GitHub 웹 인터페이스에서 수동으로 실행 가능

#### `jobs:` 섹션
- **`runs-on`**: 실행 환경 (ubuntu-latest, windows-latest, macos-latest 등)
- **`strategy.matrix`**: 여러 버전으로 테스트 (예: Node.js 18, 20)

#### `steps:` 섹션
각 단계는 순서대로 실행됩니다:
1. **Checkout code**: 저장소 코드 가져오기
2. **Setup Node.js**: Node.js 환경 설정
3. **Install dependencies**: 의존성 설치
4. **TypeScript type check**: 타입 체크
5. **Run ESLint**: 코드 린팅
6. **Build**: 프로젝트 빌드

---

## 4. 자동 실행 기준

### 4.1 언제 자동으로 실행되나요?

GitHub Actions는 다음 상황에서 **자동으로** 실행됩니다:

#### ✅ 코드 푸시 시
```bash
git push origin main
```
- `main` 브랜치에 푸시하면 자동 실행
- `develop` 브랜치에 푸시하면 자동 실행

#### ✅ Pull Request 생성/업데이트 시
- PR이 생성되면 자동 실행
- PR에 새로운 커밋이 추가되면 자동 실행

#### ✅ 수동 실행
- GitHub 웹 인터페이스에서 Actions 탭 > Workflow 선택 > "Run workflow" 클릭

### 4.2 실행되지 않는 경우

다음 경우에는 **실행되지 않습니다**:

- ❌ `.github/workflows/` 폴더에 workflow 파일이 없는 경우
- ❌ workflow 파일에 문법 오류가 있는 경우
- ❌ `on:` 섹션에 해당하는 이벤트가 아닌 경우
- ❌ `.gitignore`에 workflow 파일이 포함된 경우

### 4.3 실행 결과 확인

1. GitHub 저장소 페이지로 이동
2. **Actions** 탭 클릭
3. 실행 중인 workflow 또는 완료된 workflow 확인
4. 각 workflow를 클릭하여 상세 로그 확인

**상태 표시:**
- 🟢 **초록색 체크**: 성공
- 🔴 **빨간색 X**: 실패
- 🟡 **노란색 원**: 실행 중

---

## 5. 환경 변수 설정

### 5.1 GitHub Secrets 설정

빌드 시 환경 변수가 필요합니다. GitHub Secrets에 저장하여 안전하게 사용할 수 있습니다.

#### 설정 방법:

1. **GitHub 저장소 페이지**로 이동
2. **Settings** 탭 클릭
3. 왼쪽 메뉴에서 **Secrets and variables** > **Actions** 클릭
4. **New repository secret** 클릭
5. 다음 Secrets 추가:

```
Name: NEXT_PUBLIC_SUPABASE_URL
Value: https://your-project.supabase.co

Name: NEXT_PUBLIC_SUPABASE_ANON_KEY
Value: your-anon-key-here
```

#### Workflow에서 사용:

```yaml
- name: Build
  run: npm run build
  env:
    NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.NEXT_PUBLIC_SUPABASE_URL }}
    NEXT_PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.NEXT_PUBLIC_SUPABASE_ANON_KEY }}
```

### 5.2 환경 변수 보안 주의사항

⚠️ **절대 하지 말아야 할 것:**
- ❌ 환경 변수를 코드에 직접 작성
- ❌ 환경 변수를 커밋 메시지에 포함
- ❌ 환경 변수를 공개 채널에 공유

✅ **해야 할 것:**
- ✅ GitHub Secrets 사용
- ✅ `.env.local` 파일은 `.gitignore`에 포함
- ✅ 프로덕션 키와 개발 키 분리

---

## 6. 배포 설정 (선택)

### 6.1 Vercel 자동 배포

Vercel은 Next.js 프로젝트를 자동으로 배포할 수 있습니다.

#### Vercel과 GitHub 연동:

1. [Vercel](https://vercel.com)에 로그인
2. **New Project** 클릭
3. GitHub 저장소 선택
4. 환경 변수 설정
5. **Deploy** 클릭

#### GitHub Actions로 Vercel 배포:

`.github/workflows/deploy.yml` 파일 생성:

```yaml
name: Deploy to Vercel

on:
  push:
    branches: [ main ]
  workflow_dispatch:

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20.x'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
        env:
          NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.NEXT_PUBLIC_SUPABASE_URL }}
          NEXT_PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.NEXT_PUBLIC_SUPABASE_ANON_KEY }}
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

### 6.2 다른 플랫폼 배포

- **Netlify**: Netlify Actions 사용
- **AWS**: AWS 배포 스크립트 추가
- **자체 서버**: SSH를 통한 배포 스크립트 추가

---

## 7. 문제 해결

### 7.1 Workflow가 실행되지 않는 경우

**확인 사항:**
1. `.github/workflows/` 폴더가 올바른 위치에 있는지 확인
2. Workflow 파일의 YAML 문법이 올바른지 확인
3. `on:` 섹션의 브랜치 이름이 올바른지 확인
4. 파일이 Git에 커밋되었는지 확인

**해결 방법:**
```bash
# Workflow 파일 확인
ls -la .github/workflows/

# Git에 추가되었는지 확인
git status .github/workflows/

# 추가되지 않았다면 추가
git add .github/workflows/
git commit -m "ci: GitHub Actions workflow 추가"
git push
```

### 7.2 빌드 실패 시

**일반적인 원인:**
1. **의존성 오류**: `package.json` 문제
2. **타입 오류**: TypeScript 컴파일 실패
3. **환경 변수 누락**: Secrets 설정 확인
4. **Node.js 버전 불일치**: `node-version` 확인

**해결 방법:**
1. GitHub Actions 로그 확인 (Actions 탭 > 실패한 workflow 클릭)
2. 로컬에서 동일한 명령어 실행하여 재현
3. 오류 메시지에 따라 수정

### 7.3 환경 변수 오류

**증상:**
```
Error: Missing Supabase environment variables
```

**해결 방법:**
1. GitHub Secrets에 환경 변수가 설정되었는지 확인
2. Workflow 파일에서 `env:` 섹션이 올바른지 확인
3. 변수 이름이 정확한지 확인 (대소문자 구분)

### 7.4 권한 오류

**증상:**
```
Error: Permission denied
```

**해결 방법:**
1. GitHub 저장소에 대한 쓰기 권한 확인
2. Personal Access Token이 올바른 권한을 가지고 있는지 확인
3. SSH 키 설정 확인 (SSH 사용 시)

---

## 8. 실전 예제

### 8.1 전체 설정 과정 요약

```bash
# 1. 원격 저장소 연결
git remote add origin https://github.com/habitree/lifeos.git

# 2. Workflow 디렉토리 생성
mkdir -p .github/workflows

# 3. Workflow 파일 생성 (에디터로 .github/workflows/ci.yml 생성)

# 4. 변경사항 커밋
git add .github/workflows/
git commit -m "ci: GitHub Actions workflow 추가"

# 5. GitHub에 푸시
git push -u origin main

# 6. GitHub에서 Secrets 설정
# Settings > Secrets and variables > Actions > New repository secret

# 7. Actions 탭에서 실행 확인
```

### 8.2 체크리스트

설정 완료 후 확인:

- [ ] `.github/workflows/ci.yml` 파일 생성됨
- [ ] GitHub 저장소에 푸시됨
- [ ] GitHub Secrets 설정됨
- [ ] Actions 탭에서 workflow 확인 가능
- [ ] 푸시 시 자동 실행 확인
- [ ] 빌드 성공 확인

---

## 9. 추가 리소스

- [GitHub Actions 공식 문서](https://docs.github.com/en/actions)
- [Next.js 배포 가이드](https://nextjs.org/docs/deployment)
- [Vercel 배포 가이드](https://vercel.com/docs)
- [GitHub Secrets 가이드](https://docs.github.com/en/actions/security-guides/encrypted-secrets)

---

## 10. 다음 단계

GitHub Actions가 정상 작동하면:

1. ✅ 코드 품질 자동 검사
2. ✅ 자동 빌드 및 테스트
3. ✅ 배포 자동화 (선택)
4. ✅ Pull Request 자동 검증

이제 안심하고 코드를 푸시할 수 있습니다! 🚀

