# AutoML Studio Backend

## Структура проекта

```
backend/
├── app/
│   ├── api/                 # API роуты
│   │   ├── auth.py          # Регистрация, логин, JWT
│   │   ├── projects.py      # Управление проектами
│   │   ├── datasets.py      # Загрузка CSV, анализ данных
│   │   ├── models.py        # Обучение моделей, версионирование
│   │   └── predictions.py   # REST API для предсказаний
│   ├── core/                # Ядро приложения
│   │   ├── config.py        # Конфигурация из env
│   │   ├── database.py      # SQLAlchemy сессии
│   │   ├── security.py      # JWT, хеширование паролей
│   │   └── dependencies.py  # FastAPI зависимости
│   ├── models/              # SQLAlchemy модели
│   │   └── schemas.py       # User, Project, Dataset, Model
│   ├── services/            # Бизнес-логика (TODO)
│   ├── workers/             # Celery задачи
│   │   ├── celery_worker.py # Конфигурация Celery
│   │   └── train_model.py   # AutoML обучение
│   └── main.py              # Точка входа FastAPI
├── alembic/                 # Миграции БД (TODO)
├── requirements.txt         # Зависимости Python
└── Dockerfile
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Регистрация пользователя
- `POST /api/auth/login` - Логин, получение JWT токена
- `GET /api/auth/me` - Информация о текущем пользователе

### Projects
- `POST /api/projects/` - Создать проект
- `GET /api/projects/` - Список проектов пользователя
- `GET /api/projects/{id}` - Детали проекта
- `DELETE /api/projects/{id}` - Удалить проект

### Datasets
- `POST /api/datasets/upload/{project_id}` - Загрузить CSV
- `GET /api/datasets/{id}` - Информация о датасете
- `GET /api/datasets/project/{project_id}` - Все датасеты проекта

### Models
- `POST /api/models/train` - Запустить обучение модели
- `GET /api/models/` - Список моделей
- `GET /api/models/{id}` - Детали модели
- `POST /api/models/{id}/activate` - Активировать модель
- `DELETE /api/models/{id}` - Удалить модель

### Predictions
- `POST /api/predictions/` - Сделать предсказание
- `GET /api/predictions/model/{id}/schema` - Схема входных данных

## Запуск локально

```bash
# Установка зависимостей
pip install -r requirements.txt

# Запуск PostgreSQL, Redis, MinIO
docker-compose up -d postgres redis minio

# Применение миграций (TODO)
alembic upgrade head

# Запуск сервера
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Запуск Celery worker
celery -A app.workers.celery_worker worker --loglevel=info
```

## Документация API

После запуска откройте:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Тестирование

Пример запроса на регистрацию:
```bash
curl -X POST "http://localhost:8000/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "secret123", "full_name": "Test User"}'
```

Пример запроса на логин:
```bash
curl -X POST "http://localhost:8000/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "secret123"}'
```
