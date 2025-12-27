/**
 * Phase 페이지
 * 현재 Phase 확인 및 변경
 */

'use client';

import { usePhase } from '@/hooks';
import { PhaseSelector } from '@/components/phase';
import { Card } from '@/components/common/Card';
import type { Phase } from '@/types';

/**
 * Phase 페이지
 */
export default function PhasePage() {
  const {
    currentPhase,
    phaseDescription,
    allPhaseDescriptions,
    changePhase,
    loading,
    error,
  } = usePhase();

  /**
   * Phase 변경 핸들러
   */
  const handlePhaseChange = async (phase: Phase) => {
    try {
      await changePhase(phase);
      // 변경 성공 (조용하게 처리)
    } catch (error) {
      console.error('Phase 변경 실패:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* 에러 메시지 */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* 현재 Phase 설명 */}
      {phaseDescription && (
        <Card className="p-6">
          <div className="text-center space-y-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Phase {phaseDescription.number}: {phaseDescription.name}
              </h2>
              <p className="text-lg text-gray-600">{phaseDescription.description}</p>
            </div>

            {/* Phase별 색상 표시 */}
            <div
              className={`
                inline-flex items-center gap-2 px-6 py-3 rounded-lg border-2
                ${
                  currentPhase === 1
                    ? 'bg-phase-1/10 text-phase-1 border-phase-1'
                    : currentPhase === 2
                    ? 'bg-phase-2/10 text-phase-2 border-phase-2'
                    : currentPhase === 3
                    ? 'bg-phase-3/10 text-phase-3 border-phase-3'
                    : 'bg-phase-4/10 text-phase-4 border-phase-4'
                }
              `}
            >
              <span className="text-sm font-medium">
                현재 상태: {phaseDescription.description}
              </span>
            </div>
          </div>
        </Card>
      )}

      {/* Phase 선택기 */}
      <PhaseSelector
        currentPhase={currentPhase}
        onPhaseChange={handlePhaseChange}
      />

      {/* 모든 Phase 설명 */}
      <Card className="p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">모든 Phase</h3>
        <div className="space-y-3">
          {allPhaseDescriptions.map((phaseDesc) => {
            const isCurrent = phaseDesc.number === currentPhase;
            return (
              <div
                key={phaseDesc.number}
                className={`
                  p-4 rounded-lg border
                  ${
                    isCurrent
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 bg-white'
                  }
                `}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-gray-900">
                        Phase {phaseDesc.number}: {phaseDesc.name}
                      </span>
                      {isCurrent && (
                        <span className="text-xs px-2 py-0.5 bg-primary-500 text-white rounded">
                          현재
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{phaseDesc.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

