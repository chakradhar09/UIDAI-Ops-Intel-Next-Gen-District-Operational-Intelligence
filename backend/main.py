"""
🏛️ UIDAI Ops-Intel Dashboard - FastAPI Backend
Exposes REST API for the Next.js frontend.

Developed for UIDAI Data Hackathon 2026
"""
import sys
from pathlib import Path
from typing import List, Optional
from datetime import datetime

from fastapi import FastAPI, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
import os

# src/ is now inside backend/, so we can import directly
from src.data_loader import (
    load_enrolment_data,
    load_biometric_update_data,
    load_demographic_update_data,
    load_geojson,
    filter_by_date_range,
    filter_by_district
)
from src.analytics import WorkloadForecaster, MigrationAnalyzer, AnomalyDetector
from src.config import COLORS, TELANGANA_DISTRICTS

# ============================================================================
# PYDANTIC MODELS (API Response Schemas)
# ============================================================================

class KPIResponse(BaseModel):
    totalEnrolments: int
    predictedUpdates: int
    highMigrationDistricts: int
    criticalAnomalies: int
    avgHealthScore: float

class WorkloadSummary(BaseModel):
    total_projected_updates: int
    avg_per_district: int
    max_district: str
    max_district_load: int
    age_5_total: int
    age_15_total: int

class MigrationSummary(BaseModel):
    total_districts: int
    high_migration_count: int
    moderate_migration_count: int
    low_migration_count: int
    avg_migration_ratio: float
    max_migration_district: str
    max_migration_ratio: float
    high_migration_districts: List[str]

class AnomalySummary(BaseModel):
    total_anomalies: int
    critical_count: int
    warning_count: int
    info_count: int
    by_type: dict
    affected_districts: List[str]

class Anomaly(BaseModel):
    type: str
    district: str
    severity: str
    description: str
    recommendation: Optional[str] = None

class DistrictMigration(BaseModel):
    district: str
    total_enrolments: float
    total_demo_updates: float
    migration_ratio: float
    migration_category: str
    migration_intensity: float

class ForecastPoint(BaseModel):
    date: str
    total_enrolments: float
    is_forecast: bool

class WorkloadProjection(BaseModel):
    district: str
    age_0_5: float
    age_5_17: float
    total_enrolments: float
    projected_age_5_updates: float
    projected_age_15_updates: float
    total_projected_updates: float

class DistrictHealth(BaseModel):
    district: str
    health_score: float
    status: str

class DashboardSummary(BaseModel):
    kpis: KPIResponse
    workload: WorkloadSummary
    migration: MigrationSummary
    anomalies: AnomalySummary
    dateRange: dict
    districts: List[str]

# ============================================================================
# FASTAPI APP
# ============================================================================

app = FastAPI(
    title="UIDAI Ops-Intel API",
    description="Backend API for the UIDAI District Operational Intelligence Dashboard",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc"
)

# CORS Configuration - Allow Next.js frontend
# In production, set CORS_ORIGINS environment variable
default_origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]
cors_origins_env = os.getenv("CORS_ORIGINS", "")
if cors_origins_env:
    # Parse comma-separated origins from environment
    cors_origins = [origin.strip() for origin in cors_origins_env.split(",") if origin.strip()]
else:
    cors_origins = default_origins

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============================================================================
# DATA LOADING (Cached at startup)
# ============================================================================

# Global data cache
_data_cache = {}

def get_data():
    """Load and cache all datasets."""
    global _data_cache
    
    if not _data_cache:
        print("📊 Loading datasets...")
        _data_cache = {
            'enrolment': load_enrolment_data(),
            'biometric': load_biometric_update_data(),
            'demographic': load_demographic_update_data(),
            'geojson': load_geojson()
        }
        print("✅ Data loaded successfully!")
    
    return _data_cache

@app.on_event("startup")
async def startup_event():
    """Pre-load data on startup - but do it in background to avoid blocking."""
    import asyncio
    # Load data in background so Railway health checks don't timeout
    asyncio.create_task(asyncio.to_thread(get_data))
    print("🚀 Starting background data load...")

# ============================================================================
# HEALTH CHECK ENDPOINT
# ============================================================================

@app.get("/health", tags=["Health"])
async def health_check():
    """Health check endpoint for monitoring and deployment verification."""
    return {
        "status": "healthy",
        "service": "UIDAI Ops-Intel API",
        "version": "1.0.0"
    }

@app.get("/", tags=["Health"])
async def root():
    """Root endpoint with API information."""
    return {
        "message": "UIDAI Ops-Intel API",
        "docs": "/api/docs",
        "health": "/health"
    }

# ============================================================================
# HELPER FUNCTIONS
# ============================================================================

def apply_filters(
    enrol_df: pd.DataFrame,
    demo_df: pd.DataFrame,
    bio_df: pd.DataFrame,
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    districts: Optional[List[str]] = None
):
    """Apply date and district filters to dataframes."""
    
    if start_date:
        start_dt = pd.Timestamp(start_date)
        enrol_df = filter_by_date_range(enrol_df, start_dt, enrol_df['date'].max())
        demo_df = filter_by_date_range(demo_df, start_dt, demo_df['date'].max())
        bio_df = filter_by_date_range(bio_df, start_dt, bio_df['date'].max())
    
    if end_date:
        end_dt = pd.Timestamp(end_date)
        enrol_df = filter_by_date_range(enrol_df, enrol_df['date'].min(), end_dt)
        demo_df = filter_by_date_range(demo_df, demo_df['date'].min(), end_dt)
        bio_df = filter_by_date_range(bio_df, bio_df['date'].min(), end_dt)
    
    if districts:
        enrol_df = filter_by_district(enrol_df, districts)
        demo_df = filter_by_district(demo_df, districts)
        bio_df = filter_by_district(bio_df, districts)
    
    return enrol_df, demo_df, bio_df

# ============================================================================
# API ROUTES
# ============================================================================

@app.get("/api/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy", "service": "UIDAI Ops-Intel API"}


@app.get("/api/v1/summary", response_model=DashboardSummary)
async def get_dashboard_summary(
    start_date: Optional[str] = Query(None, description="Start date (YYYY-MM-DD)"),
    end_date: Optional[str] = Query(None, description="End date (YYYY-MM-DD)"),
    districts: Optional[str] = Query(None, description="Comma-separated district names")
):
    """
    Get complete dashboard summary including KPIs, workload, migration, and anomalies.
    This is the main endpoint for the dashboard.
    """
    data = get_data()
    
    # Parse districts
    district_list = districts.split(",") if districts else None
    
    # Apply filters
    enrol_df, demo_df, bio_df = apply_filters(
        data['enrolment'].copy(),
        data['demographic'].copy(),
        data['biometric'].copy(),
        start_date,
        end_date,
        district_list
    )
    
    # Initialize analyzers
    forecaster = WorkloadForecaster(enrol_df, bio_df)
    migration_analyzer = MigrationAnalyzer(enrol_df, demo_df)
    detector = AnomalyDetector(enrol_df, bio_df, demo_df)
    
    # Get summaries
    workload_summary = forecaster.get_workload_summary()
    migration_summary = migration_analyzer.get_migration_summary()
    anomaly_summary = detector.get_anomaly_summary()
    health_scores = detector.get_district_health_score()
    
    # Build KPIs
    kpis = KPIResponse(
        totalEnrolments=int(enrol_df['total_enrolments'].sum()),
        predictedUpdates=workload_summary['total_projected_updates'],
        highMigrationDistricts=migration_summary['high_migration_count'],
        criticalAnomalies=anomaly_summary['critical_count'],
        avgHealthScore=round(health_scores['health_score'].mean(), 1)
    )
    
    # Date range
    date_range = {
        "min": enrol_df['date'].min().strftime('%Y-%m-%d'),
        "max": enrol_df['date'].max().strftime('%Y-%m-%d')
    }
    
    return DashboardSummary(
        kpis=kpis,
        workload=WorkloadSummary(**workload_summary),
        migration=MigrationSummary(**migration_summary),
        anomalies=AnomalySummary(**anomaly_summary),
        dateRange=date_range,
        districts=sorted(enrol_df['district'].unique().tolist())
    )


@app.get("/api/v1/migration/choropleth", response_model=List[DistrictMigration])
async def get_migration_choropleth(
    start_date: Optional[str] = Query(None),
    end_date: Optional[str] = Query(None),
    districts: Optional[str] = Query(None)
):
    """Get migration intensity data for choropleth map."""
    data = get_data()
    
    district_list = districts.split(",") if districts else None
    enrol_df, demo_df, bio_df = apply_filters(
        data['enrolment'].copy(),
        data['demographic'].copy(),
        data['biometric'].copy(),
        start_date, end_date, district_list
    )
    
    analyzer = MigrationAnalyzer(enrol_df, demo_df)
    choropleth_data = analyzer.prepare_choropleth_data()
    
    return choropleth_data.to_dict(orient='records')


@app.get("/api/v1/geojson")
async def get_geojson():
    """Get Telangana districts GeoJSON for map rendering."""
    data = get_data()
    return data['geojson']


@app.get("/api/v1/workload/forecast", response_model=List[ForecastPoint])
async def get_workload_forecast(
    periods: int = Query(3, ge=1, le=12, description="Number of months to forecast"),
    start_date: Optional[str] = Query(None),
    end_date: Optional[str] = Query(None),
    districts: Optional[str] = Query(None)
):
    """Get historical data and forecast for workload trends."""
    data = get_data()
    
    district_list = districts.split(",") if districts else None
    enrol_df, demo_df, bio_df = apply_filters(
        data['enrolment'].copy(),
        data['demographic'].copy(),
        data['biometric'].copy(),
        start_date, end_date, district_list
    )
    
    forecaster = WorkloadForecaster(enrol_df, bio_df)
    historical, forecast = forecaster.forecast_workload(periods=periods)
    
    # Combine historical and forecast
    result = []
    
    for _, row in historical.iterrows():
        result.append(ForecastPoint(
            date=row['date'].strftime('%Y-%m-%d'),
            total_enrolments=float(row['total_enrolments']),
            is_forecast=False
        ))
    
    for _, row in forecast.iterrows():
        result.append(ForecastPoint(
            date=row['date'].strftime('%Y-%m-%d'),
            total_enrolments=float(row['total_enrolments']),
            is_forecast=True
        ))
    
    return result


@app.get("/api/v1/workload/projections", response_model=List[WorkloadProjection])
async def get_workload_projections(
    start_date: Optional[str] = Query(None),
    end_date: Optional[str] = Query(None),
    districts: Optional[str] = Query(None),
    limit: int = Query(15, ge=1, le=50, description="Number of districts to return")
):
    """Get mandatory update projections by district."""
    data = get_data()
    
    district_list = districts.split(",") if districts else None
    enrol_df, demo_df, bio_df = apply_filters(
        data['enrolment'].copy(),
        data['demographic'].copy(),
        data['biometric'].copy(),
        start_date, end_date, district_list
    )
    
    forecaster = WorkloadForecaster(enrol_df, bio_df)
    projections = forecaster.calculate_mandatory_update_projection()
    
    return projections.head(limit).to_dict(orient='records')


@app.get("/api/v1/anomalies", response_model=List[Anomaly])
async def get_anomalies(
    severity: Optional[str] = Query(None, description="Filter by severity: Critical, Warning, Info"),
    start_date: Optional[str] = Query(None),
    end_date: Optional[str] = Query(None),
    districts: Optional[str] = Query(None)
):
    """Get detected anomalies."""
    data = get_data()
    
    district_list = districts.split(",") if districts else None
    enrol_df, demo_df, bio_df = apply_filters(
        data['enrolment'].copy(),
        data['demographic'].copy(),
        data['biometric'].copy(),
        start_date, end_date, district_list
    )
    
    detector = AnomalyDetector(enrol_df, bio_df, demo_df)
    anomalies = detector.detect_all_anomalies()
    
    if severity:
        anomalies = [a for a in anomalies if a['severity'] == severity]
    
    return [Anomaly(**a) for a in anomalies]


@app.get("/api/v1/districts/health", response_model=List[DistrictHealth])
async def get_district_health(
    start_date: Optional[str] = Query(None),
    end_date: Optional[str] = Query(None),
    districts: Optional[str] = Query(None)
):
    """Get data quality health scores for each district."""
    data = get_data()
    
    district_list = districts.split(",") if districts else None
    enrol_df, demo_df, bio_df = apply_filters(
        data['enrolment'].copy(),
        data['demographic'].copy(),
        data['biometric'].copy(),
        start_date, end_date, district_list
    )
    
    detector = AnomalyDetector(enrol_df, bio_df, demo_df)
    health_scores = detector.get_district_health_score()
    
    return health_scores.to_dict(orient='records')


@app.get("/api/v1/migration/trends")
async def get_migration_trends(
    start_date: Optional[str] = Query(None),
    end_date: Optional[str] = Query(None),
    districts: Optional[str] = Query(None)
):
    """Get monthly migration trend data."""
    data = get_data()
    
    district_list = districts.split(",") if districts else None
    enrol_df, demo_df, bio_df = apply_filters(
        data['enrolment'].copy(),
        data['demographic'].copy(),
        data['biometric'].copy(),
        start_date, end_date, district_list
    )
    
    analyzer = MigrationAnalyzer(enrol_df, demo_df)
    trends = analyzer.get_migration_trends()
    
    # Convert to JSON-serializable format
    result = []
    for _, row in trends.iterrows():
        result.append({
            "date": row['date'].strftime('%Y-%m-%d'),
            "enrolments": float(row['enrolments']),
            "demo_updates": float(row['demo_updates']),
            "migration_ratio": float(row['migration_ratio'])
        })
    
    return result


@app.get("/api/v1/enrolments/by-district")
async def get_enrolments_by_district(
    start_date: Optional[str] = Query(None),
    end_date: Optional[str] = Query(None),
    districts: Optional[str] = Query(None)
):
    """Get enrolment totals aggregated by district."""
    data = get_data()
    
    district_list = districts.split(",") if districts else None
    enrol_df, _, _ = apply_filters(
        data['enrolment'].copy(),
        data['demographic'].copy(),
        data['biometric'].copy(),
        start_date, end_date, district_list
    )
    
    district_agg = enrol_df.groupby('district').agg({
        'total_enrolments': 'sum',
        'age_0_5': 'sum',
        'age_5_17': 'sum',
        'age_18_greater': 'sum'
    }).reset_index().sort_values('total_enrolments', ascending=False)
    
    return district_agg.to_dict(orient='records')


@app.get("/api/v1/enrolments/age-distribution")
async def get_age_distribution(
    start_date: Optional[str] = Query(None),
    end_date: Optional[str] = Query(None),
    districts: Optional[str] = Query(None)
):
    """Get age group distribution."""
    data = get_data()
    
    district_list = districts.split(",") if districts else None
    enrol_df, _, _ = apply_filters(
        data['enrolment'].copy(),
        data['demographic'].copy(),
        data['biometric'].copy(),
        start_date, end_date, district_list
    )
    
    totals = {
        'age_0_5': int(enrol_df['age_0_5'].sum()),
        'age_5_17': int(enrol_df['age_5_17'].sum()),
        'age_18_greater': int(enrol_df['age_18_greater'].sum())
    }
    
    total = sum(totals.values())
    
    return {
        "totals": totals,
        "percentages": {
            k: round(v / total * 100, 1) if total > 0 else 0 
            for k, v in totals.items()
        },
        "total": total
    }


@app.get("/api/v1/config")
async def get_config():
    """Get dashboard configuration (colors, districts list)."""
    return {
        "colors": COLORS,
        "districts": TELANGANA_DISTRICTS,
        "thresholds": {
            "migration_high": 0.7,
            "migration_medium": 0.4,
            "anomaly_std": 2.0,
            "gender_lower": 0.47,
            "gender_upper": 0.53
        }
    }


# ============================================================================
# RUN SERVER
# ============================================================================

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )
