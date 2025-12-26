# LIFE OS

> 기준으로 돌아오는 루틴 앱

**무너져도 다시 기준으로 돌아오기**

---

## 📖 개요

LIFE OS는 목표 달성을 위한 앱이 아닙니다.  
**무너져도 다시 기준으로 돌아오기 위한 앱**입니다.

* 연속성보다 **복귀**
* 성과보다 **기준**
* 관리보다 **회복**

이 앱은 "잘 사는 사람"을 만들지 않습니다.  
**"다시 사는 사람"을 만듭니다.**

---

## 🎯 핵심 철학

1. **Baseline이 전부다** - 3개의 절대 기준만 존재
2. **확장은 옵션이고, 복귀는 필수다** - 성장보다 회복 우선
3. **기록은 평가가 아니라 좌표다** - 데이터는 판단 도구가 아닌 위치 확인
4. **실패라는 개념은 존재하지 않는다** - Reset은 복귀 선언
5. **오늘의 성공은 '기준으로 돌아왔는가'다** - 달성률이 아닌 복귀 여부

---

## ✨ 주요 기능

### Baseline (절대 기준)

* 딱 **3개의 절대 기준**만 가집니다
* 예시: 수면(22:00-05:00), 이동(1km 이상), 기록(3줄)
* 점수 없음, 연속일 없음, ON/OFF만 존재

### Reset 기능

* Reset은 실패가 아닌 **복귀 선언**
* Reset 버튼을 누르면 Baseline 3개만 남고 나머지는 숨김
* 메시지: "오늘은 돌아오기만 하면 된다"

### Phase System

* 성장 단계가 아닌 **현재 상태**를 나타냅니다
* Phase 1: Baseline
* Phase 2: Stability
* Phase 3: Growth
* Phase 4: Identity
* 사용자가 직접 선택하며, 자동으로 변하지 않습니다

### 조용한 앱

* 알림 폭탄 없음
* 통계 과시 없음
* 경쟁 요소 없음
* 당신의 기준을 조용히 지켜봅니다

---

## 🛠️ 기술 스택

- Next.js 14+ (App Router)
- TypeScript
- Tailwind CSS
- Supabase
- React Query (TanStack Query)
- IndexedDB (idb)

---

## 🚀 시작하기

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경 변수 설정

Supabase를 사용하기 위해 환경 변수를 설정해야 합니다.

프로젝트 루트에 `.env.local` 파일을 생성하고 다음 내용을 추가하세요:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

자세한 설정 방법은 [환경 변수 설정 가이드](./docs/ENV_SETUP.md)를 참고하세요.

### 3. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3001](http://localhost:3001)을 열어 확인하세요.

> **참고**: 이 프로젝트는 포트 3001을 사용합니다. 다른 프로젝트와의 포트 충돌을 방지하기 위함입니다.

---

## 📁 프로젝트 구조

```
life-os/
├── app/              # Next.js App Router (페이지 및 API 라우트)
├── components/       # React 컴포넌트
│   ├── layout/      # 레이아웃 컴포넌트
│   ├── home/        # Home 페이지 컴포넌트
│   ├── daily-log/   # Daily Log 페이지 컴포넌트
│   ├── phase/       # Phase 페이지 컴포넌트
│   └── common/      # 공통 컴포넌트
├── hooks/           # 커스텀 훅
├── services/        # 로컬 저장소, 동기화 서비스
├── contexts/        # 상태 관리 (Context API)
├── types/           # TypeScript 타입 정의
└── lib/             # 유틸리티 및 Supabase 클라이언트
```

---

## 🔧 Supabase 설정

Supabase를 사용하기 위해 다음 설정이 필요합니다:

1. [Supabase 프로젝트 생성 및 데이터베이스 설정](./docs/SUPABASE_SETUP.md)
2. [환경 변수 설정](./docs/ENV_SETUP.md)

> 📖 **상세 가이드**: [Supabase 설정 가이드](./docs/SUPABASE_SETUP.md)를 참고하세요.

---

## 🧪 테스트

### LocalStorageService 테스트

로컬 저장소 서비스를 테스트하려면:

1. 개발 서버 실행: `npm run dev`
2. 브라우저에서 `http://localhost:3001/test-storage` 접속
3. "테스트 실행" 버튼 클릭

자세한 내용은 [테스트 가이드](./docs/TEST_STORAGE.md)를 참고하세요.

---

## 📱 MVP 화면

1. **Home 화면**  
   * 오늘 날짜  
   * Baseline 3개 (ON/OFF)  
   * Reset Today 버튼  
   * 현재 Phase 표시
2. **Daily Log 화면**  
   * 오늘의 기준 한 줄 (필수)  
   * 몸 상태 (좋음/보통/무거움)  
   * 자유 메모 (선택)
3. **Phase 화면**  
   * 현재 Phase 표시  
   * Phase 설명 문구  
   * Phase 수동 변경

---

## 🚫 MVP에서 제외되는 기능

* ❌ 통계 그래프
* ❌ 목표 관리 시스템
* ❌ 알림 시스템 (또는 최소한만)
* ❌ SNS 기능
* ❌ 연속일 카운터
* ❌ 점수/랭킹 시스템

---

## 💾 Local-first 원칙

* 모든 기록은 로컬 저장 우선
* 서버는 백업 역할만
* 로그인 없이도 사용 가능
* 데이터 소유권은 사용자에게 있음

> 내 삶의 기준은 서버 장애와 함께 사라지지 않습니다.

---

## 📚 문서

- [설계 문서](./software_design.md) - 앱의 철학과 설계 원칙
- [PRD 문서](./docs/prd/lifeos.md) - 제품 요구사항 문서
- [Supabase 설정 가이드](./docs/SUPABASE_SETUP.md)
- [로컬 저장소 테스트 가이드](./docs/TEST_STORAGE.md)
- [GitHub Actions 설정 가이드](./doc/question/GITHUB_ACTIONS_SETUP.md)
- [GitHub Secrets 설정 가이드](./doc/question/GITHUB_SECRETS_SETUP.md)

---

## 🛠️ 개발 상태

현재 **개발 중**입니다. MVP 개발을 진행 중입니다.

---

## 📝 라이선스

이 프로젝트는 개인 프로젝트입니다.

---

## 🙏 이 앱이 지키는 문장

> 이 앱은 나를 밀어붙이지 않습니다.  
> 이 앱은 내가 돌아올 자리를 남겨둡니다.

---

## 📌 마지막 한 줄

이 앱은 완성되지 않습니다.  
**이 앱은 살아 있는 동안 함께 조정됩니다.**

---

**LIFE OS v0.1**  
© 2025 habitree

