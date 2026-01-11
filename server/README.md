# XDIVE AI Query Engine

FastAPI backend for an AI-powered analytics platform with SQL and NLP support.

## Project Structure

```
server/
  main.py              # FastAPI application entry point
  api/
    routes.py          # API route handlers
  services/
    sql_engine.py      # SQL query execution engine (psycopg2)
    sql_validator.py   # SQL query validation
    nlp_engine.py      # Natural language processing engine (with mock SQL generation)
    query_router.py    # Query routing service
  db/
    connection.py      # PostgreSQL database connection (psycopg2 with SSL)
    models.py         # Database models
```

## Features

- **SQL Query Execution**: Execute standard SQL queries via `/api/query/sql` with validation
- **NLP Query Support**: Natural language queries via `/api/query/nlp` (currently uses mock SQL generation)
- **Schema Metadata**: Get database schema information via `/api/schema`
- **Supabase PostgreSQL**: Configured for Supabase with SSL support
- **SQL Validation**: All queries validated before execution (read-only SELECT queries only)
- **No ORM**: Direct psycopg2-binary usage, no SQLAlchemy
- **LLM Ready**: NLP engine designed to be extended with LLM integration

## Setup

1. **Install dependencies**:
```bash
pip install -r requirements.txt
```

2. **Configure database**:
   - Copy `.env.example` to `.env`
   - Update `DATABASE_URL` with your Supabase PostgreSQL connection string:
     ```
     DATABASE_URL=postgresql://postgres:your_password@your_project_ref.supabase.co:5432/postgres
     ```
   - Get your connection string from Supabase Dashboard > Settings > Database

3. **Run the application**:
```bash
# From the server directory
python main.py

# Or using uvicorn directly
uvicorn main:app --reload
```

The API will be available at `http://localhost:8000`

- API Documentation: `http://localhost:8000/docs`
- Root endpoint: `http://localhost:8000/`
- Health check: `http://localhost:8000/health`

## API Endpoints

### SQL Query
**POST** `/api/query/sql`

Execute a SQL query.

Request body:
```json
{
  "query": "SELECT * FROM users LIMIT 10",
  "parameters": null
}
```

Response:
```json
{
  "success": true,
  "mode": "sql",
  "data": [...],
  "columns": ["id", "name", "email"],
  "row_count": 10,
  "execution_time_ms": 45.2,
  "error": null
}
```

### NLP Query
**POST** `/api/query/nlp`

Execute a natural language query (currently uses mock SQL generation).

Request body:
```json
{
  "query": "Show me the top 10 users",
  "context": null
}
```

Response:
```json
{
  "success": true,
  "mode": "nlp",
  "data": [...],
  "columns": ["id", "name", "email"],
  "row_count": 10,
  "execution_time_ms": 45.2,
  "sql_generated": "SELECT * FROM users LIMIT 10",
  "nl_query": "Show me the top 10 users",
  "error": null
}
```

### Schema Metadata
**GET** `/api/schema`

Get database schema information.

Response:
```json
{
  "tables": {
    "users": {
      "columns": [
        {
          "name": "id",
          "type": "INTEGER",
          "nullable": false,
          "default": ""
        }
      ],
      "primary_keys": ["id"],
      "foreign_keys": [],
      "indexes": [...]
    }
  }
}
```

## SQL Validation

All SQL queries are validated before execution:
- Only SELECT queries are allowed (read-only)
- Dangerous keywords (DROP, DELETE, INSERT, UPDATE, etc.) are blocked
- SQL injection patterns are detected and rejected
- Queries must start with SELECT

## NLP Engine - LLM Integration

The NLP engine (`services/nlp_engine.py`) is currently using mock SQL generation based on pattern matching. It's designed to be easily extended with LLM integration.

To integrate an LLM:

1. Configure the LLM provider in `nlp_engine.py`:
```python
from services.nlp_engine import nlp_engine

nlp_engine.configure_llm(
    provider="openai",  # or "anthropic", "local", etc.
    api_key="your-api-key",
    model="gpt-4"
)
```

2. Implement the `_call_llm()` method in `NLPEngine` class to call your chosen LLM provider.

3. Update `translate_to_sql()` to use `_call_llm()` instead of pattern matching.

## Development

The project follows a clean architecture:
- **API Layer** (`api/routes.py`): Route handlers only, no business logic
- **Service Layer** (`services/`): Business logic, query processing, and validation
- **Database Layer** (`db/`): Direct psycopg2 connection with SSL support

## Technical Stack

- **FastAPI**: Modern async web framework
- **psycopg2-binary**: PostgreSQL adapter (no ORM)
- **Pydantic**: Data validation (v2.4.2)
- **Python 3.13+**: Compatible with latest Python versions

## License

MIT
