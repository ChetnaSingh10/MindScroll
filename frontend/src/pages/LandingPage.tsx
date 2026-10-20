import React from 'react';
import {
  ArrowRight,
  Activity,
  Compass,
  Zap,
} from 'lucide-react';
import { ProofNumbersStrip } from '../components/sections/ProofNumbersStrip';
import { HowItWorksStepper } from '../components/sections/HowItWorksStepper';
import { PlatformTicker } from '../components/fx/PlatformTicker';
import { MagneticButton } from '../components/fx/MagneticButton';
import { TiltCard } from '../components/fx/TiltCard';
import { Button } from '../components/ui/Button';

interface LandingPageProps {
  onStartPredictor: () => void;
  onNavigate: (page: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartPredictor,
  onNavigate,
}) => {
  return (
    <div className="w-full space-y-16 py-6 sm:py-10">
      {/* 01 / STATEMENT HERO - position relative, no negative margins */}
      <section className="relative w-full max-w-[1200px] mx-auto px-4 sm:px-6">
        <div className="max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-soft border border-accent/20 text-accent font-mono text-xs font-semibold uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <span>01 / STUDENT WELLNESS INTELLIGENCE</span>
          </div>

          <h1 className="text-fluid-hero font-display font-extrabold text-fg tracking-tight text-balance">
            The scroll leaves a mark. <span className="text-accent">Quantify it.</span>
          </h1>

          <p className="text-base sm:text-lg text-muted max-w-2xl leading-relaxed">
            Understand how daily screen duration, notification velocity, and sleep hygiene
            shape psychological wellness. Calibrated on 5,000 student cohort records using
            interpretable machine learning.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <MagneticButton
              variant="primary"
              className="px-7 py-3.5 text-base font-semibold"
              onClick={onStartPredictor}
            >
              <span>Start Assessment</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </MagneticButton>

            <Button
              variant="ghost"
              size="lg"
              onClick={() => onNavigate('model-card')}
            >
              Explore Model Card
            </Button>
          </div>
        </div>

        {/* Bento Stat Cards (Hero Showcase) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-14">
          <TiltCard className="flex flex-col justify-between h-52">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-accent font-semibold uppercase tracking-wider">
                COHORT DATA
              </span>
              <div className="p-2 rounded-xl bg-accent-soft text-accent">
                <Activity className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="font-display text-4xl font-bold text-fg">5,000</div>
              <p className="text-xs text-muted mt-1 leading-relaxed">
                Empirical student records analyzing screen usage, unlock intervals, and academic stress.
              </p>
            </div>
          </TiltCard>

          <TiltCard className="flex flex-col justify-between h-52">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-accent font-semibold uppercase tracking-wider">
                REGRESSION ACCURACY
              </span>
              <div className="p-2 rounded-xl bg-accent-soft text-accent">
                <Zap className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="font-display text-4xl font-bold text-fg">0.864 R²</div>
              <p className="text-xs text-muted mt-1 leading-relaxed">
                Random Forest Regressor with 100 decision trees validated with 5-fold cross validation.
              </p>
            </div>
          </TiltCard>

          <TiltCard className="flex flex-col justify-between h-52">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-accent font-semibold uppercase tracking-wider">
                BEHAVIORAL SIGNALS
              </span>
              <div className="p-2 rounded-xl bg-accent-soft text-accent">
                <Compass className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="font-display text-4xl font-bold text-fg">12 Factors</div>
              <p className="text-xs text-muted mt-1 leading-relaxed">
                Multidimensional feature vector balancing digital inputs and restorative habits.
              </p>
            </div>
          </TiltCard>
        </div>
      </section>

      {/* 02 / PROOF NUMBERS STRIP */}
      <section className="relative w-full">
        <ProofNumbersStrip totalRecords={5000} r2Score={0.864} />
      </section>

      {/* 03 / PLATFORM TICKER */}
      <section className="relative w-full">
        <PlatformTicker />
      </section>

      {/* 04 / HOW IT WORKS STEPPER */}
      <section className="relative w-full">
        <HowItWorksStepper onStartPredictor={onStartPredictor} />
      </section>

      {/* 05 / FINAL CTA SECTION */}
      <section className="relative w-full max-w-[1200px] mx-auto px-4 sm:px-6 py-12">
        <div className="relative overflow-hidden rounded-3xl bg-surface border border-line p-8 sm:p-14 text-center">
          {/* Subtle accent glow */}
          <div
            aria-hidden="true"
            className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-48 rounded-full blur-3xl opacity-30 pointer-events-none"
            style={{ background: 'var(--accent)' }}
          />

          <div className="relative z-10 max-w-xl mx-auto space-y-4">
            <span className="font-mono text-xs text-accent font-semibold uppercase tracking-wider block">
              03 / READY TO EVALUATE?
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-fg tracking-tight">
              Test your cognitive baseline in two minutes.
            </h2>
            <p className="text-sm text-muted leading-relaxed">
              Answer 12 lifestyle and digital usage questions to calculate your personalized
              Mental Health Score and discover actionable recovery habits.
            </p>
            <div className="pt-3 flex flex-wrap justify-center gap-3">
              <MagneticButton
                variant="primary"
                className="px-8 py-3.5 text-sm font-semibold"
                onClick={onStartPredictor}
              >
                <span>Take the Assessment</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </MagneticButton>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
