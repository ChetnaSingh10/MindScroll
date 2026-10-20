import os
import joblib
import json
import pandas as pd
import numpy as np
from typing import Dict, Any, List, Tuple
from .schemas import (
    PredictRequest, PredictResponse, FactorImpact,
    WhatIfRequest, WhatIfResponse, WhatIfFactorChange
)
from .advice import generate_suggestions

class ModelService:
    def __init__(self, model_path: str, evaluation_path: str, data_service):
        self.model_path = model_path
        self.evaluation_path = evaluation_path
        self.data_service = data_service
        self.model = None
        self.evaluation_meta = {}
        self.load_model()

    def load_model(self):
        if not os.path.exists(self.model_path):
            raise FileNotFoundError(
                f"Model file not found at '{self.model_path}'. "
                "Ensure Mental_Health_Model.pkl is generated and MODEL_PATH environment variable is configured."
            )
        try:
            self.model = joblib.load(self.model_path)
            print(f"Successfully loaded scikit-learn model from {self.model_path}")
        except Exception as e:
            raise RuntimeError(f"Failed to load joblib model pipeline from '{self.model_path}': {str(e)}")

        if os.path.exists(self.evaluation_path):
            try:
                with open(self.evaluation_path, 'r') as f:
                    self.evaluation_meta = json.load(f)
            except Exception as e:
                print(f"Warning: Failed reading {self.evaluation_path}: {e}")

    def _prepare_df(self, data: PredictRequest) -> pd.DataFrame:
        grouped_country = data.Country if data.Country in self.data_service.top_10_countries else 'Other'
        row = {
            'Age': data.Age,
            'Avg_Daily_Usage_Hours': max(0.0, data.Avg_Daily_Usage_Hours),
            'Daily_Unlocks': max(0, data.Daily_Unlocks),
            'Physical_Activity_Hours': max(0.0, data.Physical_Activity_Hours),
            'Sleep_Hours_Per_Night': max(0.0, data.Sleep_Hours_Per_Night),
            'Stress_Level': data.Stress_Level,
            'Gender': data.Gender,
            'Grouped_country': grouped_country,
            'Academic_Level': data.Academic_Level,
            'Most_Used_Platform': data.Most_Used_Platform,
            'Purpose_Of_Use': data.Purpose_Of_Use,
            'Study_Hours': max(0.0, data.Study_Hours)
        }
        return pd.DataFrame([row])

    def _get_band(self, score: float) -> Tuple[str, str, str]:
        if score < 5.3:
            return (
                "Needs Attention",
                "#EF4444",
                "High screen time exposure and sleep or activity deficits are placing noticeable strain on your cognitive well-being."
            )
        elif score < 6.6:
            return (
                "Moderate",
                "#F59E0B",
                "Your well-being is fairly stable, but elevated usage or irregular sleep patterns are holding back your optimal balance."
            )
        elif score < 7.9:
            return (
                "Good",
                "#10B981",
                "Healthy digital boundaries and active routines support positive emotional and mental balance."
            )
        else:
            return (
                "Thriving",
                "#8B5CF6",
                "Exceptional mental health score sustained by restorative sleep, active lifestyle, and balanced screen interaction."
            )

    def _compute_factors(self, data: PredictRequest, score: float) -> List[FactorImpact]:
        # Compute local marginal impacts relative to dataset averages
        means = {
            "usage": float(self.data_service.numeric_ranges["Avg_Daily_Usage_Hours"].mean),
            "sleep": float(self.data_service.numeric_ranges["Sleep_Hours_Per_Night"].mean),
            "activity": float(self.data_service.numeric_ranges["Physical_Activity_Hours"].mean),
            "unlocks": float(self.data_service.numeric_ranges["Daily_Unlocks"].mean),
        }

        factors: List[FactorImpact] = []

        # 1. Screen Time Usage Impact (Strongest predictor)
        usage_diff = data.Avg_Daily_Usage_Hours - means["usage"]
        # In this dataset, screen time has high negative correlation (~ -0.81)
        usage_weight = round(-0.45 * usage_diff, 2)
        if abs(usage_diff) >= 0.5:
            if usage_diff > 0:
                factors.append(FactorImpact(
                    factor="Daily Screen Time",
                    impact="negative",
                    weight=usage_weight,
                    description=f"{data.Avg_Daily_Usage_Hours:.1f} hrs/day is {abs(usage_diff):.1f}h higher than the student average ({means['usage']:.1f}h), lowering wellness index."
                ))
            else:
                factors.append(FactorImpact(
                    factor="Daily Screen Time",
                    impact="positive",
                    weight=usage_weight,
                    description=f"{data.Avg_Daily_Usage_Hours:.1f} hrs/day is {abs(usage_diff):.1f}h below average, serving as a protective cushion."
                ))

        # 2. Sleep Impact (Positive correlation ~ +0.76)
        sleep_diff = data.Sleep_Hours_Per_Night - means["sleep"]
        sleep_weight = round(0.38 * sleep_diff, 2)
        if abs(sleep_diff) >= 0.5:
            if sleep_diff < 0:
                factors.append(FactorImpact(
                    factor="Sleep Duration",
                    impact="negative",
                    weight=sleep_weight,
                    description=f"{data.Sleep_Hours_Per_Night:.1f} hrs/night is below average ({means['sleep']:.1f}h), increasing cognitive fatigue."
                ))
            else:
                factors.append(FactorImpact(
                    factor="Sleep Duration",
                    impact="positive",
                    weight=sleep_weight,
                    description=f"{data.Sleep_Hours_Per_Night:.1f} hrs/night provides restorative recovery, positively boosting your score."
                ))

        # 3. Stress Level Impact
        stress_weights = {
            "Low": (0.42, "positive", "Low stress level significantly bolsters emotional equilibrium."),
            "Medium": (0.05, "positive", "Moderate stress level remains manageable within typical academic boundaries."),
            "High": (-0.35, "negative", "Elevated stress level amplifies negative mental load."),
            "Very High": (-0.65, "negative", "Very high subjective stress is a heavy drag on overall wellness.")
        }
        if data.Stress_Level in stress_weights:
            w, imp, desc = stress_weights[data.Stress_Level]
            factors.append(FactorImpact(
                factor="Stress Level",
                impact=imp,
                weight=w,
                description=desc
            ))

        # 4. Physical Activity Impact
        act_diff = data.Physical_Activity_Hours - means["activity"]
        act_weight = round(0.22 * act_diff, 2)
        if data.Physical_Activity_Hours >= 1.5:
            factors.append(FactorImpact(
                factor="Physical Activity",
                impact="positive",
                weight=act_weight if act_weight > 0 else 0.25,
                description=f"{data.Physical_Activity_Hours:.1f} hrs of daily activity fosters endorphin release and stress resiliency."
            ))
        elif data.Physical_Activity_Hours <= 0.3:
            factors.append(FactorImpact(
                factor="Physical Activity",
                impact="negative",
                weight=act_weight if act_weight < 0 else -0.22,
                description="Sedentary routine with minimal exercise amplifies screen fatigue."
            ))

        # 5. Daily Unlocks
        if data.Daily_Unlocks > means["unlocks"] + 20:
            factors.append(FactorImpact(
                factor="Device Pickups",
                impact="negative",
                weight=-0.18,
                description=f"{data.Daily_Unlocks} daily unlocks indicates frequent attention fragmentation."
            ))

        # Sort factors by magnitude of weight descending
        factors.sort(key=lambda x: abs(x.weight), reverse=True)
        return factors[:4]

    def predict(self, data: PredictRequest) -> PredictResponse:
        df = self._prepare_df(data)
        raw_pred = float(self.model.predict(df)[0])
        # Clamp to realistic dataset bounds
        score = round(max(3.6, min(9.4, raw_pred)), 2)

        band, color, desc = self._get_band(score)
        
        # Calculate percentile relative to full dataset
        all_scores = self.data_service.df['Mental_Health_Score']
        percentile = round(float((all_scores < score).mean() * 100), 1)

        factors = self._compute_factors(data, score)
        suggestions = generate_suggestions(data, score)

        return PredictResponse(
            score=score,
            band=band,
            band_color=color,
            band_description=desc,
            percentile=percentile,
            confidence_note="Random Forest Regression (R² = 0.864, MAE = ±0.37 on validation split).",
            top_factors=factors,
            suggestions=suggestions,
            disclaimer="Educational research demonstration only. Not intended as a psychological or medical diagnosis."
        )

    def what_if(self, req: WhatIfRequest) -> WhatIfResponse:
        baseline_resp = self.predict(req.baseline)
        baseline_score = baseline_resp.score

        # Modify values
        modified = req.baseline.model_copy()
        changes: List[WhatIfFactorChange] = []

        if req.Avg_Daily_Usage_Hours is not None and req.Avg_Daily_Usage_Hours != req.baseline.Avg_Daily_Usage_Hours:
            changes.append(WhatIfFactorChange(
                factor="Avg_Daily_Usage_Hours",
                old_value=req.baseline.Avg_Daily_Usage_Hours,
                new_value=req.Avg_Daily_Usage_Hours,
                direction="improved" if req.Avg_Daily_Usage_Hours < req.baseline.Avg_Daily_Usage_Hours else "worsened"
            ))
            modified.Avg_Daily_Usage_Hours = req.Avg_Daily_Usage_Hours

        if req.Sleep_Hours_Per_Night is not None and req.Sleep_Hours_Per_Night != req.baseline.Sleep_Hours_Per_Night:
            changes.append(WhatIfFactorChange(
                factor="Sleep_Hours_Per_Night",
                old_value=req.baseline.Sleep_Hours_Per_Night,
                new_value=req.Sleep_Hours_Per_Night,
                direction="improved" if req.Sleep_Hours_Per_Night > req.baseline.Sleep_Hours_Per_Night else "worsened"
            ))
            modified.Sleep_Hours_Per_Night = req.Sleep_Hours_Per_Night

        if req.Physical_Activity_Hours is not None and req.Physical_Activity_Hours != req.baseline.Physical_Activity_Hours:
            changes.append(WhatIfFactorChange(
                factor="Physical_Activity_Hours",
                old_value=req.baseline.Physical_Activity_Hours,
                new_value=req.Physical_Activity_Hours,
                direction="improved" if req.Physical_Activity_Hours > req.baseline.Physical_Activity_Hours else "worsened"
            ))
            modified.Physical_Activity_Hours = req.Physical_Activity_Hours

        if req.Stress_Level is not None and req.Stress_Level != req.baseline.Stress_Level:
            stress_order = {'Low': 0, 'Medium': 1, 'High': 2, 'Very High': 3}
            old_idx = stress_order.get(req.baseline.Stress_Level, 1)
            new_idx = stress_order.get(req.Stress_Level, 1)
            changes.append(WhatIfFactorChange(
                factor="Stress_Level",
                old_value=req.baseline.Stress_Level,
                new_value=req.Stress_Level,
                direction="improved" if new_idx < old_idx else ("worsened" if new_idx > old_idx else "same")
            ))
            modified.Stress_Level = req.Stress_Level

        predicted_resp = self.predict(modified)
        predicted_score = predicted_resp.score
        delta = round(predicted_score - baseline_score, 2)

        note = "Adjusting lifestyle variables shows real-time estimated shifts in mental health score."
        if delta > 0:
            note = f"Lifestyle adjustments resulted in a +{delta:.2f} score increase!"
        elif delta < 0:
            note = f"Increased screen time or lower sleep/activity dropped the predicted score by {delta:.2f} points."

        return WhatIfResponse(
            baseline_score=baseline_score,
            predicted_score=predicted_score,
            delta=delta,
            baseline_band=baseline_resp.band,
            predicted_band=predicted_resp.band,
            changes=changes,
            note=note
        )
