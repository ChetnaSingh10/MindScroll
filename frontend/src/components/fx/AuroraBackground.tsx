import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../hooks/useTheme';

export const AuroraBackground: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Mesh Blob 1 (Warm Orange / Amber) */}
      <motion.div
        animate={{
          x: ['-10%', '15%', '-5%', '-10%'],
          y: ['-5%', '20%', '5%', '-5%'],
          scale: [1, 1.25, 0.95, 1],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute -top-32 -left-32 w-[650px] h-[650px] rounded-full blur-[140px] opacity-70"
        style={{
          background: isDark
            ? 'radial-gradient(circle, rgba(255,107,26,0.18) 0%, rgba(255,138,61,0.05) 60%, transparent 80%)'
            : 'radial-gradient(circle, rgba(255,138,61,0.22) 0%, rgba(251,191,36,0.1) 60%, transparent 80%)',
        }}
      />

      {/* Mesh Blob 2 (Violet / Indigo subtle contrast) */}
      <motion.div
        animate={{
          x: ['10%', '-15%', '5%', '10%'],
          y: ['10%', '-15%', '15%', '10%'],
          scale: [1.1, 0.9, 1.2, 1.1],
        }}
        transition={{
          duration: 26,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 2,
        }}
        className="absolute top-1/4 -right-32 w-[700px] h-[700px] rounded-full blur-[160px] opacity-60"
        style={{
          background: isDark
            ? 'radial-gradient(circle, rgba(139,92,246,0.12) 0%, rgba(124,58,237,0.03) 60%, transparent 80%)'
            : 'radial-gradient(circle, rgba(168,85,247,0.12) 0%, rgba(217,119,6,0.05) 60%, transparent 80%)',
        }}
      />

      {/* Mesh Blob 3 (Deep Sun / Amber Center bottom) */}
      <motion.div
        animate={{
          x: ['-5%', '10%', '-15%', '-5%'],
          y: ['15%', '-10%', '5%', '15%'],
          scale: [0.95, 1.15, 1, 0.95],
        }}
        transition={{
          duration: 24,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 4,
        }}
        className="absolute bottom-10 left-1/3 w-[550px] h-[550px] rounded-full blur-[130px] opacity-50"
        style={{
          background: isDark
            ? 'radial-gradient(circle, rgba(245,158,11,0.14) 0%, rgba(255,107,26,0.03) 60%, transparent 80%)'
            : 'radial-gradient(circle, rgba(251,146,60,0.18) 0%, rgba(245,158,11,0.06) 60%, transparent 80%)',
        }}
      />

      {/* Subtle Matrix / Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.4]"
        style={{
          backgroundImage: `linear-gradient(var(--grid-line) 1px, transparent 1px), linear-gradient(90deg, var(--grid-line) 1px, transparent 1px)`,
          backgroundSize: '48px 48px',
        }}
      />

      {children}
    </div>
  );
};
