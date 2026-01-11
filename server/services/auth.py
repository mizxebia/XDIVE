"""Authentication business logic"""
from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from db.models import User
from core.security import hash_password, verify_password, create_token
from schemas.auth import UserCreate, UserLogin
from datetime import timedelta
from core.config import settings


def signup_user(db: Session, user_data: UserCreate):
    """Register a new user"""
    # Check if user already exists
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create new user
    hashed_password = hash_password(user_data.password)
    db_user = User(
        name=user_data.name,
        email=user_data.email,
        hashed_password=hashed_password
    )
    
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    return db_user


def login_user(db: Session, credentials: UserLogin):
    """Authenticate a user and return tokens"""
    db_user = db.query(User).filter(User.email == credentials.email).first()
    if not db_user or not verify_password(credentials.password, db_user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Create tokens
    access_token = create_token(
        data={"sub": db_user.email}
    )
    
    return access_token, db_user


def get_user_by_email(db: Session, email: str):
    """Retrieve user by email"""
    return db.query(User).filter(User.email == email).first()
