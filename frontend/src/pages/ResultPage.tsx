import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Download,
  Sliders,
  RotateCcw,
  Copy,
  Check,
  ShieldAlert,
  Lightbulb,
  ArrowRight,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { PredictResponse, PredictRequest } from '../types/api';
import { ScoreGauge } from '../components/ScoreGauge';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { getBandDetails } from '../lib/utils';

interface ResultPageProps {
  result: PredictResponse;
  input: PredictRequest;
  onSimulate: () => void;
  onReset: () => void;
  onToast: (title: string, desc?: string, type?: 'success' | 'info') => void;
}

export const ResultPage: React.FC<ResultPageProps> = ({
  result,
  input,
  onSimulate,
  onReset,
  onToast,
}) => {
  const [copied, setCopied] = useState(false);
  const band = getBandDetails(result.score);

  const handleDownloadPDF = () => {
    window.print();
    onToast('Print Dialogue', 'Exporting assessment report.', 'success');
  };

  const handleCopySummary = () => {
    const text = `MindScroll AI Assessment Result
-----------------------------------
Predicted Score: ${result.score.toFixed(2)} / 10.0 (${result.band})
Daily Screen Time: ${input.Avg_Daily_Usage_Hours} hrs/day
Daily Unlocks: ${input.Daily_Unlocks}
Sleep Duration: ${input.Sleep_Hours_Per_Night} hrs/night
Stress Level: ${input.Stress_Level}

Recommendations:
${result.suggestions.map((s, i) => `${i + 1}. ${s.title}: ${s.description}`).join('\n')}
-----------------------------------
Trained on 5,000 student records using Random Forest regression.`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    onToast('Summary Copied', 'Assessment summary copied to clipboard.', 'success');
    setTimeout(() => setCopied(false), 2500);
  };

  const factorChartData = result.top_factors.map((f) => ({
    name: f.factor,
    weight: Math.round(f.weight * 100),
    impact: f.impact,
    description: f.description,
  }));

  const badgeVariant =
    band.band === 'Good'
      ? 'good'
      : band.band === 'Moderate'
      ? 'moderate'
      : band.band === 'Needs Attention'
      ? 'attention'
      : 'concern';

  return (
    <div className="max-w-[1000px] mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-10">
      {/* Top Header & Actions Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-line pb-6">
        <div>
          <span className="font-mono text-xs text-accent font-semibold uppercase tracking-wider block mb-1">
            02 / ASSESSMENT RESULT
          </span>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-fg tracking-tight">
            Your Cognitive Wellness Profile
          </h1>
          <p className="text-xs sm:text-sm text-muted mt-0.5">
            Empirically derived from your screen time, daily unlocks, sleep, and study telemetry.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopySummary}
            className="text-xs font-mono"
          >
            {copied ? <Check className="w-3.5 h-3.5 mr-1 text-status-good" /> : <Copy className="w-3.5 h-3.5 mr-1" />}
            <span>{copied ? 'Copied' : 'Copy Summary'}</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleDownloadPDF}
            className="text-xs font-mono"
          >
            <Download className="w-3.5 h-3.5 mr-1" />
            <span>Download PDF</span>
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={onSimulate}
            className="text-xs font-mono"
          >
            <Sliders className="w-3.5 h-3.5 mr-1" />
            <span>What-If Simulator</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="p-2"
            title="Start New Assessment"
            aria-label="Start new assessment"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Main Score Hero Card */}
      <Card className="p-8 sm:p-12 text-center relative overflow-hidden">
        <div className="max-w-md mx-auto flex flex-col items-center">
          <ScoreGauge score={result.score} size={280} showDetails={true} />

          <p className="text-xs sm:text-sm text-muted mt-5 leading-relaxed">
            {result.band_description ||
              `Your predicted wellness score reflects a balance of ${input.Avg_Daily_Usage_Hours} hours daily usage with ${input.Sleep_Hours_Per_Night} hours sleep duration.`}
          </p>

          <div className="mt-5 flex flex-wrap justify-center gap-2 font-mono text-xs">
            <span className="px-3 py-1 rounded-lg bg-surface-2 border border-line text-muted">
              Unlocks: <strong className="text-fg">{input.Daily_Unlocks}</strong>/day
            </span>
            <span className="px-3 py-1 rounded-lg bg-surface-2 border border-line text-muted">
              Sleep: <strong className="text-fg">{input.Sleep_Hours_Per_Night}</strong>h/night
            </span>
            <span className="px-3 py-1 rounded-lg bg-surface-2 border border-line text-muted">
              Stress: <strong className="text-fg">{input.Stress_Level}</strong>
            </span>
          </div>
        </div>
      </Card>

      {/* What's Driving Your Score (Bar Chart) */}
      <div className="space-y-4">
        <div>
          <span className="font-mono text-xs text-accent font-semibold uppercase tracking-wider block mb-0.5">
            FACTOR ANALYSIS
          </span>
          <h2 className="text-xl sm:text-2xl font-display font-bold text-fg tracking-tight">
            What's Driving Your Score
          </h2>
          <p className="text-xs text-muted">
            Relative impact weights of top behavioral predictors in the Random Forest model.
          </p>
        </div>

        <Card className="p-6">
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={factorChartData}
                layout="vertical"
                margin={{ top: 10, right: 20, left: 20, bottom: 5 }}
              >
                <XAxis
                  type="number"
                  stroke="var(--line)"
                  tick={{ fill: 'var(--muted)', fontSize: 11, fontFamily: 'monospace' }}
                  domain={[0, 100]}
                  unit="%"
                />
                <YAxis
                  dataKey="name"
                  type="category"
                  stroke="var(--line)"
                  tick={{ fill: 'var(--fg)', fontSize: 12 }}
                  width={110}
                />
                <Tooltip
                  cursor={{ fill: 'var(--surface-2)', opacity: 0.5 }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="p-3 rounded-xl bg-surface border border-line shadow-lg text-xs font-mono">
                          <p className="font-semibold text-fg">{data.name}</p>
                          <p className="text-accent mt-0.5">Impact: {data.weight}%</p>
                          <p className="text-muted mt-1 text-[11px] font-sans">{data.description}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar
                  dataKey="weight"
                  radius={[0, 6, 6, 0]}
                  isAnimationActive={true}
                  animationDuration={900}
                >
                  {factorChartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.impact === 'positive' ? 'var(--chart-teal)' : 'var(--accent)'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-center gap-6 pt-4 border-t border-line text-xs font-mono text-muted">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: 'var(--chart-teal)' }} />
              <span>Positive restoration</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: 'var(--accent)' }} />
              <span>Negative fatigue drag</span>
            </div>
          </div>
        </Card>
      </div>

      {/* 3 to 5 Actionable Recommendations */}
      <div className="space-y-4">
        <div>
          <span className="font-mono text-xs text-accent font-semibold uppercase tracking-wider block mb-0.5">
            MICRO-NUDGES
          </span>
          <h2 className="text-xl sm:text-2xl font-display font-bold text-fg tracking-tight">
            Targeted Lifestyle Recommendations
          </h2>
          <p className="text-xs text-muted">
            Data-backed habit adjustments designed to optimize cognitive restoration.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {result.suggestions.slice(0, 3).map((item, idx) => (
            <Card key={idx} className="p-5 flex flex-col justify-between hoverEffect">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-xs text-accent font-bold">
                    0{idx + 1}
                  </span>
                  <div className="p-1.5 rounded-lg bg-accent-soft text-accent">
                    <Lightbulb className="w-4 h-4" />
                  </div>
                </div>
                <h3 className="font-display font-bold text-base text-fg mb-1.5">
                  {item.title}
                </h3>
                <p className="text-xs text-muted leading-relaxed font-sans">
                  {item.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-line/60 flex items-center justify-between text-[11px] font-mono text-muted">
                <span className="uppercase">{item.category}</span>
                <span className="text-accent flex items-center gap-1 font-semibold">
                  Actionable <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Research & Clinical Disclaimer */}
      <div className="p-4 rounded-xl bg-surface border border-line flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-accent shrink-0 mt-0.5" />
        <div className="text-xs leading-relaxed text-muted">
          <strong className="text-fg font-semibold block mb-0.5 font-mono text-[11px] uppercase tracking-wide">
            Educational Research Disclaimer
          </strong>
          {result.disclaimer ||
            'MindScroll AI is an exploratory data science project. Predictions are indicative statistical correlations from a student cohort survey and should not be used as clinical diagnostic advice.'}
        </div>
      </div>
    </div>
  );
};
