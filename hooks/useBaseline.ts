/**
 * useBaseline 훅
 * Baseline 데이터 관리 (가져오기, 업데이트, 토글)
 * 로딩 상태 및 에러 처리 포함
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { localStorageService } from '../services/LocalStorageService';
import { syncService } from '../services/SyncService';
import { IDB_STORE_NAMES } from '../types/services';
import type { Baseline, BaselineCheck, DailyLog } from '../types';

/**
 * useBaseline 반환 타입
 */
interface UseBaselineReturn {
  baseline: Baseline | null;
  loading: boolean;
  error: string | null;
  baselineCheck: BaselineCheck | null;
  fetchBaseline: () => Promise<void>;
  updateBaseline: (updates: Partial<Baseline>) => Promise<void>;
  toggleBaselineCheck: (type: keyof BaselineCheck) => Promise<void>;
  refresh: () => Promise<void>;
}

/**
 * useBaseline 훅
 */
export function useBaseline(): UseBaselineReturn {
  const { state, updateBaseline: updateBaselineContext, updateDailyLog } = useAppContext();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const baseline = state.baseline;

  /**
   * 오늘 날짜의 DailyLog에서 Baseline 체크 상태 가져오기
   */
  const getBaselineCheck = useCallback((): BaselineCheck | null => {
    if (!baseline) return null;

    const today = new Date().toISOString().split('T')[0];
    const todayLog = state.dailyLogs.find((log) => log.log_date === today);

    return todayLog?.baseline_check ?? {
      sleep: false,
      movement: false,
      record: false,
    };
  }, [baseline, state.dailyLogs]);

  const baselineCheck = getBaselineCheck();

  /**
   * Baseline 가져오기
   */
  const fetchBaseline = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const userId = localStorage.getItem('life-os:user-id');
      if (!userId) {
        throw new Error('사용자 ID를 찾을 수 없습니다.');
      }

      const baselines = await localStorageService.getByIndex<Baseline>(
        IDB_STORE_NAMES.BASELINE,
        'user_id',
        userId
      );

      if (baselines.length > 0) {
        updateBaselineContext(baselines[0]);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Baseline 가져오기 실패';
      setError(errorMessage);
      console.error('useBaseline fetchBaseline 오류:', err);
    } finally {
      setLoading(false);
    }
  }, [updateBaselineContext]);

  /**
   * Baseline 업데이트
   */
  const updateBaseline = useCallback(
    async (updates: Partial<Baseline>) => {
      try {
        setLoading(true);
        setError(null);

        if (!baseline) {
          throw new Error('Baseline이 존재하지 않습니다.');
        }

        const updatedBaseline: Baseline = {
          ...baseline,
          ...updates,
          updated_at: new Date().toISOString(),
        };

        // 로컬 저장소에 저장
        await localStorageService.set(IDB_STORE_NAMES.BASELINE, baseline.id, updatedBaseline);

        // Context 업데이트
        updateBaselineContext(updatedBaseline);

        // 백그라운드 동기화
        syncService.backgroundSync().catch((err) => {
          console.warn('Baseline 동기화 실패 (백그라운드):', err);
        });
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Baseline 업데이트 실패';
        setError(errorMessage);
        console.error('useBaseline updateBaseline 오류:', err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [baseline, updateBaselineContext]
  );

  /**
   * Baseline 체크 토글 (ON/OFF)
   */
  const toggleBaselineCheck = useCallback(
    async (type: keyof BaselineCheck) => {
      try {
        setLoading(true);
        setError(null);

        const today = new Date().toISOString().split('T')[0];
        const userId = localStorage.getItem('life-os:user-id');
        if (!userId) {
          throw new Error('사용자 ID를 찾을 수 없습니다.');
        }

        // 오늘의 DailyLog 찾기
        const todayLogs = await localStorageService.getByIndex<DailyLog>(
          IDB_STORE_NAMES.DAILY_LOGS,
          'log_date',
          today
        );

        let todayLog = todayLogs.find((log) => log.user_id === userId) as DailyLog | undefined;

        // 오늘의 로그가 없으면 생성
        if (!todayLog) {
          const newLog: DailyLog = {
            id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            user_id: userId,
            log_date: today,
            baseline_check: {
              sleep: false,
              movement: false,
              record: false,
            },
            one_line: '',
            body_state: null,
            memo: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };

          todayLog = newLog;
        }

        // Baseline 체크 토글
        const updatedCheck: BaselineCheck = {
          ...todayLog.baseline_check,
          [type]: !todayLog.baseline_check[type],
        };

        const updatedLog = {
          ...todayLog,
          baseline_check: updatedCheck,
          updated_at: new Date().toISOString(),
        };

        // 로컬 저장소에 저장
        await localStorageService.set(IDB_STORE_NAMES.DAILY_LOGS, updatedLog.id, updatedLog);

        // Context 업데이트 (DailyLog 목록 업데이트)
        updateDailyLog(updatedLog);

        // 백그라운드 동기화
        syncService.backgroundSync().catch((err) => {
          console.warn('Baseline 체크 동기화 실패 (백그라운드):', err);
        });

        // 상태 새로고침을 위해 fetchBaseline 호출
        await fetchBaseline();
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Baseline 체크 토글 실패';
        setError(errorMessage);
        console.error('useBaseline toggleBaselineCheck 오류:', err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [updateDailyLog, fetchBaseline]
  );

  /**
   * 데이터 새로고침
   */
  const refresh = useCallback(async () => {
    await fetchBaseline();
  }, [fetchBaseline]);

  /**
   * 초기 로드
   */
  useEffect(() => {
    if (!baseline) {
      fetchBaseline();
    }
  }, [baseline, fetchBaseline]);

  return {
    baseline,
    loading,
    error,
    baselineCheck,
    fetchBaseline,
    updateBaseline,
    toggleBaselineCheck,
    refresh,
  };
}

