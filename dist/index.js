"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const restaurantService_1 = require("./services/restaurantService");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
// Middleware
app.use((0, cors_1.default)()); // 預設允許全開，不需要像 C# 寫那麼多 policy
app.use(express_1.default.json());
// 路由
app.get('/restaurants/nearby', async (req, res) => {
    // 1. 接收並轉型參數 (Express 的 query 都是 string)
    const lat = parseFloat(req.query.latitude);
    const lon = parseFloat(req.query.longitude);
    const radius = req.query.radius ? parseFloat(req.query.radius) : 1.5;
    // 2. 驗證
    if (isNaN(lat) || isNaN(lon)) {
        // 這裡記得加 return，不然程式會繼續往下跑
        return res.status(400).json({ error: 'Latitude and Longitude are required' });
    }
    // 3. 呼叫 Service (直接使用 import 進來的函式)
    try {
        const data = await (0, restaurantService_1.fetchNearbyRestaurants)(lat, lon, radius);
        return res.json(data);
    }
    catch (err) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});
// 啟動
app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});
