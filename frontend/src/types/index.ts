// Field interface
export interface Field {
  id: number;
  name: string;
  description: string;
  geojson: any;
  created_at: string;
}

// Weather Station interface
export interface WeatherStation {
  id: string;
  name: string;
  lat: number;
  lon: number;
  url: string;
}

// Weather Data interface (matches CoAgMet API)
export interface WeatherData {
  time: string[];
  tMax: number[];
  tMin: number[];
  rhMax: number[];
  rhMin: number[];
  precip: number[];
}

// API Response for weather endpoint
export interface WeatherResponse {
  success: boolean;
  data: {
    station: WeatherStation;
    weather: WeatherData;
  };
  message: string;
}

// API Response for field endpoints
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

// Create Field Request
export interface CreateFieldRequest {
  name: string;
  description: string;
  geojson: any;
}

// Update Field Request
export interface UpdateFieldRequest {
  name: string;
  description: string;
} 