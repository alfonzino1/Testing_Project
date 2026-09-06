"use client"

import { useState } from "react"
import Link from "next/link"

export default function TrainPage() {
  const [taskType, setTaskType] = useState<"classification" | "regression" | "timeseries">("classification")
  const [targetColumn, setTargetColumn] = useState("purchased")
  const [training, setTraining] = useState(false)
  const [progress, setProgress] = useState(0)

  const columns = [
    { name: "customer_id", type: "integer" },
    { name: "age", type: "numeric" },
    { name: "income", type: "numeric" },
    { name: "gender", type: "categorical" },
    { name: "purchased", type: "target" },
  ]

  const startTraining = async () => {
    setTraining(true)
    // Simulate training progress
    for (let i = 0; i <= 100; i += 5) {
      setProgress(i)
      await new Promise(resolve => setTimeout(resolve, 200))
    }
    setTraining(false)
    // Redirect to results
    window.location.href = "/dashboard/results?trained=true"
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              AutoML Studio
            </span>
          </Link>
          <nav className="flex items-center gap-6">
            <Link href="/dashboard/projects" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              Проекты
            </Link>
            <Link href="/dashboard/upload" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              Загрузить данные
            </Link>
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
              U
            </div>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Обучение модели</h1>
          <p className="text-muted-foreground">Настройте параметры и запустите AutoML</p>
        </div>

        <div className="grid gap-6">
          {/* Task Type Selection */}
          <div className="p-6 rounded-xl border bg-card">
            <h3 className="font-semibold mb-4">Тип задачи</h3>
            <div className="grid md:grid-cols-3 gap-4">
              {[
                {
                  id: "classification",
                  icon: "🎯",
                  title: "Классификация",
                  description: "Предсказание категории (да/нет, A/B/C)",
                },
                {
                  id: "regression",
                  icon: "📈",
                  title: "Регрессия",
                  description: "Предсказание числового значения",
                },
                {
                  id: "timeseries",
                  icon: "📊",
                  title: "Временной ряд",
                  description: "Прогнозирование на основе времени",
                },
              ].map((task) => (
                <button
                  key={task.id}
                  onClick={() => setTaskType(task.id as typeof taskType)}
                  className={`p-4 rounded-lg border text-left transition-all ${
                    taskType === task.id
                      ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                      : "hover:border-primary/50"
                  }`}
                >
                  <div className="text-3xl mb-2">{task.icon}</div>
                  <div className="font-semibold">{task.title}</div>
                  <div className="text-sm text-muted-foreground">{task.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Target Column Selection */}
          <div className="p-6 rounded-xl border bg-card">
            <h3 className="font-semibold mb-4">Целевая переменная</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Выберите колонку, которую нужно предсказывать
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {columns.map((col) => (
                <button
                  key={col.name}
                  onClick={() => setTargetColumn(col.name)}
                  className={`px-4 py-3 rounded-lg border text-left transition-all ${
                    targetColumn === col.name
                      ? "border-green-500 bg-green-50 ring-2 ring-green-500/20"
                      : "hover:border-primary/50"
                  }`}
                >
                  <div className="font-medium">{col.name}</div>
                  <div className="text-xs text-muted-foreground">{col.type}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Training Progress */}
          {training && (
            <div className="p-6 rounded-xl border bg-card">
              <h3 className="font-semibold mb-4">Обучение модели</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Прогресс</span>
                  <span className="font-medium">{progress}%</span>
                </div>
                <div className="h-3 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="grid grid-cols-3 gap-4 pt-4">
                  {[
                    { label: "Этап", value: progress < 30 ? "Подготовка" : progress < 60 ? "Feature Engineering" : "Обучение" },
                    { label: "Модель", value: progress < 60 ? "-" : "XGBoost" },
                    { label: "Время", value: progress < 100 ? `${Math.floor((100 - progress) / 5)} сек` : "Готово" },
                  ].map((stat) => (
                    <div key={stat.label}>
                      <div className="text-xs text-muted-foreground">{stat.label}</div>
                      <div className="font-medium">{stat.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Start Button */}
          {!training && (
            <div className="flex gap-3 justify-end">
              <Link
                href="/dashboard/upload"
                className="inline-flex items-center justify-center rounded-lg border border-input bg-background px-6 py-2.5 text-sm font-medium hover:bg-accent transition-colors"
              >
                Назад
              </Link>
              <button
                onClick={startTraining}
                className="inline-flex items-center justify-center rounded-lg bg-primary px-8 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors shadow-lg shadow-primary/25"
              >
                🚀 Начать обучение
              </button>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="mt-8 p-6 rounded-xl bg-blue-50 border border-blue-200">
          <div className="flex gap-3">
            <div className="text-2xl">💡</div>
            <div>
              <h4 className="font-semibold text-blue-900 mb-1">AutoML в действии</h4>
              <p className="text-sm text-blue-700">
                Система автоматически подберёт лучшую модель из 10+ алгоритмов, выполнит кросс-валидацию 
                и оптимизирует гиперпараметры. Обычно это занимает 2-5 минут.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
