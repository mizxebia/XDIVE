"""SQL query validation module"""
import re
from typing import List, Tuple


class SQLValidator:
    """Validates SQL queries before execution"""
    
    # Dangerous SQL keywords that should be blocked
    DANGEROUS_KEYWORDS = [
        "DROP", "DELETE", "TRUNCATE", "ALTER", "CREATE", 
        "INSERT", "UPDATE", "GRANT", "REVOKE", "EXEC", "EXECUTE"
    ]
    
    # Allowed SQL keywords for SELECT queries
    ALLOWED_KEYWORDS = [
        "SELECT", "FROM", "WHERE", "JOIN", "INNER", "LEFT", "RIGHT", "FULL",
        "OUTER", "ON", "GROUP", "BY", "HAVING", "ORDER", "LIMIT", "OFFSET",
        "AS", "DISTINCT", "COUNT", "SUM", "AVG", "MAX", "MIN", "CASE", "WHEN",
        "THEN", "ELSE", "END", "AND", "OR", "NOT", "IN", "LIKE", "ILIKE",
        "BETWEEN", "IS", "NULL", "UNION", "INTERSECT", "EXCEPT", "WITH",
        "CAST", "::", "COALESCE", "NULLIF"
    ]
    
    @staticmethod
    def validate_query(query: str) -> Tuple[bool, str]:
        """
        Validate SQL query
        
        Args:
            query: SQL query string to validate
            
        Returns:
            Tuple of (is_valid, error_message)
        """
        if not query or not query.strip():
            return False, "Query cannot be empty"
        
        # Normalize query - remove comments and extra whitespace
        normalized = SQLValidator._normalize_query(query)
        
        # Check for dangerous keywords
        for keyword in SQLValidator.DANGEROUS_KEYWORDS:
            # Use word boundary to avoid false positives
            pattern = r'\b' + re.escape(keyword) + r'\b'
            if re.search(pattern, normalized, re.IGNORECASE):
                return False, f"Dangerous SQL keyword '{keyword}' is not allowed. Only SELECT queries are permitted."
        
        # Ensure query starts with SELECT
        if not re.match(r'^\s*SELECT\s+', normalized, re.IGNORECASE):
            return False, "Only SELECT queries are allowed"
        
        # Basic syntax validation - check for balanced parentheses
        if normalized.count('(') != normalized.count(')'):
            return False, "Unbalanced parentheses in query"
        
        # Check for SQL injection patterns (basic)
        sql_injection_patterns = [
            r';\s*(DROP|DELETE|INSERT|UPDATE|ALTER|CREATE)',
            r'--',
            r'/\*',
            r'UNION\s+SELECT',
        ]
        
        for pattern in sql_injection_patterns:
            if re.search(pattern, normalized, re.IGNORECASE):
                return False, "Potentially malicious SQL pattern detected"
        
        return True, ""
    
    @staticmethod
    def _normalize_query(query: str) -> str:
        """
        Normalize SQL query by removing comments and extra whitespace
        
        Args:
            query: Raw SQL query
            
        Returns:
            Normalized query string
        """
        # Remove single-line comments (--)
        query = re.sub(r'--.*$', '', query, flags=re.MULTILINE)
        
        # Remove multi-line comments (/* */)
        query = re.sub(r'/\*.*?\*/', '', query, flags=re.DOTALL)
        
        # Normalize whitespace
        query = ' '.join(query.split())
        
        return query
    
    @staticmethod
    def is_read_only(query: str) -> bool:
        """
        Check if query is read-only (SELECT only)
        
        Args:
            query: SQL query string
            
        Returns:
            True if query appears to be read-only
        """
        normalized = SQLValidator._normalize_query(query)
        
        # Check for write operations
        write_keywords = ["INSERT", "UPDATE", "DELETE", "DROP", "CREATE", "ALTER", "TRUNCATE"]
        for keyword in write_keywords:
            if re.search(r'\b' + re.escape(keyword) + r'\b', normalized, re.IGNORECASE):
                return False
        
        # Must start with SELECT
        return bool(re.match(r'^\s*SELECT\s+', normalized, re.IGNORECASE))


# Global validator instance
sql_validator = SQLValidator()
