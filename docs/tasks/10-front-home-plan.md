# 작업 10: Home 페이지

## 작업 개요
Home 페이지와 관련 컴포넌트를 구현합니다. Baseline 3개 항목과 Reset 기능이 포함됩니다.

## 목표
- Home 페이지 구현
- BaselineCard 컴포넌트
- ResetButton 컴포넌트
- PhaseIndicator 컴포넌트
- Baseline 토글 기능

## 의존성
- 작업 8: 레이아웃 컴포넌트 (완료 필요)
- 작업 9: 공통 컴포넌트 (완료 필요)
- 작업 7: 커스텀 훅 (완료 필요)

## 작업 내용

### 1. Home 페이지 (`app/page.tsx`)
- 오늘 날짜 표시
- Baseline 3개 항목 표시
- Reset 버튼
- Phase 표시

### 2. BaselineCard 컴포넌트 (`components/home/BaselineCard.tsx`)
- Baseline 항목 표시
- ON/OFF 토글
- 구글 캘린더 스타일 카드

### 3. ResetButton 컴포넌트 (`components/home/ResetButton.tsx`)
- Reset Today 버튼
- 확인 메시지
- Baseline 초기화

### 4. PhaseIndicator 컴포넌트 (`components/home/PhaseIndicator.tsx`)
- 현재 Phase 표시
- Phase 설명

## 결과물
- `app/page.tsx`
- `components/home/BaselineCard.tsx`
- `components/home/ResetButton.tsx`
- `components/home/PhaseIndicator.tsx`
- `components/home/index.ts` (모든 컴포넌트 export)

## 프롬프트

```
다음 요구사항에 따라 Home 페이지를 구현해주세요:

1. Home 페이지 (app/page.tsx):
   - 오늘 날짜 표시 (예: 2025년 1월 27일 월요일)
   - PhaseIndicator 컴포넌트
   - BaselineCard 3개 (수면, 이동, 기록)
   - ResetButton 컴포넌트
   - useBaseline 훅 사용
   - usePhase 훅 사용
   - 레이아웃 컴포넌트 사용

2. BaselineCard 컴포넌트 (components/home/BaselineCard.tsx):
   - Props: type, label, value, isChecked, onToggle
   - Baseline 항목 표시 (예: "수면: 22:00-05:00")
   - Toggle 컴포넌트 사용
   - Card 컴포넌트 사용
   - ON/OFF 상태 시각적 표시
   - 클릭 시 토글

3. ResetButton 컴포넌트 (components/home/ResetButton.tsx):
   - Props: onReset
   - "🔄 Reset Today" 버튼
   - 클릭 시 확인 메시지: "오늘은 돌아오기만 하면 된다"
   - Baseline 3개만 남기고 나머지 숨김
   - 모든 Baseline OFF로 초기화

4. PhaseIndicator 컴포넌트 (components/home/PhaseIndicator.tsx):
   - Props: currentPhase
   - Phase 표시 (예: "Phase 1: Baseline")
   - Phase별 색상 적용

5. 기능:
   - Baseline 토글 시 즉시 로컬 저장
   - 백그라운드 동기화
   - 점수나 연속일 표시 없음
   - 압박감 없는 디자인

참고 문서:
- software_design.md (섹션 6.1)
- lifeos_PRD.md (섹션 4.1.1)
- user_stories.md (US-002, US-003, US-004, US-005, US-006)
```

## 참고 문서
- [software_design.md](../../software_design.md) - 섹션 6.1 (Home 화면 디자인)
- [lifeos_PRD.md](../../lifeos_PRD.md) - 섹션 4.1.1 (Home 화면)
- [user_stories.md](../../user_stories.md) - US-002, US-003, US-004, US-005, US-006

## 체크리스트
- [x] Home 페이지 구현 완료
- [x] BaselineCard 컴포넌트 구현 완료
- [x] ResetButton 컴포넌트 구현 완료
- [x] PhaseIndicator 컴포넌트 구현 완료
- [x] Baseline 토글 기능 완료
- [x] Reset 기능 완료
- [x] 스타일 적용 완료
- [ ] 기본 동작 테스트 완료

