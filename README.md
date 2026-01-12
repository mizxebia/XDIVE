Title: XDIVE: AI-Powered Analytics & Direct-to-SQL Engine

Short Description: An enterprise-grade analytics platform that bridges the gap between raw database tables and actionable business insights. XDIVE combines a high-performance FastAPI backend with Google’s Gemini 2.5 Flash to translate natural language questions into precise, executable SQL queries—delivering real-time data without the complexity of traditional BI tools.

Key Features:

🚀 Direct-to-SQL Pipeline: A stateless, low-latency architecture that uses strict prompt engineering to convert English into PostgreSQL queries with high accuracy.

🛡️ Secure & Scalable: Built on psycopg2-binary with SSL enforcement and connection pooling, completely bypassing ORM overhead for maximum performance.

💬 Natural Language Interface: Empowers non-technical users to query complex revenue data (e.g., "Show me the total actual revenue for Javi Pacheco") without writing a single line of code.

📊 Interactive Dashboard: A React-based frontend visualizing key performance indicators (KPIs) alongside AI-driven query results.

Tech Stack:

Backend: FastAPI, Python 3.10+

AI/LLM: Google Gemini 2.5 Flash (via google-genai)

Database: PostgreSQL (Supabase) via psycopg2

Frontend: React (Dashboard & Chat Interface)
