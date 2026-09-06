-- Инициализация базы данных AutoML Studio

-- Включаем расширение UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ===========================================
-- Пользователи
-- ===========================================
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    is_superuser BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);

-- ===========================================
-- Проекты
-- ===========================================
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    task_type VARCHAR(50) CHECK (task_type IN ('classification', 'regression', 'time_series')),
    status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'archived')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_projects_user_id ON projects(user_id);
CREATE INDEX idx_projects_status ON projects(status);

-- ===========================================
-- Датасеты
-- ===========================================
CREATE TABLE IF NOT EXISTS datasets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size BIGINT,
    row_count INTEGER,
    column_count INTEGER,
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    uploaded_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    column_schema JSONB,  -- Информация о типах колонок
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'processed', 'error')),
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_datasets_project_id ON datasets(project_id);
CREATE INDEX idx_datasets_uploaded_by ON datasets(uploaded_by);

-- ===========================================
-- Модели
-- ===========================================
CREATE TABLE IF NOT EXISTS models (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    dataset_id UUID NOT NULL REFERENCES datasets(id) ON DELETE CASCADE,
    model_type VARCHAR(100),
    model_path VARCHAR(500),
    mlflow_run_id VARCHAR(100),
    metrics JSONB,  -- {accuracy: 0.95, roc_auc: 0.97, ...}
    hyperparameters JSONB,
    status VARCHAR(50) DEFAULT 'training' CHECK (status IN ('training', 'completed', 'failed', 'deployed')),
    training_started_at TIMESTAMP WITH TIME ZONE,
    training_completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_models_project_id ON models(project_id);
CREATE INDEX idx_models_dataset_id ON models(dataset_id);
CREATE INDEX idx_models_status ON models(status);

-- ===========================================
-- Предсказания (логирование API запросов)
-- ===========================================
CREATE TABLE IF NOT EXISTS predictions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    model_id UUID NOT NULL REFERENCES models(id) ON DELETE CASCADE,
    input_data JSONB NOT NULL,
    prediction JSONB NOT NULL,
    confidence FLOAT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_predictions_model_id ON predictions(model_id);
CREATE INDEX idx_predictions_created_at ON predictions(created_at);

-- ===========================================
-- API ключи
-- ===========================================
CREATE TABLE IF NOT EXISTS api_keys (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    is_active BOOLEAN DEFAULT TRUE,
    expires_at TIMESTAMP WITH TIME ZONE,
    last_used_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_api_keys_user_id ON api_keys(user_id);
CREATE INDEX idx_api_keys_key_hash ON api_keys(key_hash);

-- ===========================================
-- Тарифы и лимиты
-- ===========================================
CREATE TABLE IF NOT EXISTS subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    plan_type VARCHAR(50) DEFAULT 'free' CHECK (plan_type IN ('free', 'starter', 'pro', 'enterprise')),
    projects_limit INTEGER DEFAULT 3,
    rows_limit INTEGER DEFAULT 10000,
    api_requests_limit INTEGER DEFAULT 100,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT TRUE
);

CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);

-- ===========================================
-- Триггер для обновления updated_at
-- ===========================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ===========================================
-- Начальные данные (опционально)
-- ===========================================
-- Можно добавить суперпользователя по умолчанию для разработки
-- INSERT INTO users (email, hashed_password, full_name, is_superuser)
-- VALUES ('admin@automl.studio', '$2b$12$...', 'Admin User', TRUE);

COMMENT ON TABLE users IS 'Пользователи платформы';
COMMENT ON TABLE projects IS 'ML проекты пользователей';
COMMENT ON TABLE datasets IS 'Загруженные датасеты';
COMMENT ON TABLE models IS 'Обученные ML модели';
COMMENT ON TABLE predictions IS 'Лог предсказаний через API';
COMMENT ON TABLE api_keys IS 'API ключи для доступа к моделям';
COMMENT ON TABLE subscriptions IS 'Тарифные планы пользователей';
