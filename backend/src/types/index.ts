import { Feature, Polygon } from 'geojson';

export interface User {
  id: number;
  username: string;
  created_at: Date;
}

export interface Field {
  id: number;
  user_id: number;
  name: string;
  description: string;
  geojson: Feature<Polygon>;
  created_at: Date;
}

export interface CreateFieldRequest {
  name: string;
  description: string;
  geojson: Feature<Polygon>;
}

export interface UpdateFieldRequest {
  name?: string;
  description?: string;
}

export interface WeatherStation {
  name: string;
  lat: number;
  long: number;
  url: string;
}

export interface WeatherData {
  which: string;
  frequency: string;
  timestep: number;
  timezone: string;
  tzOffset: string;
  units: string;
  station: string;
  time: string[];
  tMax: number[];
  tMin: number[];
  rhMax: number[];
  rhMin: number[];
  precip: number[];
}

export interface DatabaseConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
} 