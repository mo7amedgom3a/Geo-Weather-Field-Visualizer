'use client';

import React from 'react';

export type BasemapType = 'positron' | 'satellite';

interface BasemapSwitcherProps {
  currentBasemap: BasemapType;
  onBasemapChange: (basemap: BasemapType) => void;
}

const basemaps = {
  positron: {
    name: 'Positron',
    icon: '🗺️'
  },
  satellite: {
    name: 'Satellite',
    icon: '🛰️'
  }
};

const BasemapSwitcher: React.FC<BasemapSwitcherProps> = ({
  currentBasemap,
  onBasemapChange
}) => {
  return (
    <div style={{
      position: 'absolute',
      top: '20px',
      right: '20px',
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      border: '1px solid #e5e7eb',
      overflow: 'hidden',
      zIndex: 1000
    }}>
      <div style={{
        display: 'flex',
        flexDirection: 'column'
      }}>
        {Object.entries(basemaps).map(([key, basemap]) => (
          <button
            key={key}
            onClick={() => onBasemapChange(key as BasemapType)}
            style={{
              padding: '12px 16px',
              border: 'none',
              backgroundColor: currentBasemap === key ? '#007cbf' : '#ffffff',
              color: currentBasemap === key ? 'white' : '#374151',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              transition: 'all 0.2s ease-in-out',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              minWidth: '120px',
              borderBottom: key === 'positron' ? '1px solid #e5e7eb' : 'none'
            }}
            onMouseEnter={(e) => {
              if (currentBasemap !== key) {
                e.currentTarget.style.backgroundColor = currentBasemap === key ? '#007cbf' : '#f3f4f6';
              }
            }}
            onMouseLeave={(e) => {
              if (currentBasemap !== key) {
                e.currentTarget.style.backgroundColor = '#ffffff';
              }
            }}
          >
            <span style={{ fontSize: '16px' }}>{basemap.icon}</span>
            {basemap.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default BasemapSwitcher; 