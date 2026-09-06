"use client"

import { useState } from "react"
import Link from "next/link"

export default function ResultsPage() {
  const [activeTab, setActiveTab] = useState<"metrics" | "api" | "predictions">("metrics")

  const metrics = {
    accuracy: "94.2%",
    precision: "92.8%",
    recall: "95.1%",
    f1: "93.9%",
    rocAuc: "0.97",
  }

  const confusionMatrix = [
    [85, 3],
    [2, 90],
  ]

  const featureImportance = [
    { name: "income", importance: 0.35 },
    { name: "age", importance: 0.28 },
    { name: "gender", importance: 0.18 },
    { name: "customer_id", importance: 0.12 },
  ]

  const apiCode = `# Python пример
import requests

url = "https://api.automl-studio.ru/v1/predict/your-model-id"
headers = {"Authorization": "Bearer YOUR_API_KEY"}
data = {
    "customer_id": 12345,
    "age": 35,
    "income": 75000,
    "gender": "M"
}

response = requests.post(url, json=data, headers=headers)
prediction = response.json()
print(prediction["predicted_class"])  # output: 1`

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
      <main className="container py-8">
        {/* Success Banner */}
        <div className="mb-8 p-6 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white">
          <div className="flex items-center gap-4">
            <div className="text-4xl">🎉</div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold mb-1">Модель успешно обучена!</h1>
              <p className="opacity-90">Классификация • XGBoost • 94.2% accuracy</p>
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors font-medium">
                Скачать модель
              </button>
              <button className="px-4 py-2 rounded-lg bg-white text-green-600 hover:bg-green-50 transition-colors font-medium">
                Тестировать API
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6 border-b">
          <div className="flex gap-6">
            {[
              { id: "metrics", label: "📊 Метрики" },
              { id: "api", label: "🔌 API" },
              { id: "predictions", label: "🔮 Предсказания" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`pb-3 font-medium transition-colors relative ${
                  activeTab === tab.id
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === "metrics" && (
          <div className="grid gap-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {Object.entries(metrics).map(([key, value]) => (
                <div key={key} className="p-4 rounded-xl border bg-card text-center">
                  <div className="text-sm text-muted-foreground capitalize mb-1">{key}</div>
                  <div className="text-2xl font-bold text-primary">{value}</div>
                </div>
              ))}
            </div>

            {/* Confusion Matrix */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-6 rounded-xl border bg-card">
                <h3 className="font-semibold mb-4">Матрица ошибок</h3>
                <div className="aspect-square max-w-xs mx-auto">
                  <div className="grid grid-cols-3 gap-1">
                    <div />
                    <div className="text-center text-sm font-medium">Предсказано 0</div>
                    <div className="text-center text-sm font-medium">Предсказано 1</div>
                    
                    <div className="text-sm font-medium flex items-center">Фактически 0</div>
                    <div className="aspect-square bg-green-100 rounded-lg flex items-center justify-center text-lg font-bold text-green-800">
                      {confusionMatrix[0][0]}
                    </div>
                    <div className="aspect-square bg-red-100 rounded-lg flex items-center justify-center text-lg font-bold text-red-800">
                      {confusionMatrix[0][1]}
                    </div>
                    
                    <div className="text-sm font-medium flex items-center">Фактически 1</div>
                    <div className="aspect-square bg-red-100 rounded-lg flex items-center justify-center text-lg font-bold text-red-800">
                      {confusionMatrix[1][0]}
                    </div>
                    <div className="aspect-square bg-green-100 rounded-lg flex items-center justify-center text-lg font-bold text-green-800">
                      {confusionMatrix[1][1]}
                    </div>
                  </div>
                </div>
              </div>

              {/* Feature Importance */}
              <div className="p-6 rounded-xl border bg-card">
                <h3 className="font-semibold mb-4">Важность признаков</h3>
                <div className="space-y-4">
                  {featureImportance.map((feature) => (
                    <div key={feature.name}>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="font-medium">{feature.name}</span>
                        <span className="text-muted-foreground">{(feature.importance * 100).toFixed(0)}%</span>
                      </div>
                      <div className="h-2 bg-secondary rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full"
                          style={{ width: `${feature.importance * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "api" && (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 rounded-xl border bg-card">
              <h3 className="font-semibold mb-4">Информация об API</h3>
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Endpoint URL</div>
                  <code className="block p-3 bg-secondary rounded-lg text-sm break-all">
                    https://api.automl-studio.ru/v1/predict/model-12345
                  </code>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">API Key</div>
                  <code className="block p-3 bg-secondary rounded-lg text-sm">
                    sk_live_abc123def456...
                  </code>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Метод</div>
                  <code className="block p-3 bg-secondary rounded-lg text-sm">POST</code>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Лимиты</div>
                  <div className="text-sm">100 запросов / день (Free тариф)</div>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-xl border bg-card">
              <h3 className="font-semibold mb-4">Пример кода</h3>
              <pre className="p-4 bg-gray-900 text-gray-100 rounded-lg text-sm overflow-x-auto">
                <code>{apiCode}</code>
              </pre>
              <button className="mt-4 w-full py-2 rounded-lg border border-input hover:bg-accent transition-colors text-sm font-medium">
                📋 Копировать код
              </button>
            </div>
          </div>
        )}

        {activeTab === "predictions" && (
          <div className="p-6 rounded-xl border bg-card">
            <h3 className="font-semibold mb-4">Тестовые предсказания</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium">ID</th>
                    <th className="text-left py-3 px-4 font-medium">Age</th>
                    <th className="text-left py-3 px-4 font-medium">Income</th>
                    <th className="text-left py-3 px-4 font-medium">Gender</th>
                    <th className="text-left py-3 px-4 font-medium">Предсказание</th>
                    <th className="text-left py-3 px-4 font-medium">Вероятность</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { id: 1, age: 35, income: 75000, gender: "M", pred: 1, prob: 0.89 },
                    { id: 2, age: 28, income: 45000, gender: "F", pred: 0, prob: 0.23 },
                    { id: 3, age: 42, income: 95000, gender: "M", pred: 1, prob: 0.94 },
                    { id: 4, age: 31, income: 52000, gender: "F", pred: 1, prob: 0.67 },
                    { id: 5, age: 25, income: 38000, gender: "M", pred: 0, prob: 0.15 },
                  ].map((row) => (
                    <tr key={row.id} className="border-b last:border-0">
                      <td className="py-3 px-4">{row.id}</td>
                      <td className="py-3 px-4">{row.age}</td>
                      <td className="py-3 px-4">${row.income.toLocaleString()}</td>
                      <td className="py-3 px-4">{row.gender}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          row.pred === 1 ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                        }`}>
                          {row.pred === 1 ? "Да" : "Нет"}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden max-w-[100px]">
                            <div
                              className="h-full bg-primary rounded-full"
                              style={{ width: `${row.prob * 100}%` }}
                            />
                          </div>
                          <span className="text-xs">{(row.prob * 100).toFixed(0)}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
