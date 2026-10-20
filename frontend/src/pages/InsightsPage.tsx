import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  AreaChart,
  Area,
} from 'recharts';
import {
  BarChart3,
  Filter,
  X,
  RotateCcw,
  Users,
  Activity,
  Clock,
  Moon,
} from 'lucide-react';
import { api } from '../lib/api';
import { InsightsResponse, DatasetOptionsResponse } from '../types/api';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Skeleton } from '../components/ui/Skeleton';

interface InsightsPageProps {
  options: DatasetOptionsResponse | null;
}

export const InsightsPage: React.FC<InsightsPageProps> = ({ options }) => {
  const [insights, setInsights] = useState<InsightsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Filters
  const [genderFilter, setGenderFilter] = useState('All');
  const [academicFilter, setAcademicFilter] = useState('All');
  const [countryFilter, setCountryFilter] = useState('All');

  const activeFiltersCount =
    (genderFilter !== 'All' ? 1 : 0) +
    (academicFilter !== 'All' ? 1 : 0) +
    (countryFilter !== 'All' ? 1 : 0);

  const fetchInsightsData = async () => {
    setLoading(true);
    try {
      const data = await api.getInsights({
        gender: genderFilter,
        academic_level: academicFilter,
        country: countryFilter,
      });
      setInsights(data);
    } catch (err) {
      console.error('Failed to load insights:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsightsData();
  }, [genderFilter, academicFilter, countryFilter]);

  const resetFilters = () => {
    setGenderFilter('All');
    setAcademicFilter('All');
    setCountryFilter('All');
  };

  const corrVariables = [
    { key: 'Avg_Daily_Usage_Hours', label: 'Screen' },
    { key: 'Sleep_Hours_Per_Night', label: 'Sleep' },
    { key: 'Physical_Activity_Hours', label: 'Activity' },
    { key: 'Daily_Unlocks', label: 'Unlocks' },
    { key: 'Study_Hours', label: 'Study' },
    { key: 'Mental_Health_Score', label: 'Score' },
  ];

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-line pb-6">
        <div>
          <span className="font-mono text-xs text-accent font-semibold uppercase tracking-wider block mb-1">
            04 / POPULATION EXPLORATION
          </span>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-fg tracking-tight">
            Cohort Insights Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-muted mt-0.5">
            Empirical relationships across 5,000 university and secondary school survey respondents.
          </p>
        </div>

        {/* Mobile Filter Trigger Button */}
        <div className="md:hidden">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setMobileFilterOpen(true)}
            className="w-full justify-between"
          >
            <span className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-accent" />
              <span>Filters</span>
            </span>
            {activeFiltersCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-accent-soft text-accent text-[11px] font-bold">
                {activeFiltersCount}
              </span>
            )}
          </Button>
        </div>

        {/* Desktop Filter Bar */}
        <div className="hidden md:flex items-center gap-2.5 p-1.5 rounded-2xl bg-surface-2 border border-line">
          <div className="flex items-center gap-1 text-xs text-muted px-2 font-mono">
            <Filter className="w-3.5 h-3.5 text-accent" />
            <span>FILTERS:</span>
          </div>

          <select
            value={genderFilter}
            onChange={(e) => setGenderFilter(e.target.value)}
            className="bg-surface border border-line rounded-xl px-2.5 py-1 text-xs text-fg focus:outline-none focus:border-accent"
          >
            <option value="All">All Genders</option>
            {options?.genders?.map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>

          <select
            value={academicFilter}
            onChange={(e) => setAcademicFilter(e.target.value)}
            className="bg-surface border border-line rounded-xl px-2.5 py-1 text-xs text-fg focus:outline-none focus:border-accent"
          >
            <option value="All">All Academic Levels</option>
            {options?.academic_levels?.map((a) => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>

          <select
            value={countryFilter}
            onChange={(e) => setCountryFilter(e.target.value)}
            className="bg-surface border border-line rounded-xl px-2.5 py-1 text-xs text-fg focus:outline-none focus:border-accent"
          >
            <option value="All">All Countries</option>
            {(options?.top_10_countries || options?.countries)?.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          {activeFiltersCount > 0 && (
            <button
              onClick={resetFilters}
              className="p-1.5 text-muted hover:text-accent rounded-lg transition-colors"
              title="Reset Filters"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
        </div>
      ) : insights ? (
        <div className="space-y-8">
          {/* Bento Strip of Key Stat Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="p-4 sm:p-5">
              <span className="text-[11px] font-mono text-muted uppercase">Sampled Students</span>
              <div className="text-2xl sm:text-3xl font-bold font-display text-fg mt-1">
                {insights.key_stats.total_students.toLocaleString()}
              </div>
            </Card>

            <Card className="p-4 sm:p-5">
              <span className="text-[11px] font-mono text-muted uppercase">Average Score</span>
              <div className="text-2xl sm:text-3xl font-bold font-display text-accent mt-1">
                {insights.key_stats.avg_score.toFixed(2)}
              </div>
            </Card>

            <Card className="p-4 sm:p-5">
              <span className="text-[11px] font-mono text-muted uppercase">Average Screen Time</span>
              <div className="text-2xl sm:text-3xl font-bold font-display text-fg mt-1">
                {insights.key_stats.avg_daily_usage.toFixed(1)}h/day
              </div>
            </Card>

            <Card className="p-4 sm:p-5">
              <span className="text-[11px] font-mono text-muted uppercase">Average Sleep</span>
              <div className="text-2xl sm:text-3xl font-bold font-display text-fg mt-1">
                {insights.key_stats.avg_sleep.toFixed(1)}h/night
              </div>
            </Card>
          </div>

          {/* Bento Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Score Distribution Chart */}
            <Card className="p-6">
              <div className="mb-4">
                <span className="text-xs font-mono text-accent uppercase font-semibold">
                  HISTOGRAM
                </span>
                <h3 className="text-base font-bold font-display text-fg">
                  Mental Health Score Distribution
                </h3>
              </div>
              <div className="h-60 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={insights.score_distribution}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--line)" />
                    <XAxis
                      dataKey="bin"
                      stroke="var(--line)"
                      tick={{ fill: 'var(--muted)', fontSize: 11 }}
                    />
                    <YAxis
                      stroke="var(--line)"
                      tick={{ fill: 'var(--muted)', fontSize: 11 }}
                    />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const d = payload[0].payload;
                          return (
                            <div className="p-2.5 rounded-xl bg-surface border border-line text-xs font-mono shadow-md">
                              <p className="font-semibold text-fg">Score {d.bin}</p>
                              <p className="text-accent">{d.count} students ({d.pct}%)</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="count"
                      stroke="var(--accent)"
                      fill="var(--accent-soft)"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Sleep vs Mental Health Score */}
            <Card className="p-6">
              <div className="mb-4">
                <span className="text-xs font-mono text-accent uppercase font-semibold">
                  REST HYGIENE
                </span>
                <h3 className="text-base font-bold font-display text-fg">
                  Average Score by Sleep Duration
                </h3>
              </div>
              <div className="h-60 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={insights.sleep_vs_score}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--line)" />
                    <XAxis
                      dataKey="sleep_range"
                      stroke="var(--line)"
                      tick={{ fill: 'var(--muted)', fontSize: 11 }}
                    />
                    <YAxis
                      domain={[0, 10]}
                      stroke="var(--line)"
                      tick={{ fill: 'var(--muted)', fontSize: 11 }}
                    />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const d = payload[0].payload;
                          return (
                            <div className="p-2.5 rounded-xl bg-surface border border-line text-xs font-mono shadow-md">
                              <p className="font-semibold text-fg">{d.sleep_range} Sleep</p>
                              <p className="text-accent">Avg Score: {d.avg_score.toFixed(2)}</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar
                      dataKey="avg_score"
                      fill="var(--chart-teal)"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Platform Usage & Impact */}
            <Card className="p-6">
              <div className="mb-4">
                <span className="text-xs font-mono text-accent uppercase font-semibold">
                  PLATFORM COMPARISON
                </span>
                <h3 className="text-base font-bold font-display text-fg">
                  Average Daily Usage by Platform
                </h3>
              </div>
              <div className="h-60 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={insights.platform_usage}
                    layout="vertical"
                    margin={{ top: 5, right: 15, left: 20, bottom: 0 }}
                  >
                    <XAxis
                      type="number"
                      stroke="var(--line)"
                      tick={{ fill: 'var(--muted)', fontSize: 11 }}
                    />
                    <YAxis
                      dataKey="platform"
                      type="category"
                      stroke="var(--line)"
                      tick={{ fill: 'var(--fg)', fontSize: 11 }}
                      width={80}
                    />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const d = payload[0].payload;
                          return (
                            <div className="p-2.5 rounded-xl bg-surface border border-line text-xs font-mono shadow-md">
                              <p className="font-semibold text-fg">{d.platform}</p>
                              <p className="text-accent">Avg Usage: {d.avg_usage.toFixed(1)}h/day</p>
                              <p className="text-muted">Avg Score: {d.avg_score.toFixed(2)}</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar
                      dataKey="avg_usage"
                      fill="var(--accent)"
                      radius={[0, 4, 4, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Correlation Matrix Heatmap */}
            <Card className="p-6 flex flex-col justify-between">
              <div className="mb-4">
                <span className="text-xs font-mono text-accent uppercase font-semibold">
                  COVARIANCE MATRIX
                </span>
                <h3 className="text-base font-bold font-display text-fg">
                  Pearson Feature Correlations
                </h3>
              </div>

              <div className="overflow-x-auto no-scrollbar">
                <table className="w-full text-xs font-mono">
                  <thead>
                    <tr>
                      <th className="p-1.5 text-left text-muted font-normal"></th>
                      {corrVariables.map((v) => (
                        <th key={v.key} className="p-1.5 text-center text-muted font-normal text-[11px]">
                          {v.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {corrVariables.map((row) => (
                      <tr key={row.key} className="border-t border-line/50">
                        <td className="p-1.5 text-left text-fg font-medium text-[11px] whitespace-nowrap">
                          {row.label}
                        </td>
                        {corrVariables.map((col) => {
                          const val = insights.correlation_matrix?.[row.key]?.[col.key] ?? 0;
                          const isHigh = Math.abs(val) > 0.4;
                          return (
                            <td
                              key={col.key}
                              className={`p-1.5 text-center text-[11px] rounded-sm ${
                                val === 1
                                  ? 'bg-surface-2 text-muted'
                                  : val > 0.2
                                  ? 'text-chart-teal font-semibold'
                                  : val < -0.2
                                  ? 'text-accent font-semibold'
                                  : 'text-muted'
                              }`}
                            >
                              {val.toFixed(2)}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex items-center justify-between text-[11px] font-mono text-muted pt-3 border-t border-line mt-4">
                <span>Positive: +1.00</span>
                <span>Zero: 0.00</span>
                <span>Negative: -1.00</span>
              </div>
            </Card>
          </div>
        </div>
      ) : null}

      {/* Mobile Filters Drawer */}
      <AnimatePresence>
        {mobileFilterOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden md:hidden">
            <div
              className="absolute inset-0 bg-bg/80 backdrop-blur-sm"
              onClick={() => setMobileFilterOpen(false)}
            />
            <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
              <div className="w-screen max-w-xs bg-surface border-l border-line p-6 flex flex-col justify-between">
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-line pb-4">
                    <h3 className="font-display font-bold text-base text-fg">Cohort Filters</h3>
                    <button
                      onClick={() => setMobileFilterOpen(false)}
                      className="p-1 rounded-lg text-muted hover:text-fg"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-muted uppercase">Gender</label>
                      <select
                        value={genderFilter}
                        onChange={(e) => setGenderFilter(e.target.value)}
                        className="w-full bg-surface-2 border border-line rounded-xl p-2.5 text-xs text-fg"
                      >
                        <option value="All">All Genders</option>
                        {options?.genders?.map((g) => (
                          <option key={g} value={g}>{g}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-muted uppercase">Academic Level</label>
                      <select
                        value={academicFilter}
                        onChange={(e) => setAcademicFilter(e.target.value)}
                        className="w-full bg-surface-2 border border-line rounded-xl p-2.5 text-xs text-fg"
                      >
                        <option value="All">All Levels</option>
                        {options?.academic_levels?.map((a) => (
                          <option key={a} value={a}>{a}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-muted uppercase">Country</label>
                      <select
                        value={countryFilter}
                        onChange={(e) => setCountryFilter(e.target.value)}
                        className="w-full bg-surface-2 border border-line rounded-xl p-2.5 text-xs text-fg"
                      >
                        <option value="All">All Countries</option>
                        {(options?.top_10_countries || options?.countries)?.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-line flex gap-2">
                  <Button variant="ghost" size="sm" onClick={resetFilters} fullWidth>
                    Reset
                  </Button>
                  <Button variant="primary" size="sm" onClick={() => setMobileFilterOpen(false)} fullWidth>
                    Apply
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
