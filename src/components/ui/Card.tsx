import { type ReactNode } from 'react';

interface CardProps { children: ReactNode; className?: string; hover?: boolean; onClick?: () => void }

export function Card({ children, className = '', hover = true, onClick }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={`bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm ${
        hover ? 'hover:shadow-lg hover:border-gray-300 dark:hover:border-gray-700 transition-all duration-300' : ''
      } ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {children}
    </div>
  );
}

export function CardBody({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`p-5 ${className}`}>{children}</div>;
}
