/**
 * 데이터베이스 타입 정의
 * Supabase 데이터베이스 스키마와 일치하는 타입들
 */

/**
 * 사용자 정보
 */
export interface User {
  id: string;
  created_at: string;
  current_phase: 1 | 2 | 3 | 4;
}

/**
 * Baseline (절대 기준) 정보
 */
export interface Baseline {
  id: string;
  user_id: string;
  sleep: string; // 예: "22:00-05:00"
  movement: number; // 예: 1.0 (단위: km)
  record: string; // 예: "3줄"
  updated_at: string;
}

/**
 * Baseline 체크 상태
 */
export interface BaselineCheck {
  sleep: boolean;
  movement: boolean;
  record: boolean;
}

/**
 * 몸 상태 타입
 */
export type BodyState = 'good' | 'normal' | 'heavy';

/**
 * 일일 로그
 */
export interface DailyLog {
  id: string;
  user_id: string;
  log_date: string; // YYYY-MM-DD 형식
  baseline_check: BaselineCheck;
  one_line: string; // 오늘의 기준 한 줄
  body_state: BodyState | null;
  memo: string | null;
  created_at: string;
  updated_at: string;
}

