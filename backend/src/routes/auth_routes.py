"""
Authentication routes for FastAPI.
"""

from fastapi import APIRouter, Depends, BackgroundTasks, status
from sqlalchemy.ext.asyncio import AsyncSession

from src.helpers.db import get_db
from src.models.schemas.user_schema import UserCreate, UserResponse, VerifyCodeRequest
from src.controllers.auth_controller import signup, verify_email


router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post(
    "/signup", response_model=UserResponse, status_code=status.HTTP_201_CREATED
)
async def register_user(
    user_data: UserCreate,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db),
) -> UserResponse:
    """
    Register a new user.

    - **name**: User's full name (1-100 characters)
    - **email**: Valid email address (must be unique)
    - **password**: Password (minimum 8 characters)

    Returns the created user info. A verification code will be sent via email.
    """
    return await signup(user_data, db, background_tasks)


@router.post("/verify-code", status_code=status.HTTP_200_OK)
async def verify_user_email(
    verify_data: VerifyCodeRequest,
    db: AsyncSession = Depends(get_db),
) -> dict:
    """
    Verify user email with 6-digit code.

    - **email**: User's email address
    - **code**: 6-digit verification code sent via email

    Returns success message if verification is successful.
    """
    return await verify_email(verify_data, db)
