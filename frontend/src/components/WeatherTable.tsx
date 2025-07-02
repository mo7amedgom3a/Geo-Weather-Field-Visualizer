'use client';

import React from 'react';

interface WeatherData {
  time: string[];
  tMax: number[];
  tMin: number[];
  rhMax: number[];
  rhMin: number[];
  precip: number[];
}

interface WeatherTableProps {
  weatherData: WeatherData;
}

const WeatherTable: React.FC<WeatherTableProps> = ({ weatherData }) => {
  const exportToCSV = () => {
    const headers = ['Date', 'Max Temperature (°F)', 'Min Temperature (°F)', 'Max Humidity (%)', 'Min Humidity (%)', 'Precipitation (inches)'];
    
    const csvContent = [
      headers.join(','),
      ...weatherData.time.map((date, index) => [
        date,
        weatherData.tMax[index],
        weatherData.tMin[index],
        (weatherData.rhMax[index] * 100).toFixed(1),
        (weatherData.rhMin[index] * 100).toFixed(1),
        weatherData.precip[index]
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'weather_data.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ width: '100%' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '24px' 
      }}>
        <h3 style={{ 
          margin: 0, 
          fontSize: '18px', 
          fontWeight: '700',
          color: '#111827'
        }}>
          Weather Data Table
        </h3>
        <button
          onClick={exportToCSV}
          style={{
            padding: '12px 20px',
            border: 'none',
            borderRadius: '8px',
            backgroundColor: '#007cbf',
            color: 'white',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600',
            transition: 'all 0.2s ease-in-out',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#005a8b';
            e.currentTarget.style.transform = 'translateY(-1px)';
            e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#007cbf';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)';
          }}
        >
          <span>📊</span>
          Export CSV
        </button>
      </div>
      
      <div style={{ 
        overflowX: 'auto',
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        border: '1px solid #e5e7eb',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
      }}>
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: '14px'
        }}>
          <thead>
            <tr style={{ 
              backgroundColor: '#f9fafb',
              borderBottom: '2px solid #e5e7eb'
            }}>
              <th style={{
                padding: '16px 12px',
                textAlign: 'left',
                fontWeight: '700',
                color: '#111827',
                fontSize: '14px',
                borderBottom: '2px solid #e5e7eb'
              }}>
                Date
              </th>
              <th style={{
                padding: '16px 12px',
                textAlign: 'center',
                fontWeight: '700',
                color: '#111827',
                fontSize: '14px',
                borderBottom: '2px solid #e5e7eb'
              }}>
                Max Temp (°F)
              </th>
              <th style={{
                padding: '16px 12px',
                textAlign: 'center',
                fontWeight: '700',
                color: '#111827',
                fontSize: '14px',
                borderBottom: '2px solid #e5e7eb'
              }}>
                Min Temp (°F)
              </th>
              <th style={{
                padding: '16px 12px',
                textAlign: 'center',
                fontWeight: '700',
                color: '#111827',
                fontSize: '14px',
                borderBottom: '2px solid #e5e7eb'
              }}>
                Max Humidity (%)
              </th>
              <th style={{
                padding: '16px 12px',
                textAlign: 'center',
                fontWeight: '700',
                color: '#111827',
                fontSize: '14px',
                borderBottom: '2px solid #e5e7eb'
              }}>
                Min Humidity (%)
              </th>
              <th style={{
                padding: '16px 12px',
                textAlign: 'center',
                fontWeight: '700',
                color: '#111827',
                fontSize: '14px',
                borderBottom: '2px solid #e5e7eb'
              }}>
                Precipitation (inches)
              </th>
            </tr>
          </thead>
          <tbody>
            {weatherData.time.map((date, index) => (
              <tr key={date} style={{ 
                borderBottom: '1px solid #f3f4f6',
                transition: 'background-color 0.2s ease-in-out'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f9fafb';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
              >
                <td style={{
                  padding: '16px 12px',
                  fontWeight: '600',
                  color: '#111827',
                  fontSize: '14px'
                }}>
                  {new Date(date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </td>
                <td style={{
                  padding: '16px 12px',
                  textAlign: 'center',
                  fontWeight: '500',
                  color: '#374151',
                  fontSize: '14px'
                }}>
                  {weatherData.tMax[index].toFixed(1)}
                </td>
                <td style={{
                  padding: '16px 12px',
                  textAlign: 'center',
                  fontWeight: '500',
                  color: '#374151',
                  fontSize: '14px'
                }}>
                  {weatherData.tMin[index].toFixed(1)}
                </td>
                <td style={{
                  padding: '16px 12px',
                  textAlign: 'center',
                  fontWeight: '500',
                  color: '#374151',
                  fontSize: '14px'
                }}>
                  {(weatherData.rhMax[index] * 100).toFixed(1)}
                </td>
                <td style={{
                  padding: '16px 12px',
                  textAlign: 'center',
                  fontWeight: '500',
                  color: '#374151',
                  fontSize: '14px'
                }}>
                  {(weatherData.rhMin[index] * 100).toFixed(1)}
                </td>
                <td style={{
                  padding: '16px 12px',
                  textAlign: 'center',
                  fontWeight: '500',
                  color: '#374151',
                  fontSize: '14px'
                }}>
                  {weatherData.precip[index].toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WeatherTable; 