import os
import pandas as pd
import numpy as np
from typing import Dict, Any, List, Optional
from .schemas import DatasetOptionsResponse, NumericRange, InsightsResponse

class DataService:
    def __init__(self, csv_path: str):
        self.csv_path = csv_path
        self._load_data()

    def _load_data(self):
        if not os.path.exists(self.csv_path):
            raise FileNotFoundError(f"Dataset CSV not found at {self.csv_path}")
        
        self.df = pd.read_csv(self.csv_path)
        self.df = self.df.drop_duplicates()
        self.df['Physical_Activity_Hours'] = self.df['Physical_Activity_Hours'].clip(lower=0)
        self.df['Study_Hours'] = self.df['Study_Hours'].clip(lower=0)

        # Top 10 countries
        country_counts = self.df['Country'].value_counts()
        self.top_10_countries = country_counts.index[:10].tolist()
        
        self.df['Grouped_country'] = self.df['Country'].apply(
            lambda c: c if c in self.top_10_countries else 'Other'
        )

        # Extract real categories
        self.genders = sorted(self.df['Gender'].dropna().unique().tolist())
        self.all_countries = sorted(self.df['Country'].dropna().unique().tolist())
        self.academic_levels = sorted(self.df['Academic_Level'].dropna().unique().tolist())
        self.platforms = sorted(self.df['Most_Used_Platform'].dropna().unique().tolist())
        self.purposes = sorted(self.df['Purpose_Of_Use'].dropna().unique().tolist())
        self.stress_levels = ['Low', 'Medium', 'High', 'Very High']

        # Numeric specs
        self.numeric_ranges = {
            "Age": NumericRange(
                min=float(self.df['Age'].min()),
                max=float(self.df['Age'].max()),
                mean=round(float(self.df['Age'].mean()), 1),
                median=float(self.df['Age'].median()),
                step=1.0,
                default=float(self.df['Age'].median())
            ),
            "Avg_Daily_Usage_Hours": NumericRange(
                min=float(self.df['Avg_Daily_Usage_Hours'].min()),
                max=float(self.df['Avg_Daily_Usage_Hours'].max()),
                mean=round(float(self.df['Avg_Daily_Usage_Hours'].mean()), 1),
                median=float(self.df['Avg_Daily_Usage_Hours'].median()),
                step=0.1,
                default=float(self.df['Avg_Daily_Usage_Hours'].median())
            ),
            "Daily_Unlocks": NumericRange(
                min=float(self.df['Daily_Unlocks'].min()),
                max=float(self.df['Daily_Unlocks'].max()),
                mean=round(float(self.df['Daily_Unlocks'].mean()), 0),
                median=float(self.df['Daily_Unlocks'].median()),
                step=1.0,
                default=float(self.df['Daily_Unlocks'].median())
            ),
            "Physical_Activity_Hours": NumericRange(
                min=float(self.df['Physical_Activity_Hours'].min()),
                max=float(self.df['Physical_Activity_Hours'].max()),
                mean=round(float(self.df['Physical_Activity_Hours'].mean()), 1),
                median=float(self.df['Physical_Activity_Hours'].median()),
                step=0.25,
                default=float(self.df['Physical_Activity_Hours'].median())
            ),
            "Sleep_Hours_Per_Night": NumericRange(
                min=float(self.df['Sleep_Hours_Per_Night'].min()),
                max=float(self.df['Sleep_Hours_Per_Night'].max()),
                mean=round(float(self.df['Sleep_Hours_Per_Night'].mean()), 1),
                median=float(self.df['Sleep_Hours_Per_Night'].median()),
                step=0.25,
                default=float(self.df['Sleep_Hours_Per_Night'].median())
            ),
            "Study_Hours": NumericRange(
                min=float(self.df['Study_Hours'].min()),
                max=float(self.df['Study_Hours'].max()),
                mean=round(float(self.df['Study_Hours'].mean()), 1),
                median=float(self.df['Study_Hours'].median()),
                step=0.5,
                default=float(self.df['Study_Hours'].median())
            ),
        }

        self.score_bounds = {
            "min": float(self.df['Mental_Health_Score'].min()),
            "max": float(self.df['Mental_Health_Score'].max()),
            "mean": round(float(self.df['Mental_Health_Score'].mean()), 2),
            "median": round(float(self.df['Mental_Health_Score'].median()), 2),
        }

    def get_options(self) -> DatasetOptionsResponse:
        return DatasetOptionsResponse(
            genders=self.genders,
            countries=self.all_countries,
            top_10_countries=self.top_10_countries,
            academic_levels=self.academic_levels,
            platforms=self.platforms,
            purposes=self.purposes,
            stress_levels=self.stress_levels,
            numeric_ranges=self.numeric_ranges,
            score_bounds=self.score_bounds
        )

    def get_insights(
        self,
        gender: Optional[str] = None,
        academic_level: Optional[str] = None,
        country: Optional[str] = None
    ) -> InsightsResponse:
        filtered = self.df.copy()
        if gender and gender != 'All':
            filtered = filtered[filtered['Gender'] == gender]
        if academic_level and academic_level != 'All':
            filtered = filtered[filtered['Academic_Level'] == academic_level]
        if country and country != 'All':
            filtered = filtered[filtered['Country'] == country]

        if len(filtered) == 0:
            filtered = self.df.copy()

        # 1. Score Distribution Histogram (12 bins)
        score_min, score_max = 3.5, 9.5
        bin_edges = np.linspace(score_min, score_max, 13)
        counts, _ = np.histogram(filtered['Mental_Health_Score'], bins=bin_edges)
        score_dist = []
        for i in range(len(counts)):
            b_start = round(float(bin_edges[i]), 1)
            b_end = round(float(bin_edges[i+1]), 1)
            score_dist.append({
                "bin": f"{b_start}-{b_end}",
                "count": int(counts[i]),
                "range_start": b_start,
                "range_end": b_end,
                "pct": round(float(counts[i] / len(filtered) * 100), 1)
            })

        # 2. Usage vs Score Scatter (Sample 200 for lightning performance)
        sample_size = min(200, len(filtered))
        sample_df = filtered.sample(n=sample_size, random_state=42) if len(filtered) > sample_size else filtered
        usage_vs_score = [
            {
                "usage": round(float(row['Avg_Daily_Usage_Hours']), 1),
                "score": round(float(row['Mental_Health_Score']), 2),
                "platform": str(row['Most_Used_Platform']),
                "stress": str(row['Stress_Level']),
                "sleep": round(float(row['Sleep_Hours_Per_Night']), 1)
            }
            for _, row in sample_df.iterrows()
        ]

        # 3. Score by Stress Level (Low, Medium, High, Very High)
        score_by_stress = []
        for s in ['Low', 'Medium', 'High', 'Very High']:
            sub = filtered[filtered['Stress_Level'] == s]
            if len(sub) > 0:
                score_by_stress.append({
                    "stress_level": s,
                    "avg_score": round(float(sub['Mental_Health_Score'].mean()), 2),
                    "median": round(float(sub['Mental_Health_Score'].median()), 2),
                    "min": round(float(sub['Mental_Health_Score'].min()), 2),
                    "max": round(float(sub['Mental_Health_Score'].max()), 2),
                    "q25": round(float(sub['Mental_Health_Score'].quantile(0.25)), 2),
                    "q75": round(float(sub['Mental_Health_Score'].quantile(0.75)), 2),
                    "count": int(len(sub)),
                    "avg_usage": round(float(sub['Avg_Daily_Usage_Hours'].mean()), 1)
                })

        # 4. Sleep vs Score
        sleep_bins = [
            ("< 5 hrs", filtered[filtered['Sleep_Hours_Per_Night'] < 5.0]),
            ("5 - 6 hrs", filtered[(filtered['Sleep_Hours_Per_Night'] >= 5.0) & (filtered['Sleep_Hours_Per_Night'] < 6.0)]),
            ("6 - 7 hrs", filtered[(filtered['Sleep_Hours_Per_Night'] >= 6.0) & (filtered['Sleep_Hours_Per_Night'] < 7.0)]),
            ("7 - 8 hrs", filtered[(filtered['Sleep_Hours_Per_Night'] >= 7.0) & (filtered['Sleep_Hours_Per_Night'] < 8.0)]),
            ("8+ hrs", filtered[filtered['Sleep_Hours_Per_Night'] >= 8.0]),
        ]
        sleep_vs_score = []
        for label, sub in sleep_bins:
            if len(sub) > 0:
                sleep_vs_score.append({
                    "sleep_range": label,
                    "avg_score": round(float(sub['Mental_Health_Score'].mean()), 2),
                    "student_count": int(len(sub)),
                    "avg_usage": round(float(sub['Avg_Daily_Usage_Hours'].mean()), 1)
                })

        # 5. Platform Usage counts & avg score
        plat_counts = filtered['Most_Used_Platform'].value_counts()
        platform_usage = []
        for plat, count in plat_counts.items():
            sub = filtered[filtered['Most_Used_Platform'] == plat]
            platform_usage.append({
                "platform": str(plat),
                "count": int(count),
                "avg_score": round(float(sub['Mental_Health_Score'].mean()), 2),
                "avg_usage": round(float(sub['Avg_Daily_Usage_Hours'].mean()), 1)
            })

        # 6. Correlation Matrix
        num_cols = [
            'Avg_Daily_Usage_Hours',
            'Sleep_Hours_Per_Night',
            'Physical_Activity_Hours',
            'Daily_Unlocks',
            'Study_Hours',
            'Mental_Health_Score'
        ]
        corr_df = filtered[num_cols].corr()
        corr_matrix = {}
        for col1 in num_cols:
            corr_matrix[col1] = {}
            for col2 in num_cols:
                corr_matrix[col1][col2] = round(float(corr_df.loc[col1, col2]), 3)

        # 7. Key Stats
        key_stats = {
            "total_students": int(len(filtered)),
            "avg_score": round(float(filtered['Mental_Health_Score'].mean()), 2),
            "avg_daily_usage": round(float(filtered['Avg_Daily_Usage_Hours'].mean()), 1),
            "avg_sleep": round(float(filtered['Sleep_Hours_Per_Night'].mean()), 1),
            "avg_unlocks": round(float(filtered['Daily_Unlocks'].mean()), 0),
            "avg_physical_activity": round(float(filtered['Physical_Activity_Hours'].mean()), 1)
        }

        return InsightsResponse(
            score_distribution=score_dist,
            usage_vs_score=usage_vs_score,
            score_by_stress=score_by_stress,
            sleep_vs_score=sleep_vs_score,
            platform_usage=platform_usage,
            correlation_matrix=corr_matrix,
            key_stats=key_stats
        )
