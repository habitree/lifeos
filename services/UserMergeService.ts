/**
 * 사용자 병합 서비스
 * 기존 로컬 사용자 데이터를 카카오 계정에 병합
 */

import { supabaseClient } from '@/lib/supabase-client';
import { localStorageService } from './LocalStorageService';
import { IDB_STORE_NAMES } from '@/types/services';
import type { User, Baseline, DailyLog } from '@/types';

/**
 * 병합 결과 타입
 */
export interface MergeResult {
  success: boolean;
  error?: string;
  mergedUser?: User;
  mergedBaseline?: Baseline | null;
  mergedDailyLogs?: DailyLog[];
}

/**
 * 사용자 병합 서비스 클래스
 */
class UserMergeService {
  /**
   * 기존 로컬 사용자 데이터를 카카오 계정에 병합
   * @param authUserId Supabase Auth 사용자 ID
   * @param localUserId 기존 로컬 사용자 ID (localStorage에서 가져옴)
   * @returns 병합 결과
   */
  async mergeLocalUserToKakaoAccount(
    authUserId: string,
    localUserId: string | null
  ): Promise<MergeResult> {
    try {
      // 1. 기존 로컬 사용자 데이터 조회
      if (!localUserId) {
        // 로컬 사용자가 없으면 새 사용자만 생성
        return {
          success: true,
          mergedUser: undefined,
        };
      }

      const localUser = await localStorageService.get<User>(
        IDB_STORE_NAMES.USER,
        localUserId
      );

      if (!localUser) {
        // 로컬 사용자 데이터가 없으면 새 사용자만 생성
        return {
          success: true,
          mergedUser: undefined,
        };
      }

      // 2. 카카오 계정의 users 테이블 레코드 확인
      const { data: authUserData, error: authUserError } = await supabaseClient
        .from('users')
        .select('*')
        .eq('auth_user_id', authUserId)
        .single();

      if (authUserError && authUserError.code !== 'PGRST116') {
        throw new Error(`카카오 계정 조회 실패: ${authUserError.message}`);
      }

      // 3. 기존 로컬 데이터 조회
      const localBaselines = await localStorageService.getByIndex<Baseline>(
        IDB_STORE_NAMES.BASELINE,
        'user_id',
        localUserId
      );

      const localDailyLogs = await localStorageService.getByIndex<DailyLog>(
        IDB_STORE_NAMES.DAILY_LOGS,
        'user_id',
        localUserId
      );

      // 4. 카카오 계정에 데이터 병합
      const mergedUser = authUserData as User | null;

      // 사용자가 없으면 생성 (이미 AuthContext에서 생성했을 수 있음)
      if (!mergedUser) {
        // AuthContext에서 이미 생성했을 가능성이 높으므로 다시 조회
        const { data: newUserData, error: newUserError } = await supabaseClient
          .from('users')
          .select('*')
          .eq('auth_user_id', authUserId)
          .single();

        if (newUserError) {
          throw new Error(`사용자 조회 실패: ${newUserError.message}`);
        }

        // 병합할 사용자 정보 업데이트
        const updatedUser: Partial<User> = {
          current_phase: localUser.current_phase, // 기존 Phase 유지
          is_anonymous: false,
        };

        const { data: updatedUserData, error: updateUserError } = await supabaseClient
          .from('users')
          .update(updatedUser as any)
          .eq('auth_user_id', authUserId)
          .select()
          .single();

        if (updateUserError) {
          throw new Error(`사용자 업데이트 실패: ${updateUserError.message}`);
        }

        // 5. Baseline 병합
        let mergedBaseline: Baseline | null = null;
        if (localBaselines.length > 0) {
          const localBaseline = localBaselines[0];
          
          // 카카오 계정의 Baseline 확인
          const { data: existingBaseline } = await supabaseClient
            .from('baselines')
            .select('*')
            .eq('user_id', updatedUserData.id)
            .single();

          if (existingBaseline) {
            // 기존 Baseline이 있으면 업데이트 (로컬 데이터 우선)
            const { data: updatedBaseline, error: baselineError } = await supabaseClient
              .from('baselines')
              .update({
                sleep: localBaseline.sleep,
                movement: localBaseline.movement,
                record: localBaseline.record,
                updated_at: localBaseline.updated_at,
              } as any)
              .eq('user_id', updatedUserData.id)
              .select()
              .single();

            if (baselineError) {
              console.warn('Baseline 병합 실패:', baselineError);
            } else {
              mergedBaseline = updatedBaseline as Baseline;
            }
          } else {
            // Baseline이 없으면 생성
            const { data: newBaseline, error: baselineError } = await supabaseClient
              .from('baselines')
              .insert({
                user_id: updatedUserData.id,
                sleep: localBaseline.sleep,
                movement: localBaseline.movement,
                record: localBaseline.record,
                updated_at: localBaseline.updated_at,
              } as any)
              .select()
              .single();

            if (baselineError) {
              console.warn('Baseline 생성 실패:', baselineError);
            } else {
              mergedBaseline = newBaseline as Baseline;
            }
          }
        }

        // 6. DailyLogs 병합
        const mergedDailyLogs: DailyLog[] = [];
        for (const localLog of localDailyLogs) {
          // 기존 로그 확인 (user_id와 log_date로)
          const { data: existingLog } = await supabaseClient
            .from('daily_logs')
            .select('*')
            .eq('user_id', updatedUserData.id)
            .eq('log_date', localLog.log_date)
            .single();

          if (existingLog) {
            // 기존 로그가 있으면 업데이트 (로컬 데이터 우선)
            const { data: updatedLog, error: logError } = await supabaseClient
              .from('daily_logs')
              .update({
                baseline_check: localLog.baseline_check,
                one_line: localLog.one_line,
                body_state: localLog.body_state,
                memo: localLog.memo,
                updated_at: localLog.updated_at,
              } as any)
              .eq('id', existingLog.id)
              .select()
              .single();

            if (logError) {
              console.warn(`DailyLog 병합 실패 (${localLog.log_date}):`, logError);
            } else {
              mergedDailyLogs.push(updatedLog as DailyLog);
            }
          } else {
            // 로그가 없으면 생성
            const { data: newLog, error: logError } = await supabaseClient
              .from('daily_logs')
              .insert({
                user_id: updatedUserData.id,
                log_date: localLog.log_date,
                baseline_check: localLog.baseline_check,
                one_line: localLog.one_line,
                body_state: localLog.body_state,
                memo: localLog.memo,
                created_at: localLog.created_at,
                updated_at: localLog.updated_at,
              } as any)
              .select()
              .single();

            if (logError) {
              console.warn(`DailyLog 생성 실패 (${localLog.log_date}):`, logError);
            } else {
              mergedDailyLogs.push(newLog as DailyLog);
            }
          }
        }

        // 7. 로컬 저장소 업데이트
        await localStorageService.set(IDB_STORE_NAMES.USER, updatedUserData.id, updatedUserData as User);
        localStorage.setItem('life-os:user-id', updatedUserData.id);

        if (mergedBaseline) {
          await localStorageService.set(IDB_STORE_NAMES.BASELINE, mergedBaseline.id, mergedBaseline);
        }

        for (const log of mergedDailyLogs) {
          await localStorageService.set(IDB_STORE_NAMES.DAILY_LOGS, log.id, log);
        }

        return {
          success: true,
          mergedUser: updatedUserData as User,
          mergedBaseline,
          mergedDailyLogs,
        };
      }

      // 이미 사용자가 있는 경우 (재로그인 등)
      return {
        success: true,
        mergedUser: mergedUser,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '사용자 병합 실패';
      console.error('사용자 병합 오류:', error);
      return {
        success: false,
        error: errorMessage,
      };
    }
  }
}

export const userMergeService = new UserMergeService();

