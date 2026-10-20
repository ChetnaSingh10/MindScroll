import React from 'react';
import { ShieldAlert, HeartHandshake } from 'lucide-react';

export const DisclaimerBanner: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  if (compact) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900/60 border border-zinc-800 text-[11px] text-zinc-400">
        <ShieldAlert className="w-3.5 h-3.5 text-amber-500 shrink-0" />
        <span>Educational tool, not a medical diagnosis. If you need support, consult a licensed professional.</span>
      </div>
    );
  }

  return (
    <div className="glass-panel rounded-xl p-4 border border-amber-500/20 bg-amber-500/[0.03] flex items-start sm:items-center gap-3">
      <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 shrink-0">
        <HeartHandshake className="w-5 h-5" />
      </div>
      <div className="flex-1 text-xs text-zinc-300">
        <span className="font-semibold text-amber-400">Important Disclaimer: </span>
        MindScroll AI is an interactive machine learning educational tool based on statistical lifestyle surveys. It is
        <strong className="text-white"> not a medical or psychological diagnosis</strong>. If you or someone you know
        is struggling with mental health or distress, please reach out to professional counseling services or student health resources.
      </div>
    </div>
  );
};
