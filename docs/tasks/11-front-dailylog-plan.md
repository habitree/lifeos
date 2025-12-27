# 작업 11: Daily Log 페이지

## 작업 개요
Daily Log 페이지와 관련 컴포넌트를 구현합니다. 하루의 기록을 입력하고 저장할 수 있습니다.

## 목표
- Daily Log 페이지 구현
- DailyLogForm 컴포넌트
- DatePicker 컴포넌트 (선택)
- 기록 저장 기능

## 의존성
- 작업 8: 레이아웃 컴포넌트 (완료 필요)
- 작업 9: 공통 컴포넌트 (완료 필요)
- 작업 7: 커스텀 훅 (완료 필요)

## 작업 내용

### 1. Daily Log 페이지 (`app/daily-log/page.tsx`)
- 오늘 날짜 표시
- DailyLogForm 컴포넌트
- 저장 기능

### 2. DailyLogForm 컴포넌트 (`components/daily-log/DailyLogForm.tsx`)
- 오늘의 기준 한 줄 입력
- 몸 상태 선택 (라디오)
- 자유 메모 입력
- 저장 버튼

### 3. DatePicker 컴포넌트 (선택) (`components/daily-log/DatePicker.tsx`)
- 날짜 선택
- 이전 기록 조회

## 결과물
- `app/daily-log/page.tsx`
- `components/daily-log/DailyLogForm.tsx`
- `components/daily-log/DatePicker.tsx` (선택)
- `components/daily-log/index.ts` (모든 컴포넌트 export)

## 프롬프트

```
다음 요구사항에 따라 Daily Log 페이지를 구현해주세요:

1. Daily Log 페이지 (app/daily-log/page.tsx):
   - 오늘 날짜 표시
   - DailyLogForm 컴포넌트
   - useDailyLog 훅 사용
   - 레이아웃 컴포넌트 사용
   - 저장 성공 시 피드백 (조용하게)

2. DailyLogForm 컴포넌트 (components/daily-log/DailyLogForm.tsx):
   - Props: date, initialData, onSave
   - 오늘의 기준 한 줄 입력 (필수, 하지만 빈 값도 저장 가능)
   - 몸 상태 선택:
     * 라디오 버튼: "좋음", "보통", "무거움"
     * 선택하지 않아도 저장 가능
   - 자유 메모 입력 (선택, 여러 줄)
   - 저장 버튼: "저장" 또는 "기록하기"
   - 빈 기록도 저장 가능
   - 실패 개념 없음

3. DatePicker 컴포넌트 (선택) (components/daily-log/DatePicker.tsx):
   - 날짜 선택 기능
   - 이전 기록 조회
   - 기록 수정 가능

4. 기능:
   - 저장 시 즉시 로컬 저장
   - 백그라운드 동기화
   - Baseline 체크를 못 해도 저장 가능
   - 압박감 없는 디자인

5. 스타일:
   - 구글 캘린더 스타일 참고
   - 깔끔한 폼 디자인
   - 적절한 여백

참고 문서:
- software_design.md (섹션 6.2)
- lifeos_PRD.md (섹션 4.1.2)
- user_stories.md (US-007, US-008, US-009, US-010, US-011, US-012)
```

## 참고 문서
- [software_design.md](../../software_design.md) - 섹션 6.2 (Daily Log 화면 디자인)
- [lifeos_PRD.md](../../lifeos_PRD.md) - 섹션 4.1.2 (Daily Log 화면)
- [user_stories.md](../../user_stories.md) - US-007, US-008, US-009, US-010, US-011, US-012

## 체크리스트
- [x] Daily Log 페이지 구현 완료
- [x] DailyLogForm 컴포넌트 구현 완료
- [x] DatePicker 컴포넌트 구현 완료 (선택)
- [x] 기록 저장 기능 완료
- [x] 빈 기록 저장 가능 확인
- [x] 스타일 적용 완료
- [ ] 기본 동작 테스트 완료

