import React from 'react';
import {
  Sparkles,
  Sliders,
  BarChart3,
  FileCode2,
  Home,
  History as HistoryIcon,
} from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { cn } from '../lib/utils';
import { HistoryItem } from '../hooks/useHistory';

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  history: HistoryItem[];
  onOpenHistory: () => void;
  backendOnline: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  onNavigate,
  history,
  onOpenHistory,
  backendOnline,
}) => {
  const navItems = [
    { id: 'landing', label: 'Home', icon: Home },
    { id: 'predictor', label: 'Predict', icon: Sparkles },
    { id: 'simulator', label: 'What-If', icon: Sliders },
    { id: 'insights', label: 'Insights', icon: BarChart3 },
    { id: 'model-card', label: 'Model', icon: FileCode2 },
  ];

  return (
    <>
      {/* Top Navbar with z-index 50 and solid-enough surface background (90% + backdrop blur) */}
      <header className="fixed top-0 left-0 right-0 z-50 w-full border-b border-line bg-surface/90 backdrop-blur-md transition-colors">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Brand Logo */}
          <button
            onClick={() => onNavigate('landing')}
            className="flex items-center gap-2.5 text-left group focus:outline-none"
            aria-label="MindScroll AI Home"
          >
            <div className="w-8 h-8 rounded-xl bg-accent-soft border border-accent/30 flex items-center justify-center text-accent font-display font-bold text-base group-hover:scale-105 transition-transform">
              M
            </div>
            <div className="flex flex-col">
              <span className="font-display font-bold text-base tracking-tight text-fg group-hover:text-accent transition-colors">
                MindScroll<span className="text-accent">AI</span>
              </span>
              <span className="text-[10px] text-muted font-mono tracking-wider -mt-0.5 hidden sm:inline">
                STUDENT WELLNESS ML
              </span>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-surface-2/60 border border-line p-1 rounded-2xl">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={cn(
                    'flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all duration-150',
                    isActive
                      ? 'bg-surface text-fg font-semibold shadow-xs border border-line/60'
                      : 'text-muted hover:text-fg hover:bg-surface/40'
                  )}
                >
                  <Icon className={cn('w-3.5 h-3.5', isActive ? 'text-accent' : 'text-muted')} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2">
            {/* Backend status dot */}
            <div
              className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface-2 border border-line text-[11px] font-mono text-muted"
              title={backendOnline ? 'Backend service online' : 'Backend offline or mock active'}
            >
              <span
                className={cn(
                  'w-1.5 h-1.5 rounded-full',
                  backendOnline ? 'bg-status-good' : 'bg-status-moderate'
                )}
              />
              <span>{backendOnline ? 'API ON' : 'LOCAL'}</span>
            </div>

            {/* History drawer button */}
            {history.length > 0 && (
              <button
                onClick={onOpenHistory}
                aria-label={`Open prediction history (${history.length} saved)`}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-line bg-surface hover:bg-surface-2 text-fg text-xs font-mono transition-colors"
              >
                <HistoryIcon className="w-3.5 h-3.5 text-accent" />
                <span className="hidden sm:inline">History</span>
                <span className="px-1.5 py-0.2 rounded-full bg-accent-soft text-accent text-[10px] font-bold">
                  {history.length}
                </span>
              </button>
            )}

            {/* Theme Toggle Component */}
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Mobile Bottom Tab Bar */}
      <nav
        aria-label="Mobile Navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-surface/95 backdrop-blur-md border-t border-line pb-[env(safe-area-inset-bottom)] transition-colors h-14"
      >
        <div className="flex items-center justify-around h-full px-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={cn(
                  'flex flex-col items-center justify-center flex-1 h-full py-1 text-[10px] font-medium transition-colors select-none',
                  isActive ? 'text-accent font-semibold' : 'text-muted hover:text-fg'
                )}
              >
                <Icon className={cn('w-4 h-4 mb-0.5', isActive ? 'text-accent' : 'text-muted')} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};
