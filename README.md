# Geo-Weather Field Visualizer

A full-stack TypeScript application for drawing agricultural field boundaries on a map and visualizing weather data.

## Architecture

- **Frontend**: Next.js with TypeScript (coming soon)
- **Backend**: Express.js with TypeScript
- **Database**: MySQL 8.0
- **Containerization**: Docker & Docker Compose

## Quick Start with Docker

### Prerequisites

- Docker
- Docker Compose

### Production Setup

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd Geo-Weather-Field-Visualizer
   ```

2. **Start all services:**
   ```bash
   docker-compose up -d
   ```

3. **Check service status:**
   ```bash
   docker-compose ps
   ```

4. **View logs:**
   ```bash
   docker-compose logs -f backend
   ```

### Development Setup

1. **Start development environment:**
   ```bash
   docker-compose -f docker-compose.dev.yml up -d
   ```

2. **Access the application:**
   - Backend API: http://localhost:3001
   - Health Check: http://localhost:3001/health
   - MySQL: localhost:3307

## Docker Services

### Backend Service
- **Port**: 3001
- **Environment**: Node.js 18 with TypeScript
- **Features**: Hot reloading in development mode
- **Health Check**: Available at `/health`

### MySQL Service
- **Port**: 3307 (external), 3306 (internal)
- **Version**: MySQL 8.0
- **Database**: `geo_weather_db`
- **Root Password**: `2003`
- **Persistence**: Data stored in Docker volume

## API Endpoints

### Fields Management
- `POST /api/field` - Create a new field
- `GET /api/field` - Get all fields
- `PUT /api/field/:id` - Update field
- `DELETE /api/field/:id` - Delete field

### Health Check
- `GET /health` - Service health status

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Fields Table
```sql
CREATE TABLE fields (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  name VARCHAR(20) NOT NULL,
  description VARCHAR(200),
  geojson JSON NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

## Docker Commands

### Development
```bash
# Start development environment
docker-compose -f docker-compose.dev.yml up -d

# View logs
docker-compose -f docker-compose.dev.yml logs -f

# Stop development environment
docker-compose -f docker-compose.dev.yml down
```

### Production
```bash
# Start production environment
docker-compose up -d

# View logs
docker-compose logs -f

# Stop production environment
docker-compose down

# Remove volumes (WARNING: This will delete all data)
docker-compose down -v
```

### Database Management
```bash
# Access MySQL container
docker exec -it geo-weather-mysql-dev mysql -u root -p

# Backup database
docker exec geo-weather-mysql-dev mysqldump -u root -p2003 geo_weather_db > backup.sql

# Restore database
docker exec -i geo-weather-mysql-dev mysql -u root -p2003 geo_weather_db < backup.sql
```

## Environment Variables

The following environment variables are automatically set in Docker:

- `DB_HOST=mysql`
- `DB_PORT=3306`
- `DB_USER=root`
- `DB_PASSWORD=2003`
- `DB_NAME=geo_weather_db`
- `PORT=3001`
- `NODE_ENV=development` (dev) or `production` (prod)

## Volumes

- `mysql_data` / `mysql_data_dev`: Persistent MySQL data storage
- `./backend:/app`: Backend source code (development only)

## Networks

- `geo-weather-network` / `geo-weather-network-dev`: Internal network for service communication

## Troubleshooting

### Common Issues

1. **Port already in use:**
   ```bash
   # Check what's using the port
   lsof -i :3001
   lsof -i :3307
   ```

2. **Database connection issues:**
   ```bash
   # Check MySQL container status
   docker-compose ps mysql
   
   # Check MySQL logs
   docker-compose logs mysql
   ```

3. **Backend build issues:**
   ```bash
   # Rebuild backend container
   docker-compose build backend
   ```

### Reset Everything
```bash
# Stop and remove all containers, networks, and volumes
docker-compose down -v
docker system prune -f
```

## Next Steps

1. Set up the frontend with Next.js
2. Implement weather API integration
3. Add authentication
4. Deploy to production

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test with Docker
5. Submit a pull request 