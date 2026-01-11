"""SQL query execution engine using psycopg2"""
from typing import Dict, Any, Optional
import time
import psycopg2.extras

from db.connection import db
from services.sql_validator import sql_validator


class SQLEngine:
    """Handles SQL query execution with validation"""
    
    def __init__(self):
        self.db = db
        self.validator = sql_validator
    
    def execute_query(
        self, 
        query: str, 
        parameters: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """
        Execute a SQL query and return results
        
        Args:
            query: SQL query string
            parameters: Optional query parameters for parameterized queries
            
        Returns:
            Dictionary with query results, columns, row count, and execution time
        """
        start_time = time.time()
        
        # Validate SQL query before execution
        is_valid, error_msg = self.validator.validate_query(query)
        if not is_valid:
            return {
                "success": False,
                "data": None,
                "columns": None,
                "row_count": 0,
                "execution_time_ms": 0,
                "error": f"SQL validation failed: {error_msg}"
            }
        
        try:
            with self.db.get_connection() as conn:
                with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
                    # Execute query with parameters if provided
                    if parameters:
                        # Convert parameters dict to list for psycopg2
                        # For named parameters, use %(name)s syntax
                        cur.execute(query, parameters)
                    else:
                        cur.execute(query)
                    
                    # Fetch all rows
                    rows = cur.fetchall()
                    
                    # Convert to list of dictionaries
                    data = [dict(row) for row in rows]
                    
                    # Get column names from cursor description
                    columns = [desc[0] for desc in cur.description] if cur.description else []
                    
                    execution_time = (time.time() - start_time) * 1000  # Convert to ms
                    
                    return {
                        "success": True,
                        "data": data,
                        "columns": columns,
                        "row_count": len(data),
                        "execution_time_ms": execution_time,
                        "error": None
                    }
                
        except psycopg2.Error as e:
            execution_time = (time.time() - start_time) * 1000
            return {
                "success": False,
                "data": None,
                "columns": None,
                "row_count": 0,
                "execution_time_ms": execution_time,
                "error": f"Database error: {str(e)}"
            }
        except Exception as e:
            execution_time = (time.time() - start_time) * 1000
            return {
                "success": False,
                "data": None,
                "columns": None,
                "row_count": 0,
                "execution_time_ms": execution_time,
                "error": f"Query execution failed: {str(e)}"
            }


# Global SQL engine instance
sql_engine = SQLEngine()
