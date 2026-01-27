# AI Rhyme Bot

**AI Rhyme Bot** — это умный телеграм-бот, который помогает подбирать рифмы не только к отдельным словам, но и к целым фразам. В отличие от обычных генераторов, он использует **OpenAI (ChatGPT)**, чтобы сохранять ритм, смысл и юмор в ответах.

## Что умеет бот

- **Рифмы к словам:** Подбирает созвучные слова
- **Рифмы к фразам:** Генерирует рифмы к целым выражениям
- **Адаптивность:** Понимает контекст и старается генерировать смешные или остроумные варианты
- **История:** Сохраняет все запросы пользователей в базу данных (MongoDB)

## Стек технологий

- **Core:** Node.js 18 (JavaScript)
- **Container:** Docker + Docker Compose
- **Telegram:** node-telegram-bot-api
- **AI:** OpenAI API (GPT-3.5 Turbo)
- **Database:** MongoDB + Mongoose
- **Tools:** Dotenv

## Структура проекта

```
├── docker-compose.yml    # Конфигурация Docker Compose (бот + MongoDB)
├── README.md             # Документация проекта
└── src/
    ├── .dockerignore     # Исключения для Docker-образа
    ├── .env              # Переменные окружения (не в git)
    ├── .env.example      # Пример файла с переменными окружения
    ├── .gitignore        # Исключения для Git
    ├── Dockerfile        # Конфигурация Docker-образа для бота
    ├── index.js          # Основной код бота
    ├── package.json      # Зависимости Node.js
    └── package-lock.json # Зафиксированные версии зависимостей
```

## Быстрый старт (Docker)

**Рекомендуемый способ запуска.** Вам не нужно устанавливать Node.js или MongoDB локально. Достаточно только [Docker Desktop](https://www.docker.com/products/docker-desktop/).

### 1. Клонируйте репозиторий

```bash
git clone https://github.com/imyaxx/rhyme-bot.git
cd rhyme-bot
```

### 2. Создайте файл .env

Скопируйте пример конфигурации:

```bash
cd src
cp .env.example .env
```

Откройте `src/.env` и замените значения на свои:

```env
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
OPENAI_API_KEY=your_openai_api_key
MONGODB_URI=mongodb://mongo:27017/rhymebot
```

**Где взять токены:**

- **TELEGRAM_BOT_TOKEN:** Получите у [@BotFather](https://t.me/BotFather) в Telegram
- **OPENAI_API_KEY:** Создайте на [platform.openai.com](https://platform.openai.com/api-keys)

### 3. Запустите бота

```bash
docker-compose up --build
```

Бот автоматически подключится к MongoDB и начнет обрабатывать сообщения.

### 4. Остановка

```bash
docker-compose down
```

Для удаления данных MongoDB:

```bash
docker-compose down -v
```

---

## Запуск без Docker (локально)

Если вы хотите запустить бота без Docker:

### Предварительные требования

- [Node.js](https://nodejs.org/) версия 18 или выше
- [MongoDB](https://www.mongodb.com/try/download/community) (запущенная локально или в облаке)

### Установка

1. Клонируйте репозиторий:

```bash
git clone https://github.com/imyaxx/rhyme-bot.git
cd rhyme-bot/src
```

2. Установите зависимости:

```bash
npm install
```

3. Создайте файл `.env` в папке `src`:

```env
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
OPENAI_API_KEY=your_openai_api_key
MONGODB_URI=mongodb://localhost:27017/rhymebot
```

4. Запустите бота:

```bash
node index.js
```

---

## Использование

1. Найдите вашего бота в Telegram
2. Отправьте `/start` для приветствия
3. Напишите любое слово или фразу
4. Получите список рифм!

---

## Технические детали

### Зависимости (package.json)

- `dotenv` ^17.2.3 — загрузка переменных окружения
- `mongoose` ^9.1.5 — ODM для MongoDB
- `node-telegram-bot-api` ^0.67.0 — взаимодействие с Telegram Bot API
- `openai` ^6.16.0 — работа с OpenAI API

### Docker-конфигурация

Проект использует два контейнера:

- **bot:** Node.js приложение (собирается из `src/Dockerfile`)
- **mongo:** MongoDB база данных (официальный образ)

Данные MongoDB сохраняются в Docker volume `mongo_data`.

---

## Лицензия

ISC
