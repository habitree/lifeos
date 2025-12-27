# 배포 준비 체크리스트
## LIFE OS - Vercel 배포 전 필수 설정 사항

**작성일**: 2025-01-27  
**상태**: 배포 준비 중

---

## 📋 전체 체크리스트

### ✅ 1. 코드 준비 상태

- [x] **빌드 성공 확인**
  - ✅ `npm run build` 성공
  - ✅ 타입 에러 없음
  - ✅ ESLint 경고만 있음 (기능에 영향 없음)

- [x] **프로젝트 구조**
  - ✅ Next.js App Router 설정 완료
  - ✅ TypeScript 설정 완료
  - ✅ Tailwind CSS 설정 완료
  - ✅ 모든 페이지 및 컴포넌트 구현 완료

- [x] **배포 설정 파일**
  - ✅ `vercel.json` 생성 완료
  - ✅ `package.json` 설정 완료
  - ✅ `next.config.js` 설정 완료

---

### ⚠️ 2. Supabase 설정 (필수)

#### 2.1 Supabase 프로젝트 생성

- [ ] **Supabase 프로젝트 생성**
  - [ ] [Supabase 대시보드](https://app.supabase.com) 접속
  - [ ] 새 프로젝트 생성
  - [ ] 프로젝트 이름: `life-os` (또는 원하는 이름)
  - [ ] Database Password 설정 (저장해두세요!)
  - [ ] Region 선택 (가장 가까운 리전)
  - [ ] 프로젝트 생성 완료 대기 (2-3분)

#### 2.2 데이터베이스 스키마 설정

- [ ] **스키마 실행**
  - [ ] Supabase 대시보드 > SQL Editor 열기
  - [ ] `supabase/schema.sql` 파일 내용 복사
  - [ ] SQL Editor에 붙여넣기
  - [ ] **Run** 버튼 클릭
  - [ ] 성공 메시지 확인
  - [ ] Table Editor에서 테이블 확인:
    - [ ] `users` 테이블
    - [ ] `baselines` 테이블
    - [ ] `daily_logs` 테이블

#### 2.3 RLS 정책 설정

- [ ] **RLS 정책 실행**
  - [ ] SQL Editor에서 **New Query** 클릭
  - [ ] `supabase/rls.sql` 파일 내용 복사
  - [ ] SQL Editor에 붙여넣기
  - [ ] **Run** 버튼 클릭
  - [ ] 성공 메시지 확인
  - [ ] Authentication > Policies에서 정책 확인:
    - [ ] `users` 테이블 정책
    - [ ] `baselines` 테이블 정책
    - [ ] `daily_logs` 테이블 정책

#### 2.4 API 키 확인

- [ ] **API 키 복사**
  - [ ] Settings > API 메뉴로 이동
  - [ ] **Project URL** 복사: `https://xxxxx.supabase.co`
  - [ ] **anon public** 키 복사: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
  - [ ] ⚠️ **중요**: `service_role` 키는 절대 사용하지 마세요!

---

### ⚠️ 3. 환경 변수 설정 (필수)

#### 3.1 로컬 개발 환경

- [ ] **`.env.local` 파일 생성** (로컬 개발용)**
  - [ ] 프로젝트 루트에 `.env.local` 파일 생성
  - [ ] 다음 내용 추가:
    ```env
    NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
    ```
  - [ ] 실제 Supabase 값으로 교체
  - [ ] 파일이 `.gitignore`에 포함되어 있는지 확인 (Git에 커밋되지 않아야 함)

#### 3.2 Vercel 환경 변수 설정

- [ ] **Vercel 대시보드에서 환경 변수 설정**
  - [ ] [Vercel 대시보드](https://vercel.com/dashboard) 접속
  - [ ] 프로젝트 선택 (또는 새로 생성)
  - [ ] Settings > Environment Variables 메뉴로 이동
  - [ ] 다음 환경 변수 추가:

    **변수 1:**
    - **Key**: `NEXT_PUBLIC_SUPABASE_URL`
    - **Value**: Supabase Project URL
    - **Environment**: Production, Preview, Development 모두 선택

    **변수 2:**
    - **Key**: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
    - **Value**: Supabase anon public key
    - **Environment**: Production, Preview, Development 모두 선택

  - [ ] 각 변수 저장 확인

---

### ⚠️ 4. GitHub 저장소 설정 (필수)

- [ ] **GitHub 저장소 준비**
  - [ ] GitHub에 저장소 생성 (또는 기존 저장소 사용)
  - [ ] 프로젝트 코드 푸시
  - [ ] `.env.local` 파일이 커밋되지 않았는지 확인
  - [ ] `.gitignore`에 `.env.local` 포함 확인

---

### ⚠️ 5. Vercel 프로젝트 설정 (필수)

#### 5.1 프로젝트 생성

- [ ] **Vercel에 프로젝트 가져오기**
  - [ ] [Vercel 대시보드](https://vercel.com/dashboard) 접속
  - [ ] "Add New..." > "Project" 클릭
  - [ ] GitHub 저장소 선택
  - [ ] 프로젝트 가져오기

#### 5.2 빌드 설정

- [ ] **빌드 설정 확인**
  - [ ] Framework Preset: Next.js (자동 감지)
  - [ ] Root Directory: `./` (기본값)
  - [ ] Build Command: `npm run build` (기본값)
  - [ ] Output Directory: `.next` (기본값)
  - [ ] Install Command: `npm install` (기본값)

#### 5.3 환경 변수 확인

- [ ] **환경 변수 설정 확인**
  - [ ] Settings > Environment Variables에서 확인
  - [ ] `NEXT_PUBLIC_SUPABASE_URL` 설정 확인
  - [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` 설정 확인
  - [ ] 모든 환경(Production, Preview, Development)에 설정 확인

---

### ⚠️ 6. 첫 배포 및 확인

- [ ] **배포 실행**
  - [ ] "Deploy" 버튼 클릭
  - [ ] 빌드 진행 상황 확인
  - [ ] 빌드 성공 확인
  - [ ] 배포 완료 후 URL 확인

- [ ] **배포 후 테스트**
  - [ ] 배포된 사이트 접속
  - [ ] 홈페이지 로드 확인
  - [ ] 브라우저 콘솔에서 에러 확인
  - [ ] Supabase 연결 확인
  - [ ] Baseline 토글 작동 확인
  - [ ] Daily Log 저장 확인
  - [ ] Phase 변경 확인

---

### 📝 7. 선택 사항 (권장)

#### 7.1 커스텀 도메인

- [ ] **도메인 설정 (선택)**
  - [ ] Vercel 대시보드 > 프로젝트 > Settings > Domains
  - [ ] 도메인 추가
  - [ ] DNS 설정 (Vercel이 안내)

#### 7.2 모니터링 설정

- [ ] **Vercel Analytics 활성화 (선택)**
  - [ ] Vercel 대시보드 > 프로젝트 > Analytics
  - [ ] Analytics 활성화

#### 7.3 보안 설정

- [ ] **보안 헤더 설정 (선택)**
  - [ ] `next.config.js`에 보안 헤더 추가 고려
  - [ ] HTTPS 강제 설정 확인 (Vercel 자동)

---

## 🔍 설정 상태 요약

### ✅ 준비 완료된 항목

1. ✅ **코드 준비**
   - 빌드 성공
   - 모든 기능 구현 완료
   - 타입 에러 없음

2. ✅ **배포 설정 파일**
   - `vercel.json` 생성
   - `package.json` 설정
   - `next.config.js` 설정

3. ✅ **문서화**
   - 배포 가이드 작성
   - 환경 변수 설정 가이드 작성
   - Supabase 설정 가이드 작성

4. ✅ **Supabase 스키마 파일**
   - `supabase/schema.sql` 준비
   - `supabase/rls.sql` 준비

---

### ⚠️ 설정이 필요한 항목 (즉시 설정 필요)

1. ⚠️ **Supabase 프로젝트 생성**
   - [ ] Supabase 프로젝트 생성
   - [ ] 스키마 실행 (`supabase/schema.sql`)
   - [ ] RLS 정책 실행 (`supabase/rls.sql`)
   - [ ] API 키 확인

2. ⚠️ **환경 변수 설정**
   - [ ] 로컬 `.env.local` 파일 생성
   - [ ] Vercel 환경 변수 설정

3. ⚠️ **GitHub 저장소**
   - [ ] GitHub 저장소 생성/확인
   - [ ] 코드 푸시

4. ⚠️ **Vercel 프로젝트**
   - [ ] Vercel 프로젝트 생성
   - [ ] GitHub 저장소 연결
   - [ ] 환경 변수 설정
   - [ ] 첫 배포 실행

---

## 📝 설정 순서

### 1단계: Supabase 설정 (약 10분)

1. Supabase 프로젝트 생성
2. 스키마 실행 (`supabase/schema.sql`)
3. RLS 정책 실행 (`supabase/rls.sql`)
4. API 키 복사

### 2단계: 로컬 환경 변수 설정 (약 2분)

1. `.env.local` 파일 생성
2. Supabase URL 및 Key 입력
3. 개발 서버 실행하여 확인

### 3단계: GitHub 저장소 설정 (약 5분)

1. GitHub 저장소 생성
2. 코드 푸시
3. `.env.local`이 커밋되지 않았는지 확인

### 4단계: Vercel 배포 (약 10분)

1. Vercel 프로젝트 생성
2. GitHub 저장소 연결
3. 환경 변수 설정
4. 배포 실행
5. 배포 후 테스트

---

## 🚨 중요 주의사항

### 보안

- ⚠️ **절대 `service_role` 키를 사용하지 마세요**
- ⚠️ **`.env.local` 파일을 Git에 커밋하지 마세요**
- ⚠️ **환경 변수는 Vercel 대시보드에서만 관리하세요**

### Supabase

- ⚠️ **스키마를 먼저 실행한 후 RLS 정책을 실행하세요**
- ⚠️ **RLS 정책이 올바르게 설정되었는지 확인하세요**
- ⚠️ **익명 사용자 접근이 허용되어 있는지 확인하세요**

### 배포

- ⚠️ **환경 변수 설정 후 재배포가 필요할 수 있습니다**
- ⚠️ **첫 배포 후 모든 기능을 테스트하세요**
- ⚠️ **브라우저 콘솔에서 에러를 확인하세요**

---

## 📚 참고 문서

- [배포 가이드](./DEPLOYMENT.md)
- [Vercel 환경 변수 설정 가이드](./VERCEL_ENV_SETUP.md)
- [환경 변수 설정 가이드](./ENV_SETUP.md)
- [Supabase 설정 가이드](./SUPABASE_SETUP.md)
- [빌드 에러 수정 내역](./BUILD_ERRORS_FIXED.md)

---

## ✅ 다음 단계

모든 체크리스트를 완료한 후:

1. 프로덕션 환경에서 전체 기능 테스트
2. 성능 모니터링
3. 사용자 피드백 수집
4. 버그 수정 및 개선

---

> **LIFE OS v0.1**  
> 기준으로 돌아오는 루틴 앱

