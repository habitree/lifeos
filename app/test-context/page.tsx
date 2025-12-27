/**
 * AppContext 테스트 페이지
 * 상태 관리 기능을 브라우저에서 직접 테스트할 수 있습니다.
 */

'use client';

import { useEffect, useState } from 'react';
import { AppProvider, useAppContext } from '@/contexts/AppContext';
import type { User, Baseline, DailyLog } from '@/types';
import type { Phase } from '@/types/state';

/**
 * 테스트 컴포넌트
 */
function ContextTestContent() {
  const {
    state,
    setUser,
    setBaseline,
    updateBaseline,
    addDailyLog,
    updateDailyLog,
    updatePhase,
    resetToday,
    resetState,
  } = useAppContext();

  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs((prev) => [...prev, `[${timestamp}] ${message}`]);
  };

  useEffect(() => {
    addLog('AppContext 테스트 시작');
    addLog(`현재 상태: user=${state.user ? '있음' : '없음'}, baseline=${state.baseline ? '있음' : '없음'}, phase=${state.currentPhase}`);
  }, []);

  // 테스트 함수들
  const testSetUser = async () => {
    try {
      const testUser: User = {
        id: 'test-user-1',
        created_at: new Date().toISOString(),
        current_phase: 1,
      };
      setUser(testUser);
      addLog('✅ User 설정 완료');
    } catch (error) {
      addLog(`❌ User 설정 실패: ${error}`);
    }
  };

  const testSetBaseline = async () => {
    try {
      if (!state.user) {
        addLog('⚠️ User가 없습니다. 먼저 User를 설정하세요.');
        return;
      }

      const testBaseline: Baseline = {
        id: 'test-baseline-1',
        user_id: state.user.id,
        sleep: '22:00-05:00',
        movement: 1.0,
        record: '3줄',
        updated_at: new Date().toISOString(),
      };
      setBaseline(testBaseline);
      addLog('✅ Baseline 설정 완료');
    } catch (error) {
      addLog(`❌ Baseline 설정 실패: ${error}`);
    }
  };

  const testUpdateBaseline = async () => {
    try {
      if (!state.baseline) {
        addLog('⚠️ Baseline이 없습니다. 먼저 Baseline을 설정하세요.');
        return;
      }

      updateBaseline({
        movement: 2.0,
      });
      addLog('✅ Baseline 업데이트 완료 (movement: 1.0 → 2.0)');
    } catch (error) {
      addLog(`❌ Baseline 업데이트 실패: ${error}`);
    }
  };

  const testAddDailyLog = async () => {
    try {
      if (!state.user) {
        addLog('⚠️ User가 없습니다. 먼저 User를 설정하세요.');
        return;
      }

      const today = new Date().toISOString().split('T')[0];
      const testLog: DailyLog = {
        id: `test-log-${Date.now()}`,
        user_id: state.user.id,
        log_date: today,
        baseline_check: {
          sleep: true,
          movement: true,
          record: false,
        },
        one_line: '오늘의 기준 한 줄 테스트',
        body_state: 'good',
        memo: '테스트 메모',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      addDailyLog(testLog);
      addLog('✅ DailyLog 추가 완료');
    } catch (error) {
      addLog(`❌ DailyLog 추가 실패: ${error}`);
    }
  };

  const testUpdatePhase = async () => {
    try {
      const newPhase: Phase = state.currentPhase === 4 ? 1 : ((state.currentPhase + 1) as Phase);
      updatePhase(newPhase);
      addLog(`✅ Phase 업데이트 완료: ${state.currentPhase} → ${newPhase}`);
    } catch (error) {
      addLog(`❌ Phase 업데이트 실패: ${error}`);
    }
  };

  const testResetToday = async () => {
    try {
      const beforeCount = state.dailyLogs.length;
      resetToday();
      addLog(`✅ ResetToday 완료 (로그 수: ${beforeCount} → ${state.dailyLogs.length})`);
    } catch (error) {
      addLog(`❌ ResetToday 실패: ${error}`);
    }
  };

  const testResetState = async () => {
    try {
      resetState();
      addLog('✅ 전체 상태 초기화 완료');
    } catch (error) {
      addLog(`❌ 상태 초기화 실패: ${error}`);
    }
  };

  const clearLogs = () => {
    setLogs([]);
  };

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">AppContext 테스트 페이지</h1>

        {/* 상태 표시 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4">현재 상태</h2>
          <div className="space-y-2 text-sm">
            <div>
              <strong>User:</strong>{' '}
              {state.user ? (
                <span className="text-green-600">✓ {state.user.id}</span>
              ) : (
                <span className="text-gray-400">없음</span>
              )}
            </div>
            <div>
              <strong>Baseline:</strong>{' '}
              {state.baseline ? (
                <span className="text-green-600">
                  ✓ 수면: {state.baseline.sleep}, 이동: {state.baseline.movement}km, 기록: {state.baseline.record}
                </span>
              ) : (
                <span className="text-gray-400">없음</span>
              )}
            </div>
            <div>
              <strong>Phase:</strong> <span className="text-blue-600">{state.currentPhase}</span>
            </div>
            <div>
              <strong>DailyLogs:</strong> <span className="text-blue-600">{state.dailyLogs.length}개</span>
            </div>
            <div>
              <strong>SyncStatus:</strong> <span className="text-blue-600">{state.syncStatus}</span>
            </div>
            {state.error && (
              <div>
                <strong>Error:</strong> <span className="text-red-600">{state.error}</span>
              </div>
            )}
          </div>
        </div>

        {/* 테스트 버튼 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4">테스트 액션</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <button
              onClick={testSetUser}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            >
              User 설정
            </button>
            <button
              onClick={testSetBaseline}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
            >
              Baseline 설정
            </button>
            <button
              onClick={testUpdateBaseline}
              className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
            >
              Baseline 업데이트
            </button>
            <button
              onClick={testAddDailyLog}
              className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition"
            >
              DailyLog 추가
            </button>
            <button
              onClick={testUpdatePhase}
              className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 transition"
            >
              Phase 변경
            </button>
            <button
              onClick={testResetToday}
              className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition"
            >
              Reset Today
            </button>
            <button
              onClick={testResetState}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition col-span-2 md:col-span-3"
            >
              전체 상태 초기화
            </button>
          </div>
        </div>

        {/* 로그 영역 */}
        <div className="bg-gray-900 rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-white">테스트 로그</h2>
            <button
              onClick={clearLogs}
              className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition"
            >
              로그 지우기
            </button>
          </div>
          <div className="bg-black rounded p-4 h-96 overflow-y-auto font-mono text-sm text-green-400">
            {logs.length === 0 ? (
              <div className="text-gray-500">테스트를 실행하면 결과가 여기에 표시됩니다.</div>
            ) : (
              logs.map((log, index) => (
                <div key={index} className="mb-1">
                  {log}
                </div>
              ))
            )}
          </div>
        </div>

        {/* 사용 방법 */}
        <div className="mt-6 bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-2">사용 방법</h3>
          <ol className="list-decimal list-inside space-y-1 text-sm">
            <li>위의 버튼들을 순서대로 클릭하여 테스트를 진행합니다.</li>
            <li>각 액션의 성공/실패 여부가 로그에 표시됩니다.</li>
            <li>상태 변경이 &quot;현재 상태&quot; 영역에 실시간으로 반영됩니다.</li>
            <li>브라우저 개발자 도구(F12)의 Application 탭에서 IndexedDB 데이터를 확인할 수 있습니다.</li>
          </ol>
        </div>
      </div>
    </div>
  );
}

/**
 * 테스트 페이지 (AppProvider로 감싸기)
 */
export default function TestContextPage() {
  return (
    <AppProvider>
      <ContextTestContent />
    </AppProvider>
  );
}

