import React, { useEffect, useState } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { useMagnetic } from '../../hooks/useMagnetic';
import { cn } from '../../lib/utils';

interface MagneticButtonProps extends HTMLMotionProps<'button'> {
  children: React.ReactNode;
  className?: string;
  strength?: number;
  variant?: 'primary' | 'ghost' | 'secondary';
}

export const MagneticButton: React.FC<MagneticButtonProps> = ({
  children,
  className = '',
  strength = 0.25,
  variant = 'primary',
  ...props
}) => {
  const { ref, x, y } = useMagnetic(strength);
  const [canHover, setCanHover] = useState(false);

  useEffect(() => {
    const hasHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setCanHover(hasHover && !reducedMotion);
  }, []);

  const variantStyles = {
    primary: 'bg-accent text-accent-fg hover:opacity-90 shadow-xs border border-transparent',
    ghost: 'bg-transparent text-fg hover:bg-surface-2 border border-line',
    secondary: 'bg-surface-2 text-fg hover:border-accent/40 border border-line',
  }[variant];

  if (!canHover) {
    return (
      <button
        className={cn(
          'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-150 active:scale-[0.98]',
          variantStyles,
          className
        )}
        {...(props as any)}
      >
        {children}
      </button>
    );
  }

  return (
    <motion.button
      ref={ref as any}
      style={{ x, y }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        'relative inline-flex items-center justify-center font-medium rounded-xl transition-all duration-150 select-none',
        variantStyles,
        className
      )}
      {...props}
    >
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>
    </motion.button>
  );
};
