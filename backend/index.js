const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Telegram-данные (замени на свои)
const TELEGRAM_TOKEN = '8980363625:AAHoX6cZDeQlv9QrubRrF-Ep91CyWk3_OLM'; // твой токен
const CHAT_ID = 575833745; // сюда вставь свой chat_id (как число без кавычек)

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'frontend')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
});

app.post('/api/order', async (req, res) => {
    const { date, service, comment } = req.body;
    if (!date || !service) {
        return res.status(400).json({ error: 'Дата и услуга обязательны' });
    }

    const order = {
        date,
        service,
        comment: comment || '',
        receivedAt: new Date().toISOString()
    };

    // Сохраняем в память (временно)
    // (массив orders мы пока не используем, но можно оставить)
    console.log('📩 Новая заявка:', order);

    // Отправляем уведомление в Telegram
    try {
        const message = `
📩 *Новая заявка!*
📅 Дата: ${order.date}
📦 Услуга: ${order.service}
📝 Комментарий: ${order.comment || 'нет'}
🕒 Получено: ${new Date(order.receivedAt).toLocaleString('ru-RU')}
        `;
        const url = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: CHAT_ID,
                text: message,
                parse_mode: 'Markdown'
            })
        });
        const result = await response.json();
        if (result.ok) {
            console.log('✅ Уведомление отправлено в Telegram');
        } else {
            console.error('❌ Ошибка отправки в Telegram:', result);
        }
    } catch (err) {
        console.error('❌ Ошибка при отправке в Telegram:', err.message);
    }

    res.status(200).json({ success: true, message: 'Заявка принята' });
});

app.listen(PORT, () => {
    console.log(`🚀 Сервер запущен на http://localhost:${PORT}`);
});