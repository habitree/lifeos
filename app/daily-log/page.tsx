/**
 * Daily Log 페이지
 * 하루의 기록을 입력하고 저장
 */

'use client';

import { useState, useEffect } from 'react';
import { useDailyLog } from '@/hooks';
import { DailyLogForm, DatePicker } from '@/components/daily-log';
import { Card } from '@/components/common/Card';

/**
 * 날짜 포맷팅 함수
 */
function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const weekdays = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
  const weekday = weekdays[date.getDay()];

  return `${year}년 ${month}월 ${day}일 ${weekday}`;
}

/**
 * Daily Log 페이지
 */
export default function DailyLogPage() {
  const {
    todayLog,
    loading,
    error,
    fetchTodayLog,
    fetchLogByDate,
    saveDailyLog,
    refresh,
  } = useDailyLog();

  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [currentLog, setCurrentLog] = useState(todayLog);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  /**
   * 오늘 날짜 가져오기
   */
  const getTodayDate = (): string => {
    return new Date().toISOString().split('T')[0];
  };

  /**
   * 초기 로드
   */
  useEffect(() => {
    fetchTodayLog();
  }, [fetchTodayLog]);

  /**
   * todayLog 변경 시 currentLog 업데이트
   */
  useEffect(() => {
    setCurrentLog(todayLog);
  }, [todayLog]);

  /**
   * 날짜 변경 핸들러
   */
  const handleDateChange = async (date: string) => {
    setSelectedDate(date);
    const isToday = date === getTodayDate();

    if (isToday) {
      // 오늘 날짜면 todayLog 사용
      await fetchTodayLog();
      setCurrentLog(todayLog);
    } else {
      // 다른 날짜면 해당 날짜의 로그 조회
      const log = await fetchLogByDate(date);
      setCurrentLog(log);
    }
  };

  /**
   * 저장 핸들러
   */
  const handleSave = async (data: {
    baseline_check: any;
    one_line: string;
    body_state: 'good' | 'normal' | 'heavy' | null;
    memo: string | null;
  }) => {
    try {
      await saveDailyLog(data);
      setSaveSuccess(true);
      
      // 저장 성공 피드백 (조용하게 - 2초 후 사라짐)
      setTimeout(() => {
        setSaveSuccess(false);
      }, 2000);

      // 날짜가 오늘이면 새로고침
      if (selectedDate === getTodayDate()) {
        await refresh();
      }
    } catch (error) {
      console.error('저장 실패:', error);
    }
  };

  // 로딩 상태
  if (loading && !currentLog) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 저장 성공 메시지 (조용하게) */}
      {saveSuccess && (
        <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg text-sm">
          기록이 저장되었습니다.
        </div>
      )}

      {/* 에러 메시지 */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* DatePicker */}
      <DatePicker
        selectedDate={selectedDate}
        onDateChange={handleDateChange}
        maxDate={getTodayDate()}
      />

      {/* DailyLogForm */}
      <DailyLogForm
        date={selectedDate}
        initialData={currentLog || undefined}
        onSave={handleSave}
      />
    </div>
  );
}

