from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from db.session import get_db
from api.deps.auth import get_current_user
from api.models import User
from api.schemas import User as UserSchema, AuthResponse

router = APIRouter(prefix="/auth", tags=["authentication"])

@router.get("/validate-session", response_model=UserSchema)
async def validate_session(
    current_user: User = Depends(get_current_user)
):
    """Validate session token and return user info"""
    return current_user

@router.get("/me", response_model=UserSchema)
async def get_me(
    current_user: User = Depends(get_current_user)
):
    """Get current user profile"""
    return current_user
