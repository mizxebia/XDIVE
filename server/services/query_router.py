"""Query router service - routes queries to appropriate engine"""
from typing import Dict, Any, Optional

from services.sql_engine import sql_engine
from services.nlp_engine import nlp_engine


class QueryRouter:
    """Routes queries to appropriate execution engine"""
    
    def __init__(self):
        self.sql_engine = sql_engine
        self.nlp_engine = nlp_engine
    
    def execute_sql_query(
        self, 
        query: str, 
        parameters: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """
        Route SQL query to SQL engine
        
        Args:
            query: SQL query string
            parameters: Optional query parameters
            
        Returns:
            Query execution result
        """
        result = self.sql_engine.execute_query(query, parameters)
        result["mode"] = "sql"
        return result
    
    def execute_nlp_query(
        self, 
        nl_query: str, 
        context: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """
        Route natural language query to NLP engine
        
        Args:
            nl_query: Natural language query
            context: Optional context
            
        Returns:
            Query execution result with generated SQL
        """
        result = self.nlp_engine.execute_nlp_query(nl_query, context)
        result["mode"] = "nlp"
        return result


# Global query router instance
query_router = QueryRouter()
