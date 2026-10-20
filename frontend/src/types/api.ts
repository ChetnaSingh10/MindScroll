export interface PredictRequest {
  Age: number;
  Gender: string;
  Country: string;
  Academic_Level: string;
  Most_Used_Platform: string;
  Purpose_Of_Use: string;
  Avg_Daily_Usage_Hours: number;
  Daily_Unlocks: number;
  Study_Hours: number;
  Physical_Activity_Hours: number;
  Sleep_Hours_Per_Night: number;
  Stress_Level: string;
}

export interface FactorImpact {
  factor: string;
  impact: 'positive' | 'negative' | 'neutral';
  weight: number;
  description: string;
}

export interface SuggestionItem {
  title: string;
  description: string;
  category: 'sleep' | 'screen_time' | 'activity' | 'stress' | 'routine';
  icon: string;
}

export interface PredictResponse {
  score: number;
  band: 'Needs Attention' | 'Moderate' | 'Good' | 'Thriving';
  band_color: string;
  band_description: string;
  percentile: number;
  confidence_note: string;
  top_factors: FactorImpact[];
  suggestions: SuggestionItem[];
  disclaimer: string;
}

export interface NumericRange {
  min: number;
  max: number;
  mean: number;
  median: number;
  step: number;
  default: number;
}

export interface DatasetOptionsResponse {
  genders: string[];
  countries: string[];
  top_10_countries: string[];
  academic_levels: string[];
  platforms: string[];
  purposes: string[];
  stress_levels: string[];
  numeric_ranges: Record<string, NumericRange>;
  score_bounds: {
    min: number;
    max: number;
    mean: number;
    median: number;
  };
}

export interface WhatIfRequest {
  baseline: PredictRequest;
  Avg_Daily_Usage_Hours?: number;
  Sleep_Hours_Per_Night?: number;
  Physical_Activity_Hours?: number;
  Stress_Level?: string;
}

export interface WhatIfFactorChange {
  factor: string;
  old_value: any;
  new_value: any;
  direction: 'improved' | 'worsened' | 'same';
}

export interface WhatIfResponse {
  baseline_score: number;
  predicted_score: number;
  delta: number;
  baseline_band: string;
  predicted_band: string;
  changes: WhatIfFactorChange[];
  note: string;
}

export interface InsightsResponse {
  score_distribution: Array<{
    bin: string;
    count: number;
    range_start: number;
    range_end: number;
    pct: number;
  }>;
  usage_vs_score: Array<{
    usage: number;
    score: number;
    platform: string;
    stress: string;
    sleep: number;
  }>;
  score_by_stress: Array<{
    stress_level: string;
    avg_score: number;
    median: number;
    min: number;
    max: number;
    q25: number;
    q75: number;
    count: number;
    avg_usage: number;
  }>;
  sleep_vs_score: Array<{
    sleep_range: string;
    avg_score: number;
    student_count: number;
    avg_usage: number;
  }>;
  platform_usage: Array<{
    platform: string;
    count: number;
    avg_score: number;
    avg_usage: number;
  }>;
  correlation_matrix: Record<string, Record<string, number>>;
  key_stats: {
    total_students: number;
    avg_score: number;
    avg_daily_usage: number;
    avg_sleep: number;
    avg_unlocks: number;
    avg_physical_activity: number;
  };
}

export interface ModelComparisonItem {
  model: string;
  r2: number;
  train_r2: number;
  mae: number;
  rmse: number;
}

export interface ModelCardData {
  comparison: ModelComparisonItem[];
  best_model: string;
  best_params: Record<string, any>;
  top_feature_importances: Array<{
    feature: string;
    importance: number;
  }>;
  dataset_size: number;
  features_count: number;
  features_list: string[];
  score_stats: {
    min: number;
    max: number;
    mean: number;
    std: number;
  };
  top_10_countries: string[];
}
