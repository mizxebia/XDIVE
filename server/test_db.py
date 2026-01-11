import os
import pandas as pd
import psycopg2
from dotenv import load_dotenv

load_dotenv()

df = pd.read_excel("C:\Work\Tech_AI_Thon\XDIVE\server\Degree.xlsb")

conn = psycopg2.connect(
    host=os.getenv("DB_HOST"),
    port=os.getenv("DB_PORT"),
    dbname=os.getenv("DB_NAME"),
    user=os.getenv("DB_USER"),
    password=os.getenv("DB_PASSWORD"),
    sslmode="require"   # Required for Supabase
)

cur = conn.cursor()
cur.execute("SELECT version();")
print(cur.fetchone())


for i, row in df.iterrows():
    cur.execute(
        "INSERT INTO employees (emp_id,emp_name,salary,support,expense,cost) VALUES (%s, %s, %s, %s, %s, %s)",
        (row['emp_id'], row['emp_name'], row['salary'], row['support'], row['expense'], row['cost'])
    )

cur.close()
conn.close()
