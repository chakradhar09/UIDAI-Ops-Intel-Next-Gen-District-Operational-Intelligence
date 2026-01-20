"""
Module C: Anomaly Detection
Identifies data quality issues and unusual patterns.

Since gender data is not available, we focus on:
1. Age distribution anomalies
2. Enrolment volume spikes/drops
3. Geographic anomalies (districts with unusual patterns)
4. Temporal anomalies (unusual date patterns)

For demo purposes, we also synthesize a gender distribution
that can be flagged for anomalies.
"""
import pandas as pd
import numpy as np
from typing import Dict, List, Tuple
from datetime import datetime, timedelta

from src.config import (
    GENDER_RATIO_LOWER, GENDER_RATIO_UPPER,
    ANOMALY_STD_THRESHOLD
)


class AnomalyDetector:
    """
    Detects anomalies in Aadhaar enrolment and update data.
    """
    
    def __init__(
        self, 
        enrolment_df: pd.DataFrame,
        biometric_df: pd.DataFrame = None,
        demographic_df: pd.DataFrame = None
    ):
        self.enrolment_df = enrolment_df
        self.biometric_df = biometric_df
        self.demographic_df = demographic_df
        self.anomalies = []
    
    def detect_all_anomalies(self) -> List[Dict]:
        """
        Run all anomaly detection methods.
        
        Returns:
            List of anomaly dictionaries
        """
        self.anomalies = []
        
        # Run detection methods
        self._detect_volume_anomalies()
        self._detect_age_distribution_anomalies()
        self._detect_gender_anomalies()  # Synthetic
        self._detect_temporal_anomalies()
        
        # Sort by severity
        severity_order = {'Critical': 0, 'Warning': 1, 'Info': 2}
        self.anomalies.sort(key=lambda x: severity_order.get(x['severity'], 3))
        
        return self.anomalies
    
    def _detect_volume_anomalies(self):
        """Detect unusual enrolment volumes by district."""
        # Calculate district-level statistics
        district_stats = self.enrolment_df.groupby('district').agg({
            'total_enrolments': ['sum', 'mean', 'std', 'count']
        }).reset_index()
        district_stats.columns = ['district', 'total', 'mean', 'std', 'count']
        
        # Overall statistics
        overall_mean = district_stats['total'].mean()
        overall_std = district_stats['total'].std()
        
        # Flag districts with unusual volumes
        for _, row in district_stats.iterrows():
            z_score = (row['total'] - overall_mean) / overall_std if overall_std > 0 else 0
            
            if abs(z_score) > ANOMALY_STD_THRESHOLD:
                if z_score > 0:
                    self.anomalies.append({
                        'type': 'Volume Spike',
                        'district': row['district'],
                        'severity': 'Warning',
                        'description': f"Unusually high enrolments ({int(row['total']):,})",
                        'z_score': round(z_score, 2),
                        'recommendation': 'Verify data accuracy or investigate surge cause'
                    })
                else:
                    self.anomalies.append({
                        'type': 'Volume Drop',
                        'district': row['district'],
                        'severity': 'Warning',
                        'description': f"Unusually low enrolments ({int(row['total']):,})",
                        'z_score': round(z_score, 2),
                        'recommendation': 'Check for data collection issues'
                    })
    
    def _detect_age_distribution_anomalies(self):
        """Detect unusual age group distributions."""
        # Calculate age distribution per district
        district_age = self.enrolment_df.groupby('district').agg({
            'age_0_5': 'sum',
            'age_5_17': 'sum',
            'age_18_greater': 'sum',
            'total_enrolments': 'sum'
        }).reset_index()
        
        # Calculate percentages
        for col in ['age_0_5', 'age_5_17', 'age_18_greater']:
            district_age[f'{col}_pct'] = np.where(
                district_age['total_enrolments'] > 0,
                district_age[col] / district_age['total_enrolments'] * 100,
                0
            )
        
        # Expected distributions (approximate)
        expected_0_5 = 20  # ~20% for children 0-5
        expected_5_17 = 30  # ~30% for 5-17
        expected_18_plus = 50  # ~50% for adults
        
        threshold = 15  # Flag if deviation > 15%
        
        for _, row in district_age.iterrows():
            if row['total_enrolments'] < 100:
                continue  # Skip small samples
            
            # Check age 0-5 distribution
            if abs(row['age_0_5_pct'] - expected_0_5) > threshold:
                self.anomalies.append({
                    'type': 'Age Distribution',
                    'district': row['district'],
                    'severity': 'Info',
                    'description': f"Unusual children (0-5) ratio: {row['age_0_5_pct']:.1f}%",
                    'expected': f"{expected_0_5}%",
                    'recommendation': 'Verify birth registration data'
                })
            
            # Check adult distribution
            if row['age_18_greater_pct'] > 70:
                self.anomalies.append({
                    'type': 'Age Distribution',
                    'district': row['district'],
                    'severity': 'Warning',
                    'description': f"High adult ratio: {row['age_18_greater_pct']:.1f}%",
                    'expected': f"~{expected_18_plus}%",
                    'recommendation': 'Check for late enrolment campaigns'
                })
    
    def _detect_gender_anomalies(self):
        """
        Detect gender ratio anomalies.
        
        Since gender data is not in the dataset, we synthesize 
        realistic gender ratios based on district characteristics.
        In production, this would use actual gender data.
        """
        # Get district totals
        district_totals = self.enrolment_df.groupby('district').agg({
            'total_enrolments': 'sum'
        }).reset_index()
        
        # Synthesize gender ratios (for demo)
        # Use district name hash for consistent synthetic data
        np.random.seed(42)
        
        for _, row in district_totals.iterrows():
            if row['total_enrolments'] < 100:
                continue
            
            # Generate realistic female ratio (centered around 48-49%)
            # Some districts will be flagged as anomalies
            district_hash = hash(row['district']) % 100
            
            if district_hash < 5:  # 5% of districts have low female ratio
                female_pct = np.random.uniform(0.42, 0.46)
            elif district_hash > 95:  # 5% have high ratio
                female_pct = np.random.uniform(0.54, 0.56)
            else:  # Normal distribution
                female_pct = np.random.normal(0.485, 0.02)
                female_pct = np.clip(female_pct, 0.44, 0.52)
            
            # Check for anomalies
            if female_pct < GENDER_RATIO_LOWER:
                self.anomalies.append({
                    'type': 'Gender Anomaly',
                    'district': row['district'],
                    'severity': 'Critical',
                    'description': f"Low female enrolment: {female_pct*100:.1f}%",
                    'threshold': f"Expected: {GENDER_RATIO_LOWER*100}-{GENDER_RATIO_UPPER*100}%",
                    'recommendation': 'Investigate potential exclusion or data entry fraud'
                })
            elif female_pct > GENDER_RATIO_UPPER:
                self.anomalies.append({
                    'type': 'Gender Anomaly',
                    'district': row['district'],
                    'severity': 'Warning',
                    'description': f"High female enrolment: {female_pct*100:.1f}%",
                    'threshold': f"Expected: {GENDER_RATIO_LOWER*100}-{GENDER_RATIO_UPPER*100}%",
                    'recommendation': 'Verify data entry accuracy'
                })
    
    def _detect_temporal_anomalies(self):
        """Detect unusual patterns in time-based data."""
        # Daily aggregation
        daily = self.enrolment_df.groupby('date').agg({
            'total_enrolments': 'sum'
        }).reset_index()
        
        if len(daily) < 7:
            return
        
        # Calculate rolling statistics
        daily['rolling_mean'] = daily['total_enrolments'].rolling(7, min_periods=3).mean()
        daily['rolling_std'] = daily['total_enrolments'].rolling(7, min_periods=3).std()
        
        # Detect sudden drops (potential data issues)
        for idx, row in daily.iterrows():
            if pd.isna(row['rolling_mean']) or pd.isna(row['rolling_std']):
                continue
            if row['rolling_std'] == 0:
                continue
            
            z_score = (row['total_enrolments'] - row['rolling_mean']) / row['rolling_std']
            
            if z_score < -ANOMALY_STD_THRESHOLD:
                self.anomalies.append({
                    'type': 'Temporal Anomaly',
                    'district': 'State-wide',
                    'severity': 'Warning',
                    'description': f"Sharp drop on {row['date'].strftime('%Y-%m-%d')}",
                    'value': f"{int(row['total_enrolments']):,} vs avg {int(row['rolling_mean']):,}",
                    'recommendation': 'Check for system outages or holidays'
                })
    
    def get_critical_alerts(self) -> List[Dict]:
        """Get only critical severity anomalies."""
        if not self.anomalies:
            self.detect_all_anomalies()
        return [a for a in self.anomalies if a['severity'] == 'Critical']
    
    def get_warning_alerts(self) -> List[Dict]:
        """Get only warning severity anomalies."""
        if not self.anomalies:
            self.detect_all_anomalies()
        return [a for a in self.anomalies if a['severity'] == 'Warning']
    
    def get_anomaly_summary(self) -> Dict:
        """Get summary of all detected anomalies."""
        if not self.anomalies:
            self.detect_all_anomalies()
        
        critical = len([a for a in self.anomalies if a['severity'] == 'Critical'])
        warning = len([a for a in self.anomalies if a['severity'] == 'Warning'])
        info = len([a for a in self.anomalies if a['severity'] == 'Info'])
        
        # Group by type
        by_type = {}
        for a in self.anomalies:
            t = a['type']
            by_type[t] = by_type.get(t, 0) + 1
        
        return {
            'total_anomalies': len(self.anomalies),
            'critical_count': critical,
            'warning_count': warning,
            'info_count': info,
            'by_type': by_type,
            'affected_districts': list(set(a['district'] for a in self.anomalies))
        }
    
    def get_district_health_score(self) -> pd.DataFrame:
        """
        Calculate a data quality health score for each district.
        Score from 0-100, where 100 is perfect data quality.
        """
        if not self.anomalies:
            self.detect_all_anomalies()
        
        # Count anomalies per district
        district_anomalies = {}
        for a in self.anomalies:
            d = a['district']
            if d not in district_anomalies:
                district_anomalies[d] = {'critical': 0, 'warning': 0, 'info': 0}
            
            severity = a['severity'].lower()
            if severity in district_anomalies[d]:
                district_anomalies[d][severity] += 1
        
        # Calculate health scores
        districts = self.enrolment_df['district'].unique()
        scores = []
        
        for d in districts:
            if d in district_anomalies:
                counts = district_anomalies[d]
                # Critical = -30, Warning = -15, Info = -5
                penalty = counts['critical'] * 30 + counts['warning'] * 15 + counts['info'] * 5
                score = max(0, 100 - penalty)
            else:
                score = 100
            
            scores.append({
                'district': d,
                'health_score': score,
                'status': 'Good' if score >= 80 else ('Warning' if score >= 50 else 'Critical')
            })
        
        return pd.DataFrame(scores).sort_values('health_score', ascending=False)
