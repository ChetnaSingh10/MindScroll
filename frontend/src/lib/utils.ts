import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(val: number, decimals: number = 1): string {
  return val.toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export function getBandDetails(score: number) {
  if (score < 4.5) {
    return {
      band: 'Concern',
      color: 'var(--status-concern)',
      bgLight: 'var(--status-concern-soft)',
      textClass: 'text-status-concern',
      badgeClass: 'bg-status-concern-soft text-status-concern border border-line',
    };
  } else if (score < 6.0) {
    return {
      band: 'Needs Attention',
      color: 'var(--status-attention)',
      bgLight: 'var(--status-attention-soft)',
      textClass: 'text-status-attention',
      badgeClass: 'bg-status-attention-soft text-status-attention border border-line',
    };
  } else if (score < 7.5) {
    return {
      band: 'Moderate',
      color: 'var(--status-moderate)',
      bgLight: 'var(--status-moderate-soft)',
      textClass: 'text-status-moderate',
      badgeClass: 'bg-status-moderate-soft text-status-moderate border border-line',
    };
  } else {
    return {
      band: 'Good',
      color: 'var(--status-good)',
      bgLight: 'var(--status-good-soft)',
      textClass: 'text-status-good',
      badgeClass: 'bg-status-good-soft text-status-good border border-line',
    };
  }
}
