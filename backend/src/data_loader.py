"""
Data Loading and Preprocessing Module
Handles all data ingestion for UIDAI Ops-Intel Dashboard
"""
import pandas as pd
import numpy as np
import json
import requests
from pathlib import Path
from typing import Dict, Tuple, Optional
from datetime import datetime

from src.config import (
    ENROLMENT_DATA, BIOMETRIC_UPDATE_DATA, DEMOGRAPHIC_UPDATE_DATA,
    GEOJSON_FILE, DISTRICT_NAME_MAPPING
)


def standardize_district_name(name: str) -> str:
    """Standardize district names to handle variations in the data."""
    if pd.isna(name):
        return "Unknown"
    
    # Strip whitespace and normalize
    cleaned = str(name).strip()
    
    # Apply mapping if exists
    return DISTRICT_NAME_MAPPING.get(cleaned, cleaned)


def load_enrolment_data() -> pd.DataFrame:
    """
    Load and preprocess Aadhaar enrolment data.
    
    Returns:
        DataFrame with columns: date, state, district, pincode, 
                               age_0_5, age_5_17, age_18_greater, total_enrolments
    """
    df = pd.read_csv(ENROLMENT_DATA)
    
    # Parse dates (DD-MM-YYYY format)
    df['date'] = pd.to_datetime(df['date'], format='%d-%m-%Y', errors='coerce')
    
    # Standardize district names
    df['district'] = df['district'].apply(standardize_district_name)
    
    # Calculate total enrolments
    df['total_enrolments'] = df['age_0_5'] + df['age_5_17'] + df['age_18_greater']
    
    # Add month-year for trend analysis
    df['month_year'] = df['date'].dt.to_period('M')
    df['year'] = df['date'].dt.year
    df['month'] = df['date'].dt.month
    
    # Drop rows with invalid dates
    df = df.dropna(subset=['date'])
    
    return df


def load_biometric_update_data() -> pd.DataFrame:
    """
    Load and preprocess Biometric Update data.
    These are mandatory updates at ages 5 and 15.
    
    Returns:
        DataFrame with columns: date, state, district, pincode,
                               bio_age_5_17, bio_age_17_plus, total_bio_updates
    """
    df = pd.read_csv(BIOMETRIC_UPDATE_DATA)
    
    # Parse dates
    df['date'] = pd.to_datetime(df['date'], format='%d-%m-%Y', errors='coerce')
    
    # Standardize district names
    df['district'] = df['district'].apply(standardize_district_name)
    
    # Rename columns for clarity
    df = df.rename(columns={
        'bio_age_5_17': 'bio_age_5_17',
        'bio_age_17_': 'bio_age_17_plus'
    })
    
    # Calculate total biometric updates
    df['total_bio_updates'] = df['bio_age_5_17'].fillna(0) + df['bio_age_17_plus'].fillna(0)
    
    # Add month-year
    df['month_year'] = df['date'].dt.to_period('M')
    
    df = df.dropna(subset=['date'])
    
    return df


def load_demographic_update_data() -> pd.DataFrame:
    """
    Load and preprocess Demographic Update data.
    These include address changes (key for migration analysis).
    
    Returns:
        DataFrame with columns: date, state, district, pincode,
                               demo_age_5_17, demo_age_17_plus, total_demo_updates
    """
    df = pd.read_csv(DEMOGRAPHIC_UPDATE_DATA)
    
    # Parse dates
    df['date'] = pd.to_datetime(df['date'], format='%d-%m-%Y', errors='coerce')
    
    # Standardize district names
    df['district'] = df['district'].apply(standardize_district_name)
    
    # Rename columns for clarity
    df = df.rename(columns={
        'demo_age_5_17': 'demo_age_5_17',
        'demo_age_17_': 'demo_age_17_plus'
    })
    
    # Calculate total demographic updates
    df['total_demo_updates'] = df['demo_age_5_17'].fillna(0) + df['demo_age_17_plus'].fillna(0)
    
    # Add month-year
    df['month_year'] = df['date'].dt.to_period('M')
    
    df = df.dropna(subset=['date'])
    
    return df


def load_geojson() -> dict:
    """
    Load Telangana districts GeoJSON for choropleth map.
    Fetches from GitHub repository for accurate district boundaries.
    """
    GEOJSON_URL = "https://raw.githubusercontent.com/gggodhwani/telangana_boundaries/master/districts.json"
    
    try:
        # Try to fetch from URL first (most accurate)
        response = requests.get(GEOJSON_URL, timeout=10)
        response.raise_for_status()
        geojson_data = response.json()
        
        # Normalize district names in GeoJSON to match our data
        # The GeoJSON uses 'D_N' property with uppercase names
        for feature in geojson_data.get('features', []):
            if 'properties' in feature and 'D_N' in feature['properties']:
                # Create a 'district' property with title case for matching
                district_name = feature['properties']['D_N'].title()
                feature['properties']['district'] = district_name
        
        return geojson_data
    except Exception as e:
        print(f"Warning: Could not fetch GeoJSON from URL: {e}")
        # Fallback to local file if URL fails
        try:
            with open(GEOJSON_FILE, 'r') as f:
                return json.load(f)
        except Exception as e2:
            print(f"Error: Could not load local GeoJSON either: {e2}")
            # Return empty GeoJSON structure as last resort
            return {"type": "FeatureCollection", "features": []}


def aggregate_by_district(
    enrolment_df: pd.DataFrame,
    demo_df: pd.DataFrame,
    bio_df: pd.DataFrame
) -> pd.DataFrame:
    """
    Create district-level aggregations for analysis.
    
    Returns:
        DataFrame with district-level metrics
    """
    # Aggregate enrolments by district
    enrol_agg = enrolment_df.groupby('district').agg({
        'total_enrolments': 'sum',
        'age_0_5': 'sum',
        'age_5_17': 'sum',
        'age_18_greater': 'sum'
    }).reset_index()
    
    # Aggregate demographic updates
    demo_agg = demo_df.groupby('district').agg({
        'total_demo_updates': 'sum'
    }).reset_index()
    
    # Aggregate biometric updates
    bio_agg = bio_df.groupby('district').agg({
        'total_bio_updates': 'sum'
    }).reset_index()
    
    # Merge all aggregations
    result = enrol_agg.merge(demo_agg, on='district', how='left')
    result = result.merge(bio_agg, on='district', how='left')
    
    # Fill NaN with 0
    result = result.fillna(0)
    
    # Calculate derived metrics
    # Migration Ratio: Demo Updates / New Enrolments
    result['migration_ratio'] = np.where(
        result['total_enrolments'] > 0,
        result['total_demo_updates'] / result['total_enrolments'],
        0
    )
    
    # Update Load Ratio: Bio Updates / Total Activity
    result['update_load_ratio'] = np.where(
        (result['total_enrolments'] + result['total_bio_updates']) > 0,
        result['total_bio_updates'] / (result['total_enrolments'] + result['total_bio_updates']),
        0
    )
    
    return result


def aggregate_by_date(df: pd.DataFrame) -> pd.DataFrame:
    """Aggregate data by date for time series analysis."""
    return df.groupby('date').agg({
        'total_enrolments': 'sum',
        'age_0_5': 'sum',
        'age_5_17': 'sum',
        'age_18_greater': 'sum'
    }).reset_index().sort_values('date')


def get_date_range(df: pd.DataFrame) -> Tuple[datetime, datetime]:
    """Get min and max dates from the dataset."""
    return df['date'].min(), df['date'].max()


def filter_by_date_range(
    df: pd.DataFrame, 
    start_date: datetime, 
    end_date: datetime
) -> pd.DataFrame:
    """Filter DataFrame by date range."""
    mask = (df['date'] >= start_date) & (df['date'] <= end_date)
    return df[mask].copy()


def filter_by_district(
    df: pd.DataFrame, 
    districts: list
) -> pd.DataFrame:
    """Filter DataFrame by selected districts."""
    if not districts or 'All Districts' in districts:
        return df.copy()
    return df[df['district'].isin(districts)].copy()


def load_all_data() -> Dict[str, pd.DataFrame]:
    """
    Load all datasets and return as a dictionary.
    
    Returns:
        Dictionary with keys: 'enrolment', 'biometric', 'demographic', 'geojson'
    """
    return {
        'enrolment': load_enrolment_data(),
        'biometric': load_biometric_update_data(),
        'demographic': load_demographic_update_data(),
        'geojson': load_geojson()
    }
