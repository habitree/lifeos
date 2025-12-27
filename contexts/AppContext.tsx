/**
 * App Context
 * 전역 상태 관리를 위한 Context API 구현
 * 로컬 저장소와 자동 동기화
 */

'use client';

import React, { createContext, useContext, useReducer, useEffect, useCallback, useMemo } from 'react';
import { appReducer, initialState } from '../reducers/appReducer';
import { localStorageService } from '../services/LocalStorageService';
import { IDB_STORE_NAMES } from '../types/services';
import type { AppState, AppAction, AppContextValue, Phase, SyncStatus } from '../types/state';
import type { User, Baseline, DailyLog } from '../types/database';

/**
 * AppContext 생성
 */
const AppContext = createContext<AppContextValue | undefined>(undefined);

/**
 * AppProvider Props
 */
interface AppProviderProps {
  children: React.ReactNode;
}

/**
 * AppProvider 컴포넌트
 * 전역 상태를 제공하고 로컬 저장소와 동기화합니다.
 */
export function AppProvider({ children }: AppProviderProps) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const [isInitialized, setIsInitialized] = React.useState(false);

  /**
   * 로컬 저장소에서 초기 데이터 로드
   */
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        // User 로드
        const userId = localStorage.getItem('life-os:user-id') || 'default-user';
        const user = await localStorageService.get<User>(
          IDB_STORE_NAMES.USER,
          userId
        );

        if (user) {
          dispatch({ type: 'SET_USER', payload: user });

          // Baseline 로드
          const baseline = await localStorageService.getByIndex<Baseline>(
            IDB_STORE_NAMES.BASELINE,
            'user_id',
            userId
          ).then((items) => items[0] || null);

          if (baseline) {
            dispatch({ type: 'SET_BASELINE', payload: baseline });
          }

          // DailyLogs 로드
          const dailyLogs = await localStorageService.getByIndex<DailyLog>(
            IDB_STORE_NAMES.DAILY_LOGS,
            'user_id',
            userId
          );

          if (dailyLogs && dailyLogs.length > 0) {
            dispatch({ type: 'SET_DAILY_LOGS', payload: dailyLogs });
          }

          // Phase 로드
          const savedPhase = localStorage.getItem('life-os:current-phase');
          if (savedPhase) {
            const phase = parseInt(savedPhase, 10) as Phase;
            if (phase >= 1 && phase <= 4) {
              dispatch({ type: 'UPDATE_PHASE', payload: phase });
            }
          }
        }

        setIsInitialized(true);
      } catch (error) {
        console.error('초기 데이터 로드 오류:', error);
        dispatch({
          type: 'SET_ERROR',
          payload: error instanceof Error ? error.message : '데이터 로드 실패',
        });
        setIsInitialized(true);
      }
    };

    loadInitialData();
  }, []);

  /**
   * 상태 변경 시 로컬 저장소에 자동 저장
   */
  useEffect(() => {
    if (!isInitialized) return;

    const saveToLocalStorage = async () => {
      try {
        if (state.user) {
          await localStorageService.set(
            IDB_STORE_NAMES.USER,
            state.user.id,
            state.user
          );
          localStorage.setItem('life-os:user-id', state.user.id);
        }

        if (state.baseline) {
          await localStorageService.set(
            IDB_STORE_NAMES.BASELINE,
            state.baseline.id,
            state.baseline
          );
        }

        // DailyLogs 저장
        for (const log of state.dailyLogs) {
          await localStorageService.set(
            IDB_STORE_NAMES.DAILY_LOGS,
            log.id,
            log
          );
        }

        // Phase 저장
        localStorage.setItem('life-os:current-phase', state.currentPhase.toString());
      } catch (error) {
        console.error('로컬 저장소 저장 오류:', error);
        dispatch({
          type: 'SET_ERROR',
          payload: error instanceof Error ? error.message : '저장 실패',
        });
      }
    };

    saveToLocalStorage();
  }, [state.user, state.baseline, state.dailyLogs, state.currentPhase, isInitialized]);

  /**
   * 액션 메서드들
   */
  const setUser = useCallback((user: User) => {
    dispatch({ type: 'SET_USER', payload: user });
  }, []);

  const setBaseline = useCallback((baseline: Baseline) => {
    dispatch({ type: 'SET_BASELINE', payload: baseline });
  }, []);

  const updateBaseline = useCallback((updates: Partial<Baseline>) => {
    dispatch({ type: 'UPDATE_BASELINE', payload: updates });
  }, []);

  const setDailyLogs = useCallback((logs: DailyLog[]) => {
    dispatch({ type: 'SET_DAILY_LOGS', payload: logs });
  }, []);

  const addDailyLog = useCallback((log: DailyLog) => {
    dispatch({ type: 'ADD_DAILY_LOG', payload: log });
  }, []);

  const updateDailyLog = useCallback((log: DailyLog) => {
    dispatch({ type: 'UPDATE_DAILY_LOG', payload: log });
  }, []);

  const updatePhase = useCallback((phase: Phase) => {
    dispatch({ type: 'UPDATE_PHASE', payload: phase });
  }, []);

  const setSyncStatus = useCallback((status: SyncStatus) => {
    dispatch({ type: 'SET_SYNC_STATUS', payload: status });
  }, []);

  const resetToday = useCallback(() => {
    dispatch({ type: 'RESET_TODAY' });
  }, []);

  const resetState = useCallback(() => {
    dispatch({ type: 'RESET_STATE' });
  }, []);

  /**
   * Context 값
   */
  const value = useMemo<AppContextValue>(
    () => ({
      state,
      dispatch,
      setUser,
      setBaseline,
      updateBaseline,
      setDailyLogs,
      addDailyLog,
      updateDailyLog,
      updatePhase,
      setSyncStatus,
      resetToday,
      resetState,
    }),
    [
      state,
      dispatch,
      setUser,
      setBaseline,
      updateBaseline,
      setDailyLogs,
      addDailyLog,
      updateDailyLog,
      updatePhase,
      setSyncStatus,
      resetToday,
      resetState,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

/**
 * useAppContext 훅
 * AppContext를 사용하기 위한 커스텀 훅
 */
export function useAppContext(): AppContextValue {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}

