/**
 * LocalStorageService 기본 동작 테스트
 * 
 * 이 파일은 서비스의 기본 동작을 검증합니다.
 * 실제 브라우저 환경에서 실행해야 합니다.
 */

import { localStorageService } from '../LocalStorageService';
import { IDB_STORE_NAMES } from '../../types/services';
import type { User, Baseline, DailyLog } from '../../types';

/**
 * 기본 동작 테스트 함수
 * 브라우저 콘솔에서 실행하여 테스트할 수 있습니다.
 */
export async function testLocalStorageService() {
  console.log('=== LocalStorageService 테스트 시작 ===');

  try {
    // 1. User 저장 및 조회 테스트
    console.log('\n1. User 저장 및 조회 테스트');
    const testUser: User = {
      id: 'test-user-1',
      created_at: new Date().toISOString(),
      current_phase: 1,
    };

    await localStorageService.set(IDB_STORE_NAMES.USER, testUser.id, testUser);
    const retrievedUser = await localStorageService.get<User>(
      IDB_STORE_NAMES.USER,
      testUser.id
    );

    if (retrievedUser && retrievedUser.id === testUser.id) {
      console.log('✅ User 저장 및 조회 성공');
    } else {
      console.error('❌ User 저장 및 조회 실패');
    }

    // 2. Baseline 저장 및 조회 테스트
    console.log('\n2. Baseline 저장 및 조회 테스트');
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
    const retrievedBaseline = await localStorageService.get<Baseline>(
      IDB_STORE_NAMES.BASELINE,
      testBaseline.id
    );

    if (retrievedBaseline && retrievedBaseline.id === testBaseline.id) {
      console.log('✅ Baseline 저장 및 조회 성공');
    } else {
      console.error('❌ Baseline 저장 및 조회 실패');
    }

    // 3. DailyLog 저장 및 조회 테스트
    console.log('\n3. DailyLog 저장 및 조회 테스트');
    const testDailyLog: DailyLog = {
      id: 'test-daily-log-1',
      user_id: testUser.id,
      log_date: '2025-01-27',
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
    const retrievedDailyLog = await localStorageService.get<DailyLog>(
      IDB_STORE_NAMES.DAILY_LOGS,
      testDailyLog.id
    );

    if (retrievedDailyLog && retrievedDailyLog.id === testDailyLog.id) {
      console.log('✅ DailyLog 저장 및 조회 성공');
    } else {
      console.error('❌ DailyLog 저장 및 조회 실패');
    }

    // 4. getAll 테스트
    console.log('\n4. getAll 테스트');
    const allUsers = await localStorageService.getAll<User>(
      IDB_STORE_NAMES.USER
    );
    console.log(`✅ 모든 User 조회 성공 (${allUsers.length}개)`);

    // 5. getByIndex 테스트
    console.log('\n5. getByIndex 테스트');
    const userDailyLogs = await localStorageService.getByIndex<DailyLog>(
      IDB_STORE_NAMES.DAILY_LOGS,
      'user_id',
      testUser.id
    );
    console.log(
      `✅ user_id로 DailyLog 검색 성공 (${userDailyLogs.length}개)`
    );

    // 6. delete 테스트
    console.log('\n6. delete 테스트');
    await localStorageService.delete(IDB_STORE_NAMES.USER, testUser.id);
    const deletedUser = await localStorageService.get<User>(
      IDB_STORE_NAMES.USER,
      testUser.id
    );

    if (!deletedUser) {
      console.log('✅ User 삭제 성공');
    } else {
      console.error('❌ User 삭제 실패');
    }

    console.log('\n=== LocalStorageService 테스트 완료 ===');
    return true;
  } catch (error) {
    console.error('❌ 테스트 중 오류 발생:', error);
    return false;
  }
}

/**
 * 브라우저 콘솔에서 실행:
 * import { testLocalStorageService } from './services/__tests__/LocalStorageService.test';
 * testLocalStorageService();
 */

