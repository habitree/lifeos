/**
 * Sidebar 컴포넌트
 * 반응형 사이드바: 데스크톱에서는 고정, 모바일에서는 Drawer
 * 구글 캘린더 스타일 참고
 */

'use client';

import { usePathname, useRouter } from 'next/navigation';
import { SidebarProps } from '@/types/components';

/**
 * 네비게이션 메뉴 아이템 타입
 */
interface NavItem {
  label: string;
  path: string;
  icon?: string;
}

/**
 * 네비게이션 메뉴
 */
const navItems: NavItem[] = [
  { label: 'Home', path: '/', icon: '🏠' },
  { label: 'Daily Log', path: '/daily-log', icon: '📝' },
  { label: 'Phase', path: '/phase', icon: '🎯' },
];

/**
 * Sidebar 컴포넌트
 */
export function Sidebar({ currentPath, isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  /**
   * 메뉴 클릭 핸들러
   */
  const handleMenuClick = (path: string) => {
    router.push(path);
    // 모바일에서 메뉴 클릭 시 Drawer 닫기
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  /**
   * 현재 경로와 일치하는지 확인
   */
  const isActive = (path: string): boolean => {
    if (path === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(path);
  };

  return (
    <>
      {/* 모바일: 오버레이 (Drawer 열릴 때 배경 어둡게) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full bg-white border-r border-gray-200
          z-50 transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:static lg:z-auto lg:w-60
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          w-60 shadow-lg lg:shadow-none
        `}
      >
        {/* Sidebar 내용 */}
        <div className="flex flex-col h-full">
          {/* 로고/앱 이름 */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h1 className="text-xl font-semibold text-gray-800">LIFE OS</h1>
            {/* 모바일: 닫기 버튼 */}
            <button
              onClick={onClose}
              className="lg:hidden p-2 rounded-md hover:bg-gray-100 text-gray-600"
              aria-label="메뉴 닫기"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* 네비게이션 메뉴 */}
          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              {navItems.map((item) => {
                const active = isActive(item.path);
                return (
                  <li key={item.path}>
                    <button
                      onClick={() => handleMenuClick(item.path)}
                      className={`
                        w-full flex items-center gap-3 px-4 py-3 rounded-lg
                        transition-colors duration-200
                        ${
                          active
                            ? 'bg-primary-50 text-primary-700 font-medium'
                            : 'text-gray-700 hover:bg-gray-50'
                        }
                      `}
                    >
                      {item.icon && (
                        <span className="text-xl" aria-hidden="true">
                          {item.icon}
                        </span>
                      )}
                      <span>{item.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* 하단 여백 (선택적) */}
          <div className="p-4 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              기준으로 돌아오는 루틴
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}

