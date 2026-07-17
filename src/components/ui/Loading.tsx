import { type ReactNode } from 'react';
import { Loader2 } from 'lucide-react';

export function LoadingSpinner({ size = 'md', label, className = '' }: { size?: 'sm' | 'md' | 'lg'; label?: string; className?: string }) {
  const sizes = { sm: 'w-4 h-4', md: 'w-6 h-6', lg: 'w-10 h-10' };
  return (
    <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
      <Loader2 className={`${sizes[size]} animate-spin text-primary-500`} />
      {label && <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>}
    </div>
  );
}

export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`skeleton rounded-lg ${className}`} />;
}

export function FullPageLoader({ label = 'Loading...' }: { label?: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
      <LoadingSpinner size="lg" label={label} />
    </div>
  );
}

export function EmptyState({ icon, title, description, action }: { icon: ReactNode; title: string; description: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="p-4 rounded-2xl bg-gray-100 dark:bg-gray-800 text-gray-400 mb-4">{icon}</div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">{title}</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mb-6">{description}</p>
      {action}
    </div>
  );
}
