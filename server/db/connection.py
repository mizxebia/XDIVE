"""PostgreSQL database connection management using psycopg2"""
import psycopg2
import psycopg2.pool
from psycopg2.extras import RealDictCursor
from contextlib import contextmanager
from typing import Optional, Dict, Any
import os
from urllib.parse import urlparse
from dotenv import load_dotenv

load_dotenv()


class DatabaseConnection:
    """Manages PostgreSQL database connections using psycopg2 with SSL support for Supabase"""
    
    def __init__(self):
        self._pool: Optional[psycopg2.pool.ThreadedConnectionPool] = None
        self._min_conn = 1
        self._max_conn = 10
    
    def initialize(self) -> None:
        """Initialize database connection pool with SSL for Supabase"""
        database_url = os.getenv("DATABASE_URL")
        
        if not database_url:
            raise Exception("DATABASE_URL not found in environment variables")
        
        try:
            # Parse database URL
            parsed = urlparse(database_url)
            
            # Extract connection parameters
            db_params = {
                "host": parsed.hostname,
                "port": parsed.port or 5432,
                "database": parsed.path.lstrip("/"),
                "user": parsed.username,
                "password": parsed.password,
            }
            
            # Add SSL mode for Supabase (require SSL)
            # This ensures secure connection to Supabase PostgreSQL
            db_params["sslmode"] = "require"
            
            # Create connection pool
            self._pool = psycopg2.pool.ThreadedConnectionPool(
                self._min_conn,
                self._max_conn,
                **db_params
            )
            
            # Test connection
            with self.get_connection() as conn:
                with conn.cursor() as cur:
                    cur.execute("SELECT 1")
                    
        except Exception as e:
            raise Exception(f"Failed to initialize database: {str(e)}")
    
    @contextmanager
    def get_connection(self):
        """Get a database connection from the pool"""
        if not self._pool:
            raise Exception("Database not initialized. Call initialize() first.")
        
        conn = self._pool.getconn()
        try:
            yield conn
        finally:
            self._pool.putconn(conn)
    
    def get_schema_metadata(self) -> Dict[str, Any]:
        """
        Get database schema metadata using direct PostgreSQL queries
        
        Returns:
            Dictionary containing tables, columns, and their types
        """
        if not self._pool:
            raise Exception("Database not initialized")
        
        schema_info = {"tables": {}}
        
        try:
            with self.get_connection() as conn:
                with conn.cursor(cursor_factory=RealDictCursor) as cur:
                    # Get all tables in public schema
                    cur.execute("""
                        SELECT table_name 
                        FROM information_schema.tables 
                        WHERE table_schema = 'public' 
                        AND table_type = 'BASE TABLE'
                        ORDER BY table_name
                    """)
                    tables = [row["table_name"] for row in cur.fetchall()]
                    
                    for table_name in tables:
                        # Get columns
                        cur.execute("""
                            SELECT 
                                column_name,
                                data_type,
                                is_nullable,
                                column_default
                            FROM information_schema.columns
                            WHERE table_schema = 'public' 
                            AND table_name = %s
                            ORDER BY ordinal_position
                        """, (table_name,))
                        columns = [
                            {
                                "name": col["column_name"],
                                "type": col["data_type"],
                                "nullable": col["is_nullable"] == "YES",
                                "default": str(col["column_default"]) if col["column_default"] else ""
                            }
                            for col in cur.fetchall()
                        ]
                        
                        # Get primary keys
                        cur.execute("""
                            SELECT column_name
                            FROM information_schema.table_constraints tc
                            JOIN information_schema.key_column_usage kcu
                                ON tc.constraint_name = kcu.constraint_name
                            WHERE tc.table_schema = 'public'
                            AND tc.table_name = %s
                            AND tc.constraint_type = 'PRIMARY KEY'
                            ORDER BY kcu.ordinal_position
                        """, (table_name,))
                        primary_keys = [row["column_name"] for row in cur.fetchall()]
                        
                        # Get foreign keys
                        cur.execute("""
                            SELECT
                                kcu.constraint_name,
                                kcu.column_name,
                                ccu.table_name AS foreign_table_name,
                                ccu.column_name AS foreign_column_name
                            FROM information_schema.table_constraints AS tc
                            JOIN information_schema.key_column_usage AS kcu
                                ON tc.constraint_name = kcu.constraint_name
                            JOIN information_schema.constraint_column_usage AS ccu
                                ON ccu.constraint_name = tc.constraint_name
                            WHERE tc.constraint_type = 'FOREIGN KEY'
                            AND tc.table_schema = 'public'
                            AND tc.table_name = %s
                        """, (table_name,))
                        foreign_keys = [
                            {
                                "name": fk["constraint_name"],
                                "constrained_columns": [fk["column_name"]],
                                "referred_table": fk["foreign_table_name"],
                                "referred_columns": [fk["foreign_column_name"]]
                            }
                            for fk in cur.fetchall()
                        ]
                        
                        # Get indexes
                        cur.execute("""
                            SELECT
                                indexname,
                                indexdef
                            FROM pg_indexes
                            WHERE schemaname = 'public'
                            AND tablename = %s
                        """, (table_name,))
                        indexes = []
                        for idx in cur.fetchall():
                            # Parse index definition to extract columns
                            idx_def = idx["indexdef"]
                            # Extract column names from index definition
                            # This is a simple parser - may need refinement
                            import re
                            col_match = re.search(r'\(([^)]+)\)', idx_def)
                            columns_list = [col.strip().strip('"') for col in col_match.group(1).split(",")] if col_match else []
                            
                            indexes.append({
                                "name": idx["indexname"],
                                "columns": columns_list,
                                "unique": "UNIQUE" in idx_def.upper()
                            })
                        
                        schema_info["tables"][table_name] = {
                            "columns": columns,
                            "primary_keys": primary_keys,
                            "foreign_keys": foreign_keys,
                            "indexes": indexes
                        }
        
        except Exception as e:
            raise Exception(f"Failed to retrieve schema metadata: {str(e)}")
        
        return schema_info
    
    def test_connection(self) -> bool:
        """Test database connection"""
        if not self._pool:
            return False
        
        try:
            with self.get_connection() as conn:
                with conn.cursor() as cur:
                    cur.execute("SELECT 1")
            return True
        except Exception:
            return False
    
    def close(self) -> None:
        """Close database connection pool"""
        if self._pool:
            self._pool.closeall()
            self._pool = None


# Global database connection instance
db = DatabaseConnection()
