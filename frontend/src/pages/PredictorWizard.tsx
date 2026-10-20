import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  Smartphone,
  Moon,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  RefreshCw,
  AlertCircle,
} from 'lucide-react';
import { PredictRequest, DatasetOptionsResponse } from '../types/api';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Slider } from '../components/ui/Slider';
import { Segmented } from '../components/ui/Segmented';
import { Badge } from '../components/ui/Badge';
import { Skeleton } from '../components/ui/Skeleton';

interface PredictorWizardProps {
  options: DatasetOptionsResponse | null;
  loadingOptions: boolean;
  onPredict: (data: PredictRequest) => Promise<void>;
  isPredicting: boolean;
  initialValues?: PredictRequest | null;
  onRetryOptions: () => void;
}

export const PredictorWizard: React.FC<PredictorWizardProps> = ({
  options,
  loadingOptions,
  onPredict,
  isPredicting,
  initialValues,
  onRetryOptions,
}) => {
  const [currentStep, setCurrentStep] = useState(1);

  // Form State initialized with defaults or initial values
  const [formData, setFormData] = useState<PredictRequest>(() => {
    if (initialValues) return initialValues;
    return {
      Age: 21,
      Gender: 'Female',
      Country: 'USA',
      Academic_Level: 'Undergraduate',
      Most_Used_Platform: 'Instagram',
      Purpose_Of_Use: 'Entertainment',
      Avg_Daily_Usage_Hours: 5.5,
      Daily_Unlocks: 80,
      Study_Hours: 4.0,
      Physical_Activity_Hours: 1.0,
      Sleep_Hours_Per_Night: 6.5,
      Stress_Level: 'Medium',
    };
  });

  const genderList = options?.genders || ['Female', 'Male', 'Non-binary', 'Other'];
  const countryList = options?.top_10_countries || options?.countries || [
    'USA',
    'India',
    'UK',
    'Canada',
    'Australia',
    'Germany',
    'France',
    'Brazil',
    'Japan',
    'Other',
  ];
  const academicList = options?.academic_levels || [
    'High School',
    'Undergraduate',
    'Graduate',
    'PhD',
  ];
  const platformList = options?.platforms || [
    'Instagram',
    'TikTok',
    'YouTube',
    'Twitter',
    'Reddit',
    'Snapchat',
    'WhatsApp',
  ];
  const purposeList = options?.purposes || [
    'Entertainment',
    'Socializing',
    'Academic',
    'Work',
    'News',
  ];
  const stressLevels = options?.stress_levels || ['Low', 'Medium', 'High'];

  const handleUpdate = (field: keyof PredictRequest, val: any) => {
    setFormData((prev) => ({ ...prev, [field]: val }));
  };

  const handleNext = () => {
    if (currentStep < 4) setCurrentStep((prev) => prev + 1);
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep((prev) => prev - 1);
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    await onPredict(formData);
  };

  const stepsMeta = [
    { num: '01', title: 'Demographics', icon: User },
    { num: '02', title: 'Screen & Social', icon: Smartphone },
    { num: '03', title: 'Rest & Routine', icon: Moon },
    { num: '04', title: 'Stress & Inference', icon: Sparkles },
  ];

  if (loadingOptions) {
    return (
      <div className="max-w-[800px] mx-auto py-12 px-4 space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-6 w-36" />
          <Skeleton className="h-10 w-72" />
        </div>
        <Skeleton className="h-80 w-full" />
      </div>
    );
  }

  return (
    <div className="max-w-[860px] mx-auto py-8 sm:py-12 px-4 sm:px-6">
      {/* Wizard Header with Numbered Label & Large Step Counter */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <span className="font-mono text-xs text-accent font-semibold tracking-wider uppercase block mb-1">
            01 / PREDICTOR WIZARD
          </span>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-fg tracking-tight">
            Predict Student Mental Health Score
          </h1>
          <p className="text-xs sm:text-sm text-muted mt-1">
            Input behavioral indicators to compute your predicted score and risk band.
          </p>
        </div>

        {/* Large Step Counter */}
        <div className="flex items-baseline gap-1.5 self-start sm:self-auto bg-surface-2 px-4 py-2 rounded-2xl border border-line">
          <span className="text-xs font-mono text-muted uppercase">STEP</span>
          <span className="text-2xl sm:text-3xl font-display font-bold text-accent">
            {stepsMeta[currentStep - 1].num}
          </span>
          <span className="text-xs font-mono text-muted">/ 04</span>
        </div>
      </div>

      {/* Step Tabs indicator */}
      <div className="grid grid-cols-4 gap-2 mb-8">
        {stepsMeta.map((s, idx) => {
          const stepNum = idx + 1;
          const isActive = currentStep === stepNum;
          const isPassed = currentStep > stepNum;
          return (
            <button
              key={s.num}
              onClick={() => setCurrentStep(stepNum)}
              className={`text-left p-3 rounded-xl border transition-all text-xs ${
                isActive
                  ? 'border-accent bg-accent-soft text-fg'
                  : isPassed
                  ? 'border-line bg-surface-2/70 text-fg'
                  : 'border-line/60 bg-surface-2/30 text-muted hover:text-fg'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className={`font-mono text-[10px] font-bold ${isActive ? 'text-accent' : 'text-muted'}`}>
                  {s.num}
                </span>
                {isPassed && <CheckCircle2 className="w-3.5 h-3.5 text-accent" />}
              </div>
              <span className="font-medium truncate block hidden sm:inline">{s.title}</span>
            </button>
          );
        })}
      </div>

      {/* Form Content Card */}
      <Card className="p-6 sm:p-10 mb-8 relative">
        <AnimatePresence mode="wait">
          {/* STEP 1: DEMOGRAPHICS */}
          {currentStep === 1 && (
            <motion.div
              key="step-1"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              <div className="border-b border-line pb-4">
                <h2 className="text-lg font-bold font-display text-fg">01 / Demographics</h2>
                <p className="text-xs text-muted mt-0.5">
                  Basic cohort background factors used for frequency alignment.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Input
                  label="Student Age"
                  type="number"
                  min={12}
                  max={60}
                  value={formData.Age}
                  onChange={(e) => handleUpdate('Age', parseInt(e.target.value) || 20)}
                  helper="Range: 12 - 60 years"
                />

                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-fg uppercase tracking-wider font-mono">
                    Gender Identity
                  </label>
                  <select
                    value={formData.Gender}
                    onChange={(e) => handleUpdate('Gender', e.target.value)}
                    className="w-full bg-surface-2 border border-line text-fg rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-accent transition-colors"
                  >
                    {genderList.map((g) => (
                      <option key={g} value={g}>
                        {g}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-fg uppercase tracking-wider font-mono">
                    Country Region
                  </label>
                  <select
                    value={formData.Country}
                    onChange={(e) => handleUpdate('Country', e.target.value)}
                    className="w-full bg-surface-2 border border-line text-fg rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-accent transition-colors"
                  >
                    {countryList.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                  <p className="text-[11px] text-muted">Countries outside top-10 map to "Other"</p>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-fg uppercase tracking-wider font-mono">
                    Academic Degree Level
                  </label>
                  <select
                    value={formData.Academic_Level}
                    onChange={(e) => handleUpdate('Academic_Level', e.target.value)}
                    className="w-full bg-surface-2 border border-line text-fg rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-accent transition-colors"
                  >
                    {academicList.map((lvl) => (
                      <option key={lvl} value={lvl}>
                        {lvl}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 2: SCREEN & SOCIAL */}
          {currentStep === 2 && (
            <motion.div
              key="step-2"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              <div className="border-b border-line pb-4">
                <h2 className="text-lg font-bold font-display text-fg">02 / Screen & Social Habits</h2>
                <p className="text-xs text-muted mt-0.5">
                  Digital exposure velocity and preferred social platforms.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-fg uppercase tracking-wider font-mono">
                    Primary Social Platform
                  </label>
                  <select
                    value={formData.Most_Used_Platform}
                    onChange={(e) => handleUpdate('Most_Used_Platform', e.target.value)}
                    className="w-full bg-surface-2 border border-line text-fg rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-accent transition-colors"
                  >
                    {platformList.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-fg uppercase tracking-wider font-mono">
                    Primary Purpose of Use
                  </label>
                  <select
                    value={formData.Purpose_Of_Use}
                    onChange={(e) => handleUpdate('Purpose_Of_Use', e.target.value)}
                    className="w-full bg-surface-2 border border-line text-fg rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-accent transition-colors"
                  >
                    {purposeList.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-5 pt-2">
                <Slider
                  label="Average Daily Usage"
                  value={formData.Avg_Daily_Usage_Hours}
                  min={0.5}
                  max={14}
                  step={0.5}
                  unit="hours/day"
                  onChange={(val) => handleUpdate('Avg_Daily_Usage_Hours', val)}
                  helper="Total active social media screen duration"
                />

                <Slider
                  label="Daily Phone Unlocks"
                  value={formData.Daily_Unlocks}
                  min={10}
                  max={250}
                  step={5}
                  unit="unlocks/day"
                  onChange={(val) => handleUpdate('Daily_Unlocks', val)}
                  helper="Frequency of checking smartphone per 24 hours"
                />
              </div>
            </motion.div>
          )}

          {/* STEP 3: REST & ROUTINE */}
          {currentStep === 3 && (
            <motion.div
              key="step-3"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              <div className="border-b border-line pb-4">
                <h2 className="text-lg font-bold font-display text-fg">03 / Rest & Academic Routine</h2>
                <p className="text-xs text-muted mt-0.5">
                  Restorative sleep hygiene, physical movement, and study duration.
                </p>
              </div>

              <div className="space-y-6">
                <Slider
                  label="Sleep Duration Per Night"
                  value={formData.Sleep_Hours_Per_Night}
                  min={3}
                  max={12}
                  step={0.5}
                  unit="hours/night"
                  onChange={(val) => handleUpdate('Sleep_Hours_Per_Night', val)}
                  helper="Average restorative sleep on academic weekdays"
                />

                <Slider
                  label="Physical Activity"
                  value={formData.Physical_Activity_Hours}
                  min={0}
                  max={5}
                  step={0.5}
                  unit="hours/day"
                  onChange={(val) => handleUpdate('Physical_Activity_Hours', val)}
                  helper="Sports, exercise, workouts or brisk walking"
                />

                <Slider
                  label="Focused Study Time"
                  value={formData.Study_Hours}
                  min={0.5}
                  max={12}
                  step={0.5}
                  unit="hours/day"
                  onChange={(val) => handleUpdate('Study_Hours', val)}
                  helper="Dedicated non-screen or lecture academic focus"
                />
              </div>
            </motion.div>
          )}

          {/* STEP 4: STRESS & CONFIRMATION */}
          {currentStep === 4 && (
            <motion.div
              key="step-4"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              <div className="border-b border-line pb-4">
                <h2 className="text-lg font-bold font-display text-fg">04 / Perceived Stress & Summary</h2>
                <p className="text-xs text-muted mt-0.5">
                  Self-reported stress level and parameters review.
                </p>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-medium text-fg uppercase tracking-wider font-mono">
                  Perceived Academic Stress Level
                </label>
                <Segmented
                  options={stressLevels}
                  value={formData.Stress_Level}
                  onChange={(val) => handleUpdate('Stress_Level', val)}
                />
              </div>

              {/* Review summary bento */}
              <div className="p-4 rounded-xl bg-surface-2 border border-line space-y-3">
                <div className="flex items-center justify-between text-xs font-mono text-muted">
                  <span className="uppercase">Telemetry Summary</span>
                  <span className="text-accent font-semibold">Ready for Inference</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <span className="text-muted block text-[11px]">Usage</span>
                    <span className="font-semibold text-fg">{formData.Avg_Daily_Usage_Hours}h/day</span>
                  </div>
                  <div>
                    <span className="text-muted block text-[11px]">Unlocks</span>
                    <span className="font-semibold text-fg">{formData.Daily_Unlocks}/day</span>
                  </div>
                  <div>
                    <span className="text-muted block text-[11px]">Sleep</span>
                    <span className="font-semibold text-fg">{formData.Sleep_Hours_Per_Night}h/night</span>
                  </div>
                  <div>
                    <span className="text-muted block text-[11px]">Stress</span>
                    <span className="font-semibold text-fg">{formData.Stress_Level}</span>
                  </div>
                </div>
              </div>

              <p className="text-[11px] text-muted leading-relaxed">
                By calculating your score, your inputs are processed client-side or sent to the local
                scikit-learn inference pipeline without saving personal identifying telemetry.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>

      {/* Sticky Next / Back Controls (Desktop & Mobile) */}
      <div className="sticky bottom-16 md:static z-20 bg-surface/90 md:bg-transparent backdrop-blur-md md:backdrop-blur-none p-3 md:p-0 rounded-2xl border border-line md:border-0 flex items-center justify-between gap-3 shadow-md md:shadow-none">
        <Button
          variant="ghost"
          onClick={handleBack}
          disabled={currentStep === 1 || isPredicting}
          className="px-5"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          <span>Back</span>
        </Button>

        {currentStep < 4 ? (
          <Button variant="primary" onClick={handleNext} className="px-6">
            <span>Next Step</span>
            <ArrowRight className="w-4 h-4 ml-1.5" />
          </Button>
        ) : (
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={isPredicting}
            className="px-7"
          >
            {isPredicting ? (
              <span className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Computing...</span>
              </span>
            ) : (
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                <span>Calculate Score</span>
              </span>
            )}
          </Button>
        )}
      </div>
    </div>
  );
};
