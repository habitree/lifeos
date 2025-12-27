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
import { useAuth } from './AuthContext';
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
 * AuthContext와 통합하여 인증된 사용자를 우선 로드합니다.
 */
export function AppProvider({ children }: AppProviderProps) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const [isInitialized, setIsInitialized] = React.useState(false);
  const { user: authUser, session, loading: authLoading } = useAuth();

  /**
   * 로컬 저장소에서 초기 데이터 로드
   * 인증된 사용자를 우선 로드하고, 없으면 익명 사용자 생성
   */
  useEffect(() => {
    // AuthContext가 로딩 중이면 대기
    if (authLoading) {
      return;
    }

    const loadInitialData = async () => {
      try {
        let user: User | null = null;
        let userId: string | null = null;

        // 1. 인증된 사용자가 있으면 우선 사용
        if (authUser && session) {
          user = authUser;
          userId = authUser.id;
          
          // 로컬 저장소에 저장
          await localStorageService.set(IDB_STORE_NAMES.USER, userId, user);
          localStorage.setItem('life-os:user-id', userId);
        } else {
          // 2. 인증된 사용자가 없으면 기존 로컬 사용자 확인
          userId = localStorage.getItem('life-os:user-id');
          user = userId ? (await localStorageService.get<User>(
            IDB_STORE_NAMES.USER,
            userId
          )) ?? null : null;

          // 3. 로컬 사용자도 없으면 익명 사용자 생성
          if (!user) {
            // UUID 생성
            userId = crypto.randomUUID();
            
            // 새 익명 사용자 생성
            const newUser: User = {
              id: userId,
              created_at: new Date().toISOString(),
              current_phase: 1,
              is_anonymous: true,
            };

            // 로컬 저장소에 저장
            await localStorageService.set(IDB_STORE_NAMES.USER, userId, newUser);
            localStorage.setItem('life-os:user-id', userId);
            
            user = newUser;
          }
        }

        // 사용자 설정
        dispatch({ type: 'SET_USER', payload: user });

        // Baseline 로드
        const baseline = await localStorageService.getByIndex<Baseline>(
          IDB_STORE_NAMES.BASELINE,
          'user_id',
          userId!
        ).then((items) => items[0] || null);

        if (baseline) {
          dispatch({ type: 'SET_BASELINE', payload: baseline });
        }

        // DailyLogs 로드
        const dailyLogs = await localStorageService.getByIndex<DailyLog>(
          IDB_STORE_NAMES.DAILY_LOGS,
          'user_id',
          userId!
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
  }, [authUser, session, authLoading]);

  /**
   * AuthContext의 사용자 변경 시 AppContext 업데이트
   */
  useEffect(() => {
    if (!isInitialized || authLoading) return;

    if (authUser && session) {
      // 인증된 사용자가 변경되면 업데이트
      dispatch({ type: 'SET_USER', payload: authUser });
      
      // 로컬 저장소에 저장
      localStorageService.set(IDB_STORE_NAMES.USER, authUser.id, authUser).catch(console.error);
      localStorage.setItem('life-os:user-id', authUser.id);
    } else if (!authUser && !session) {
      // 로그아웃 시 기존 로컬 사용자 확인 또는 생성
      const localUserId = localStorage.getItem('life-os:user-id');
      if (localUserId) {
        localStorageService.get<User>(IDB_STORE_NAMES.USER, localUserId)
          .then((localUser) => {
            if (localUser) {
              dispatch({ type: 'SET_USER', payload: localUser });
            }
          })
          .catch(console.error);
      }
    }
  }, [authUser, session, authLoading, isInitialized]);

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

