"use client"

import { useState } from "react"
import Link from "next/link"

export default function ProjectsPage() {
  const [projects] = useState([
    { id: 1, name: "Прогноз продаж", type: "Регрессия", status: "ready", accuracy: "94.2%", created: "2024-01-15" },
    { id: 2, name: "Классификация клиентов", type: "Классификация", status: "ready", accuracy: "89.7%", created: "2024-01-14" },
    { id: 3, name: "Отток пользователей", type: "Классификация", status: "training", accuracy: null, created: "2024-01-16" },
  ])

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
            <Link href="/dashboard/projects" className="text-sm font-medium text-primary">
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
      <main className="container py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Мои проекты</h1>
            <p className="text-muted-foreground">Управляйте вашими ML-моделями</p>
          </div>
          <Link
            href="/dashboard/upload"
            className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            + Новый проект
          </Link>
        </div>

        {/* Projects Grid */}
        <div className="grid gap-4">
          {projects.map((project) => (
            <div
              key={project.id}
              className="p-6 rounded-xl border bg-card hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold">{project.name}</h3>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      project.type === "Регрессия" 
                        ? "bg-blue-100 text-blue-800" 
                        : "bg-green-100 text-green-800"
                    }`}>
                      {project.type}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      project.status === "ready"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}>
                      {project.status === "ready" ? "Готова" : "Обучение"}
                    </span>
                  </div>
                  <div className="flex items-center gap-6 text-sm text-muted-foreground">
                    <span>Создан: {project.created}</span>
                    {project.accuracy && (
                      <span>Точность: <strong className="text-foreground">{project.accuracy}</strong></span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    href={`/dashboard/results?projectId=${project.id}`}
                    className="inline-flex items-center justify-center rounded-lg border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent transition-colors"
                  >
                    Результаты
                  </Link>
                  <Link
                    href={`/dashboard/train?projectId=${project.id}`}
                    className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                  >
                    Обучить
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {projects.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📊</div>
            <h3 className="text-xl font-semibold mb-2">Нет проектов</h3>
            <p className="text-muted-foreground mb-6">Создайте первый проект и загрузите данные</p>
            <Link
              href="/dashboard/upload"
              className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Загрузить данные
            </Link>
          </div>
        )}
      </main>
    </div>
  )
}
