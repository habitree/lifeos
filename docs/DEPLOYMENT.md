# LIFE OS - 배포 가이드
## Vercel 배포 설정

**버전**: v0.1  
**작성일**: 2025-01-27

---

## 배포 개요

LIFE OS는 Vercel을 통해 배포됩니다. Next.js App Router를 사용하므로 Vercel과 완벽하게 호환됩니다.

---

## 사전 준비

### 1. GitHub 저장소 준비

- 프로젝트가 GitHub 저장소에 푸시되어 있어야 합니다
- 저장소는 Public 또는 Private 모두 가능합니다

### 2. Vercel 계정 준비

- [Vercel](https://vercel.com)에 가입
- GitHub 계정과 연동

---

## Vercel 배포 단계

### 1. 프로젝트 가져오기

1. [Vercel 대시보드](https://vercel.com/dashboard)에 로그인
2. "Add New..." > "Project" 클릭
3. GitHub 저장소 선택
4. 프로젝트 가져오기

### 2. 프로젝트 설정

#### 빌드 설정

- **Framework Preset**: Next.js (자동 감지)
- **Root Directory**: `./` (기본값)
- **Build Command**: `npm run build` (기본값)
- **Output Directory**: `.next` (기본값)
- **Install Command**: `npm install` (기본값)

#### 환경 변수 설정

Vercel 대시보드에서 다음 환경 변수를 설정하세요:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

**설정 방법:**
1. 프로젝트 설정 > Environment Variables
2. 각 변수를 추가:
   - **Name**: `NEXT_PUBLIC_SUPABASE_URL`
   - **Value**: Supabase 프로젝트 URL
   - **Environment**: Production, Preview, Development 모두 선택
3. 동일하게 `NEXT_PUBLIC_SUPABASE_ANON_KEY` 추가

### 3. 배포 실행

1. "Deploy" 버튼 클릭
2. 빌드 진행 상황 확인
3. 배포 완료 후 URL 확인

---

## 환경별 설정

### Production (프로덕션)

- Production 환경 변수 사용
- 자동 HTTPS
- CDN 최적화

### Preview (프리뷰)

- Pull Request마다 자동 배포
- Preview 환경 변수 사용
- 테스트 환경으로 활용

### Development (개발)

- 개발 브랜치 배포
- Development 환경 변수 사용

---

## 배포 후 확인 사항

### 1. 기본 동작 확인

- [ ] 홈페이지 로드 확인
- [ ] 네비게이션 작동 확인
- [ ] Baseline 토글 작동 확인
- [ ] Daily Log 저장 작동 확인
- [ ] Phase 변경 작동 확인

### 2. 환경 변수 확인

- [ ] Supabase 연결 확인
- [ ] 데이터 저장/조회 확인
- [ ] 동기화 작동 확인

### 3. 반응형 확인

- [ ] 모바일 레이아웃 확인
- [ ] 태블릿 레이아웃 확인
- [ ] 데스크톱 레이아웃 확인

---

## 자동 배포 설정

### GitHub 연동

Vercel은 GitHub와 연동되어 자동으로 배포됩니다:

- **main/master 브랜치**: Production 배포
- **다른 브랜치**: Preview 배포
- **Pull Request**: Preview 배포

### 커스텀 도메인 설정

1. Vercel 대시보드 > 프로젝트 > Settings > Domains
2. 도메인 추가
3. DNS 설정 (Vercel이 안내)

---

## 빌드 최적화

### Next.js 최적화

- 자동 코드 스플리팅
- 이미지 최적화
- 폰트 최적화
- 정적 페이지 생성

### 환경 변수 최적화

- `NEXT_PUBLIC_` 접두사 변수만 클라이언트에 포함
- 서버 사이드 변수는 서버에만 존재

---

## 트러블슈팅

### 빌드 실패

1. **환경 변수 확인**
   - 모든 필수 환경 변수가 설정되었는지 확인
   - 변수 이름이 정확한지 확인

2. **의존성 확인**
   - `package.json`의 모든 의존성이 설치되는지 확인
   - Node.js 버전 확인 (Vercel은 자동 감지)

3. **빌드 로그 확인**
   - Vercel 대시보드 > Deployments > 빌드 로그 확인
   - 에러 메시지 확인

### 런타임 오류

1. **브라우저 콘솔 확인**
   - 클라이언트 사이드 에러 확인
   - 네트워크 요청 확인

2. **Supabase 연결 확인**
   - 환경 변수가 올바르게 설정되었는지 확인
   - Supabase 프로젝트가 활성화되어 있는지 확인

3. **RLS 정책 확인**
   - Supabase RLS 정책이 올바르게 설정되었는지 확인
   - 익명 사용자 접근이 허용되어 있는지 확인

---

## 모니터링

### Vercel Analytics

- Vercel 대시보드에서 Analytics 확인
- 페이지 뷰, 성능 메트릭 확인

### 에러 추적

- Vercel 대시보드 > 프로젝트 > Functions
- 서버 사이드 에러 확인

---

## 참고 문서

- [Vercel 공식 문서](https://vercel.com/docs)
- [Next.js 배포 가이드](https://nextjs.org/docs/deployment)
- [환경 변수 설정 가이드](./ENV_SETUP.md)
- [Supabase 설정 가이드](./SUPABASE_SETUP.md)

---

## 다음 단계

배포 완료 후:

1. 프로덕션 환경 테스트
2. 사용자 피드백 수집
3. 성능 모니터링
4. 버그 수정 및 개선

---

> **LIFE OS v0.1**  
> 기준으로 돌아오는 루틴 앱

