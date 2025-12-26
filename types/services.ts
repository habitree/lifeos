/**
 * 서비스 타입 정의
 * 로컬 저장소 및 동기화 서비스를 위한 타입들
 */

import { User, Baseline, DailyLog } from './database';

/**
 * 로컬 저장소에 저장되는 데이터 구조
 */
export interface LocalData {
  user: User | null;
  baseline: Baseline | null;
  dailyLogs: DailyLog[];
}

/**
 * 동기화 결과
 */
export interface SyncResult<T = unknown> {
  success: boolean;
  error?: string | null;
  data?: T;
}

/**
 * 저장소 키 타입 (타입 안전성 보장)
 */
export const StorageKey = {
  USER: 'life-os:user',
  BASELINE: 'life-os:baseline',
  DAILY_LOGS: 'life-os:daily-logs',
  LAST_SYNC: 'life-os:last-sync',
  SETTINGS: 'life-os:settings',
} as const;

export type StorageKeyType = typeof StorageKey[keyof typeof StorageKey];

/**
 * IndexedDB 스토어 이름
 */
export const IDB_STORE_NAMES = {
  DAILY_LOGS: 'daily_logs',
  USER: 'user',
  BASELINE: 'baseline',
} as const;

export type IDBStoreName = typeof IDB_STORE_NAMES[keyof typeof IDB_STORE_NAMES];

/**
 * 동기화 작업 타입
 */
export type SyncOperation = 'create' | 'update' | 'delete';

/**
 * 동기화 대기열 항목
 */
export interface SyncQueueItem {
  id: string;
  operation: SyncOperation;
  store: IDBStoreName;
  data: unknown;
  timestamp: string;
  retryCount: number;
}

