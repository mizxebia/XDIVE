from fastapi import HTTPException, status
from datetime import timedelta
from app.storage.user_store import get_user_by_email, add_user
from app.core.security import hash_password, verify_password, create_token
from app.core.config import settings

def signup_user(user):
    existing_user = get_user_by_email(user.email)
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_password = hash_password(user.password)
    new_user = add_user(user.name, user.email, hashed_password)

    return new_user

def login_user(user):
    db_user = get_user_by_email(user.email)
    if not db_user or not verify_password(user.password, db_user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    access_token = create_token(
        {"sub": db_user["email"]},
        timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    )

    refresh_token = create_token(
        {"sub": db_user["email"], "type": "refresh"},
        timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
    )

    return access_token, refresh_token, db_user
