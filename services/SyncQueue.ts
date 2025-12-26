/**
 * 동기화 큐 관리
 * 오프라인 작업을 저장하고 네트워크 연결 시 자동 실행
 */

import { localStorageService } from './LocalStorageService';
import { IDB_STORE_NAMES, type SyncQueueItem, type SyncOperation, type IDBStoreName } from '../types/services';
import { StorageKey } from '../types/services';

const QUEUE_STORE_KEY = 'sync-queue';
const MAX_RETRY_COUNT = 3;

/**
 * 동기화 큐 서비스
 */
class SyncQueue {
  private queue: SyncQueueItem[] = [];
  private isProcessing = false;

  /**
   * 큐 초기화 (로컬 저장소에서 로드)
   */
  async init(): Promise<void> {
    try {
      const stored = localStorage.getItem(StorageKey.LAST_SYNC);
      if (stored) {
        const queueData = JSON.parse(stored);
        this.queue = Array.isArray(queueData.queue) ? queueData.queue : [];
      }
    } catch (error) {
      console.error('동기화 큐 초기화 오류:', error);
      this.queue = [];
    }
  }

  /**
   * 큐에 작업 추가
   */
  async add(
    operation: SyncOperation,
    store: IDBStoreName,
    data: unknown
  ): Promise<void> {
    const item: SyncQueueItem = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      operation,
      store,
      data,
      timestamp: new Date().toISOString(),
      retryCount: 0,
    };

    this.queue.push(item);
    await this.save();
  }

  /**
   * 큐에서 작업 가져오기
   */
  getNext(): SyncQueueItem | null {
    // 재시도 횟수가 적은 것부터 처리
    const sorted = [...this.queue].sort((a, b) => a.retryCount - b.retryCount);
    return sorted.length > 0 ? sorted[0] : null;
  }

  /**
   * 작업 완료 처리
   */
  async complete(itemId: string): Promise<void> {
    this.queue = this.queue.filter((item) => item.id !== itemId);
    await this.save();
  }

  /**
   * 작업 실패 처리 (재시도 횟수 증가)
   */
  async fail(itemId: string): Promise<void> {
    const item = this.queue.find((i) => i.id === itemId);
    if (item) {
      item.retryCount += 1;
      if (item.retryCount >= MAX_RETRY_COUNT) {
        // 최대 재시도 횟수 초과 시 큐에서 제거
        await this.complete(itemId);
        console.error(`동기화 작업 실패 (최대 재시도 횟수 초과): ${itemId}`);
      } else {
        await this.save();
      }
    }
  }

  /**
   * 큐 상태 확인
   */
  getStatus(): {
    total: number;
    pending: number;
    failed: number;
  } {
    const total = this.queue.length;
    const pending = this.queue.filter((item) => item.retryCount === 0).length;
    const failed = this.queue.filter((item) => item.retryCount >= MAX_RETRY_COUNT).length;

    return { total, pending, failed };
  }

  /**
   * 큐 비우기
   */
  async clear(): Promise<void> {
    this.queue = [];
    await this.save();
  }

  /**
   * 큐 저장 (로컬 저장소)
   */
  private async save(): Promise<void> {
    try {
      const data = {
        queue: this.queue,
        lastUpdated: new Date().toISOString(),
      };
      localStorage.setItem(StorageKey.LAST_SYNC, JSON.stringify(data));
    } catch (error) {
      console.error('동기화 큐 저장 오류:', error);
    }
  }

  /**
   * 네트워크 상태 확인
   */
  isOnline(): boolean {
    if (typeof window === 'undefined') return false;
    return navigator.onLine;
  }

  /**
   * 네트워크 상태 변경 리스너 등록
   */
  onNetworkChange(callback: (isOnline: boolean) => void): () => void {
    if (typeof window === 'undefined') {
      return () => {};
    }

    const handleOnline = () => callback(true);
    const handleOffline = () => callback(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // 정리 함수 반환
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }
}

// 싱글톤 인스턴스 export
export const syncQueue = new SyncQueue();

