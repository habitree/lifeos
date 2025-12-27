/**
 * useSync 훅
 * 동기화 상태 관리 및 수동/백그라운드 동기화 제어
 * 네트워크 상태 감지 포함
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { syncService } from '../services/SyncService';
import { syncQueue } from '../services/SyncQueue';
import { localStorageService } from '../services/LocalStorageService';
import { IDB_STORE_NAMES } from '../types/services';
import type { SyncStatus } from '../types/state';
import type { LocalData } from '../types/services';
import type { User, Baseline, DailyLog } from '../types';

/**
 * useSync 반환 타입
 */
interface UseSyncReturn {
  status: SyncStatus;
  lastSyncAt: string | null;
  isOnline: boolean;
  loading: boolean;
  error: string | null;
  queueStatus: {
    total: number;
    pending: number;
    failed: number;
  };
  sync: () => Promise<void>;
  enableBackgroundSync: () => void;
  disableBackgroundSync: () => void;
  refresh: () => void;
}

/**
 * useSync 훅
 * @param enableAutoBackgroundSync - 자동 백그라운드 동기화 활성화 여부 (기본값: true)
 */
export function useSync(enableAutoBackgroundSync: boolean = true): UseSyncReturn {
  const [status, setStatus] = useState<SyncStatus>('idle');
  const [lastSyncAt, setLastSyncAt] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [queueStatus, setQueueStatus] = useState({
    total: 0,
    pending: 0,
    failed: 0,
  });
  const [backgroundSyncEnabled, setBackgroundSyncEnabled] = useState<boolean>(
    enableAutoBackgroundSync
  );
  const [backgroundSyncInterval, setBackgroundSyncInterval] = useState<NodeJS.Timeout | null>(null);

  /**
   * 동기화 상태 업데이트
   */
  const updateStatus = useCallback(() => {
    const syncStatus = syncService.getStatus();
    setStatus(syncStatus.status);
    setLastSyncAt(syncStatus.lastSyncAt);

    const queue = syncQueue.getStatus();
    setQueueStatus(queue);
  }, []);

  /**
   * 초기 상태 로드
   */
  useEffect(() => {
    updateStatus();
    setIsOnline(syncQueue.isOnline());
  }, [updateStatus]);

  /**
   * 네트워크 상태 감지
   */
  useEffect(() => {
    const cleanup = syncQueue.onNetworkChange((online) => {
      setIsOnline(online);
      if (online && backgroundSyncEnabled) {
        // 온라인 상태가 되면 자동으로 백그라운드 동기화 시도
        syncService.backgroundSync().catch((err) => {
          console.warn('네트워크 연결 후 자동 동기화 실패:', err);
        });
      }
      updateStatus();
    });

    return cleanup;
  }, [backgroundSyncEnabled, updateStatus]);

  /**
   * 백그라운드 동기화 설정
   */
  useEffect(() => {
    if (!backgroundSyncEnabled) {
      if (backgroundSyncInterval) {
        clearInterval(backgroundSyncInterval);
        setBackgroundSyncInterval(null);
      }
      return;
    }

    // 주기적으로 백그라운드 동기화 실행 (30초마다)
    const interval = setInterval(() => {
      if (isOnline && status !== 'syncing') {
        syncService.backgroundSync().catch((err) => {
          console.warn('백그라운드 동기화 실패:', err);
        });
        updateStatus();
      }
    }, 30000);

    setBackgroundSyncInterval(interval);

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [backgroundSyncEnabled, isOnline, status, updateStatus]);

  /**
   * 수동 동기화 트리거
   */
  const sync = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      setStatus('syncing');

      // 사용자 ID 가져오기
      const userId = localStorage.getItem('life-os:user-id');
      if (!userId) {
        throw new Error('사용자 ID를 찾을 수 없습니다.');
      }

      // 로컬 데이터 가져오기
      const [user, baselines, dailyLogs] = await Promise.all([
        localStorageService.get<User>(IDB_STORE_NAMES.USER, userId),
        localStorageService.getByIndex<Baseline>(IDB_STORE_NAMES.BASELINE, 'user_id', userId),
        localStorageService.getByIndex<DailyLog>(IDB_STORE_NAMES.DAILY_LOGS, 'user_id', userId),
      ]);

      const localData: LocalData = {
        user: (user as User | null) ?? null,
        baseline: (baselines[0] as Baseline | undefined) ?? null,
        dailyLogs: (dailyLogs as DailyLog[]) ?? [],
      };

      // 동기화 실행
      const result = await syncService.syncToSupabase(localData);

      if (result.success) {
        setStatus('success');
        setLastSyncAt(new Date().toISOString());
      } else {
        setStatus('error');
        setError(result.error ?? '동기화 실패');
      }

      updateStatus();
    } catch (err) {
      setStatus('error');
      const errorMessage = err instanceof Error ? err.message : '동기화 실패';
      setError(errorMessage);
      console.error('useSync 동기화 오류:', err);
    } finally {
      setLoading(false);
    }
  }, [updateStatus]);

  /**
   * 백그라운드 동기화 활성화
   */
  const enableBackgroundSync = useCallback(() => {
    setBackgroundSyncEnabled(true);
  }, []);

  /**
   * 백그라운드 동기화 비활성화
   */
  const disableBackgroundSync = useCallback(() => {
    setBackgroundSyncEnabled(false);
  }, []);

  /**
   * 상태 새로고침
   */
  const refresh = useCallback(() => {
    updateStatus();
    setIsOnline(syncQueue.isOnline());
  }, [updateStatus]);

  return {
    status,
    lastSyncAt,
    isOnline,
    loading,
    error,
    queueStatus,
    sync,
    enableBackgroundSync,
    disableBackgroundSync,
    refresh,
  };
}

