import { FieldRepository } from '../repositories/fieldRepository';
import { UserRepository } from '../repositories/userRepository';
import { CreateFieldRequest, UpdateFieldRequest, Field } from '../types';
import axios from 'axios';
import * as turf from '@turf/turf';
import stations from './stations.json';

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
    const fields = await this.fieldRepository.getAllFields(user.id); // get fields for the default user
    return fields;
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

    // Calculate centroid of the field
    const centroid = turf.centroid(field.geojson);
    const [lon, lat] = centroid.geometry.coordinates;
    
    // Get stations from the imported stations.json file
    const availableStations = stations.stations;
    
    // Find nearest station
    let minDist = Infinity;
    let nearestStation = null;
    
    for (const station of availableStations) {
      const dist = turf.distance(
        turf.point([station.longitude, station.latitude]),
        turf.point([lon, lat]),
        'kilometers'
      );
      
      if (dist < minDist) {
        minDist = dist;
        nearestStation = station;
      }
    }
    
    if (!nearestStation) {
      throw new Error('No weather stations available');
    }

    try {
      // Use the pre-formatted URL from the station data to fetch weather
      const response = await axios.get(nearestStation.url);
      
      return {
        station: {
          id: nearestStation.stationName,
          name: nearestStation.stationName,
          lat: nearestStation.latitude,
          lon: nearestStation.longitude,
          distance: Math.round(minDist * 10) / 10 // Round to 1 decimal place
        },
        weather: response.data
      };
    } catch (error) {
      console.error(`Error fetching weather data from station ${nearestStation.stationName}:`, error);
      throw new Error('Failed to fetch weather data');
    }
  }
}