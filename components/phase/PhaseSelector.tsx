/**
 * PhaseSelector 컴포넌트
 * Phase 선택 및 변경
 * Phase별 색상 적용
 */

'use client';

import { useState } from 'react';
import { PhaseSelectorProps } from '@/types/components';
import { usePhase } from '@/hooks';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import type { Phase } from '@/types';

/**
 * PhaseSelector 컴포넌트
 */
export function PhaseSelector({ currentPhase, onPhaseChange }: PhaseSelectorProps) {
  const { allPhaseDescriptions, getPhaseDescription, changePhase, loading } = usePhase();
  const [selectedPhase, setSelectedPhase] = useState<Phase>(currentPhase);
  const [isChanging, setIsChanging] = useState<boolean>(false);

  /**
   * Phase 변경 핸들러
   */
  const handlePhaseChange = async (phase: Phase) => {
    if (phase === selectedPhase || isChanging) return;

    try {
      setIsChanging(true);
      setSelectedPhase(phase);
      
      // Phase 변경 (즉시 저장)
      await changePhase(phase);
      
      // 부모 컴포넌트에 알림
      onPhaseChange(phase);
    } catch (error) {
      console.error('Phase 변경 오류:', error);
      // 에러 발생 시 이전 상태로 복구
      setSelectedPhase(currentPhase);
    } finally {
      setIsChanging(false);
    }
  };

  /**
   * Phase별 색상 스타일
   */
  const getPhaseColorClasses = (phase: Phase, isSelected: boolean) => {
    const baseColors = {
      1: 'bg-phase-1/10 text-phase-1 border-phase-1',
      2: 'bg-phase-2/10 text-phase-2 border-phase-2',
      3: 'bg-phase-3/10 text-phase-3 border-phase-3',
      4: 'bg-phase-4/10 text-phase-4 border-phase-4',
    };

    const selectedColors = {
      1: 'bg-phase-1 text-white border-phase-1',
      2: 'bg-phase-2 text-white border-phase-2',
      3: 'bg-phase-3 text-white border-phase-3',
      4: 'bg-phase-4 text-white border-phase-4',
    };

    if (isSelected) {
      return `${selectedColors[phase]} shadow-md`;
    }
    return `${baseColors[phase]} hover:opacity-80`;
  };

  return (
    <div className="space-y-4">
      {/* 현재 Phase 표시 */}
      <div className="text-center">
        <p className="text-sm text-gray-600 mb-2">현재 Phase</p>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border-2 bg-white">
          <span className="text-lg font-semibold">
            Phase {currentPhase}: {getPhaseDescription(currentPhase).name}
          </span>
        </div>
      </div>

      {/* Phase 선택 버튼 그룹 */}
      <Card className="p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Phase 변경
        </h3>
        <p className="text-sm text-gray-600 mb-6">
          &quot;나는 지금 이 상태다&quot;를 선언하세요
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {allPhaseDescriptions.map((phaseDesc) => {
            const isSelected = selectedPhase === phaseDesc.number;
            const isCurrentPhase = currentPhase === phaseDesc.number;

            return (
              <button
                key={phaseDesc.number}
                type="button"
                onClick={() => handlePhaseChange(phaseDesc.number)}
                disabled={isChanging || loading}
                className={`
                  px-4 py-4 rounded-lg border-2 text-left
                  transition-all duration-200
                  ${getPhaseColorClasses(phaseDesc.number, isSelected)}
                  ${isSelected ? 'ring-2 ring-offset-2 ring-offset-white' : ''}
                  ${isChanging || loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                  focus:outline-none focus:ring-2 focus:ring-offset-2
                `}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold">
                        Phase {phaseDesc.number}
                      </span>
                      {isCurrentPhase && (
                        <span className="text-xs px-2 py-0.5 bg-white/20 rounded">
                          현재
                        </span>
                      )}
                    </div>
                    <p className="text-sm font-medium mb-1">{phaseDesc.name}</p>
                    <p className="text-xs opacity-90">{phaseDesc.description}</p>
                  </div>
                  {isSelected && (
                    <svg
                      className="w-5 h-5 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* 안내 메시지 */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">
            💡 Phase는 자동으로 변경되지 않습니다. 당신이 직접 선택하는 현재 상태입니다.
          </p>
        </div>
      </Card>
    </div>
  );
}

