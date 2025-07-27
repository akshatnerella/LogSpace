from fastapi import HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import Optional
import httpx
import os
from datetime import datetime, timedelta

from db.session import get_db
from api.models import User

# Security scheme
security = HTTPBearer()

class ClerkAuth:
    def __init__(self):
        self.clerk_secret_key = os.getenv("CLERK_SECRET_KEY")
        self.clerk_base_url = "https://api.clerk.dev/v1"
        
    async def validate_token(self, token: str) -> dict:
        """Validate Clerk JWT token"""
        headers = {
            "Authorization": f"Bearer {self.clerk_secret_key}",
            "Content-Type": "application/json"
        }
        
        async with httpx.AsyncClient() as client:
            try:
                # Verify the session token with Clerk
                response = await client.get(
                    f"{self.clerk_base_url}/sessions/{token}/verify",
                    headers=headers
                )
                
                if response.status_code == 200:
                    session_data = response.json()
                    
                    # Get user details
                    user_response = await client.get(
                        f"{self.clerk_base_url}/users/{session_data['user_id']}",
                        headers=headers
                    )
                    
                    if user_response.status_code == 200:
                        user_data = user_response.json()
                        return {
                            "user_id": user_data["id"],
                            "email": user_data.get("email_addresses", [{}])[0].get("email_address"),
                            "name": user_data.get("first_name", "") + " " + user_data.get("last_name", ""),
                            "avatar_url": user_data.get("profile_image_url")
                        }
                        
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Invalid authentication token"
                )
                
            except httpx.RequestError:
                raise HTTPException(
                    status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                    detail="Authentication service unavailable"
                )

clerk_auth = ClerkAuth()

async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: AsyncSession = Depends(get_db)
) -> User:
    """Get current authenticated user"""
    
    try:
        # Validate token with Clerk
        clerk_user = await clerk_auth.validate_token(credentials.credentials)
        
        # Check if user exists in our database
        result = await db.execute(
            select(User).where(User.clerk_id == clerk_user["user_id"])
        )
        user = result.scalar_one_or_none()
        
        if not user:
            # Create user if doesn't exist
            user = User(
                clerk_id=clerk_user["user_id"],
                email=clerk_user["email"],
                name=clerk_user["name"],
                avatar_url=clerk_user.get("avatar_url")
            )
            db.add(user)
            await db.commit()
            await db.refresh(user)
            
        return user
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

async def get_optional_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security),
    db: AsyncSession = Depends(get_db)
) -> Optional[User]:
    """Get current user if token is provided, otherwise return None"""
    
    if not credentials:
        return None
        
    try:
        return await get_current_user(credentials, db)
    except HTTPException:
        return None
