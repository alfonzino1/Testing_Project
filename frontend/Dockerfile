# Frontend Dockerfile - Next.js 15

FROM node:20-alpine

WORKDIR /app

# Копирование package файлов для кэширования слоев
COPY package.json package-lock.json* ./

# Установка зависимостей
RUN npm ci

# Копирование исходного кода
COPY . .

# Экспортируем порт
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD wget -qO- http://localhost:3000/health || exit 1

# Запуск в режиме разработки (переопределяется в docker-compose)
CMD ["npm", "run", "dev"]
