import React from 'react';
import { cn } from '../../lib/utils';

export interface SegmentedOption {
  label: string;
  value: string;
  icon?: React.ReactNode;
}

export interface SegmentedProps {
  options: (SegmentedOption | string)[];
  value: string;
  onChange: (val: string) => void;
  className?: string;
  size?: 'sm' | 'md';
}

export const Segmented: React.FC<SegmentedProps> = ({
  options,
  value,
  onChange,
  className,
  size = 'md',
}) => {
  return (
    <div
      role="radiogroup"
      className={cn(
        'bg-surface-2 border border-line p-1 rounded-xl flex gap-1 w-full overflow-x-auto no-scrollbar',
        className
      )}
    >
      {options.map((opt) => {
        const optionObj: SegmentedOption =
          typeof opt === 'string' ? { label: opt, value: opt } : opt;
        const isSelected = optionObj.value === value;

        return (
          <button
            key={optionObj.value}
            type="button"
            role="radio"
            aria-checked={isSelected}
            onClick={() => onChange(optionObj.value)}
            className={cn(
              'flex-1 flex items-center justify-center gap-1.5 font-medium rounded-lg transition-all duration-150 whitespace-nowrap',
              size === 'sm' ? 'px-2.5 py-1 text-xs' : 'px-3 py-1.5 text-xs sm:text-sm',
              isSelected
                ? 'bg-surface text-fg shadow-xs border border-line/60 font-semibold'
                : 'text-muted hover:text-fg hover:bg-surface/50 border border-transparent'
            )}
          >
            {optionObj.icon && <span className="w-3.5 h-3.5">{optionObj.icon}</span>}
            <span>{optionObj.label}</span>
          </button>
        );
      })}
    </div>
  );
};
