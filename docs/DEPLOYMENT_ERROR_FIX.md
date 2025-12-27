# 배포 오류 확인 및 수정 가이드
## LIFE OS - 빌드 실패 해결

**확인일**: 2025-01-27

---

## 🔍 발견된 배포 오류

### 오류 요약

- **상태**: Build Failed
- **에러 메시지**: `Command "npm run build" exited with 1`
- **빌드 로그**: 46 lines, 3 errors, 1 warning
- **배포 URL**: 
  - `lifeos-git-main-cdhrichs-projects.vercel.app`
  - `lifeos-r9erhcuff-cdhrichs-projects.vercel.app`

---

## 🚨 일반적인 빌드 실패 원인

### 1. 환경 변수 누락 (가장 가능성 높음)

**증상**: 
- 빌드 중 환경 변수 관련 에러
- "Missing Supabase environment variables" 에러

**해결**:
1. Vercel 대시보드 > Settings > Environment Variables 확인
2. 다음 변수 추가:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   ```
3. 모든 환경(Production, Preview, Development)에 설정
4. 재배포 실행

---

### 2. 타입 에러

**증상**:
- TypeScript 타입 에러
- "Type error" 메시지

**해결**:
1. 로컬에서 `npm run build` 실행하여 확인
2. 타입 에러 수정
3. 코드 푸시 후 재배포

---

### 3. 의존성 문제

**증상**:
- 패키지 설치 실패
- "Cannot find module" 에러

**해결**:
1. `package.json` 확인
2. 의존성 버전 확인
3. `package-lock.json` 확인

---

## 🔧 즉시 확인할 사항

### Vercel 대시보드에서

1. **빌드 로그 확인**
   - 배포 페이지 > Build Logs 섹션
   - 에러 메시지 전체 확인
   - 3개의 에러와 1개의 경고 확인

2. **환경 변수 확인**
   - Settings > Environment Variables
   - `NEXT_PUBLIC_SUPABASE_URL` 설정 확인
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` 설정 확인

3. **빌드 설정 확인**
   - Build Command: `npm run build`
   - Install Command: `npm install`
   - Node.js 버전 확인

---

## 📝 해결 단계

### 1단계: 빌드 로그 확인

1. Vercel 배포 페이지 접속
2. Build Logs 섹션 확장
3. 에러 메시지 전체 확인
4. 에러 메시지 복사/기록

### 2단계: 원인 파악

빌드 로그에서 확인할 사항:
- 환경 변수 관련 에러
- 타입 에러
- 의존성 에러
- 기타 런타임 에러

### 3단계: 수정

**환경 변수 누락인 경우:**
1. Supabase 프로젝트에서 API 키 확인
2. Vercel에 환경 변수 추가
3. 재배포

**타입 에러인 경우:**
1. 로컬에서 빌드 실행
2. 에러 수정
3. 코드 푸시 후 재배포

### 4단계: 재배포

1. Vercel 배포 페이지에서 "Redeploy" 클릭
2. 빌드 진행 상황 확인
3. 빌드 성공 확인

---

## 🆘 긴급 해결 (환경 변수 누락)

### 즉시 수정 방법

1. **Supabase 키 확인**
   - Supabase 대시보드 > Settings > API
   - Project URL 복사
   - anon public 키 복사

2. **Vercel 환경 변수 추가**
   - Vercel 대시보드 > 프로젝트 > Settings > Environment Variables
   - Add New 클릭
   - Key: `NEXT_PUBLIC_SUPABASE_URL`
   - Value: Supabase Project URL
   - Environment: Production, Preview, Development 모두 선택
   - Save 클릭
   - 동일하게 `NEXT_PUBLIC_SUPABASE_ANON_KEY` 추가

3. **재배포**
   - 배포 페이지에서 "Redeploy" 클릭
   - 빌드 성공 확인

---

## 📋 체크리스트

배포 오류 해결을 위한 체크리스트:

- [ ] 빌드 로그 전체 확인
- [ ] 에러 메시지 기록
- [ ] 환경 변수 설정 확인
- [ ] Supabase 프로젝트 활성화 확인
- [ ] 로컬 빌드 테스트 (`npm run build`)
- [ ] 환경 변수 추가/수정
- [ ] 재배포 실행
- [ ] 빌드 성공 확인
- [ ] 배포된 사이트 접속 테스트

---

## 📚 참고 문서

- [배포 오류 분석](./DEPLOYMENT_ERROR_ANALYSIS.md)
- [Vercel 환경 변수 설정](./VERCEL_ENV_SETUP.md)
- [Supabase 설정 가이드](./SUPABASE_SETUP.md)
- [빌드 에러 수정 내역](./BUILD_ERRORS_FIXED.md)

---

## ✅ 다음 단계

1. Vercel 빌드 로그에서 정확한 에러 메시지 확인
2. 에러 원인 파악
3. 필요한 수정 사항 적용
4. 재배포 실행
5. 배포 성공 확인

---

> **LIFE OS v0.1**  
> 기준으로 돌아오는 루틴 앱

