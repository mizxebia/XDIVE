"""
Excel Data Cleaning Script
Cleans messy enterprise Excel data and normalizes to standard column structure.
"""
 
import pandas as pd
import numpy as np
import re
from typing import Dict, List, Optional
 
 
# Target columns (standardized snake_case)
TARGET_COLUMNS = [
    'emp_id','emp_name','ee_group','region','service_line_code','designation','skill','location','customer','project_name','start_date','end_date','allocation_pct','billable_pct','bill_rate_per_hr','project_manager','operations_head','resource_type','project_type','ideal_hrs','actual_hrs','adjustment','ideal_revenue','actual_revenue','sow_start_date','sow_end_date','month','salary','support_expense','cost'
]
 
# Critical columns that must not be empty (rows will be dropped if missing)
CRITICAL_COLUMNS = [
    'emp_id', 'emp_name', 'customer', 'project_name',
    'start_date', 'end_date', 'allocation_pct',
    'billable_pct', 'actual_hrs', 'cost'
]
 
# Column type mappings
DATE_COLUMNS = [
    'start_date', 'end_date', 'sow_start_date', 'sow_end_date', 'month'
]
 
FLOAT_COLUMNS = [
    'allocation_pct', 'billable_pct', 'ideal_hrs', 'actual_hrs',
    'cost', 'bill_rate_per_hr', 'ideal_revenue', 'actual_revenue',
    'adjustment', 'salary', 'support_expense'
]
 
BOOLEAN_COLUMNS = []  # No boolean columns in the updated target columns
 
 
def normalize_column_name(col_name: str) -> str:
    """
    Normalize column names to snake_case.
    - Convert to lowercase
    - Strip whitespace
    - Replace line breaks, special characters with underscores
    - Remove multiple consecutive underscores
    """
    if pd.isna(col_name):
        return ''
   
    # Convert to string and lowercase
    col_str = str(col_name).lower().strip()
   
    # Replace line breaks, tabs, and various whitespace with spaces
    col_str = re.sub(r'[\n\r\t]+', ' ', col_str)
   
    # Replace special characters (except underscores) with spaces
    col_str = re.sub(r'[^\w\s]', ' ', col_str)
   
    # Replace spaces with underscores
    col_str = re.sub(r'\s+', '_', col_str)
   
    # Remove multiple consecutive underscores
    col_str = re.sub(r'_+', '_', col_str)
   
    # Remove leading/trailing underscores
    col_str = col_str.strip('_')
   
    return col_str
 
 
def create_column_mapping(df_columns: List[str]) -> Dict[str, Optional[str]]:
    """
    Create mapping from normalized source columns to target columns.
    Uses fuzzy matching based on common variations and aliases.
    """
    mapping = {}
    normalized_source = {normalize_column_name(col): col for col in df_columns}
   
    # Common aliases/variations for each target column
    column_aliases = {
        'emp_id': ['emp_id', 'employee_id', 'emp_id', 'id', 'employeeid', 'emp_id'],
        'emp_name': ['emp_name', 'employee_name', 'name', 'emp_name', 'employee_name'],
        'ee_group': ['ee_group', 'ee_group_name', 'group_name', 'group', 'employee_group'],
        'region': ['region'],
        'service_line_code': ['service_line_code', 'service_line', 'service', 'service_line_name', 'service_code'],
        'designation': ['designation', 'designation', 'title', 'job_title'],
        'skill': ['skill', 'skills', 'skill_set'],
        'location': ['location', 'loc'],
        'customer': ['customer', 'client', 'customer_name', 'client_name'],
        'project_name': ['project_name', 'project', 'project_name', 'proj_name'],
        'start_date': ['start_date', 'start', 'start_dt', 'startdate'],
        'end_date': ['end_date', 'end', 'end_dt', 'enddate'],
        'allocation_pct': ['allocation_pct', 'allocation', 'allocation_percent', 'alloc_pct', 'allocation%'],
        'billable_pct': ['billable_pct', 'billable', 'billable_percent', 'billable%'],
        'bill_rate_per_hr': ['bill_rate_per_hr', 'bill_rate', 'billing_rate', 'rate_per_hour', 'bill_rate_hr'],
        'project_manager': ['project_manager', 'pm', 'project_mgr', 'manager'],
        'operations_head': ['operations_head', 'ops_head', 'operations_lead'],
        'resource_type': ['resource_type', 'resource_type', 'res_type', 'type'],
        'project_type': ['project_type', 'project_type', 'proj_type'],
        'ideal_hrs': ['ideal_hrs', 'ideal_hours', 'ideal_hr', 'idealhours', 'final_hrs', 'final_hours'],
        'actual_hrs': ['actual_hrs', 'actual_hours', 'actual_hr', 'actualhours', 'hours'],
        'adjustment': ['adjustment', 'adj', 'adjustments'],
        'ideal_revenue': ['ideal_revenue', 'ideal_rev', 'planned_revenue'],
        'actual_revenue': ['actual_revenue', 'actual_rev', 'revenue'],
        'sow_start_date': ['sow_start_date', 'sow_start', 'sow_start_dt'],
        'sow_end_date': ['sow_end_date', 'sow_end', 'sow_end_dt'],
        'month': ['month', 'month_name', 'reporting_month'],
        'salary': ['salary', 'sal', 'salary_amount'],
        'support_expense': ['support_expense', 'support_exp', 'expense', 'support_cost'],
        'cost': ['cost', 'total_cost', 'cost_amount']
    }
   
    # Map normalized source columns to target columns
    # First, check if normalized column name directly matches target column
    for target_col in TARGET_COLUMNS:
        if target_col in normalized_source and normalized_source[target_col] not in mapping:
            mapping[normalized_source[target_col]] = target_col
   
    # Then, check aliases
    for target_col, aliases in column_aliases.items():
        for alias in aliases:
            normalized_alias = normalize_column_name(alias)
            if normalized_alias in normalized_source and normalized_source[normalized_alias] not in mapping:
                mapping[normalized_source[normalized_alias]] = target_col
                break
   
    return mapping
 
 
def clean_dataframe(df: pd.DataFrame) -> tuple:
    """
    Clean the DataFrame according to all specified rules.
    Returns: (cleaned_df, original_row_count, dropped_row_count)
    """
    original_row_count = len(df)
   
    # Step 1: Normalize column names and create mapping
    column_mapping = create_column_mapping(df.columns.tolist())
   
    # Step 2: Select only columns that map to target columns (remove non-relevant columns)
    columns_to_keep = [col for col in df.columns if col in column_mapping]
    df = df[columns_to_keep].copy()
   
    # Step 3: Rename columns to target names
    df = df.rename(columns=column_mapping)
   
    # Step 4: Create empty DataFrame with all target columns if no columns matched
    # Otherwise, add missing target columns as empty
    for target_col in TARGET_COLUMNS:
        if target_col not in df.columns:
            df[target_col] = np.nan
   
    # Step 5: Reorder columns to match TARGET_COLUMNS order
    df = df[TARGET_COLUMNS]
   
    # Step 6: Convert all columns to string initially for safe cleaning
    for col in df.columns:
        df[col] = df[col].astype(str)
   
    # Step 7: Trim spaces and replace empty strings, "NA", "N/A", "null" with np.nan
    for col in df.columns:
        df[col] = df[col].str.strip()
        # Replace empty strings and common null representations with NaN
        null_values = ['', 'nan', 'NaN', 'None', 'none', 'NA', 'N/A', 'n/a', 'null', 'NULL']
        df[col] = df[col].where(~df[col].isin(null_values), np.nan)
   
    # Step 8: Drop rows where ANY critical column is missing
    # Filter to only check columns that exist in the DataFrame
    critical_cols_present = [col for col in CRITICAL_COLUMNS if col in df.columns]
    if critical_cols_present:
        df = df.dropna(subset=critical_cols_present)
   
    dropped_row_count = original_row_count - len(df)
   
    # Step 9: Convert data types AFTER cleaning and dropping rows
    # Dates - convert to datetime and normalize to date only (no time component)
    for col in DATE_COLUMNS:
        if col in df.columns:
            df[col] = pd.to_datetime(df[col], errors='coerce')
            # Normalize to date only (remove time component)
            df[col] = df[col].dt.normalize()
   
    # Floats
    for col in FLOAT_COLUMNS:
        if col in df.columns:
            df[col] = pd.to_numeric(df[col], errors='coerce')
            # Replace negative values with 0
            df[col] = df[col].clip(lower=0)
   
    # Boolean
    for col in BOOLEAN_COLUMNS:
        if col in df.columns:
            # Convert string representations to boolean
            # Replace common boolean string representations
            bool_replacements = {
                'True': True, 'true': True, 'TRUE': True, '1': True,
                'Yes': True, 'yes': True, 'YES': True, 'Y': True, 'y': True,
                'False': False, 'false': False, 'FALSE': False, '0': False,
                'No': False, 'no': False, 'NO': False, 'N': False, 'n': False
            }
            df[col] = df[col].replace(bool_replacements)
            # Convert to boolean type (treats NaN as missing, not False)
            df[col] = df[col].astype('boolean')
   
    # Step 10: Additional data cleaning - drop rows where specified columns are missing
    additional_check_columns = [
        'emp_id', 'emp_name', 'designation', 'skill', 'project_manager', 'resource_type'
    ]
   
    # Filter to only check columns that exist in the DataFrame
    additional_cols_present = [col for col in additional_check_columns if col in df.columns]
   
    if additional_cols_present:
        # Create a mask to identify missing values
        # Missing values include: NaN, None, empty strings, whitespace-only, "NA", "N/A", "null", "NULL"
        missing_mask = pd.Series(False, index=df.index)
       
        for col in additional_cols_present:
            # Check for NaN/None
            col_missing = df[col].isna()
           
            # Check for empty strings or whitespace-only (for string columns)
            if df[col].dtype == 'object':
                col_missing = col_missing | (df[col].astype(str).str.strip() == '')
                # Check for common null representations (case-insensitive)
                null_strings = ['na', 'n/a', 'null']
                col_missing = col_missing | (df[col].astype(str).str.strip().str.lower().isin(null_strings))
           
            missing_mask = missing_mask | col_missing
       
        # Drop rows where ANY of the specified columns is missing
        rows_before = len(df)
        df = df[~missing_mask]
        dropped_row_count += (rows_before - len(df))
   
    return df, original_row_count, dropped_row_count
 
 
def main():
    """Main execution function."""
    input_file = 'db.xlsx'
    output_file = 'cleaned_db.xlsx'
   
    print(f"Reading Excel file: {input_file}")
   
    # Read Excel file
    try:
        df = pd.read_excel(input_file, engine='openpyxl')
    except Exception as e:
        print(f"Error reading file: {e}")
        return
   
    print(f"Original shape: {df.shape}")
    print(f"Original columns: {len(df.columns)}")
   
    # Clean the DataFrame
    print("\nCleaning data...")
    df_cleaned, original_row_count, dropped_row_count = clean_dataframe(df)

   
    # Save cleaned DataFrame
    print(f"\nSaving cleaned data to: {output_file}")
    # df_cleaned.to_excel(output_file, index=False, engine='openpyxl')
   
    # # Print summary statistics
    # print("\n" + "="*50)
    # print("CLEANING SUMMARY")
    # print("="*50)
    # print(f"Original row count: {original_row_count:,}")
    # print(f"Final row count: {len(df_cleaned):,}")
    # print(f"Dropped row count: {dropped_row_count:,}")
    # print(f"Columns in output: {len(df_cleaned.columns)}")
    # print("="*50)
   
    # print(f"\nCleaned data saved successfully to {output_file}")
    return df_cleaned
 
if __name__ == '__main__':
    main()