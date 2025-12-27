# 배포 오류 분석 및 해결 가이드
## LIFE OS - 배포 오류 확인 및 수정

**작성일**: 2025-01-27

---

## 🔍 발견된 문제

### 1. 잘못된 도메인 접속

**문제**: `https://lifeos.vercel.app`에 접속했지만, 이것은 다른 프로젝트("LifeOs: Smart Budget & Health")입니다.

**해결**: 올바른 배포 URL을 확인해야 합니다.

---

## 📋 배포 오류 확인 체크리스트

### Vercel 배포 페이지에서 확인할 사항

1. **배포 상태 확인**
   - [ ] 배포가 성공했는지 확인
   - [ ] "This deployment had an error." 메시지 확인
   - [ ] 빌드 로그 확인

2. **배포 URL 확인**
   - [ ] Production URL 확인
   - [ ] Preview URL 확인
   - [ ] 올바른 URL로 접속

3. **환경 변수 확인**
   - [ ] `NEXT_PUBLIC_SUPABASE_URL` 설정 확인
   - [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` 설정 확인
   - [ ] 모든 환경(Production, Preview, Development)에 설정 확인

4. **빌드 로그 확인**
   - [ ] 빌드 에러 메시지 확인
   - [ ] 타입 에러 확인
   - [ ] 환경 변수 누락 확인

---

## 🚨 일반적인 배포 오류 및 해결 방법

### 1. 환경 변수 누락

**증상**: 
- 빌드는 성공하지만 런타임 에러 발생
- Supabase 연결 실패
- "Missing Supabase environment variables" 에러

**해결**:
1. Vercel 대시보드 > Settings > Environment Variables 확인
2. 다음 변수가 설정되었는지 확인:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. 모든 환경(Production, Preview, Development)에 설정 확인
4. 환경 변수 변경 후 재배포

---

### 2. Supabase 연결 오류

**증상**:
- 브라우저 콘솔에 Supabase 연결 에러
- 데이터 저장/조회 실패

**해결**:
1. Supabase 프로젝트가 활성화되어 있는지 확인
2. API 키가 올바른지 확인 (`anon public` 키 사용)
3. RLS 정책이 올바르게 설정되었는지 확인
4. Supabase 대시보드에서 프로젝트 상태 확인

---

### 3. 빌드 실패

**증상**:
- Vercel 빌드 실패
- 타입 에러
- 의존성 설치 실패

**해결**:
1. 로컬에서 `npm run build` 실행하여 확인
2. 빌드 로그에서 에러 메시지 확인
3. `package.json`의 의존성 확인
4. Node.js 버전 확인 (Vercel은 자동 감지)

---

### 4. 잘못된 프로젝트 URL

**증상**:
- 다른 프로젝트가 표시됨
- 예상과 다른 내용이 표시됨

**해결**:
1. Vercel 배포 페이지에서 올바른 URL 확인
2. Production 배포 URL 확인
3. 프로젝트 이름 확인 (`lifeos` vs `life-os`)

---

## 🔧 즉시 확인할 사항

### Vercel 대시보드에서

1. **배포 상태 확인**
   - 프로젝트 > Deployments
   - 최신 배포의 상태 확인
   - "Error" 또는 "Failed" 상태인지 확인

2. **빌드 로그 확인**
   - 배포 클릭 > Build Logs 탭
   - 에러 메시지 확인
   - 타입 에러, 환경 변수 에러 등 확인

3. **환경 변수 확인**
   - Settings > Environment Variables
   - 필수 환경 변수 설정 확인
   - 환경(Production, Preview, Development) 확인

4. **배포 URL 확인**
   - 배포 페이지에서 Production URL 확인
   - 올바른 URL로 접속

---

## 📝 배포 오류 해결 단계

### 1단계: 오류 확인

1. Vercel 대시보드 접속
2. 프로젝트 선택 (`lifeos`)
3. 최신 배포 확인
4. 빌드 로그 확인
5. 에러 메시지 기록

### 2단계: 원인 파악

1. 환경 변수 누락 여부 확인
2. Supabase 연결 문제 확인
3. 빌드 에러 확인
4. 타입 에러 확인

### 3단계: 수정

1. 환경 변수 설정/수정
2. 코드 수정 (필요한 경우)
3. 재배포 실행

### 4단계: 확인

1. 배포 성공 확인
2. 배포된 사이트 접속
3. 기능 테스트
4. 브라우저 콘솔 에러 확인

---

## 🆘 긴급 해결 방법

### 환경 변수가 누락된 경우

1. Vercel 대시보드 > Settings > Environment Variables
2. 다음 변수 추가:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   ```
3. 모든 환경에 적용
4. 재배포 실행

### Supabase 연결 오류인 경우

1. Supabase 대시보드에서 프로젝트 상태 확인
2. API 키 확인 (Settings > API)
3. RLS 정책 확인 (Authentication > Policies)
4. 환경 변수 재확인 후 재배포

---

## 📚 참고 문서

- [배포 가이드](./DEPLOYMENT.md)
- [Vercel 환경 변수 설정](./VERCEL_ENV_SETUP.md)
- [Supabase 설정 가이드](./SUPABASE_SETUP.md)
- [빌드 에러 수정 내역](./BUILD_ERRORS_FIXED.md)

---

## ✅ 다음 단계

배포 오류를 확인한 후:

1. 오류 원인 파악
2. 필요한 수정 사항 적용
3. 재배포 실행
4. 배포 성공 확인
5. 기능 테스트

---

> **LIFE OS v0.1**  
> 기준으로 돌아오는 루틴 앱

