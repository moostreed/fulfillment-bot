const TelegramBot = require('node-telegram-bot-api');

// ВСТАВЬ СВОЙ ТОКЕН (вместо 'ВАШ_ТОКЕН')
const token = '8980363625:AAHoX6cZDeQlv9QrubRrF-Ep91CyWk3_OLM';

// Создаём бота с опциями для надёжности
const bot = new TelegramBot(token, {
    polling: {
        timeout: 30,
        interval: 300
    }
});

// Обработка ошибок polling
bot.on('polling_error', (error) => {
    console.log('Polling error:', error.message);
});

// Команда /start
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 'Привет! Я бот для приёма заявок. Скоро здесь будет мини-приложение.');
});

// Команда /test
bot.onText(/\/test/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 'Бот работает!');
});

// Команда /form — отправляет кнопку с Mini App
bot.onText(/\/form/, (msg) => {
    const chatId = msg.chat.id;
    const opts = {
        reply_markup: {
            inline_keyboard: [
                [
                    {
                        text: '📝 Открыть форму заявки',
                        url: 'http://localhost:3000'  // пока локальный адрес
                    }
                ]
            ]
        }
    };
    bot.sendMessage(chatId, 'Нажмите кнопку, чтобы открыть форму заявки:', opts);
});

console.log('Бот запущен и слушает команды...');