import pandas as pd
import psycopg2

# Read Excel
df = pd.read_excel("your_file.xlsx")

# Connect to Supabase PostgreSQL
conn = psycopg2.connect(
    host="your-project-ref.supabase.co",
    database="postgres",
    user="your-db-user",
    password="your-db-password",
    port=5432
)
cur = conn.cursor()

# Insert data row by row
for i, row in df.iterrows():
    cur.execute(
        "INSERT INTO your_table_name (col1, col2, col3) VALUES (%s, %s, %s)",
        (row['col1'], row['col2'], row['col3'])
    )

conn.commit()
cur.close()
conn.close()
