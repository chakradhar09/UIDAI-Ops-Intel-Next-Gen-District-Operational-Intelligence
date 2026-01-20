"""
🏛️ UIDAI Ops-Intel Dashboard
District Operational Intelligence for Telangana

A comprehensive dashboard for Aadhaar operations analytics including:
- Workload Forecasting
- Migration Pattern Analysis
- Anomaly Detection

Developed for UIDAI Data Hackathon 2026
"""
import streamlit as st
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import warnings
warnings.filterwarnings('ignore')

# Configure page
st.set_page_config(
    page_title="UIDAI Ops-Intel Dashboard",
    page_icon="🏛️",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Import modules
from src.data_loader import (
    load_enrolment_data, 
    load_biometric_update_data,
    load_demographic_update_data,
    load_geojson,
    filter_by_date_range,
    filter_by_district,
    aggregate_by_district
)
from src.analytics import WorkloadForecaster, MigrationAnalyzer, AnomalyDetector
from src.components.styles import get_custom_css
from src.components.charts import (
    create_choropleth_map,
    create_district_bar_chart,
    create_forecast_chart,
    create_workload_projection_chart,
    create_age_distribution_pie,
    create_migration_trend_chart,
    create_health_score_gauge
)
from src.config import COLORS, TELANGANA_DISTRICTS


# ============================================================================
# LOAD DATA (Cached)
# ============================================================================
@st.cache_data(show_spinner=False, ttl=600)  # Cache for 10 minutes
def load_data():
    """Load and cache all datasets."""
    enrolment = load_enrolment_data()
    biometric = load_biometric_update_data()
    demographic = load_demographic_update_data()
    geojson = load_geojson()
    return enrolment, biometric, demographic, geojson


# ============================================================================
# MAIN APPLICATION
# ============================================================================
def main():
    # Inject custom CSS
    st.markdown(get_custom_css(), unsafe_allow_html=True)
    
    # Load data
    with st.spinner('Loading UIDAI Data...'):
        enrolment_df, biometric_df, demographic_df, geojson = load_data()
    
    # ========================================================================
    # SIDEBAR
    # ========================================================================
    with st.sidebar:
        # Logo/Branding
        st.markdown("""
        <div style="text-align: center; padding: 1rem 0;">
            <div style="background: linear-gradient(135deg, #B72025 0%, #8B181C 100%); 
                        border-radius: 12px; padding: 1.5rem; margin-bottom: 1rem;">
                <h2 style="color: white; margin: 0; font-size: 1.5rem;">🏛️ Ops-Intel</h2>
                <p style="color: rgba(255,255,255,0.8); margin: 0.5rem 0 0 0; font-size: 0.85rem;">
                    District Operations Dashboard
                </p>
            </div>
        </div>
        """, unsafe_allow_html=True)
        
        st.markdown("### 📍 Region")
        
        # State Selector (Fixed)
        st.selectbox(
            "State",
            ["Telangana"],
            disabled=True,
            help="Dashboard is configured for Telangana state"
        )
        
        # Get unique districts from data
        available_districts = sorted(enrolment_df['district'].unique().tolist())
        
        # District Filter
        selected_districts = st.multiselect(
            "Districts",
            options=['All Districts'] + available_districts,
            default=['All Districts'],
            help="Select specific districts to analyze"
        )
        
        st.markdown("### 📅 Time Period")
        
        # Date Range
        min_date = enrolment_df['date'].min().date()
        max_date = enrolment_df['date'].max().date()
        
        col1, col2 = st.columns(2)
        with col1:
            start_date = st.date_input(
                "From",
                value=min_date,
                min_value=min_date,
                max_value=max_date
            )
        with col2:
            end_date = st.date_input(
                "To",
                value=max_date,
                min_value=min_date,
                max_value=max_date
            )
        
        st.markdown("---")
        
        # Quick Actions
        st.markdown("### ⚡ Quick Actions")
        
        if st.button("🔄 Refresh Data", width='stretch'):
            st.cache_data.clear()
            st.rerun()
        
        # Red Flags Section
        st.markdown("### 🚨 Red Flags")
        
        # Initialize analyzer for anomalies
        detector = AnomalyDetector(enrolment_df, biometric_df, demographic_df)
        anomalies = detector.detect_all_anomalies()
        
        critical_alerts = [a for a in anomalies if a['severity'] == 'Critical']
        warning_alerts = [a for a in anomalies if a['severity'] == 'Warning']
        
        if critical_alerts:
            st.error(f"🔴 {len(critical_alerts)} Critical Issues")
            for alert in critical_alerts[:3]:
                st.markdown(f"""
                <div class="alert-card critical">
                    <div class="alert-type">{alert['type']}</div>
                    <div class="alert-district">{alert['district']}</div>
                    <div class="alert-desc">{alert['description']}</div>
                </div>
                """, unsafe_allow_html=True)
        
        if warning_alerts:
            with st.expander(f"⚠️ {len(warning_alerts)} Warnings", expanded=False):
                for alert in warning_alerts[:5]:
                    st.markdown(f"**{alert['district']}**: {alert['description']}")
        
        if not critical_alerts and not warning_alerts:
            st.success("✅ No critical issues detected")
        
        # Footer
        st.markdown("""
        <div class="footer-badge">
            <p>UIDAI Data Hackathon 2026</p>
            <p>Built with ❤️ using Streamlit</p>
        </div>
        """, unsafe_allow_html=True)
    
    # ========================================================================
    # MAIN CONTENT
    # ========================================================================
    
    # Apply filters
    start_datetime = pd.Timestamp(start_date)
    end_datetime = pd.Timestamp(end_date)
    
    filtered_enrol = filter_by_date_range(enrolment_df, start_datetime, end_datetime)
    filtered_enrol = filter_by_district(filtered_enrol, selected_districts)
    
    filtered_demo = filter_by_date_range(demographic_df, start_datetime, end_datetime)
    filtered_demo = filter_by_district(filtered_demo, selected_districts)
    
    filtered_bio = filter_by_date_range(biometric_df, start_datetime, end_datetime)
    filtered_bio = filter_by_district(filtered_bio, selected_districts)
    
    # Header
    st.markdown(f"""
    <div class="main-header">
        <h1>🏛️ UIDAI District Operational Intelligence</h1>
        <p>Telangana State • {start_date.strftime('%d %b %Y')} to {end_date.strftime('%d %b %Y')}</p>
    </div>
    """, unsafe_allow_html=True)
    
    # ========================================================================
    # ROW 1: KPI CARDS
    # ========================================================================
    st.markdown("""
    <div class="section-header">
        <div class="section-icon red">📊</div>
        <h2>Key Performance Indicators</h2>
    </div>
    """, unsafe_allow_html=True)
    
    # Initialize analyzers
    forecaster = WorkloadForecaster(filtered_enrol, filtered_bio)
    migration_analyzer = MigrationAnalyzer(filtered_enrol, filtered_demo)
    
    workload_summary = forecaster.get_workload_summary()
    migration_summary = migration_analyzer.get_migration_summary()
    anomaly_summary = detector.get_anomaly_summary()
    
    kpi_cols = st.columns(4)
    
    with kpi_cols[0]:
        total_enrolments = filtered_enrol['total_enrolments'].sum()
        st.markdown(f"""
        <div class="kpi-card">
            <div class="kpi-label">Total Enrolments</div>
            <div class="kpi-value">{total_enrolments:,.0f}</div>
            <div class="kpi-delta positive">📈 Active registrations</div>
        </div>
        """, unsafe_allow_html=True)
    
    with kpi_cols[1]:
        predicted_load = workload_summary['total_projected_updates']
        st.markdown(f"""
        <div class="kpi-card">
            <div class="kpi-label">Predicted Updates</div>
            <div class="kpi-value">{predicted_load:,.0f}</div>
            <div class="kpi-delta">🔄 Next 12 months</div>
        </div>
        """, unsafe_allow_html=True)
    
    with kpi_cols[2]:
        high_migration = migration_summary['high_migration_count']
        st.markdown(f"""
        <div class="kpi-card">
            <div class="kpi-label">High Migration Districts</div>
            <div class="kpi-value">{high_migration}</div>
            <div class="kpi-delta">🏙️ Urban hubs identified</div>
        </div>
        """, unsafe_allow_html=True)
    
    with kpi_cols[3]:
        critical_count = anomaly_summary['critical_count']
        color_class = "negative" if critical_count > 0 else "positive"
        st.markdown(f"""
        <div class="kpi-card">
            <div class="kpi-label">Critical Alerts</div>
            <div class="kpi-value">{critical_count}</div>
            <div class="kpi-delta {color_class}">{'🚨 Needs attention' if critical_count > 0 else '✅ All clear'}</div>
        </div>
        """, unsafe_allow_html=True)
    
    st.markdown("<br>", unsafe_allow_html=True)
    
    # ========================================================================
    # ROW 2: MIGRATION MAP
    # ========================================================================
    st.markdown("""
    <div class="section-header">
        <div class="section-icon yellow">🗺️</div>
        <h2>Module B: Migration Pattern Analysis</h2>
    </div>
    """, unsafe_allow_html=True)
    
    map_col, stats_col = st.columns([2, 1])
    
    with map_col:
        st.markdown('<div class="chart-container">', unsafe_allow_html=True)
        
        # Prepare choropleth data
        choropleth_data = migration_analyzer.prepare_choropleth_data()
        
        # Create map
        fig_map = create_choropleth_map(
            choropleth_data,
            geojson,
            value_column='migration_intensity',
            title='Migration Intensity by District'
        )
        st.plotly_chart(fig_map, width='stretch')
        
        st.markdown('</div>', unsafe_allow_html=True)
    
    with stats_col:
        st.markdown('<div class="chart-container">', unsafe_allow_html=True)
        
        st.markdown("#### 📊 Migration Insights")
        
        # Migration categories breakdown
        cat_counts = choropleth_data['migration_category'].value_counts()
        
        for cat, count in cat_counts.items():
            if 'High' in cat:
                color = COLORS['primary']
            elif 'Moderate' in cat:
                color = COLORS['secondary']
            else:
                color = '#10B981'
            
            st.markdown(f"""
            <div style="display: flex; justify-content: space-between; 
                        padding: 0.85rem; margin-bottom: 0.6rem; 
                        background: linear-gradient(90deg, {color}10, transparent);
                        border-left: 4px solid {color}; border-radius: 8px;
                        box-shadow: 0 2px 4px rgba(0,0,0,0.02);">
                <span style="font-weight: 600; font-size: 0.9rem;">{cat}</span>
                <span style="font-weight: 800; color: {color};">{count}</span>
            </div>
            """, unsafe_allow_html=True)
        
        st.markdown("<br>", unsafe_allow_html=True)
        
        # Top migration districts
        st.markdown("#### 🔝 Top Migration Hubs")
        top_migration = migration_analyzer.get_high_migration_districts(5)
        
        for _, row in top_migration.iterrows():
            ratio_pct = row['migration_ratio'] * 100
            st.markdown(f"""
            <div style="padding: 0.5rem 0; border-bottom: 1px solid #eee;">
                <div style="font-weight: 600;">{row['district']}</div>
                <div style="font-size: 0.85rem; color: #666;">
                    Ratio: {ratio_pct:.1f}%
                </div>
            </div>
            """, unsafe_allow_html=True)
        
        st.markdown('</div>', unsafe_allow_html=True)
    
    st.markdown("<br>", unsafe_allow_html=True)
    
    # ========================================================================
    # ROW 3: WORKLOAD FORECASTING
    # ========================================================================
    st.markdown("""
    <div class="section-header">
        <div class="section-icon red">📈</div>
        <h2>Module A: Workload Forecasting</h2>
    </div>
    """, unsafe_allow_html=True)
    
    forecast_col, projection_col = st.columns(2)
    
    with forecast_col:
        st.markdown('<div class="chart-container">', unsafe_allow_html=True)
        
        # Get forecast data
        historical, forecast = forecaster.forecast_workload(periods=3)
        
        # Create forecast chart
        fig_forecast = create_forecast_chart(
            historical,
            forecast,
            title='Enrolment Trend & 3-Month Forecast'
        )
        st.plotly_chart(fig_forecast, width='stretch')
        
        st.markdown('</div>', unsafe_allow_html=True)
    
    with projection_col:
        st.markdown('<div class="chart-container">', unsafe_allow_html=True)
        
        # Get projection data
        projections = forecaster.calculate_mandatory_update_projection()
        
        # Create stacked bar chart
        fig_projection = create_workload_projection_chart(
            projections,
            title='Projected Mandatory Updates (Next 12 Months)'
        )
        st.plotly_chart(fig_projection, width='stretch')
        
        st.markdown('</div>', unsafe_allow_html=True)
    
    st.markdown("<br>", unsafe_allow_html=True)
    
    # ========================================================================
    # ROW 4: ADDITIONAL INSIGHTS
    # ========================================================================
    tab1, tab2, tab3 = st.tabs(["📊 Age Distribution", "📈 Trend Analysis", "🔍 Anomaly Details"])
    
    with tab1:
        col1, col2 = st.columns([1, 2])
        
        with col1:
            st.markdown('<div class="chart-container">', unsafe_allow_html=True)
            fig_age = create_age_distribution_pie(filtered_enrol)
            st.plotly_chart(fig_age, width='stretch')
            st.markdown('</div>', unsafe_allow_html=True)
        
        with col2:
            st.markdown('<div class="chart-container">', unsafe_allow_html=True)
            
            # District-wise breakdown
            district_agg = filtered_enrol.groupby('district').agg({
                'total_enrolments': 'sum',
                'age_0_5': 'sum',
                'age_5_17': 'sum',
                'age_18_greater': 'sum'
            }).reset_index()
            
            fig_district = create_district_bar_chart(
                district_agg,
                'total_enrolments',
                'Total Enrolments by District'
            )
            st.plotly_chart(fig_district, width='stretch')
            
            st.markdown('</div>', unsafe_allow_html=True)
    
    with tab2:
        st.markdown('<div class="chart-container">', unsafe_allow_html=True)
        
        # Migration trends over time
        trends = migration_analyzer.get_migration_trends()
        
        if len(trends) > 1:
            fig_trends = create_migration_trend_chart(trends)
            st.plotly_chart(fig_trends, width='stretch')
        else:
            st.info("Insufficient data for trend analysis. Select a wider date range.")
        
        st.markdown('</div>', unsafe_allow_html=True)
    
    with tab3:
        st.markdown('<div class="chart-container">', unsafe_allow_html=True)
        
        col1, col2 = st.columns([1, 2])
        
        with col1:
            st.markdown("#### Anomaly Summary")
            
            st.metric("Total Anomalies", anomaly_summary['total_anomalies'])
            st.metric("Critical", anomaly_summary['critical_count'], 
                     delta=None if anomaly_summary['critical_count'] == 0 else "Needs Action",
                     delta_color="inverse")
            st.metric("Warnings", anomaly_summary['warning_count'])
            
            # Health score gauge
            health_scores = detector.get_district_health_score()
            avg_health = health_scores['health_score'].mean()
            
            fig_gauge = create_health_score_gauge(avg_health, 'Avg Data Quality Score')
            st.plotly_chart(fig_gauge, width='stretch')
        
        with col2:
            st.markdown("#### All Detected Anomalies")
            
            if anomalies:
                anomaly_df = pd.DataFrame(anomalies)
                anomaly_df = anomaly_df[['severity', 'type', 'district', 'description']]
                
                # Style the dataframe
                def color_severity(val):
                    if val == 'Critical':
                        return 'background-color: #FEE2E2; color: #DC2626; font-weight: bold'
                    elif val == 'Warning':
                        return 'background-color: #FEF3C7; color: #D97706'
                    else:
                        return 'background-color: #EFF6FF; color: #3B82F6'
                
                styled_df = anomaly_df.style.applymap(
                    color_severity, 
                    subset=['severity']
                )
                
                st.dataframe(
                    styled_df,
                    width='stretch',
                    height=400
                )
            else:
                st.success("No anomalies detected in the selected data range.")
        
        st.markdown('</div>', unsafe_allow_html=True)
    
    # ========================================================================
    # FOOTER
    # ========================================================================
    st.markdown("<br><hr>", unsafe_allow_html=True)
    
    st.markdown("""
    <div style="text-align: center; padding: 1rem; color: #6C757D;">
        <p style="margin: 0;">
            <strong>UIDAI Ops-Intel Dashboard</strong> • District Operational Intelligence for Telangana
        </p>
        <p style="margin: 0.5rem 0 0 0; font-size: 0.85rem;">
            Data Hackathon 2026 • Built with Streamlit & Plotly
        </p>
    </div>
    """, unsafe_allow_html=True)


if __name__ == "__main__":
    main()
