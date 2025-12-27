/**
 * Card 컴포넌트
 * 구글 캘린더 스타일 카드
 * 적절한 여백 및 그림자
 */

'use client';

import { HTMLAttributes, forwardRef } from 'react';

/**
 * Card Props
 */
export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
}

/**
 * Card 컴포넌트
 */
export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ children, className = '', hover = false, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`
          bg-white rounded-lg border border-gray-200
          shadow-sm
          ${hover ? 'hover:shadow-md transition-shadow duration-200' : ''}
          ${className}
        `}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

