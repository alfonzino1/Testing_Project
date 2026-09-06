from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Float, Boolean, Text
from sqlalchemy.orm import relationship
from datetime import datetime

from app.core.database import Base


class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255))
    is_active = Column(Boolean, default=True)
    is_superuser = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    projects = relationship("Project", back_populates="user")
    
    # Тариф: free, starter, pro, enterprise
    subscription_plan = Column(String(50), default="free")
    subscription_expires_at = Column(DateTime, nullable=True)


class Project(Base):
    __tablename__ = "projects"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    description = Column(Text)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    task_type = Column(String(50))  # classification, regression, time_series
    status = Column(String(50), default="draft")  # draft, uploaded, training, completed, failed
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    user = relationship("User", back_populates="projects")
    datasets = relationship("Dataset", back_populates="project")
    models = relationship("Model", back_populates="project")


class Dataset(Base):
    __tablename__ = "datasets"
    
    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=False)
    file_name = Column(String(255), nullable=False)
    file_path = Column(String(512), nullable=False)  # S3 path
    file_size = Column(Integer)  # bytes
    row_count = Column(Integer)
    column_count = Column(Integer)
    columns_info = Column(Text)  # JSON with column types
    target_column = Column(String(255))
    created_at = Column(DateTime, default=datetime.utcnow)
    
    project = relationship("Project", back_populates="datasets")


class Model(Base):
    __tablename__ = "models"
    
    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=False)
    name = Column(String(255), nullable=False)
    version = Column(String(50), default="1.0.0")
    model_type = Column(String(100))  # AutoGluon, RandomForest, etc.
    mlflow_run_id = Column(String(255))
    metrics = Column(Text)  # JSON with accuracy, precision, recall, etc.
    hyperparameters = Column(Text)  # JSON
    artifact_path = Column(String(512))  # S3 path to model artifacts
    is_active = Column(Boolean, default=False)  # Only one active model per project
    training_time = Column(Float)  # seconds
    status = Column(String(50), default="pending")  # pending, training, completed, failed
    error_message = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    project = relationship("Project", back_populates="models")


class PredictionLog(Base):
    __tablename__ = "prediction_logs"
    
    id = Column(Integer, primary_key=True, index=True)
    model_id = Column(Integer, ForeignKey("models.id"), nullable=False)
    input_data = Column(Text)  # JSON
    prediction = Column(Text)  # JSON
    confidence = Column(Float)
    latency_ms = Column(Float)
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
    
    model = relationship("Model")
