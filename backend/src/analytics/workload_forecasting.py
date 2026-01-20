"""
Module A: Workload Forecasting
Predicts mandatory biometric updates based on age demographics.

Logic:
- Children enrolled at age 4 must update biometrics at age 5 (next year)
- Children enrolled at age 14 must update biometrics at age 15 (next year)
- Use historical patterns to forecast workload
"""
import pandas as pd
import numpy as np
from typing import Dict, Tuple, Optional
from datetime import datetime, timedelta

try:
    from statsmodels.tsa.holtwinters import ExponentialSmoothing
    HAS_STATSMODELS = True
except ImportError:
    HAS_STATSMODELS = False

from src.config import (
    AGE_MANDATORY_UPDATE_5, AGE_MANDATORY_UPDATE_15,
    FORECAST_HORIZON_DAYS
)


class WorkloadForecaster:
    """
    Forecasts Aadhaar workload based on:
    1. Historical enrolment trends
    2. Age-based mandatory update triggers
    """
    
    def __init__(self, enrolment_df: pd.DataFrame, biometric_df: pd.DataFrame):
        self.enrolment_df = enrolment_df
        self.biometric_df = biometric_df
    
    def calculate_mandatory_update_projection(self) -> pd.DataFrame:
        """
        Project mandatory updates for next 12 months by district.
        
        Logic:
        - age_0_5 bucket includes children 0-5
        - Approximately 1/6 of this bucket are age 4 (will turn 5 next year)
        - age_5_17 bucket includes ages 5-17
        - Approximately 1/13 of this bucket are age 14 (will turn 15 next year)
        
        Returns:
            DataFrame with projected mandatory updates by district
        """
        # Aggregate by district
        district_enrol = self.enrolment_df.groupby('district').agg({
            'age_0_5': 'sum',
            'age_5_17': 'sum',
            'total_enrolments': 'sum'
        }).reset_index()
        
        # Estimate children who will need mandatory updates
        # Age 4 → turning 5 (mandatory biometric update)
        district_enrol['projected_age_5_updates'] = (district_enrol['age_0_5'] / 6).round(0)
        
        # Age 14 → turning 15 (mandatory biometric update)
        district_enrol['projected_age_15_updates'] = (district_enrol['age_5_17'] / 13).round(0)
        
        # Total projected mandatory updates
        district_enrol['total_projected_updates'] = (
            district_enrol['projected_age_5_updates'] + 
            district_enrol['projected_age_15_updates']
        )
        
        # Sort by projected updates (highest first)
        district_enrol = district_enrol.sort_values(
            'total_projected_updates', ascending=False
        )
        
        return district_enrol
    
    def calculate_monthly_trend(self) -> pd.DataFrame:
        """
        Calculate monthly enrolment trends for time series visualization.
        """
        monthly = self.enrolment_df.groupby(
            self.enrolment_df['date'].dt.to_period('M')
        ).agg({
            'total_enrolments': 'sum',
            'age_0_5': 'sum',
            'age_5_17': 'sum',
            'age_18_greater': 'sum'
        }).reset_index()
        
        monthly['date'] = monthly['date'].dt.to_timestamp()
        return monthly.sort_values('date')
    
    def forecast_workload(
        self, 
        periods: int = 3,
        frequency: str = 'M'
    ) -> Tuple[pd.DataFrame, pd.DataFrame]:
        """
        Forecast future enrolment workload using Exponential Smoothing.
        
        Args:
            periods: Number of periods to forecast
            frequency: 'M' for monthly, 'W' for weekly
            
        Returns:
            Tuple of (historical_df, forecast_df)
        """
        # Get monthly aggregation
        if frequency == 'M':
            ts_data = self.calculate_monthly_trend()
        else:
            ts_data = self.enrolment_df.groupby(
                pd.Grouper(key='date', freq='W')
            )['total_enrolments'].sum().reset_index()
        
        if len(ts_data) < 4:
            # Not enough data for forecasting
            return ts_data, pd.DataFrame()
        
        if not HAS_STATSMODELS:
            # Fallback: Simple moving average forecast
            return self._simple_forecast(ts_data, periods)
        
        try:
            # Exponential Smoothing
            model = ExponentialSmoothing(
                ts_data['total_enrolments'].values,
                trend='add',
                seasonal=None,  # No seasonal component with limited data
                initialization_method='estimated'
            )
            fitted = model.fit(optimized=True)
            
            # Generate forecast
            forecast_values = fitted.forecast(periods)
            
            # Create forecast DataFrame
            last_date = ts_data['date'].max()
            forecast_dates = pd.date_range(
                start=last_date + pd.DateOffset(months=1),
                periods=periods,
                freq='MS'
            )
            
            forecast_df = pd.DataFrame({
                'date': forecast_dates,
                'total_enrolments': forecast_values,
                'is_forecast': True
            })
            
            ts_data['is_forecast'] = False
            
            return ts_data, forecast_df
            
        except Exception as e:
            print(f"Forecasting error: {e}")
            return self._simple_forecast(ts_data, periods)
    
    def _simple_forecast(
        self, 
        ts_data: pd.DataFrame, 
        periods: int
    ) -> Tuple[pd.DataFrame, pd.DataFrame]:
        """Simple moving average fallback forecast."""
        # Use last 3 periods average
        avg = ts_data['total_enrolments'].tail(3).mean()
        
        last_date = ts_data['date'].max()
        forecast_dates = pd.date_range(
            start=last_date + pd.DateOffset(months=1),
            periods=periods,
            freq='MS'
        )
        
        forecast_df = pd.DataFrame({
            'date': forecast_dates,
            'total_enrolments': [avg * (1 + 0.02 * i) for i in range(periods)],
            'is_forecast': True
        })
        
        ts_data['is_forecast'] = False
        
        return ts_data, forecast_df
    
    def get_high_load_districts(self, top_n: int = 10) -> pd.DataFrame:
        """Get districts with highest projected workload."""
        projections = self.calculate_mandatory_update_projection()
        return projections.head(top_n)
    
    def get_workload_summary(self) -> Dict:
        """Get summary statistics for workload forecasting."""
        projections = self.calculate_mandatory_update_projection()
        
        return {
            'total_projected_updates': int(projections['total_projected_updates'].sum()),
            'avg_per_district': int(projections['total_projected_updates'].mean()),
            'max_district': projections.iloc[0]['district'] if len(projections) > 0 else 'N/A',
            'max_district_load': int(projections.iloc[0]['total_projected_updates']) if len(projections) > 0 else 0,
            'age_5_total': int(projections['projected_age_5_updates'].sum()),
            'age_15_total': int(projections['projected_age_15_updates'].sum()),
        }
