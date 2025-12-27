/**
 * Auth Context
 * 인증 상태 관리 및 카카오 로그인 처리
 */

'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabaseClient } from '@/lib/supabase-client';
import type { User } from '@/types';
import type { Session, AuthError } from '@supabase/supabase-js';

/**
 * 인증 상태 타입
 */
interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  error: string | null;
}

/**
 * AuthContext 값 타입
 */
interface AuthContextValue extends AuthState {
  signInWithKakao: () => Promise<void>;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

/**
 * AuthContext 생성
 */
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

/**
 * AuthProvider Props
 */
interface AuthProviderProps {
  children: React.ReactNode;
}

/**
 * AuthProvider 컴포넌트
 * 인증 상태를 제공하고 세션을 관리합니다.
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
    error: null,
  });

  /**
   * Supabase 사용자 정보를 User 타입으로 변환
   */
  const mapSupabaseUserToUser = useCallback(async (authUser: any): Promise<User | null> => {
    if (!authUser) return null;

    try {
      // users 테이블에서 사용자 정보 조회
      const { data: userData, error } = await supabaseClient
        .from('users')
        .select('*')
        .eq('auth_user_id', authUser.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('사용자 정보 조회 실패:', error);
        return null;
      }

      // 사용자가 없으면 생성
      if (!userData) {
        // 카카오 사용자 정보 추출
        const userMetadata = authUser.user_metadata || {};
        const kakaoId = userMetadata.kakao_id || userMetadata.sub?.replace('kakao:', '');
        
        const newUser: Omit<User, 'id' | 'created_at'> = {
          current_phase: 1,
          auth_user_id: authUser.id,
          kakao_id: kakaoId ? parseInt(kakaoId, 10) : null,
          email: authUser.email || userMetadata.email || null,
          nickname: userMetadata.nickname || userMetadata.name || null,
          profile_image: userMetadata.avatar_url || userMetadata.picture || null,
          is_anonymous: false,
        };

        const { data: createdUser, error: createError } = await supabaseClient
          .from('users')
          .insert(newUser as any)
          .select()
          .single();

        if (createError) {
          console.error('사용자 생성 실패:', createError);
          return null;
        }

        return createdUser as User;
      }

      return userData as User;
    } catch (error) {
      console.error('사용자 정보 변환 실패:', error);
      return null;
    }
  }, []);

  /**
   * 세션 확인 및 사용자 정보 로드
   */
  const loadSession = useCallback(async () => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      const { data: { session }, error } = await supabaseClient.auth.getSession();

      if (error) {
        throw error;
      }

      if (session?.user) {
        const user = await mapSupabaseUserToUser(session.user);
        setState({
          user,
          session,
          loading: false,
          error: null,
        });
      } else {
        setState({
          user: null,
          session: null,
          loading: false,
          error: null,
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '세션 로드 실패';
      setState((prev) => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
      console.error('세션 로드 오류:', error);
    }
  }, [mapSupabaseUserToUser]);

  /**
   * 카카오 로그인
   */
  const signInWithKakao = useCallback(async () => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      const { data, error } = await supabaseClient.auth.signInWithOAuth({
        provider: 'kakao',
        options: {
          redirectTo: `${window.location.origin}/api/auth/callback`,
        },
      });

      if (error) {
        throw error;
      }

      // 리다이렉트가 시작되면 여기서 반환
      // 실제 로그인은 카카오 페이지에서 처리됨
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '카카오 로그인 실패';
      setState((prev) => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
      console.error('카카오 로그인 오류:', error);
      throw error;
    }
  }, []);

  /**
   * 로그아웃
   */
  const signOut = useCallback(async () => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      const { error } = await supabaseClient.auth.signOut();

      if (error) {
        throw error;
      }

      // 로컬 저장소 정리
      localStorage.removeItem('life-os:user-id');

      setState({
        user: null,
        session: null,
        loading: false,
        error: null,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '로그아웃 실패';
      setState((prev) => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
      console.error('로그아웃 오류:', error);
      throw error;
    }
  }, []);

  /**
   * 세션 새로고침
   */
  const refreshSession = useCallback(async () => {
    await loadSession();
  }, [loadSession]);

  /**
   * 초기 세션 로드
   */
  useEffect(() => {
    loadSession();
  }, [loadSession]);

  /**
   * 인증 상태 변경 감지
   */
  useEffect(() => {
    const {
      data: { subscription },
    } = supabaseClient.auth.onAuthStateChange(async (event, session) => {
      console.log('인증 상태 변경:', event, session?.user?.id);

      if (event === 'SIGNED_IN' && session?.user) {
        const user = await mapSupabaseUserToUser(session.user);
        setState({
          user,
          session,
          loading: false,
          error: null,
        });
      } else if (event === 'SIGNED_OUT') {
        localStorage.removeItem('life-os:user-id');
        setState({
          user: null,
          session: null,
          loading: false,
          error: null,
        });
      } else if (event === 'TOKEN_REFRESHED' && session) {
        // 토큰 갱신 시 사용자 정보는 그대로 유지
        setState((prev) => ({
          ...prev,
          session,
        }));
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [mapSupabaseUserToUser]);

  const value: AuthContextValue = {
    ...state,
    signInWithKakao,
    signOut,
    refreshSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * useAuth 훅
 * AuthContext를 사용하기 위한 커스텀 훅
 */
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

