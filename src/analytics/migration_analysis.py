"""
Module B: Migration Pattern Analysis
Analyzes inward/outward migration patterns based on update ratios.

Logic:
- Migration Ratio = Demographic Updates / New Enrolments
- High Ratio (> 0.7) = High Inward Migration (Urban Hub)
- Medium Ratio (0.4 - 0.7) = Moderate Migration
- Low Ratio (< 0.4) = Stable Rural Area
"""
import pandas as pd
import numpy as np
from typing import Dict, List, Tuple

from src.config import (
    MIGRATION_THRESHOLD_HIGH, 
    MIGRATION_THRESHOLD_MEDIUM,
    TELANGANA_DISTRICTS
)


class MigrationAnalyzer:
    """
    Analyzes migration patterns based on the ratio of 
    demographic updates (address changes) to new enrolments.
    """
    
    def __init__(
        self, 
        enrolment_df: pd.DataFrame, 
        demographic_df: pd.DataFrame
    ):
        self.enrolment_df = enrolment_df
        self.demographic_df = demographic_df
    
    def calculate_migration_intensity(self) -> pd.DataFrame:
        """
        Calculate migration intensity score for each district.
        
        Returns:
            DataFrame with district-level migration metrics
        """
        # Aggregate enrolments by district
        enrol_by_district = self.enrolment_df.groupby('district').agg({
            'total_enrolments': 'sum'
        }).reset_index()
        
        # Aggregate demographic updates by district
        demo_by_district = self.demographic_df.groupby('district').agg({
            'total_demo_updates': 'sum'
        }).reset_index()
        
        # Merge
        result = enrol_by_district.merge(
            demo_by_district, 
            on='district', 
            how='outer'
        ).fillna(0)
        
        # Calculate migration ratio
        result['migration_ratio'] = np.where(
            result['total_enrolments'] > 0,
            result['total_demo_updates'] / result['total_enrolments'],
            0
        )
        
        # Classify migration intensity
        result['migration_category'] = result['migration_ratio'].apply(
            self._classify_migration
        )
        
        # Normalize to 0-100 scale for visualization using percentile rank
        # This ensures better distribution across the color spectrum
        if len(result) > 0 and result['migration_ratio'].max() > 0:
            # Use percentile rank: districts are ranked from 0-100 based on their position
            result['migration_intensity'] = (
                result['migration_ratio'].rank(method='average', pct=True) * 100
            ).round(1)
        else:
            result['migration_intensity'] = 0
        
        return result.sort_values('migration_ratio', ascending=False)
    
    def _classify_migration(self, ratio: float) -> str:
        """Classify migration intensity based on ratio."""
        if ratio >= MIGRATION_THRESHOLD_HIGH:
            return "High Migration (Urban Hub)"
        elif ratio >= MIGRATION_THRESHOLD_MEDIUM:
            return "Moderate Migration"
        else:
            return "Stable (Rural)"
    
    def get_migration_trends(self) -> pd.DataFrame:
        """
        Calculate monthly migration trends.
        
        Returns:
            DataFrame with monthly migration metrics
        """
        # Monthly enrolments
        monthly_enrol = self.enrolment_df.groupby(
            self.enrolment_df['date'].dt.to_period('M')
        ).agg({'total_enrolments': 'sum'}).reset_index()
        monthly_enrol.columns = ['month', 'enrolments']
        
        # Monthly demographic updates
        monthly_demo = self.demographic_df.groupby(
            self.demographic_df['date'].dt.to_period('M')
        ).agg({'total_demo_updates': 'sum'}).reset_index()
        monthly_demo.columns = ['month', 'demo_updates']
        
        # Merge
        trends = monthly_enrol.merge(monthly_demo, on='month', how='outer').fillna(0)
        
        # Calculate monthly ratio
        trends['migration_ratio'] = np.where(
            trends['enrolments'] > 0,
            trends['demo_updates'] / trends['enrolments'],
            0
        )
        
        trends['date'] = trends['month'].dt.to_timestamp()
        
        return trends.sort_values('date')
    
    def get_high_migration_districts(self, top_n: int = 10) -> pd.DataFrame:
        """Get districts with highest migration intensity."""
        intensity = self.calculate_migration_intensity()
        return intensity.head(top_n)
    
    def get_low_migration_districts(self, top_n: int = 10) -> pd.DataFrame:
        """Get districts with lowest migration (most stable)."""
        intensity = self.calculate_migration_intensity()
        return intensity.tail(top_n).sort_values('migration_ratio')
    
    def get_migration_summary(self) -> Dict:
        """Get summary statistics for migration analysis."""
        intensity = self.calculate_migration_intensity()
        
        high_migration = intensity[
            intensity['migration_ratio'] >= MIGRATION_THRESHOLD_HIGH
        ]
        moderate_migration = intensity[
            (intensity['migration_ratio'] >= MIGRATION_THRESHOLD_MEDIUM) &
            (intensity['migration_ratio'] < MIGRATION_THRESHOLD_HIGH)
        ]
        low_migration = intensity[
            intensity['migration_ratio'] < MIGRATION_THRESHOLD_MEDIUM
        ]
        
        return {
            'total_districts': len(intensity),
            'high_migration_count': len(high_migration),
            'moderate_migration_count': len(moderate_migration),
            'low_migration_count': len(low_migration),
            'avg_migration_ratio': round(intensity['migration_ratio'].mean(), 2),
            'max_migration_district': intensity.iloc[0]['district'] if len(intensity) > 0 else 'N/A',
            'max_migration_ratio': round(intensity.iloc[0]['migration_ratio'], 2) if len(intensity) > 0 else 0,
            'high_migration_districts': high_migration['district'].tolist(),
        }
    
    def prepare_choropleth_data(self) -> pd.DataFrame:
        """
        Prepare data for choropleth map visualization.
        
        Returns:
            DataFrame with district names and migration intensity scores
        """
        intensity = self.calculate_migration_intensity()
        
        # Ensure all districts are present
        all_districts = pd.DataFrame({'district': TELANGANA_DISTRICTS})
        result = all_districts.merge(intensity, on='district', how='left')
        
        # Fill missing values
        result = result.fillna({
            'total_enrolments': 0,
            'total_demo_updates': 0,
            'migration_ratio': 0,
            'migration_intensity': 0,
            'migration_category': 'No Data'
        })
        
        # Sort by migration_ratio in descending order to maintain ranking
        return result.sort_values('migration_ratio', ascending=False)
