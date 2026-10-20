from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class PredictRequest(BaseModel):
    Age: int = Field(..., ge=10, le=100, description="Age of the student")
    Gender: str = Field(..., description="Gender (e.g. Female, Male, Non-binary)")
    Country: str = Field(..., description="Country of residence")
    Academic_Level: str = Field(..., description="Academic level (e.g. Undergraduate, High School, Graduate)")
    Most_Used_Platform: str = Field(..., description="Primary social platform used")
    Purpose_Of_Use: str = Field(..., description="Main purpose of using social media")
    Avg_Daily_Usage_Hours: float = Field(..., ge=0.0, le=24.0, description="Average daily screen time in hours")
    Daily_Unlocks: int = Field(..., ge=0, le=500, description="Phone unlock count per day")
    Study_Hours: float = Field(..., ge=0.0, le=24.0, description="Study hours per day")
    Physical_Activity_Hours: float = Field(..., ge=0.0, le=24.0, description="Daily physical activity in hours")
    Sleep_Hours_Per_Night: float = Field(..., ge=0.0, le=24.0, description="Sleep duration in hours per night")
    Stress_Level: str = Field(..., description="Subjective stress level (Low, Medium, High, Very High)")

class FactorImpact(BaseModel):
    factor: str
    impact: str # 'positive' | 'negative' | 'neutral'
    weight: float
    description: str

class SuggestionItem(BaseModel):
    title: str
    description: str
    category: str # 'sleep' | 'screen_time' | 'activity' | 'stress' | 'routine'
    icon: str

class PredictResponse(BaseModel):
    score: float
    band: str # 'Needs Attention' | 'Moderate' | 'Good' | 'Thriving'
    band_color: str
    band_description: str
    percentile: float
    confidence_note: str
    top_factors: List[FactorImpact]
    suggestions: List[SuggestionItem]
    disclaimer: str

class NumericRange(BaseModel):
    min: float
    max: float
    mean: float
    median: float
    step: float
    default: float

class DatasetOptionsResponse(BaseModel):
    genders: List[str]
    countries: List[str]
    top_10_countries: List[str]
    academic_levels: List[str]
    platforms: List[str]
    purposes: List[str]
    stress_levels: List[str]
    numeric_ranges: Dict[str, NumericRange]
    score_bounds: Dict[str, float]

class WhatIfRequest(BaseModel):
    baseline: PredictRequest
    Avg_Daily_Usage_Hours: Optional[float] = None
    Sleep_Hours_Per_Night: Optional[float] = None
    Physical_Activity_Hours: Optional[float] = None
    Stress_Level: Optional[str] = None

class WhatIfFactorChange(BaseModel):
    factor: str
    old_value: Any
    new_value: Any
    direction: str # 'improved' | 'worsened' | 'same'

class WhatIfResponse(BaseModel):
    baseline_score: float
    predicted_score: float
    delta: float
    baseline_band: str
    predicted_band: str
    changes: List[WhatIfFactorChange]
    note: str

class InsightsResponse(BaseModel):
    score_distribution: List[Dict[str, Any]]
    usage_vs_score: List[Dict[str, Any]]
    score_by_stress: List[Dict[str, Any]]
    sleep_vs_score: List[Dict[str, Any]]
    platform_usage: List[Dict[str, Any]]
    correlation_matrix: Dict[str, Dict[str, float]]
    key_stats: Dict[str, Any]
