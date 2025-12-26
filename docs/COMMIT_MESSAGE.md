# Git 커밋 가이드

## 초기 커밋

현재까지 완료된 작업을 커밋합니다.

### 커밋 명령어

```bash
# 1. 모든 파일 스테이징 (이미 완료됨)
git add .

# 2. 초기 커밋
git commit -m "feat: 프로젝트 초기 설정 및 핵심 서비스 구현

- Next.js 14+ (App Router) 프로젝트 설정
- TypeScript 타입 정의 (database, components, state, services)
- Supabase 클라이언트 설정 (클라이언트/서버 분리)
- 로컬 저장소 서비스 (IndexedDB + LocalStorage 폴백)
- 동기화 서비스 (로컬 ↔ Supabase)
- 동기화 큐 관리 (오프라인 지원)
- Supabase 데이터베이스 스키마 및 RLS 정책
- 테스트 페이지 및 문서화"
```

### 단계별 커밋 (권장)

작업 단위별로 나누어 커밋하려면:

```bash
# 1. 프로젝트 초기 설정
git add package.json next.config.js tsconfig.json tailwind.config.ts postcss.config.js .eslintrc.json .gitignore
git commit -m "chore: Next.js 프로젝트 초기 설정

- Next.js 14+ (App Router) 설정
- TypeScript 엄격 모드 활성화
- Tailwind CSS 설정 (색상 팔레트 포함)
- 포트 3001 사용 (다른 프로젝트와 격리)"

# 2. 타입 정의
git add types/
git commit -m "feat: TypeScript 타입 정의

- 데이터베이스 타입 (User, Baseline, DailyLog)
- 컴포넌트 Props 타입
- 상태 관리 타입1
- 서비스 타입"

# 3. Supabase 설정
git add lib/supabase*.ts supabase/ docs/SUPABASE_SETUP.md docs/ENV_SETUP.md
git commit -m "feat: Supabase 클라이언트 및 데이터베이스 설정

- Supabase 클라이언트 (클라이언트/서버 분리)
- 데이터베이스 스키마 (users, baselines, daily_logs)
- RLS 정책 (익명 사용자 지원)
- 환경 변수 설정 가이드"

# 4. 로컬 저장소 서비스
git add services/LocalStorageService.ts services/StorageKeys.ts app/test-storage/
git commit -m "feat: 로컬 저장소 서비스 구현

- IndexedDB 서비스 (idb 라이브러리)
- LocalStorage 폴백 지원
- 타입 안전한 저장소 인터페이스
- 테스트 페이지 추가"

# 5. 동기화 서비스
git add services/SyncService.ts services/SyncQueue.ts
git commit -m "feat: 동기화 서비스 구현

- 로컬 → Supabase 동기화
- Supabase → 로컬 동기화
- 백그라운드 동기화
- 동기화 큐 관리 (오프라인 지원)
- 충돌 해결 (로컬 우선)
- 재시도 로직"

# 6. 문서 및 기타
git add docs/ README.md *.md
git commit -m "docs: 프로젝트 문서 추가

- 작업 계획 문서
- 설정 가이드
- 테스트 가이드
- 프로젝트 격리 가이드"
```

### 원격 저장소 연결 (선택사항)

GitHub 등 원격 저장소에 연결하려면:

```bash
# 원격 저장소 추가
git remote add origin <your-repository-url>

# 브랜치 이름 설정 (선택사항)
git branch -M main

# 첫 푸시
git push -u origin main
```

