import pandas as pd
from db.connection import db

class IngestionEngine:

    def ingest_excel(self, file_path, clean_function, table_name):
        try:
            # Step 1: Load Excel
            df = pd.read_excel(file_path)

            # Step 2: Clean it using your function
            clean_df = clean_function(df)

            # Step 3: Convert to list of dicts
            records = clean_df.to_dict(orient="records")

            # Step 4: Insert into Postgres
            inserted = db.bulk_insert(table_name, records)

            return {
                "success": True,
                "rows_inserted": inserted
            }

        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            }

    
ingestion_engine = IngestionEngine()
