import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

export type ThemeMode = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';

interface ThemeContextType {
  mode: ThemeMode;
  resolvedTheme: ResolvedTheme;
  setMode: (mode: ThemeMode) => void;
  toggleTheme: (event?: React.MouseEvent | MouseEvent) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const getSystemTheme = (): ResolvedTheme => {
    if (typeof window === 'undefined') return 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  };

  const [mode, setModeState] = useState<ThemeMode>(() => {
    try {
      const saved = localStorage.getItem('mindscroll-theme');
      if (saved === 'light' || saved === 'dark' || saved === 'system') {
        return saved;
      }
    } catch {}
    return 'system';
  });

  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>(() => {
    if (typeof document !== 'undefined') {
      const current = document.documentElement.getAttribute('data-theme');
      if (current === 'light' || current === 'dark') return current;
    }
    return mode === 'system' ? getSystemTheme() : (mode as ResolvedTheme);
  });

  const applyThemeToDOM = useCallback((theme: ResolvedTheme) => {
    const root = document.documentElement;
    root.setAttribute('data-theme', theme);
    root.style.colorScheme = theme;
  }, []);

  // Update resolved theme when mode changes or OS theme preference changes
  useEffect(() => {
    const update = () => {
      const resolved = mode === 'system' ? getSystemTheme() : mode;
      setResolvedTheme(resolved);
      applyThemeToDOM(resolved);
    };

    update();

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemChange = () => {
      if (mode === 'system') {
        update();
      }
    };

    mediaQuery.addEventListener('change', handleSystemChange);
    return () => mediaQuery.removeEventListener('change', handleSystemChange);
  }, [mode, applyThemeToDOM]);

  const setMode = useCallback((newMode: ThemeMode) => {
    setModeState(newMode);
    try {
      localStorage.setItem('mindscroll-theme', newMode);
    } catch {}
    const resolved = newMode === 'system' ? getSystemTheme() : newMode;
    setResolvedTheme(resolved);
    applyThemeToDOM(resolved);
  }, [applyThemeToDOM]);

  // Smooth circular reveal using View Transitions with fallback
  const toggleTheme = useCallback(
    (event?: React.MouseEvent | MouseEvent) => {
      const nextResolved: ResolvedTheme = resolvedTheme === 'dark' ? 'light' : 'dark';
      const nextMode: ThemeMode = nextResolved;

      // Check if View Transitions API is supported and not reduced motion
      const startTransition = (document as any).startViewTransition;
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      if (!startTransition || prefersReducedMotion) {
        setMode(nextMode);
        return;
      }

      // Calculate coordinates for circular reveal
      let x = window.innerWidth / 2;
      let y = 0;
      if (event && event.clientX !== undefined) {
        x = event.clientX;
        y = event.clientY;
      }

      const endRadius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y)
      );

      const transition = startTransition.call(document, () => {
        applyThemeToDOM(nextResolved);
        setModeState(nextMode);
        setResolvedTheme(nextResolved);
        try {
          localStorage.setItem('mindscroll-theme', nextMode);
        } catch {}
      });

      transition.ready.then(() => {
        document.documentElement.animate(
          {
            clipPath: [
              `circle(0px at ${x}px ${y}px)`,
              `circle(${endRadius}px at ${x}px ${y}px)`
            ]
          },
          {
            duration: 350,
            easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
            pseudoElement: '::view-transition-new(root)'
          }
        );
      });
    },
    [resolvedTheme, setMode, applyThemeToDOM]
  );

  // Global keyboard shortcut 'T' listener (ignores input elements)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT' ||
          target.isContentEditable)
      ) {
        return;
      }

      if (e.key === 't' || e.key === 'T') {
        e.preventDefault();
        toggleTheme();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleTheme]);

  return (
    <ThemeContext.Provider value={{ mode, resolvedTheme, setMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
