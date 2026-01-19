# 🏗️ UIDAI Ops-Intel Dashboard - Architecture

## 1. Executive Summary

The UIDAI Ops-Intel Dashboard is a District Operational Intelligence system for Telangana that:
- **Predicts workload** based on age-triggered mandatory updates
- **Analyzes migration patterns** through demographic update ratios
- **Detects anomalies** in enrolment data quality

---

## 2. System Architecture

```mermaid
graph TB
    subgraph Data Layer
        CSV1[Enrolment Data]
        CSV2[Biometric Updates]
        CSV3[Demographic Updates]
        GEO[GeoJSON Districts]
    end
    
    subgraph Processing Layer
        DL[Data Loader]
        DL --> |Clean & Standardize| PP[Preprocessor]
        PP --> AGG[Aggregator]
    end
    
    subgraph Analytics Engine
        WF[Module A: Workload Forecasting]
        MA[Module B: Migration Analysis]
        AD[Module C: Anomaly Detection]
    end
    
    subgraph Presentation Layer
        UI[Streamlit Dashboard]
        CHARTS[Plotly Charts]
        MAP[Choropleth Map]
        KPI[KPI Cards]
    end
    
    CSV1 --> DL
    CSV2 --> DL
    CSV3 --> DL
    GEO --> MAP
    
    AGG --> WF
    AGG --> MA
    AGG --> AD
    
    WF --> CHARTS
    MA --> MAP
    AD --> KPI
    
    CHARTS --> UI
    MAP --> UI
    KPI --> UI
```

---

## 3. Data Flow

```mermaid
sequenceDiagram
    participant User
    participant Dashboard
    participant DataLoader
    participant Analytics
    participant Charts
    
    User->>Dashboard: Open Dashboard
    Dashboard->>DataLoader: Load CSVs
    DataLoader->>DataLoader: Parse Dates
    DataLoader->>DataLoader: Standardize Districts
    DataLoader-->>Dashboard: Cleaned DataFrames
    
    User->>Dashboard: Apply Filters
    Dashboard->>Analytics: Filter Data
    
    par Module A
        Analytics->>Analytics: Calculate Workload Projections
    and Module B
        Analytics->>Analytics: Calculate Migration Ratios
    and Module C
        Analytics->>Analytics: Detect Anomalies
    end
    
    Analytics-->>Charts: Processed Data
    Charts-->>Dashboard: Plotly Figures
    Dashboard-->>User: Rendered Dashboard
```

---

## 4. Module Architecture

### Module A: Workload Forecasting

```mermaid
graph LR
    subgraph Input
        E[Enrolment Data]
        B[Biometric Data]
    end
    
    subgraph Processing
        AGE[Age Group Analysis]
        TS[Time Series Analysis]
    end
    
    subgraph Output
        PROJ[Mandatory Update Projections]
        FORE[3-Month Forecast]
    end
    
    E --> AGE
    B --> AGE
    E --> TS
    
    AGE --> |age_0_5 / 6| PROJ
    AGE --> |age_5_17 / 13| PROJ
    TS --> |Exponential Smoothing| FORE
```

**Logic:**
- Children aged 4 (1/6 of age_0_5) → Must update at age 5
- Children aged 14 (1/13 of age_5_17) → Must update at age 15

### Module B: Migration Analysis

```mermaid
graph LR
    subgraph Input
        EN[New Enrolments]
        DU[Demographic Updates]
    end
    
    subgraph Calculation
        RATIO[Migration Ratio = DU / EN]
    end
    
    subgraph Classification
        HIGH[High > 0.7<br/>Urban Hub]
        MED[0.4 - 0.7<br/>Moderate]
        LOW[< 0.4<br/>Stable Rural]
    end
    
    EN --> RATIO
    DU --> RATIO
    
    RATIO --> HIGH
    RATIO --> MED
    RATIO --> LOW
```

### Module C: Anomaly Detection

```mermaid
graph TB
    subgraph Detection Methods
        VOL[Volume Anomalies<br/>Z-score > 2σ]
        AGE[Age Distribution<br/>Deviation > 15%]
        GEN[Gender Ratio<br/>Outside 47-53%]
        TEMP[Temporal Patterns<br/>Sharp Drops]
    end
    
    subgraph Severity
        CRIT[🔴 Critical]
        WARN[🟡 Warning]
        INFO[🔵 Info]
    end
    
    VOL --> WARN
    AGE --> INFO
    GEN --> CRIT
    TEMP --> WARN
```

---

## 5. Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | Streamlit 1.31+ |
| **Visualization** | Plotly 5.18+ |
| **Data Processing** | Pandas, NumPy |
| **Forecasting** | Statsmodels (Exponential Smoothing) |
| **Geospatial** | GeoJSON + Plotly Mapbox |
| **Styling** | Custom CSS (UIDAI Branding) |

---

## 6. Directory Structure

```
Project/
├── app.py                    # Entry point
├── requirements.txt          # Dependencies
│
├── src/
│   ├── config.py            # Constants & thresholds
│   ├── data_loader.py       # Data ingestion
│   │
│   ├── analytics/
│   │   ├── workload_forecasting.py   # Module A
│   │   ├── migration_analysis.py     # Module B
│   │   └── anomaly_detection.py      # Module C
│   │
│   └── components/
│       ├── styles.py        # CSS injection
│       └── charts.py        # Chart factories
│
├── Datasets/                # Input data
├── assets/                  # GeoJSON
└── docs/                    # Documentation
```

---

## 7. Configuration

Key thresholds defined in `src/config.py`:

```python
# Workload Forecasting
AGE_MANDATORY_UPDATE_5 = 5
AGE_MANDATORY_UPDATE_15 = 15

# Migration Analysis
MIGRATION_THRESHOLD_HIGH = 0.7
MIGRATION_THRESHOLD_MEDIUM = 0.4

# Anomaly Detection
GENDER_RATIO_LOWER = 0.47
GENDER_RATIO_UPPER = 0.53
ANOMALY_STD_THRESHOLD = 2.0
```

---

## 8. Branding

Following UIDAI guidelines:

```css
--uidai-red: #B72025;
--uidai-yellow: #FDB913;
--background: #FFFFFF;
--text-primary: #1A1A2E;
```

---

## 9. Deployment

### Local Development
```bash
pip install -r requirements.txt
streamlit run app.py
```

### Production (Streamlit Cloud)
1. Push to GitHub
2. Connect repository to Streamlit Cloud
3. Set Python version: 3.9+
4. Deploy

---

*Document generated for UIDAI Data Hackathon 2026*
