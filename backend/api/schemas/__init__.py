from pydantic import BaseModel, EmailStr, HttpUrl
from typing import Optional, List
from datetime import datetime
from uuid import UUID

# User Schemas
class UserBase(BaseModel):
    name: str
    email: EmailStr
    avatar_url: Optional[str] = None
    bio: Optional[str] = None
    website: Optional[str] = None
    github: Optional[str] = None

class UserCreate(UserBase):
    clerk_id: str

class UserUpdate(BaseModel):
    name: Optional[str] = None
    bio: Optional[str] = None
    website: Optional[str] = None
    github: Optional[str] = None

class User(UserBase):
    id: UUID
    clerk_id: str
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

# Project Schemas
class ProjectBase(BaseModel):
    title: str
    description: Optional[str] = None
    is_public: bool = True

class ProjectCreate(ProjectBase):
    slug: str

class ProjectUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    is_public: Optional[bool] = None

class Project(ProjectBase):
    id: UUID
    slug: str
    owner_id: UUID
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

class ProjectWithOwner(Project):
    owner: User

class ProjectWithStats(Project):
    owner: User
    log_count: int
    collaborator_count: int

# Log Schemas  
class LogBase(BaseModel):
    title: str
    content: str
    log_type: str = "update"
    image_url: Optional[str] = None

class LogCreate(LogBase):
    project_id: UUID

class LogUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    log_type: Optional[str] = None
    image_url: Optional[str] = None

class Log(LogBase):
    id: UUID
    project_id: UUID
    author_id: UUID
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

class LogWithAuthor(Log):
    author: User

# Collaborator Schemas
class CollaboratorBase(BaseModel):
    role: str = "viewer"

class CollaboratorInvite(BaseModel):
    email: EmailStr
    role: str = "viewer"

class CollaboratorAccept(BaseModel):
    invite_token: str

class Collaborator(CollaboratorBase):
    id: UUID
    project_id: UUID
    user_id: UUID
    invited_at: datetime
    joined_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

class CollaboratorWithUser(Collaborator):
    user: User

# Response Schemas
class AuthResponse(BaseModel):
    user: User
    access_token: str

class InviteResponse(BaseModel):
    invite_token: str
    expires_at: datetime

class MessageResponse(BaseModel):
    message: str

# List Response Schemas
class UserList(BaseModel):
    users: List[User]
    total: int

class ProjectList(BaseModel):
    projects: List[ProjectWithStats]
    total: int

class LogList(BaseModel):
    logs: List[LogWithAuthor]
    total: int

class CollaboratorList(BaseModel):
    collaborators: List[CollaboratorWithUser]
    total: int
