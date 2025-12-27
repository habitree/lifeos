/**
 * useDailyLog 훅
 * Daily Log 데이터 관리 (오늘의 로그, 날짜별 조회, 저장, 업데이트)
 * 로딩 상태 및 에러 처리 포함
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { localStorageService } from '../services/LocalStorageService';
import { syncService } from '../services/SyncService';
import { IDB_STORE_NAMES } from '../types/services';
import type { DailyLog, BaselineCheck, BodyState } from '../types';

/**
 * useDailyLog 반환 타입
 */
interface UseDailyLogReturn {
  todayLog: DailyLog | null;
  loading: boolean;
  error: string | null;
  fetchTodayLog: () => Promise<void>;
  fetchLogByDate: (date: string) => Promise<DailyLog | null>;
  saveDailyLog: (data: {
    baseline_check?: BaselineCheck;
    one_line?: string;
    body_state?: BodyState | null;
    memo?: string | null;
  }) => Promise<void>;
  updateDailyLog: (log: DailyLog) => Promise<void>;
  refresh: () => Promise<void>;
}

/**
 * useDailyLog 훅
 */
export function useDailyLog(): UseDailyLogReturn {
  const { state, addDailyLog, updateDailyLog: updateDailyLogContext } = useAppContext();
  const [todayLog, setTodayLog] = useState<DailyLog | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * 오늘 날짜 문자열 가져오기 (YYYY-MM-DD)
   */
  const getTodayDate = useCallback((): string => {
    return new Date().toISOString().split('T')[0];
  }, []);

  /**
   * 오늘의 Daily Log 가져오기
   */
  const fetchTodayLog = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const today = getTodayDate();
      const userId = localStorage.getItem('life-os:user-id');
      if (!userId) {
        throw new Error('사용자 ID를 찾을 수 없습니다.');
      }

      // 오늘의 로그 찾기
      const todayLogs = await localStorageService.getByIndex<DailyLog>(
        IDB_STORE_NAMES.DAILY_LOGS,
        'log_date',
        today
      );

      const log = todayLogs.find((l) => l.user_id === userId) ?? null;
      setTodayLog(log);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '오늘의 로그 가져오기 실패';
      setError(errorMessage);
      console.error('useDailyLog fetchTodayLog 오류:', err);
    } finally {
      setLoading(false);
    }
  }, [getTodayDate]);

  /**
   * 날짜별 Daily Log 조회
   */
  const fetchLogByDate = useCallback(async (date: string): Promise<DailyLog | null> => {
    try {
      setLoading(true);
      setError(null);

      const userId = localStorage.getItem('life-os:user-id');
      if (!userId) {
        throw new Error('사용자 ID를 찾을 수 없습니다.');
      }

      // 해당 날짜의 로그 찾기
      const dateLogs = await localStorageService.getByIndex<DailyLog>(
        IDB_STORE_NAMES.DAILY_LOGS,
        'log_date',
        date
      );

      const log = dateLogs.find((l) => l.user_id === userId) ?? null;
      return log;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '날짜별 로그 가져오기 실패';
      setError(errorMessage);
      console.error('useDailyLog fetchLogByDate 오류:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Daily Log 저장
   */
  const saveDailyLog = useCallback(
    async (data: {
      baseline_check?: BaselineCheck;
      one_line?: string;
      body_state?: BodyState | null;
      memo?: string | null;
    }) => {
      try {
        setLoading(true);
        setError(null);

        const today = getTodayDate();
        const userId = localStorage.getItem('life-os:user-id');
        if (!userId) {
          throw new Error('사용자 ID를 찾을 수 없습니다.');
        }

        // 기존 로그 확인
        const existingLogs = await localStorageService.getByIndex<DailyLog>(
          IDB_STORE_NAMES.DAILY_LOGS,
          'log_date',
          today
        );

        let existingLog = existingLogs.find((l) => l.user_id === userId);

        if (existingLog) {
          // 기존 로그 업데이트
          const updatedLog: DailyLog = {
            ...existingLog,
            baseline_check: data.baseline_check ?? existingLog.baseline_check,
            one_line: data.one_line ?? existingLog.one_line,
            body_state: data.body_state ?? existingLog.body_state,
            memo: data.memo ?? existingLog.memo,
            updated_at: new Date().toISOString(),
          };

          await localStorageService.set(IDB_STORE_NAMES.DAILY_LOGS, updatedLog.id, updatedLog);
          updateDailyLogContext(updatedLog);
          setTodayLog(updatedLog);
        } else {
          // 새 로그 생성
          const newLog: DailyLog = {
            id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            user_id: userId,
            log_date: today,
            baseline_check: data.baseline_check ?? {
              sleep: false,
              movement: false,
              record: false,
            },
            one_line: data.one_line ?? '',
            body_state: data.body_state ?? null,
            memo: data.memo ?? null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };

          await localStorageService.set(IDB_STORE_NAMES.DAILY_LOGS, newLog.id, newLog);
          addDailyLog(newLog);
          setTodayLog(newLog);
        }

        // 백그라운드 동기화
        syncService.backgroundSync().catch((err) => {
          console.warn('Daily Log 동기화 실패 (백그라운드):', err);
        });
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Daily Log 저장 실패';
        setError(errorMessage);
        console.error('useDailyLog saveDailyLog 오류:', err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [getTodayDate, addDailyLog, updateDailyLogContext]
  );

  /**
   * Daily Log 업데이트
   */
  const updateDailyLog = useCallback(
    async (log: DailyLog) => {
      try {
        setLoading(true);
        setError(null);

        const updatedLog: DailyLog = {
          ...log,
          updated_at: new Date().toISOString(),
        };

        // 로컬 저장소에 저장
        await localStorageService.set(IDB_STORE_NAMES.DAILY_LOGS, updatedLog.id, updatedLog);

        // Context 업데이트
        updateDailyLogContext(updatedLog);

        // 오늘의 로그인 경우 상태 업데이트
        const today = getTodayDate();
        if (updatedLog.log_date === today) {
          setTodayLog(updatedLog);
        }

        // 백그라운드 동기화
        syncService.backgroundSync().catch((err) => {
          console.warn('Daily Log 업데이트 동기화 실패 (백그라운드):', err);
        });
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Daily Log 업데이트 실패';
        setError(errorMessage);
        console.error('useDailyLog updateDailyLog 오류:', err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [getTodayDate, updateDailyLogContext]
  );

  /**
   * 데이터 새로고침
   */
  const refresh = useCallback(async () => {
    await fetchTodayLog();
  }, [fetchTodayLog]);

  /**
   * 초기 로드
   */
  useEffect(() => {
    fetchTodayLog();
  }, [fetchTodayLog]);

  /**
   * state.dailyLogs 변경 시 오늘의 로그 업데이트
   */
  useEffect(() => {
    const today = getTodayDate();
    const log = state.dailyLogs.find((l) => l.log_date === today) ?? null;
    setTodayLog(log);
  }, [state.dailyLogs, getTodayDate]);

  return {
    todayLog,
    loading,
    error,
    fetchTodayLog,
    fetchLogByDate,
    saveDailyLog,
    updateDailyLog,
    refresh,
  };
}

