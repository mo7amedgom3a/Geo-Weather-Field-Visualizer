import axios from 'axios';
import { Field, WeatherResponse, ApiResponse, CreateFieldRequest, UpdateFieldRequest } from '../types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Fields API
export const fieldsApi = {
  // Get all fields
  getAll: async (): Promise<ApiResponse<Field[]>> => {
    const response = await api.get('/api/field');
    return response.data;
  },

  // Get a specific field by ID
  getById: async (id: number): Promise<ApiResponse<Field>> => {
    const response = await api.get(`/api/field/${id}`);
    return response.data;
  },

  // Create a new field
  create: async (fieldData: CreateFieldRequest): Promise<ApiResponse<Field>> => {
    const response = await api.post('/api/field', fieldData);
    return response.data;
  },

  // Update a field
  update: async (id: number, fieldData: UpdateFieldRequest): Promise<ApiResponse<Field>> => {
    const response = await api.put(`/api/field/${id}`, fieldData);
    return response.data;
  },

  // Delete a field
  delete: async (id: number): Promise<ApiResponse<void>> => {
    const response = await api.delete(`/api/field/${id}`);
    return response.data;
  },

  // Get weather data for a field
  getWeather: async (id: number): Promise<WeatherResponse> => {
    const response = await api.get(`/api/field/${id}/weather/`);
    return response.data;
  },
};

// Health check
export const healthApi = {
  check: async (): Promise<{ status: string }> => {
    const response = await api.get('/health');
    return response.data;
  },
};

export default api; 