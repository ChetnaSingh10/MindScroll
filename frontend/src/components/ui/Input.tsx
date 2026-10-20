import React from 'react';
import { cn } from '../../lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helper?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helper, id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label htmlFor={inputId} className="block text-xs font-medium text-fg uppercase tracking-wider font-mono">
            {label}
          </label>
        )}
        <input
          id={inputId}
          ref={ref}
          className={cn(
            'w-full bg-surface-2 border border-line text-fg placeholder:text-muted rounded-xl px-3.5 py-2.5 text-sm transition-colors',
            'focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/40',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            error && 'border-status-concern focus:border-status-concern focus:ring-status-concern/30',
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-status-concern">{error}</p>}
        {!error && helper && <p className="text-xs text-muted">{helper}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
