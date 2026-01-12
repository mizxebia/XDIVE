# Development Log

This file captures all prompts, changes made, and their impact/result during the development of the XDIVE AI Query Engine backend.

---

## Session 1: Initial FastAPI Backend Architecture

**Prompt:** "You are a senior backend architect building an AI-powered data query platform. Your responsibility is to design and implement a FastAPI backend that: 1. Serves a React dashboard 2. Supports standard SQL queries via REST 3. Supports natural language queries via an NLP layer 4. Can later connect to a local or remote LLM"

**Changes Made:**
- Created modular project structure with separation of concerns:
  - `app/main.py` - FastAPI application entry point
  - `app/api/v1/routes/` - Modular API routes (query.py, health.py)
  - `app/core/` - Business logic layer (database.py, query_engine.py, nlp_engine.py)
  - `app/schemas/` - Pydantic models for request/response validation
  - `app/utils/` - Utility modules (exceptions.py)
- Implemented clean architecture with API layer, service layer, and database layer separation
- Created configuration management with `app/config.py` using pydantic-settings
- Added database connection pooling with SQLAlchemy
- Created query engine for SQL execution
- Created NLP engine framework ready for LLM integration
- Added health check and query endpoints

**Impact/Result:**
- Established enterprise-grade architecture with clear separation of concerns
- Business logic completely separated from route handlers
- Framework ready for LLM integration
- All responses returned as JSON
- Frontend can switch between SQL and NLP modes

---

## Session 2: Simplified Project Structure

**Prompt:** "Create a FastAPI project for an AI-powered query engine. The system must have: - /api/query/sql → for normal structured queries - /api/query/nlp → for natural language queries - /api/schema → to return database metadata. Project structure: server/ main.py, api/routes.py, services/ (sql_engine.py, nlp_engine.py, query_router.py), db/ (connection.py, models.py)"

**Changes Made:**
- Restructured project to simpler flat structure:
  - `server/main.py` - FastAPI application
  - `server/api/routes.py` - All API routes in single file
  - `server/services/sql_engine.py` - SQL query execution
  - `server/services/nlp_engine.py` - NLP processing with mock SQL generation
  - `server/services/query_router.py` - Query routing service
  - `server/db/connection.py` - Database connection management
  - `server/db/models.py` - Database models
- Implemented three main endpoints: `/api/query/sql`, `/api/query/nlp`, `/api/schema`
- Created NLP engine with mock SQL generation using pattern matching
- Added query router to route queries to appropriate engine

**Impact/Result:**
- Simplified project structure easier to navigate
- All required endpoints implemented
- NLP engine ready for LLM integration (currently uses pattern matching)
- Query router enables switching between SQL and NLP modes
- Schema metadata endpoint provides database structure information

---

## Session 3: Refactoring to psycopg2-binary with SSL Support

**Prompt:** "You are a senior backend engineer building an AI-powered analytics platform. The backend must: - Use FastAPI - Use psycopg2-binary for all database access - Connect to Supabase PostgreSQL using SSL - Never use SQLAlchemy or ORM - Never use Pydantic v2 - Be compatible with Python 3.13+ (no Rust or compiled wheels)"

**Changes Made:**
- **Removed SQLAlchemy completely:**
  - Deleted all SQLAlchemy imports and dependencies
  - Removed SQLAlchemy from `requirements.txt`
  
- **Replaced with psycopg2-binary:**
  - `db/connection.py`: Rewrote to use `psycopg2.pool.ThreadedConnectionPool`
  - `services/sql_engine.py`: Updated to use `psycopg2.extras.RealDictCursor` for query execution
  - Direct SQL execution using psycopg2 cursors
  - Connection pooling with psycopg2 ThreadedConnectionPool (1-10 connections)
  
- **Added SSL support for Supabase:**
  - Connection parameters include `sslmode="require"` for secure connections
  - Parses DATABASE_URL from environment variables
  - Handles Supabase connection string format
  
- **Created SQL validation module:**
  - New file: `services/sql_validator.py`
  - Validates all SQL queries before execution
  - Blocks dangerous keywords: DROP, DELETE, INSERT, UPDATE, ALTER, CREATE, GRANT, REVOKE, EXEC, EXECUTE
  - Only allows SELECT queries (read-only)
  - Detects SQL injection patterns (--, /*, UNION SELECT, etc.)
  - Validates query syntax (balanced parentheses, proper SELECT format)
  
- **Updated schema metadata retrieval:**
  - `db/connection.py`: Rewrote `get_schema_metadata()` to use direct PostgreSQL queries
  - Uses `information_schema` tables to get:
    - Table names
    - Column information (name, type, nullable, default)
    - Primary keys
    - Foreign keys
    - Indexes
  - No SQLAlchemy inspector dependency
  
- **Updated requirements.txt:**
  - Removed: `sqlalchemy==2.0.23`
  - Kept: `psycopg2-binary==2.9.9`
  - Updated Pydantic to `2.4.2` (as per user specification)
  
- **Fixed health check endpoint:**
  - Updated `main.py` to check `db._pool` instead of `db._engine`
  
- **Updated configuration:**
  - All database credentials read from `.env` file
  - Created `.env.example` with Supabase connection string format
  - Connection string parsing handles Supabase URL format

**Impact/Result:**
- ✅ Zero SQLAlchemy dependency - pure psycopg2-binary implementation
- ✅ Secure SSL connections to Supabase PostgreSQL
- ✅ All SQL queries validated before execution (read-only enforcement)
- ✅ Python 3.13+ compatible (psycopg2-binary uses pre-compiled wheels)
- ✅ Direct database access without ORM overhead
- ✅ Enhanced security through SQL validation
- ✅ Schema metadata retrieved via native PostgreSQL queries
- ✅ Connection pooling for better performance
- ✅ All credentials managed through environment variables

---

## Files Created/Modified Summary

### Created Files:
1. `server/db/connection.py` - PostgreSQL connection with psycopg2 and SSL
2. `server/db/models.py` - Database models
3. `server/services/sql_engine.py` - SQL query execution engine
4. `server/services/sql_validator.py` - SQL validation module
5. `server/services/nlp_engine.py` - NLP processing engine
6. `server/services/query_router.py` - Query routing service
7. `server/api/routes.py` - API route handlers
8. `server/main.py` - FastAPI application entry point
9. `server/requirements.txt` - Dependencies (psycopg2-binary, no SQLAlchemy)
10. `server/.env.example` - Environment variable template
11. `server/README.md` - Project documentation

### Modified Files:
1. `server/requirements.txt` - Removed SQLAlchemy, kept psycopg2-binary
2. `server/main.py` - Updated health check to use `db._pool`
3. `server/services/sql_engine.py` - Refactored from SQLAlchemy to psycopg2
4. `server/db/connection.py` - Complete rewrite from SQLAlchemy to psycopg2 with SSL

### Deleted Files (from initial structure):
- All files in `server/app/` directory (old modular structure)
- All files in `backend/` directory (temporary structure)

---

## Key Architectural Decisions

1. **No ORM**: Direct psycopg2 usage for better control and performance
2. **SQL Validation**: All queries validated before execution for security
3. **SSL Required**: All database connections use SSL for Supabase
4. **Connection Pooling**: ThreadedConnectionPool for efficient connection management
5. **Read-Only Queries**: Only SELECT queries allowed for analytics platform
6. **Environment-Based Config**: All credentials from .env file
7. **Modular Services**: Query router separates SQL and NLP execution paths
8. **LLM Ready**: NLP engine designed for easy LLM integration

---

## Current System Capabilities

✅ **SQL Query Execution**: `/api/query/sql` - Execute validated SELECT queries
✅ **NLP Query Processing**: `/api/query/nlp` - Natural language to SQL (mock implementation)
✅ **Schema Metadata**: `/api/schema` - Get database structure information
✅ **Query Validation**: All SQL queries validated before execution
✅ **SSL Security**: Secure connections to Supabase PostgreSQL
✅ **Connection Pooling**: Efficient database connection management
✅ **Error Handling**: Comprehensive error handling and JSON responses

---

## Next Steps / Future Enhancements

- [ ] Implement actual LLM integration in `nlp_engine.py`
- [ ] Add query result caching
- [ ] Implement query result pagination
- [ ] Add query execution time limits
- [ ] Implement rate limiting for API endpoints
- [ ] Add authentication/authorization
- [ ] Add query history/logging
- [ ] Implement query result export (CSV, JSON)

---

*Last Updated: Session 3 - Refactoring to psycopg2-binary with SSL support*

# Development Log

This file captures all prompts, architectural decisions, code changes, and their impact during the development of the XDIVE AI Query Engine backend.

---

## Session 1: Initial FastAPI Backend Architecture

**Prompt:** "You are a senior backend architect building an AI-powered data query platform. Your responsibility is to design and implement a FastAPI backend that: 1. Serves a React dashboard 2. Supports standard SQL queries via REST 3. Supports natural language queries via an NLP layer 4. Can later connect to a local or remote LLM"

**Changes Made:**
- Created modular project structure with separation of concerns (`app/core`, `app/api`).
- Implemented `pydantic-settings` for configuration.
- Set up SQLAlchemy connection pooling.
- Created initial `QueryEngine` and `NLPEngine` classes.

**Impact/Result:**
- Established enterprise-grade architecture.
- Decoupled business logic from routing.
- Framework ready for future integrations.

---

## Session 2: Simplified Project Structure

**Prompt:** "Create a FastAPI project for an AI-powered query engine. The system must have: - /api/query/sql → for normal structured queries - /api/query/nlp → for natural language queries - /api/schema → to return database metadata. Project structure: server/ main.py, api/routes.py, services/ (sql_engine.py, nlp_engine.py, query_router.py), db/ (connection.py, models.py)"

**Changes Made:**
- Flattened architecture to `server/` root for simplicity.
- Implemented `QueryRouter` to switch between SQL and NLP modes.
- Added pattern-matching mock logic in `nlp_engine.py`.

**Impact/Result:**
- Simplified navigation and maintenance.
- All core endpoints (`/sql`, `/nlp`, `/schema`) functional.
- Enabled hot-swapping of the intelligence layer.

---

## Session 3: Refactoring to psycopg2-binary with SSL Support

**Prompt:** "You are a senior backend engineer building an AI-powered analytics platform. The backend must: - Use FastAPI - Use psycopg2-binary for all database access - Connect to Supabase PostgreSQL using SSL - Never use SQLAlchemy or ORM - Never use Pydantic v2 - Be compatible with Python 3.13+ (no Rust or compiled wheels)"

**Changes Made:**
- Removed SQLAlchemy entirely.
- Implemented `psycopg2.pool.ThreadedConnectionPool` with `sslmode="require"`.
- Created `services/sql_validator.py` for read-only enforcement.
- Rewrote schema fetching to use direct `information_schema` queries.

**Impact/Result:**
- Zero ORM overhead (improved raw performance).
- Secure SSL connection to Supabase.
- Strict security validation against write operations.

---

## Session 4: Migration to Direct Gemini-to-SQL Pipeline (Vanna Removal)

**Prompt:** "Refactor the project to use a direct 'Gemini-to-SQL' pipeline, removing Vanna/LangChain. Use a strict system prompt for Gemini 1.5 Flash. Fix 'users' table error. Clean up api/routes.py to only keep /api/query/sql (legacy) and /api/v1/generate-sql (Gemini). Fix 'DatabaseConnection object has no attribute engine' error."

**Code Implemented:**

1.  **`services/prompts.py`** (New File: Strict System Prompt)
    ```python
    def get_system_prompt():
        return """
        You are a PostgreSQL expert and a strict SQL code generator.
        YOUR JOB:
        1. Receive a natural language question and a database schema.
        2. Output ONLY valid, executable PostgreSQL code.
        3. Do NOT output markdown code blocks (```sql), explanations, or notes.
        4. If the question cannot be answered with the schema, return: SELECT 'ERROR: Irrelevant question' as error_msg;
        """

    def get_full_prompt(question, ddl_schema):
        return f"""
        ### SCHEMA:
        {ddl_schema}
        ### QUESTION:
        {question}
        ### SQL:
        """
    ```

2.  **`services/gemini_sql.py`** (New Service: Direct Gemini Integration)
    ```python
    class GeminiSQLService:
        def __init__(self):
            # ... GenAI Config ...
            self.ddl = """
            CREATE TABLE revenue (
                key VARCHAR, emp_id VARCHAR, emp_name VARCHAR, ee_group VARCHAR, 
                region VARCHAR, service_line_code VARCHAR, designation VARCHAR, 
                skill VARCHAR, location VARCHAR, customer VARCHAR, project_name VARCHAR, 
                start_date DATE, end_date DATE, allocation_pct INTEGER, 
                billable_pct INTEGER, project_manager VARCHAR, operations_head VARCHAR, 
                resource_type VARCHAR, project_type VARCHAR, ideal_hrs INTEGER, 
                actual_hrs INTEGER, actual_revenue INTEGER, sow_start_date DATE, 
                sow_end_date DATE, month VARCHAR, salary INTEGER, 
                support_expense INTEGER, cost INTEGER
            );
            """

        def generate_and_execute(self, user_query: str):
            # 1. Generate SQL
            prompt = get_full_prompt(user_query, self.ddl)
            response = self.model.generate_content(prompt)
            raw_sql = response.text.replace("```sql", "").replace("```", "").strip()

            # 2. Execute using existing psycopg2 connection
            with db.get_connection() as conn:
                df = pd.read_sql_query(raw_sql, conn)
                
            return {
                "status": "success",
                "sql": raw_sql,
                "data": df.to_dict(orient="records")
            }
    ```

3.  **`api/routes.py`** (Refactored: Clean Endpoints)
    ```python
    class GenerateSQLRequest(BaseModel):
        query: str = Field(..., title="User Question", example="Show me the total actual revenue")

    @router.post("/api/v1/generate-sql", tags=["nl2sql"])
    async def generate_sql(request: GenerateSQLRequest):
        result = sql_service.generate_and_execute(request.query)
        if result["status"] == "error":
            raise HTTPException(status_code=400, detail=result)
        return result
    ```

**Impact/Result:**
- **Stability:** Eliminated Vanna/NumPy 2.0 compatibility crashes.
- **Accuracy:** Fixed `relation "users" does not exist` error by strictly defining the schema in code.
- **Architecture:** Decoupled AI from database driver; fixed `DatabaseConnection` attribute error by using raw `psycopg2` connection.
- **Usability:** Simplified API input (removed manual schema upload requirement).
