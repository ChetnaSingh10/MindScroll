import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { cn } from '../lib/utils';

interface ThemeToggleProps {
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ className }) => {
  const { resolvedTheme, toggleTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  return (
    <button
      type="button"
      onClick={(e) => toggleTheme(e)}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme (Press T)`}
      aria-pressed={isDark}
      title={`Switch to ${isDark ? 'light' : 'dark'} theme (Shortcut: T)`}
      className={cn(
        'relative inline-flex items-center justify-center w-9 h-9 rounded-xl border border-line bg-surface text-fg hover:bg-surface-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent/40 cursor-pointer overflow-hidden',
        className
      )}
    >
      <div
        className={cn(
          'transition-all duration-300 transform',
          isDark
            ? 'rotate-0 scale-100 opacity-100'
            : '-rotate-90 scale-0 opacity-0 absolute'
        )}
      >
        <Moon className="w-4 h-4 text-accent" />
      </div>
      <div
        className={cn(
          'transition-all duration-300 transform',
          !isDark
            ? 'rotate-0 scale-100 opacity-100'
            : 'rotate-90 scale-0 opacity-0 absolute'
        )}
      >
        <Sun className="w-4 h-4 text-accent" />
      </div>
    </button>
  );
};
