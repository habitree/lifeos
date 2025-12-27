/**
 * App Reducer
 * 상태 업데이트 로직을 담당하는 Reducer
 */

import type { AppState, AppAction, Phase } from '../types/state';
import type { User, Baseline, DailyLog } from '../types/database';

/**
 * 초기 상태
 */
export const initialState: AppState = {
  user: null,
  baseline: null,
  dailyLogs: [],
  currentPhase: 1,
  syncStatus: 'idle',
  lastSyncAt: null,
  error: null,
};

/**
 * App Reducer 함수
 * 액션에 따라 상태를 업데이트합니다.
 */
export function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
        error: null,
      };

    case 'SET_BASELINE':
      return {
        ...state,
        baseline: action.payload,
        error: null,
      };

    case 'UPDATE_BASELINE':
      if (!state.baseline) {
        return state;
      }
      return {
        ...state,
        baseline: {
          ...state.baseline,
          ...action.payload,
          updated_at: new Date().toISOString(),
        },
        error: null,
      };

    case 'SET_DAILY_LOGS':
      return {
        ...state,
        dailyLogs: action.payload,
        error: null,
      };

    case 'ADD_DAILY_LOG':
      // 중복 체크: 같은 날짜의 로그가 있으면 추가하지 않음
      const existingLogIndex = state.dailyLogs.findIndex(
        (log) => log.log_date === action.payload.log_date
      );

      if (existingLogIndex >= 0) {
        // 이미 존재하면 업데이트
        const updatedLogs = [...state.dailyLogs];
        updatedLogs[existingLogIndex] = action.payload;
        return {
          ...state,
          dailyLogs: updatedLogs,
          error: null,
        };
      }

      // 새로 추가
      return {
        ...state,
        dailyLogs: [...state.dailyLogs, action.payload],
        error: null,
      };

    case 'UPDATE_DAILY_LOG':
      const logIndex = state.dailyLogs.findIndex(
        (log) => log.id === action.payload.id
      );

      if (logIndex < 0) {
        // 로그가 없으면 추가
        return {
          ...state,
          dailyLogs: [...state.dailyLogs, action.payload],
          error: null,
        };
      }

      // 로그 업데이트
      const updatedDailyLogs = [...state.dailyLogs];
      updatedDailyLogs[logIndex] = {
        ...action.payload,
        updated_at: new Date().toISOString(),
      };

      return {
        ...state,
        dailyLogs: updatedDailyLogs,
        error: null,
      };

    case 'UPDATE_PHASE':
      return {
        ...state,
        currentPhase: action.payload,
        error: null,
      };

    case 'SET_SYNC_STATUS':
      return {
        ...state,
        syncStatus: action.payload,
        error: null,
      };

    case 'SET_LAST_SYNC_AT':
      return {
        ...state,
        lastSyncAt: action.payload,
        error: null,
      };

    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
      };

    case 'RESET_TODAY':
      // 오늘 날짜의 DailyLog만 제거
      const today = new Date().toISOString().split('T')[0];
      const filteredLogs = state.dailyLogs.filter(
        (log) => log.log_date !== today
      );

      return {
        ...state,
        dailyLogs: filteredLogs,
        error: null,
      };

    case 'RESET_STATE':
      return initialState;

    default:
      // TypeScript가 모든 케이스를 처리했는지 확인
      const _exhaustiveCheck: never = action;
      return state;
  }
}

