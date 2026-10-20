import React from 'react';

const PLATFORMS = [
  'Instagram',
  'TikTok',
  'YouTube',
  'Twitter / X',
  'Reddit',
  'Snapchat',
  'WhatsApp',
  'Discord',
  'LinkedIn',
  'Twitch',
];

export const PlatformTicker: React.FC = () => {
  return (
    <div className="w-full py-4 border-y border-line bg-surface-2/40 overflow-hidden relative select-none">
      <div className="flex w-max animate-none sm:animate-[marquee_25s_linear_infinite] gap-8 text-xs font-mono text-muted uppercase tracking-wider">
        {[...PLATFORMS, ...PLATFORMS].map((p, idx) => (
          <div key={idx} className="flex items-center gap-3">
            <span className="text-accent">/</span>
            <span className="hover:text-fg transition-colors">{p}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
