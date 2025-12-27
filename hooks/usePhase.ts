/**
 * usePhase 훅
 * Phase 데이터 관리 (현재 Phase 가져오기, Phase 변경, Phase 설명)
 * 로딩 상태 및 에러 처리 포함
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { localStorageService } from '../services/LocalStorageService';
import { syncService } from '../services/SyncService';
import { IDB_STORE_NAMES } from '../types/services';
import type { Phase } from '../types';

/**
 * Phase 설명 타입
 */
interface PhaseDescription {
  number: Phase;
  name: string;
  description: string;
}

/**
 * usePhase 반환 타입
 */
interface UsePhaseReturn {
  currentPhase: Phase;
  loading: boolean;
  error: string | null;
  phaseDescription: PhaseDescription | null;
  allPhaseDescriptions: PhaseDescription[];
  changePhase: (phase: Phase) => Promise<void>;
  getPhaseDescription: (phase: Phase) => PhaseDescription;
  refresh: () => void;
}

/**
 * Phase 설명 데이터
 */
const PHASE_DESCRIPTIONS: PhaseDescription[] = [
  {
    number: 1,
    name: 'Baseline',
    description: '기본 기준 회복',
  },
  {
    number: 2,
    name: 'Stability',
    description: '안정화 단계',
  },
  {
    number: 3,
    name: 'Growth',
    description: '성장 단계',
  },
  {
    number: 4,
    name: 'Identity',
    description: '정체성 확립',
  },
];

/**
 * usePhase 훅
 */
export function usePhase(): UsePhaseReturn {
  const { state, updatePhase: updatePhaseContext } = useAppContext();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const currentPhase = state.currentPhase;

  /**
   * 현재 Phase 설명 가져오기
   */
  const phaseDescription = PHASE_DESCRIPTIONS.find((p) => p.number === currentPhase) ?? null;

  /**
   * Phase 설명 가져오기
   */
  const getPhaseDescription = useCallback((phase: Phase): PhaseDescription => {
    const description = PHASE_DESCRIPTIONS.find((p) => p.number === phase);
    if (!description) {
      // 기본값 반환
      return PHASE_DESCRIPTIONS[0];
    }
    return description;
  }, []);

  /**
   * Phase 변경
   */
  const changePhase = useCallback(
    async (phase: Phase) => {
      try {
        setLoading(true);
        setError(null);

        // Phase 유효성 검사
        if (phase < 1 || phase > 4) {
          throw new Error('유효하지 않은 Phase입니다. (1-4 사이의 값이어야 합니다)');
        }

        // Context 업데이트 (로컬 저장소에 자동 저장됨)
        updatePhaseContext(phase);

        // 로컬 저장소에도 저장 (추가 보장)
        localStorage.setItem('life-os:current-phase', phase.toString());

        // User의 current_phase도 업데이트
        const userId = localStorage.getItem('life-os:user-id');
        if (userId && state.user) {
          const updatedUser = {
            ...state.user,
            current_phase: phase,
          };

          await localStorageService.set(IDB_STORE_NAMES.USER, userId, updatedUser);

          // 백그라운드 동기화
          syncService.backgroundSync().catch((err) => {
            console.warn('Phase 변경 동기화 실패 (백그라운드):', err);
          });
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Phase 변경 실패';
        setError(errorMessage);
        console.error('usePhase changePhase 오류:', err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [updatePhaseContext, state.user]
  );

  /**
   * 상태 새로고침
   */
  const refresh = useCallback(() => {
    // Context에서 이미 상태를 가져오고 있으므로 별도 작업 불필요
    setError(null);
  }, []);

  return {
    currentPhase,
    loading,
    error,
    phaseDescription,
    allPhaseDescriptions: PHASE_DESCRIPTIONS,
    changePhase,
    getPhaseDescription,
    refresh,
  };
}

