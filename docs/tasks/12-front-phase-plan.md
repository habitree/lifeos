# 작업 12: Phase 페이지

## 작업 개요
Phase 페이지와 관련 컴포넌트를 구현합니다. 현재 Phase를 확인하고 변경할 수 있습니다.

## 목표
- Phase 페이지 구현
- PhaseSelector 컴포넌트
- Phase 변경 기능

## 의존성
- 작업 8: 레이아웃 컴포넌트 (완료 필요)
- 작업 9: 공통 컴포넌트 (완료 필요)
- 작업 7: 커스텀 훅 (완료 필요)

## 작업 내용

### 1. Phase 페이지 (`app/phase/page.tsx`)
- 현재 Phase 표시
- Phase 설명
- PhaseSelector 컴포넌트

### 2. PhaseSelector 컴포넌트 (`components/phase/PhaseSelector.tsx`)
- Phase 선택 (드롭다운 또는 버튼)
- Phase 설명 표시
- Phase 변경 기능

## 결과물
- `app/phase/page.tsx`
- `components/phase/PhaseSelector.tsx`
- `components/phase/index.ts` (모든 컴포넌트 export)

## 프롬프트

```
다음 요구사항에 따라 Phase 페이지를 구현해주세요:

1. Phase 페이지 (app/phase/page.tsx):
   - 현재 Phase 표시
   - Phase 설명 표시
   - PhaseSelector 컴포넌트
   - usePhase 훅 사용
   - 레이아웃 컴포넌트 사용

2. PhaseSelector 컴포넌트 (components/phase/PhaseSelector.tsx):
   - Props: currentPhase, onPhaseChange
   - Phase 선택:
     * 드롭다운 또는 버튼 그룹
     * Phase 1-4 중 선택
   - Phase 설명 표시:
     * Phase 1: Baseline - 기본 기준 회복
     * Phase 2: Stability - 안정화 단계
     * Phase 3: Growth - 성장 단계
     * Phase 4: Identity - 정체성 확립
   - Phase별 색상 적용
   - 변경 시 즉시 저장

3. 기능:
   - Phase는 자동으로 상승하지 않음
   - 무너졌다고 Phase가 자동으로 내려가지 않음
   - 사용자가 직접 선택
   - "나는 지금 이 상태다"를 선언하는 공간

4. 스타일:
   - 구글 캘린더 스타일 참고
   - Phase별 색상 구분
   - 깔끔한 디자인

참고 문서:
- software_design.md (섹션 6.3)
- lifeos_PRD.md (섹션 4.1.3)
- user_stories.md (US-013, US-014, US-015)
```

## 참고 문서
- [software_design.md](../../software_design.md) - 섹션 6.3 (Phase 화면 디자인)
- [lifeos_PRD.md](../../lifeos_PRD.md) - 섹션 4.1.3 (Phase 화면)
- [user_stories.md](../../user_stories.md) - US-013, US-014, US-015

## 체크리스트
- [x] Phase 페이지 구현 완료
- [x] PhaseSelector 컴포넌트 구현 완료
- [x] Phase 변경 기능 완료
- [x] Phase 설명 표시 완료
- [x] 스타일 적용 완료
- [ ] 기본 동작 테스트 완료

