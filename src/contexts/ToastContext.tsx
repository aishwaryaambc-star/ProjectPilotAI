import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { CheckCircle2, XCircle, AlertCircle, Info, X } from 'lucide-react';

type ToastType = 'success' | 'error' | 'warning' | 'info';
interface Toast { id: string; type: ToastType; message: string }
interface ToastContextValue { toast: (message: string, type?: ToastType) => void }

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

const icons = { success: CheckCircle2, error: XCircle, warning: AlertCircle, info: Info };
const colors = {
  success: 'text-success-500 bg-success-50 dark:bg-success-900/20',
  error: 'text-error-500 bg-error-50 dark:bg-error-900/20',
  warning: 'text-warning-500 bg-warning-50 dark:bg-warning-900/20',
  info: 'text-primary-500 bg-primary-50 dark:bg-primary-900/20',
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((message: string, type: ToastType = 'info') => {
    const id = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev.slice(-3), { id, type, message }]);
    const timer = setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000);
    return () => clearTimeout(timer);
  }, []);

  const dismiss = (id: string) => setToasts((prev) => prev.filter((t) => t.id !== id));

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 max-w-sm">
        {toasts.map((t) => {
          const Icon = icons[t.type];
          return (
            <div key={t.id} className="flex items-start gap-3 p-4 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-lg animate-slide-in-right">
              <div className={`shrink-0 p-1.5 rounded-lg ${colors[t.type]}`}><Icon className="w-4 h-4" /></div>
              <p className="text-sm text-gray-700 dark:text-gray-300 flex-1 pt-1">{t.message}</p>
              <button onClick={() => dismiss(t.id)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"><X className="w-4 h-4" /></button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
