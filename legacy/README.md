# Legacy Files

This folder contains the original Streamlit-based dashboard implementation.

## Files

- **app.py** - Original Streamlit dashboard (deprecated)
- **find_oldest_dates.py** - Utility script for date analysis

## Why Deprecated?

The project has migrated to a modern **Next.js + FastAPI** architecture for:
- Better UI/UX with Tremor components
- Proper separation of concerns (frontend/backend)
- API-first architecture
- Better performance and scalability
- Professional dashboard experience

## Running Legacy Streamlit (Not Recommended)

If you need to run the old dashboard:

```bash
# Install Streamlit dependencies (not in current requirements.txt)
pip install streamlit plotly

# Run dashboard
streamlit run app.py
```

**Note**: The legacy dashboard is no longer maintained and may have outdated visualizations.
