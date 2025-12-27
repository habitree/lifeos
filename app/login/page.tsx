/**
 * 로그인 페이지
 * 카카오 로그인 및 기존 데이터 병합 안내
 */

'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { KakaoLoginButton } from '@/components/auth/KakaoLoginButton';
import { useAuth } from '@/hooks/useAuth';
import { userMergeService } from '@/services/UserMergeService';

/**
 * 로그인 페이지
 */
export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, session, loading, refreshSession } = useAuth();
  const [isMerging, setIsMerging] = useState(false);
  const [mergeMessage, setMergeMessage] = useState<string | null>(null);
  const error = searchParams.get('error');

  // 이미 로그인된 경우 홈으로 리다이렉트
  useEffect(() => {
    if (!loading && user && session) {
      router.push('/');
    }
  }, [user, session, loading, router]);

  // 로그인 성공 후 사용자 병합 처리
  useEffect(() => {
    const handleMerge = async () => {
      if (!session?.user || !user) return;

      // 기존 로컬 사용자 ID 확인
      const localUserId = localStorage.getItem('life-os:user-id');
      
      // 이미 병합된 사용자면 스킵
      if (user.auth_user_id && !user.is_anonymous) {
        return;
      }

      // 로컬 사용자가 있고, 익명 사용자인 경우 병합
      if (localUserId && user.is_anonymous) {
        setIsMerging(true);
        setMergeMessage('기존 데이터를 카카오 계정에 병합하는 중...');

        try {
          const result = await userMergeService.mergeLocalUserToKakaoAccount(
            session.user.id,
            localUserId
          );

          if (result.success) {
            setMergeMessage('데이터 병합이 완료되었습니다.');
            // 세션 새로고침하여 업데이트된 사용자 정보 로드
            await refreshSession();
            // 잠시 후 홈으로 리다이렉트
            setTimeout(() => {
              router.push('/');
            }, 1500);
          } else {
            setMergeMessage(result.error || '데이터 병합 중 오류가 발생했습니다.');
          }
        } catch (error) {
          console.error('사용자 병합 오류:', error);
          setMergeMessage('데이터 병합 중 오류가 발생했습니다.');
        } finally {
          setIsMerging(false);
        }
      }
    };

    handleMerge();
  }, [session, user, refreshSession, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">LIFE OS</h1>
          <p className="text-gray-600">기준으로 돌아오는 루틴 앱</p>
        </div>

        {/* 에러 메시지 */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{decodeURIComponent(error)}</p>
          </div>
        )}

        {/* 병합 메시지 */}
        {mergeMessage && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              mergeMessage.includes('완료')
                ? 'bg-green-50 border border-green-200'
                : 'bg-blue-50 border border-blue-200'
            }`}
          >
            <p
              className={`text-sm ${
                mergeMessage.includes('완료') ? 'text-green-600' : 'text-blue-600'
              }`}
            >
              {mergeMessage}
            </p>
          </div>
        )}

        {/* 로그인 버튼 */}
        {!user && !loading && (
          <div className="space-y-4">
            <KakaoLoginButton
              onLoginStart={() => setIsMerging(true)}
              onLoginError={(error) => {
                setMergeMessage(error);
                setIsMerging(false);
              }}
            />

            <div className="text-center text-sm text-gray-500 mt-6">
              <p>카카오 계정으로 로그인하면</p>
              <p>여러 기기에서 데이터를 동기화할 수 있습니다.</p>
            </div>
          </div>
        )}

        {/* 로딩 중 */}
        {(loading || isMerging) && !mergeMessage && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
            <p className="text-gray-600">
              {loading ? '로그인 처리 중...' : '데이터 병합 중...'}
            </p>
          </div>
        )}

        {/* 기존 데이터 병합 안내 */}
        {!user && !loading && (
          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="text-sm font-medium text-blue-900 mb-2">기존 데이터가 있나요?</h3>
            <p className="text-xs text-blue-700">
              카카오로 로그인하면 기존에 저장한 Baseline과 Daily Log가 자동으로 카카오 계정에
              병합됩니다.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

