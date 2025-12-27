/**
 * 카카오 로그인 버튼 컴포넌트
 */

'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';

/**
 * KakaoLoginButton Props
 */
interface KakaoLoginButtonProps {
  className?: string;
  onLoginStart?: () => void;
  onLoginError?: (error: string) => void;
}

/**
 * 카카오 로그인 버튼
 */
export function KakaoLoginButton({
  className = '',
  onLoginStart,
  onLoginError,
}: KakaoLoginButtonProps) {
  const { signInWithKakao, loading } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleClick = async () => {
    try {
      setIsProcessing(true);
      onLoginStart?.();
      await signInWithKakao();
      // 리다이렉트가 시작되면 여기서 반환
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '로그인 실패';
      onLoginError?.(errorMessage);
      setIsProcessing(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading || isProcessing}
      className={`
        flex items-center justify-center gap-3
        w-full px-6 py-3
        bg-[#FEE500] hover:bg-[#FDD835]
        text-[#000000] font-medium
        rounded-lg
        transition-colors
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
    >
      {loading || isProcessing ? (
        <>
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#000000]"></div>
          <span>로그인 중...</span>
        </>
      ) : (
        <>
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10 0C4.477 0 0 4.023 0 9c0 3.18 2.006 5.89 4.8 6.97L3.5 20l4.5-2.5c1.2.2 2.467.3 3.8.3 5.523 0 10-4.023 10-9S15.523 0 10 0z"
              fill="#000000"
            />
          </svg>
          <span>카카오로 시작하기</span>
        </>
      )}
    </button>
  );
}

