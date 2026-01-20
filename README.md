# 🏛️ UIDAI Ops-Intel Dashboard

**District Operational Intelligence Dashboard for Telangana**

A comprehensive full-stack analytics dashboard for UIDAI (Unique Identification Authority of India) operations, designed to optimize Aadhaar enrolment and update workflows by predicting workload, analyzing migration patterns, and spotting anomalies using internal operational data.

![UIDAI Branding](https://img.shields.io/badge/UIDAI-Data%20Hackathon%202026-B72025?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-14-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-0.109+-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![Python](https://img.shields.io/badge/Python-3.9+-3776AB?style=for-the-badge&logo=python&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4+-38B2AC?style=for-the-badge&logo=tailwindcss&logoColor=white)

---

## 🎯 Overview

This project features a **modern decoupled architecture**:
- **Frontend**: Next.js 14 (App Router) with Tailwind CSS, Tremor components & Framer Motion animations
- **Backend**: FastAPI (Python) exposing REST APIs for all analytics
- **Data Layer**: CSV files processed with Pandas (no database required)

---

## 📊 Features

### Module A: Workload Forecasting 📈
- **Age Trigger Analysis**: Identifies users aged 5 and 15 who require mandatory biometric updates
- **Projected Updates**: Interactive bar charts showing district-wise mandatory update projections
- **Time Series Forecast**: Exponential smoothing-based enrolment predictions with confidence intervals
- **District Health Scores**: Real-time assessment of operational capacity

### Module B: Migration Pattern Analysis 🗺️
- **Update Ratio Calculation**: `Demographic Updates / New Enrolments`
- **Migration Intensity Scoring**: Districts classified as High (>0.7), Medium (0.4-0.7), or Stable (<0.4)
- **Interactive Choropleth Map**: Telangana district map with React-Leaflet, shaded by migration intensity
- **AI-Powered Insights**: Contextual explanations for migration ratios

### Module C: Anomaly Detection 🚨
- **Gender Anomaly Flags**: Districts with female enrolment outside 47%-53% expected range
- **Volume Anomalies**: Statistical outliers using Z-score detection (>2σ)
- **Age Distribution Anomalies**: Unusual demographic patterns flagged automatically
- **Alert System**: Categorized alerts (Critical, Warning, Info) with real-time updates

---

## 🎨 UI & Branding

Follows strict **UIDAI Guidelines** with a modern, professional color palette:

### Color Scheme

#### Primary Brand Colors (UIDAI Official)
| Color | Hex | Usage |
|-------|-----|-------|
| **Navy Blue** | `#1a4480` | Primary brand color, headers, important CTAs |
| **Saffron Orange** | `#f26522` | Secondary brand, warnings, highlights |
| **Tricolor Green** | `#2e7d32` | Success states, positive indicators |

#### Legacy Aadhaar Colors (Supporting)
| Color | Hex | Usage |
|-------|-----|-------|
| **Aadhaar Red** | `#B72025` | Chart gradients, accent elements |
| **Aadhaar Yellow** | `#FDB913` | Chart gradients, warm accents |

#### UI System Colors
| Color | Hex | Usage |
|-------|-----|-------|
| **Background** | `#FFFFFF` | Main background |
| **Surface** | `#F8FAFC` | Card backgrounds, panels |
| **Text Primary** | `#1A1A2E` | Main text content |
| **Text Secondary** | `#6C757D` | Supporting text |
| **Danger** | `#EF4444` | Error states, critical alerts |
| **Info** | `#1a4480` | Information badges |

#### Chart Gradient (Red → Yellow)
```
#FDB913 → #F4A012 → #E98711 → #DE6E10 → #D3550F → #C83C0E → #BD230D → #B72025
```

### Typography
- **UI Font**: Inter (clean, modern sans-serif)
- **Data Font**: JetBrains Mono (monospace for numbers)
- **Display Font**: Cal Sans (headlines and hero text)

### Components
- **Framework**: Tremor dashboard components (built on Recharts)
- **Styling**: Tailwind CSS with custom UIDAI theme
- **Animations**: Framer Motion for smooth transitions

### Chart Architecture
The dashboard uses a **hybrid approach**:
- **Tremor**: Pre-styled, dashboard-ready React components with built-in responsiveness
- **Recharts**: Underlying charting engine powering Tremor's visualizations
- **Pattern**: `React Component → Tremor Wrapper → Recharts Primitive → SVG Rendering`

This gives us:
- ✅ Tremor's simplicity and beautiful defaults
- ✅ Recharts' power and flexibility
- ✅ Consistent UIDAI branding across all charts

---

## 📁 Project Structure

```
Project/
├── frontend/                       # Next.js 14 Application
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx         # Root layout with fonts
│   │   │   ├── page.tsx           # Main entry (redirects)
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx       # Main dashboard page
│   │   │   └── landing/
│   │   │       └── page.tsx       # Landing page
│   │   ├── components/
│   │   │   ├── ui/                # KPICard, AlertBadge, etc.
│   │   │   ├── charts/            # Tremor chart components
│   │   │   ├── map/               # React-Leaflet map
│   │   │   └── layout/            # Sidebar navigation
│   │   └── lib/
│   │       ├── api.ts             # API client functions
│   │       └── utils.ts           # Utility helpers
│   ├── package.json
│   └── tailwind.config.ts
│
├── backend/                        # FastAPI Application
│   ├── main.py                    # API routes & entry point
│   └── requirements.txt
│
├── src/                           # Shared Python Analytics Engine
│   ├── config.py                  # Configuration & constants
│   ├── data_loader.py             # Data loading & preprocessing
│   └── analytics/
│       ├── workload_forecasting.py  # Module A
│       ├── migration_analysis.py    # Module B
│       └── anomaly_detection.py     # Module C
│
├── Datasets/                      # UIDAI Data (CSV files)
├── assets/                        # GeoJSON & static assets
├── docs/                          # Architecture & specs
├── Reports/                       # Status reports & documentation
└── legacy/                        # Deprecated Streamlit dashboard
```

---

## 🚀 Quick Start

### Prerequisites
- **Node.js 18+** and npm/yarn
- **Python 3.9+** and pip

### Installation & Setup

#### 1. Start the Backend (FastAPI)

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```
Backend will be available at `http://localhost:8000`  
API docs at `http://localhost:8000/docs`

#### 2. Start the Frontend (Next.js)

```bash
cd frontend
npm install
npm run dev
```
Frontend will be available at `http://localhost:3000`

#### 3. Access the Dashboard

Open your browser and navigate to `http://localhost:3000/dashboard`

---

## � API Endpoints

The FastAPI backend exposes the following endpoints:

### Core Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/v1/summary` | Complete dashboard summary |
| GET | `/api/v1/config` | Dashboard configuration |

### Workload Forecasting (Module A)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/workload/forecast` | Historical + forecast data |
| GET | `/api/v1/workload/projections` | Mandatory update projections |

### Migration Analysis (Module B)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/migration/choropleth` | Map visualization data |
| GET | `/api/v1/migration/trends` | Monthly migration trends |
| GET | `/api/v1/geojson` | Telangana GeoJSON |

### Anomaly Detection (Module C)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/anomalies` | Detected anomalies |
| GET | `/api/v1/districts/health` | District health scores |

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

## � Screenshots

### Dashboard Overview
The main dashboard features:
- **KPI Cards**: Total enrolments, predicted updates, high migration districts, and anomaly counts
- **Interactive Charts**: Tremor-powered visualizations for forecasting, projections, and trends
- **Choropleth Map**: District-level migration intensity visualization
- **Real-time Alerts**: Categorized anomaly detection with severity levels

### Key Visualizations
1. **Workload Forecasting Chart**: Tremor AreaChart (Recharts-powered) - Historical data + 12-month forecast with confidence intervals
2. **District Projections**: Tremor BarChart - Stacked bar chart showing mandatory updates by district
3. **Migration Trends**: Tremor AreaChart - Time series analysis of demographic patterns
4. **Health Gauges**: Tremor ProgressCircle - District operational health scores
5. **Age Distribution**: Tremor DonutChart (Recharts PieChart) - Demographic breakdowns

---

## 🚀 Deployment

### Production Deployment Options

#### Option 1: Vercel (Frontend) + Railway/Render (Backend)

**Frontend (Vercel)**:
```bash
cd frontend
vercel deploy --prod
```

**Backend (Railway)**:
```bash
cd backend
railway up
```

#### Option 2: Docker Compose

Create `docker-compose.yml` in root:
```yaml
version: '3.8'
services:
  backend:
    build: ./backend
    ports:
      - "8000:8000"
    volumes:
      - ./Datasets:/app/Datasets
      - ./assets:/app/assets
  
  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://backend:8000
    depends_on:
      - backend
```

Then run:
```bash
docker-compose up --build
```

---

## 🐛 Troubleshooting

### Common Issues

**1. Backend fails to start**
- Ensure Python 3.9+ is installed: `python --version`
- Check if port 8000 is available: `netstat -ano | findstr :8000` (Windows)
- Verify CSV files exist in `Datasets/` folder

**2. Frontend can't connect to backend**
- Verify backend is running at `http://localhost:8000`
- Check CORS settings in `backend/main.py`
- Try accessing `http://localhost:8000/docs` to confirm API is up

**3. Map not displaying**
- Ensure `assets/telangana_districts.geojson` exists
- Check browser console for Leaflet errors
- Verify GeoJSON endpoint: `http://localhost:8000/api/v1/geojson`

**4. Charts not rendering**
- Clear browser cache
- Check API responses in Network tab
- Verify data format in browser console

---

## �🛡️ Security Notes

- No external APIs or credentials required
- All data processing is local
- CORS configured for local development
- No sensitive data exposed in frontend

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Frontend** | Next.js 14 | React framework with App Router |
| **Styling** | Tailwind CSS | Utility-first CSS framework |
| **Animations** | Framer Motion | Smooth UI animations |
| **Charts (UI)** | Tremor | Dashboard components & wrappers |
| **Charts (Engine)** | Recharts | Underlying charting library |
| **Map** | React-Leaflet | Interactive choropleth map |
| **Icons** | Lucide React | Beautiful icons |
| **Backend** | FastAPI | High-performance Python API |
| **Data** | Pandas, NumPy | Analytics engine |
| **Forecasting** | Statsmodels | Time series forecasting |

---

## � Documentation

Detailed documentation available in `docs/`:
- [ARCHITECTURE_V2.md](docs/ARCHITECTURE_V2.md) - Complete system architecture
- [specs/](docs/specs/) - Feature specifications and contracts
- [Reports/](Reports/) - Development progress reports

---

## 🤝 Contributing

This project was developed for the UIDAI Data Hackathon 2026. 

### Development Workflow
1. Create feature branch: `git checkout -b feature/your-feature`
2. Make changes and test locally
3. Run linting: `npm run lint` (frontend) / `black .` (backend)
4. Commit with descriptive message
5. Push and create pull request

---

## 🙏 Acknowledgments

- **UIDAI** for providing the dataset and hosting the hackathon
- **Tremor** for beautiful dashboard components
- **FastAPI** for the high-performance backend framework
- **Next.js** team for the excellent React framework

---

## �📝 License

Developed for **UIDAI Data Hackathon 2026**

---

## 👨‍💻 Team

Built with ❤️ for the UIDAI Data Hackathon

**Tech Stack**: Next.js 14 • FastAPI • Tailwind CSS • Tremor • Python • Pandas
