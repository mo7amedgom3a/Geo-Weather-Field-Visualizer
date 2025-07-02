#!/bin/bash

# Geo-Weather Field Visualizer Setup Script

echo "🚀 Setting up Geo-Weather Field Visualizer..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

if [ ! -f "frontend/.env.local" ]; then
    echo "📝 Creating frontend environment file..."
    cat > frontend/.env.local << EOF
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001

# Optional: Mapbox token for additional features
# Get your token from: https://account.mapbox.com/access-tokens/
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=your_mapbox_token_here

# Development Configuration
NODE_ENV=development
EOF
    echo "✅ Frontend environment file created: frontend/.env.local"
fi

# Create backend environment file if it doesn't exist
if [ ! -f "backend/.env" ]; then
    echo "📝 Creating backend environment file..."
    cat > backend/.env << EOF
# Database Configuration
DB_HOST=mysql
DB_PORT=3306
DB_USER=root
DB_PASSWORD=2003
DB_NAME=geo_weather_db

# Server Configuration
PORT=3001
NODE_ENV=development
EOF
    echo "✅ Backend environment file created: backend/.env"
fi

echo ""
echo "🎯 Choose your setup:"
echo "1. Development (with hot reload)"
echo "2. Production"
echo "3. Exit"
echo ""
read -p "Enter your choice (1-3): " choice

case $choice in
    1)
        echo "🔧 Starting development environment..."
        docker-compose -f docker-compose.dev.yml up --build
        ;;
    2)
        echo "🚀 Starting production environment..."
        docker-compose up --build
        ;;
    3)
        echo "👋 Setup cancelled."
        exit 0
        ;;
    *)
        echo "❌ Invalid choice. Please run the script again."
        exit 1
        ;;
esac 