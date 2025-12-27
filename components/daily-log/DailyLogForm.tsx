/**
 * DailyLogForm 컴포넌트
 * 오늘의 기준 한 줄, 몸 상태, 자유 메모 입력
 * 구글 캘린더 스타일 폼
 */

'use client';

import { useState, useEffect } from 'react';
import { DailyLogFormProps } from '@/types/components';
import { Input, Textarea, Button } from '@/components/common';
import { Card } from '@/components/common/Card';
import type { BodyState, BaselineCheck } from '@/types';

/**
 * DailyLogForm 컴포넌트
 */
export function DailyLogForm({ date, initialData, onSave }: DailyLogFormProps) {
  const [oneLine, setOneLine] = useState<string>(initialData?.one_line || '');
  const [bodyState, setBodyState] = useState<BodyState | null>(
    (initialData?.body_state as BodyState) || null
  );
  const [memo, setMemo] = useState<string>(initialData?.memo || '');
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // initialData 변경 시 폼 업데이트
  useEffect(() => {
    if (initialData) {
      setOneLine(initialData.one_line || '');
      setBodyState((initialData.body_state as BodyState) || null);
      setMemo(initialData.memo || '');
    }
  }, [initialData]);

  /**
   * 저장 핸들러
   */
  const handleSave = async () => {
    try {
      setIsSaving(true);

      // Baseline 체크는 현재 상태 유지 (Home에서 관리)
      const baselineCheck: BaselineCheck = initialData?.baseline_check || {
        sleep: false,
        movement: false,
        record: false,
      };

      const saveData = {
        baseline_check: baselineCheck,
        one_line: oneLine,
        body_state: bodyState,
        memo: memo || null,
      };
      
      await onSave(saveData);

      // 저장 성공 피드백 (조용하게)
      // 별도 알림 없이 조용히 저장됨
    } catch (error) {
      console.error('저장 오류:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="p-6 space-y-6">
      {/* 오늘의 기준 한 줄 */}
      <div>
        <Input
          label="오늘의 기준 한 줄"
          value={oneLine}
          onChange={(e) => setOneLine(e.target.value)}
          placeholder="오늘의 기준을 한 줄로 입력하세요"
          id="one-line-input"
        />
      </div>

      {/* 몸 상태 선택 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          몸 상태
        </label>
        <div className="flex gap-4">
          {(['good', 'normal', 'heavy'] as BodyState[]).map((state) => {
            const labels = {
              good: '좋음',
              normal: '보통',
              heavy: '무거움',
            };

            return (
              <label
                key={state}
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  type="radio"
                  name="body-state"
                  value={state}
                  checked={bodyState === state}
                  onChange={() => setBodyState(state)}
                  className="w-4 h-4 text-primary-500 focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700">{labels[state]}</span>
              </label>
            );
          })}
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="body-state"
              value=""
              checked={bodyState === null}
              onChange={() => setBodyState(null)}
              className="w-4 h-4 text-primary-500 focus:ring-primary-500"
            />
            <span className="text-sm text-gray-500">선택 안 함</span>
          </label>
        </div>
      </div>

      {/* 자유 메모 */}
      <div>
        <Textarea
          label="자유 메모"
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
          placeholder="추가적인 생각이나 기록을 남기세요 (선택 사항)"
          rows={6}
          id="memo-textarea"
        />
      </div>

      {/* 저장 버튼 */}
      <div className="flex justify-end pt-4">
        <Button
          variant="primary"
          size="lg"
          onClick={handleSave}
          loading={isSaving}
          disabled={isSaving}
        >
          기록하기
        </Button>
      </div>
    </Card>
  );
}

