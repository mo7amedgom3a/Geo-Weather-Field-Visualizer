'use client';

import React, { useState, useEffect } from 'react';
import MapComponent from '../components/MapComponent';
import FieldCreationForm from '../components/FieldCreationForm';
import FieldDetailsModal from '../components/FieldDetailsModal';
import WeatherDataModal from '../components/WeatherDataModal';
import { fieldsApi } from '../utils/api';
import { Field, WeatherData } from '../types';

const GeoWeatherApp = () => {
  const [fields, setFields] = useState<Field[]>([]);
  const [currentPolygon, setCurrentPolygon] = useState<any>(null);
  const [currentArea, setCurrentArea] = useState<number>(0);
  const [showFieldForm, setShowFieldForm] = useState(false);
  const [selectedField, setSelectedField] = useState<Field | null>(null);
  const [showFieldDetails, setShowFieldDetails] = useState(false);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [showWeatherModal, setShowWeatherModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load fields on component mount
  useEffect(() => {
    loadFields();
  }, []);

  const loadFields = async () => {
    try {
      setLoading(true);
      const response = await fieldsApi.getAll();
      if (response.success) {
        setFields(response.data);
      } else {
        setError('Failed to load fields');
      }
    } catch (err) {
      setError('Error loading fields');
      console.error('Error loading fields:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePolygonDrawn = (geojson: any, area: number) => {
    setCurrentPolygon(geojson);
    setCurrentArea(area);
    
    // Check if area exceeds 100 acres (404,686 square meters)
    const areaInAcres = area * 0.000247105;
    if (areaInAcres > 100) {
      alert(`Field area (${areaInAcres.toFixed(2)} acres) exceeds the maximum allowed size of 100 acres. Please draw a smaller polygon.`);
      return;
    }
    
    setShowFieldForm(true);
  };

  const handlePolygonDeleted = () => {
    setCurrentPolygon(null);
    setCurrentArea(0);
    setShowFieldForm(false);
  };

  const handleFieldSubmit = async (fieldData: { name: string; description: string; geojson: any; area: number }) => {
    try {
      setLoading(true);
      const response = await fieldsApi.create({
        name: fieldData.name,
        description: fieldData.description,
        geojson: fieldData.geojson
      });
      
      if (response.success) {
        setFields(prev => [...prev, response.data]);
        setCurrentPolygon(null);
        setCurrentArea(0);
        setShowFieldForm(false);
      } else {
        setError('Failed to create field');
      }
    } catch (err) {
      setError('Error creating field');
      console.error('Error creating field:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFieldClick = (field: Field) => {
    setSelectedField(field);
    setShowFieldDetails(true);
  };

  const handleViewWeather = async (fieldId: number) => {
    try {
      setLoading(true);
      const response = await fieldsApi.getWeather(fieldId);
      
      if (response.success) {
        setWeatherData(response.data.weather);
        setShowWeatherModal(true);
      } else {
        setError('Failed to load weather data');
      }
    } catch (err) {
      setError('Error loading weather data');
      console.error('Error loading weather data:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{
        padding: '20px 32px',
        backgroundColor: '#007cbf',
        color: 'white',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        borderBottom: '1px solid #005a8b'
      }}>
        <h1 style={{ 
          margin: 0, 
          fontSize: '28px', 
          fontWeight: '700',
          letterSpacing: '-0.025em'
        }}>
          Geo-Weather Field Visualizer
        </h1>
        <p style={{ 
          margin: '8px 0 0 0', 
          fontSize: '16px', 
          opacity: 0.9,
          fontWeight: '400'
        }}>
          Draw agricultural fields and view weather data
        </p>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex' }}>
        {/* Map Container */}
        <div style={{ flex: 1, position: 'relative' }}>
          <MapComponent
            onPolygonDrawn={handlePolygonDrawn}
            onPolygonDeleted={handlePolygonDeleted}
            fields={fields}
            onFieldClick={handleFieldClick}
          />
        </div>

        {/* Sidebar */}
        <div style={{
          width: '350px',
          backgroundColor: '#ffffff',
          borderLeft: '1px solid #e5e7eb',
          padding: '24px',
          overflowY: 'auto',
          boxShadow: '-4px 0 6px -1px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            marginBottom: '24px',
            paddingBottom: '16px',
            borderBottom: '2px solid #f3f4f6'
          }}>
            <h3 style={{ 
              margin: 0, 
              fontSize: '20px', 
              fontWeight: '700',
              color: '#111827'
            }}>
              Fields
            </h3>
            <span style={{
              backgroundColor: '#007cbf',
              color: 'white',
              padding: '4px 12px',
              borderRadius: '20px',
              fontSize: '14px',
              fontWeight: '600',
              minWidth: '24px',
              textAlign: 'center'
            }}>
              {fields.length}
            </span>
          </div>
          
          {loading && (
            <div style={{ 
              textAlign: 'center', 
              padding: '40px 20px',
              backgroundColor: '#f9fafb',
              borderRadius: '8px',
              border: '1px solid #e5e7eb'
            }}>
              <div style={{
                width: '32px',
                height: '32px',
                border: '3px solid #e5e7eb',
                borderTop: '3px solid #007cbf',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                margin: '0 auto 16px auto'
              }}></div>
              <p style={{ 
                margin: 0, 
                fontSize: '16px', 
                color: '#374151',
                fontWeight: '500'
              }}>
                Loading fields...
              </p>
            </div>
          )}
          
          {error && (
            <div style={{ 
              padding: '16px', 
              backgroundColor: '#fef2f2', 
              color: '#991b1b', 
              borderRadius: '8px',
              marginBottom: '20px',
              fontSize: '14px',
              fontWeight: '500',
              border: '1px solid #fecaca'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '16px' }}>⚠️</span>
                {error}
              </div>
            </div>
          )}
          
          {fields.length === 0 && !loading ? (
            <div style={{ 
              textAlign: 'center', 
              padding: '40px 20px',
              backgroundColor: '#f9fafb',
              borderRadius: '8px',
              border: '1px solid #e5e7eb'
            }}>
              <div style={{
                fontSize: '48px',
                marginBottom: '16px',
                opacity: 0.5
              }}>
                🗺️
              </div>
              <p style={{ 
                margin: 0, 
                fontSize: '16px', 
                color: '#6b7280',
                fontWeight: '500',
                lineHeight: '1.5'
              }}>
                No fields created yet. Draw a polygon on the map to create your first field.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {fields.map((field) => (
                <div
                  key={field.id}
                  style={{
                    padding: '16px',
                    backgroundColor: '#ffffff',
                    borderRadius: '12px',
                    border: '2px solid #e5e7eb',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease-in-out',
                    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#007cbf';
                    e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#e5e7eb';
                    e.currentTarget.style.boxShadow = '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                  onClick={() => handleFieldClick(field)}
                >
                  <h4 style={{ 
                    margin: '0 0 8px 0', 
                    fontSize: '18px', 
                    fontWeight: '700',
                    color: '#111827',
                    lineHeight: '1.3'
                  }}>
                    {field.name}
                  </h4>
                  <p style={{ 
                    margin: '0 0 12px 0', 
                    fontSize: '14px', 
                    color: '#6b7280',
                    fontWeight: '500',
                    lineHeight: '1.4',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical'
                  }}>
                    {field.description || 'No description provided'}
                  </p>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '12px',
                    color: '#9ca3af',
                    fontWeight: '500'
                  }}>
                    <span>📅</span>
                    <span>
                      Created: {new Date(field.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <FieldCreationForm
        isOpen={showFieldForm}
        onClose={() => setShowFieldForm(false)}
        onSubmit={handleFieldSubmit}
        geojson={currentPolygon}
        area={currentArea}
      />

      <FieldDetailsModal
        isOpen={showFieldDetails}
        onClose={() => setShowFieldDetails(false)}
        field={selectedField}
        onViewWeather={handleViewWeather}
      />

      <WeatherDataModal
        isOpen={showWeatherModal}
        onClose={() => setShowWeatherModal(false)}
        weatherData={weatherData}
        fieldName={selectedField?.name || ''}
      />

      {/* CSS for loading animation */}
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default GeoWeatherApp;
