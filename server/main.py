"""FastAPI application entry point"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

from api.routes import router
from db.connection import db


# Create FastAPI application
app = FastAPI(
    title="XDIVE AI Query Engine",
    version="1.0.0",
    description="AI-powered data query platform with SQL and NLP support"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routes
app.include_router(router)


@app.on_event("startup")
async def startup_event():
    """Initialize services on startup"""
    try:
        db.initialize()
        print("Database connection initialized successfully")
    except Exception as e:
        print(f"Warning: Database initialization failed: {e}")
        print("The API will still run, but database operations will fail.")


@app.on_event("shutdown")
async def shutdown_event():
    """Cleanup on shutdown"""
    db.close()
    print("Database connections closed")


@app.get("/", tags=["health"])
async def root():
    """Root endpoint"""
    return {
        "message": "XDIVE AI Query Engine API",
        "version": "1.0.0",
        "endpoints": {
            "sql_query": "/api/query/sql",
            "nlp_query": "/api/query/nlp",
            "schema": "/api/schema",
            "docs": "/docs"
        }
    }


@app.get("/health", tags=["health"])
async def health_check():
    """Health check endpoint"""
    db_status = db.test_connection() if db._pool else False
    
    return {
        "status": "healthy" if db_status else "degraded",
        "database": "connected" if db_status else "disconnected"
    }


if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="127.0.0.1",
        port=8000,
        reload=True,
        log_level="info"
    )
