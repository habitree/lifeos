# 작업 9: 공통 컴포넌트

## 작업 개요
재사용 가능한 공통 컴포넌트를 구현합니다. 모든 페이지에서 사용됩니다.

## 목표
- Button 컴포넌트
- Toggle 컴포넌트
- Card 컴포넌트
- Input 컴포넌트 (선택)

## 의존성
- 작업 2: 타입 정의 (완료 필요)

## 작업 내용

### 1. Button 컴포넌트 (`components/common/Button.tsx`)
- 다양한 variant (primary, secondary, reset)
- 크기 옵션
- disabled 상태
- 로딩 상태

### 2. Toggle 컴포넌트 (`components/common/Toggle.tsx`)
- ON/OFF 토글
- 부드러운 애니메이션
- 접근성 고려

### 3. Card 컴포넌트 (`components/common/Card.tsx`)
- 구글 캘린더 스타일 카드
- 여백 및 그림자
- 반응형

### 4. Input 컴포넌트 (선택)
- 텍스트 입력
- 라벨 포함
- 에러 상태

## 결과물
- `components/common/Button.tsx`
- `components/common/Toggle.tsx`
- `components/common/Card.tsx`
- `components/common/Input.tsx` (선택)
- `components/common/index.ts` (모든 컴포넌트 export)

## 프롬프트

```
다음 요구사항에 따라 공통 컴포넌트를 구현해주세요:

1. Button 컴포넌트 (components/common/Button.tsx):
   - Props: children, onClick, variant, size, disabled, loading
   - Variant: 'primary', 'secondary', 'reset'
   - Size: 'sm', 'md', 'lg'
   - disabled 상태 스타일
   - 로딩 상태 표시
   - 구글 캘린더 스타일 참고
   - Tailwind CSS 사용

2. Toggle 컴포넌트 (components/common/Toggle.tsx):
   - Props: checked, onChange, label
   - ON/OFF 상태 표시
   - 부드러운 애니메이션
   - 접근성 (ARIA 속성)
   - 부드러운 색상 (baseline.on, baseline.off)
   - 클릭 가능 영역 확보

3. Card 컴포넌트 (components/common/Card.tsx):
   - Props: children, className
   - 구글 캘린더 스타일 카드
   - 적절한 여백 및 그림자
   - 반응형
   - 호버 효과 (선택)

4. Input 컴포넌트 (components/common/Input.tsx) - 선택:
   - Props: value, onChange, label, error, placeholder
   - 라벨 포함
   - 에러 상태 표시
   - 접근성 고려

5. 스타일:
   - 구글 캘린더 스타일 참고
   - 부드러운 색상 톤
   - 최소주의 디자인
   - 일관된 스타일

참고 문서:
- software_design.md (섹션 4.1, 6.1)
- lifeos_PRD.md (섹션 7)
- user_stories.md (US-022, US-023)
```

## 참고 문서
- [software_design.md](../../software_design.md) - 섹션 4.1 (디자인 시스템), 섹션 6.1 (Home 화면 디자인)
- [lifeos_PRD.md](../../lifeos_PRD.md) - 섹션 7 (UI/UX 원칙)
- [user_stories.md](../../user_stories.md) - US-022 (압박감 없는 인터페이스), US-023 (명확한 ON/OFF 상태 표시)

## 체크리스트
- [ ] Button 컴포넌트 구현 완료
- [ ] Toggle 컴포넌트 구현 완료
- [ ] Card 컴포넌트 구현 완료
- [ ] Input 컴포넌트 구현 완료 (선택)
- [ ] 모든 컴포넌트 export 완료
- [ ] 스타일 적용 완료
- [ ] 접근성 고려 완료
- [ ] 기본 동작 테스트 완료

