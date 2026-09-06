from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import Optional
import pandas as pd
import json
import io
from pydantic import BaseModel
from datetime import datetime

from app.core.database import get_db
from app.core.dependencies import get_current_active_user
from app.models.schemas import Dataset, Project
from app.core.security import TokenData
from app.core.config import get_settings

router = APIRouter(prefix="/datasets", tags=["Datasets"])

settings = get_settings()


class DatasetResponse(BaseModel):
    id: int
    project_id: int
    file_name: str
    file_size: int | None = None
    row_count: int | None = None
    column_count: int | None = None
    columns_info: dict | None = None
    target_column: str | None = None
    created_at: datetime
    
    class Config:
        from_attributes = True


class ColumnInfo(BaseModel):
    name: str
    dtype: str
    nullable: bool
    unique_count: int


@router.post("/upload/{project_id}", response_model=DatasetResponse)
async def upload_dataset(
    project_id: int,
    file: UploadFile = File(...),
    target_column: Optional[str] = Form(None),
    current_user: TokenData = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    # Проверка проекта
    project = db.query(Project).filter(
        Project.id == project_id,
        Project.user_id == current_user.user_id
    ).first()
    
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    # Проверка формата файла
    if not file.filename.endswith('.csv'):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only CSV files are supported"
        )
    
    try:
        # Чтение CSV для анализа
        contents = await file.read()
        df = pd.read_csv(io.BytesIO(contents))
        
        # Анализ колонок
        columns_info = []
        for col in df.columns:
            col_info = {
                "name": col,
                "dtype": str(df[col].dtype),
                "nullable": bool(df[col].isna().any()),
                "unique_count": int(df[col].nunique())
            }
            columns_info.append(col_info)
        
        # Авто-определение целевой колонки если не указана
        if not target_column and project.task_type:
            if project.task_type == "classification":
                # Ищем категориальные колонки
                for col in df.columns:
                    if df[col].dtype == 'object' or df[col].dtype.name == 'category':
                        target_column = col
                        break
            elif project.task_type == "regression":
                # Ищем числовые колонки
                for col in df.columns:
                    if pd.api.types.is_numeric_dtype(df[col]):
                        target_column = col
                        break
        
        # Сохранение файла в MinIO (для MVP пока локально)
        file_path = f"projects/{project_id}/{file.filename}"
        # TODO: Реализовать загрузку в MinIO
        # Для MVP сохраняем метаданные
        
        # Создание записи датасета
        dataset = Dataset(
            project_id=project_id,
            file_name=file.filename,
            file_path=file_path,
            file_size=len(contents),
            row_count=len(df),
            column_count=len(df.columns),
            columns_info=json.dumps(columns_info),
            target_column=target_column
        )
        
        db.add(dataset)
        
        # Обновление статуса проекта
        project.status = "uploaded"
        
        db.commit()
        db.refresh(dataset)
        
        return dataset
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error processing file: {str(e)}"
        )


@router.get("/{dataset_id}", response_model=DatasetResponse)
async def get_dataset(
    dataset_id: int,
    current_user: TokenData = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    dataset = db.query(Dataset).join(Project).filter(
        Dataset.id == dataset_id,
        Project.user_id == current_user.user_id
    ).first()
    
    if not dataset:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Dataset not found"
        )
    
    return dataset


@router.get("/project/{project_id}", response_model=list[DatasetResponse])
async def list_project_datasets(
    project_id: int,
    current_user: TokenData = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    datasets = db.query(Dataset).join(Project).filter(
        Dataset.project_id == project_id,
        Project.user_id == current_user.user_id
    ).all()
    
    return datasets
