"""
Script to find the oldest dates in all datasets used in the project
"""

import pandas as pd
from pathlib import Path
from datetime import datetime

def find_oldest_date_in_dataset(file_path):
    """
    Find the oldest date in a CSV dataset
    
    Args:
        file_path: Path to the CSV file
        
    Returns:
        Tuple of (oldest_date, total_records)
    """
    try:
        # Read the CSV file
        df = pd.read_csv(file_path)
        
        # Check if 'date' column exists
        if 'date' not in df.columns:
            return None, 0
        
        # Convert date column to datetime
        df['date'] = pd.to_datetime(df['date'], format='%d-%m-%Y', errors='coerce')
        
        # Remove any NaT (Not a Time) values
        df = df.dropna(subset=['date'])
        
        if len(df) == 0:
            return None, 0
        
        # Find the oldest date
        oldest_date = df['date'].min()
        total_records = len(df)
        
        return oldest_date, total_records
        
    except Exception as e:
        print(f"Error processing {file_path.name}: {str(e)}")
        return None, 0


def main():
    """Main function to process all datasets"""
    
    # Define the datasets directory
    datasets_dir = Path(__file__).parent / 'Datasets'
    
    # Define the datasets to analyze
    datasets = [
        'Aadhaar Biometric Montly Update Data Telangana.csv',
        'Aadhaar Demographic Montly Update Data Telangana.csv',
        'Aadhaar Enrolment montly data Telangana.csv'
    ]
    
    print("=" * 80)
    print("OLDEST DATES IN AADHAAR DATASETS - TELANGANA")
    print("=" * 80)
    print()
    
    oldest_overall = None
    
    for dataset_name in datasets:
        dataset_path = datasets_dir / dataset_name
        
        if not dataset_path.exists():
            print(f"⚠️  Dataset not found: {dataset_name}")
            print()
            continue
        
        print(f"📊 Dataset: {dataset_name}")
        print("-" * 80)
        
        oldest_date, total_records = find_oldest_date_in_dataset(dataset_path)
        
        if oldest_date:
            print(f"   Oldest Date: {oldest_date.strftime('%d-%m-%Y')}")
            print(f"   Total Records: {total_records:,}")
            print()
            
            # Track the oldest date overall
            if oldest_overall is None or oldest_date < oldest_overall:
                oldest_overall = oldest_date
        else:
            print(f"   ❌ Could not find valid dates in this dataset")
            print()
    
    print("=" * 80)
    if oldest_overall:
        print(f"🕐 OLDEST RECORD ACROSS ALL DATASETS: {oldest_overall.strftime('%d-%m-%Y')}")
        print(f"   ({oldest_overall.strftime('%B %d, %Y')})")
    else:
        print("❌ No valid dates found in any dataset")
    print("=" * 80)


if __name__ == "__main__":
    main()
