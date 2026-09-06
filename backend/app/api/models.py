from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from sqlalchemy.orm import Session
from typing import List
from pydantic import BaseModel
from datetime import datetime

from app.core.database import get_db
from app.core.dependencies import get_current_active_user
from app.models.schemas import Model, Project, Dataset
from app.core.security import TokenData
from app.workers.train_model import train_model_task
from app.core.config import get_settings

router = APIRouter(prefix="/models", tags=["Models"])

settings = get_settings()


class ModelCreate(BaseModel):
    project_id: int
    name: str
    version: str | None = "1.0.0"


class ModelResponse(BaseModel):
    id: int
    project_id: int
    name: str
    version: str
    model_type: str | None = None
    metrics: dict | None = None
    training_time: float | None = None
    status: str
    is_active: bool
    created_at: datetime
    
    class Config:
        from_attributes = True


@router.post("/train", response_model=ModelResponse, status_code=status.HTTP_201_CREATED)
async def train_model(
    model_data: ModelCreate,
    background_tasks: BackgroundTasks,
    current_user: TokenData = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    # Проверка проекта
    project = db.query(Project).filter(
        Project.id == model_data.project_id,
        Project.user_id == current_user.user_id
    ).first()
    
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    if project.status != "uploaded":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Project must have uploaded dataset before training"
        )
    
    # Получение датасета
    dataset = db.query(Dataset).filter(Dataset.project_id == model_data.project_id).first()
    if not dataset:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Dataset not found"
        )
    
    if not dataset.target_column:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Target column not specified"
        )
    
    # Создание записи модели
    new_model = Model(
        project_id=model_data.project_id,
        name=model_data.name,
        version=model_data.version or "1.0.0",
        status="pending"
    )
    
    db.add(new_model)
    db.commit()
    db.refresh(new_model)
    
    # Запуск фонового обучения
    train_model_task.delay(
        model_id=new_model.id,
        project_id=model_data.project_id,
        dataset_path=dataset.file_path,  # TODO: Получить реальный путь из MinIO
        target_column=dataset.target_column,
        task_type=project.task_type
    )
    
    return new_model


@router.get("/", response_model=List[ModelResponse])
async def list_models(
    project_id: int | None = None,
    current_user: TokenData = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    query = db.query(Model).join(Project).filter(
        Project.user_id == current_user.user_id
    )
    
    if project_id:
        query = query.filter(Model.project_id == project_id)
    
    models = query.order_by(Model.created_at.desc()).all()
    return models


@router.get("/{model_id}", response_model=ModelResponse)
async def get_model(
    model_id: int,
    current_user: TokenData = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    model = db.query(Model).join(Project).filter(
        Model.id == model_id,
        Project.user_id == current_user.user_id
    ).first()
    
    if not model:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Model not found"
        )
    
    return model


@router.delete("/{model_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_model(
    model_id: int,
    current_user: TokenData = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    model = db.query(Model).join(Project).filter(
        Model.id == model_id,
        Project.user_id == current_user.user_id
    ).first()
    
    if not model:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Model not found"
        )
    
    db.delete(model)
    db.commit()
    
    return None


@router.post("/{model_id}/activate", response_model=ModelResponse)
async def activate_model(
    model_id: int,
    current_user: TokenData = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    model = db.query(Model).join(Project).filter(
        Model.id == model_id,
        Project.user_id == current_user.user_id
    ).first()
    
    if not model:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Model not found"
        )
    
    if model.status != "completed":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only completed models can be activated"
        )
    
    # Деактивация всех моделей проекта
    db.query(Model).join(Project).filter(
        Model.project_id == model.project_id,
        Project.user_id == current_user.user_id
    ).update({"is_active": False})
    
    # Активация выбранной модели
    model.is_active = True
    db.commit()
    db.refresh(model)
    
    return model
