"""
Custom CSS Styles for UIDAI Ops-Intel Dashboard
Professional government dashboard with UIDAI branding
"""

CUSTOM_CSS = """
<style>
    /* ============================================
       UIDAI OPS-INTEL DASHBOARD STYLES
       Colors: Primary #B72025, Secondary #FDB913
    ============================================ */
    
    /* Import Professional Font */
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
    
    /* Root Variables */
    :root {
        --uidai-red: #B72025;
        --uidai-red-dark: #8B181C;
        --uidai-yellow: #FDB913;
        --uidai-yellow-light: #FFC94D;
        --bg-primary: #FFFFFF;
        --bg-secondary: #F8F9FA;
        --bg-tertiary: #E9ECEF;
        --text-primary: #1A1A2E;
        --text-secondary: #6C757D;
        --shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
        --shadow-md: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06);
        --shadow-lg: 0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05);
        --shadow-glow: 0 0 15px rgba(183, 32, 37, 0.2);
        --radius-sm: 8px;
        --radius-md: 12px;
        --radius-lg: 20px;
        --glass-bg: rgba(255, 255, 255, 0.7);
        --glass-border: rgba(255, 255, 255, 0.3);
    }
    
    /* Global Styles */
    .stApp {
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        background: radial-gradient(circle at top right, #FAFBFC, #F0F2F5);
    }
    
    /* Hide Streamlit Branding */
    #MainMenu {visibility: hidden;}
    footer {visibility: hidden;}
    header {visibility: hidden;}
    
    /* Main Header */
    .main-header {
        background: linear-gradient(135deg, var(--uidai-red) 0%, var(--uidai-red-dark) 100%);
        color: white;
        padding: 1.5rem 2rem;
        border-radius: var(--radius-lg);
        margin-bottom: 2rem;
        box-shadow: var(--shadow-lg);
        position: relative;
        overflow: hidden;
    }
    
    .main-header::before {
        content: '';
        position: absolute;
        top: -50%;
        right: -10%;
        width: 300px;
        height: 300px;
        background: rgba(255,255,255,0.05);
        border-radius: 50%;
    }
    
    .main-header::after {
        content: '';
        position: absolute;
        bottom: -60%;
        left: 10%;
        width: 200px;
        height: 200px;
        background: rgba(253,185,19,0.1);
        border-radius: 50%;
    }
    
    .main-header h1 {
        margin: 0;
        font-weight: 700;
        font-size: 1.75rem;
        letter-spacing: -0.025em;
        position: relative;
        z-index: 1;
    }
    
    .main-header p {
        margin: 0.5rem 0 0 0;
        opacity: 0.9;
        font-size: 0.95rem;
        font-weight: 400;
        position: relative;
        z-index: 1;
    }
    
    /* KPI Cards */
    .kpi-card {
        background: var(--glass-bg);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        border-radius: var(--radius-lg);
        padding: 1.5rem;
        box-shadow: var(--shadow-md);
        border: 1px solid var(--glass-border);
        transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        position: relative;
        overflow: hidden;
    }
    
    .kpi-card:hover {
        transform: translateY(-8px) scale(1.02);
        box-shadow: var(--shadow-lg), var(--shadow-glow);
        border-color: rgba(183, 32, 37, 0.2);
    }
    
    .kpi-card::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 4px;
        background: linear-gradient(90deg, var(--uidai-red), var(--uidai-yellow));
        z-index: 1;
    }

    .kpi-card::after {
        content: '';
        position: absolute;
        bottom: -20px;
        right: -20px;
        width: 80px;
        height: 80px;
        background: radial-gradient(circle, var(--uidai-red) 0%, transparent 70%);
        opacity: 0.03;
        border-radius: 50%;
    }
    
    .kpi-card .kpi-label {
        font-size: 0.75rem;
        color: var(--text-secondary);
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        margin-bottom: 0.75rem;
    }
    
    .kpi-card .kpi-value {
        font-size: 2.5rem;
        font-weight: 800;
        color: var(--text-primary);
        font-family: 'JetBrains Mono', monospace;
        line-height: 1;
        margin-bottom: 0.5rem;
    }
    
    .kpi-card .kpi-delta {
        font-size: 0.85rem;
        margin-top: 0.5rem;
        display: flex;
        align-items: center;
        gap: 0.25rem;
    }
    
    .kpi-delta.positive {
        color: #10B981;
    }
    
    .kpi-delta.negative {
        color: #EF4444;
    }
    
    /* Alert Cards */
    .alert-card {
        background: white;
        border-radius: var(--radius-md);
        padding: 1rem 1.25rem;
        margin-bottom: 1rem;
        border-left: 5px solid;
        box-shadow: var(--shadow-sm);
        transition: all 0.3s ease;
        position: relative;
    }
    
    .alert-card:hover {
        transform: translateX(4px);
        box-shadow: var(--shadow-md);
    }
    
    .alert-card.critical {
        border-color: #DC2626;
        background: linear-gradient(90deg, #FFF1F2 0%, white 100%);
        color: #991B1B;
    }
    
    .alert-card.warning {
        border-color: #F59E0B;
        background: linear-gradient(90deg, #FFFBEB 0%, white 100%);
        color: #92400E;
    }
    
    .alert-card.info {
        border-color: #3B82F6;
        background: linear-gradient(90deg, #EFF6FF 0%, white 100%);
        color: #1E40AF;
    }
    
    .alert-card .alert-type {
        font-size: 0.7rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        margin-bottom: 0.35rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        color: inherit;
        opacity: 0.8;
    }
    
    .alert-card.critical .alert-type::before {
        content: '🔴';
    }
    
    .alert-card.warning .alert-type::before {
        content: '⚠️';
    }
    
    /* Section Headers */
    .section-header {
        display: flex;
        align-items: center;
        gap: 1rem;
        margin-top: 2.5rem;
        margin-bottom: 1.5rem;
        padding: 1rem;
        background: rgba(0,0,0,0.02);
        border-radius: var(--radius-md);
        border-left: 4px solid var(--uidai-red);
    }
    
    .section-header h2 {
        margin: 0;
        font-size: 1.4rem;
        font-weight: 700;
        color: var(--text-primary);
        letter-spacing: -0.01em;
    }
    
    .section-icon {
        width: 36px;
        height: 36px;
        border-radius: var(--radius-sm);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.1rem;
    }
    
    .section-icon.red {
        background: linear-gradient(135deg, var(--uidai-red) 0%, var(--uidai-red-dark) 100%);
        color: white;
    }
    
    .section-icon.yellow {
        background: linear-gradient(135deg, var(--uidai-yellow) 0%, #E5A500 100%);
        color: var(--text-primary);
    }
    
    /* Chart Container */
    .chart-container {
        background: white;
        border-radius: var(--radius-lg);
        padding: 1.5rem;
        box-shadow: var(--shadow-md);
        margin-bottom: 1.5rem;
    }
    
    /* Sidebar Styling */
    .css-1d391kg, [data-testid="stSidebar"] {
        background: linear-gradient(180deg, #FFFFFF 0%, #F8F9FA 100%);
        border-right: 1px solid var(--bg-tertiary);
    }
    
    [data-testid="stSidebar"] .stMarkdown h3 {
        color: var(--uidai-red);
        font-weight: 600;
        font-size: 0.9rem;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        margin-top: 1.5rem;
    }
    
    /* Metrics Styling */
    [data-testid="stMetricValue"] {
        font-family: 'JetBrains Mono', monospace;
        font-weight: 700;
    }
    
    /* Dataframe Styling */
    .stDataFrame {
        border-radius: var(--radius-md);
        overflow: hidden;
        box-shadow: var(--shadow-sm);
    }
    
    /* Button Styling */
    .stButton > button {
        background: linear-gradient(135deg, var(--uidai-red) 0%, var(--uidai-red-dark) 100%);
        color: white;
        border: none;
        border-radius: var(--radius-sm);
        font-weight: 500;
        padding: 0.5rem 1.25rem;
        transition: all 0.2s ease;
    }
    
    .stButton > button:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(183, 32, 37, 0.3);
    }
    
    /* Tab Styling */
    .stTabs [data-baseweb="tab-list"] {
        gap: 0.5rem;
        background: var(--bg-secondary);
        padding: 0.25rem;
        border-radius: var(--radius-md);
    }
    
    .stTabs [data-baseweb="tab"] {
        border-radius: var(--radius-sm);
        font-weight: 500;
        font-size: 0.9rem;
    }
    
    .stTabs [aria-selected="true"] {
        background: white;
        box-shadow: var(--shadow-sm);
    }
    
    /* Expander Styling */
    .streamlit-expanderHeader {
        background: var(--bg-secondary);
        border-radius: var(--radius-sm);
        font-weight: 500;
    }
    
    /* Progress Bar */
    .stProgress > div > div {
        background: linear-gradient(90deg, var(--uidai-red), var(--uidai-yellow));
    }
    
    /* Selectbox */
    .stSelectbox [data-baseweb="select"] {
        border-radius: var(--radius-sm);
    }
    
    /* Date Input */
    .stDateInput input {
        border-radius: var(--radius-sm);
    }
    
    /* Divider */
    hr {
        border-color: var(--bg-tertiary);
        margin: 1.5rem 0;
    }
    
    /* Footer Badge */
    .footer-badge {
        text-align: center;
        padding: 1rem;
        margin-top: 2rem;
        color: var(--text-secondary);
        font-size: 0.8rem;
    }
    
    .footer-badge a {
        color: var(--uidai-red);
        text-decoration: none;
        font-weight: 500;
    }
    
    /* Animations */
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    .animate-fade-in {
        animation: fadeIn 0.5s ease-out forwards;
    }
    
    /* Responsive Adjustments */
    @media (max-width: 768px) {
        .main-header h1 {
            font-size: 1.5rem;
        }
        
        .kpi-card .kpi-value {
            font-size: 1.75rem;
        }
    }
</style>
"""


def get_custom_css() -> str:
    """Return the custom CSS for the dashboard."""
    return CUSTOM_CSS
