import React from 'react';
import { motion } from 'framer-motion';

export const PlatformMarquee: React.FC = () => {
  const platforms = [
    { name: 'Instagram', metric: '68% Daily Reach' },
    { name: 'TikTok', metric: 'Peak Night Engagement' },
    { name: 'YouTube', metric: 'Long-form Study/Entertain' },
    { name: 'WhatsApp', metric: 'Constant Notifications' },
    { name: 'Snapchat', metric: 'Streak Pressure' },
    { name: 'LinkedIn', metric: 'Career Stress' },
    { name: 'WeChat', metric: 'Multi-Utility Screen Time' },
    { name: 'Discord', metric: 'Late Night Screen Habit' },
  ];

  return (
    <div className="relative w-full overflow-hidden py-4 select-none">
      {/* Edge Blur Mask */}
      <div className="absolute left-0 inset-y-0 w-20 bg-gradient-to-r from-base to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 inset-y-0 w-20 bg-gradient-to-l from-base to-transparent z-10 pointer-events-none" />

      <motion.div
        animate={{ x: ['0%', '-50%'] }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: 'linear',
        }}
        className="flex gap-4 w-max"
      >
        {[...platforms, ...platforms].map((item, idx) => (
          <div
            key={idx}
            className="flex items-center gap-2 px-4 py-2 rounded-xl glass-panel border border-border-subtle text-xs whitespace-nowrap hover:border-primary/40 transition-colors"
          >
            <span className="w-2 h-2 rounded-full bg-primary" />
            <span className="font-bold text-content-primary">{item.name}</span>
            <span className="text-[11px] text-content-muted">• {item.metric}</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
};
