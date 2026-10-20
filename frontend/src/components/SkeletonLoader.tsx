import React from 'react';
import { cn } from '../lib/utils';

export const Skeleton: React.FC<{ className?: string }> = ({ className }) => (
  <div
    className={cn(
      'animate-pulse rounded-lg bg-zinc-800/60 border border-zinc-700/20',
      className
    )}
  />
);

export const PredictorSkeleton: React.FC = () => {
  return (
    <div className="space-y-6 w-full max-w-xl mx-auto py-8">
      <div className="flex justify-center">
        <Skeleton className="w-56 h-56 rounded-full" />
      </div>
      <div className="space-y-3 text-center">
        <Skeleton className="h-8 w-48 mx-auto" />
        <Skeleton className="h-4 w-72 mx-auto" />
      </div>
      <div className="grid grid-cols-2 gap-4 mt-6">
        <Skeleton className="h-24 w-full rounded-xl" />
        <Skeleton className="h-24 w-full rounded-xl" />
      </div>
      <div className="space-y-2 mt-6">
        <Skeleton className="h-16 w-full rounded-xl" />
        <Skeleton className="h-16 w-full rounded-xl" />
      </div>
    </div>
  );
};
