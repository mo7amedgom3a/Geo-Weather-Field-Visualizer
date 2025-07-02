# Geo-Weather Field Visualizer

A full-stack TypeScript application for visualizing agricultural fields and weather data using interactive maps and real-time weather station data.

## 🚀 Features

### 🗺️ **Interactive Mapping**
- **MapLibre GL** integration for high-performance mapping
- **Basemap Switching** between Positron (default) and Satellite views
- **Polygon Drawing** with Mapbox GL Draw for field creation
- **Real-time Area Calculation** in square meters and acres
- **Field Visualization** with clickable polygons

### 📊 **Weather Data Visualization**
- **Interactive Charts** using Chart.js with multiple weather variables
- **Data Tables** with CSV export functionality
- **Toggle Views** between chart and table representations
- **Weather Station Integration** with CoAgMet API

### 🎨 **Modern UI/UX**
- **Responsive Design** that works on desktop and mobile
- **Dark Text** for excellent readability
- **Enhanced Forms** with validation and focus states
- **Smooth Animations** and hover effects
- **Professional Styling** with consistent design system

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Mapping**: MapLibre GL JS
- **Drawing**: Mapbox GL Draw
- **Charts**: Chart.js with react-chartjs-2
- **Styling**: Inline styles with modern CSS properties

### Backend
- **Framework**: Express.js with TypeScript
- **Database**: MySQL 8.0
- **Validation**: Zod
- **Geospatial**: Turf.js
- **HTTP Client**: Axios

### Infrastructure
- **Containerization**: Docker & Docker Compose
- **Database**: MySQL with persistent storage
- **Development**: Hot reload for both frontend and backend

## 📋 Prerequisites

- Docker and Docker Compose
- Node.js 18+ (for local development)
- Git

## 🚀 Quick Start with Docker

### Development Environment

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd Geo-Weather-Field-Visualizer
   ```

2. **Start all services:**
   ```bash
   docker-compose -f docker-compose.dev.yml up --build
   ```

3. **Access the application:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001
   - MySQL: localhost:3307

### Production Environment

1. **Start production services:**
   ```bash
   docker-compose up --build
   ```

2. **Access the application:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001
   - MySQL: localhost:3306

## 🐳 Docker Services

### Development (`docker-compose.dev.yml`)

| Service | Port | Description |
|---------|------|-------------|
| Frontend | 3000 | Next.js development server with hot reload |
| Backend | 3001 | Express.js API with TypeScript |
| MySQL | 3307 | Database with persistent storage |

### Production (`docker-compose.yml`)

| Service | Port | Description |
|---------|------|-------------|
| Frontend | 3000 | Optimized Next.js production build |
| Backend | 3001 | Express.js API with production settings |
| MySQL | 3306 | Database with persistent storage |

## 🔧 Development

### Local Development (without Docker)

#### Frontend
```bash
cd frontend
npm install
cp .env.example .env.local  # Create environment file
npm run dev
```

#### Backend
```bash
cd backend
npm install
cp env.example .env  # Create environment file
npm run dev
```

#### Database
```bash
# Start MySQL locally or use Docker
docker run -d \
  --name geo-weather-mysql \
  -e MYSQL_ROOT_PASSWORD=2003 \
  -e MYSQL_DATABASE=geo_weather_db \
  -p 3306:3306 \
  mysql:8.0
```

### Environment Variables

#### Frontend (`.env.local`)
```bash
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=your_mapbox_token_here
```

#### Backend (`.env`)
```bash
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=2003
DB_NAME=geo_weather_db
PORT=3001
NODE_ENV=development
```

## 📁 Project Structure

```
Geo-Weather-Field-Visualizer/
├── frontend/                 # Next.js frontend application
│   ├── src/
│   │   ├── app/             # Next.js App Router pages
│   │   ├── components/      # React components
│   │   ├── types/          # TypeScript type definitions
│   │   └── utils/          # Utility functions
│   ├── Dockerfile          # Production Docker configuration
│   ├── Dockerfile.dev      # Development Docker configuration
│   └── README.md           # Frontend documentation
├── backend/                 # Express.js backend API
│   ├── src/
│   │   ├── controllers/    # API route handlers
│   │   ├── services/       # Business logic
│   │   ├── repositories/   # Database operations
│   │   └── config/         # Configuration files
│   ├── Dockerfile          # Production Docker configuration
│   ├── Dockerfile.dev      # Development Docker configuration
│   └── README.md           # Backend documentation
├── docker-compose.yml      # Production Docker Compose
├── docker-compose.dev.yml  # Development Docker Compose
└── README.md              # This file
```

## 🎯 API Endpoints

### Fields
- `POST /api/field` - Create a new field
- `GET /api/field` - Get all fields
- `GET /api/field/:id` - Get a specific field
- `PUT /api/field/:id` - Update field name/description
- `DELETE /api/field/:id` - Delete a field
- `GET /api/field/:id/weather/` - Fetch weather data for a field

### Health Check
- `GET /health` - Server health status

## 🧪 Testing

### Backend Tests
```bash
cd backend
npm test
```

### Frontend Testing
The frontend includes comprehensive error handling and loading states for testing user interactions.

## 🚀 Deployment

### Production Build
```bash
# Build and start production services
docker-compose up --build -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Environment-Specific Deployment
```bash
# Development
docker-compose -f docker-compose.dev.yml up --build

# Production
docker-compose -f docker-compose.yml up --build
```

## 🔍 Monitoring

### View Service Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f frontend
docker-compose logs -f backend
docker-compose logs -f mysql
```

### Database Access
```bash
# Connect to MySQL container
docker exec -it geo-weather-mysql mysql -u root -p

# Backup database
docker exec geo-weather-mysql mysqldump -u root -p geo_weather_db > backup.sql
```

## 🆘 Troubleshooting

### Common Issues

**Services not starting:**
```bash
# Check if ports are available
netstat -tulpn | grep :3000
netstat -tulpn | grep :3001
netstat -tulpn | grep :3306

# Remove existing containers
docker-compose down -v
docker system prune -f
```

**Database connection issues:**
```bash
# Check MySQL container status
docker ps | grep mysql

# View MySQL logs
docker-compose logs mysql

# Restart MySQL
docker-compose restart mysql
```

**Frontend not loading:**
```bash
# Check frontend logs
docker-compose logs frontend

# Verify API connectivity
curl http://localhost:3001/health
```

**Build failures:**
```bash
# Clean Docker cache
docker system prune -a

# Rebuild without cache
docker-compose build --no-cache
```

### Performance Optimization

**Development:**
- Use volume mounts for hot reload
- Exclude node_modules from Docker context
- Use multi-stage builds for production

**Production:**
- Enable Next.js standalone output
- Use Alpine Linux base images
- Implement proper health checks

## 📚 Documentation

- [Frontend Documentation](./frontend/README.md)
- [Backend Documentation](./backend/README.md)
- [API Documentation](./backend/README.md#api-endpoints)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test with Docker Compose
5. Submit a pull request

## 📄 License

This project is part of the Geo-Weather Field Visualizer application.

## 🆘 Support

For issues and questions:
1. Check the troubleshooting section
2. Review service logs
3. Verify environment configuration
4. Check Docker and Docker Compose versions 