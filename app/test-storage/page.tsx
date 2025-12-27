'use client';

/**
 * LocalStorageService 테스트 페이지
 * 브라우저에서 직접 테스트를 실행할 수 있습니다.
 */

import { useState } from 'react';
import { localStorageService } from '@/services/LocalStorageService';
import { IDB_STORE_NAMES } from '@/types/services';
import type { User, Baseline, DailyLog } from '@/types';

export default function TestStoragePage() {
  const [logs, setLogs] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const addLog = (message: string) => {
    setLogs((prev) => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const clearLogs = () => {
    setLogs([]);
  };

  const runTest = async () => {
    setIsRunning(true);
    clearLogs();
    addLog('=== LocalStorageService 테스트 시작 ===');

    try {
      // 1. User 저장 및 조회 테스트
      addLog('\n1. User 저장 및 조회 테스트');
      const testUser: User = {
        id: 'test-user-1',
        created_at: new Date().toISOString(),
        current_phase: 1,
        is_anonymous: true,
      };

      await localStorageService.set(IDB_STORE_NAMES.USER, testUser.id, testUser);
      addLog(`✅ User 저장 완료: ${testUser.id}`);

      const retrievedUser = await localStorageService.get<User>(
        IDB_STORE_NAMES.USER,
        testUser.id
      );

      if (retrievedUser && retrievedUser.id === testUser.id) {
        addLog('✅ User 조회 성공');
      } else {
        addLog('❌ User 조회 실패');
      }

      // 2. Baseline 저장 및 조회 테스트
      addLog('\n2. Baseline 저장 및 조회 테스트');
      const testBaseline: Baseline = {
        id: 'test-baseline-1',
        user_id: testUser.id,
        sleep: '22:00-05:00',
        movement: 1.0,
        record: '3줄',
        updated_at: new Date().toISOString(),
      };

      await localStorageService.set(
        IDB_STORE_NAMES.BASELINE,
        testBaseline.id,
        testBaseline
      );
      addLog(`✅ Baseline 저장 완료: ${testBaseline.id}`);

      const retrievedBaseline = await localStorageService.get<Baseline>(
        IDB_STORE_NAMES.BASELINE,
        testBaseline.id
      );

      if (retrievedBaseline && retrievedBaseline.id === testBaseline.id) {
        addLog('✅ Baseline 조회 성공');
      } else {
        addLog('❌ Baseline 조회 실패');
      }

      // 3. DailyLog 저장 및 조회 테스트
      addLog('\n3. DailyLog 저장 및 조회 테스트');
      const testDailyLog: DailyLog = {
        id: 'test-daily-log-1',
        user_id: testUser.id,
        log_date: new Date().toISOString().split('T')[0],
        baseline_check: {
          sleep: true,
          movement: true,
          record: false,
        },
        one_line: '오늘의 기준 한 줄',
        body_state: 'good',
        memo: '테스트 메모',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      await localStorageService.set(
        IDB_STORE_NAMES.DAILY_LOGS,
        testDailyLog.id,
        testDailyLog
      );
      addLog(`✅ DailyLog 저장 완료: ${testDailyLog.id}`);

      const retrievedDailyLog = await localStorageService.get<DailyLog>(
        IDB_STORE_NAMES.DAILY_LOGS,
        testDailyLog.id
      );

      if (retrievedDailyLog && retrievedDailyLog.id === testDailyLog.id) {
        addLog('✅ DailyLog 조회 성공');
      } else {
        addLog('❌ DailyLog 조회 실패');
      }

      // 4. getAll 테스트
      addLog('\n4. getAll 테스트');
      const allUsers = await localStorageService.getAll<User>(
        IDB_STORE_NAMES.USER
      );
      addLog(`✅ 모든 User 조회 성공 (${allUsers.length}개)`);

      // 5. getByIndex 테스트
      addLog('\n5. getByIndex 테스트');
      const userDailyLogs = await localStorageService.getByIndex<DailyLog>(
        IDB_STORE_NAMES.DAILY_LOGS,
        'user_id',
        testUser.id
      );
      addLog(
        `✅ user_id로 DailyLog 검색 성공 (${userDailyLogs.length}개)`
      );

      // 6. delete 테스트
      addLog('\n6. delete 테스트');
      await localStorageService.delete(IDB_STORE_NAMES.USER, testUser.id);
      const deletedUser = await localStorageService.get<User>(
        IDB_STORE_NAMES.USER,
        testUser.id
      );

      if (!deletedUser) {
        addLog('✅ User 삭제 성공');
      } else {
        addLog('❌ User 삭제 실패');
      }

      addLog('\n=== LocalStorageService 테스트 완료 ===');
    } catch (error) {
      addLog(`❌ 테스트 중 오류 발생: ${error instanceof Error ? error.message : 'Unknown error'}`);
      console.error('테스트 오류:', error);
    } finally {
      setIsRunning(false);
    }
  };

  const clearStorage = async () => {
    try {
      await localStorageService.clear();
      addLog('✅ 저장소 초기화 완료');
    } catch (error) {
      addLog(`❌ 저장소 초기화 실패: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">LocalStorageService 테스트</h1>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex gap-4 mb-4">
            <button
              onClick={runTest}
              disabled={isRunning}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isRunning ? '테스트 실행 중...' : '테스트 실행'}
            </button>
            <button
              onClick={clearLogs}
              className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              로그 지우기
            </button>
            <button
              onClick={clearStorage}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              저장소 초기화
            </button>
          </div>

          <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-auto max-h-96">
            {logs.length === 0 ? (
              <div className="text-gray-500">테스트를 실행하면 결과가 여기에 표시됩니다.</div>
            ) : (
              logs.map((log, index) => (
                <div key={index} className="mb-1 whitespace-pre-wrap">
                  {log}
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h2 className="font-bold text-lg mb-2">사용 방법</h2>
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li>위의 &ldquo;테스트 실행&rdquo; 버튼을 클릭합니다.</li>
            <li>테스트 결과가 로그 영역에 표시됩니다.</li>
            <li>각 테스트 단계의 성공/실패 여부를 확인할 수 있습니다.</li>
            <li>브라우저 개발자 도구(F12)의 Console 탭에서도 상세 로그를 확인할 수 있습니다.</li>
            <li>IndexedDB 데이터는 브라우저 개발자 도구의 Application 탭에서 확인할 수 있습니다.</li>
          </ol>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
          <h2 className="font-bold text-lg mb-2">주의사항</h2>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>이 테스트는 실제 데이터를 생성합니다.</li>
            <li>&ldquo;저장소 초기화&rdquo; 버튼을 클릭하면 모든 테스트 데이터가 삭제됩니다.</li>
            <li>프로덕션 환경에서는 이 페이지를 제거하거나 보호해야 합니다.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

