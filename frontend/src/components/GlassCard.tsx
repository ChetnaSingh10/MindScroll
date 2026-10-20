import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '../lib/utils';

interface GlassCardProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
  interactive?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className,
  glow = false,
  interactive = false,
  ...props
}) => {
  return (
    <motion.div
      className={cn(
        'rounded-2xl p-6 transition-all duration-300 relative overflow-hidden',
        interactive ? 'glass-card-interactive cursor-pointer' : 'glass-panel',
        glow && 'glow-orange-sm border-orange-500/30',
        className
      )}
      {...props}
    >
      {/* Subtle top reflection line */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />
      {children}
    </motion.div>
  );
};
