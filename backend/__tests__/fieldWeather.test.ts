import request from 'supertest';
import app from '../src/app';
import nock from 'nock';

// Mock data for a field and CoAgMet API
const mockField = {
  id: 1,
  user_id: 1,
  name: 'Test Field',
  description: '',
  geojson: {
    type: 'Feature',
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [-105.28, 40.09],
        [-105.28, 40.10],
        [-105.27, 40.10],
        [-105.27, 40.09],
        [-105.28, 40.09]
      ]]
    },
    properties: {}
  },
  created_at: new Date()
};

const mockWeather = {
  which: 'qc',
  frequency: 'daily',
  timestep: 86400,
  timezone: 'mst',
  tzOffset: '-07:00',
  units: 'us',
  station: 'alt01',
  time: ['2025-06-01', '2025-06-02'],
  tMax: [85.69, 82.17],
  tMin: [50.92, 49.59],
  rhMax: [0.85, 0.946],
  rhMin: [0.243, 0.302],
  precip: [0, 0.25]
};

describe('GET /api/field/:id/weather', () => {
  beforeAll(() => {
    // Optionally, insert mockField into the test DB or mock DB calls
  });

  afterEach(() => {
    nock.cleanAll();
  });

  it('should return weather data for a valid field', async () => {
    // Mock CoAgMet API
    nock('https://coagmet.colostate.edu')
      .get(/\/api\/v1\/weather\/alt01.*/)
      .reply(200, mockWeather);

    // Create a field first (simulate real flow)
    await request(app)
      .post('/api/field')
      .send({
        name: mockField.name,
        description: mockField.description,
        geojson: mockField.geojson
      })
      .expect(201);

    // Now fetch weather
    const res = await request(app)
      .get('/api/field/1/weather')
      .expect(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.station.id).toBe('alt01');
    expect(res.body.data.weather).toHaveProperty('tMax');
  });

  it('should return 400 for invalid field ID', async () => {
    const res = await request(app)
      .get('/api/field/abc/weather')
      .expect(400);
    expect(res.body.success).toBe(false);
  });

  it('should return 500 for non-existent field', async () => {
    const res = await request(app)
      .get('/api/field/9999/weather')
      .expect(500);
    expect(res.body.success).toBe(false);
  });
}); 