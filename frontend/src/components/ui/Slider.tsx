import React from 'react';
import { cn } from '../../lib/utils';

export interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  onChange: (val: number) => void;
  helper?: string;
  className?: string;
  id?: string;
}

export const Slider: React.FC<SliderProps> = ({
  label,
  value,
  min,
  max,
  step = 1,
  unit = '',
  onChange,
  helper,
  className,
  id,
}) => {
  const sliderId = id || `slider-${label.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <div className={cn('w-full space-y-2', className)}>
      <div className="flex items-center justify-between">
        <label htmlFor={sliderId} className="text-xs font-medium text-fg uppercase tracking-wider font-mono">
          {label}
        </label>
        <span className="font-mono text-sm font-semibold text-accent px-2 py-0.5 rounded-lg bg-accent-soft">
          {value} {unit}
        </span>
      </div>

      <input
        id={sliderId}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full"
      />

      <div className="flex items-center justify-between text-[11px] text-muted font-mono">
        <span>{min} {unit}</span>
        {helper && <span className="text-muted/80">{helper}</span>}
        <span>{max} {unit}</span>
      </div>
    </div>
  );
};
