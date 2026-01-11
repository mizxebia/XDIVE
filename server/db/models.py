"""Database models and ORM definitions"""
from sqlalchemy import Column, Integer, String, DateTime, Text, Float, Boolean
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime

Base = declarative_base()


# Example models - these can be extended based on your database schema
# The actual schema will be reflected from the database at runtime

class BaseModel(Base):
    """Base model with common fields"""
    __abstract__ = True
    
    id = Column(Integer, primary_key=True, index=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


# Add your specific models here as needed
# For now, we'll use dynamic reflection from the database
