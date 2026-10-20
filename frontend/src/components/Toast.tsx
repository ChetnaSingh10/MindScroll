import React from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';
import { cn } from '../lib/utils';

export interface ToastMessage {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  title: string;
  description?: string;
}

interface ToastContainerProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onDismiss }) => {
  return (
    <div
      aria-live="polite"
      className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-4 sm:px-0"
    >
      {toasts.map((toast) => {
        const iconVariants = {
          success: <CheckCircle2 className="w-4 h-4 text-status-good shrink-0 mt-0.5" />,
          warning: <AlertTriangle className="w-4 h-4 text-status-moderate shrink-0 mt-0.5" />,
          error: <AlertCircle className="w-4 h-4 text-status-concern shrink-0 mt-0.5" />,
          info: <Info className="w-4 h-4 text-accent shrink-0 mt-0.5" />,
        };

        const borderVariants = {
          success: 'border-status-good/30',
          warning: 'border-status-moderate/30',
          error: 'border-status-concern/30',
          info: 'border-accent/30',
        };

        return (
          <div
            key={toast.id}
            role="status"
            className={cn(
              'pointer-events-auto p-4 rounded-xl bg-surface border shadow-lg flex items-start gap-3 transition-all duration-200',
              borderVariants[toast.type]
            )}
          >
            {iconVariants[toast.type]}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-fg">{toast.title}</p>
              {toast.description && (
                <p className="text-xs text-muted mt-0.5 leading-relaxed">{toast.description}</p>
              )}
            </div>
            <button
              onClick={() => onDismiss(toast.id)}
              className="text-muted hover:text-fg transition-colors p-0.5 rounded-md focus:outline-none focus:ring-1 focus:ring-accent"
              aria-label="Dismiss notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
