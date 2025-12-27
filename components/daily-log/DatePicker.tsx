/**
 * DatePicker 컴포넌트
 * 날짜 선택 기능
 * 이전 기록 조회 및 수정
 */

'use client';

import { useState } from 'react';
import { Card } from '@/components/common/Card';

/**
 * DatePicker Props
 */
interface DatePickerProps {
  selectedDate: string; // YYYY-MM-DD
  onDateChange: (date: string) => void;
  minDate?: string; // YYYY-MM-DD
  maxDate?: string; // YYYY-MM-DD
}

/**
 * 날짜 포맷팅 함수
 */
function formatDateForDisplay(dateString: string): string {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
  const weekday = weekdays[date.getDay()];

  return `${year}년 ${month}월 ${day}일 (${weekday})`;
}

/**
 * DatePicker 컴포넌트
 */
export function DatePicker({
  selectedDate,
  onDateChange,
  minDate,
  maxDate,
}: DatePickerProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  /**
   * 오늘 날짜 가져오기
   */
  const getTodayDate = (): string => {
    return new Date().toISOString().split('T')[0];
  };

  /**
   * 날짜 변경 핸들러
   */
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onDateChange(e.target.value);
    setIsOpen(false);
  };

  /**
   * 오늘로 이동
   */
  const handleTodayClick = () => {
    const today = getTodayDate();
    onDateChange(today);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              날짜 선택
            </label>
            <p className="text-base text-gray-900">
              {formatDateForDisplay(selectedDate)}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              날짜 변경
            </button>
            {selectedDate !== getTodayDate() && (
              <button
                type="button"
                onClick={handleTodayClick}
                className="px-4 py-2 text-sm font-medium text-primary-700 bg-primary-50 border border-primary-200 rounded-lg hover:bg-primary-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                오늘
              </button>
            )}
          </div>
        </div>

        {/* 날짜 입력 필드 (숨김) */}
        {isOpen && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <input
              type="date"
              value={selectedDate}
              onChange={handleDateChange}
              min={minDate}
              max={maxDate || getTodayDate()}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        )}
      </Card>
    </div>
  );
}

