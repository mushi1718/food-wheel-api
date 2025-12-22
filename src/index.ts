import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fetchNearbyRestaurants } from './services/restaurantService';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); // 預設允許全開，不需要像 C# 寫那麼多 policy
app.use(express.json());

// 路由
app.get('/restaurants/nearby', async (req, res) => {
    // 1. 接收並轉型參數 (Express 的 query 都是 string)
    const lat = parseFloat(req.query.latitude as string);
    const lon = parseFloat(req.query.longitude as string);
    const radius = req.query.radius ? parseFloat(req.query.radius as string) : 1.5;

    // 2. 驗證
    if (isNaN(lat) || isNaN(lon)) {
        // 這裡記得加 return，不然程式會繼續往下跑
        return res.status(400).json({ error: 'Latitude and Longitude are required' });
    }

    // 3. 呼叫 Service (直接使用 import 進來的函式)
    try {
        const data = await fetchNearbyRestaurants(lat, lon, radius);
        return res.json(data);
    } catch (err) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

// 啟動
app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});