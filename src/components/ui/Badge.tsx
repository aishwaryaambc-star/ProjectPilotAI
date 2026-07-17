import { type ReactNode } from 'react';

type Variant = 'default' | 'primary' | 'success' | 'warning' | 'error' | 'accent';

const variants: Record<Variant, string> = {
  default: 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400',
  primary: 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400',
  success: 'bg-success-50 dark:bg-success-900/30 text-success-600 dark:text-success-400',
  warning: 'bg-warning-50 dark:bg-warning-900/30 text-warning-600 dark:text-warning-400',
  error: 'bg-error-50 dark:bg-error-900/30 text-error-600 dark:text-error-400',
  accent: 'bg-accent-50 dark:bg-accent-900/30 text-accent-600 dark:text-accent-400',
};

export function Badge({ children, variant = 'default', size = 'sm' }: { children: ReactNode; variant?: Variant; size?: 'sm' | 'md' }) {
  return (
    <span className={`inline-flex items-center rounded-full font-medium ${size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-sm'} ${variants[variant]}`}>
      {children}
    </span>
  );
}
