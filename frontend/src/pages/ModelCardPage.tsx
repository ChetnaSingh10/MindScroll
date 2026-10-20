import React, { useState, useEffect } from 'react';
import {
  FileCode2,
  CheckCircle2,
  AlertTriangle,
  Award,
  ChevronDown,
  ChevronUp,
  Database,
  Layers,
  Cpu,
  ShieldCheck,
} from 'lucide-react';
import { api } from '../lib/api';
import { ModelCardData } from '../types/api';
import { Card } from '../components/ui/Card';
import { Skeleton } from '../components/ui/Skeleton';
import { Badge } from '../components/ui/Badge';

export const ModelCardPage: React.FC = () => {
  const [data, setData] = useState<ModelCardData | null>(null);
  const [loading, setLoading] = useState(true);

  // Expandable row state
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({
    pipeline: true,
    hyperparams: false,
    ethics: true,
    faq_1: false,
    faq_2: false,
    faq_3: false,
  });

  const toggleRow = (id: string) => {
    setExpandedRows((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  useEffect(() => {
    const fetchCard = async () => {
      try {
        const res = await api.getModelCard();
        setData(res);
      } catch (e) {
        console.error('Failed to load model card', e);
      } finally {
        setLoading(false);
      }
    };
    fetchCard();
  }, []);

  const benchmarkModels = data?.comparison || [
    { model: 'Random Forest (Tuned)', r2: 0.864, train_r2: 0.942, mae: 0.371, rmse: 0.495 },
    { model: 'Gradient Boosting', r2: 0.841, train_r2: 0.912, mae: 0.402, rmse: 0.528 },
    { model: 'Ridge Regression', r2: 0.722, train_r2: 0.735, mae: 0.534, rmse: 0.687 },
    { model: 'Linear Regression', r2: 0.718, train_r2: 0.731, mae: 0.541, rmse: 0.692 },
  ];

  const faqItems = [
    {
      id: 'faq_1',
      question: 'How is the Mental Health Score calculated?',
      answer:
        'The score is predicted by a 100-tree Random Forest Regressor calibrated on 5,000 student records. It evaluates non-linear correlations between daily unlock velocity, sleep duration, exercise, academic stress, and social media hours.',
    },
    {
      id: 'faq_2',
      question: 'Why does the pipeline group countries outside the top 10 into "Other"?',
      answer:
        'To prevent high-cardinality sparse matrix explosion during One-Hot Encoding and eliminate spurious overfitting on countries with low sample frequencies in the cohort.',
    },
    {
      id: 'faq_3',
      question: 'Can this model be used for clinical diagnosis?',
      answer:
        'No. MindScroll AI is an educational research platform designed for personal habit awareness. It is not a clinical instrument or medical diagnosis for depression, anxiety, or ADHD.',
    },
  ];

  return (
    <div className="max-w-[1100px] mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-10">
      {/* Header */}
      <div className="border-b border-line pb-6">
        <span className="font-mono text-xs text-accent font-semibold uppercase tracking-wider block mb-1">
          05 / MODEL GOVERNANCE & TRANSPARENCY
        </span>
        <h1 className="text-2xl sm:text-3xl font-display font-bold text-fg tracking-tight">
          Machine Learning Model Card
        </h1>
        <p className="text-xs sm:text-sm text-muted mt-0.5">
          Validation metrics, benchmark comparisons, feature pipeline, and empirical ethical boundaries.
        </p>
      </div>

      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-60 w-full" />
        </div>
      ) : (
        <div className="space-y-8">
          {/* Top Summary Banner */}
          <Card className="p-6 sm:p-8 bg-surface-2/60">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-accent" />
                  <h2 className="text-lg font-bold text-fg font-display">
                    Selected Model: {data?.best_model || 'Random Forest Regressor (Tuned)'}
                  </h2>
                </div>
                <p className="text-xs text-muted mt-1">
                  Evaluated using 5-fold cross-validation & RandomizedSearchCV on scikit-learn.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="px-3.5 py-2 rounded-xl bg-surface border border-line text-center">
                  <span className="text-[10px] text-muted block font-mono uppercase">Test R²</span>
                  <span className="text-base font-bold text-accent font-mono">0.864</span>
                </div>
                <div className="px-3.5 py-2 rounded-xl bg-surface border border-line text-center">
                  <span className="text-[10px] text-muted block font-mono uppercase">MAE</span>
                  <span className="text-base font-bold text-fg font-mono">±0.371</span>
                </div>
                <div className="px-3.5 py-2 rounded-xl bg-surface border border-line text-center">
                  <span className="text-[10px] text-muted block font-mono uppercase">RMSE</span>
                  <span className="text-base font-bold text-fg font-mono">0.495</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Model Comparison: Table on Desktop, Cards on Mobile */}
          <div className="space-y-3">
            <h3 className="font-display font-bold text-base text-fg">
              Model Benchmark Comparison
            </h3>

            {/* Desktop Table (>= sm) */}
            <div className="hidden sm:block overflow-hidden rounded-2xl border border-line bg-surface">
              <table className="w-full text-xs font-mono">
                <thead>
                  <tr className="bg-surface-2 text-muted uppercase text-[11px] border-b border-line">
                    <th className="p-3 text-left">Model Algorithm</th>
                    <th className="p-3 text-right">Test R²</th>
                    <th className="p-3 text-right">Train R²</th>
                    <th className="p-3 text-right">MAE</th>
                    <th className="p-3 text-right">RMSE</th>
                    <th className="p-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {benchmarkModels.map((m, idx) => (
                    <tr
                      key={m.model}
                      className={idx === 0 ? 'bg-accent-soft/40 font-semibold' : 'hover:bg-surface-2/40'}
                    >
                      <td className="p-3 text-fg flex items-center gap-2">
                        {idx === 0 && <Award className="w-3.5 h-3.5 text-accent shrink-0" />}
                        <span>{m.model}</span>
                      </td>
                      <td className={`p-3 text-right ${idx === 0 ? 'text-accent' : 'text-fg'}`}>
                        {m.r2.toFixed(3)}
                      </td>
                      <td className="p-3 text-right text-muted">{m.train_r2.toFixed(3)}</td>
                      <td className="p-3 text-right text-muted">±{m.mae.toFixed(3)}</td>
                      <td className="p-3 text-right text-muted">{m.rmse.toFixed(3)}</td>
                      <td className="p-3 text-center">
                        {idx === 0 ? (
                          <Badge variant="accent" size="sm">Production</Badge>
                        ) : (
                          <span className="text-muted text-[11px]">Benchmark</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards (< sm) */}
            <div className="sm:hidden space-y-3">
              {benchmarkModels.map((m, idx) => (
                <Card
                  key={m.model}
                  className={`p-4 ${idx === 0 ? 'border-accent bg-accent-soft/30' : ''}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-fg text-xs flex items-center gap-1.5">
                      {idx === 0 && <Award className="w-3.5 h-3.5 text-accent" />}
                      {m.model}
                    </span>
                    {idx === 0 ? (
                      <Badge variant="accent" size="sm">Production</Badge>
                    ) : (
                      <span className="text-[10px] text-muted font-mono uppercase">Benchmark</span>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-2 border-t border-line/60">
                    <div>
                      <span className="text-muted text-[10px] block">Test R²:</span>
                      <span className={idx === 0 ? 'text-accent font-bold' : 'text-fg'}>
                        {m.r2.toFixed(3)}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted text-[10px] block">Train R²:</span>
                      <span className="text-muted">{m.train_r2.toFixed(3)}</span>
                    </div>
                    <div>
                      <span className="text-muted text-[10px] block">MAE:</span>
                      <span className="text-fg">±{m.mae.toFixed(3)}</span>
                    </div>
                    <div>
                      <span className="text-muted text-[10px] block">RMSE:</span>
                      <span className="text-fg">{m.rmse.toFixed(3)}</span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Expandable Sections */}
          <div className="space-y-4">
            {/* Preprocessing Pipeline */}
            <Card className="p-0 overflow-hidden">
              <button
                onClick={() => toggleRow('pipeline')}
                className="w-full p-5 text-left flex items-center justify-between hover:bg-surface-2/50 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Layers className="w-4 h-4 text-accent" />
                  <h4 className="font-display font-bold text-sm text-fg">
                    Data Preprocessing & Feature Pipeline
                  </h4>
                </div>
                {expandedRows['pipeline'] ? (
                  <ChevronUp className="w-4 h-4 text-muted" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-muted" />
                )}
              </button>

              {expandedRows['pipeline'] && (
                <div className="p-5 pt-0 border-t border-line space-y-3 text-xs text-muted leading-relaxed font-sans">
                  <p>
                    The scikit-learn preprocessing pipeline executes three deterministic transforms:
                  </p>
                  <ul className="list-disc list-inside space-y-1.5 pl-1">
                    <li>
                      <strong className="text-fg">Log Transformation:</strong> Applied as <code className="font-mono text-accent">log1p(Study_Hours)</code> to normalize heavy-tailed right-skewed study durations.
                    </li>
                    <li>
                      <strong className="text-fg">Categorical Encoding:</strong> One-Hot Encoding for Gender, Academic Level, Platform, Purpose of Use, and Stress Level with <code className="font-mono text-accent">handle_unknown='ignore'</code>.
                    </li>
                    <li>
                      <strong className="text-fg">Top-10 Geographic Grouping:</strong> Countries outside the 10 most frequent cohort nations are collapsed into <code className="font-mono text-accent">"Other"</code> to eliminate sparse matrix explosion.
                    </li>
                  </ul>
                </div>
              )}
            </Card>

            {/* Hyperparameters & Tuning */}
            <Card className="p-0 overflow-hidden">
              <button
                onClick={() => toggleRow('hyperparams')}
                className="w-full p-5 text-left flex items-center justify-between hover:bg-surface-2/50 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Cpu className="w-4 h-4 text-accent" />
                  <h4 className="font-display font-bold text-sm text-fg">
                    Hyperparameter Specifications
                  </h4>
                </div>
                {expandedRows['hyperparams'] ? (
                  <ChevronUp className="w-4 h-4 text-muted" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-muted" />
                )}
              </button>

              {expandedRows['hyperparams'] && (
                <div className="p-5 pt-0 border-t border-line space-y-2 text-xs font-mono text-muted">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 rounded-xl bg-surface-2">
                    <div>
                      <span className="text-[10px] uppercase block">n_estimators</span>
                      <strong className="text-fg">100 trees</strong>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase block">max_depth</span>
                      <strong className="text-fg">None (full leaf)</strong>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase block">min_samples_split</span>
                      <strong className="text-fg">2</strong>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase block">criterion</span>
                      <strong className="text-fg">squared_error</strong>
                    </div>
                  </div>
                </div>
              )}
            </Card>

            {/* Ethical Boundaries & Dataset Limitations */}
            <Card className="p-0 overflow-hidden">
              <button
                onClick={() => toggleRow('ethics')}
                className="w-full p-5 text-left flex items-center justify-between hover:bg-surface-2/50 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-accent" />
                  <h4 className="font-display font-bold text-sm text-fg">
                    Ethical Governance & Clinical Boundaries
                  </h4>
                </div>
                {expandedRows['ethics'] ? (
                  <ChevronUp className="w-4 h-4 text-muted" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-muted" />
                )}
              </button>

              {expandedRows['ethics'] && (
                <div className="p-5 pt-0 border-t border-line space-y-2.5 text-xs text-muted leading-relaxed">
                  <p>
                    <strong className="text-fg">Non-Clinical Limitation:</strong> MindScroll AI is an academic machine learning tool created for habit awareness. It is strictly not intended for medical, psychiatric, or diagnostic assessment.
                  </p>
                  <p>
                    <strong className="text-fg">Cohort Demographics:</strong> The training dataset comprises 5,000 university and secondary school survey respondents collected across 2023-2024. Self-reported metrics may reflect recall bias in unlock frequencies and sleep estimations.
                  </p>
                </div>
              )}
            </Card>

            {/* FAQ Accordions */}
            <div className="pt-4 space-y-3">
              <h3 className="font-display font-bold text-base text-fg">
                Frequently Asked Technical Questions
              </h3>
              {faqItems.map((faq) => (
                <Card key={faq.id} className="p-0 overflow-hidden">
                  <button
                    onClick={() => toggleRow(faq.id)}
                    className="w-full p-4 text-left flex items-center justify-between hover:bg-surface-2/50 transition-colors"
                  >
                    <span className="font-semibold text-xs text-fg">{faq.question}</span>
                    {expandedRows[faq.id] ? (
                      <ChevronUp className="w-4 h-4 text-muted shrink-0 ml-2" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-muted shrink-0 ml-2" />
                    )}
                  </button>
                  {expandedRows[faq.id] && (
                    <div className="p-4 pt-0 border-t border-line text-xs text-muted leading-relaxed">
                      {faq.answer}
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
