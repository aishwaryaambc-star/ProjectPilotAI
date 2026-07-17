import { Rocket } from 'lucide-react';

export function Logo({ size = 'md', showText = true }: { size?: 'sm' | 'md' | 'lg'; showText?: boolean }) {
  const sizes = {
    sm: { icon: 'w-7 h-7', text: 'text-base', inner: 'w-3.5 h-3.5' },
    md: { icon: 'w-9 h-9', text: 'text-lg', inner: 'w-5 h-5' },
    lg: { icon: 'w-12 h-12', text: 'text-2xl', inner: 'w-6 h-6' },
  };
  const s = sizes[size];

  return (
    <div className="flex items-center gap-2.5">
      <div className={`${s.icon} rounded-xl bg-gradient-to-br from-primary-600 to-accent-500 flex items-center justify-center shadow-lg shadow-primary-600/30`}>
        <Rocket className={`${s.inner} text-white`} />
      </div>
      {showText && (
        <span className={`${s.text} font-bold tracking-tight text-gray-900 dark:text-white`}>
          ProjectPilot<span className="text-primary-600 dark:text-primary-400"> AI</span>
        </span>
      )}
    </div>
  );
}
