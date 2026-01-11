import os
import google.generativeai as genai
import pandas as pd
from dotenv import load_dotenv
from db.connection import db 
from services.prompts import get_system_prompt, get_full_prompt

# Load env variables
load_dotenv()

# Configure Gemini
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

class GeminiSQLService:
    def __init__(self):
        # Configuration for the model to be strict (Temperature 0)
        self.generation_config = {
            "temperature": 0.0,
            "top_p": 1,
            "max_output_tokens": 2048,
            "response_mime_type": "text/plain",
        }
        
        self.model = genai.GenerativeModel(
            model_name="gemini-2.5-flash",
            system_instruction=get_system_prompt(),
            generation_config=self.generation_config,
        )

        # UPDATED SCHEMA (Source of Truth)
        self.ddl = """
        CREATE TABLE revenue (
            create table public.revenue (
            key text not,
            emp_id text,
            emp_name text,
            ee_group text,
            region text,
            service_line_code text,
            designation text,
            skill text,
            location text,
            customer text,
            project_name text,
            start_date date,
            end_date date,
            allocation_pct real,
            billable_pct real,
            project_manager text,
            operations_head text,
            resource_type text,
            project_type text,
            actual_hrs bigint,
            actual_revenue real,
            sow_start_date date,
            sow_end_date date,
            month date,
            salary bigint,
            support_expense bigint,
            cost bigint,
        );
        """

    def generate_and_execute(self, user_query: str):
        raw_sql = "N/A"
        try:
            # 1. Generate SQL from Gemini
            prompt = get_full_prompt(user_query, self.ddl)
            response = self.model.generate_content(prompt)
            
            # Clean the response (remove markdown)
            raw_sql = response.text.replace("```sql", "").replace("```", "").strip()
            
            print(f"DEBUG - Generated SQL: {raw_sql}") 

            # 2. Execute SQL using your existing Psycopg2 Connection
            # We use pandas.read_sql_query which accepts a raw psycopg2 connection
            with db.get_connection() as conn:
                df = pd.read_sql_query(raw_sql, conn)
                
            # 3. Handle Empty Results
            if df.empty:
                return {
                    "status": "success",
                    "sql": raw_sql,
                    "data": [],
                    "row_count": 0,
                    "message": "No records found matching your query."
                }

            # 4. Return Data
            return {
                "status": "success",
                "sql": raw_sql,
                "data": df.to_dict(orient="records"),
                "row_count": len(df)
            }

        except Exception as e:
            print(f"ERROR executing SQL: {e}")
            return {
                "status": "error",
                "error": str(e),
                "sql": raw_sql
            }

# Singleton Instance
sql_service = GeminiSQLService()