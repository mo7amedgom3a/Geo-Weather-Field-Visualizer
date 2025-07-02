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
- `PUT /api/field/:id` - Update field name/description
- `DELETE /api/field/:id` - Delete a field

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