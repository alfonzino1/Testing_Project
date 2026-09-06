from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import List
from pydantic import BaseModel
from datetime import datetime

from app.core.database import get_db
from app.core.dependencies import get_current_active_user
from app.models.schemas import Project, Dataset
from app.core.security import TokenData

router = APIRouter(prefix="/projects", tags=["Projects"])


class ProjectCreate(BaseModel):
    name: str
    description: str | None = None
    task_type: str  # classification, regression, time_series


class ProjectResponse(BaseModel):
    id: int
    name: str
    description: str | None = None
    task_type: str | None = None
    status: str
    user_id: int
    created_at: datetime
    
    class Config:
        from_attributes = True


@router.post("/", response_model=ProjectResponse, status_code=status.HTTP_201_CREATED)
async def create_project(
    project_data: ProjectCreate,
    current_user: TokenData = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    new_project = Project(
        name=project_data.name,
        description=project_data.description,
        task_type=project_data.task_type,
        user_id=current_user.user_id,
        status="draft"
    )
    
    db.add(new_project)
    db.commit()
    db.refresh(new_project)
    
    return new_project


@router.get("/", response_model=List[ProjectResponse])
async def list_projects(
    current_user: TokenData = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    projects = db.query(Project).filter(Project.user_id == current_user.user_id).all()
    return projects


@router.get("/{project_id}", response_model=ProjectResponse)
async def get_project(
    project_id: int,
    current_user: TokenData = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    project = db.query(Project).filter(
        Project.id == project_id,
        Project.user_id == current_user.user_id
    ).first()
    
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    return project


@router.delete("/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_project(
    project_id: int,
    current_user: TokenData = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    project = db.query(Project).filter(
        Project.id == project_id,
        Project.user_id == current_user.user_id
    ).first()
    
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    db.delete(project)
    db.commit()
    
    return None
