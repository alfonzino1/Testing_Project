# AutoML Studio - MLOps платформа для малого и среднего бизнеса

🚀 **Платформа, где предприниматель загружает CSV → через 5 минут получает работающую ML-модель с REST API и дашбордом. Без кода, без дата-сайентистов.**

---

## 🎯 Что это?

AutoML Studio позволяет малому бизнесу использовать машинное обучение без необходимости нанимать дорогих специалистов:

- ✅ Загрузка данных через drag-n-drop
- ✅ Авто-определение типа задачи (классификация / регрессия / прогнозирование)
- ✅ Автоматический подбор и обучение модели
- ✅ Готовый REST API для интеграции
- ✅ Дашборд с метриками качества

---

## 🏗️ Архитектура

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Frontend      │────▶│   Backend       │────▶│   ML Engine     │
│   Next.js 15    │     │   FastAPI       │     │   AutoGluon     │
└─────────────────┘     └─────────────────┘     └─────────────────┘
                               │
              ┌────────────────┼────────────────┐
              ▼                ▼                ▼
         PostgreSQL        Redis            MinIO (S3)
```

Полная документация в [`ARCHITECTURE.md`](./ARCHITECTURE.md)

---

## 🚀 Быстрый старт

### Требования
- Docker & Docker Compose
- Node.js 20+ (для локальной разработки frontend)
- Python 3.12+ (для локальной разработки backend)

### Запуск через Docker Compose

```bash
# Клонируйте репозиторий
git clone <repository-url>
cd automl-studio

# Скопируйте переменные окружения
cp .env.example .env

# Запустите все сервисы
docker-compose up -d

# Проверьте статус
docker-compose ps
```

Сервисы будут доступны по адресам:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **Backend Docs (Swagger)**: http://localhost:8000/docs
- **MLflow**: http://localhost:5000
- **MinIO Console**: http://localhost:9001
- **PostgreSQL**: localhost:5432
- **Redis**: localhost:6379

---

## 📁 Структура проекта

```
automl-studio/
├── frontend/              # Next.js приложение
├── backend/               # FastAPI приложение
├── infrastructure/        # Docker, Nginx, скрипты
├── docs/                  # Документация
├── docker-compose.yml     # Основной compose файл
├── ARCHITECTURE.md        # Подробная архитектура
└── README.md              # Этот файл
```

---

## 🛠️ Технологический стек

### Frontend
- Next.js 15 + React 19
- Tailwind CSS + shadcn/ui
- Recharts (визуализация)
- Zustand (state management)

### Backend
- FastAPI + Python 3.12
- SQLAlchemy 2.0 + PostgreSQL
- Celery + Redis (очереди)
- JWT авторизация

### ML Engine
- AutoGluon (AutoML)
- MLflow (tracking экспериментов)
- Pandas, Scikit-learn

### Infrastructure
- Docker & Docker Compose
- MinIO (S3-совместимое хранилище)
- Nginx (reverse proxy)

---

## 📋 План разработки

### Неделя 1: Фундамент
- [x] Архитектура и документация
- [ ] Docker-окружение (PostgreSQL, Redis, MinIO, MLflow)
- [ ] FastAPI скелет + авторизация (JWT)
- [ ] Next.js проект + shadcn/ui
- [ ] Лендинг страница

### Неделя 2: Ядро
- [ ] Загрузка CSV + авто-определение типов
- [ ] AutoML pipeline (AutoGluon обёртка)
- [ ] Celery worker для фонового обучения
- [ ] MLflow интеграция

### Неделя 3: UI + API
- [ ] Дашборд проектов
- [ ] Визуализация метрик (Recharts)
- [ ] REST API для предсказаний
- [ ] Документация API (Swagger)

### Неделя 4: Полировка
- [ ] Обработка ошибок
- [ ] Валидация данных
- [ ] Деплой на VPS
- [ ] Форма обратной связи

---

## 💰 Тарифы

| Тариф | Цена | Лимиты |
|-------|------|--------|
| **Free** | 0 ₽ | 3 проекта, 10K строк, 100 API-запросов/день |
| **Starter** | 4 900 ₽/мес | 10 проектов, 100K строк, 10K запросов/день |
| **Pro** | 14 900 ₽/мес | Безлимит проектов, 1M строк, 100K запросов/день |
| **Enterprise** | По запросу | On-premise, кастомные модели, SLA |

---

## 🔐 Безопасность

- JWT токены для аутентификации
- HTTPS через Nginx
- Валидация всех входных данных
- Изоляция проектов на уровне БД
- Rate limiting для API

---

## 🤝 Контрибьюция

1. Fork репозиторий
2. Создай ветку (`git checkout -b feature/amazing-feature`)
3. Закоммить изменения (`git commit -m 'Add amazing feature'`)
4. Запуш (`git push origin feature/amazing-feature`)
5. Открой Pull Request

---

## 📄 Лицензия

MIT License - см. файл [LICENSE](./LICENSE)

---

## 📞 Контакты

- Email: hello@automl.studio
- Telegram: @automl_studio

---

*AutoML Studio — ML для каждого бизнеса 🚀*

---

## 🔄 CI/CD

Статус сборки: ![CI/CD](https://github.com/YOUR_USERNAME/automl-studio/actions/workflows/ci-cd.yml/badge.svg)

Подробная инструкция по настройке CI/CD в [`docs/CI_CD_SETUP.md`](./docs/CI_CD_SETUP.md)

### Что настроено:
- ✅ Автоматический линтинг и тесты backend (Python)
- ✅ Автоматическая сборка и проверка frontend (Node.js)
- ✅ Build & Push Docker образов в GitHub Container Registry
- ✅ Авто-деплой на VPS при пуше в main branch
- ✅ Уведомления (опционально Telegram)
