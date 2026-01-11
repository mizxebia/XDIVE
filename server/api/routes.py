"""FastAPI route handlers"""
from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel
from typing import Optional, Dict, Any

from services.query_router import query_router
from db.connection import db

router = APIRouter()


# Request/Response Models
class SQLQueryRequest(BaseModel):
    """SQL query request model"""
    query: str
    parameters: Optional[Dict[str, Any]] = None


class NLPQueryRequest(BaseModel):
    """Natural language query request model"""
    query: str
    context: Optional[Dict[str, Any]] = None


@router.post("/api/query/sql", tags=["query"])
async def execute_sql_query(request: SQLQueryRequest):
    """
    Execute a SQL query
    
    - **query**: SQL query string
    - **parameters**: Optional query parameters for parameterized queries
    
    Returns query results in JSON format
    """
    result = query_router.execute_sql_query(request.query, request.parameters)
    
    if not result["success"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=result["error"]
        )
    
    return result


@router.post("/api/query/nlp", tags=["query"])
async def execute_nlp_query(request: NLPQueryRequest):
    """
    Execute a natural language query
    
    - **query**: Natural language query string
    - **context**: Optional additional context
    
    Translates the natural language query to SQL and executes it.
    Returns query results in JSON format with the generated SQL.
    """
    result = query_router.execute_nlp_query(request.query, request.context)
    
    if not result["success"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=result["error"]
        )
    
    return result


@router.get("/api/schema", tags=["schema"])
async def get_schema():
    """
    Get database schema metadata
    
    Returns information about all tables, columns, primary keys,
    foreign keys, and indexes in the database.
    """
    try:
        schema_info = db.get_schema_metadata()
        return schema_info
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve schema: {str(e)}"
        )
