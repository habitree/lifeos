/**
 * 타입 정의 통합 Export
 * 프로젝트 전반에서 사용할 모든 타입을 여기서 export합니다.
 */

// 데이터베이스 타입
export type {
  User,
  Baseline,
  BaselineCheck,
  DailyLog,
  BodyState,
} from './database';

// 컴포넌트 Props 타입
export type {
  SidebarProps,
  BaselineCardProps,
  ResetButtonProps,
  DailyLogFormProps,
  PhaseSelectorProps,
  ButtonProps,
  ToggleProps,
  Phase,
} from './components';

// 상태 관리 타입
export type {
  AppState,
  AppAction,
  AppContextValue,
  SyncStatus,
} from './state';

// 서비스 타입
export type {
  LocalData,
  SyncResult,
  SyncOperation,
  SyncQueueItem,
  IDBStoreName,
} from './services';

export { StorageKey, IDB_STORE_NAMES } from './services';

