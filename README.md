# 🏛️ UIDAI Ops-Intel Dashboard

**District Operational Intelligence Dashboard for Telangana**

A comprehensive analytics dashboard for UIDAI (Unique Identification Authority of India) operations, designed to optimize Aadhaar enrolment and update workflows by predicting workload and spotting anomalies using internal operational data.

![UIDAI Branding](https://img.shields.io/badge/UIDAI-Data%20Hackathon%202026-B72025?style=for-the-badge)
![Python](https://img.shields.io/badge/Python-3.9+-3776AB?style=for-the-badge&logo=python&logoColor=white)
![Streamlit](https://img.shields.io/badge/Streamlit-1.31+-FF4B4B?style=for-the-badge&logo=streamlit&logoColor=white)

---

## 📊 Features

### Module A: Workload Forecasting 📈
- **Age Trigger Analysis**: Identifies users aged 4 and 14 who require mandatory biometric updates
- **Projected Updates**: Bar charts showing district-wise mandatory update projections for the next 12 months
- **Time Series Forecast**: Exponential smoothing-based enrolment predictions

### Module B: Migration Pattern Analysis 🗺️
- **Update Ratio Calculation**: `Address Updates / New Enrolments`
- **Migration Intensity Scoring**: Districts classified as High (>0.7), Medium (0.4-0.7), or Stable (<0.4)
- **Choropleth Map**: Interactive Telangana district map shaded by migration intensity

### Module C: Anomaly Detection 🚨
- **Gender Anomaly Flags**: Districts with female enrolment outside 47%-53% range
- **Volume Anomalies**: Statistical outliers in enrolment patterns
- **Age Distribution Anomalies**: Unusual demographic patterns
- **Red Flags Sidebar**: Real-time critical alerts

---

## 🎨 UI & Branding

Follows strict **UIDAI Guidelines**:
- **Primary Color**: `#B72025` (Aadhaar Red)
- **Secondary Color**: `#FDB913` (Aadhaar Yellow)
- **Background**: Clean white with professional layout
- **Typography**: Inter & JetBrains Mono fonts

---

## 📁 Project Structure

```
Project/
├── app.py                          # Main Streamlit application
├── requirements.txt                # Python dependencies
├── README.md                       # Project documentation
│
├── Datasets/                       # UIDAI Data (provided)
│   ├── Aadhaar Enrolment montly data Telangana.csv
│   ├── Aadhaar Biometric Montly Update Data Telangana.csv
│   └── Aadhaar Demographic Montly Update Data Telangana.csv
│
├── assets/                         # Static assets
│   └── telangana_districts.geojson # District boundaries
│
├── src/                            # Source code
│   ├── __init__.py
│   ├── config.py                   # Configuration & constants
│   ├── data_loader.py              # Data loading & preprocessing
│   │
│   ├── analytics/                  # Analytics modules
│   │   ├── __init__.py
│   │   ├── workload_forecasting.py # Module A
│   │   ├── migration_analysis.py   # Module B
│   │   └── anomaly_detection.py    # Module C
│   │
│   └── components/                 # UI components
│       ├── __init__.py
│       ├── styles.py               # Custom CSS
│       └── charts.py               # Plotly chart functions
│
└── docs/                           # Documentation
    └── ...
```

---

## 🚀 Quick Start

### Prerequisites
- Python 3.9+
- pip

### Installation

1. **Clone/Navigate to project directory**
   ```bash
   cd "C:\KLH\Hackathon\UIDAI Data Hackathon 2026\Project"
   ```

2. **Create virtual environment (recommended)**
   ```bash
   python -m venv venv
   venv\Scripts\activate  # Windows
   # source venv/bin/activate  # Linux/Mac
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Run the dashboard**
   ```bash
   streamlit run app.py
   ```

5. **Open in browser**
   Navigate to `http://localhost:8501`

---

## 📊 Data Schema

### Enrolment Data
| Column | Description |
|--------|-------------|
| `date` | DD-MM-YYYY format |
| `state` | Telangana (fixed) |
| `district` | District name |
| `pincode` | 6-digit pincode |
| `age_0_5` | Enrolments for ages 0-5 |
| `age_5_17` | Enrolments for ages 5-17 |
| `age_18_greater` | Adult enrolments |

### Biometric Update Data
| Column | Description |
|--------|-------------|
| `date` | Update date |
| `bio_age_5_17` | Biometric updates for ages 5-17 |
| `bio_age_17_` | Biometric updates for 17+ |

### Demographic Update Data
| Column | Description |
|--------|-------------|
| `date` | Update date |
| `demo_age_5_17` | Demographic updates for ages 5-17 |
| `demo_age_17_` | Demographic updates for 17+ |

---

## 🔧 Configuration

Key settings in `src/config.py`:

```python
# UIDAI Branding Colors
COLORS = {
    "primary": "#B72025",    # Aadhaar Red
    "secondary": "#FDB913",  # Aadhaar Yellow
}

# Analytics Thresholds
MIGRATION_THRESHOLD_HIGH = 0.7
GENDER_RATIO_LOWER = 0.47
GENDER_RATIO_UPPER = 0.53
```

---

## 📈 Analytics Logic

### Migration Ratio Formula
```
Migration Intensity = (Demographic Updates) / (New Enrolments)
```
- **High (>0.7)**: Urban hub with high inward migration
- **Medium (0.4-0.7)**: Moderate population movement
- **Low (<0.4)**: Stable rural area

### Workload Projection
```
Projected Age 5 Updates = age_0_5 / 6  (1/6 are turning 5)
Projected Age 15 Updates = age_5_17 / 13  (1/13 are turning 15)
```

### Anomaly Detection
- **Volume**: Z-score > 2 standard deviations
- **Gender**: Female% outside 47-53% range
- **Age Distribution**: >15% deviation from expected ratios

---

## 🛡️ Security Notes

- No external APIs or credentials required
- All data processing is local
- No sensitive data exposed in frontend

---

## 📝 License

Developed for **UIDAI Data Hackathon 2026**

---

## 👨‍💻 Team

Built with ❤️ for the UIDAI Data Hackathon

**Tech Stack**: Python, Streamlit, Plotly, Pandas, NumPy
