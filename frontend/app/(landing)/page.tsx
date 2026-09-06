import Link from "next/link"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              AutoML Studio
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="#features" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              Возможности
            </Link>
            <Link href="#how-it-works" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              Как работает
            </Link>
            <Link href="#pricing" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              Тарифы
            </Link>
            <Link href="/dashboard/projects" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              Войти
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container py-24 md:py-32 space-y-8">
        <div className="mx-auto max-w-4xl text-center space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Создавайте{" "}
            <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              ML-модели
            </span>{" "}
            за 5 минут без кода
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Загрузите CSV-файл, выберите задачу и получите готовую модель с REST API. 
            Никаких дата-сайентистов и сложного кода.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/dashboard/upload"
              className="inline-flex items-center justify-center rounded-lg bg-primary px-8 py-3 text-base font-medium text-primary-foreground hover:bg-primary/90 transition-colors shadow-lg shadow-primary/25"
            >
              Начать бесплатно
            </Link>
            <Link
              href="#how-it-works"
              className="inline-flex items-center justify-center rounded-lg border border-input bg-background px-8 py-3 text-base font-medium hover:bg-accent transition-colors"
            >
              Узнать больше
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-12">
          {[
            { value: "5 мин", label: "До первой модели" },
            { value: "95%+", label: "Точность моделей" },
            { value: "0 ₽", label: "Старт бесплатно" },
            { value: "24/7", label: "API доступность" },
          ].map((stat) => (
            <div key={stat.label} className="text-center space-y-2">
              <div className="text-3xl md:text-4xl font-bold text-primary">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="container py-24 bg-secondary/30 rounded-3xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Возможности платформы</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Всё необходимое для создания и использования ML-моделей в одном месте
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              icon: "📊",
              title: "AutoML",
              description: "Автоматический подбор лучшей модели для ваших данных. Поддержка классификации, регрессии и прогнозирования.",
            },
            {
              icon: "🚀",
              title: "REST API",
              description: "Готовый API эндпоинт для интеграции модели в ваш продукт сразу после обучения.",
            },
            {
              icon: "📈",
              title: "Метрики качества",
              description: "Подробные отчёты: accuracy, precision, recall, ROC-AUC, матрица ошибок и важность признаков.",
            },
            {
              icon: "🔒",
              title: "Безопасность",
              description: "JWT аутентификация, изоляция проектов, шифрование данных и регулярные бэкапы.",
            },
            {
              icon: "📁",
              title: "Версионирование",
              description: "Хранение всех версий моделей, возможность отката и сравнения результатов.",
            },
            {
              icon: "💰",
              title: "Доступная цена",
              description: "Бесплатный тариф для старта, прозрачные платные планы без скрытых платежей.",
            },
          ].map((feature) => (
            <div
              key={feature.title}
              className="p-6 rounded-2xl bg-background border shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="container py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Как это работает</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Три простых шага от данных до работающей модели
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              step: "1",
              title: "Загрузите данные",
              description: "Перетащите CSV-файл в интерфейс. Система автоматически определит типы колонок и целевую переменную.",
            },
            {
              step: "2",
              title: "Выберите задачу",
              description: "Укажите тип задачи: классификация, регрессия или прогнозирование временных рядов.",
            },
            {
              step: "3",
              title: "Получите модель",
              description: "Через несколько минут получите обученную модель с метриками и готовым REST API.",
            },
          ].map((item) => (
            <div key={item.step} className="relative p-8 rounded-2xl bg-gradient-to-b from-primary/5 to-transparent border">
              <div className="absolute -top-4 -left-4 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold shadow-lg">
                {item.step}
              </div>
              <h3 className="text-xl font-semibold mb-3 mt-2">{item.title}</h3>
              <p className="text-muted-foreground">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="container py-24 bg-secondary/30 rounded-3xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Простые тарифы</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Начните бесплатно, масштабируйтесь по мере роста
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {[
            {
              name: "Free",
              price: "0 ₽",
              period: "навсегда",
              features: ["3 проекта", "10K строк/датасет", "100 API-запросов/день", "Базовая поддержка"],
              cta: "Начать бесплатно",
              popular: false,
            },
            {
              name: "Starter",
              price: "4 900 ₽",
              period: "в месяц",
              features: ["10 проектов", "100K строк/датасет", "10K API-запросов/день", "Приоритетная поддержка", "Все метрики"],
              cta: "Попробовать Starter",
              popular: true,
            },
            {
              name: "Pro",
              price: "14 900 ₽",
              period: "в месяц",
              features: ["Безлимит проектов", "1M строк/датасет", "100K API-запросов/день", "VIP поддержка", "Кастомные модели"],
              cta: "Выбрать Pro",
              popular: false,
            },
          ].map((tier) => (
            <div
              key={tier.name}
              className={`relative p-8 rounded-2xl bg-background border ${
                tier.popular ? "border-primary shadow-lg shadow-primary/10" : ""
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full">
                  Популярный
                </div>
              )}
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2">{tier.name}</h3>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-bold">{tier.price}</span>
                  <span className="text-muted-foreground">/{tier.period}</span>
                </div>
              </div>
              <ul className="space-y-3 mb-8">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-sm">
                    <svg className="w-5 h-5 text-primary flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
              <Link
                href="/dashboard/projects"
                className={`block w-full py-3 px-4 rounded-lg text-center font-medium transition-colors ${
                  tier.popular
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
              >
                {tier.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container py-24">
        <div className="max-w-3xl mx-auto text-center p-12 rounded-3xl bg-gradient-to-r from-primary to-purple-600 text-primary-foreground">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Готовы начать?</h2>
          <p className="text-lg opacity-90 mb-8">
            Создайте первую ML-модель уже сегодня. Регистрация займёт меньше минуты.
          </p>
          <Link
            href="/dashboard/upload"
            className="inline-flex items-center justify-center rounded-lg bg-background px-8 py-3 text-base font-medium text-primary hover:bg-background/90 transition-colors"
          >
            Создать проект бесплатно
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-secondary/30">
        <div className="container py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                AutoML Studio
              </span>
              <p className="text-sm text-muted-foreground">
                Платформа для создания ML-моделей без программирования
              </p>
            </div>
            {[
              {
                title: "Продукт",
                links: [
                  { label: "Возможности", href: "#features" },
                  { label: "Тарифы", href: "#pricing" },
                  { label: "API Docs", href: "/docs" },
                ],
              },
              {
                title: "Компания",
                links: [
                  { label: "О нас", href: "#" },
                  { label: "Блог", href: "#" },
                  { label: "Контакты", href: "#" },
                ],
              },
              {
                title: "Правовая информация",
                links: [
                  { label: "Privacy Policy", href: "#" },
                  { label: "Terms of Service", href: "#" },
                ],
              },
            ].map((column) => (
              <div key={column.title}>
                <h4 className="font-semibold mb-4">{column.title}</h4>
                <ul className="space-y-2">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <Link href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} AutoML Studio. Все права защищены.
          </div>
        </div>
      </footer>
    </div>
  )
}
