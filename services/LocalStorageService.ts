/**
 * 로컬 저장소 서비스
 * IndexedDB를 주 저장소로 사용하고, LocalStorage를 폴백으로 사용
 * Local-first 원칙에 따라 모든 데이터는 로컬에 먼저 저장됩니다.
 */

import { openDB, DBSchema, IDBPDatabase } from 'idb';
import type { User, Baseline, DailyLog } from '../types';
import { IDB_STORE_NAMES, type IDBStoreName } from '../types/services';

/**
 * IndexedDB 스키마 정의
 */
interface LifeOSDB extends DBSchema {
  user: {
    key: string;
    value: User;
  };
  baseline: {
    key: string;
    value: Baseline;
    indexes: { user_id: string };
  };
  daily_logs: {
    key: string;
    value: DailyLog;
    indexes: { user_id: string; log_date: string };
  };
}

/**
 * 로컬 저장소 서비스 클래스
 */
class LocalStorageService {
  private db: IDBPDatabase<LifeOSDB> | null = null;
  private dbName = 'life-os-db';
  private dbVersion = 1;
  private initPromise: Promise<IDBPDatabase<LifeOSDB>> | null = null;

  /**
   * IndexedDB 초기화
   */
  private async initDB(): Promise<IDBPDatabase<LifeOSDB>> {
    if (this.db) {
      return this.db;
    }

    if (this.initPromise) {
      return this.initPromise;
    }

    this.initPromise = openDB<LifeOSDB>(this.dbName, this.dbVersion, {
      upgrade(db) {
        // users 스토어 생성
        if (!db.objectStoreNames.contains('user')) {
          const userStore = db.createObjectStore('user', {
            keyPath: 'id',
          });
        }

        // baselines 스토어 생성
        if (!db.objectStoreNames.contains('baseline')) {
          const baselineStore = db.createObjectStore('baseline', {
            keyPath: 'id',
          });
          baselineStore.createIndex('user_id', 'user_id');
        }

        // daily_logs 스토어 생성
        if (!db.objectStoreNames.contains('daily_logs')) {
          const dailyLogsStore = db.createObjectStore('daily_logs', {
            keyPath: 'id',
          });
          dailyLogsStore.createIndex('user_id', 'user_id');
          dailyLogsStore.createIndex('log_date', 'log_date');
        }
      },
    });

    try {
      this.db = await this.initPromise;
      return this.db;
    } catch (error) {
      this.initPromise = null;
      throw new Error(`IndexedDB 초기화 실패: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * IndexedDB 사용 가능 여부 확인
   */
  private isIndexedDBAvailable(): boolean {
    return typeof window !== 'undefined' && 'indexedDB' in window;
  }

  /**
   * LocalStorage 폴백: 데이터 가져오기
   */
  private getFromLocalStorage<T>(key: string): T | null {
    if (typeof window === 'undefined') return null;
    
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`LocalStorage 읽기 오류 (${key}):`, error);
      return null;
    }
  }

  /**
   * LocalStorage 폴백: 데이터 저장
   */
  private setToLocalStorage<T>(key: string, value: T): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`LocalStorage 쓰기 오류 (${key}):`, error);
    }
  }

  /**
   * LocalStorage 폴백: 데이터 삭제
   */
  private removeFromLocalStorage(key: string): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`LocalStorage 삭제 오류 (${key}):`, error);
    }
  }

  /**
   * 데이터 가져오기
   */
  async get<T>(store: IDBStoreName, key: string): Promise<T | undefined> {
    try {
      if (!this.isIndexedDBAvailable()) {
        // IndexedDB 사용 불가 시 LocalStorage 폴백
        const fallbackKey = `${this.dbName}:${store}:${key}`;
        return this.getFromLocalStorage<T>(fallbackKey) ?? undefined;
      }

      const db = await this.initDB();
      // keyPath가 'id'로 설정되어 있으므로 key를 직접 사용
      const value = await db.get(store, key);
      return value as T | undefined;
    } catch (error) {
      console.error(`데이터 가져오기 오류 (${store}, ${key}):`, error);
      // 에러 발생 시 LocalStorage 폴백
      const fallbackKey = `${this.dbName}:${store}:${key}`;
      return this.getFromLocalStorage<T>(fallbackKey) ?? undefined;
    }
  }

  /**
   * 데이터 저장
   */
  async set<T>(store: IDBStoreName, key: string, value: T): Promise<void> {
    try {
      if (!this.isIndexedDBAvailable()) {
        // IndexedDB 사용 불가 시 LocalStorage 폴백
        const fallbackKey = `${this.dbName}:${store}:${key}`;
        this.setToLocalStorage(fallbackKey, value);
        return;
      }

      const db = await this.initDB();
      // keyPath가 'id'로 설정되어 있으므로 key를 별도로 전달하지 않음
      // value 객체에 이미 id가 포함되어 있어야 함
      await db.put(store, value as any);
      
      // LocalStorage에도 백업 저장 (폴백용)
      const fallbackKey = `${this.dbName}:${store}:${key}`;
      this.setToLocalStorage(fallbackKey, value);
    } catch (error) {
      console.error(`데이터 저장 오류 (${store}, ${key}):`, error);
      // 에러 발생 시 LocalStorage 폴백
      const fallbackKey = `${this.dbName}:${store}:${key}`;
      this.setToLocalStorage(fallbackKey, value);
    }
  }

  /**
   * 데이터 삭제
   */
  async delete(store: IDBStoreName, key: string): Promise<void> {
    try {
      if (!this.isIndexedDBAvailable()) {
        // IndexedDB 사용 불가 시 LocalStorage 폴백
        const fallbackKey = `${this.dbName}:${store}:${key}`;
        this.removeFromLocalStorage(fallbackKey);
        return;
      }

      const db = await this.initDB();
      // keyPath가 'id'로 설정되어 있으므로 key를 직접 사용
      await db.delete(store, key);
      
      // LocalStorage에서도 삭제
      const fallbackKey = `${this.dbName}:${store}:${key}`;
      this.removeFromLocalStorage(fallbackKey);
    } catch (error) {
      console.error(`데이터 삭제 오류 (${store}, ${key}):`, error);
      // 에러 발생 시 LocalStorage에서 삭제
      const fallbackKey = `${this.dbName}:${store}:${key}`;
      this.removeFromLocalStorage(fallbackKey);
    }
  }

  /**
   * 모든 데이터 가져오기
   */
  async getAll<T>(store: IDBStoreName): Promise<T[]> {
    try {
      if (!this.isIndexedDBAvailable()) {
        // IndexedDB 사용 불가 시 LocalStorage 폴백
        const prefix = `${this.dbName}:${store}:`;
        const items: T[] = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key?.startsWith(prefix)) {
            const value = this.getFromLocalStorage<T>(key);
            if (value) items.push(value);
          }
        }
        return items;
      }

      const db = await this.initDB();
      const values = await db.getAll(store);
      return values as T[];
    } catch (error) {
      console.error(`모든 데이터 가져오기 오류 (${store}):`, error);
      // 에러 발생 시 LocalStorage 폴백
      const prefix = `${this.dbName}:${store}:`;
      const items: T[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith(prefix)) {
          const value = this.getFromLocalStorage<T>(key);
          if (value) items.push(value);
        }
      }
      return items;
    }
  }

  /**
   * 인덱스로 데이터 가져오기
   */
  async getByIndex<T>(
    store: IDBStoreName,
    index: string,
    value: string | number
  ): Promise<T[]> {
    try {
      if (!this.isIndexedDBAvailable()) {
        // IndexedDB 사용 불가 시 LocalStorage 폴백
        // 인덱스 검색은 모든 데이터를 가져와서 필터링
        const all = await this.getAll<T>(store);
        return all.filter((item: any) => item[index] === value);
      }

      const db = await this.initDB();
      const tx = db.transaction(store, 'readonly');
      const storeObj = tx.objectStore(store);
      
      // 타입 안전성을 위해 타입 단언 사용
      const indexObj = (storeObj as any).index(index);
      if (!indexObj) {
        // 인덱스가 없는 경우 전체 검색 후 필터링
        const all = await this.getAll<T>(store);
        return all.filter((item: any) => item[index] === value);
      }
      
      const values = await indexObj.getAll(value);
      await tx.done;
      return values as T[];
    } catch (error) {
      console.error(`인덱스 검색 오류 (${store}, ${index}, ${value}):`, error);
      // 에러 발생 시 LocalStorage 폴백
      const all = await this.getAll<T>(store);
      return all.filter((item: any) => item[index] === value);
    }
  }

  /**
   * 데이터베이스 연결 종료
   */
  async close(): Promise<void> {
    if (this.db) {
      this.db.close();
      this.db = null;
      this.initPromise = null;
    }
  }

  /**
   * 데이터베이스 초기화 (테스트용)
   */
  async clear(): Promise<void> {
    try {
      if (!this.isIndexedDBAvailable()) {
        // LocalStorage 폴백
        const prefix = `${this.dbName}:`;
        const keysToRemove: string[] = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key?.startsWith(prefix)) {
            keysToRemove.push(key);
          }
        }
        keysToRemove.forEach(key => localStorage.removeItem(key));
        return;
      }

      const db = await this.initDB();
      const stores = Object.values(IDB_STORE_NAMES);
      for (const store of stores) {
        await db.clear(store);
      }
    } catch (error) {
      console.error('데이터베이스 초기화 오류:', error);
    }
  }
}

// 싱글톤 인스턴스 export
export const localStorageService = new LocalStorageService();

