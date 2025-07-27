from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_
from sqlalchemy.orm import selectinload
from typing import Optional
from uuid import UUID
import secrets
import jwt
from datetime import datetime, timedelta
import os

from db.session import get_db
from api.deps.auth import get_current_user
from api.models import User, Project, Collaborator
from api.schemas import (
    CollaboratorInvite, CollaboratorAccept, Collaborator as CollaboratorSchema,
    CollaboratorWithUser, CollaboratorList, InviteResponse, MessageResponse
)

router = APIRouter(prefix="/collaborators", tags=["collaborators"])

def create_invite_token(project_id: str, email: str, role: str) -> tuple[str, datetime]:
    """Create an invite token with expiration"""
    expires_at = datetime.utcnow() + timedelta(days=7)  # 7 days expiration
    
    payload = {
        "project_id": project_id,
        "email": email,
        "role": role,
        "exp": expires_at,
        "type": "invite"
    }
    
    secret = os.getenv("JWT_SECRET", "your-secret-key")
    token = jwt.encode(payload, secret, algorithm="HS256")
    
    return token, expires_at

def verify_invite_token(token: str) -> dict:
    """Verify and decode invite token"""
    secret = os.getenv("JWT_SECRET", "your-secret-key")
    
    try:
        payload = jwt.decode(token, secret, algorithms=["HS256"])
        
        if payload.get("type") != "invite":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid token type"
            )
        
        return payload
        
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invite token has expired"
        )
    except jwt.InvalidTokenError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid invite token"
        )

@router.post("/invite", response_model=InviteResponse)
async def create_invite(
    project_id: UUID,
    invite: CollaboratorInvite,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Generate an invite token for a collaborator"""
    
    # Check if project exists and user has permission to invite
    result = await db.execute(
        select(Project).where(Project.id == project_id)
    )
    project = result.scalar_one_or_none()
    
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    # Check if user can invite collaborators
    can_invite = False
    
    if project.owner_id == current_user.id:
        can_invite = True
    else:
        # Check if user is an admin collaborator
        collab_result = await db.execute(
            select(Collaborator).where(
                and_(
                    Collaborator.project_id == project_id,
                    Collaborator.user_id == current_user.id,
                    Collaborator.role == "admin"
                )
            )
        )
        if collab_result.scalar_one_or_none():
            can_invite = True
    
    if not can_invite:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Permission denied to invite collaborators"
        )
    
    # Check if user is already a collaborator
    existing_user_result = await db.execute(
        select(User).where(User.email == invite.email)
    )
    existing_user = existing_user_result.scalar_one_or_none()
    
    if existing_user:
        existing_collab_result = await db.execute(
            select(Collaborator).where(
                and_(
                    Collaborator.project_id == project_id,
                    Collaborator.user_id == existing_user.id
                )
            )
        )
        if existing_collab_result.scalar_one_or_none():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="User is already a collaborator on this project"
            )
    
    # Generate invite token
    token, expires_at = create_invite_token(
        str(project_id), 
        invite.email, 
        invite.role
    )
    
    return InviteResponse(invite_token=token, expires_at=expires_at)

@router.post("/accept", response_model=MessageResponse)
async def accept_invite(
    invite_data: CollaboratorAccept,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Accept a collaboration invite"""
    
    # Verify invite token
    payload = verify_invite_token(invite_data.invite_token)
    
    project_id = UUID(payload["project_id"])
    invited_email = payload["email"]
    role = payload["role"]
    
    # Check if the current user's email matches the invite
    if current_user.email != invited_email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This invite is not for your email address"
        )
    
    # Check if project exists
    result = await db.execute(
        select(Project).where(Project.id == project_id)
    )
    project = result.scalar_one_or_none()
    
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    # Check if user is already a collaborator
    existing_collab_result = await db.execute(
        select(Collaborator).where(
            and_(
                Collaborator.project_id == project_id,
                Collaborator.user_id == current_user.id
            )
        )
    )
    if existing_collab_result.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You are already a collaborator on this project"
        )
    
    # Create collaborator record
    collaborator = Collaborator(
        project_id=project_id,
        user_id=current_user.id,
        role=role,
        joined_at=datetime.utcnow()
    )
    
    db.add(collaborator)
    await db.commit()
    
    return MessageResponse(message="Successfully joined the project as a collaborator")

@router.get("/{project_id}", response_model=CollaboratorList)
async def get_project_collaborators(
    project_id: UUID,
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get all collaborators for a project"""
    
    # Check if project exists
    result = await db.execute(
        select(Project).where(Project.id == project_id)
    )
    project = result.scalar_one_or_none()
    
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    # Check if user can view collaborators
    can_view = False
    
    if project.owner_id == current_user.id:
        can_view = True
    else:
        # Check if user is a collaborator
        collab_result = await db.execute(
            select(Collaborator).where(
                and_(
                    Collaborator.project_id == project_id,
                    Collaborator.user_id == current_user.id
                )
            )
        )
        if collab_result.scalar_one_or_none():
            can_view = True
    
    if not can_view:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Permission denied to view collaborators"
        )
    
    # Get collaborators with user information
    result = await db.execute(
        select(Collaborator)
        .options(selectinload(Collaborator.user))
        .where(Collaborator.project_id == project_id)
        .offset(skip)
        .limit(limit)
    )
    collaborators = result.scalars().all()
    
    # Get total count
    from sqlalchemy import func
    total_result = await db.execute(
        select(func.count(Collaborator.id)).where(Collaborator.project_id == project_id)
    )
    total = total_result.scalar() or 0
    
    return CollaboratorList(collaborators=collaborators, total=total)

@router.put("/{collaborator_id}/role", response_model=CollaboratorSchema)
async def update_collaborator_role(
    collaborator_id: UUID,
    role: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update a collaborator's role"""
    
    if role not in ["admin", "editor", "viewer"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid role. Must be 'admin', 'editor', or 'viewer'"
        )
    
    # Get collaborator
    result = await db.execute(
        select(Collaborator)
        .options(selectinload(Collaborator.project))
        .where(Collaborator.id == collaborator_id)
    )
    collaborator = result.scalar_one_or_none()
    
    if not collaborator:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Collaborator not found"
        )
    
    # Check if user can update roles
    if collaborator.project.owner_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only project owner can update collaborator roles"
        )
    
    # Update role
    collaborator.role = role
    await db.commit()
    await db.refresh(collaborator)
    
    return collaborator

@router.delete("/{collaborator_id}", response_model=MessageResponse)
async def remove_collaborator(
    collaborator_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Remove a collaborator from a project"""
    
    # Get collaborator
    result = await db.execute(
        select(Collaborator)
        .options(selectinload(Collaborator.project))
        .where(Collaborator.id == collaborator_id)
    )
    collaborator = result.scalar_one_or_none()
    
    if not collaborator:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Collaborator not found"
        )
    
    # Check if user can remove collaborators
    can_remove = False
    
    if collaborator.project.owner_id == current_user.id:
        can_remove = True
    elif collaborator.user_id == current_user.id:
        # Users can remove themselves
        can_remove = True
    
    if not can_remove:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Permission denied to remove this collaborator"
        )
    
    await db.delete(collaborator)
    await db.commit()
    
    return MessageResponse(message="Collaborator removed successfully")
