# 중복 배포 문제 해결 완료

## 문제 원인

Vercel에서 두 개의 배포가 동시에 진행되는 이유:

1. **두 개의 GitHub Actions 워크플로우가 동시 실행**
   - `.github/workflows/deploy.yml` - 빌드 및 테스트 후 배포
   - `.github/workflows/deploy-simple.yml` - 바로 배포
   - 둘 다 `push` 이벤트에 반응하여 중복 배포 발생

2. **Vercel 자동 배포와의 충돌 가능성**
   - Vercel이 GitHub와 연결되어 있으면 Git push 시 자동 배포
   - GitHub Actions도 동시에 배포를 트리거하면 중복 배포

## 해결 조치

### 1. `deploy-simple.yml` 비활성화

`deploy-simple.yml` 파일의 `on:` 섹션을 주석 처리하여 비활성화했습니다.

**이유**:
- `deploy.yml`이 빌드 및 테스트를 포함하여 더 안전함
- 하나의 워크플로우만 사용하여 중복 방지

### 2. 권장 설정

**사용할 워크플로우**: `.github/workflows/deploy.yml`
- ✅ 빌드 및 테스트 포함
- ✅ 테스트 통과 후에만 배포
- ✅ 더 안전한 배포 프로세스

## 추가 확인 사항

### Vercel 자동 배포 설정 확인

Vercel 대시보드에서 확인:
1. 프로젝트 > Settings > Git
2. "Automatic deployments" 상태 확인
3. GitHub Actions를 사용하는 경우 자동 배포를 비활성화하는 것을 고려

**권장 설정**:
- GitHub Actions 배포 사용 시: Vercel 자동 배포 비활성화
- Vercel 자동 배포 사용 시: GitHub Actions 배포 비활성화

## 예상 결과

- ✅ 중복 배포 제거
- ✅ 배포 시간 단축
- ✅ 리소스 절약
- ✅ 배포 로그 명확화

## 다음 단계

1. 변경사항을 커밋하고 푸시
2. 다음 배포에서 중복 배포가 발생하지 않는지 확인
3. 필요시 Vercel 자동 배포 설정 조정

