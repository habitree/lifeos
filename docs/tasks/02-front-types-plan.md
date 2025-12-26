# 작업 2: 타입 정의

## 작업 개요
프로젝트 전반에서 사용할 TypeScript 타입을 정의합니다. 이 작업은 다른 모든 작업의 기반이 됩니다.

## 목표
- 데이터베이스 타입 정의
- 컴포넌트 Props 타입 정의
- 상태 관리 타입 정의
- 유틸리티 타입 정의

## 의존성
- 작업 1: 프로젝트 초기 설정 (완료 필요)

## 작업 내용

### 1. 데이터베이스 타입 (`types/database.ts`)
- User
- Baseline
- BaselineCheck
- DailyLog
- BodyState

### 2. 컴포넌트 Props 타입 (`types/components.ts`)
- SidebarProps
- BaselineCardProps
- ResetButtonProps
- DailyLogFormProps
- PhaseSelectorProps
- ButtonProps
- ToggleProps

### 3. 상태 관리 타입 (`types/state.ts`)
- AppState
- AppAction
- AppContextValue
- SyncStatus

### 4. 서비스 타입 (`types/services.ts`)
- LocalData
- SyncResult
- StorageKey

## 결과물
- `types/database.ts`
- `types/components.ts`
- `types/state.ts`
- `types/services.ts`
- `types/index.ts` (모든 타입 export)

## 프롬프트

```
다음 요구사항에 따라 TypeScript 타입을 정의해주세요:

1. 데이터베이스 타입 (types/database.ts):
   - User: id, created_at, current_phase (1-4)
   - Baseline: id, user_id, sleep, movement, record, updated_at
   - BaselineCheck: sleep, movement, record (모두 boolean)
   - DailyLog: id, user_id, log_date, baseline_check, one_line, body_state, memo, created_at, updated_at
   - BodyState: 'good' | 'normal' | 'heavy'

2. 컴포넌트 Props 타입 (types/components.ts):
   - SidebarProps: currentPath, isOpen, onClose
   - BaselineCardProps: type, label, value, isChecked, onToggle
   - ResetButtonProps: onReset
   - DailyLogFormProps: date, initialData, onSave
   - PhaseSelectorProps: currentPhase, onPhaseChange
   - ButtonProps: children, onClick, variant, disabled
   - ToggleProps: checked, onChange, label

3. 상태 관리 타입 (types/state.ts):
   - AppState: user, baseline, currentPhase, syncStatus
   - AppAction: 타입별 액션 정의
   - AppContextValue: state, dispatch, 액션 메서드들
   - SyncStatus: 'idle' | 'syncing' | 'success' | 'error'

4. 서비스 타입 (types/services.ts):
   - LocalData: user, baseline, dailyLogs
   - SyncResult: success, error, data
   - StorageKey: 타입 안전한 키 정의

5. 모든 타입을 types/index.ts에서 export

참고 문서:
- software_design.md (섹션 3.4)
- lifeos_PRD.md (섹션 5)
```

## 참고 문서
- [software_design.md](../../software_design.md) - 섹션 3.4 (TypeScript 타입 정의)
- [lifeos_PRD.md](../../lifeos_PRD.md) - 섹션 5 (데이터 모델)
- [user_stories.md](../../user_stories.md) - 데이터 구조 참고

## 체크리스트
- [x] 모든 데이터베이스 타입 정의 완료
- [x] 모든 컴포넌트 Props 타입 정의 완료
- [x] 상태 관리 타입 정의 완료
- [x] 서비스 타입 정의 완료
- [x] types/index.ts에서 모든 타입 export
- [x] TypeScript 컴파일 오류 없음

