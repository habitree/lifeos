/**
 * BaselineCard 컴포넌트
 * Baseline 항목 표시 및 ON/OFF 토글
 * 구글 캘린더 스타일 카드
 */

'use client';

import { BaselineCardProps } from '@/types/components';
import { Card } from '@/components/common/Card';
import { Toggle } from '@/components/common/Toggle';

/**
 * BaselineCard 컴포넌트
 */
export function BaselineCard({
  type,
  label,
  value,
  isChecked,
  onToggle,
}: BaselineCardProps) {
  return (
    <Card hover className="p-4">
      <div className="flex items-center justify-between">
        {/* Baseline 정보 */}
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h3 className="text-base font-medium text-gray-900">{label}</h3>
          </div>
          <p className="mt-1 text-sm text-gray-600">{value}</p>
        </div>

        {/* Toggle */}
        <div className="ml-4">
          <Toggle
            checked={isChecked}
            onChange={() => onToggle()}
            aria-label={`${label} ${isChecked ? 'ON' : 'OFF'}`}
          />
        </div>
      </div>
    </Card>
  );
}

