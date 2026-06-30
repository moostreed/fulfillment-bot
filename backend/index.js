const express = require('express');
const cors = require('cors');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
const app = express();
const PORT = process.env.PORT || 3000;

// 🔑 Конфигурация Supabase (ЗАМЕНИ НА СВОИ)
const SUPABASE_URL = 'https://pcdcyxrsdifdqhnjtekm.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBjZGN5eHJzZGlmZHFobmp0ZWttIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MjgyNjkwNywiZXhwIjoyMDk4NDAyOTA3fQ.v9ShHf1Djfx5WZVqsgO7QfzXDe9WLaaWz92yy1M-S-s';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'frontend')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
});

app.post('/api/order', async (req, res) => {
    const { name, phone, storeName, date, service, address, comment } = req.body;

    if (!name || !phone || !date || !service) {
        return res.status(400).json({ error: 'Имя, телефон, дата и услуга обязательны' });
    }

    const orderData = {
        name,
        phone,
        store_name: storeName || null,
        date,
        service,
        address: address || null,
        comment: comment || null,
        status: 'новая'
    };

    try {
        const { data, error } = await supabase
            .from('orders')
            .insert([orderData])
            .select();

        if (error) {
            console.error('❌ Ошибка Supabase:', error);
            return res.status(500).json({ error: 'Ошибка базы данных' });
        }

        const savedOrder = data[0];
        console.log('✅ Заявка сохранена в Supabase:', savedOrder);

        // Уведомление в Telegram временно отключено
        // Если хочешь вернуть — раскомментируй блок ниже

        res.status(200).json({ success: true, message: 'Заявка принята' });

    } catch (err) {
        console.error('❌ Критическая ошибка:', err);
        res.status(500).json({ error: 'Внутренняя ошибка сервера' });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Сервер запущен на http://localhost:${PORT}`);
});