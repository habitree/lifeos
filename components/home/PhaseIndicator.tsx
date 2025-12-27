/**
 * PhaseIndicator 컴포넌트
 * 현재 Phase 표시
 * Phase별 색상 적용
 */

'use client';

import { Phase } from '@/types';
import { usePhase } from '@/hooks';

/**
 * PhaseIndicator Props
 */
interface PhaseIndicatorProps {
  currentPhase?: Phase;
}

/**
 * PhaseIndicator 컴포넌트
 */
export function PhaseIndicator({ currentPhase }: PhaseIndicatorProps) {
  const { phaseDescription, getPhaseDescription } = usePhase();
  
  const phase = currentPhase 
    ? getPhaseDescription(currentPhase)
    : phaseDescription;

  if (!phase) {
    return null;
  }

  // Phase별 색상
  const phaseColors = {
    1: 'bg-phase-1/10 text-phase-1 border-phase-1/20',
    2: 'bg-phase-2/10 text-phase-2 border-phase-2/20',
    3: 'bg-phase-3/10 text-phase-3 border-phase-3/20',
    4: 'bg-phase-4/10 text-phase-4 border-phase-4/20',
  };

  return (
    <div
      className={`
        inline-flex items-center gap-2 px-4 py-2 rounded-lg border
        ${phaseColors[phase.number]}
      `}
    >
      <span className="text-sm font-medium">
        Phase {phase.number}: {phase.name}
      </span>
      <span className="text-xs text-gray-600">({phase.description})</span>
    </div>
  );
}

