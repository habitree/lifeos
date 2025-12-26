/**
 * 컴포넌트 Props 타입 정의
 */

import { DailyLog, BaselineCheck } from './database';

/**
 * Phase 타입 (1-4)
 */
export type Phase = 1 | 2 | 3 | 4;

/**
 * Sidebar 컴포넌트 Props
 */
export interface SidebarProps {
  currentPath: string;
  isOpen: boolean;
  onClose: () => void;
}

/**
 * BaselineCard 컴포넌트 Props
 */
export interface BaselineCardProps {
  type: 'sleep' | 'movement' | 'record';
  label: string;
  value: string;
  isChecked: boolean;
  onToggle: () => void;
}

/**
 * ResetButton 컴포넌트 Props
 */
export interface ResetButtonProps {
  onReset: () => void;
}

/**
 * DailyLogForm 컴포넌트 Props
 */
export interface DailyLogFormProps {
  date: string; // YYYY-MM-DD
  initialData?: Partial<DailyLog>;
  onSave: (data: {
    baseline_check: BaselineCheck;
    one_line: string;
    body_state: 'good' | 'normal' | 'heavy' | null;
    memo: string | null;
  }) => void | Promise<void>;
}

/**
 * PhaseSelector 컴포넌트 Props
 */
export interface PhaseSelectorProps {
  currentPhase: Phase;
  onPhaseChange: (phase: Phase) => void;
}

/**
 * Button 컴포넌트 Props
 */
export interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'reset';
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

/**
 * Toggle 컴포넌트 Props
 */
export interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
}

