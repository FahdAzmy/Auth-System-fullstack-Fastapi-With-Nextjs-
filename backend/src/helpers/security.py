"""
Security utilities for password hashing and token generation.
Uses bcrypt directly for compatibility with newer bcrypt versions.
"""

import secrets
import bcrypt
from src.helpers.config import settings
from jose import jwt


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
    return jwt.encode({"user_id": str(user_id)}, settings.SECRET_KEY, algorithm="HS256")
