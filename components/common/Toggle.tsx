/**
 * Toggle 컴포넌트
 * ON/OFF 상태 표시
 * 부드러운 애니메이션 및 접근성 고려
 */

'use client';

import { ToggleProps as TogglePropsType } from '@/types/components';

/**
 * Toggle 컴포넌트
 */
export function Toggle({
  checked,
  onChange,
  label,
  disabled = false,
}: TogglePropsType) {
  const handleToggle = () => {
    if (!disabled) {
      onChange(!checked);
    }
  };

  return (
    <label
      className={`
        inline-flex items-center gap-3 cursor-pointer
        ${disabled ? 'cursor-not-allowed opacity-50' : ''}
      `}
    >
      {/* Toggle Switch */}
      <div className="relative">
        <input
          type="checkbox"
          checked={checked}
          onChange={handleToggle}
          disabled={disabled}
          className="sr-only"
          aria-label={label || '토글'}
          aria-checked={checked}
        />
        <div
          className={`
            w-11 h-6 rounded-full transition-colors duration-300 ease-in-out
            ${checked ? 'bg-baseline-on' : 'bg-baseline-off'}
            ${disabled ? 'opacity-50' : ''}
          `}
          role="switch"
          aria-checked={checked}
          aria-label={label || '토글'}
        >
          {/* Toggle Thumb */}
          <div
            className={`
              absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full
              shadow-sm transition-transform duration-300 ease-in-out
              ${checked ? 'translate-x-5' : 'translate-x-0'}
            `}
          />
        </div>
      </div>

      {/* Label */}
      {label && (
        <span
          className={`
            text-sm font-medium
            ${checked ? 'text-gray-900' : 'text-gray-600'}
            ${disabled ? 'text-gray-400' : ''}
          `}
        >
          {label}
        </span>
      )}
    </label>
  );
}

