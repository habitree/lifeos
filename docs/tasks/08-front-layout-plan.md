# 작업 8: 레이아웃 컴포넌트

## 작업 개요
사이드바와 헤더를 포함한 레이아웃 컴포넌트를 구현합니다. 구글 캘린더 스타일을 참고합니다.

## 목표
- Sidebar 컴포넌트 (반응형)
- Header 컴포넌트
- Root Layout
- 네비게이션 기능

## 의존성
- 작업 2: 타입 정의 (완료 필요)
- 작업 6: 상태 관리 (완료 필요)

## 작업 내용

### 1. Sidebar 컴포넌트 (`components/layout/Sidebar.tsx`)
- 데스크톱: 고정 사이드바 (240px)
- 모바일: Drawer 형태
- 네비게이션 메뉴
- 현재 페이지 하이라이트

### 2. Header 컴포넌트 (`components/layout/Header.tsx`)
- 날짜 표시
- Phase 표시
- 모바일 메뉴 버튼

### 3. Root Layout (`app/layout.tsx`)
- Sidebar와 Main Content 레이아웃
- 반응형 처리
- AppProvider 포함

## 결과물
- `components/layout/Sidebar.tsx`
- `components/layout/Header.tsx`
- `app/layout.tsx`
- 반응형 스타일

## 프롬프트

```
다음 요구사항에 따라 레이아웃 컴포넌트를 구현해주세요:

1. Sidebar 컴포넌트 (components/layout/Sidebar.tsx):
   - Props: currentPath, isOpen, onClose
   - 데스크톱 (lg 이상): 고정 사이드바 240px
   - 모바일: Drawer 형태, 왼쪽에서 슬라이드
   - 네비게이션 메뉴:
     * Home
     * Daily Log
     * Phase
   - 현재 페이지 하이라이트
   - 구글 캘린더 스타일 참고
   - Tailwind CSS 사용

2. Header 컴포넌트 (components/layout/Header.tsx):
   - 날짜 표시 (예: 2025년 1월 27일 월요일)
   - Phase 표시 (예: Phase 1: Baseline)
   - 모바일: 햄버거 메뉴 버튼
   - 깔끔한 디자인

3. Root Layout (app/layout.tsx):
   - Sidebar와 Main Content 레이아웃
   - 반응형 처리
   - AppProvider 포함
   - 메타데이터 설정
   - 폰트 설정

4. 반응형 처리:
   - 모바일: Sidebar는 Drawer
   - 태블릿: 접을 수 있는 Sidebar
   - 데스크톱: 고정 Sidebar

5. 스타일:
   - 구글 캘린더 스타일 참고
   - 부드러운 색상 톤
   - 적절한 여백
   - 최소주의 디자인

참고 문서:
- software_design.md (섹션 4.2, 6.4)
- lifeos_PRD.md (섹션 7)
- user_stories.md (US-002, US-006, US-007, US-013)
```

## 참고 문서
- [software_design.md](../../software_design.md) - 섹션 4.2 (레이아웃 구조), 섹션 6.4 (반응형 디자인)
- [lifeos_PRD.md](../../lifeos_PRD.md) - 섹션 7 (UI/UX 원칙)
- [user_stories.md](../../user_stories.md) - US-002, US-006, US-007, US-013

## 체크리스트
- [x] Sidebar 컴포넌트 구현 완료
- [x] Header 컴포넌트 구현 완료
- [x] Root Layout 구현 완료
- [x] 반응형 처리 완료
- [x] 네비게이션 기능 완료
- [x] 스타일 적용 완료
- [ ] 기본 동작 테스트 완료

