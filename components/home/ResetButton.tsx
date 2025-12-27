/**
 * ResetButton 컴포넌트
 * Reset Today 버튼
 * 확인 메시지 및 Baseline 초기화
 */

'use client';

import { ResetButtonProps } from '@/types/components';
import { Button } from '@/components/common/Button';
import { useAppContext } from '@/contexts/AppContext';
import { localStorageService } from '@/services/LocalStorageService';
import { syncService } from '@/services/SyncService';
import { IDB_STORE_NAMES } from '@/types/services';
import type { DailyLog } from '@/types';

/**
 * ResetButton 컴포넌트
 */
export function ResetButton({ onReset }: ResetButtonProps) {
  const { resetToday, updateDailyLog } = useAppContext();

  const handleReset = async () => {
    const confirmed = window.confirm('오늘은 돌아오기만 하면 된다');
    if (!confirmed) return;

    try {
      // 1. 오늘 날짜의 DailyLog 찾기 또는 생성
      const today = new Date().toISOString().split('T')[0];
      const userId = localStorage.getItem('life-os:user-id');
      
      if (!userId) {
        console.error('사용자 ID를 찾을 수 없습니다.');
        return;
      }

      // 오늘의 로그 찾기
      const todayLogs = await localStorageService.getByIndex(
        IDB_STORE_NAMES.DAILY_LOGS,
        'log_date',
        today
      );

      let todayLog = todayLogs.find((log: any) => log.user_id === userId) as DailyLog | undefined;

      if (todayLog && todayLog.id) {
        // 기존 로그 업데이트: baseline_check를 모두 false로
        const updatedLog = {
          ...todayLog,
          baseline_check: {
            sleep: false,
            movement: false,
            record: false,
          },
          updated_at: new Date().toISOString(),
        };

        await localStorageService.set(IDB_STORE_NAMES.DAILY_LOGS, todayLog.id, updatedLog);
        updateDailyLog(updatedLog);
      }

      // 2. RESET_TODAY 액션 실행 (Context에서 처리)
      resetToday();

      // 3. 백그라운드 동기화
      syncService.backgroundSync().catch((err) => {
        console.warn('Reset 동기화 실패 (백그라운드):', err);
      });

      // 4. 부모 컴포넌트의 onReset 콜백 호출
      onReset();
    } catch (error) {
      console.error('Reset 처리 오류:', error);
    }
  };

  return (
    <Button
      variant="reset"
      size="lg"
      onClick={handleReset}
      className="w-full sm:w-auto"
    >
      <span className="mr-2">🔄</span>
      Reset Today
    </Button>
  );
}

