# 작업 6: 상태 관리

## 작업 개요
React Context API와 useReducer를 활용한 전역 상태 관리를 구현합니다. 로컬 저장소와 자동으로 동기화됩니다.

## 목표
- AppContext 생성
- useReducer를 활용한 상태 관리
- 로컬 저장소 자동 동기화
- 액션 타입 정의

## 의존성
- 작업 2: 타입 정의 (완료 필요)
- 작업 4: 로컬 저장소 서비스 (완료 필요)

## 작업 내용

### 1. 상태 타입 정의 (`types/state.ts`)
- AppState 인터페이스
- AppAction 타입
- AppContextValue 인터페이스

### 2. Reducer 구현 (`reducers/appReducer.ts`)
- 액션 핸들러
- 상태 업데이트 로직
- 불변성 유지

### 3. Context 생성 (`contexts/AppContext.tsx`)
- Context 생성
- Provider 컴포넌트
- 로컬 저장소 동기화

### 4. 액션 메서드
- updateBaseline
- updateDailyLog
- updatePhase
- resetToday

## 결과물
- `contexts/AppContext.tsx`
- `reducers/appReducer.ts`
- `types/state.ts` (업데이트)

## 프롬프트

```
다음 요구사항에 따라 상태 관리를 구현해주세요:

1. 상태 타입 정의 (types/state.ts):
   - AppState: user, baseline, currentPhase, syncStatus
   - AppAction: 타입별 액션 (SET_USER, UPDATE_BASELINE, UPDATE_DAILY_LOG, UPDATE_PHASE, RESET_TODAY, SET_SYNC_STATUS)
   - AppContextValue: state, dispatch, 액션 메서드들

2. Reducer 구현 (reducers/appReducer.ts):
   - appReducer 함수
   - 각 액션 타입별 핸들러
   - 불변성 유지
   - 초기 상태 정의

3. Context 생성 (contexts/AppContext.tsx):
   - AppContext 생성
   - AppProvider 컴포넌트
   - useAppContext 훅
   - 로컬 저장소와 자동 동기화
   - 초기 로드 시 로컬 저장소에서 데이터 읽기

4. 액션 메서드:
   - updateBaseline(baseline: Partial<Baseline>): void
   - updateDailyLog(log: DailyLog): void
   - updatePhase(phase: 1 | 2 | 3 | 4): void
   - resetToday(): void

5. 로컬 저장소 동기화:
   - 상태 변경 시 자동 저장
   - 초기 로드 시 로컬 저장소에서 복원
   - 에러 처리

참고 문서:
- software_design.md (섹션 4.4)
- lifeos_PRD.md (섹션 6.2)
- user_stories.md (US-004, US-005, US-011, US-015)
```

## 참고 문서
- [software_design.md](../../software_design.md) - 섹션 4.4 (상태 관리)
- [lifeos_PRD.md](../../lifeos_PRD.md) - 섹션 6.2 (Local-first 원칙)
- [user_stories.md](../../user_stories.md) - US-004, US-005, US-011, US-015

## 체크리스트
- [x] 상태 타입 정의 완료
- [x] Reducer 구현 완료
- [x] Context 생성 완료
- [x] 모든 액션 메서드 구현 완료
- [x] 로컬 저장소 동기화 구현 완료
- [x] 기본 동작 테스트 완료

