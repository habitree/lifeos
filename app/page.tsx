/**
 * Home 페이지
 * Baseline 3개 항목과 Reset 기능
 */

'use client';

import { useBaseline, usePhase } from '@/hooks';
import { BaselineCard, ResetButton, PhaseIndicator } from '@/components/home';

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
 * Home 페이지
 */
export default function Home() {
  const { baseline, baselineCheck, toggleBaselineCheck, loading: baselineLoading } = useBaseline();
  const { currentPhase } = usePhase();
  const today = new Date();
  const formattedDate = formatDate(today);

  // Baseline이 없으면 로딩 표시
  if (baselineLoading || !baseline) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  // Baseline 체크 상태 (없으면 모두 false)
  const checkState = baselineCheck || {
    sleep: false,
    movement: false,
    record: false,
  };

  // Baseline 항목 데이터
  const baselineItems = [
    {
      type: 'sleep' as const,
      label: '수면',
      value: baseline.sleep || '22:00-05:00',
      isChecked: checkState.sleep,
    },
    {
      type: 'movement' as const,
      label: '이동',
      value: `걷기/러닝 ${baseline.movement || 1}km 이상`,
      isChecked: checkState.movement,
    },
    {
      type: 'record' as const,
      label: '기록',
      value: baseline.record || '3줄',
      isChecked: checkState.record,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Phase Indicator */}
      <div className="flex justify-center sm:justify-start">
        <PhaseIndicator currentPhase={currentPhase} />
      </div>

      {/* Baseline Cards */}
      <div className="space-y-4">
        {baselineItems.map((item) => (
          <BaselineCard
            key={item.type}
            type={item.type}
            label={item.label}
            value={item.value}
            isChecked={item.isChecked}
            onToggle={() => toggleBaselineCheck(item.type)}
          />
        ))}
      </div>

      {/* Reset Button */}
      <div className="flex justify-center sm:justify-start pt-4">
        <ResetButton onReset={() => {
          // Reset 완료 후 추가 작업이 필요하면 여기에 작성
          console.log('Reset 완료');
        }} />
      </div>
    </div>
  );
}
