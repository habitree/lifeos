/**
 * 상태 관리 타입 정의
 * React Context API와 useReducer를 위한 타입들
 */

import { User, Baseline, DailyLog } from './database';

/**
 * 동기화 상태
 */
export type SyncStatus = 'idle' | 'syncing' | 'success' | 'error';

/**
 * Phase 타입
 */
export type Phase = 1 | 2 | 3 | 4;

/**
 * 애플리케이션 전체 상태
 */
export interface AppState {
  user: User | null;
  baseline: Baseline | null;
  dailyLogs: DailyLog[];
  currentPhase: Phase;
  syncStatus: SyncStatus;
  lastSyncAt: string | null;
  error: string | null;
}

/**
 * 액션 타입
 */
export type AppAction =
  | { type: 'SET_USER'; payload: User }
  | { type: 'SET_BASELINE'; payload: Baseline }
  | { type: 'UPDATE_BASELINE'; payload: Partial<Baseline> }
  | { type: 'SET_DAILY_LOGS'; payload: DailyLog[] }
  | { type: 'ADD_DAILY_LOG'; payload: DailyLog }
  | { type: 'UPDATE_DAILY_LOG'; payload: DailyLog }
  | { type: 'UPDATE_PHASE'; payload: Phase }
  | { type: 'SET_SYNC_STATUS'; payload: SyncStatus }
  | { type: 'SET_LAST_SYNC_AT'; payload: string }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'RESET_TODAY' }
  | { type: 'RESET_STATE' };

/**
 * App Context 값
 */
export interface AppContextValue {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  // 액션 메서드들
  setUser: (user: User) => void;
  setBaseline: (baseline: Baseline) => void;
  updateBaseline: (updates: Partial<Baseline>) => void;
  setDailyLogs: (logs: DailyLog[]) => void;
  addDailyLog: (log: DailyLog) => void;
  updateDailyLog: (log: DailyLog) => void;
  updatePhase: (phase: Phase) => void;
  setSyncStatus: (status: SyncStatus) => void;
  resetToday: () => void;
  resetState: () => void;
}

