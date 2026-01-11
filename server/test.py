import pandas as pd

xlsx_file = r"C:/Work/Tech_AI_Thon/db.xlsx"
csv_file  = r"Degree.csv"

df = pd.read_excel(xlsx_file, engine="openpyxl")
df.to_csv(csv_file, index=False)

print("Converted:", csv_file)
