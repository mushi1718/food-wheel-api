export interface Restaurant {
    id: number;
    name: string;
    address: string;
    latitude: number;
    longitude: number;
    rating: number;
}

// 這是給 Service 內部用的，不用 export 出去給外面看也行，但我習慣放這裡管理
export interface OsmResponse {
    elements: {
        id: number;
        lat: number;
        lon: number;
        tags?: { [key: string]: string };
    }[];
}