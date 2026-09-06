from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
import json

from app.core.database import get_db
from app.core.dependencies import get_current_active_user
from app.models.schemas import Model
from app.core.security import TokenData

router = APIRouter(prefix="/predictions", tags=["Predictions"])


class PredictionRequest(BaseModel):
    model_id: int
    data: dict  # JSON с данными для предсказания


class PredictionResponse(BaseModel):
    prediction: any
    confidence: float | None = None
    model_id: int
    latency_ms: float


@router.post("/", response_model=PredictionResponse)
async def make_prediction(
    request: PredictionRequest,
    current_user: TokenData = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    import time
    start_time = time.time()
    
    # Получение модели
    model = db.query(Model).filter(
        Model.id == request.model_id,
        Model.is_active == True
    ).first()
    
    if not model:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Active model not found"
        )
    
    if model.status != "completed":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Model is not ready for predictions"
        )
    
    try:
        # Загрузка модели из MLflow или локального хранилища
        # TODO: Реализовать загрузку модели
        # predictor = mlflow.sklearn.load_model(f"runs:/{model.mlflow_run_id}/model")
        
        # Для MVP - заглушка
        prediction = "placeholder_prediction"
        confidence = 0.95
        
        latency_ms = (time.time() - start_time) * 1000
        
        # Логирование предсказания
        # TODO: Сохранить в prediction_logs
        
        return {
            "prediction": prediction,
            "confidence": confidence,
            "model_id": request.model_id,
            "latency_ms": latency_ms
        }
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Prediction error: {str(e)}"
        )


@router.get("/model/{model_id}/schema")
async def get_model_schema(
    model_id: int,
    current_user: TokenData = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Получить схему входных данных для модели
    """
    model = db.query(Model).join(Project).filter(
        Model.id == model_id,
        Project.user_id == current_user.user_id
    ).first()
    
    if not model:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Model not found"
        )
    
    # TODO: Вернуть схему колонок из датасета
    return {
        "model_id": model_id,
        "required_columns": [],  # Получить из columns_info датасета
        "example": {}
    }
