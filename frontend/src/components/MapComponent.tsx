'use client';

import React, { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import * as turf from '@turf/turf';
import BasemapSwitcher, { BasemapType } from './BasemapSwitcher';

import 'maplibre-gl/dist/maplibre-gl.css';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';

interface MapComponentProps {
  onPolygonDrawn: (geojson: any, area: number) => void;
  onPolygonDeleted: () => void;
  fields?: any[];
  onFieldClick?: (field: any) => void;
}

const MapComponent: React.FC<MapComponentProps> = ({
  onPolygonDrawn,
  onPolygonDeleted,
  fields = [],
  onFieldClick
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const drawRef = useRef<MapboxDraw | null>(null);
  const [roundedArea, setRoundedArea] = useState<number | undefined>();
  const [mapLoaded, setMapLoaded] = useState(false);
  const [currentBasemap, setCurrentBasemap] = useState<BasemapType>('positron');

  const basemapStyles = {
    positron: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
    satellite: {
      version: 8 as const,
      sources: {
        'satellite': {
          type: 'raster' as const,
          tiles: [
            'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
          ],
          tileSize: 256,
          attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
        }
      },
      layers: [
        {
          id: 'satellite-layer',
          type: 'raster' as const,
          source: 'satellite',
          minzoom: 0,
          maxzoom: 22
        }
      ]
    }
  };

  const handleBasemapChange = (basemapType: BasemapType) => {
    if (!mapRef.current || basemapType === currentBasemap) return;

    const newStyle = basemapStyles[basemapType];
    mapRef.current.setStyle(newStyle);
    setCurrentBasemap(basemapType);
  };

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Initialize MapLibre GL map with Positron as default
    mapRef.current = new maplibregl.Map({
      container: mapContainerRef.current,
      style: basemapStyles.positron,
      center: [-91.874, 42.76],
      zoom: 12
    });

    // Wait for the map to load before adding controls and layers
    mapRef.current.on('load', () => {
      setMapLoaded(true);
      
      // Add Mapbox GL Draw control with proper configuration
      const draw = new MapboxDraw({
        displayControlsDefault: false,
        controls: {
          polygon: true,
          trash: true
        },
        defaultMode: 'draw_polygon',
        styles: [
          // Use a simpler style configuration to avoid MapLibre compatibility issues
          {
            "id": "gl-draw-polygon-fill-inactive",
            "type": "fill",
            "filter": ["all", ["==", "active", "false"], ["==", "$type", "Polygon"], ["!=", "mode", "static"]],
            "paint": {
              "fill-color": "#3bb2d0",
              "fill-outline-color": "#3bb2d0",
              "fill-opacity": 0.1
            }
          },
          {
            "id": "gl-draw-polygon-fill-active",
            "type": "fill",
            "filter": ["all", ["==", "active", "true"], ["==", "$type", "Polygon"]],
            "paint": {
              "fill-color": "#fbb03b",
              "fill-outline-color": "#fbb03b",
              "fill-opacity": 0.1
            }
          },
          {
            "id": "gl-draw-polygon-midpoint",
            "type": "circle",
            "filter": ["all", ["==", "$type", "Point"], ["==", "meta", "midpoint"]],
            "paint": {
              "circle-radius": 3,
              "circle-color": "#fbb03b"
            }
          },
          {
            "id": "gl-draw-polygon-stroke-inactive",
            "type": "line",
            "filter": ["all", ["==", "active", "false"], ["==", "$type", "Polygon"], ["!=", "mode", "static"]],
            "layout": {
              "line-cap": "round",
              "line-join": "round"
            },
            "paint": {
              "line-color": "#3bb2d0",
              "line-dasharray": [0.2, 2],
              "line-width": 2
            }
          },
          {
            "id": "gl-draw-polygon-stroke-active",
            "type": "line",
            "filter": ["all", ["==", "active", "true"], ["==", "$type", "Polygon"]],
            "layout": {
              "line-cap": "round",
              "line-join": "round"
            },
            "paint": {
              "line-color": "#fbb03b",
              "line-dasharray": [0.2, 2],
              "line-width": 2
            }
          },
          {
            "id": "gl-draw-line-inactive",
            "type": "line",
            "filter": ["all", ["==", "active", "false"], ["==", "$type", "LineString"], ["has", "meta"]],
            "layout": {
              "line-cap": "round",
              "line-join": "round"
            },
            "paint": {
              "line-color": "#3bb2d0",
              "line-dasharray": [0.2, 2],
              "line-width": 2
            }
          },
          {
            "id": "gl-draw-line-active",
            "type": "line",
            "filter": ["all", ["==", "$type", "LineString"], ["==", "active", "true"]],
            "layout": {
              "line-cap": "round",
              "line-join": "round"
            },
            "paint": {
              "line-color": "#fbb03b",
              "line-dasharray": [0.2, 2],
              "line-width": 2
            }
          },
          {
            "id": "gl-draw-polygon-and-line-vertex-halo-active",
            "type": "circle",
            "filter": ["all", ["==", "meta", "vertex"], ["==", "$type", "Point"], ["==", "active", "true"]],
            "paint": {
              "circle-radius": 12,
              "circle-color": "#fff"
            }
          },
          {
            "id": "gl-draw-polygon-and-line-vertex-active",
            "type": "circle",
            "filter": ["all", ["==", "meta", "vertex"], ["==", "$type", "Point"], ["==", "active", "true"]],
            "paint": {
              "circle-radius": 8,
              "circle-color": "#fbb03b"
            }
          },
          {
            "id": "gl-draw-point-point-stroke-active",
            "type": "circle",
            "filter": ["all", ["==", "active", "true"], ["==", "$type", "Point"], ["==", "meta", "vertex"]],
            "paint": {
              "circle-radius": 6,
              "circle-color": "#fff"
            }
          },
          {
            "id": "gl-draw-point-inactive",
            "type": "circle",
            "filter": ["all", ["==", "active", "false"], ["==", "$type", "Point"], ["==", "meta", "vertex"]],
            "paint": {
              "circle-radius": 5,
              "circle-color": "#fff"
            }
          },
          {
            "id": "gl-draw-point-stroke-active",
            "type": "circle",
            "filter": ["all", ["==", "active", "false"], ["==", "$type", "Point"], ["==", "meta", "vertex"]],
            "paint": {
              "circle-radius": 3,
              "circle-color": "#000"
            }
          },
          {
            "id": "gl-draw-polygon-fill-static",
            "type": "fill",
            "filter": ["all", ["==", "mode", "static"], ["==", "$type", "Polygon"]],
            "paint": {
              "fill-color": "#404040",
              "fill-outline-color": "#404040",
              "fill-opacity": 0.1
            }
          },
          {
            "id": "gl-draw-polygon-stroke-static",
            "type": "line",
            "filter": ["all", ["==", "mode", "static"], ["==", "$type", "Polygon"]],
            "layout": {
              "line-cap": "round",
              "line-join": "round"
            },
            "paint": {
              "line-color": "#404040",
              "line-width": 2
            }
          },
          {
            "id": "gl-draw-line-static",
            "type": "line",
            "filter": ["all", ["==", "mode", "static"], ["==", "$type", "LineString"]],
            "layout": {
              "line-cap": "round",
              "line-join": "round"
            },
            "paint": {
              "line-color": "#404040",
              "line-width": 2
            }
          },
          {
            "id": "gl-draw-point-static",
            "type": "circle",
            "filter": ["all", ["==", "mode", "static"], ["==", "$type", "Point"]],
            "paint": {
              "circle-radius": 5,
              "circle-color": "#404040"
            }
          }
        ]
      });
      drawRef.current = draw;
      
      // Add the draw control to the map
      mapRef.current!.addControl(draw as any);

      // Add event listeners
      mapRef.current!.on('draw.create', updateArea);
      mapRef.current!.on('draw.delete', updateArea);
      mapRef.current!.on('draw.update', updateArea);
    });

    function updateArea(e: any) {
      const data = drawRef.current!.getAll();
      if (data.features.length > 0) {
        const area = turf.area(data);
        const roundedAreaValue = Math.round(area * 100) / 100;
        setRoundedArea(roundedAreaValue);
        onPolygonDrawn(data.features[0], roundedAreaValue);
      } else {
        setRoundedArea(undefined);
        onPolygonDeleted();
        if (e.type !== 'draw.delete') {
          alert('Click the map to draw a polygon.');
        }
      }
    }

    // Cleanup function
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
      }
    };
  }, [onPolygonDrawn, onPolygonDeleted]);

  // Add fields to map when they change and map is loaded
  useEffect(() => {
    if (!mapRef.current || !mapLoaded || !fields.length) return;

    // Check if the map style is loaded
    if (!mapRef.current.isStyleLoaded()) {
      return;
    }

    // Remove existing field layers
    if (mapRef.current.getLayer('fields-layer')) {
      mapRef.current.removeLayer('fields-layer');
    }
    if (mapRef.current.getSource('fields-source')) {
      mapRef.current.removeSource('fields-source');
    }

    // Add fields as a new source and layer
    mapRef.current.addSource('fields-source', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: fields.map(field => field.geojson)
      }
    });

    mapRef.current.addLayer({
      id: 'fields-layer',
      type: 'fill',
      source: 'fields-source',
      paint: {
        'fill-color': '#007cbf',
        'fill-opacity': 0.3,
        'fill-outline-color': '#007cbf'
      }
    });

    // Add click handler for fields
    const handleFieldClick = (e: any) => {
      if (e.features.length > 0) {
        const clickedFeature = e.features[0];
        const field = fields.find(f => 
          JSON.stringify(f.geojson.geometry) === JSON.stringify(clickedFeature.geometry)
        );
        if (field && onFieldClick) {
          onFieldClick(field);
        }
      }
    };

    mapRef.current.on('click', 'fields-layer', handleFieldClick);

    return () => {
      if (mapRef.current) {
        mapRef.current.off('click', 'fields-layer', handleFieldClick);
      }
    };
  }, [fields, onFieldClick, mapLoaded]);

  return (
    <div style={{ position: 'relative', height: '100%', width: '100%' }}>
      <div ref={mapContainerRef} style={{ height: '100%', width: '100%' }} />
      
      {/* Basemap Switcher */}
      <BasemapSwitcher
        currentBasemap={currentBasemap}
        onBasemapChange={handleBasemapChange}
      />

      <div
        className="calculation-box"
        style={{
          height: 75,
          width: 150,
          position: 'absolute',
          bottom: 40,
          left: 10,
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          padding: 15,
          textAlign: 'center',
          borderRadius: 8,
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          border: '1px solid #e5e7eb'
        }}
      >
        <p style={{ 
          fontFamily: 'Open Sans', 
          margin: 0, 
          fontSize: 13,
          color: '#374151',
          fontWeight: '500'
        }}>
          Click the map to draw a polygon.
        </p>
        <div id="calculated-area">
          {roundedArea && (
            <>
              <p style={{ 
                fontFamily: 'Open Sans', 
                margin: '4px 0 0 0', 
                fontSize: 16,
                fontWeight: '700',
                color: '#111827'
              }}>
                <strong>{roundedArea}</strong>
              </p>
              <p style={{ 
                fontFamily: 'Open Sans', 
                margin: 0, 
                fontSize: 12,
                color: '#6b7280',
                fontWeight: '500'
              }}>
                square meters
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MapComponent; 