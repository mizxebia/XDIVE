from fastapi import APIRouter, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from datetime import timedelta
from app.schemas.auth_schema import UserCreate, UserLogin, TokenRefresh
from app.services.auth_service import signup_user, login_user
from app.storage.user_store import get_user_by_email
from app.core.security import create_token, decode_token
from app.core.config import settings

router = APIRouter()
security = HTTPBearer()

@router.post("/signup")
def signup(user: UserCreate):
    new_user = signup_user(user)

    access_token = create_token(
        {"sub": new_user["email"]},
        timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    refresh_token = create_token(
        {"sub": new_user["email"], "type": "refresh"},
        timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
    )

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
        "user": {
            "id": new_user["id"],
            "email": new_user["email"],
            "name": new_user["name"]
        }
    }

@router.post("/login")
def login(user: UserLogin):
    access_token, refresh_token, db_user = login_user(user)

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
        "user": {
            "id": db_user["id"],
            "email": db_user["email"],
            "name": db_user["name"]
        }
    }

@router.post("/refresh")
def refresh(data: TokenRefresh):
    payload = decode_token(data.refresh_token)
    email = payload.get("sub")

    user = get_user_by_email(email)
    if not user:
        raise Exception("User not found")

    access_token = create_token(
        {"sub": email},
        timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    refresh_token = create_token(
        {"sub": email, "type": "refresh"},
        timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
    )

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
        "user": {
            "id": user["id"],
            "email": user["email"],
            "name": user["name"]
        }
    }

@router.get("/me")
def get_me(credentials: HTTPAuthorizationCredentials = Depends(security)):
    payload = decode_token(credentials.credentials)
    email = payload.get("sub")

    user = get_user_by_email(email)
    if not user:
        raise Exception("User not found")

    return {
        "id": user["id"],
        "email": user["email"],
        "name": user["name"]
    }

@router.post("/logout")
def logout():
    return {"message": "Logged out"}
