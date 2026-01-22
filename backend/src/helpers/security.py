"""
Security utilities for password hashing and token generation.
Uses bcrypt directly for compatibility with newer bcrypt versions.
"""

import secrets
import bcrypt
from src.helpers.config import settings
from jose import jwt
from datetime import datetime, timedelta
from typing import Dict
from fastapi import Response


def hash_password(password: str) -> str:
    """
    Hash a plain text password using bcrypt.

    Args:
        password: Plain text password to hash

    Returns:
        Hashed password string
    """
    # Encode password to bytes and hash with bcrypt
    password_bytes = password.encode("utf-8")
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password_bytes, salt)
    return hashed.decode("utf-8")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verify a plain password against a hashed password.

    Args:
        plain_password: Plain text password to verify
        hashed_password: Hashed password to compare against

    Returns:
        True if password matches, False otherwise
    """
    password_bytes = plain_password.encode("utf-8")
    hashed_bytes = hashed_password.encode("utf-8")
    return bcrypt.checkpw(password_bytes, hashed_bytes)


def generate_verification_code() -> str:
    """
    Generate a 6-digit verification code for email verification.

    Returns:
        6-digit numeric code as string
    """
    return str(secrets.randbelow(900000) + 100000)  # Ensures 6 digits (100000-999999)


def generate_access_token(user_id: int) -> str:
    """
    Generate a JWT access token for a user.

    Args:
        user_id: User ID to include in the token

    Returns:
        JWT access token
    """
    expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    payload = {
        "user_id": str(user_id),
        "exp": expire,
        "iat": datetime.utcnow(),  # issued at
        "type": "access",
    }
    return jwt.encode(payload, settings.SECRET_KEY, algorithm="HS256")


def generate_refresh_token(user_id: int) -> str:
    """
    Generate a JWT refresh token for a user.

    Args:
        user_id: User ID to include in the token

    Returns:
        JWT refresh token
    """
    expire = datetime.utcnow() + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
    payload = {
        "user_id": str(user_id),
        "exp": expire,
        "iat": datetime.utcnow(),
        "type": "refresh",
    }
    return jwt.encode(payload, settings.REFRESH_SECRET_KEY, algorithm="HS256")


def verify_access_token(token: str) -> Dict:
    """
    Verify and decode access token.

    Args:
        token: JWT access token

    Returns:
        Decoded token payload

    Raises:
        HTTPException: If token is invalid or expired
    """
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
        if payload.get("type") != "access":
            raise HTTPException(status_code=401, detail="Invalid token type")
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")


def verify_refresh_token(token: str) -> Dict:
    """
    Verify and decode refresh token.

    Args:
        token: JWT refresh token

    Returns:
        Decoded token payload

    Raises:
        HTTPException: If token is invalid or expired
    """
    try:
        payload = jwt.decode(token, settings.REFRESH_SECRET_KEY, algorithms=["HS256"])
        if payload.get("type") != "refresh":
            raise HTTPException(status_code=401, detail="Invalid token type")
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Refresh token has expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid refresh token")
