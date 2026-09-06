"use client"

import { useState, useRef } from "react"
import Link from "next/link"

export default function UploadPage() {
  const [dragActive, setDragActive] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [columns, setColumns] = useState<Array<{ name: string; type: string }>>([])
  const inputRef = useRef<HTMLInputElement>(null)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const handleFile = (selectedFile: File) => {
    if (!selectedFile.name.endsWith('.csv')) {
      alert('Пожалуйста, загрузите CSV файл')
      return
    }
    
    setFile(selectedFile)
    // Mock column detection
    setTimeout(() => {
      setColumns([
        { name: "customer_id", type: "integer" },
        { name: "age", type: "numeric" },
        { name: "income", type: "numeric" },
        { name: "gender", type: "categorical" },
        { name: "purchased", type: "target" },
      ])
    }, 1000)
  }

  const handleUpload = async () => {
    if (!file) return
    
    setUploading(true)
    // Simulate upload
    await new Promise(resolve => setTimeout(resolve, 2000))
    setUploading(false)
    // Redirect to train page
    window.location.href = "/dashboard/train?uploaded=true"
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
            <Link href="/dashboard/upload" className="text-sm font-medium text-primary">
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
          <h1 className="text-3xl font-bold mb-2">Загрузка данных</h1>
          <p className="text-muted-foreground">Загрузите CSV файл для начала работы</p>
        </div>

        {/* Upload Area */}
        <div
          className={`relative border-2 border-dashed rounded-xl p-12 text-center transition-colors ${
            dragActive
              ? "border-primary bg-primary/5"
              : file
              ? "border-green-500 bg-green-50"
              : "border-input hover:border-primary/50"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".csv"
            onChange={handleChange}
            className="hidden"
          />
          
          {!file ? (
            <>
              <div className="text-6xl mb-4">📁</div>
              <h3 className="text-xl font-semibold mb-2">Перетащите CSV файл сюда</h3>
              <p className="text-muted-foreground mb-6">или нажмите для выбора файла</p>
              <button
                onClick={() => inputRef.current?.click()}
                className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                Выбрать файл
              </button>
              <p className="text-xs text-muted-foreground mt-4">
                Максимальный размер: 100 MB • Поддерживаются только CSV файлы
              </p>
            </>
          ) : (
            <div className="space-y-4">
              <div className="text-6xl">✅</div>
              <div>
                <p className="font-semibold">{file.name}</p>
                <p className="text-sm text-muted-foreground">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              
              {columns.length > 0 && (
                <div className="text-left mt-6">
                  <h4 className="font-semibold mb-3">Обнаруженные колонки:</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {columns.map((col) => (
                      <div
                        key={col.name}
                        className={`px-3 py-2 rounded-lg text-sm ${
                          col.type === "target"
                            ? "bg-green-100 text-green-800"
                            : col.type === "categorical"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {col.name}
                        <span className="ml-2 opacity-75">({col.type})</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-3 justify-center pt-4">
                <button
                  onClick={() => {
                    setFile(null)
                    setColumns([])
                  }}
                  className="inline-flex items-center justify-center rounded-lg border border-input bg-background px-6 py-2.5 text-sm font-medium hover:bg-accent transition-colors"
                >
                  Отмена
                </button>
                <button
                  onClick={handleUpload}
                  disabled={uploading}
                  className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  {uploading ? "Загрузка..." : "Продолжить"}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Info Cards */}
        <div className="grid md:grid-cols-3 gap-6 mt-8">
          {[
            {
              icon: "🎯",
              title: "Авто-определение",
              description: "Система автоматически определит типы колонок и целевую переменную",
            },
            {
              icon: "🔒",
              title: "Безопасно",
              description: "Данные шифруются при передаче и хранении",
            },
            {
              icon: "⚡",
              title: "Быстро",
              description: "Обработка файлов до 100K строк за несколько секунд",
            },
          ].map((item) => (
            <div key={item.title} className="p-6 rounded-xl border bg-card">
              <div className="text-3xl mb-3">{item.icon}</div>
              <h3 className="font-semibold mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.description}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
