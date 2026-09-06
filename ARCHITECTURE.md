# AutoML Studio - Архитектура платформы

## 📋 Обзор

AutoML Studio — это MLOps-платформа для малого и среднего бизнеса, позволяющая предпринимателям создавать ML-модели без написания кода.

**Основной workflow:**
1. Пользователь загружает CSV-файл
2. Выбирает тип задачи (классификация / регрессия / прогнозирование)
3. Система автоматически обучает модель через AutoML
4. Пользователь получает REST API и дашборд с метриками

---

## 🏗️ Высокоуровневая архитектура

```
┌─────────────────────────────────────────────────────────────┐
│                     FRONTEND (Next.js 15)                    │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │ Лендинг  │  │ Дашборд  │  │ Загрузка │  │ Результаты│   │
│  │          │  │ проектов │  │ данных   │  │ модели    │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│                    BACKEND API (FastAPI)                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │ Auth     │  │ Pipeline │  │ Model    │  │ Billing  │   │
│  │ (JWT)    │  │ Engine   │  │ Registry │  │          │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│                   ML ENGINE (Python/Celery)                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │ AutoML   │  │ Feature  │  │ Training │  │ Drift    │   │
│  │ Pipeline │  │ Engineer │  │ Monitor  │  │ Detection│   │
│  │ (AutoGluon│  │          │  │ (MLflow) │  │          │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│                    INFRASTRUCTURE                            │
│  PostgreSQL  │  Redis  │  S3 (MinIO)  │  Docker  │  Nginx   │
└─────────────────────────────────────────────────────────────┘
```

---

## 📁 Структура проекта

```
automl-studio/
├── frontend/                    # Next.js приложение
│   ├── app/
│   │   ├── (landing)/          # Лендинг страница
│   │   ├── dashboard/           # Основной дашборд
│   │   │   ├── projects/        # Список проектов
│   │   │   ├── upload/          # Загрузка данных
│   │   │   ├── train/           # Обучение модели
│   │   │   └── results/         # Результаты + API
│   │   └── api/                 # Next.js API routes
│   ├── components/              # UI компоненты (shadcn/ui)
│   ├── lib/                     # Утилиты, API клиент
│   ├── public/                  # Статические файлы
│   └── package.json
│
├── backend/                     # FastAPI приложение
│   ├── app/
│   │   ├── api/                 # API роуты
│   │   │   ├── auth.py          # JWT авторизация
│   │   │   ├── projects.py      # Управление проектами
│   │   │   ├── datasets.py      # Загрузка и обработка данных
│   │   │   ├── models.py        # Управление моделями
│   │   │   └── predictions.py   # Предсказания
│   │   ├── core/                # Конфигурация и безопасность
│   │   │   ├── config.py        # Настройки приложения
│   │   │   ├── security.py      # JWT, хеширование паролей
│   │   │   └── database.py      # Подключение к БД
│   │   ├── models/              # SQLAlchemy модели
│   │   │   ├── user.py
│   │   │   ├── project.py
│   │   │   ├── dataset.py
│   │   │   └── model.py
│   │   ├── schemas/             # Pydantic схемы
│   │   ├── services/            # Бизнес-логика
│   │   │   ├── automl.py        # AutoML engine (AutoGluon)
│   │   │   ├── dataset.py       # Обработка данных
│   │   │   └── mlflow_client.py # Интеграция с MLflow
│   │   └── workers/             # Celery задачи
│   │       └── train_model.py   # Фоновое обучение моделей
│   ├── alembic/                 # Миграции БД
│   ├── tests/                   # Тесты
│   └── requirements.txt
│
├── mlflow/                      # MLflow tracking server
│   └── docker-compose.yml
│
├── infrastructure/              # Инфраструктурные конфиги
│   ├── docker-compose.yml       # Основной compose
│   ├── nginx/
│   │   └── nginx.conf
│   └── scripts/
│       └── init.sql
│
├── docs/                        # Документация
│   └── api.md
│
├── .env.example                 # Пример переменных окружения
├── .gitignore
├── README.md
└── ARCHITECTURE.md
```

---

## 🔧 Технологический стек

### Frontend
- **Next.js 15** — React фреймворк с App Router
- **React 19** — UI библиотека
- **Tailwind CSS** — Стилизация
- **shadcn/ui** — Готовые UI компоненты
- **Recharts** — Визуализация метрик
- **Zustand** — State management

### Backend
- **FastAPI** — REST API
- **Python 3.12** — Язык программирования
- **SQLAlchemy 2.0** — ORM
- **Pydantic** — Валидация данных
- **Passlib + JWT** — Аутентификация

### ML Engine
- **AutoGluon** — AutoML библиотека
- **MLflow** — Tracking экспериментов
- **Celery** — Очереди задач
- **Redis** — Broker для Celery

### Infrastructure
- **PostgreSQL** — Основная БД
- **Redis** — Кэш и broker
- **MinIO** — S3-совместимое хранилище
- **Docker & Docker Compose** — Контейнеризация
- **Nginx** — Reverse proxy

---

## 🔄 Основные потоки данных

### 1. Загрузка датасета
```
User → Frontend → Backend API → MinIO (сохранение файла)
                                   ↓
                            PostgreSQL (метаданные)
                                   ↓
                            Celery (валидация данных)
```

### 2. Обучение модели
```
User выбирает задачу → Backend создаёт задачу в Celery
                                   ↓
                         Celery worker запускает AutoGluon
                                   ↓
                         MLflow логирует эксперименты
                                   ↓
                         Модель сохраняется в MinIO
                                   ↓
                         PostgreSQL обновляется статусом
                                   ↓
                         User получает уведомление
```

### 3. Предсказание через API
```
Client → Backend API (/predict) → Загрузка модели из MinIO
                                   ↓
                         Предсказание
                                   ↓
                         Логирование в MLflow
                                   ↓
                         Ответ клиенту
```

---

## 🔐 Безопасность

- **JWT токены** для аутентификации
- **HTTPS** через Nginx
- **Валидация входных данных** через Pydantic
- **Изоляция проектов** на уровне БД
- **Rate limiting** для API

---

## 📊 Масштабирование

### Горизонтальное масштабирование
- Несколько экземпляров Backend API за Nginx
- Несколько Celery workers для параллельного обучения
- Репликация PostgreSQL
- Redis Cluster

### Вертикальное масштабирование
- Увеличение ресурсов для ML workers (GPU/CPU)
- Увеличение лимитов MinIO

---

## 🎯 MVP функционал (Неделя 1-4)

| Компонент | Функционал | Приоритет |
|-----------|-----------|-----------|
| Auth | Регистрация, логин, JWT | 🔴 High |
| Projects | CRUD операций с проектами | 🔴 High |
| Datasets | Загрузка CSV, валидация | 🔴 High |
| AutoML | Обучение модели через AutoGluon | 🔴 High |
| Dashboard | Список проектов, статусы | 🟡 Medium |
| Metrics | Визуализация accuracy, ROC-AUC | 🟡 Medium |
| API Predictions | REST endpoint для предсказаний | 🟡 Medium |
| Model Versioning | История моделей | 🟢 Low |
| Drift Detection | Мониторинг дрейфа данных | 🟢 Low |

---

## 🚀 Развёртывание

### Локальная разработка
```bash
docker-compose up -d
```

### Production (VPS)
1. Docker Compose на VPS
2. Nginx как reverse proxy
3. Let's Encrypt для SSL
4. Backup PostgreSQL через cron

### Будущее: Kubernetes
- Helm charts для каждого компонента
- Horizontal Pod Autoscaler для backend и workers
- Persistent Volumes для данных

---

## 📈 Метрики успеха

- **Time-to-model**: < 5 минут от загрузки до готовой модели
- **Accuracy**: AutoGluon должен давать quality ≥ ручного подбора
- **Uptime**: 99.9% для production
- **Latency**: < 200ms для predict endpoint

---

*Документ будет обновляться по мере развития проекта*
