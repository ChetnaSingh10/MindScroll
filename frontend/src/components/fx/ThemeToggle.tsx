import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../hooks/useTheme';

interface ThemeToggleProps {
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = '' }) => {
  const { resolvedTheme, toggleTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  return (
    <button
      onClick={(e) => toggleTheme(e)}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode (Press T)`}
      aria-pressed={isDark}
      title={`Theme: ${isDark ? 'Dark' : 'Light'} (Shortcut: 'T')`}
      className={`relative group p-2 rounded-xl transition-all duration-300 border focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
        isDark
          ? 'bg-zinc-900/80 border-white/10 hover:border-orange-500/40 hover:bg-zinc-800/90'
          : 'bg-amber-50/90 border-amber-200/60 hover:border-orange-500/50 hover:bg-amber-100/90 shadow-sm'
      } ${className}`}
    >
      {/* Outer ambient glow */}
      <div
        className={`absolute inset-0 rounded-xl blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none ${
          isDark ? 'bg-orange-500/20' : 'bg-amber-400/30'
        }`}
      />

      <div className="relative w-6 h-6 flex items-center justify-center overflow-visible">
        <AnimatePresence mode="wait" initial={false}>
          {isDark ? (
            /* Moon with craters and floating stars */
            <motion.svg
              key="moon"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              initial={{ rotate: -45, scale: 0.6, opacity: 0 }}
              animate={{ rotate: 0, scale: 1, opacity: 1 }}
              exit={{ rotate: 45, scale: 0.6, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 350, damping: 20 }}
              className="text-amber-300"
            >
              {/* Moon crescent */}
              <path
                d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
                fill="currentColor"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Craters */}
              <circle cx="9" cy="11" r="1.2" fill="#18181B" opacity="0.4" />
              <circle cx="12" cy="16" r="1.6" fill="#18181B" opacity="0.4" />
              <circle cx="14.5" cy="11.5" r="0.9" fill="#18181B" opacity="0.4" />

              {/* Sparkling stars */}
              <motion.path
                d="M19 5L19.5 6.5L21 7L19.5 7.5L19 9L18.5 7.5L17 7L18.5 6.5L19 5Z"
                fill="#FFD166"
                animate={{ scale: [0.8, 1.3, 0.8], opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
              />
              <motion.path
                d="M15 2L15.4 3.1L16.5 3.5L15.4 3.9L15 5L14.6 3.9L13.5 3.5L14.6 3.1L15 2Z"
                fill="#FFD166"
                animate={{ scale: [1.2, 0.7, 1.2], opacity: [1, 0.5, 1] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
              />
            </motion.svg>
          ) : (
            /* Sun with animated rays and warm center */
            <motion.svg
              key="sun"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              initial={{ rotate: 90, scale: 0.6, opacity: 0 }}
              animate={{ rotate: 0, scale: 1, opacity: 1 }}
              exit={{ rotate: -90, scale: 0.6, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 350, damping: 20 }}
              className="text-orange-500"
            >
              {/* Core Sun */}
              <circle
                cx="12"
                cy="12"
                r="4.5"
                fill="url(#sunGradient)"
                stroke="#EA580C"
                strokeWidth="1.5"
              />

              {/* Animated Sun Rays */}
              <motion.g
                animate={{ rotate: 360 }}
                transition={{ duration: 24, repeat: Infinity, ease: 'linear' }}
                style={{ transformOrigin: '12px 12px' }}
              >
                <line x1="12" y1="1.5" x2="12" y2="4" stroke="#F97316" strokeWidth="2" strokeLinecap="round" />
                <line x1="12" y1="20" x2="12" y2="22.5" stroke="#F97316" strokeWidth="2" strokeLinecap="round" />
                <line x1="1.5" y1="12" x2="4" y2="12" stroke="#F97316" strokeWidth="2" strokeLinecap="round" />
                <line x1="20" y1="12" x2="22.5" y2="12" stroke="#F97316" strokeWidth="2" strokeLinecap="round" />
                <line x1="4.57" y1="4.57" x2="6.34" y2="6.34" stroke="#FB923C" strokeWidth="1.8" strokeLinecap="round" />
                <line x1="17.66" y1="17.66" x2="19.43" y2="19.43" stroke="#FB923C" strokeWidth="1.8" strokeLinecap="round" />
                <line x1="4.57" y1="19.43" x2="6.34" y2="17.66" stroke="#FB923C" strokeWidth="1.8" strokeLinecap="round" />
                <line x1="17.66" y1="6.34" x2="19.43" y2="4.57" stroke="#FB923C" strokeWidth="1.8" strokeLinecap="round" />
              </motion.g>

              <defs>
                <linearGradient id="sunGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FDBA74" />
                  <stop offset="100%" stopColor="#EA580C" />
                </linearGradient>
              </defs>
            </motion.svg>
          )}
        </AnimatePresence>
      </div>

      {/* Tooltip hint badge */}
      <span className="hidden group-hover:md:block absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded bg-zinc-900 text-white text-[9px] font-mono whitespace-nowrap shadow-lg border border-white/10 pointer-events-none">
        Press 'T'
      </span>
    </button>
  );
};
