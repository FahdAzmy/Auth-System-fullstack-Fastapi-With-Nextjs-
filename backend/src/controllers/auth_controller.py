"""
Authentication controller - business logic for auth operations.
"""

from fastapi import HTTPException, status, BackgroundTasks
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from src.models.db_scheams.user import User
from src.models.schemas.user_schema import (
    UserCreate,
    UserResponse,
    VerifyCodeRequest,
    ResendCodeRequest,
)
from src.helpers.security import hash_password, generate_verification_code
from src.helpers.email_service import send_verification_email


async def signup(
    user_data: UserCreate, db: AsyncSession, background_tasks: BackgroundTasks
) -> UserResponse:
    """
    Register a new user.

    Args:
        user_data: User registration data
        db: Database session
        background_tasks: FastAPI background tasks for async email

    Returns:
        Created user response

    Raises:
        HTTPException: If email already exists
    """
    # Check if email already exists
    result = await db.execute(select(User).where(User.email == user_data.email))
    existing_user = result.scalar_one_or_none()

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered"
        )

    # Create new user with verification code
    verification_code = generate_verification_code()
    hashed_pwd = hash_password(user_data.password)

    new_user = User(
        name=user_data.name,
        email=user_data.email,
        hashed_password=hashed_pwd,
        verification_token=verification_code,  # Store 6-digit code
        is_active=False,
        is_verified=False,
    )

    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)

    # Send verification code email in background
    background_tasks.add_task(
        send_verification_email,
        email=new_user.email,
        code=verification_code,
        name=new_user.name,
    )

    return UserResponse(
        id=new_user.id,
        name=new_user.name,
        email=new_user.email,
        is_verified=new_user.is_verified,
        created_at=new_user.created_at,
    )


async def verify_email(verify_data: VerifyCodeRequest, db: AsyncSession) -> dict:
    """
    Verify user email with the 6-digit code.

    Args:
        verify_data: Email and verification code
        db: Database session

    Returns:
        Success message

    Raises:
        HTTPException: If code is invalid or email not found
    """
    # Find user by email
    result = await db.execute(select(User).where(User.email == verify_data.email))
    user = result.scalar_one_or_none()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
        )

    if user.is_verified:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Email already verified"
        )

    # Check verification code
    if user.verification_token != verify_data.code:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid verification code"
        )

    # Verify user
    user.is_verified = True
    user.is_active = True
    user.verification_token = None  # Clear the code after use

    await db.commit()

    return {"message": "Email verified successfully"}


async def resend_verification_code(
    resend_data: ResendCodeRequest, db: AsyncSession, background_tasks: BackgroundTasks
) -> dict:
    """
    Resend verification code to user email.

    Args:
        resend_data: Email
        db: Database session
        background_tasks: FastAPI background tasks

    Returns:
        Success message

    Raises:
        HTTPException: If user not found or already verified
    """
    # Find user by email
    result = await db.execute(select(User).where(User.email == resend_data.email))
    user = result.scalar_one_or_none()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
        )

    if user.is_verified:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Email already verified"
        )

    # Generate new verification code
    new_code = generate_verification_code()

    # Update user
    user.verification_token = new_code
    await db.commit()

    # Send new code email in background
    background_tasks.add_task(
        send_verification_email,
        email=user.email,
        code=new_code,
        name=user.name,
    )

    return {"message": "Verification code resent successfully"}
