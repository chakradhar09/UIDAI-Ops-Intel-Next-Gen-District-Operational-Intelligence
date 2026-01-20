"""
Configuration settings for UIDAI Ops-Intel Dashboard
"""
from pathlib import Path

# ============================================================================
# PATHS
# ============================================================================
# src/, Datasets/, and assets/ are all inside backend/
BASE_DIR = Path(__file__).parent.parent  # backend/src -> backend
DATASETS_DIR = BASE_DIR / "Datasets"
ASSETS_DIR = BASE_DIR / "assets"

# Data files
ENROLMENT_DATA = DATASETS_DIR / "Aadhaar Enrolment montly data Telangana.csv"
BIOMETRIC_UPDATE_DATA = DATASETS_DIR / "Aadhaar Biometric Montly Update Data Telangana.csv"
DEMOGRAPHIC_UPDATE_DATA = DATASETS_DIR / "Aadhaar Demographic Montly Update Data Telangana.csv"
GEOJSON_FILE = ASSETS_DIR / "telangana_districts.geojson"

# ============================================================================
# UIDAI BRANDING
# ============================================================================
COLORS = {
    "primary": "#B72025",      # Aadhaar Red
    "secondary": "#FDB913",    # Aadhaar Yellow
    "background": "#FFFFFF",   # White
    "surface": "#F8F9FA",      # Light Gray
    "text_primary": "#1A1A2E", # Dark Navy
    "text_secondary": "#6C757D",
    "success": "#28A745",
    "warning": "#FFC107",
    "danger": "#DC3545",
    "info": "#17A2B8",
}

# Gradient for charts
GRADIENT_COLORS = [
    "#FDB913",  # Yellow
    "#F4A012",
    "#E98711",
    "#DE6E10",
    "#D3550F",
    "#C83C0E",
    "#BD230D",
    "#B72025",  # Red
]

# ============================================================================
# ANALYTICS THRESHOLDS
# ============================================================================

# Module A: Workload Forecasting
AGE_MANDATORY_UPDATE_5 = 5   # Children must update biometrics at age 5
AGE_MANDATORY_UPDATE_15 = 15  # Must update biometrics at age 15
FORECAST_HORIZON_DAYS = 90    # Predict next 90 days

# Module B: Migration Pattern Analysis
MIGRATION_THRESHOLD_HIGH = 0.7   # High migration if update ratio > 0.7
MIGRATION_THRESHOLD_MEDIUM = 0.4  # Medium if between 0.4 and 0.7
# Low if < 0.4

# Module C: Anomaly Detection
GENDER_RATIO_LOWER = 0.47  # Flag if female % < 47%
GENDER_RATIO_UPPER = 0.53  # Flag if female % > 53%
ANOMALY_STD_THRESHOLD = 2.0  # Flag if value > 2 std deviations

# ============================================================================
# DISTRICT NAME MAPPING (for standardization)
# ============================================================================
DISTRICT_NAME_MAPPING = {
    "K.v. Rangareddy": "Rangareddy",
    "K.V. Rangareddy": "Rangareddy",
    "Ranga Reddy": "Rangareddy",
    "RangaReddy": "Rangareddy",
    "Medchal−malkajgiri": "Medchal-Malkajgiri",
    "Medchal-malkajgiri": "Medchal-Malkajgiri",
    "Medchal Malkajgiri": "Medchal-Malkajgiri",
    "Jangoan": "Jangaon",
    "Jagtial": "Jagtial",
    "Jagitial": "Jagtial",
    "Warangal Urban": "Warangal",
    "Warangal Rural": "Warangal",
    "Komaram Bheem Asifabad": "Komaram Bheem",
    "Komaram Bheem": "Komaram Bheem",
}

# Official 33 Districts of Telangana
TELANGANA_DISTRICTS = [
    "Adilabad", "Bhadradri Kothagudem", "Hanumakonda", "Hyderabad",
    "Jagtial", "Jangaon", "Jayashankar Bhupalpally", "Jogulamba Gadwal",
    "Kamareddy", "Karimnagar", "Khammam", "Komaram Bheem",
    "Mahabubabad", "Mahabubnagar", "Mancherial", "Medak",
    "Medchal-Malkajgiri", "Mulugu", "Nagarkurnool", "Nalgonda",
    "Narayanpet", "Nirmal", "Nizamabad", "Peddapalli",
    "Rajanna Sircilla", "Rangareddy", "Sangareddy", "Siddipet",
    "Suryapet", "Vikarabad", "Wanaparthy", "Warangal",
    "Yadadri Bhuvanagiri"
]
