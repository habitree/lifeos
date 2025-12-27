/**
 * 사용자 프로필 컴포넌트
 * 사용자 정보 표시 및 로그아웃 기능
 */

'use client';

import { useAuth } from '@/hooks/useAuth';
import { useState } from 'react';

/**
 * UserProfile Props
 */
interface UserProfileProps {
  className?: string;
}

/**
 * 사용자 프로필 컴포넌트
 */
export function UserProfile({ className = '' }: UserProfileProps) {
  const { user, signOut, loading } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  if (!user) {
    return null;
  }

  const handleSignOut = async () => {
    try {
      setIsLoggingOut(true);
      await signOut();
    } catch (error) {
      console.error('로그아웃 오류:', error);
      setIsLoggingOut(false);
    }
  };

  return (
    <div className={`flex items-center gap-4 ${className}`}>
      {/* 프로필 이미지 */}
      {user.profile_image ? (
        <img
          src={user.profile_image}
          alt={user.nickname || '프로필'}
          className="w-10 h-10 rounded-full"
        />
      ) : (
        <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
          <span className="text-gray-600 text-sm">
            {user.nickname?.[0] || user.email?.[0] || 'U'}
          </span>
        </div>
      )}

      {/* 사용자 정보 */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">
          {user.nickname || user.email || '사용자'}
        </p>
        {user.email && user.nickname && (
          <p className="text-xs text-gray-500 truncate">{user.email}</p>
        )}
      </div>

      {/* 로그아웃 버튼 */}
      <button
        onClick={handleSignOut}
        disabled={loading || isLoggingOut}
        className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoggingOut ? '로그아웃 중...' : '로그아웃'}
      </button>
    </div>
  );
}

