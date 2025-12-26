# 작업 7: 커스텀 훅

## 작업 개요
재사용 가능한 커스텀 훅을 구현합니다. 컴포넌트에서 쉽게 사용할 수 있도록 합니다.

## 목표
- useLocalStorage 훅
- useSync 훅
- useBaseline 훅
- useDailyLog 훅
- usePhase 훅

## 의존성
- 작업 6: 상태 관리 (완료 필요)
- 작업 5: 동기화 서비스 (완료 필요)

## 작업 내용

### 1. useLocalStorage 훅 (`hooks/useLocalStorage.ts`)
- 로컬 저장소 읽기/쓰기
- 자동 동기화 트리거

### 2. useSync 훅 (`hooks/useSync.ts`)
- 동기화 상태 관리
- 수동 동기화 트리거
- 백그라운드 동기화

### 3. useBaseline 훅 (`hooks/useBaseline.ts`)
- Baseline 데이터 관리
- 토글 기능

### 4. useDailyLog 훅 (`hooks/useDailyLog.ts`)
- Daily Log 데이터 관리
- 날짜별 조회

### 5. usePhase 훅 (`hooks/usePhase.ts`)
- Phase 데이터 관리
- Phase 변경

## 결과물
- `hooks/useLocalStorage.ts`
- `hooks/useSync.ts`
- `hooks/useBaseline.ts`
- `hooks/useDailyLog.ts`
- `hooks/usePhase.ts`
- `hooks/index.ts` (모든 훅 export)

## 프롬프트

```
다음 요구사항에 따라 커스텀 훅을 구현해주세요:

1. useLocalStorage 훅 (hooks/useLocalStorage.ts):
   - 제네릭 타입 지원
   - 로컬 저장소 읽기/쓰기
   - 자동 동기화 트리거
   - 로딩 상태 관리
   - 에러 처리

2. useSync 훅 (hooks/useSync.ts):
   - 동기화 상태 관리
   - 수동 동기화 트리거 함수
   - 백그라운드 동기화 설정
   - 네트워크 상태 감지

3. useBaseline 훅 (hooks/useBaseline.ts):
   - Baseline 데이터 가져오기
   - Baseline 업데이트
   - Baseline 토글 (ON/OFF)
   - 로딩 상태

4. useDailyLog 훅 (hooks/useDailyLog.ts):
   - 오늘의 Daily Log 가져오기
   - 날짜별 Daily Log 조회
   - Daily Log 저장
   - Daily Log 업데이트

5. usePhase 훅 (hooks/usePhase.ts):
   - 현재 Phase 가져오기
   - Phase 변경
   - Phase 설명 가져오기

6. 모든 훅은 다음을 포함:
   - 로딩 상태
   - 에러 상태
   - 데이터
   - 액션 함수들

참고 문서:
- software_design.md (섹션 4.4.2)
- user_stories.md (US-004, US-011, US-015)
```

## 참고 문서
- [software_design.md](../../software_design.md) - 섹션 4.4.2 (로컬 저장소 동기화)
- [user_stories.md](../../user_stories.md) - US-004, US-011, US-015

## 체크리스트
- [ ] useLocalStorage 훅 구현 완료
- [ ] useSync 훅 구현 완료
- [ ] useBaseline 훅 구현 완료
- [ ] useDailyLog 훅 구현 완료
- [ ] usePhase 훅 구현 완료
- [ ] 모든 훅 export 완료
- [ ] 기본 동작 테스트 완료

