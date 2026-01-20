"""
Plotly Chart Components for UIDAI Ops-Intel Dashboard
"""
import plotly.express as px
import plotly.graph_objects as go
from plotly.subplots import make_subplots
import pandas as pd
import numpy as np
import json
from typing import Dict, List, Optional

from src.config import COLORS, GRADIENT_COLORS


def create_choropleth_map(
    data: pd.DataFrame,
    geojson: dict,
    value_column: str = 'migration_intensity',
    title: str = 'Migration Intensity by District'
) -> go.Figure:
    """
    Create a choropleth map of Telangana districts.
    
    Args:
        data: DataFrame with district and value columns
        geojson: GeoJSON dict with district boundaries
        value_column: Column to use for coloring
        title: Chart title
    """
    fig = px.choropleth_mapbox(
        data,
        geojson=geojson,
        locations='district',
        featureidkey='properties.district',
        color=value_column,
        color_continuous_scale=[
            [0, '#FFF3CD'],      # Light yellow
            [0.25, '#FDB913'],   # Aadhaar yellow
            [0.5, '#F4A012'],    # Orange
            [0.75, '#D3550F'],   # Dark orange
            [1, '#B72025']       # Aadhaar red
        ],
        mapbox_style='carto-positron',
        zoom=6,
        center={'lat': 17.8, 'lon': 79.2},
        opacity=0.8,
        hover_data={
            'district': True,
            value_column: ':.1f',
            'migration_category': True
        } if 'migration_category' in data.columns else {
            'district': True,
            value_column: ':.1f'
        },
        labels={
            value_column: 'Migration Score',
            'district': 'District'
        }
    )
    
    fig.update_layout(
        title={
            'text': f'<b>{title}</b>',
            'x': 0.5,
            'xanchor': 'center',
            'font': {'size': 18, 'color': COLORS['text_primary'], 'family': 'Inter'}
        },
        margin={'r': 20, 't': 60, 'l': 20, 'b': 20},
        height=500,
        paper_bgcolor='rgba(0,0,0,0)',
        plot_bgcolor='rgba(0,0,0,0)',
        coloraxis_colorbar={
            'title': 'Intensity',
            'tickformat': '.0f',
            'thickness': 15,
            'len': 0.8
        },
        mapbox=dict(
            style='carto-positron',
            zoom=6.2
        )
    )
    
    return fig


def create_district_bar_chart(
    data: pd.DataFrame,
    value_column: str,
    title: str,
    color: str = COLORS['primary'],
    horizontal: bool = True,
    top_n: int = 15
) -> go.Figure:
    """Create a bar chart for district-level metrics."""
    # Sort and limit
    df = data.nlargest(top_n, value_column).sort_values(value_column)
    
    if horizontal:
        fig = go.Figure(go.Bar(
            x=df[value_column],
            y=df['district'],
            orientation='h',
            marker=dict(
                color=df[value_column],
                colorscale=[
                    [0, COLORS['secondary']],
                    [1, COLORS['primary']]
                ],
                line=dict(width=0)
            ),
            text=df[value_column].apply(lambda x: f'{x:,.0f}'),
            textposition='outside',
            textfont=dict(size=11, color=COLORS['text_secondary']),
            hovertemplate='<b>%{y}</b><br>Value: %{x:,.0f}<extra></extra>'
        ))
    else:
        fig = go.Figure(go.Bar(
            x=df['district'],
            y=df[value_column],
            marker=dict(
                color=df[value_column],
                colorscale=[
                    [0, COLORS['secondary']],
                    [1, COLORS['primary']]
                ],
                line=dict(width=0)
            ),
            text=df[value_column].apply(lambda x: f'{x:,.0f}'),
            textposition='outside',
            textfont=dict(size=11, color=COLORS['text_secondary']),
            hovertemplate='<b>%{x}</b><br>Value: %{y:,.0f}<extra></extra>'
        ))
    
    fig.update_layout(
        title={
            'text': f'<b>{title}</b>',
            'x': 0.5,
            'xanchor': 'center',
            'font': {'size': 16, 'color': COLORS['text_primary'], 'family': 'Inter'}
        },
        paper_bgcolor='rgba(0,0,0,0)',
        plot_bgcolor='rgba(0,0,0,0)',
        height=400 if top_n <= 10 else 500,
        margin=dict(l=20, r=80, t=60, b=20),
        xaxis=dict(
            showgrid=True,
            gridcolor='rgba(0,0,0,0.05)',
            zeroline=False,
            tickfont=dict(family='Inter')
        ),
        yaxis=dict(
            showgrid=False,
            tickfont=dict(family='Inter')
        ),
        showlegend=False,
        hoverlabel=dict(
            bgcolor="white",
            font_size=12,
            font_family="Inter"
        )
    )
    
    return fig


def create_forecast_chart(
    historical: pd.DataFrame,
    forecast: pd.DataFrame = None,
    title: str = 'Enrolment Trend & Forecast'
) -> go.Figure:
    """Create a time series chart with historical data and forecast."""
    fig = go.Figure()
    
    # Historical data
    fig.add_trace(go.Scatter(
        x=historical['date'],
        y=historical['total_enrolments'],
        mode='lines+markers',
        name='Historical',
        line=dict(color=COLORS['primary'], width=3),
        marker=dict(size=6, color=COLORS['primary']),
        hovertemplate='<b>%{x|%b %Y}</b><br>Enrolments: %{y:,.0f}<extra></extra>'
    ))
    
    # Forecast data
    if forecast is not None and len(forecast) > 0:
        # Connect historical to forecast
        last_hist = historical.iloc[-1]
        forecast_with_connection = pd.concat([
            pd.DataFrame([{
                'date': last_hist['date'],
                'total_enrolments': last_hist['total_enrolments']
            }]),
            forecast
        ], ignore_index=True)
        
        fig.add_trace(go.Scatter(
            x=forecast_with_connection['date'],
            y=forecast_with_connection['total_enrolments'],
            mode='lines+markers',
            name='Forecast',
            line=dict(color=COLORS['secondary'], width=3, dash='dash'),
            marker=dict(size=8, color=COLORS['secondary'], symbol='diamond'),
            hovertemplate='<b>%{x|%b %Y}</b><br>Predicted: %{y:,.0f}<extra></extra>'
        ))
        
        # Confidence interval (simple approximation)
        upper = forecast_with_connection['total_enrolments'] * 1.15
        lower = forecast_with_connection['total_enrolments'] * 0.85
        
        fig.add_trace(go.Scatter(
            x=list(forecast_with_connection['date']) + list(forecast_with_connection['date'][::-1]),
            y=list(upper) + list(lower[::-1]),
            fill='toself',
            fillcolor='rgba(253, 185, 19, 0.15)',
            line=dict(color='rgba(0,0,0,0)'),
            name='Confidence Interval',
            hoverinfo='skip'
        ))
    
    fig.update_layout(
        title={
            'text': f'<b>{title}</b>',
            'x': 0.5,
            'xanchor': 'center',
            'font': {'size': 16, 'color': COLORS['text_primary'], 'family': 'Inter'}
        },
        paper_bgcolor='rgba(0,0,0,0)',
        plot_bgcolor='rgba(0,0,0,0)',
        height=400,
        margin=dict(l=20, r=20, t=60, b=20),
        xaxis=dict(
            showgrid=True,
            gridcolor='rgba(0,0,0,0.05)',
            title='',
            tickformat='%b %Y',
            tickfont=dict(family='Inter')
        ),
        yaxis=dict(
            showgrid=True,
            gridcolor='rgba(0,0,0,0.05)',
            title='Enrolments',
            tickformat=',d',
            tickfont=dict(family='Inter')
        ),
        legend=dict(
            orientation='h',
            yanchor='bottom',
            y=1.02,
            xanchor='right',
            x=1,
            bgcolor='rgba(255,255,255,0.8)',
            font=dict(family='Inter', size=10)
        ),
        hovermode='x unified'
    )
    
    return fig


def create_workload_projection_chart(
    data: pd.DataFrame,
    title: str = 'Projected Mandatory Updates (Next 12 Months)'
) -> go.Figure:
    """Create a stacked bar chart showing age 5 and age 15 update projections."""
    # Sort by total
    df = data.nlargest(15, 'total_projected_updates').sort_values('total_projected_updates')
    
    fig = go.Figure()
    
    # Age 5 updates
    fig.add_trace(go.Bar(
        y=df['district'],
        x=df['projected_age_5_updates'],
        name='Age 5 Updates',
        orientation='h',
        marker=dict(color=COLORS['secondary']),
        text=df['projected_age_5_updates'].astype(int),
        textposition='inside',
        textfont=dict(size=10, color='black'),
        hovertemplate='<b>%{y}</b><br>Age 5 Updates: %{x:,.0f}<extra></extra>'
    ))
    
    # Age 15 updates
    fig.add_trace(go.Bar(
        y=df['district'],
        x=df['projected_age_15_updates'],
        name='Age 15 Updates',
        orientation='h',
        marker=dict(color=COLORS['primary']),
        text=df['projected_age_15_updates'].astype(int),
        textposition='inside',
        textfont=dict(size=10, color='white'),
        hovertemplate='<b>%{y}</b><br>Age 15 Updates: %{x:,.0f}<extra></extra>'
    ))
    
    fig.update_layout(
        title={
            'text': f'<b>{title}</b>',
            'x': 0.5,
            'xanchor': 'center',
            'font': {'size': 16, 'color': COLORS['text_primary'], 'family': 'Inter'}
        },
        barmode='stack',
        paper_bgcolor='rgba(0,0,0,0)',
        plot_bgcolor='rgba(0,0,0,0)',
        height=500,
        margin=dict(l=20, r=20, t=60, b=20),
        xaxis=dict(
            showgrid=True,
            gridcolor='rgba(0,0,0,0.05)',
            title='Projected Updates',
            tickformat=',d',
            tickfont=dict(family='Inter')
        ),
        yaxis=dict(
            showgrid=False,
            title='',
            tickfont=dict(family='Inter')
        ),
        legend=dict(
            orientation='h',
            yanchor='bottom',
            y=1.02,
            xanchor='center',
            x=0.5,
            bgcolor='rgba(255,255,255,0.8)',
            font=dict(family='Inter', size=10)
        )
    )
    
    return fig


def create_age_distribution_pie(data: pd.DataFrame) -> go.Figure:
    """Create a donut chart showing age group distribution."""
    age_totals = {
        'Children (0-5)': data['age_0_5'].sum(),
        'Youth (5-17)': data['age_5_17'].sum(),
        'Adults (18+)': data['age_18_greater'].sum()
    }
    
    fig = go.Figure(go.Pie(
        labels=list(age_totals.keys()),
        values=list(age_totals.values()),
        hole=0.55,
        marker=dict(
            colors=[COLORS['secondary'], '#F4A012', COLORS['primary']],
            line=dict(color='white', width=2)
        ),
        textinfo='label+percent',
        textposition='outside',
        textfont=dict(size=12),
        hovertemplate='<b>%{label}</b><br>Count: %{value:,.0f}<br>%{percent}<extra></extra>'
    ))
    
    # Add center text
    total = sum(age_totals.values())
    fig.add_annotation(
        text=f'<b>{total:,.0f}</b><br><span style="font-size:12px">Total</span>',
        x=0.5, y=0.5,
        font=dict(size=20, color=COLORS['text_primary']),
        showarrow=False
    )
    
    fig.update_layout(
        title={
            'text': '<b>Age Distribution</b>',
            'x': 0.5,
            'xanchor': 'center',
            'font': {'size': 16, 'color': COLORS['text_primary'], 'family': 'Inter'}
        },
        paper_bgcolor='rgba(0,0,0,0)',
        height=350,
        margin=dict(l=20, r=20, t=60, b=20),
        showlegend=False,
        font=dict(family='Inter')
    )
    
    return fig


def create_migration_trend_chart(data: pd.DataFrame) -> go.Figure:
    """Create a dual-axis chart showing migration trends over time."""
    fig = make_subplots(specs=[[{'secondary_y': True}]])
    
    # Enrolments
    fig.add_trace(go.Scatter(
        x=data['date'],
        y=data['enrolments'],
        mode='lines+markers',
        name='New Enrolments',
        line=dict(color=COLORS['primary'], width=2),
        marker=dict(size=5),
        hovertemplate='Enrolments: %{y:,.0f}<extra></extra>'
    ), secondary_y=False)
    
    # Demo Updates
    fig.add_trace(go.Scatter(
        x=data['date'],
        y=data['demo_updates'],
        mode='lines+markers',
        name='Address Updates',
        line=dict(color=COLORS['secondary'], width=2),
        marker=dict(size=5),
        hovertemplate='Updates: %{y:,.0f}<extra></extra>'
    ), secondary_y=False)
    
    # Migration Ratio
    fig.add_trace(go.Scatter(
        x=data['date'],
        y=data['migration_ratio'],
        mode='lines',
        name='Migration Ratio',
        line=dict(color='#10B981', width=3, dash='dash'),
        hovertemplate='Ratio: %{y:.2f}<extra></extra>'
    ), secondary_y=True)
    
    fig.update_layout(
        title={
            'text': '<b>Migration Trends Over Time</b>',
            'x': 0.5,
            'xanchor': 'center',
            'font': {'size': 16, 'color': COLORS['text_primary'], 'family': 'Inter'}
        },
        paper_bgcolor='rgba(0,0,0,0)',
        plot_bgcolor='rgba(0,0,0,0)',
        height=400,
        margin=dict(l=20, r=20, t=60, b=20),
        legend=dict(
            orientation='h',
            yanchor='bottom',
            y=1.02,
            xanchor='center',
            x=0.5,
            font=dict(family='Inter', size=10)
        ),
        hovermode='x unified'
    )
    
    fig.update_xaxes(
        showgrid=True,
        gridcolor='rgba(0,0,0,0.05)',
        tickformat='%b %Y',
        tickfont=dict(family='Inter')
    )
    
    fig.update_yaxes(
        title_text='Count',
        showgrid=True,
        gridcolor='rgba(0,0,0,0.05)',
        secondary_y=False,
        tickfont=dict(family='Inter')
    )
    
    fig.update_yaxes(
        title_text='Migration Ratio',
        showgrid=False,
        secondary_y=True,
        tickfont=dict(family='Inter')
    )
    
    return fig


def create_health_score_gauge(score: float, title: str = 'Data Quality') -> go.Figure:
    """Create a gauge chart for health/quality scores."""
    fig = go.Figure(go.Indicator(
        mode='gauge+number',
        value=score,
        domain={'x': [0, 1], 'y': [0, 1]},
        title={'text': title, 'font': {'size': 14}},
        gauge={
            'axis': {'range': [0, 100], 'tickwidth': 1},
            'bar': {'color': COLORS['primary']},
            'bgcolor': 'white',
            'borderwidth': 2,
            'bordercolor': 'gray',
            'steps': [
                {'range': [0, 50], 'color': '#FEE2E2'},
                {'range': [50, 80], 'color': '#FEF3C7'},
                {'range': [80, 100], 'color': '#D1FAE5'}
            ],
            'threshold': {
                'line': {'color': COLORS['secondary'], 'width': 4},
                'thickness': 0.75,
                'value': score
            }
        }
    ))
    
    fig.update_layout(
        paper_bgcolor='rgba(0,0,0,0)',
        height=200,
        margin=dict(l=20, r=20, t=40, b=20),
        font=dict(family='Inter')
    )
    
    return fig
