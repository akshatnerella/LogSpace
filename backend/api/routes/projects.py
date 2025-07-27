from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, and_
from sqlalchemy.orm import selectinload
from typing import Optional, List
from uuid import UUID
import re

from db.session import get_db
from api.deps.auth import get_current_user, get_optional_user
from api.models import User, Project, Log, Collaborator
from api.schemas import (
    ProjectCreate, ProjectUpdate, Project as ProjectSchema,
    ProjectWithOwner, ProjectWithStats, ProjectList, MessageResponse
)

router = APIRouter(prefix="/projects", tags=["projects"])

def generate_slug(title: str) -> str:
    """Generate a URL-friendly slug from title"""
    slug = re.sub(r'[^a-zA-Z0-9\s-]', '', title.lower())
    slug = re.sub(r'\s+', '-', slug.strip())
    return slug[:50]  # Limit length

@router.post("/", response_model=ProjectSchema, status_code=status.HTTP_201_CREATED)
async def create_project(
    project: ProjectCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a new project"""
    
    # Check if slug already exists
    result = await db.execute(
        select(Project).where(Project.slug == project.slug)
    )
    if result.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Project with this slug already exists"
        )
    
    # Create project
    db_project = Project(
        title=project.title,
        slug=project.slug,
        description=project.description,
        is_public=project.is_public,
        owner_id=current_user.id
    )
    
    db.add(db_project)
    await db.commit()
    await db.refresh(db_project)
    
    return db_project

@router.get("/{project_id}", response_model=ProjectWithOwner)
async def get_project(
    project_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_user)
):
    """Get a specific project"""
    
    result = await db.execute(
        select(Project)
        .options(selectinload(Project.owner))
        .where(Project.id == project_id)
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
    
    return project

@router.get("/slug/{slug}", response_model=ProjectWithOwner)
async def get_project_by_slug(
    slug: str,
    db: AsyncSession = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_user)
):
    """Get a project by its slug"""
    
    result = await db.execute(
        select(Project)
        .options(selectinload(Project.owner))
        .where(Project.slug == slug)
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
                        Collaborator.project_id == project.id,
                        Collaborator.user_id == current_user.id
                    )
                )
            )
            if not collab_result.scalar_one_or_none():
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Access denied"
                )
    
    return project

@router.get("/user/{user_id}", response_model=ProjectList)
async def get_user_projects(
    user_id: UUID,
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_user)
):
    """Get projects by user ID"""
    
    # Base query for projects
    query = select(Project).options(selectinload(Project.owner)).where(Project.owner_id == user_id)
    
    # If not the owner, only show public projects
    if not current_user or current_user.id != user_id:
        query = query.where(Project.is_public == True)
    
    # Get projects with pagination
    result = await db.execute(query.offset(skip).limit(limit))
    projects = result.scalars().all()
    
    # Get stats for each project
    projects_with_stats = []
    for project in projects:
        # Get log count
        log_count_result = await db.execute(
            select(func.count(Log.id)).where(Log.project_id == project.id)
        )
        log_count = log_count_result.scalar() or 0
        
        # Get collaborator count
        collab_count_result = await db.execute(
            select(func.count(Collaborator.id)).where(Collaborator.project_id == project.id)
        )
        collab_count = collab_count_result.scalar() or 0
        
        project_dict = {
            **project.__dict__,
            "log_count": log_count,
            "collaborator_count": collab_count
        }
        projects_with_stats.append(project_dict)
    
    # Get total count
    total_result = await db.execute(
        select(func.count(Project.id)).where(Project.owner_id == user_id)
    )
    total = total_result.scalar() or 0
    
    return ProjectList(projects=projects_with_stats, total=total)

@router.put("/{project_id}", response_model=ProjectSchema)
async def update_project(
    project_id: UUID,
    project_update: ProjectUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update a project"""
    
    result = await db.execute(
        select(Project).where(Project.id == project_id)
    )
    project = result.scalar_one_or_none()
    
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    # Check ownership or admin permission
    if project.owner_id != current_user.id:
        collab_result = await db.execute(
            select(Collaborator).where(
                and_(
                    Collaborator.project_id == project_id,
                    Collaborator.user_id == current_user.id,
                    Collaborator.role == "admin"
                )
            )
        )
        if not collab_result.scalar_one_or_none():
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Permission denied"
            )
    
    # Update fields
    update_data = project_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(project, field, value)
    
    await db.commit()
    await db.refresh(project)
    
    return project

@router.delete("/{project_id}", response_model=MessageResponse)
async def delete_project(
    project_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Delete a project (owner only)"""
    
    result = await db.execute(
        select(Project).where(Project.id == project_id)
    )
    project = result.scalar_one_or_none()
    
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    # Only owner can delete
    if project.owner_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only project owner can delete the project"
        )
    
    await db.delete(project)
    await db.commit()
    
    return MessageResponse(message="Project deleted successfully")
