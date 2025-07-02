'use client';

import React, { useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface WeatherData {
  time: string[];
  tMax: number[];
  tMin: number[];
  rhMax: number[];
  rhMin: number[];
  precip: number[];
}

interface WeatherChartProps {
  weatherData: WeatherData;
}

const WeatherChart: React.FC<WeatherChartProps> = ({ weatherData }) => {
  const [hiddenDatasets, setHiddenDatasets] = useState<Set<string>>(new Set());

  const toggleDataset = (datasetKey: string) => {
    const newHidden = new Set(hiddenDatasets);
    if (newHidden.has(datasetKey)) {
      newHidden.delete(datasetKey);
    } else {
      newHidden.add(datasetKey);
    }
    setHiddenDatasets(newHidden);
  };

  const datasets = [
    {
      label: 'Max Temperature (°F)',
      data: weatherData.tMax,
      borderColor: 'rgb(239, 68, 68)',
      backgroundColor: 'rgba(239, 68, 68, 0.1)',
      key: 'tMax'
    },
    {
      label: 'Min Temperature (°F)',
      data: weatherData.tMin,
      borderColor: 'rgb(59, 130, 246)',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      key: 'tMin'
    },
    {
      label: 'Max Humidity (%)',
      data: weatherData.rhMax.map(h => h * 100), // Convert to percentage
      borderColor: 'rgb(34, 197, 94)',
      backgroundColor: 'rgba(34, 197, 94, 0.1)',
      key: 'rhMax'
    },
    {
      label: 'Min Humidity (%)',
      data: weatherData.rhMin.map(h => h * 100), // Convert to percentage
      borderColor: 'rgb(245, 158, 11)',
      backgroundColor: 'rgba(245, 158, 11, 0.1)',
      key: 'rhMin'
    },
    {
      label: 'Precipitation (inches)',
      data: weatherData.precip,
      borderColor: 'rgb(139, 92, 246)',
      backgroundColor: 'rgba(139, 92, 246, 0.1)',
      key: 'precip'
    }
  ];

  const filteredDatasets = datasets.filter(dataset => !hiddenDatasets.has(dataset.key));

  const chartData = {
    labels: weatherData.time,
    datasets: filteredDatasets
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false // We'll create our own custom legend
      },
      title: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: '#e5e7eb',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        titleFont: {
          size: 14,
          weight: 'bold' as const
        },
        bodyFont: {
          size: 13
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: '#e5e7eb',
          borderColor: '#d1d5db'
        },
        ticks: {
          color: '#374151',
          font: {
            size: 12,
            weight: 'bold' as const
          }
        }
      },
      y: {
        beginAtZero: false,
        grid: {
          color: '#e5e7eb',
          borderColor: '#d1d5db'
        },
        ticks: {
          color: '#374151',
          font: {
            size: 12,
            weight: 'bold' as const
          }
        }
      },
    },
    elements: {
      point: {
        radius: 4,
        hoverRadius: 6,
        borderWidth: 2
      },
      line: {
        borderWidth: 3,
        tension: 0.1
      }
    }
  };

  return (
    <div style={{ width: '100%' }}>
      <div style={{ marginBottom: '24px' }}>
        <h3 style={{ 
          margin: '0 0 16px 0', 
          fontSize: '18px', 
          fontWeight: '700',
          color: '#111827'
        }}>
          Weather Variables
        </h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
          {datasets.map((dataset) => (
            <button
              key={dataset.key}
              onClick={() => toggleDataset(dataset.key)}
              style={{
                padding: '10px 16px',
                border: `2px solid ${hiddenDatasets.has(dataset.key) ? '#d1d5db' : dataset.borderColor}`,
                borderRadius: '8px',
                backgroundColor: hiddenDatasets.has(dataset.key) ? '#f9fafb' : dataset.backgroundColor,
                color: hiddenDatasets.has(dataset.key) ? '#6b7280' : '#111827',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: hiddenDatasets.has(dataset.key) ? '500' : '600',
                opacity: hiddenDatasets.has(dataset.key) ? 0.6 : 1,
                transition: 'all 0.2s ease-in-out',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
              onMouseEnter={(e) => {
                if (hiddenDatasets.has(dataset.key)) {
                  e.currentTarget.style.backgroundColor = '#f3f4f6';
                  e.currentTarget.style.borderColor = '#9ca3af';
                } else {
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
                }
              }}
              onMouseLeave={(e) => {
                if (hiddenDatasets.has(dataset.key)) {
                  e.currentTarget.style.backgroundColor = '#f9fafb';
                  e.currentTarget.style.borderColor = '#d1d5db';
                } else {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }
              }}
            >
              <div style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                backgroundColor: dataset.borderColor,
                opacity: hiddenDatasets.has(dataset.key) ? 0.3 : 1
              }}></div>
              {dataset.label}
            </button>
          ))}
        </div>
      </div>
      
      <div style={{ 
        height: '400px',
        backgroundColor: '#ffffff',
        borderRadius: '8px',
        padding: '20px',
        border: '1px solid #e5e7eb'
      }}>
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
};

export default WeatherChart; 