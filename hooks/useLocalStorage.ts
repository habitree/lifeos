/**
 * useLocalStorage 훅
 * 로컬 저장소 읽기/쓰기를 위한 커스텀 훅
 * 제네릭 타입 지원, 자동 동기화 트리거, 로딩/에러 상태 관리
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { localStorageService } from '../services/LocalStorageService';
import { syncService } from '../services/SyncService';
import { IDB_STORE_NAMES, type IDBStoreName } from '../types/services';

/**
 * useLocalStorage 반환 타입
 */
interface UseLocalStorageReturn<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  setValue: (value: T) => Promise<void>;
  removeValue: () => Promise<void>;
  refresh: () => Promise<void>;
}

/**
 * useLocalStorage 훅
 * @param store - IndexedDB 스토어 이름
 * @param key - 데이터 키
 * @param initialValue - 초기값 (옵션)
 * @param autoSync - 자동 동기화 여부 (기본값: true)
 */
export function useLocalStorage<T>(
  store: IDBStoreName,
  key: string,
  initialValue?: T,
  autoSync: boolean = true
): UseLocalStorageReturn<T> {
  const [data, setData] = useState<T | null>(initialValue ?? null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * 데이터 로드
   */
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const value = await localStorageService.get<T>(store, key);
      setData(value ?? initialValue ?? null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '데이터 로드 실패';
      setError(errorMessage);
      console.error('useLocalStorage 로드 오류:', err);
    } finally {
      setLoading(false);
    }
  }, [store, key, initialValue]);

  /**
   * 초기 로드
   */
  useEffect(() => {
    loadData();
  }, [loadData]);

  /**
   * 값 설정
   */
  const setValue = useCallback(
    async (value: T) => {
      try {
        setLoading(true);
        setError(null);

        // 로컬 저장소에 저장
        await localStorageService.set(store, key, value);
        setData(value);

        // 자동 동기화 트리거
        if (autoSync) {
          // 백그라운드에서 동기화 (비동기, 에러 무시)
          syncService.backgroundSync().catch((err) => {
            console.warn('자동 동기화 실패 (백그라운드):', err);
          });
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : '데이터 저장 실패';
        setError(errorMessage);
        console.error('useLocalStorage 저장 오류:', err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [store, key, autoSync]
  );

  /**
   * 값 삭제
   */
  const removeValue = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      await localStorageService.delete(store, key);
      setData(null);

      // 자동 동기화 트리거
      if (autoSync) {
        syncService.backgroundSync().catch((err) => {
          console.warn('자동 동기화 실패 (백그라운드):', err);
        });
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '데이터 삭제 실패';
      setError(errorMessage);
      console.error('useLocalStorage 삭제 오류:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [store, key, autoSync]);

  /**
   * 데이터 새로고침
   */
  const refresh = useCallback(async () => {
    await loadData();
  }, [loadData]);

  return {
    data,
    loading,
    error,
    setValue,
    removeValue,
    refresh,
  };
}

