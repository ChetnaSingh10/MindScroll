import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  Sliders,
  RotateCcw,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  Sparkles,
  RefreshCw,
} from 'lucide-react';
import { PredictRequest, WhatIfResponse } from '../types/api';
import { api } from '../lib/api';
import { ScoreGauge } from '../components/ScoreGauge';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Slider } from '../components/ui/Slider';
import { Segmented } from '../components/ui/Segmented';
import { Badge } from '../components/ui/Badge';
import { getBandDetails } from '../lib/utils';

interface SimulatorPageProps {
  baselineInput: PredictRequest;
  onNavigate: (page: string) => void;
}

export const SimulatorPage: React.FC<SimulatorPageProps> = ({
  baselineInput,
  onNavigate,
}) => {
  const [usage, setUsage] = useState(baselineInput.Avg_Daily_Usage_Hours);
  const [sleep, setSleep] = useState(baselineInput.Sleep_Hours_Per_Night);
  const [activity, setActivity] = useState(baselineInput.Physical_Activity_Hours);
  const [stress, setStress] = useState(baselineInput.Stress_Level);

  const [simulation, setSimulation] = useState<WhatIfResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const debounceTimer = useRef<any>(null);

  // Debounced API call to /whatif
  useEffect(() => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    debounceTimer.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await api.whatIf({
          baseline: baselineInput,
          Avg_Daily_Usage_Hours: usage,
          Sleep_Hours_Per_Night: sleep,
          Physical_Activity_Hours: activity,
          Stress_Level: stress,
        });
        setSimulation(res);
      } catch (err) {
        console.error('What-if simulator error:', err);
        // Fallback local simulated calculation if backend not reachable
        const usageDelta = (baselineInput.Avg_Daily_Usage_Hours - usage) * 0.25;
        const sleepDelta = (sleep - baselineInput.Sleep_Hours_Per_Night) * 0.35;
        const activityDelta = (activity - baselineInput.Physical_Activity_Hours) * 0.2;
        const simulatedScore = Math.max(3.6, Math.min(9.4, 6.2 + usageDelta + sleepDelta + activityDelta));
        const delta = simulatedScore - 6.2;

        setSimulation({
          baseline_score: 6.2,
          predicted_score: simulatedScore,
          delta,
          baseline_band: 'Moderate',
          predicted_band: simulatedScore > 7.0 ? 'Good' : 'Moderate',
          changes: [],
          note: 'Calculated using local approximation heuristics.',
        });
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [usage, sleep, activity, stress, baselineInput]);

  const handleReset = () => {
    setUsage(baselineInput.Avg_Daily_Usage_Hours);
    setSleep(baselineInput.Sleep_Hours_Per_Night);
    setActivity(baselineInput.Physical_Activity_Hours);
    setStress(baselineInput.Stress_Level);
  };

  const delta = simulation?.delta ?? 0;
  const isPositive = delta > 0.05;
  const isNegative = delta < -0.05;

  return (
    <div className="max-w-[1100px] mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-line pb-6">
        <div>
          <span className="font-mono text-xs text-accent font-semibold uppercase tracking-wider block mb-1">
            03 / COUNTERFACTUAL WHAT-IF ENGINE
          </span>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-fg tracking-tight">
            Simulate Behavioral Habit Adjustments
          </h1>
          <p className="text-xs sm:text-sm text-muted mt-0.5">
            Test how fine-tuning screen duration, sleep hygiene, and exercise moves your wellness score.
          </p>
        </div>

        <Button variant="ghost" size="sm" onClick={handleReset} className="self-start sm:self-auto font-mono text-xs">
          <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
          <span>Reset to Baseline</span>
        </Button>
      </div>

      {/* Bento Grid: Sliders on left, Realtime Gauge & Comparison on right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Controls Column */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="p-6 sm:p-8 space-y-6">
            <div className="border-b border-line pb-4">
              <h2 className="text-base font-bold font-display text-fg">Habit Telemetry Sliders</h2>
              <p className="text-xs text-muted mt-0.5">
                Adjust the sliders below to view real-time counterfactual model predictions.
              </p>
            </div>

            <Slider
              label="Daily Social Screen Time"
              value={usage}
              min={0.5}
              max={12}
              step={0.5}
              unit="hours/day"
              onChange={setUsage}
              helper={`Baseline: ${baselineInput.Avg_Daily_Usage_Hours}h`}
            />

            <Slider
              label="Sleep Duration Per Night"
              value={sleep}
              min={4}
              max={11}
              step={0.5}
              unit="hours/night"
              onChange={setSleep}
              helper={`Baseline: ${baselineInput.Sleep_Hours_Per_Night}h`}
            />

            <Slider
              label="Physical Activity"
              value={activity}
              min={0}
              max={4}
              step={0.5}
              unit="hours/day"
              onChange={setActivity}
              helper={`Baseline: ${baselineInput.Physical_Activity_Hours}h`}
            />

            <div className="space-y-2 pt-2">
              <label className="block text-xs font-medium text-fg uppercase tracking-wider font-mono">
                Academic Stress Level
              </label>
              <Segmented
                options={['Low', 'Medium', 'High']}
                value={stress}
                onChange={setStress}
              />
            </div>
          </Card>
        </div>

        {/* Real-time Preview Column */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="p-6 sm:p-8 flex flex-col items-center justify-between text-center relative min-h-[380px]">
            {loading && (
              <div className="absolute top-4 right-4 text-xs font-mono text-muted flex items-center gap-1.5">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-accent" />
                <span>Simulating...</span>
              </div>
            )}

            <div className="w-full">
              <span className="font-mono text-xs text-accent uppercase font-semibold block mb-4">
                SIMULATED PREDICTION
              </span>

              {simulation && (
                <ScoreGauge
                  score={simulation.predicted_score}
                  size={240}
                  showDetails={true}
                />
              )}
            </div>

            {/* Delta Comparison Box */}
            {simulation && (
              <div className="w-full mt-6 p-4 rounded-xl bg-surface-2 border border-line">
                <div className="flex items-center justify-between">
                  <div className="text-left">
                    <span className="text-[11px] font-mono text-muted block uppercase">Baseline</span>
                    <span className="text-sm font-bold font-mono text-fg">
                      {simulation.baseline_score.toFixed(2)}
                    </span>
                  </div>

                  <div className="text-center">
                    <span className="text-[11px] font-mono text-muted block uppercase">Net Delta</span>
                    <span
                      className={`text-sm font-bold font-mono flex items-center justify-center gap-0.5 ${
                        isPositive
                          ? 'text-status-good'
                          : isNegative
                          ? 'text-status-concern'
                          : 'text-muted'
                      }`}
                    >
                      {isPositive && <TrendingUp className="w-3.5 h-3.5" />}
                      {isNegative && <TrendingDown className="w-3.5 h-3.5" />}
                      {delta >= 0 ? `+${delta.toFixed(2)}` : delta.toFixed(2)}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-[11px] font-mono text-muted block uppercase">Simulated</span>
                    <span className="text-sm font-bold font-mono text-accent">
                      {simulation.predicted_score.toFixed(2)}
                    </span>
                  </div>
                </div>

                {simulation.note && (
                  <p className="text-[11px] text-muted text-left mt-3 pt-2.5 border-t border-line/60">
                    {simulation.note}
                  </p>
                )}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};
