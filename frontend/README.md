# Geo-Weather Field Visualizer - Frontend

A modern Next.js frontend application for visualizing agricultural fields and weather data using MapLibre GL and interactive mapping features.

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

### 🔧 **Technical Features**
- **TypeScript** for type safety and better development experience
- **Next.js 14** with App Router for modern React development
- **Real-time Updates** with automatic field loading
- **Error Handling** with user-friendly error messages
- **Loading States** with animated spinners

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Inline styles with modern CSS properties
- **Mapping**: MapLibre GL JS
- **Drawing**: Mapbox GL Draw
- **Charts**: Chart.js with react-chartjs-2
- **HTTP Client**: Axios
- **Geospatial**: Turf.js
- **Development**: ESLint, TypeScript compiler

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Backend API running (see backend README)

## 🚀 Quick Start

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Environment Setup
Create a `.env.local` file in the frontend directory:
```bash
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001

# Optional: Mapbox token for additional features
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=your_mapbox_token_here
```

### 3. Start Development Server
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## 🐳 Docker Development

### Using Docker Compose (Recommended)
```bash
# From the root directory
docker-compose -f docker-compose.dev.yml up --build
```

This will start:
- Frontend: `http://localhost:3000`
- Backend: `http://localhost:3001`
- MySQL: `localhost:3307`

### Manual Docker Build
```bash
# Build the frontend image
docker build -t geo-weather-frontend .

# Run the container
docker run -p 3000:3000 --env-file .env.local geo-weather-frontend
```

## 📁 Project Structure

```
frontend/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── page.tsx           # Main application page
│   │   ├── layout.tsx         # Root layout
│   │   └── globals.css        # Global styles
│   ├── components/            # React components
│   │   ├── MapComponent.tsx   # Main map component
│   │   ├── BasemapSwitcher.tsx # Basemap switching control
│   │   ├── FieldCreationForm.tsx # Field creation modal
│   │   ├── FieldDetailsModal.tsx # Field details modal
│   │   ├── WeatherDataModal.tsx # Weather data modal
│   │   ├── WeatherChart.tsx   # Chart visualization
│   │   └── WeatherTable.tsx   # Table visualization
│   ├── types/                 # TypeScript type definitions
│   │   └── index.ts          # API and data types
│   └── utils/                 # Utility functions
│       └── api.ts            # API client configuration
├── public/                    # Static assets
├── Dockerfile                 # Production Docker configuration
├── Dockerfile.dev            # Development Docker configuration
└── package.json              # Dependencies and scripts
```

## 🎯 Key Components

### MapComponent
- Handles map initialization and interaction
- Manages polygon drawing and area calculation
- Integrates with basemap switching
- Displays existing fields on the map

### BasemapSwitcher
- Provides UI for switching between Positron and Satellite basemaps
- Positioned in the top-right corner of the map
- Features hover effects and active state highlighting

### FieldCreationForm
- Modal form for creating new fields
- Validates field name (1-20 characters) and description (max 200 characters)
- Shows real-time area calculation
- Character counter for description field

### WeatherDataModal
- Displays weather data in both chart and table views
- Toggle between visualization modes
- CSV export functionality
- Responsive design for different screen sizes

## 🔧 Development

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues
```

### Environment Variables
- `NEXT_PUBLIC_API_URL`: Backend API URL (required)
- `NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN`: Mapbox access token (optional)

### Development Tips
1. **Hot Reload**: Changes are automatically reflected in the browser
2. **TypeScript**: Use TypeScript for better development experience
3. **ESLint**: Code is automatically linted on save
4. **Responsive Design**: Test on different screen sizes
5. **Browser DevTools**: Use React DevTools for component debugging

## 🧪 Testing

The frontend includes comprehensive error handling and loading states:
- **API Error Handling**: User-friendly error messages
- **Loading States**: Animated spinners and loading indicators
- **Form Validation**: Real-time validation with error messages
- **Responsive Testing**: Works on desktop and mobile devices

## 🚀 Deployment

### Production Build
```bash
npm run build
npm start
```

### Docker Production
```bash
docker build -t geo-weather-frontend .
docker run -p 3000:3000 geo-weather-frontend
```

## 🔗 Integration

The frontend integrates with:
- **Backend API**: For field management and weather data
- **CoAgMet API**: For weather station data
- **MapLibre GL**: For mapping functionality
- **Chart.js**: For data visualization

## 📱 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🤝 Contributing

1. Follow the existing code style
2. Use TypeScript for all new components
3. Add proper error handling
4. Test on multiple screen sizes
5. Update documentation as needed

## 📄 License

This project is part of the Geo-Weather Field Visualizer application.

## 🆘 Troubleshooting

### Common Issues

**Map not loading:**
- Check if the backend API is running
- Verify environment variables are set correctly
- Check browser console for errors

**Basemap switching not working:**
- Ensure MapLibre GL is properly initialized
- Check for CORS issues with tile servers
- Verify network connectivity

**Weather data not displaying:**
- Check backend API connectivity
- Verify CoAgMet API is accessible
- Check browser console for API errors

**Build errors:**
- Clear `.next` directory: `rm -rf .next`
- Reinstall dependencies: `npm install`
- Check TypeScript errors: `npm run lint`
