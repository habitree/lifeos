# Supabase 빠른 시작 가이드

이 가이드는 Supabase 설정을 빠르게 시작할 수 있도록 도와줍니다.

## 🚀 5분 안에 시작하기

### 1단계: Supabase 프로젝트 생성 (2분)

1. [Supabase 대시보드](https://app.supabase.com) 접속
2. **New Project** 클릭
3. 프로젝트 정보 입력:
   - Name: `life-os`
   - Database Password: 강력한 비밀번호 설정
   - Region: 가장 가까운 리전
4. **Create new project** 클릭
5. 프로젝트 생성 완료 대기

### 2단계: 환경 변수 설정 (1분)

1. Supabase 대시보드 > **Settings** > **API**
2. 다음 정보 복사:
   - **Project URL**
   - **anon public** 키

3. 프로젝트 루트에 `.env.local` 파일 생성:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 3단계: 데이터베이스 스키마 실행 (1분)

1. Supabase 대시보드 > **SQL Editor** > **New Query**
2. `supabase/schema.sql` 파일 내용 복사
3. 붙여넣기 후 **Run** 클릭
4. 성공 메시지 확인

### 4단계: RLS 정책 실행 (1분)

1. SQL Editor > **New Query**
2. `supabase/rls.sql` 파일 내용 복사
3. 붙여넣기 후 **Run** 클릭
4. 성공 메시지 확인

### 5단계: 확인 (30초)

1. **Table Editor**에서 테이블 확인:
   - ✅ `users`
   - ✅ `baselines`
   - ✅ `daily_logs`

2. 개발 서버 재시작:

```bash
npm run dev
```

## ✅ 완료!

이제 Supabase가 설정되었습니다. 다음 작업을 진행하세요:

- [ ] 로컬 저장소 서비스 구현
- [ ] 동기화 서비스 구현
- [ ] API Routes 구현

## 📚 상세 가이드

더 자세한 정보는 다음 문서를 참고하세요:

- [Supabase 설정 가이드](./SUPABASE_SETUP.md) - 상세한 설정 방법
- [환경 변수 설정](./ENV_SETUP.md) - 환경 변수 상세 가이드

## ❓ 문제 해결

### 환경 변수가 로드되지 않는 경우

- `.env.local` 파일이 프로젝트 루트에 있는지 확인
- 개발 서버 재시작
- 파일 이름이 정확한지 확인 (`.env.local`)

### SQL 실행 오류

- `schema.sql`을 먼저 실행했는지 확인
- SQL Editor에서 오류 메시지 확인
- Supabase 프로젝트가 활성화되어 있는지 확인

### 연결 오류

- API 키가 올바른지 확인
- Supabase 프로젝트 상태 확인
- 네트워크 연결 확인

