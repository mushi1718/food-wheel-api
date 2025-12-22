"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchNearbyRestaurants = void 0;
const axios_1 = __importDefault(require("axios"));
const OVERPASS_URL = process.env.OVERPASS_URL || 'https://overpass-api.de/api/interpreter';
// 輔助函式：產生隨機評分 (不需 export，當作 private method)
const getRandomRating = () => {
    return parseFloat((3.5 + Math.random() * 1.5).toFixed(1));
};
// 主要函式：直接 export const
const fetchNearbyRestaurants = async (lat, lon, radiusKm) => {
    const radiusMeters = radiusKm * 1000;
    // 組裝 Query
    const query = `[out:json];node(around:${radiusMeters},${lat},${lon})["amenity"="restaurant"];out;`;
    try {
        const response = await axios_1.default.get(OVERPASS_URL, {
            params: { data: query }, // axios 會自動幫你把 query 拼上去
            headers: { 'User-Agent': 'FoodWheelApp/1.0' }
        });
        if (!response.data.elements)
            return [];
        // 轉換資料結構 (Mapping)
        return response.data.elements
            .filter((el) => el.tags && el.tags['name'])
            .map((el) => ({
            id: el.id % 100000,
            name: el.tags['name'],
            address: "附近",
            latitude: el.lat,
            longitude: el.lon,
            rating: getRandomRating()
        }))
            .slice(0, 10);
    }
    catch (error) {
        console.error('OSM API Error:', error);
        return []; // 出錯就回傳空陣列，保持 API 不掛掉
    }
};
exports.fetchNearbyRestaurants = fetchNearbyRestaurants;
