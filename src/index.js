require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const mongoose = require('mongoose');
const OpenAI = require('openai');

// 1. Настройка клиентов
const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// 2. Подключение к MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('✅ MongoDB подключена'))
    .catch(err => console.error('Ошибка подключения к MongoDB:', err));

// Схема для хранения запросов
const RequestSchema = new mongoose.Schema({
    userId: Number,
    username: String,
    word: String,
    rhymes: String,
    date: { type: Date, default: Date.now }
});

const RhymeRequest = mongoose.model('RhymeRequest', RequestSchema);

// 3. Обработка входящих сообщений
bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;

    // Игнорируем команду /start
    if (text === '/start') {
        return bot.sendMessage(chatId, 'Привет! Напиши любое слово, и я подберу к нему рифмы.');
    }

    try {
        // Отправляем индикатор "печатает...", пока ждем ответ от AI
        bot.sendChatAction(chatId, 'typing');

        // 4. Запрос к OpenAI
        const completion = await openai.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: `Ты — генератор рифм. Твоя задача — придумывать созвучные замены словам и фразам пользователя.
                    
                    Примеры правильных ответов:
                    Пользователь: "кошка"
                    Ты: ложка, плошка, мошка, окрошка.
                    
                    Пользователь: "красная мышка"
                    Ты: ужасная стрижка, опасная вышка, прекрасная книжка, напрасная вспышка.

                    Отвечай ТОЛЬКО списком рифм через запятую.`
                },
                {
                    role: "user",
                    content: text
                }
            ],
            model: "gpt-3.5-turbo", // Или gpt-4o, если доступен
        });

        const reply = completion.choices[0].message.content;

        // 5. Сохранение в базу данных
        await RhymeRequest.create({
            userId: msg.from.id,
            username: msg.from.username,
            word: text,
            rhymes: reply
        });

        // Отправка ответа пользователю
        await bot.sendMessage(chatId, `Рифмы к слову "${text}":\n\n${reply}`);

    } catch (error) {
        console.error('Ошибка:', error);
        bot.sendMessage(chatId, 'Ой, что-то пошло не так. Попробуйте другое слово.');
    }
});

console.log('🤖 Бот запущен...');