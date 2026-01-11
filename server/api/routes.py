"""FastAPI route handlers"""
from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, Field
from typing import Optional, Dict, Any

# --- Services ---
from services.query_router import query_router  # For legacy manual SQL
from services.gemini_sql import sql_service     # For new AI SQL

router = APIRouter()

# --- Request Models ---

class SQLQueryRequest(BaseModel):
    """Request model for manual SQL execution"""
    query: str
    parameters: Optional[Dict[str, Any]] = None

class GenerateSQLRequest(BaseModel):
    """
    Request model for AI SQL generation.
    Only requires 'query'. Schema is handled internally.
    """
    query: str = Field(..., title="User Question", example="Show me the total actual revenue")


# --- Endpoints ---

@router.post("/api/query/sql", tags=["query"])
async def execute_sql_query(request: SQLQueryRequest):
    """
    Execute a raw SQL query manually (Legacy Endpoint).
    """
    try:
        result = query_router.execute_sql_query(request.query, request.parameters)
        
        if not result.get("success", False):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=result.get("error", "SQL Execution failed")
            )
        return result
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@router.post("/api/v1/generate-sql", tags=["nl2sql"])
async def generate_sql(request: GenerateSQLRequest):
    """
    **Direct-to-SQL Pipeline**
    
    1. Receives your natural language question.
    2. Sends it to **Gemini 1.5 Flash**.
    3. Executes the generated SQL on the 'revenue' table.
    4. Returns the data rows.
    """
    try:
        result = sql_service.generate_and_execute(request.query)
        
        if result["status"] == "error":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=result
            )
        
        return result

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Unexpected error: {str(e)}"
        )