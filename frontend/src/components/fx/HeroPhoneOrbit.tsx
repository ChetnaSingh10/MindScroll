import React from 'react';
import { motion } from 'framer-motion';
import {
  Smartphone,
  MessageCircle,
  Share2,
  Sparkles,
  Heart,
  TrendingUp,
  Brain
} from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

export const HeroPhoneOrbit: React.FC = () => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  const orbitingIcons = [
    {
      name: 'Instagram',
      icon: (
        <svg className="w-5 h-5 text-pink-500 fill-none stroke-currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
        </svg>
      ),
      bg: 'bg-pink-500/10 border-pink-500/30 shadow-pink-500/20',
      angle: 0,
      radius: 170,
      delay: 0,
    },
    {
      name: 'YouTube',
      icon: (
        <svg className="w-5 h-5 text-red-500 fill-currentColor" viewBox="0 0 24 24">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
        </svg>
      ),
      bg: 'bg-red-500/10 border-red-500/30 shadow-red-500/20',
      angle: 60,
      radius: 180,
      delay: 0.5,
    },
    {
      name: 'TikTok',
      icon: <span className="font-bold text-xs text-cyan-400">TT</span>,
      bg: 'bg-cyan-500/10 border-cyan-500/30 shadow-cyan-500/20',
      angle: 120,
      radius: 165,
      delay: 1.0,
    },
    {
      name: 'WhatsApp',
      icon: <MessageCircle className="w-5 h-5 text-emerald-400" />,
      bg: 'bg-emerald-500/10 border-emerald-500/30 shadow-emerald-500/20',
      angle: 180,
      radius: 175,
      delay: 1.5,
    },
    {
      name: 'Snapchat',
      icon: <span className="font-bold text-xs text-yellow-400">SC</span>,
      bg: 'bg-yellow-500/10 border-yellow-500/30 shadow-yellow-500/20',
      angle: 240,
      radius: 170,
      delay: 2.0,
    },
    {
      name: 'Reddit',
      icon: <Share2 className="w-4 h-4 text-orange-400" />,
      bg: 'bg-orange-500/10 border-orange-500/30 shadow-orange-500/20',
      angle: 300,
      radius: 185,
      delay: 2.5,
    },
  ];

  return (
    <div className="relative w-full max-w-[420px] h-[330px] xs:h-[380px] sm:h-[440px] md:h-[480px] mx-auto flex items-center justify-center select-none scale-[0.72] xs:scale-[0.82] sm:scale-95 md:scale-100 transform origin-center transition-transform overflow-visible" style={{ perspective: 1200 }}>
      {/* Background radial glow */}
      <div
        className="absolute inset-0 rounded-full blur-3xl opacity-50 pointer-events-none"
        style={{
          background: isDark
            ? 'radial-gradient(circle, rgba(255,107,26,0.3) 0%, rgba(139,92,246,0.15) 50%, transparent 70%)'
            : 'radial-gradient(circle, rgba(255,138,61,0.35) 0%, rgba(251,191,36,0.2) 50%, transparent 70%)',
        }}
      />

      {/* Orbit Track Rings */}
      <div className="absolute w-[360px] h-[360px] rounded-full border border-orange-500/20 pointer-events-none" />
      <div className="absolute w-[380px] h-[380px] rounded-full border border-purple-500/15 pointer-events-none border-dashed animate-spin" style={{ animationDuration: '60s' }} />

      {/* Orbiting Icons */}
      {orbitingIcons.map((item, idx) => {
        return (
          <motion.div
            key={item.name}
            animate={{
              rotate: [0, 360],
            }}
            transition={{
              duration: 28,
              repeat: Infinity,
              ease: 'linear',
            }}
            style={{
              position: 'absolute',
              width: item.radius * 2,
              height: item.radius * 2,
            }}
            className="pointer-events-none"
          >
            <motion.div
              style={{
                position: 'absolute',
                top: 0,
                left: '50%',
                transform: 'translateX(-50%)',
              }}
              animate={{
                rotate: [360, 0], // Counter-rotate so icon stays upright
                y: [0, -8, 0],
              }}
              transition={{
                rotate: { duration: 28, repeat: Infinity, ease: 'linear' },
                y: { duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: idx * 0.4 },
              }}
              className={`p-3 rounded-2xl glass-panel border ${item.bg} shadow-lg pointer-events-auto cursor-pointer hover:scale-125 transition-transform`}
              data-cursor="view"
              title={item.name}
            >
              {item.icon}
            </motion.div>
          </motion.div>
        );
      })}

      {/* Center 3D Floating Phone Mockup */}
      <motion.div
        animate={{
          y: [-12, 12, -12],
          rotateY: [-8, 8, -8],
          rotateX: [6, -6, 6],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        style={{ transformStyle: 'preserve-3d' }}
        className="relative z-10 w-64 h-[390px] rounded-[36px] p-3 shadow-2xl glass-panel border-2 border-white/20 bg-gradient-to-b from-white/10 to-black/40 backdrop-blur-2xl"
      >
        {/* Dynamic Notch */}
        <div className="w-24 h-4 bg-black/60 rounded-full mx-auto mb-3 flex items-center justify-center">
          <div className="w-2.5 h-2.5 rounded-full bg-zinc-800 border border-white/10" />
        </div>

        {/* Screen Content */}
        <div className="h-[330px] rounded-[26px] bg-[#0A0A0A]/90 p-4 flex flex-col justify-between border border-white/[0.08] relative overflow-hidden">
          {/* Subtle screen light sweep */}
          <motion.div
            animate={{ x: ['-100%', '200%'] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', repeatDelay: 2 }}
            className="absolute inset-y-0 w-24 bg-gradient-to-r from-transparent via-white/[0.07] to-transparent transform -skew-x-12 pointer-events-none"
          />

          {/* Top Status */}
          <div className="flex items-center justify-between text-[11px] text-zinc-400">
            <span className="font-semibold text-white">MindScroll AI</span>
            <span className="flex items-center gap-1 text-emerald-400 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Live ML
            </span>
          </div>

          {/* Center Gauge Simulation Inside Phone */}
          <div className="my-auto text-center space-y-2">
            <div className="relative w-28 h-28 mx-auto flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="56" cy="56" r="44" stroke="rgba(255,255,255,0.08)" strokeWidth="8" fill="none" />
                <motion.circle
                  cx="56"
                  cy="56"
                  r="44"
                  stroke="url(#phoneGrad)"
                  strokeWidth="8"
                  strokeDasharray="276"
                  initial={{ strokeDashoffset: 276 }}
                  animate={{ strokeDashoffset: [276, 70, 95] }}
                  transition={{ duration: 2.5, ease: 'easeInOut' }}
                  strokeLinecap="round"
                  fill="none"
                />
                <defs>
                  <linearGradient id="phoneGrad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#FF6B1A" />
                    <stop offset="100%" stopColor="#8B5CF6" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-extrabold font-display text-white">7.8</span>
                <span className="text-[9px] uppercase tracking-wider text-emerald-400 font-bold">Good</span>
              </div>
            </div>

            <div className="px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-[10px] text-primary font-semibold inline-block">
              Screen vs Sleep Index
            </div>
          </div>

          {/* Bottom Card Summary */}
          <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/[0.06] text-[10px] space-y-1 text-zinc-300">
            <div className="flex justify-between">
              <span className="text-zinc-500">Screen Time</span>
              <span className="font-bold text-orange-400">3.8h / day</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Sleep Rest</span>
              <span className="font-bold text-purple-400">7.5h / night</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
