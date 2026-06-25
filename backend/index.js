const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Хранилище заявок в памяти (временно)
let orders = [];

app.use(express.static(path.join(__dirname, '..', 'frontend')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
});

app.post('/api/order', (req, res) => {
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

    orders.push(order);
    console.log('📩 Новая заявка:', order);
    console.log(`📋 Всего заявок: ${orders.length}`);
    res.status(200).json({ success: true, message: 'Заявка принята' });
});

app.listen(PORT, () => {
    console.log(`🚀 Сервер запущен на порту ${PORT}`);
});