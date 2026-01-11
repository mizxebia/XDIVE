"""FastAPI route handlers"""
from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel
from typing import Optional, Dict, Any

from services.ingestion_engine import ingestion_engine
from services.cleaning import clean_excel_data

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
    
@router.post("/api/ingest/excel", tags=["ingestion"])
async def ingest_excel(file: UploadFile = File(...)):
    """
    Upload an Excel file, clean it, and load it into the database.
    """

    try:
        # Save uploaded file temporarily
        with tempfile.NamedTemporaryFile(delete=False, suffix=".xlsx") as tmp:
            tmp.write(await file.read())
            temp_path = tmp.name

        # Run ingestion pipeline
        result = ingestion_engine.ingest_excel(
            file_path=temp_path,
            clean_function=clean_excel_data,
            table_name="employees"
        )

        os.remove(temp_path)

        if not result["success"]:
            raise HTTPException(status_code=400, detail=result["error"])

        return result

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

