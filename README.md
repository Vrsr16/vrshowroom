# VR Showroom

Telegram Bot и Mini App для поиска, заказа и отслеживания товаров/оборудования напрямую с китайских фабрик.

## 🏗 Структура проекта

```
vr-showroom/
├── bot/                 # Telegram Bot (Node.js + Telegraf)
├── mini-app/            # Mini App (React + Vite)
├── shared/              # Общие типы и утилиты
└── docs/                # Документация
```

## 🚀 Быстрый старт

### Требования
- Node.js 18+
- npm 9+

### Установка

```bash
npm install
```

### Настройка окружения

1. Скопируйте `.env.example` в `.env` в папке `bot/`
2. Добавьте токен бота от @BotFather

### Запуск

```bash
# Запуск бота
npm run bot:dev

# Запуск Mini App
npm run app:dev

# Запуск всего вместе
npm run dev
```

## 📱 Функции

### Telegram Bot
- `/start` - Приветствие и регистрация
- `/catalog` - Каталог товаров
- `/search` - Поиск по категориям
- `/order` - Оформление заказа
- `/track` - Отслеживание посылки
- `/help` - Помощь

### Mini App
- 🔍 Расширенный поиск с фильтрами
- 📦 Каталог с карточками товаров
- 🛒 Корзина и оформление заказа
- 👤 Профиль пользователя
- 💬 Чат с поставщиком

## 🛠 Технологии

- **Bot**: Node.js, Telegraf.js
- **Mini App**: React, Vite, TailwindCSS
- **API**: Node.js/Express
- **Database**: PostgreSQL
- **Hosting**: Vercel/Netlify

## 📄 Лицензия

MIT
