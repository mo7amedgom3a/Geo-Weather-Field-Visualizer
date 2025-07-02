import { FieldRepository } from '../repositories/fieldRepository';
import { UserRepository } from '../repositories/userRepository';
import { CreateFieldRequest, UpdateFieldRequest, Field } from '../types';
import axios from 'axios';
import * as turf from '@turf/turf';

export class FieldService {
  private fieldRepository: FieldRepository;
  private userRepository: UserRepository;

  // Static list of CoAgMet stations (id, lat, lon)
  private static COAGMET_STATIONS = [
    { id: 'alt01', name: 'Altona', lat: 40.097, lon: -105.281 },
    { id: 'ftc03', name: 'Fort Collins', lat: 40.65, lon: -104.996 },
    { id: 'akr01', name: 'Akron', lat: 40.165, lon: -103.217 },
    { id: 'gck01', name: 'Greeley', lat: 40.445, lon: -104.64 },
    // ... add more stations as needed ...
  ];

  constructor() {
    this.fieldRepository = new FieldRepository();
    this.userRepository = new UserRepository();
  }

  async createField(fieldData: CreateFieldRequest): Promise<Field> {
    // Get default user for now (in a real app, this would come from authentication)
    const user = await this.userRepository.getDefaultUser();
    
    return await this.fieldRepository.createField(user.id, fieldData);
  }

  async getAllFields(): Promise<Field[]> {
    const user = await this.userRepository.getDefaultUser();
    return await this.fieldRepository.getAllFields(user.id); // get fields for the default user
  }

  async getFieldById(id: number): Promise<Field | null> {
    const user = await this.userRepository.getDefaultUser();
    return await this.fieldRepository.getFieldById(id, user.id);
  }

  async updateField(id: number, updateData: UpdateFieldRequest): Promise<Field | null> {
    const user = await this.userRepository.getDefaultUser();
    return await this.fieldRepository.updateField(id, user.id, updateData);
  }

  async deleteField(id: number): Promise<boolean> {
    const user = await this.userRepository.getDefaultUser();
    return await this.fieldRepository.deleteField(id, user.id);
  }

  async getWeatherForField(fieldId: number): Promise<any> {
    const user = await this.userRepository.getDefaultUser();
    const field = await this.fieldRepository.getFieldById(fieldId, user.id);
    if (!field) throw new Error('Field not found');

    // Calculate centroid
    const centroid = turf.centroid(field.geojson);
    const [lon, lat] = centroid.geometry.coordinates;

    // Find nearest station
    let minDist = Infinity;
    let nearestStation = FieldService.COAGMET_STATIONS[0];
    for (const station of FieldService.COAGMET_STATIONS) {
      const dist = turf.distance(
        turf.point([station.lon, station.lat]),
        turf.point([lon, lat]),
        { units: 'kilometers' }
      );
      if (dist < minDist) {
        minDist = dist;
        nearestStation = station;
      }
    }

    // Fetch weather data from CoAgMet API
    // Example endpoint: https://coagmet.colostate.edu/api/v1/weather/{station_id}
    // For demo, fetch last 7 days
    const today = new Date();
    const start = new Date(today);
    start.setDate(today.getDate() - 6);
    const startStr = start.toISOString().slice(0, 10);
    const endStr = today.toISOString().slice(0, 10);
    const url = `https://coagmet.colostate.edu/api/v1/weather/${nearestStation.id}?start=${startStr}&end=${endStr}`;

    const response = await axios.get(url);
    return {
      station: nearestStation,
      weather: response.data
    };
  }
} 