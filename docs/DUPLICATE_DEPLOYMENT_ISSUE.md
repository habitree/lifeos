# 중복 배포 문제 분석 및 해결 방안

## 문제 상황

Vercel에서 두 개의 배포가 동시에 진행되는 문제가 발생했습니다.

## 원인 분석

### 1. 중복 GitHub Actions 워크플로우

현재 프로젝트에 **두 개의 Vercel 배포 워크플로우**가 있습니다:

1. **`.github/workflows/deploy.yml`** - "Deploy to Vercel"
   - `push` 이벤트에 반응
   - 빌드 및 테스트 후 Vercel 배포

2. **`.github/workflows/deploy-simple.yml`** - "Deploy to Vercel (Simple)"
   - `push` 이벤트에 반응
   - 바로 Vercel 배포

**문제**: 같은 커밋에 대해 두 워크플로우가 모두 실행되어 **중복 배포**가 발생합니다.

### 2. Vercel 자동 배포와의 충돌

Vercel이 GitHub와 연결되어 있으면:
- Git push 시 **자동으로 배포**가 트리거됩니다
- GitHub Actions도 동시에 배포를 트리거하면 **중복 배포**가 발생합니다

## 해결 방안

### 방안 1: 하나의 워크플로우만 사용 (권장)

**옵션 A: `deploy.yml` 사용 (빌드 및 테스트 포함)**
- 빌드 및 테스트를 먼저 수행
- 테스트 통과 후에만 배포
- 더 안전하고 권장되는 방법

**옵션 B: `deploy-simple.yml` 사용 (간단한 배포)**
- 빠른 배포
- 빌드 및 테스트 없이 바로 배포

**권장**: `deploy.yml`을 사용하고 `deploy-simple.yml`을 삭제하거나 비활성화

### 방안 2: Vercel 자동 배포 비활성화

Vercel 대시보드에서:
1. 프로젝트 설정 > Git
2. "Automatic deployments" 비활성화
3. GitHub Actions만 사용하여 배포

### 방안 3: GitHub Actions 배포 비활성화

Vercel의 자동 배포만 사용하고 GitHub Actions 배포를 비활성화

## 권장 해결 방법

### 단계 1: `deploy-simple.yml` 비활성화 또는 삭제

**옵션 A: 파일 삭제**
```bash
rm .github/workflows/deploy-simple.yml
```

**옵션 B: 워크플로우 비활성화 (파일 유지)**
워크플로우 파일에서 `on:` 섹션을 주석 처리하거나 제거

### 단계 2: Vercel 자동 배포 설정 확인

Vercel 대시보드에서:
1. 프로젝트 > Settings > Git
2. "Automatic deployments" 상태 확인
3. 필요시 비활성화 (GitHub Actions만 사용)

## 현재 설정 확인

### GitHub Actions 워크플로우

**`.github/workflows/deploy.yml`**:
- 트리거: `push` to `main`
- 작업: 빌드 → 테스트 → Vercel 배포

**`.github/workflows/deploy-simple.yml`**:
- 트리거: `push` to `main`
- 작업: Vercel 배포 (빌드/테스트 없음)

### Vercel 설정

- GitHub 연결: 활성화 (추정)
- 자동 배포: 활성화 (추정)

## 즉시 조치 사항

1. **`deploy-simple.yml` 삭제 또는 비활성화**
2. **Vercel 자동 배포 설정 확인**
3. **하나의 배포 방법만 사용**

## 예상 결과

- ✅ 중복 배포 제거
- ✅ 배포 시간 단축
- ✅ 리소스 절약
- ✅ 배포 로그 명확화

