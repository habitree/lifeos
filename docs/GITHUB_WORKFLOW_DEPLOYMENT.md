# GitHub Workflow 배포 적용 가이드
## LIFE OS - GitHub Actions 배포 워크플로우 설정

**작성일**: 2025-01-27

---

## 📋 개요

GitHub Actions를 사용하여 자동으로 Vercel에 배포하는 워크플로우가 설정되었습니다.

### 워크플로우 파일

1. **`.github/workflows/deploy.yml`** (권장)
   - 빌드 및 테스트 후 배포
   - CI 통합
   - 빌드 아티팩트 관리

2. **`.github/workflows/deploy-simple.yml`** (간단한 버전)
   - Vercel이 자체 빌드 수행
   - 더 빠른 배포
   - 간단한 설정

---

## 🚀 배포 워크플로우 적용

### 현재 설정된 워크플로우

#### 1. CI 워크플로우 (`.github/workflows/ci.yml`)

**실행 조건**:
- `main`, `develop` 브랜치에 푸시 시
- Pull Request 생성/업데이트 시
- 수동 실행 가능

**작업**:
- TypeScript 타입 체크
- ESLint 실행
- 빌드 테스트

---

#### 2. 배포 워크플로우 (`.github/workflows/deploy.yml`)

**실행 조건**:
- `main` 브랜치에 푸시 시
- 수동 실행 가능

**작업**:
1. 빌드 및 테스트
2. 빌드 아티팩트 업로드
3. 환경 변수 확인
4. Vercel 배포

---

## 🔧 필요한 설정

### GitHub Secrets 설정

다음 Secrets를 GitHub 저장소에 설정해야 합니다:

#### 필수 Secrets

1. **Supabase 관련**
   ```
   NEXT_PUBLIC_SUPABASE_URL
   NEXT_PUBLIC_SUPABASE_ANON_KEY
   ```

2. **Vercel 관련**
   ```
   VERCEL_TOKEN
   VERCEL_ORG_ID
   VERCEL_PROJECT_ID
   ```

---

### 설정 방법

#### 1단계: GitHub Secrets 설정

1. GitHub 저장소 > **Settings** > **Secrets and variables** > **Actions**
2. **New repository secret** 클릭
3. 각 Secret 추가

#### 2단계: Vercel 토큰 생성

1. [Vercel 대시보드](https://vercel.com) 접속
2. **Settings** > **Tokens** 클릭
3. **Create Token** 클릭
4. Token name: `lifeos-github-actions`
5. **Create Token** 클릭
6. 토큰 복사 후 GitHub Secrets에 추가

#### 3단계: Vercel 조직/프로젝트 ID 확인

**조직 ID**:
- Vercel 대시보드 > **Settings** > **General** > **Team ID** 또는 **User ID**

**프로젝트 ID**:
- Vercel 대시보드 > 프로젝트 > **Settings** > **General** > **Project ID**

---

## 📊 워크플로우 실행

### 자동 실행

- **main 브랜치에 푸시** 시 자동 실행
- CI 워크플로우: 모든 브랜치 푸시 시 실행
- 배포 워크플로우: main 브랜치 푸시 시 실행

### 수동 실행

1. GitHub 저장소 > **Actions** 탭
2. 워크플로우 선택
3. **Run workflow** 클릭

---

## 🔍 워크플로우 확인

### GitHub Actions에서 확인

1. GitHub 저장소 > **Actions** 탭
2. 실행 중인 워크플로우 확인
3. 각 단계의 로그 확인

### 상태 표시

- 🟢 **초록색 체크**: 성공
- 🔴 **빨간색 X**: 실패
- 🟡 **노란색 원**: 실행 중

---

## ⚠️ 문제 해결

### 빌드 실패

**증상**: CI 워크플로우 실패

**해결**:
1. 빌드 로그 확인
2. 에러 메시지 확인
3. 로컬에서 `npm run build` 실행하여 재현
4. 에러 수정 후 재푸시

---

### 배포 실패

**증상**: 배포 워크플로우 실패

**원인 확인**:
1. 환경 변수 설정 확인
2. Vercel 토큰 유효성 확인
3. Vercel 조직/프로젝트 ID 확인

**해결**:
1. GitHub Secrets 재확인
2. Vercel 토큰 재생성
3. 워크플로우 재실행

---

### 환경 변수 누락

**증상**: "Environment variable is not set" 에러

**해결**:
1. GitHub Secrets 확인
2. 모든 필수 Secrets 설정 확인
3. Secret 이름 정확히 확인 (대소문자 구분)

---

## 📝 워크플로우 파일 구조

```
.github/
└── workflows/
    ├── ci.yml              # CI 워크플로우
    ├── deploy.yml          # 배포 워크플로우 (권장)
    └── deploy-simple.yml   # 간단한 배포 워크플로우
```

---

## 🔄 워크플로우 선택

### deploy.yml (권장)

**장점**:
- ✅ 빌드 및 테스트 통합
- ✅ 빌드 아티팩트 관리
- ✅ 배포 전 검증

**단점**:
- ❌ 배포 시간이 더 걸림

### deploy-simple.yml (간단한 버전)

**장점**:
- ✅ 빠른 배포
- ✅ 간단한 설정
- ✅ Vercel이 자체 빌드 수행

**단점**:
- ❌ 빌드 검증 없음

---

## ✅ 체크리스트

### GitHub Secrets 설정

- [ ] `NEXT_PUBLIC_SUPABASE_URL` 설정
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` 설정
- [ ] `VERCEL_TOKEN` 설정
- [ ] `VERCEL_ORG_ID` 설정
- [ ] `VERCEL_PROJECT_ID` 설정

### 워크플로우 확인

- [ ] CI 워크플로우 실행 확인
- [ ] 배포 워크플로우 실행 확인
- [ ] 빌드 성공 확인
- [ ] 배포 성공 확인

### 배포 확인

- [ ] Vercel 대시보드에서 배포 확인
- [ ] 배포된 사이트 접속 확인
- [ ] 기능 테스트 완료

---

## 📚 참고 문서

- [GitHub Actions 배포 가이드](./GITHUB_ACTIONS_DEPLOYMENT.md)
- [GitHub Secrets 설정 가이드](./GITHUB_SECRETS_SETUP_GUIDE.md)
- [Vercel 환경 변수 설정](./VERCEL_ENV_SETUP.md)
- [배포 가이드](./DEPLOYMENT.md)

---

## 🎯 결론

GitHub Actions를 통한 배포는 다음과 같은 이점을 제공합니다:

1. ✅ **자동화**: 코드 푸시 시 자동 배포
2. ✅ **통합**: CI/CD 파이프라인 통합
3. ✅ **제어**: 배포 프로세스 완전 제어
4. ✅ **안정성**: 빌드 성공 후에만 배포

---

> **LIFE OS v0.1**  
> 기준으로 돌아오는 루틴 앱

