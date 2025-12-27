# 배포 빠른 시작 가이드
## LIFE OS - 즉시 배포하기

**작성일**: 2025-01-27

이 가이드는 배포를 빠르게 시작할 수 있도록 단계별로 안내합니다.

---

## 🚀 빠른 시작 (약 30분)

### 1단계: Supabase 프로젝트 생성 (10분)

#### 1.1 프로젝트 생성

1. [Supabase 대시보드](https://app.supabase.com) 접속 및 로그인
2. **New Project** 클릭
3. 프로젝트 정보 입력:
   - **Name**: `life-os`
   - **Database Password**: 강력한 비밀번호 설정 (저장!)
   - **Region**: 가장 가까운 리전 선택
4. **Create new project** 클릭
5. 프로젝트 생성 완료 대기 (2-3분)

#### 1.2 스키마 실행

1. Supabase 대시보드 > **SQL Editor** 클릭
2. **New Query** 클릭
3. 프로젝트의 `supabase/schema.sql` 파일 열기
4. 전체 내용 복사
5. SQL Editor에 붙여넣기
6. **Run** 버튼 클릭 (또는 `Ctrl+Enter`)
7. ✅ 성공 메시지 확인

#### 1.3 RLS 정책 실행

1. SQL Editor에서 **New Query** 클릭
2. 프로젝트의 `supabase/rls.sql` 파일 열기
3. 전체 내용 복사
4. SQL Editor에 붙여넣기
5. **Run** 버튼 클릭
6. ✅ 성공 메시지 확인

#### 1.4 API 키 복사

1. **Settings** > **API** 메뉴로 이동
2. **Project URL** 복사 → 나중에 사용
3. **anon public** 키 복사 → 나중에 사용
4. ⚠️ **주의**: `service_role` 키는 사용하지 마세요!

---

### 2단계: 로컬 환경 변수 설정 (2분)

#### 2.1 .env.local 파일 생성

프로젝트 루트에 `.env.local` 파일을 생성하세요:

**Windows:**
```powershell
New-Item -Path .env.local -ItemType File
```

**Mac/Linux:**
```bash
touch .env.local
```

#### 2.2 환경 변수 입력

`.env.local` 파일에 다음 내용을 추가하세요:

```env
NEXT_PUBLIC_SUPABASE_URL=여기에_복사한_Project_URL_붙여넣기
NEXT_PUBLIC_SUPABASE_ANON_KEY=여기에_복사한_anon_public_키_붙여넣기
```

**예시:**
```env
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYxNjIzOTAyMiwiZXhwIjoxOTMxODE1MDIyfQ.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

#### 2.3 로컬 테스트

```bash
npm run dev
```

브라우저에서 `http://localhost:3001` 접속하여 정상 작동 확인

---

### 3단계: GitHub 저장소 준비 (5분)

#### 3.1 저장소 생성

1. [GitHub](https://github.com) 접속
2. **New repository** 클릭
3. 저장소 이름 입력: `life-os`
4. **Create repository** 클릭

#### 3.2 코드 푸시

```bash
# Git 초기화 (아직 안 했다면)
git init

# 원격 저장소 추가
git remote add origin https://github.com/your-username/life-os.git

# 파일 추가
git add .

# 커밋
git commit -m "Initial commit: LIFE OS v0.1"

# 푸시
git push -u origin main
```

#### 3.3 .env.local 확인

⚠️ **중요**: `.env.local` 파일이 Git에 커밋되지 않았는지 확인:

```bash
git status
```

`.env.local`이 목록에 나타나면 안 됩니다. 나타나면:

```bash
# .gitignore 확인
cat .gitignore | grep .env.local

# .gitignore에 없으면 추가
echo ".env.local" >> .gitignore
```

---

### 4단계: Vercel 배포 (10분)

#### 4.1 Vercel 프로젝트 생성

1. [Vercel 대시보드](https://vercel.com/dashboard) 접속
2. GitHub 계정으로 로그인 (처음이면 가입)
3. **Add New...** > **Project** 클릭
4. GitHub 저장소 선택 (`life-os`)
5. **Import** 클릭

#### 4.2 환경 변수 설정

1. 프로젝트 설정 화면에서 **Environment Variables** 섹션 찾기
2. **Add** 클릭
3. 첫 번째 변수 추가:
   - **Key**: `NEXT_PUBLIC_SUPABASE_URL`
   - **Value**: Supabase Project URL (1단계에서 복사한 것)
   - **Environment**: Production, Preview, Development 모두 체크
   - **Add** 클릭
4. 두 번째 변수 추가:
   - **Key**: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **Value**: Supabase anon public key (1단계에서 복사한 것)
   - **Environment**: Production, Preview, Development 모두 체크
   - **Add** 클릭

#### 4.3 배포 실행

1. **Deploy** 버튼 클릭
2. 빌드 진행 상황 확인
3. ✅ 빌드 성공 대기
4. 배포 완료 후 URL 확인

#### 4.4 배포 확인

1. 배포된 URL 접속
2. 브라우저 개발자 도구 (F12) 열기
3. Console 탭에서 에러 확인
4. 다음 기능 테스트:
   - [ ] 홈페이지 로드
   - [ ] Baseline 토글
   - [ ] Daily Log 저장
   - [ ] Phase 변경

---

## ✅ 체크리스트

배포 전 최종 확인:

- [ ] Supabase 프로젝트 생성 완료
- [ ] 스키마 실행 완료
- [ ] RLS 정책 실행 완료
- [ ] API 키 복사 완료
- [ ] 로컬 `.env.local` 파일 생성 완료
- [ ] 로컬 테스트 성공
- [ ] GitHub 저장소 생성 완료
- [ ] 코드 푸시 완료
- [ ] `.env.local`이 Git에 커밋되지 않음 확인
- [ ] Vercel 프로젝트 생성 완료
- [ ] Vercel 환경 변수 설정 완료
- [ ] 배포 성공
- [ ] 배포 후 테스트 완료

---

## 🆘 문제 해결

### Supabase 연결 오류

**증상**: 브라우저 콘솔에 Supabase 연결 에러

**해결**:
1. Vercel 환경 변수 확인
2. Supabase 프로젝트 활성화 확인
3. RLS 정책 확인
4. 환경 변수 변경 후 재배포

### 빌드 실패

**증상**: Vercel 빌드 실패

**해결**:
1. 빌드 로그 확인
2. 환경 변수 이름 확인 (`NEXT_PUBLIC_` 접두사)
3. 로컬에서 `npm run build` 실행하여 확인

### 데이터 저장 안 됨

**증상**: 데이터가 저장되지 않음

**해결**:
1. Supabase RLS 정책 확인
2. 브라우저 콘솔 에러 확인
3. Supabase 대시보드에서 테이블 확인

---

## 📚 상세 가이드

더 자세한 내용은 다음 문서를 참고하세요:

- [배포 가이드](./DEPLOYMENT.md) - 전체 배포 프로세스
- [배포 체크리스트](./DEPLOYMENT_CHECKLIST.md) - 상세 체크리스트
- [Vercel 환경 변수 설정](./VERCEL_ENV_SETUP.md) - 환경 변수 상세 가이드
- [Supabase 설정 가이드](./SUPABASE_SETUP.md) - Supabase 상세 설정

---

> **LIFE OS v0.1**  
> 기준으로 돌아오는 루틴 앱

