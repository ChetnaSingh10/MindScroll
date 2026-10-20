import React from 'react';
import { cn } from '../../lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'accent' | 'good' | 'moderate' | 'attention' | 'concern' | 'neutral';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = 'neutral',
  size = 'md',
  children,
  ...props
}) => {
  const variants = {
    accent: 'bg-accent-soft text-accent border-accent/25',
    good: 'bg-status-good-soft text-status-good border-status-good/30',
    moderate: 'bg-status-moderate-soft text-status-moderate border-status-moderate/30',
    attention: 'bg-status-attention-soft text-status-attention border-status-attention/30',
    concern: 'bg-status-concern-soft text-status-concern border-status-concern/30',
    neutral: 'bg-surface-2 text-muted border-line',
  };

  const sizes = {
    sm: 'text-[10px] px-2 py-0.5 font-mono',
    md: 'text-xs px-2.5 py-1 font-mono',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 font-semibold rounded-lg border uppercase tracking-wider',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};
