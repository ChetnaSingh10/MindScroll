import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Smartphone, Cpu, Sparkles, CheckCircle } from 'lucide-react';
import { Button } from '../ui/Button';

interface StepItem {
  number: string;
  plate: string;
  title: string;
  tagline: string;
  description: string;
  microcopy: string;
  icon: any;
}

const STEPS: StepItem[] = [
  {
    number: '01',
    plate: 'Step 01',
    title: 'Habit Observation',
    tagline: 'Capturing behavioral inputs',
    description: 'You log your daily unlock frequency, average social screen duration, sleep schedule, and self-reported academic stress level.',
    microcopy: 'Zero tracking extensions or spyware—completely private.',
    icon: Smartphone,
  },
  {
    number: '02',
    plate: 'Step 02',
    title: 'Feature Normalization',
    tagline: 'De-skewing and mapping',
    description: 'The preprocessing pipeline applies log transforms to study hours, maps geographic clusters to top-frequency regions, and scales usage variables.',
    microcopy: 'Raw student data transformed into normalized mathematical vectors.',
    icon: Cpu,
  },
  {
    number: '03',
    plate: 'Step 03',
    title: 'Random Forest Inference',
    tagline: '100 decision trees voting',
    description: 'An ensemble of 100 orthogonal trees evaluates non-linear trade-offs between physical exercise, unlocks, and late-night social scrolling.',
    microcopy: 'Aggregating non-linear correlations across 5,000 cohort baselines.',
    icon: Sparkles,
  },
  {
    number: '04',
    plate: 'Step 04',
    title: 'Calibrated Action Plan',
    tagline: 'Personalized wellness score',
    description: 'Receive an empirical score (3.6 – 9.4 scale), risk band classification, and actionable lifestyle micro-nudges to safeguard focus.',
    microcopy: 'Empirical data logic without generic wellness fluff.',
    icon: CheckCircle,
  },
];

export const HowItWorksStepper: React.FC<{ onStartPredictor: () => void }> = ({ onStartPredictor }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const prevStep = () => setCurrentStep((prev) => (prev > 0 ? prev - 1 : STEPS.length - 1));
  const nextStep = () => setCurrentStep((prev) => (prev < STEPS.length - 1 ? prev + 1 : 0));

  const step = STEPS[currentStep];
  const Icon = step.icon;

  return (
    <section className="w-full py-16">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        {/* Header with numbered section label */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <span className="font-mono text-xs text-accent font-semibold tracking-wider uppercase block mb-1">
              02 / HOW IT WORKS
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-fg tracking-tight">
              Four Beats of Algorithmic Clarity
            </h2>
            <p className="text-sm text-muted mt-1.5 max-w-lg">
              A transparent, 4-step pipeline from lifestyle telemetry to personalized cognitive restoration.
            </p>
          </div>

          {/* Stepper Controls */}
          <div className="flex items-center gap-2 self-start md:self-auto">
            <Button
              variant="ghost"
              size="sm"
              onClick={prevStep}
              aria-label="Previous step"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              <span>Prev</span>
            </Button>
            <span className="font-mono text-xs px-2 text-fg font-semibold">
              {step.number} / 04
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={nextStep}
              aria-label="Next step"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>

        {/* Stepper Progress Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
          {STEPS.map((s, idx) => {
            const isActive = idx === currentStep;
            return (
              <button
                key={s.number}
                onClick={() => setCurrentStep(idx)}
                className={`text-left p-3.5 rounded-xl border transition-all duration-150 ${
                  isActive
                    ? 'border-accent bg-accent-soft text-fg'
                    : 'border-line bg-surface-2/50 text-muted hover:text-fg hover:bg-surface-2'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`font-mono text-[10px] font-bold ${isActive ? 'text-accent' : 'text-muted'}`}>
                    {s.plate}
                  </span>
                  <span className="font-mono text-[10px] text-muted">
                    {s.number}
                  </span>
                </div>
                <div className="text-xs font-semibold font-display truncate">
                  {s.title}
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Step Showcase Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step.number}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="p-8 sm:p-12 rounded-2xl bg-surface border border-line shadow-xs relative overflow-hidden"
          >
            {/* Watermark number */}
            <div className="absolute -bottom-10 -right-6 font-display font-bold text-[11rem] text-fg/[0.03] select-none pointer-events-none leading-none">
              {step.number}
            </div>

            <div className="max-w-2xl relative z-10 space-y-5">
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-accent-soft border border-accent/30 flex items-center justify-center text-accent">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-mono text-[11px] text-accent font-semibold uppercase tracking-wider block">
                    {step.tagline}
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-display font-bold text-fg">
                    {step.title}
                  </h3>
                </div>
              </div>

              <p className="text-sm sm:text-base text-muted leading-relaxed font-sans">
                {step.description}
              </p>

              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-surface-2 border border-line font-mono text-xs text-muted">
                <span className="text-accent">✦</span>
                <span>{step.microcopy}</span>
              </div>

              <div className="pt-2">
                <Button onClick={onStartPredictor} size="md">
                  Start Your Assessment
                </Button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};
