/**
 * 동기화 서비스
 * 로컬 저장소와 Supabase 간의 데이터 동기화
 * Local-first 원칙: 로컬 데이터 우선, 백그라운드 동기화
 */

import { supabaseClient } from '../lib/supabase-client';
import { localStorageService } from './LocalStorageService';
import { syncQueue } from './SyncQueue';
import { IDB_STORE_NAMES } from '../types/services';
import type { LocalData, SyncResult, SyncStatus } from '../types/services';
import type { User, Baseline, DailyLog } from '../types';

/**
 * 동기화 서비스 클래스
 */
class SyncService {
  private syncStatus: SyncStatus = 'idle';
  private lastSyncAt: string | null = null;

  /**
   * 동기화 상태 가져오기
   */
  getStatus(): { status: SyncStatus; lastSyncAt: string | null } {
    return {
      status: this.syncStatus,
      lastSyncAt: this.lastSyncAt,
    };
  }

  /**
   * 로컬 → Supabase 동기화
   * 로컬 데이터를 Supabase에 업로드 (로컬 우선 원칙)
   */
  async syncToSupabase(localData: LocalData): Promise<SyncResult<void>> {
    // 네트워크 상태 확인
    if (!syncQueue.isOnline()) {
      // 오프라인 시 큐에 추가
      await this.addToQueue(localData);
      return {
        success: false,
        error: '네트워크 연결이 없습니다. 오프라인 큐에 추가되었습니다.',
      };
    }

    this.syncStatus = 'syncing';

    try {
      // 1. User 동기화
      if (localData.user) {
        const { error: userError } = await supabaseClient
          .from('users')
          .upsert({
            id: localData.user.id,
            created_at: localData.user.created_at,
            current_phase: localData.user.current_phase,
          });

        if (userError) {
          throw new Error(`User 동기화 실패: ${userError.message}`);
        }
      }

      // 2. Baseline 동기화
      if (localData.baseline) {
        const { error: baselineError } = await supabaseClient
          .from('baselines')
          .upsert({
            id: localData.baseline.id,
            user_id: localData.baseline.user_id,
            sleep: localData.baseline.sleep,
            movement: localData.baseline.movement,
            record: localData.baseline.record,
            updated_at: localData.baseline.updated_at,
          });

        if (baselineError) {
          throw new Error(`Baseline 동기화 실패: ${baselineError.message}`);
        }
      }

      // 3. DailyLogs 동기화
      for (const log of localData.dailyLogs) {
        const { error: logError } = await supabaseClient
          .from('daily_logs')
          .upsert({
            id: log.id,
            user_id: log.user_id,
            log_date: log.log_date,
            baseline_check: log.baseline_check,
            one_line: log.one_line,
            body_state: log.body_state,
            memo: log.memo,
            created_at: log.created_at,
            updated_at: log.updated_at,
          });

        if (logError) {
          console.error(`DailyLog 동기화 실패 (${log.id}):`, logError);
          // 개별 로그 실패는 계속 진행
        }
      }

      this.syncStatus = 'success';
      this.lastSyncAt = new Date().toISOString();
      await this.saveLastSyncTime();

      return {
        success: true,
        data: undefined,
      };
    } catch (error) {
      this.syncStatus = 'error';
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      // 에러 발생 시 큐에 추가하여 재시도
      await this.addToQueue(localData);

      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  /**
   * Supabase → 로컬 동기화
   * Supabase에서 데이터를 가져와 로컬과 병합 (초기 로드 시)
   */
  async syncFromSupabase(userId: string): Promise<SyncResult<LocalData>> {
    if (!syncQueue.isOnline()) {
      return {
        success: false,
        error: '네트워크 연결이 없습니다.',
      };
    }

    this.syncStatus = 'syncing';

    try {
      // 1. User 조회
      const { data: userData, error: userError } = await supabaseClient
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (userError && userError.code !== 'PGRST116') {
        // PGRST116은 데이터가 없을 때 발생하는 코드 (정상)
        throw new Error(`User 조회 실패: ${userError.message}`);
      }

      // 2. Baseline 조회
      const { data: baselineData, error: baselineError } = await supabaseClient
        .from('baselines')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (baselineError && baselineError.code !== 'PGRST116') {
        throw new Error(`Baseline 조회 실패: ${baselineError.message}`);
      }

      // 3. DailyLogs 조회
      const { data: dailyLogsData, error: dailyLogsError } = await supabaseClient
        .from('daily_logs')
        .select('*')
        .eq('user_id', userId)
        .order('log_date', { ascending: false });

      if (dailyLogsError) {
        throw new Error(`DailyLogs 조회 실패: ${dailyLogsError.message}`);
      }

      // 4. 로컬 데이터와 병합 (충돌 해결: 로컬 우선)
      const localData = await this.getLocalData(userId);
      const mergedData = this.mergeData(localData, {
        user: userData || null,
        baseline: baselineData || null,
        dailyLogs: dailyLogsData || [],
      });

      // 5. 로컬 저장소에 저장
      await this.saveLocalData(mergedData);

      this.syncStatus = 'success';
      this.lastSyncAt = new Date().toISOString();
      await this.saveLastSyncTime();

      return {
        success: true,
        data: mergedData,
      };
    } catch (error) {
      this.syncStatus = 'error';
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';

      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  /**
   * 백그라운드 동기화
   * 네트워크 상태 확인 후 대기 중인 작업 실행
   */
  async backgroundSync(): Promise<void> {
    if (!syncQueue.isOnline()) {
      return;
    }

    if (this.syncStatus === 'syncing') {
      // 이미 동기화 중이면 스킵
      return;
    }

    // 큐 초기화
    await syncQueue.init();

    const queueStatus = syncQueue.getStatus();
    if (queueStatus.total === 0) {
      return;
    }

    this.syncStatus = 'syncing';

    try {
      // 큐에서 작업 가져오기
      const item = syncQueue.getNext();
      if (!item) {
        this.syncStatus = 'idle';
        return;
      }

      // 로컬 데이터 읽기
      const localData = await this.getLocalDataFromQueueItem(item);

      // 동기화 시도
      const result = await this.syncToSupabase(localData);

      if (result.success) {
        await syncQueue.complete(item.id);
      } else {
        await syncQueue.fail(item.id);
      }

      // 다음 작업 처리 (재귀)
      await this.backgroundSync();
    } catch (error) {
      this.syncStatus = 'error';
      console.error('백그라운드 동기화 오류:', error);
    }
  }

  /**
   * 로컬 데이터 가져오기
   */
  private async getLocalData(userId: string): Promise<LocalData> {
    const [user, baseline, dailyLogs] = await Promise.all([
      localStorageService.get<User>(IDB_STORE_NAMES.USER, userId),
      localStorageService.getByIndex<Baseline>(IDB_STORE_NAMES.BASELINE, 'user_id', userId).then(
        (items) => items[0] || null
      ),
      localStorageService.getByIndex<DailyLog>(IDB_STORE_NAMES.DAILY_LOGS, 'user_id', userId),
    ]);

    return {
      user: user || null,
      baseline: baseline || null,
      dailyLogs: dailyLogs || [],
    };
  }

  /**
   * 큐 아이템에서 로컬 데이터 재구성
   */
  private async getLocalDataFromQueueItem(item: SyncQueueItem): Promise<LocalData> {
    // 큐 아이템의 데이터를 사용하여 로컬 데이터 재구성
    // 실제 구현에서는 큐 아이템에 저장된 데이터를 사용
    const userId = (item.data as any)?.user_id || (item.data as any)?.id;
    return this.getLocalData(userId);
  }

  /**
   * 데이터 병합 (충돌 해결: 로컬 우선)
   */
  private mergeData(local: LocalData, remote: LocalData): LocalData {
    // 로컬 데이터 우선 원칙
    // 타임스탬프 비교로 최신 데이터 선택
    return {
      user: this.mergeUser(local.user, remote.user),
      baseline: this.mergeBaseline(local.baseline, remote.baseline),
      dailyLogs: this.mergeDailyLogs(local.dailyLogs, remote.dailyLogs),
    };
  }

  /**
   * User 병합
   */
  private mergeUser(local: User | null, remote: User | null): User | null {
    if (!local && !remote) return null;
    if (!local) return remote;
    if (!remote) return local;

    // 로컬 우선
    return local;
  }

  /**
   * Baseline 병합
   */
  private mergeBaseline(local: Baseline | null, remote: Baseline | null): Baseline | null {
    if (!local && !remote) return null;
    if (!local) return remote;
    if (!remote) return local;

    // updated_at 비교하여 최신 데이터 선택
    const localTime = new Date(local.updated_at).getTime();
    const remoteTime = new Date(remote.updated_at).getTime();

    return localTime >= remoteTime ? local : remote;
  }

  /**
   * DailyLogs 병합
   */
  private mergeDailyLogs(local: DailyLog[], remote: DailyLog[]): DailyLog[] {
    const merged: DailyLog[] = [];
    const logMap = new Map<string, DailyLog>();

    // 원격 데이터 먼저 추가
    for (const log of remote) {
      logMap.set(log.log_date, log);
    }

    // 로컬 데이터로 덮어쓰기 (로컬 우선)
    for (const log of local) {
      const existing = logMap.get(log.log_date);
      if (existing) {
        // updated_at 비교하여 최신 데이터 선택
        const localTime = new Date(log.updated_at).getTime();
        const remoteTime = new Date(existing.updated_at).getTime();
        logMap.set(log.log_date, localTime >= remoteTime ? log : existing);
      } else {
        logMap.set(log.log_date, log);
      }
    }

    return Array.from(logMap.values());
  }

  /**
   * 로컬 데이터 저장
   */
  private async saveLocalData(data: LocalData): Promise<void> {
    if (data.user) {
      await localStorageService.set(IDB_STORE_NAMES.USER, data.user.id, data.user);
    }

    if (data.baseline) {
      await localStorageService.set(IDB_STORE_NAMES.BASELINE, data.baseline.id, data.baseline);
    }

    for (const log of data.dailyLogs) {
      await localStorageService.set(IDB_STORE_NAMES.DAILY_LOGS, log.id, log);
    }
  }

  /**
   * 큐에 작업 추가
   */
  private async addToQueue(localData: LocalData): Promise<void> {
    // User, Baseline, DailyLogs를 각각 큐에 추가
    if (localData.user) {
      await syncQueue.add('update', IDB_STORE_NAMES.USER, localData.user);
    }

    if (localData.baseline) {
      await syncQueue.add('update', IDB_STORE_NAMES.BASELINE, localData.baseline);
    }

    for (const log of localData.dailyLogs) {
      await syncQueue.add('update', IDB_STORE_NAMES.DAILY_LOGS, log);
    }
  }

  /**
   * 마지막 동기화 시간 저장
   */
  private async saveLastSyncTime(): Promise<void> {
    try {
      localStorage.setItem('life-os:last-sync-time', this.lastSyncAt || '');
    } catch (error) {
      console.error('마지막 동기화 시간 저장 오류:', error);
    }
  }
}

// 싱글톤 인스턴스 export
export const syncService = new SyncService();

