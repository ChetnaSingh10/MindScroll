import os
from contextlib import asynccontextmanager
from typing import Optional, Dict, Any
from fastapi import FastAPI, HTTPException, Query, status, APIRouter
from fastapi.middleware.cors import CORSMiddleware

from .schemas import (
    PredictRequest, PredictResponse,
    DatasetOptionsResponse, InsightsResponse,
    WhatIfRequest, WhatIfResponse
)
from .data_service import DataService
from .model import ModelService

# Paths from environment or local fallbacks
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CSV_PATH = os.getenv("CSV_PATH", os.path.join(BASE_DIR, "Student Social Media And Mental Health Impact.csv"))
if not os.path.exists(CSV_PATH):
    # Try parent directory fallback
    CSV_PATH = os.path.join(os.path.dirname(BASE_DIR), "Student Social Media And Mental Health Impact.csv")

MODEL_PATH = os.getenv("MODEL_PATH", os.path.join(BASE_DIR, "Mental_Health_Model.pkl"))
if not os.path.exists(MODEL_PATH):
    MODEL_PATH = os.path.join(os.path.dirname(BASE_DIR), "Mental_Health_Model.pkl")

EVAL_PATH = os.getenv("EVAL_PATH", os.path.join(BASE_DIR, "model_evaluation.json"))
if not os.path.exists(EVAL_PATH):
    EVAL_PATH = os.path.join(os.path.dirname(BASE_DIR), "model_evaluation.json")

data_service: Optional[DataService] = None
model_service: Optional[ModelService] = None
startup_error: Optional[str] = None

def init_services():
    global data_service, model_service, startup_error
    if data_service is not None and model_service is not None:
        return
    try:
        print(f"Initializing DataService from CSV: {CSV_PATH}")
        data_service = DataService(CSV_PATH)

        print(f"Initializing ModelService from model: {MODEL_PATH}")
        model_service = ModelService(
            model_path=MODEL_PATH,
            evaluation_path=EVAL_PATH,
            data_service=data_service
        )
        print("MindScroll Backend initialized successfully!")
    except Exception as e:
        startup_error = str(e)
        print(f"CRITICAL ERROR during startup: {e}")

# Initialize eagerly
init_services()

@asynccontextmanager
async def lifespan(app: FastAPI):
    init_services()
    yield

app = FastAPI(
    title="MindScroll AI API",
    description="Student Social Media & Mental Health Impact Predictor API",
    version="1.0.0",
    lifespan=lifespan
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def check_ready():
    if startup_error:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"Service initialization error: {startup_error}"
        )
    if not model_service or not data_service:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Model or Data Service is not ready."
        )

router = APIRouter()

@router.get("/")
def root():
    return {
        "app": "MindScroll AI API",
        "status": "online" if not startup_error else "degraded",
        "version": "1.0.0",
        "docs_url": "/docs"
    }

@router.get("/health")
def health_check():
    if startup_error:
        return {"status": "unhealthy", "error": startup_error}
    return {
        "status": "healthy",
        "model_loaded": model_service is not None and model_service.model is not None,
        "dataset_loaded": data_service is not None
    }

@router.get("/options", response_model=DatasetOptionsResponse)
def get_options():
    check_ready()
    try:
        return data_service.get_options()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed fetching dataset options: {str(e)}")

@router.post("/predict", response_model=PredictResponse)
def predict(request: PredictRequest):
    check_ready()
    try:
        return model_service.predict(request)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Inference error: {str(e)}")

@router.post("/whatif", response_model=WhatIfResponse)
def what_if_simulation(request: WhatIfRequest):
    check_ready()
    try:
        return model_service.what_if(request)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Simulation error: {str(e)}")

@router.get("/insights", response_model=InsightsResponse)
def get_insights(
    gender: Optional[str] = Query(None, description="Gender filter"),
    academic_level: Optional[str] = Query(None, description="Academic level filter"),
    country: Optional[str] = Query(None, description="Country filter")
):
    check_ready()
    try:
        return data_service.get_insights(
            gender=gender,
            academic_level=academic_level,
            country=country
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed compiling dataset insights: {str(e)}")

@router.get("/model-card")
def get_model_card() -> Dict[str, Any]:
    check_ready()
    if model_service and model_service.evaluation_meta:
        return model_service.evaluation_meta
    return {
        "status": "evaluation_metadata_not_found",
        "comparison": [],
        "best_model": "Random Forest Regressor"
    }

# Mount routes at root and with /api prefix for Vercel rewrites and reverse proxies
app.include_router(router)
app.include_router(router, prefix="/api")
