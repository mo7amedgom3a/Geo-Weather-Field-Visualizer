# Geo-Weather Field Visualizer - Backend

A TypeScript Express.js backend API for managing agricultural fields and weather data.

## Architecture

This backend follows a layered architecture pattern:

- **Controllers**: Handle HTTP requests and responses
- **Services**: Contain business logic
- **Repositories**: Handle database operations
- **Validation**: Input validation using Zod
- **Types**: TypeScript interfaces and types

## Setup

### Prerequisites

- Node.js 18+
- MySQL 8.0+
- Docker

### Local Development

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp env.example .env
   ```
   Edit `.env` with your database credentials.

3. **Set up MySQL database:**
   ```bash
   mysql -u root -p < src/config/database.sql
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```

### Docker

```bash
docker build -t geo-weather-backend .
docker run -p 3001:3001 --env-file .env geo-weather-backend
```

## API Endpoints

### Fields

- `POST /api/field` - Create a new field
- `GET /api/field` - Get all fields
- `GET /api/field/:id` - Get a specific field by ID
- `PUT /api/field/:id` - Update field name/description
- `DELETE /api/field/:id` - Delete a field
- `GET /api/field/:id/weather/` - Fetch weather data for a field (returns weather data from the nearest CoAgMet station to the field's centroid)

### Health Check

- `GET /health` - Server health status

## Validation Rules

- **Field Name**: 1-20 characters
- **Field Description**: Max 200 characters
- **GeoJSON**: Must be a valid Feature with Polygon geometry
- **Area**: Must not exceed 100 acres

## Database Schema

### Users Table
- `id` (INT, AUTO_INCREMENT, PRIMARY KEY)
- `username` (VARCHAR(50), UNIQUE)
- `created_at` (TIMESTAMP)

### Fields Table
- `id` (INT, AUTO_INCREMENT, PRIMARY KEY)
- `user_id` (INT, FOREIGN KEY)
- `name` (VARCHAR(20))
- `description` (VARCHAR(200))
- `geojson` (JSON)
- `created_at` (TIMESTAMP)

## Environment Variables

- `DB_HOST` - MySQL host (default: localhost)
- `DB_PORT` - MySQL port (default: 3306)
- `DB_USER` - MySQL username (default: root)
- `DB_PASSWORD` - MySQL password (default: 2003)
- `DB_NAME` - Database name (default: geo_weather_db)
- `PORT` - Server port (default: 3001)
- `NODE_ENV` - Environment (development/production)

## API Response Examples

### GET /api/field/:id/weather/
Fetches weather data for the field with the given ID. The backend determines the nearest CoAgMet weather station to the field's centroid and returns recent weather data for that station.

**Response Example:**
```json
{
  "success": true,
  "data": {
    "station": {
      "id": "alt01",
      "name": "Altona",
      "lat": 40.097,
      "lon": -105.281
    },
    "weather": {
      "which": "qc",
      "frequency": "daily",
      "timestep": 86400,
      "timezone": "mst",
      "tzOffset": "-07:00",
      "units": "us",
      "station": "alt01",
      "time": ["2025-06-01", "2025-06-02"],
      "tMax": [85.69, 82.17],
      "tMin": [50.92, 49.59],
      "rhMax": [0.85, 0.946],
      "rhMin": [0.243, 0.302],
      "precip": [0, 0.25]
    }
  },
  "message": "Weather data fetched successfully"
}
```

## Example Usage with curl

### Health Check
```bash
curl http://localhost:3001/health
```

### Create a New Field
```bash
curl -X POST http://localhost:3001/api/field \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Field",
    "description": "Demo field for weather analysis",
    "geojson": {
      "type": "Feature",
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [-105.28, 40.09],
          [-105.28, 40.10],
          [-105.27, 40.10],
          [-105.27, 40.09],
          [-105.28, 40.09]
        ]]
      },
      "properties": {}
    }
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Test Field",
    "description": "Demo field for weather analysis",
    "geojson": {
      "type": "Feature",
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [-105.28, 40.09],
          [-105.28, 40.10],
          [-105.27, 40.10],
          [-105.27, 40.09],
          [-105.28, 40.09]
        ]]
      },
      "properties": {}
    },
    "created_at": "2024-01-15T10:30:00.000Z"
  },
  "message": "Field created successfully"
}
```

### Get All Fields
```bash
curl http://localhost:3001/api/field
```

**Expected Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Test Field",
      "description": "Demo field for weather analysis",
      "geojson": {
        "type": "Feature",
        "geometry": {
          "type": "Polygon",
          "coordinates": [[
            [-105.28, 40.09],
            [-105.28, 40.10],
            [-105.27, 40.10],
            [-105.27, 40.09],
            [-105.28, 40.09]
          ]]
        },
        "properties": {}
      },
      "created_at": "2024-01-15T10:30:00.000Z"
    }
  ],
  "message": "Fields retrieved successfully"
}
```

### Get a Specific Field by ID
```bash
curl http://localhost:3001/api/field/1
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Test Field",
    "description": "Demo field for weather analysis",
    "geojson": {
      "type": "Feature",
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [-105.28, 40.09],
          [-105.28, 40.10],
          [-105.27, 40.10],
          [-105.27, 40.09],
          [-105.28, 40.09]
        ]]
      },
      "properties": {}
    },
    "created_at": "2024-01-15T10:30:00.000Z"
  },
  "message": "Field retrieved successfully"
}
```

### Get Weather Data for a Field
```bash
curl http://localhost:3001/api/field/1/weather/
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "station": {
      "id": "alt01",
      "name": "Altona",
      "lat": 40.097,
      "lon": -105.281
    },
    "weather": {
      "which": "qc",
      "frequency": "daily",
      "timestep": 86400,
      "timezone": "mst",
      "tzOffset": "-07:00",
      "units": "us",
      "station": "alt01",
      "time": ["2025-06-01", "2025-06-02"],
      "tMax": [85.69, 82.17],
      "tMin": [50.92, 49.59],
      "rhMax": [0.85, 0.946],
      "rhMin": [0.243, 0.302],
      "precip": [0, 0.25]
    }
  },
  "message": "Weather data fetched successfully"
}
```

### Update a Field
```bash
curl -X PUT http://localhost:3001/api/field/1 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Field Name",
    "description": "Updated field description"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Updated Field Name",
    "description": "Updated field description",
    "geojson": {
      "type": "Feature",
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [-105.28, 40.09],
          [-105.28, 40.10],
          [-105.27, 40.10],
          [-105.27, 40.09],
          [-105.28, 40.09]
        ]]
      },
      "properties": {}
    },
    "created_at": "2024-01-15T10:30:00.000Z"
  },
  "message": "Field updated successfully"
}
```

### Delete a Field
```bash
curl -X DELETE http://localhost:3001/api/field/1
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Field deleted successfully"
}
```

## Error Responses

### Validation Error Example
```json
{
  "success": false,
  "error": "Validation failed",
  "details": [
    {
      "field": "name",
      "message": "Field name must be between 1 and 20 characters"
    }
  ]
}
```

### Not Found Error Example
```json
{
  "success": false,
  "error": "Field not found"
}
```

### Server Error Example
```json
{
  "success": false,
  "error": "Internal server error"
}
```

## Testing

Run the test suite:
```bash
npm test
```

Run tests in watch mode:
```bash
npm run test:watch
```

## Development

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues 