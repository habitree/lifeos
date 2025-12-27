/**
 * Header 컴포넌트
 * 날짜 표시, Phase 표시, 모바일 햄버거 메뉴 버튼
 */

'use client';

import { usePhase } from '@/hooks';
import { useAppContext } from '@/contexts/AppContext';

/**
 * Header Props
 */
interface HeaderProps {
  onMenuClick: () => void;
}

/**
 * 날짜 포맷팅 함수
 * 예: 2025년 1월 27일 월요일
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
 * Header 컴포넌트
 */
export function Header({ onMenuClick }: HeaderProps) {
  const { phaseDescription } = usePhase();
  const { state } = useAppContext();

  const today = new Date();
  const formattedDate = formatDate(today);

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">
      <div className="flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        {/* 왼쪽: 모바일 메뉴 버튼 + 날짜 */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* 모바일: 햄버거 메뉴 버튼 */}
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-md hover:bg-gray-100 text-gray-600 transition-colors"
            aria-label="메뉴 열기"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          {/* 날짜 표시 */}
          <div>
            <h2 className="text-base sm:text-lg font-medium text-gray-900">
              {formattedDate}
            </h2>
          </div>
        </div>

        {/* 오른쪽: Phase 표시 */}
        <div className="flex items-center gap-2">
          {phaseDescription && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-50 border border-primary-100">
              <span className="text-xs sm:text-sm font-medium text-primary-700 whitespace-nowrap">
                Phase {phaseDescription.number}: {phaseDescription.name}
              </span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

