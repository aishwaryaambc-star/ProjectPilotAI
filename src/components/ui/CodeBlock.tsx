import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { CopyButton } from './CopyButton';

export function CodeBlock({ code, language = 'bash', title }: { code: string; language?: string; title?: string }) {
  const [expanded, setExpanded] = useState(false);
  const lines = code.split('\n');
  const isLong = lines.length > 15;
  const displayCode = isLong && !expanded ? lines.slice(0, 15).join('\n') : code;

  return (
    <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950">
      {title && (
        <div className="flex items-center justify-between px-4 py-2.5 bg-gray-100 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
          <span className="text-xs font-medium text-gray-600 dark:text-gray-400">{title}</span>
          <span className="text-xs text-gray-400 uppercase tracking-wide">{language}</span>
        </div>
      )}
      <div className="relative group">
        <pre className="p-4 overflow-x-auto scrollbar-thin text-sm font-mono text-gray-800 dark:text-gray-200 leading-relaxed">
          <code>{displayCode}</code>
        </pre>
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <CopyButton text={code} />
        </div>
      </div>
      {isLong && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center justify-center gap-1 py-2 text-xs font-medium text-primary-600 dark:text-primary-400 hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors border-t border-gray-200 dark:border-gray-800"
        >
          {expanded ? 'Show less' : `Show ${lines.length - 15} more lines`}
          <ChevronDown className={`w-3.5 h-3.5 transition-transform ${expanded ? 'rotate-180' : ''}`} />
        </button>
      )}
    </div>
  );
}
