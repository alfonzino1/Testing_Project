from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    # App
    APP_NAME: str = "AutoML Studio API"
    APP_VERSION: str = "0.1.0"
    DEBUG: bool = True
    
    # Database
    POSTGRES_USER: str = "automl"
    POSTGRES_PASSWORD: str = "automl_password"
    POSTGRES_DB: str = "automl_db"
    POSTGRES_HOST: str = "postgres"
    POSTGRES_PORT: str = "5432"
    
    @property
    def DATABASE_URL(self) -> str:
        return f"postgresql://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}@{self.POSTGRES_HOST}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}"
    
    # Redis
    REDIS_HOST: str = "redis"
    REDIS_PORT: str = "6379"
    
    @property
    def CELERY_BROKER_URL(self) -> str:
        return f"redis://{self.REDIS_HOST}:{self.REDIS_PORT}/0"
    
    @property
    def CELERY_RESULT_BACKEND(self) -> str:
        return f"redis://{self.REDIS_HOST}:{self.REDIS_PORT}/1"
    
    # JWT
    SECRET_KEY: str = "your-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # MinIO/S3
    MINIO_ENDPOINT: str = "minio:9000"
    MINIO_ACCESS_KEY: str = "automl-access"
    MINIO_SECRET_KEY: str = "automl-secret"
    MINIO_BUCKET: str = "datasets"
    
    # MLflow
    MLFLOW_TRACKING_URI: str = "http://mlflow:5000"
    
    # AutoGluon
    AUTOML_TIME_LIMIT: int = 300  # 5 minutes default
    
    class Config:
        env_file = ".env"


@lru_cache()
def get_settings() -> Settings:
    return Settings()
