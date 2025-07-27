from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_, desc
from sqlalchemy.orm import selectinload
from typing import Optional
from uuid import UUID

from db.session import get_db
from api.deps.auth import get_current_user, get_optional_user
from api.models import User, Project, Log, Collaborator
from api.schemas import (
    LogCreate, LogUpdate, Log as LogSchema,
    LogWithAuthor, LogList, MessageResponse
)

router = APIRouter(prefix="/logs", tags=["logs"])

@router.post("/", response_model=LogSchema, status_code=status.HTTP_201_CREATED)
async def create_log(
    log: LogCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a new log entry"""
    
    # Check if project exists and user has permission
    result = await db.execute(
        select(Project).where(Project.id == log.project_id)
    )
    project = result.scalar_one_or_none()
    
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    # Check if user can create logs in this project
    can_create = False
    
    if project.owner_id == current_user.id:
        can_create = True
    else:
        # Check if user is a collaborator with appropriate permissions
        collab_result = await db.execute(
            select(Collaborator).where(
                and_(
                    Collaborator.project_id == log.project_id,
                    Collaborator.user_id == current_user.id,
                    Collaborator.role.in_(["admin", "editor"])  # Only admins and editors can create logs
                )
            )
        )
        if collab_result.scalar_one_or_none():
            can_create = True
    
    if not can_create:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Permission denied to create logs in this project"
        )
    
    # Create log
    db_log = Log(
        title=log.title,
        content=log.content,
        log_type=log.log_type,
        image_url=log.image_url,
        project_id=log.project_id,
        author_id=current_user.id
    )
    
    db.add(db_log)
    await db.commit()
    await db.refresh(db_log)
    
    return db_log

@router.get("/project/{project_id}", response_model=LogList)
async def get_project_logs(
    project_id: UUID,
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_user)
):
    """Get logs for a specific project"""
    
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
    
    # Check if user can access this project
    if not project.is_public:
        if not current_user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Authentication required"
            )
        
        if project.owner_id != current_user.id:
            # Check if user is a collaborator
            collab_result = await db.execute(
                select(Collaborator).where(
                    and_(
                        Collaborator.project_id == project_id,
                        Collaborator.user_id == current_user.id
                    )
                )
            )
            if not collab_result.scalar_one_or_none():
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Access denied"
                )
    
    # Get logs with author information
    result = await db.execute(
        select(Log)
        .options(selectinload(Log.author))
        .where(Log.project_id == project_id)
        .order_by(desc(Log.created_at))
        .offset(skip)
        .limit(limit)
    )
    logs = result.scalars().all()
    
    # Get total count
    from sqlalchemy import func
    total_result = await db.execute(
        select(func.count(Log.id)).where(Log.project_id == project_id)
    )
    total = total_result.scalar() or 0
    
    return LogList(logs=logs, total=total)

@router.get("/{log_id}", response_model=LogWithAuthor)
async def get_log(
    log_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_user)
):
    """Get a specific log"""
    
    result = await db.execute(
        select(Log)
        .options(selectinload(Log.author), selectinload(Log.project))
        .where(Log.id == log_id)
    )
    log = result.scalar_one_or_none()
    
    if not log:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Log not found"
        )
    
    # Check if user can access this log (through project access)
    if not log.project.is_public:
        if not current_user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Authentication required"
            )
        
        if log.project.owner_id != current_user.id:
            # Check if user is a collaborator
            collab_result = await db.execute(
                select(Collaborator).where(
                    and_(
                        Collaborator.project_id == log.project_id,
                        Collaborator.user_id == current_user.id
                    )
                )
            )
            if not collab_result.scalar_one_or_none():
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Access denied"
                )
    
    return log

@router.put("/{log_id}", response_model=LogSchema)
async def update_log(
    log_id: UUID,
    log_update: LogUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update a log entry"""
    
    result = await db.execute(
        select(Log).options(selectinload(Log.project)).where(Log.id == log_id)
    )
    log = result.scalar_one_or_none()
    
    if not log:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Log not found"
        )
    
    # Check if user can edit this log
    can_edit = False
    
    if log.author_id == current_user.id:
        can_edit = True
    elif log.project.owner_id == current_user.id:
        can_edit = True
    else:
        # Check if user is an admin collaborator
        collab_result = await db.execute(
            select(Collaborator).where(
                and_(
                    Collaborator.project_id == log.project_id,
                    Collaborator.user_id == current_user.id,
                    Collaborator.role == "admin"
                )
            )
        )
        if collab_result.scalar_one_or_none():
            can_edit = True
    
    if not can_edit:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Permission denied to edit this log"
        )
    
    # Update fields
    update_data = log_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(log, field, value)
    
    await db.commit()
    await db.refresh(log)
    
    return log

@router.delete("/{log_id}", response_model=MessageResponse)
async def delete_log(
    log_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Delete a log entry"""
    
    result = await db.execute(
        select(Log).options(selectinload(Log.project)).where(Log.id == log_id)
    )
    log = result.scalar_one_or_none()
    
    if not log:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Log not found"
        )
    
    # Check if user can delete this log
    can_delete = False
    
    if log.author_id == current_user.id:
        can_delete = True
    elif log.project.owner_id == current_user.id:
        can_delete = True
    else:
        # Check if user is an admin collaborator
        collab_result = await db.execute(
            select(Collaborator).where(
                and_(
                    Collaborator.project_id == log.project_id,
                    Collaborator.user_id == current_user.id,
                    Collaborator.role == "admin"
                )
            )
        )
        if collab_result.scalar_one_or_none():
            can_delete = True
    
    if not can_delete:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Permission denied to delete this log"
        )
    
    await db.delete(log)
    await db.commit()
    
    return MessageResponse(message="Log deleted successfully")
