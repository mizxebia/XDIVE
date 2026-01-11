"""FastAPI application entry point"""
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

from api.routes import router
from db.connection import db

@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Simplified Lifespan: Only handles Database Connection
    """
    # Startup
    try:
        db.initialize()
        print("Database connection initialized successfully")
        print("Gemini SQL Service ready (Stateless)")
    except Exception as e:
        print(f"CRITICAL: Database initialization failed: {e}")
    
    yield
    
    # Shutdown
    db.close()
    print("Database connections closed")

# Create FastAPI application
app = FastAPI(
    title="XDIVE AI Query Engine",
    version="2.0.0",
    description="Direct-to-SQL Pipeline using Gemini 1.5 Flash",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)

if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)