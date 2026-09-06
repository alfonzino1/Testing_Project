from celery import Task
from app.workers.celery_worker import celery_app
from sqlalchemy.orm import Session
from app.core.database import SessionLocal
import autogluon.tabular as agb
import pandas as pd
import json
import time
import os
from datetime import datetime

import mlflow
from mlflow.tracking import MlflowClient

from app.core.config import get_settings
from app.models.schemas import Model, Project

settings = get_settings()


@celery_app.task(bind=True, max_retries=3)
def train_model_task(self, model_id: int, project_id: int, dataset_path: str, target_column: str, task_type: str):
    """
    Фоновая задача обучения модели с использованием AutoGluon
    """
    db = SessionLocal()
    start_time = time.time()
    
    try:
        # Обновление статуса модели
        model = db.query(Model).filter(Model.id == model_id).first()
        if not model:
            raise ValueError(f"Model {model_id} not found")
        
        model.status = "training"
        db.commit()
        
        # Настройка MLflow
        mlflow.set_tracking_uri(settings.MLFLOW_TRACKING_URI)
        mlflow.set_experiment(f"project_{project_id}")
        
        # Загрузка данных
        df = pd.read_csv(dataset_path)
        
        # Разделение на train/val
        train_data, val_data = agb.TabularDataset(df), agb.TabularDataset(df.sample(frac=0.2))
        
        # Определение типа задачи
        problem_type = None
        if task_type == "classification":
            problem_type = "binary" if df[target_column].nunique() == 2 else "multiclass"
        elif task_type == "regression":
            problem_type = "regression"
        
        if not problem_type:
            raise ValueError(f"Unsupported task type: {task_type}")
        
        # Обучение модели AutoGluon
        save_path = f"/tmp/autogluon_models/{project_id}/{model_id}"
        os.makedirs(save_path, exist_ok=True)
        
        predictor = agb.TabularPredictor(
            label=target_column,
            problem_type=problem_type,
            path=save_path
        )
        
        with mlflow.start_run(run_name=f"model_{model_id}") as run:
            # Логирование параметров
            mlflow.log_param("model_id", model_id)
            mlflow.log_param("project_id", project_id)
            mlflow.log_param("target_column", target_column)
            mlflow.log_param("task_type", task_type)
            mlflow.log_param("time_limit", settings.AUTOML_TIME_LIMIT)
            
            # Обучение
            predictor.fit(
                train_data=train_data,
                time_limit=settings.AUTOML_TIME_LIMIT,
                presets="medium_quality"  # Можно сделать настраиваемым
            )
            
            # Оценка качества
            performance = predictor.evaluate(val_data)
            
            # Логирование метрик
            if "accuracy" in performance:
                mlflow.log_metric("accuracy", performance["accuracy"])
            if "roc_auc" in performance:
                mlflow.log_metric("roc_auc", performance["roc_auc"])
            if "f1" in performance:
                mlflow.log_metric("f1", performance["f1"])
            
            # Логирование модели
            mlflow.sklearn.log_model(predictor, "model")
            
            # Получение лучшей модели
            best_model = predictor.get_model_best()
            model_summary = predictor.fit_summary()
            
            training_time = time.time() - start_time
            
            # Обновление записи модели
            model.model_type = best_model
            model.mlflow_run_id = run.info.run_id
            model.metrics = json.dumps(performance)
            model.hyperparameters = json.dumps(model_summary.get("model_info", {}).get(best_model, {}))
            model.artifact_path = save_path
            model.is_active = True
            model.training_time = training_time
            model.status = "completed"
            
            # Деактивация других моделей проекта
            db.query(Model).filter(
                Model.project_id == project_id,
                Model.id != model_id
            ).update({"is_active": False})
            
            # Обновление статуса проекта
            project = db.query(Project).filter(Project.id == project_id).first()
            if project:
                project.status = "completed"
            
            db.commit()
            
            return {
                "status": "success",
                "model_id": model_id,
                "metrics": performance,
                "training_time": training_time
            }
    
    except Exception as exc:
        # Обработка ошибок
        model = db.query(Model).filter(Model.id == model_id).first()
        if model:
            model.status = "failed"
            model.error_message = str(exc)
            db.commit()
        
        # Retry logic
        raise self.retry(exc=exc, countdown=300)  # Retry через 5 минут
    
    finally:
        db.close()


@celery_app.task
def cleanup_old_models():
    """
    Задача очистки старых моделей (запускать по расписанию)
    """
    # TODO: Реализовать очистку старых моделей
    pass
