'use client';

import React, { useState } from 'react';
import WeatherChart from './WeatherChart';
import WeatherTable from './WeatherTable';

interface WeatherData {
  time: string[];
  tMax: number[];
  tMin: number[];
  rhMax: number[];
  rhMin: number[];
  precip: number[];
}

interface WeatherDataModalProps {
  isOpen: boolean;
  onClose: () => void;
  weatherData: WeatherData | null;
  fieldName: string;
}

const WeatherDataModal: React.FC<WeatherDataModalProps> = ({
  isOpen,
  onClose,
  weatherData,
  fieldName
}) => {
  const [viewMode, setViewMode] = useState<'chart' | 'table'>('chart');

  if (!isOpen || !weatherData) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
      backdropFilter: 'blur(4px)'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '32px',
        borderRadius: '12px',
        width: '90vw',
        maxWidth: '1200px',
        height: '80vh',
        maxHeight: '800px',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        border: '1px solid #e5e7eb'
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '24px' 
        }}>
          <h2 style={{ 
            margin: 0, 
            fontSize: '28px', 
            fontWeight: '700',
            color: '#111827'
          }}>
            Weather Data - {fieldName}
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '28px',
              cursor: 'pointer',
              padding: '8px',
              borderRadius: '8px',
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#6b7280',
              transition: 'all 0.2s ease-in-out'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f3f4f6';
              e.currentTarget.style.color = '#374151';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#6b7280';
            }}
          >
            ×
          </button>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => setViewMode('chart')}
              style={{
                padding: '12px 24px',
                border: '2px solid #007cbf',
                borderRadius: '8px',
                backgroundColor: viewMode === 'chart' ? '#007cbf' : 'white',
                color: viewMode === 'chart' ? 'white' : '#007cbf',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: '600',
                transition: 'all 0.2s ease-in-out',
                minWidth: '120px'
              }}
              onMouseEnter={(e) => {
                if (viewMode !== 'chart') {
                  e.currentTarget.style.backgroundColor = '#f0f9ff';
                  e.currentTarget.style.borderColor = '#005a8b';
                }
              }}
              onMouseLeave={(e) => {
                if (viewMode !== 'chart') {
                  e.currentTarget.style.backgroundColor = 'white';
                  e.currentTarget.style.borderColor = '#007cbf';
                }
              }}
            >
              Chart View
            </button>
            <button
              onClick={() => setViewMode('table')}
              style={{
                padding: '12px 24px',
                border: '2px solid #007cbf',
                borderRadius: '8px',
                backgroundColor: viewMode === 'table' ? '#007cbf' : 'white',
                color: viewMode === 'table' ? 'white' : '#007cbf',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: '600',
                transition: 'all 0.2s ease-in-out',
                minWidth: '120px'
              }}
              onMouseEnter={(e) => {
                if (viewMode !== 'table') {
                  e.currentTarget.style.backgroundColor = '#f0f9ff';
                  e.currentTarget.style.borderColor = '#005a8b';
                }
              }}
              onMouseLeave={(e) => {
                if (viewMode !== 'table') {
                  e.currentTarget.style.backgroundColor = 'white';
                  e.currentTarget.style.borderColor = '#007cbf';
                }
              }}
            >
              Table View
            </button>
          </div>
        </div>

        <div style={{ 
          flex: 1, 
          overflow: 'auto',
          backgroundColor: '#f9fafb',
          borderRadius: '8px',
          padding: '20px',
          border: '1px solid #e5e7eb'
        }}>
          {viewMode === 'chart' ? (
            <WeatherChart weatherData={weatherData} />
          ) : (
            <WeatherTable weatherData={weatherData} />
          )}
        </div>
      </div>
    </div>
  );
};

export default WeatherDataModal; 