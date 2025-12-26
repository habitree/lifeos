/**
 * 저장소 키 관리
 * 타입 안전한 키 정의 및 네임스페이스 관리
 */

import { StorageKey, type StorageKeyType } from '../types/services';

/**
 * 저장소 키 유틸리티
 */
export class StorageKeys {
  /**
   * 네임스페이스 접두사
   */
  private static readonly NAMESPACE = 'life-os';

  /**
   * 키 생성 헬퍼
   */
  private static createKey(key: string): string {
    return `${this.NAMESPACE}:${key}`;
  }

  /**
   * 사용자 키
   */
  static readonly USER = StorageKeys.createKey('user');

  /**
   * Baseline 키
   */
  static readonly BASELINE = StorageKeys.createKey('baseline');

  /**
   * Daily Logs 키
   */
  static readonly DAILY_LOGS = StorageKeys.createKey('daily-logs');

  /**
   * 마지막 동기화 시간 키
   */
  static readonly LAST_SYNC = StorageKeys.createKey('last-sync');

  /**
   * 설정 키
   */
  static readonly SETTINGS = StorageKeys.createKey('settings');

  /**
   * 사용자 ID별 키 생성
   */
  static userKey(userId: string): string {
    return `${this.USER}:${userId}`;
  }

  /**
   * Baseline 키 생성 (사용자 ID 포함)
   */
  static baselineKey(userId: string): string {
    return `${this.BASELINE}:${userId}`;
  }

  /**
   * Daily Log 키 생성 (사용자 ID 및 날짜 포함)
   */
  static dailyLogKey(userId: string, date: string): string {
    return `${this.DAILY_LOGS}:${userId}:${date}`;
  }

  /**
   * 모든 키 목록 가져오기
   */
  static getAllKeys(): string[] {
    return [
      this.USER,
      this.BASELINE,
      this.DAILY_LOGS,
      this.LAST_SYNC,
      this.SETTINGS,
    ];
  }

  /**
   * 키 유효성 검사
   */
  static isValidKey(key: string): boolean {
    return key.startsWith(`${this.NAMESPACE}:`);
  }

  /**
   * 키에서 네임스페이스 제거
   */
  static removeNamespace(key: string): string {
    if (key.startsWith(`${this.NAMESPACE}:`)) {
      return key.substring(`${this.NAMESPACE}:`.length);
    }
    return key;
  }
}

/**
 * 타입 안전한 StorageKey export
 */
export { StorageKey, type StorageKeyType };

