import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Play, Pause, Copy, Check, Layers, Binary, Cpu, Activity } from 'lucide-react';

interface StageData {
  id: string;
  stepNumber: string;
  plate: string;
  title: string;
  subtitle: string;
  icon: any;
  explanation: string;
  inputJson: any;
  outputJson: any;
  keyMetric: { label: string; value: string };
}

const STAGES: StageData[] = [
  {
    id: 'inputs',
    stepNumber: '01',
    plate: 'Plate 01',
    title: 'Student Lifestyle Inputs',
    subtitle: 'RAW TELEMETRIC SENSORS',
    icon: Activity,
    explanation:
      'Captures self-reported student behavioral markers across academic load, sleep duration, physical activity, and social application frequency.',
    inputJson: {
      Age: 21,
      Gender: "Female",
      Country: "India",
      Academic_Level: "Undergraduate",
      Most_Used_Platform: "Instagram",
      Avg_Daily_Usage_Hours: 5.5,
      Daily_Unlocks: 92,
      Study_Hours: 4.0,
      Physical_Activity_Hours: 0.5,
      Sleep_Hours_Per_Night: 5.5,
      Stress_Level: "High"
    },
    outputJson: {
      status: "VALIDATED_PAYLOAD",
      numeric_features_count: 5,
      categorical_features_count: 4,
      ordinal_features_count: 1
    },
    keyMetric: { label: 'Input Dimensions', value: '12 Variables' }
  },
  {
    id: 'preprocessing',
    stepNumber: '02',
    plate: 'Plate 02',
    title: 'Preprocessing & Feature Normalization',
    subtitle: 'LATENT TRANSFORMATIONS',
    icon: Binary,
    explanation:
      'Applies log1p skew reduction to Study_Hours, resolves top-10 Country distribution with "Other" grouping, and performs ordinal encoding on Stress_Level.',
    inputJson: {
      raw_study_hours: 4.0,
      raw_country: "India",
      raw_stress: "High"
    },
    outputJson: {
      log_study_hours: 1.6094,
      grouped_country: "India",
      stress_ordinal_rank: 2,
      one_hot_vector_length: 28,
      scaling: "StandardScaler(mean=0, std=1)"
    },
    keyMetric: { label: 'Feature Space Post-Encoding', value: '38 Columns' }
  },
  {
    id: 'rf_model',
    stepNumber: '03',
    plate: 'Plate 03',
    title: 'Random Forest Regressor Ensembling',
    subtitle: 'MULTI-TREE DECISION LATENT GRAPH',
    icon: Cpu,
    explanation:
      'Evaluates the preprocessed vector across 100 orthogonal decision trees to detect non-linear interactions (e.g. high unlocks paired with low sleep amplify anxiety index).',
    inputJson: {
      n_estimators: 100,
      max_depth: "None",
      bootstrap: true,
      min_samples_split: 2
    },
    outputJson: {
      mean_ensemble_prediction: 48.72,
      variance_across_trees: 1.84,
      primary_feature_weights: {
        Sleep_Hours_Per_Night: "0.285",
        Avg_Daily_Usage_Hours: "0.241",
        Daily_Unlocks: "0.198"
      }
    },
    keyMetric: { label: 'Model Accuracy R²', value: '0.864' }
  },
  {
    id: 'score_synthesis',
    stepNumber: '04',
    plate: 'Plate 04',
    title: 'Mental Health Score Synthesis',
    subtitle: 'CALIBRATED OUTCOME & RISK CLUSTERING',
    icon: Layers,
    explanation:
      'Translates continuous regression output (0-100) into risk classifications (Thriving, Stable, At-Risk, Critical) and triggers personalised behavioral interventions.',
    inputJson: {
      raw_regression_score: 48.72,
      thresholds: { thriving: 75, stable: 55, at_risk: 40, critical: 0 }
    },
    outputJson: {
      Mental_Health_Score: 48.72,
      Risk_Band: "At-Risk",
      Primary_Driver: "Sleep fragmentation due to late-night unlock velocity",
      Recommended_Action: "Implement 45-min wind-down screen curfew"
    },
    keyMetric: { label: 'Outcome Resolution', value: '4 Risk Bands' }
  }
];

export const PipelineExplorer: React.FC = () => {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [copiedType, setCopiedType] = useState<'input' | 'output' | null>(null);

  // Auto-play interval
  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % STAGES.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  // Keyboard navigation listener (Left / Right arrow)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        setActiveIdx((prev) => (prev + 1) % STAGES.length);
      } else if (e.key === 'ArrowLeft') {
        setActiveIdx((prev) => (prev - 1 + STAGES.length) % STAGES.length);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const currentStage = STAGES[activeIdx];
  const Icon = currentStage.icon;

  const handleCopy = (data: any, type: 'input' | 'output') => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  return (
    <div className="w-full py-12 border-y border-border-subtle bg-subtle/20 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="font-mono text-xs text-primary font-bold tracking-widest uppercase">
                02 // HOW THE MODEL THINKS
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">
                SCIKIT-LEARN PIPELINE
              </span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-display font-bold text-content-primary tracking-tight">
              From Raw Habit to <span className="text-gradient">Predictive Signal</span>
            </h2>
            <p className="text-xs sm:text-sm text-content-muted mt-1 max-w-xl">
              Inspect how MindScroll AI translates raw user habits into mathematically grounded mental health indicators.
            </p>
          </div>

          {/* Controls: Auto-play & Prev/Next */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsAutoPlaying(!isAutoPlaying)}
              className={`px-3 py-2 rounded-xl text-xs font-mono font-semibold flex items-center gap-2 border transition-colors ${
                isAutoPlaying
                  ? 'bg-primary text-white border-primary shadow-sm shadow-primary/30'
                  : 'bg-card text-content-secondary border-border-subtle hover:text-content-primary'
              }`}
              title="Toggle Auto-Play"
            >
              {isAutoPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isAutoPlaying ? 'PAUSE AUTO' : 'AUTO PLAY'}</span>
            </button>

            <div className="flex items-center gap-1 bg-card border border-border-subtle rounded-xl p-1">
              <button
                onClick={() => setActiveIdx((prev) => (prev - 1 + STAGES.length) % STAGES.length)}
                className="p-1.5 rounded-lg text-content-muted hover:text-content-primary hover:bg-card-hover transition-colors"
                aria-label="Previous pipeline step"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <span className="font-mono text-xs px-2 text-content-primary font-semibold">
                {activeIdx + 1} / {STAGES.length}
              </span>
              <button
                onClick={() => setActiveIdx((prev) => (prev + 1) % STAGES.length)}
                className="p-1.5 rounded-lg text-content-muted hover:text-content-primary hover:bg-card-hover transition-colors"
                aria-label="Next pipeline step"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Stepper Tabs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-8">
          {STAGES.map((stage, idx) => {
            const isSelected = idx === activeIdx;
            return (
              <button
                key={stage.id}
                onClick={() => setActiveIdx(idx)}
                className={`p-3 rounded-xl border text-left transition-all relative ${
                  isSelected
                    ? 'bg-card border-primary/60 shadow-lg shadow-primary/10'
                    : 'bg-subtle/50 border-border-subtle hover:border-content-muted/30 opacity-70 hover:opacity-100'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-[10px] text-primary font-bold">
                    [{stage.plate}]
                  </span>
                  <span className="font-mono text-[10px] text-content-muted">
                    {stage.stepNumber}
                  </span>
                </div>
                <div className="text-xs font-bold text-content-primary truncate font-display">
                  {stage.title}
                </div>
                {isSelected && (
                  <motion.div
                    layoutId="active-stage-indicator"
                    className="absolute -bottom-[1px] left-3 right-3 h-[2px] bg-gradient-to-r from-primary to-accent rounded-full"
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Active Stage Detail Panel */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStage.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
            className="p-6 sm:p-8 rounded-2xl bg-card border border-border-subtle shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-8"
          >
            {/* Left Column: Context & Metadata */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/25 flex items-center justify-center text-primary">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-mono text-[10px] tracking-widest text-primary font-bold uppercase block">
                      {currentStage.subtitle}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-bold font-display text-content-primary">
                      {currentStage.title}
                    </h3>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-content-secondary leading-relaxed mb-6 font-sans">
                  {currentStage.explanation}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-subtle/80 border border-border-subtle">
                <span className="text-[10px] font-mono text-content-muted uppercase block mb-1">
                  {currentStage.keyMetric.label}
                </span>
                <span className="text-xl font-bold font-display text-primary">
                  {currentStage.keyMetric.value}
                </span>
              </div>
            </div>

            {/* Right Column: Code & JSON I/O Viewers */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Stage Input JSON */}
              <div className="flex flex-col bg-[#0A0A0A] rounded-xl border border-white/10 p-3 overflow-hidden text-white">
                <div className="flex items-center justify-between pb-2 border-b border-white/10 mb-2">
                  <span className="font-mono text-[10px] text-amber-400 font-bold uppercase tracking-wider">
                    // STAGE INPUT
                  </span>
                  <button
                    onClick={() => handleCopy(currentStage.inputJson, 'input')}
                    className="p-1 rounded text-white/50 hover:text-white transition-colors"
                    title="Copy Input JSON"
                  >
                    {copiedType === 'input' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <pre className="text-[10px] sm:text-[11px] font-mono text-gray-300 overflow-x-auto p-1 leading-relaxed max-h-56 scrollbar-thin">
                  {JSON.stringify(currentStage.inputJson, null, 2)}
                </pre>
              </div>

              {/* Stage Output JSON */}
              <div className="flex flex-col bg-[#0A0A0A] rounded-xl border border-white/10 p-3 overflow-hidden text-white">
                <div className="flex items-center justify-between pb-2 border-b border-white/10 mb-2">
                  <span className="font-mono text-[10px] text-[#FF8A3D] font-bold uppercase tracking-wider">
                    // STAGE OUTPUT
                  </span>
                  <button
                    onClick={() => handleCopy(currentStage.outputJson, 'output')}
                    className="p-1 rounded text-white/50 hover:text-white transition-colors"
                    title="Copy Output JSON"
                  >
                    {copiedType === 'output' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <pre className="text-[10px] sm:text-[11px] font-mono text-[#FF8A3D] overflow-x-auto p-1 leading-relaxed max-h-56 scrollbar-thin">
                  {JSON.stringify(currentStage.outputJson, null, 2)}
                </pre>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};
