import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Users, Layers, Trophy, Globe } from 'lucide-react';
import { CountUp } from '../fx/CountUp';

interface ProofNumbersStripProps {
  totalRecords?: number;
  r2Score?: number;
}

export const ProofNumbersStrip: React.FC<ProofNumbersStripProps> = ({
  totalRecords = 5000,
  r2Score = 0.864,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });

  const metrics = [
    {
      target: totalRecords,
      decimals: 0,
      suffix: '',
      label: 'Cohort Profiles',
      sublabel: 'Empirical student survey records',
      icon: Users,
    },
    {
      target: 12,
      decimals: 0,
      suffix: ' Signals',
      label: 'Lifestyle Vectors',
      sublabel: 'Unlocks, sleep, study & movement',
      icon: Layers,
    },
    {
      target: r2Score,
      decimals: 3,
      suffix: ' R²',
      label: 'Validation Score',
      sublabel: 'Tuned Random Forest regression',
      icon: Trophy,
    },
    {
      target: 10,
      decimals: 0,
      suffix: '+',
      label: 'Global Regions',
      sublabel: 'Top-frequency geographic clusters',
      icon: Globe,
    },
  ];

  return (
    <div ref={ref} className="w-full py-10 border-y border-line bg-surface/50 transition-colors">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {metrics.map((item, idx) => {
            const Icon = item.icon;

            return (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 15 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className="flex items-start gap-3.5 p-3 rounded-2xl hover:bg-surface-2/60 transition-colors"
              >
                <div className="p-2.5 rounded-xl bg-accent-soft border border-accent/20 text-accent shrink-0 mt-1">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-bold font-display text-fg tracking-tight tabular-nums">
                    {isInView ? (
                      <CountUp
                        end={item.target}
                        decimals={item.decimals}
                        suffix={item.suffix}
                        duration={1200}
                      />
                    ) : (
                      <span>
                        {item.target}
                        {item.suffix}
                      </span>
                    )}
                  </div>
                  <div className="font-mono text-[11px] text-accent font-semibold uppercase tracking-wider mt-0.5">
                    {item.label}
                  </div>
                  <p className="text-xs text-muted mt-0.5 leading-snug">
                    {item.sublabel}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
