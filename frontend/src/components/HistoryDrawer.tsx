import React from 'react';
import { X, Trash2, Calendar, ArrowRight } from 'lucide-react';
import { HistoryItem } from '../hooks/useHistory';
import { getBandDetails } from '../lib/utils';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  history: HistoryItem[];
  onClear: () => void;
  onSelect: (item: HistoryItem) => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  history,
  onClear,
  onSelect,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-bg/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-surface border-l border-line shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-line flex items-center justify-between">
            <div>
              <span className="font-mono text-[10px] text-accent uppercase tracking-wider block">
                LOCAL PERSISTENCE
              </span>
              <h2 className="text-lg font-bold font-display text-fg">
                Assessment History
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-muted hover:text-fg hover:bg-surface-2 transition-colors"
              aria-label="Close history drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* List Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-3">
            {history.length === 0 ? (
              <div className="text-center py-16 text-muted">
                <Calendar className="w-10 h-10 mx-auto mb-3 opacity-40 text-accent" />
                <p className="text-sm font-medium text-fg">No saved assessments yet</p>
                <p className="text-xs mt-1">
                  Assessments you generate in the Predictor Wizard will appear here.
                </p>
              </div>
            ) : (
              history.map((item) => {
                const band = getBandDetails(item.result.score);
                const badgeVariant =
                  band.band === 'Good'
                    ? 'good'
                    : band.band === 'Moderate'
                    ? 'moderate'
                    : band.band === 'Needs Attention'
                    ? 'attention'
                    : 'concern';

                const formattedDate = new Date(item.timestamp).toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                });

                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      onSelect(item);
                      onClose();
                    }}
                    className="p-4 rounded-xl border border-line bg-surface-2/60 hover:bg-surface-2 hover:border-accent/40 cursor-pointer transition-all duration-150 group"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-xs text-muted">{formattedDate}</span>
                      <Badge variant={badgeVariant} size="sm">
                        {band.band}
                      </Badge>
                    </div>

                    <div className="flex items-baseline justify-between">
                      <div>
                        <span className="font-display text-2xl font-bold text-fg">
                          {item.result.score.toFixed(2)}
                        </span>
                        <span className="text-[11px] text-muted ml-1.5 font-mono">/ 10</span>
                      </div>
                      <span className="text-xs text-muted group-hover:text-accent flex items-center gap-1 font-medium transition-colors">
                        View details <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>

                    <div className="mt-2.5 pt-2 border-t border-line/60 flex items-center justify-between text-[11px] text-muted font-mono">
                      <span>{item.input.Most_Used_Platform}</span>
                      <span>{item.input.Avg_Daily_Usage_Hours}h daily</span>
                      <span>{item.input.Sleep_Hours_Per_Night}h sleep</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer with Clear All */}
          {history.length > 0 && (
            <div className="p-4 border-t border-line bg-surface-2/40 flex items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                onClick={onClear}
                className="text-status-concern hover:bg-status-concern-soft hover:text-status-concern border-status-concern/20"
              >
                <Trash2 className="w-3.5 h-3.5 mr-1" />
                Clear History
              </Button>
              <span className="text-xs font-mono text-muted">
                {history.length} {history.length === 1 ? 'record' : 'records'}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
