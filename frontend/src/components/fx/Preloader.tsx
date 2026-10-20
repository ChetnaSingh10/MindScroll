import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PreloaderProps {
  onComplete: () => void;
}

export const Preloader: React.FC<PreloaderProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Check session storage to only run once per session
    try {
      const seen = sessionStorage.getItem('mindscroll-preloader-seen');
      if (seen) {
        setVisible(false);
        onComplete();
        return;
      }
    } catch {}

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      try {
        sessionStorage.setItem('mindscroll-preloader-seen', 'true');
      } catch {}
      setVisible(false);
      onComplete();
      return;
    }

    let start = performance.now();
    const duration = 700; // Fast and snappy (700ms)

    const step = (time: number) => {
      const elapsed = time - start;
      const pct = Math.min(Math.round((elapsed / duration) * 100), 100);
      setProgress(pct);

      if (pct < 100) {
        requestAnimationFrame(step);
      } else {
        setTimeout(() => {
          try {
            sessionStorage.setItem('mindscroll-preloader-seen', 'true');
          } catch {}
          setVisible(false);
          onComplete();
        }, 150);
      }
    };

    const rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: 'easeInOut' }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-bg text-fg select-none"
        >
          <div className="flex flex-col items-center gap-3">
            <span className="font-mono text-xs uppercase tracking-widest text-muted">
              MindScroll AI
            </span>
            <span className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-accent">
              {progress}%
            </span>
            <div className="w-36 h-[2px] bg-surface-2 overflow-hidden rounded-full">
              <div
                className="h-full bg-accent transition-all duration-75"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
