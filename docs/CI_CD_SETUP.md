# CI/CD Setup Guide

## 📋 Обзор пайплайна

CI/CD настроен через **GitHub Actions** и состоит из 4 этапов:

### 1️⃣ Backend Check (PR + Push)
- Установка Python 3.12
- Линтинг через `flake8`
- Проверка типов через `mypy`
- Запуск тестов через `pytest`

### 2️⃣ Frontend Check (PR + Push)
- Установка Node.js 20
- Линтинг через `npm run lint`
- Сборка проекта через `npm run build`

### 3️⃣ Build & Push Docker Images (только main branch)
- Логин в GitHub Container Registry (ghcr.io)
- Сборка и пуш Docker образа backend
- Сборка и пуш Docker образа frontend
- Теги: `latest` + `sha-{commit}`

### 4️⃣ Deploy to VPS (только main branch)
- SSH подключение к серверу
- Pull новых образов
- Пересоздание контейнеров
- Очистка старых образов

---

## 🔐 Настройка секретов

В репозитории GitHub перейди в **Settings → Secrets and variables → Actions** и добавь:

| Secret | Описание | Пример |
|--------|----------|--------|
| `VPS_HOST` | IP или домен сервера | `192.168.1.100` или `vm.example.com` |
| `VPS_USERNAME` | Пользователь SSH | `root` или `deploy` |
| `VPS_SSH_KEY` | Приватный SSH ключ | `-----BEGIN OPENSSH PRIVATE KEY-----...` |

### Как создать SSH ключ для деплоя:

```bash
# На локальной машине
ssh-keygen -t ed25519 -C "github-actions-deploy" -f ~/.id/github_automl_deploy

# Копируем публичный ключ на сервер
ssh-copy-id -i ~/.id/github_automl_deploy.pub user@vps_host

# Копируем приватный ключ в GitHub Secrets
cat ~/.id/github_automl_deploy | pbcopy
```

---

## 🚀 Первый запуск

1. **Закоммить и запуш:**
   ```bash
   git add .github/workflows/ci-cd.yml
   git commit -m "Add CI/CD pipeline"
   git push origin main
   ```

2. **Проверь вкладку Actions** в GitHub — пайплайн должен запуститься автоматически

3. **Для деплоя убедись, что на сервере:**
   - Установлен Docker + Docker Compose
   - Есть файл `docker-compose.yml`
   - Пользователь имеет права на выполнение docker команд

---

## 🛠️ Кастомизация

### Изменить registry (например, на Docker Hub)

```yaml
env:
  REGISTRY: docker.io
  IMAGE_NAME_BACKEND: username/backend
  IMAGE_NAME_FRONTEND: username/frontend
```

И добавь секрет `DOCKERHUB_USERNAME` и `DOCKERHUB_TOKEN`.

### Добавить staging окружение

Создай отдельный workflow файл `.github/workflows/deploy-staging.yml`:

```yaml
on:
  push:
    branches: [ "develop" ]
```

### Добавить уведомления в Telegram

```yaml
- name: Notify Telegram
  if: failure()
  uses: appleboy/telegram-action@master
  with:
    to: ${{ secrets.TELEGRAM_CHAT_ID }}
    token: ${{ secrets.TELEGRAM_BOT_TOKEN }}
    message: |
      ❌ Build failed!
      Commit: ${{ github.commit_message }}
      Author: ${{ github.actor }}
      URL: ${{ github.event.head_commit.url }}
```

---

## 📊 Статус билда

Добавь бейдж в README.md:

```markdown
![CI/CD](https://github.com/YOUR_USERNAME/automl-studio/actions/workflows/ci-cd.yml/badge.svg)
```

---

## 🔍 Troubleshooting

| Проблема | Решение |
|----------|---------|
| `permission denied` при деплое | Добавь пользователя в группу docker: `usermod -aG docker $USER` |
| Образы не пушатся | Проверь права доступа в Settings → Actions → General |
| SSH не подключается | Убедись, что ключ в правильном формате (OpenSSH) |
| `docker compose` not found | Обнови Docker Compose до v2 или замени на `docker-compose` |
