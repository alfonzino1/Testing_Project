from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.api import auth, projects, datasets, models, predictions
from app.core.database import Base, engine
from app.core.config import get_settings

settings = get_settings()

# Создание таблиц БД
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="MLOps платформа для малого и среднего бизнеса. AutoML, обучение моделей и REST API без кода.",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Настроить для продакшена
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Глобальный обработчик ошибок
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={"detail": f"Internal server error: {str(exc)}"}
    )


# Роуты
app.include_router(auth.router, prefix="/api")
app.include_router(projects.router, prefix="/api")
app.include_router(datasets.router, prefix="/api")
app.include_router(models.router, prefix="/api")
app.include_router(predictions.router, prefix="/api")


@app.get("/")
async def root():
    return {
        "name": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "status": "running",
        "docs": "/docs"
    }


@app.get("/health")
async def health_check():
    return {"status": "healthy"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
