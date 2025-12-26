# 작업 1: 프로젝트 초기 설정

## 작업 개요
Next.js 프로젝트를 생성하고 기본 설정을 완료합니다. 이 작업은 모든 다른 작업의 기반이 됩니다.

## 목표
- Next.js 14+ (App Router) 프로젝트 생성
- TypeScript 설정
- Tailwind CSS 설정
- 기본 디렉토리 구조 생성
- 필수 의존성 설치

## 의존성
- 없음 (모든 작업의 기반)

## 작업 내용

### 1. Next.js 프로젝트 생성
```bash
npx create-next-app@latest life-os --typescript --tailwind --app --no-src-dir
```

### 2. 추가 의존성 설치
```bash
npm install @supabase/supabase-js
npm install @tanstack/react-query
npm install idb
npm install date-fns
npm install --save-dev @types/node
```

### 3. 디렉토리 구조 생성
```
life-os/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── api/
│   ├── daily-log/
│   └── phase/
├── components/
│   ├── layout/
│   ├── home/
│   ├── daily-log/
│   ├── phase/
│   └── common/
├── hooks/
├── services/
├── contexts/
├── types/
├── lib/
└── public/
```

### 4. Tailwind CSS 설정
- `tailwind.config.ts` 수정
- 색상 팔레트 설정
- 폰트 설정

### 5. TypeScript 설정
- `tsconfig.json` 확인 및 수정
- 엄격 모드 활성화

## 결과물
- Next.js 프로젝트 구조
- `tailwind.config.ts` (색상 팔레트 포함)
- `tsconfig.json`
- `package.json` (의존성 포함)
- 기본 디렉토리 구조

## 프롬프트

```
다음 요구사항에 따라 Next.js 프로젝트를 설정해주세요:

1. Next.js 14+ (App Router) 프로젝트 생성
   - TypeScript 사용
   - Tailwind CSS 설정
   - App Router 구조

2. 다음 의존성 설치:
   - @supabase/supabase-js
   - @tanstack/react-query
   - idb (IndexedDB 래퍼)
   - date-fns

3. 다음 디렉토리 구조 생성:
   - app/ (페이지 및 API 라우트)
   - components/ (레이아웃, 페이지별, 공통 컴포넌트)
   - hooks/ (커스텀 훅)
   - services/ (로컬 저장소, 동기화 서비스)
   - contexts/ (상태 관리)
   - types/ (타입 정의)
   - lib/ (유틸리티 및 Supabase 클라이언트)

4. Tailwind CSS 설정:
   - 구글 캘린더 스타일 참고
   - 색상 팔레트 설정 (primary, baseline, reset, phase)
   - 반응형 브레이크포인트 설정

5. TypeScript 설정:
   - 엄격 모드 활성화
   - 경로 별칭 설정 (@/components, @/hooks 등)

참고 문서:
- software_design.md (섹션 1, 4.1, 4.2)
- Next.js 공식 문서
```

## 참고 문서
- [software_design.md](../../software_design.md) - 섹션 1 (기술 스택), 섹션 4.1 (디자인 시스템), 섹션 4.2 (레이아웃 구조)
- [lifeos_PRD.md](../../lifeos_PRD.md) - 섹션 6 (기술 요구사항)
- [Next.js Documentation](https://nextjs.org/docs)

## 체크리스트
- [x] Next.js 프로젝트 생성 완료
- [x] 모든 의존성 설치 완료
- [x] 디렉토리 구조 생성 완료
- [x] Tailwind CSS 설정 완료
- [x] TypeScript 설정 완료
- [ ] 프로젝트 실행 확인 (`npm run dev`)

