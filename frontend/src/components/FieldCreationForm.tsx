'use client';

import React, { useState } from 'react';

interface FieldCreationFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (fieldData: { name: string; description: string; geojson: any; area: number }) => void;
  geojson: any;
  area: number;
}

const FieldCreationForm: React.FC<FieldCreationFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  geojson,
  area
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState<{ name?: string; description?: string }>({});

  const validateForm = () => {
    const newErrors: { name?: string; description?: string } = {};

    if (!name.trim()) {
      newErrors.name = 'Field name is required';
    } else if (name.length > 20) {
      newErrors.name = 'Field name must be 20 characters or less';
    }

    if (description.length > 200) {
      newErrors.description = 'Description must be 200 characters or less';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit({
        name: name.trim(),
        description: description.trim(),
        geojson,
        area
      });
      
      // Reset form
      setName('');
      setDescription('');
      setErrors({});
      onClose();
    }
  };

  const handleCancel = () => {
    setName('');
    setDescription('');
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

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
        width: '450px',
        maxWidth: '90vw',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        border: '1px solid #e5e7eb'
      }}>
        <h2 style={{ 
          margin: '0 0 24px 0', 
          fontSize: '24px', 
          fontWeight: '700',
          color: '#111827'
        }}>
          Create New Field
        </h2>
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontWeight: '600',
              fontSize: '14px',
              color: '#374151'
            }}>
              Field Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: errors.name ? '2px solid #ef4444' : '2px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '16px',
                color: '#111827',
                backgroundColor: '#ffffff',
                transition: 'all 0.2s ease-in-out',
                boxSizing: 'border-box'
              }}
              placeholder="Enter field name"
              onFocus={(e) => {
                e.target.style.borderColor = '#3b82f6';
                e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = errors.name ? '#ef4444' : '#d1d5db';
                e.target.style.boxShadow = 'none';
              }}
            />
            {errors.name && (
              <p style={{ 
                color: '#ef4444', 
                fontSize: '14px', 
                margin: '8px 0 0 0',
                fontWeight: '500'
              }}>
                {errors.name}
              </p>
            )}
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontWeight: '600',
              fontSize: '14px',
              color: '#374151'
            }}>
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: errors.description ? '2px solid #ef4444' : '2px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '16px',
                color: '#111827',
                backgroundColor: '#ffffff',
                minHeight: '100px',
                resize: 'vertical',
                transition: 'all 0.2s ease-in-out',
                boxSizing: 'border-box',
                fontFamily: 'inherit'
              }}
              placeholder="Enter field description"
              onFocus={(e) => {
                e.target.style.borderColor = '#3b82f6';
                e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = errors.description ? '#ef4444' : '#d1d5db';
                e.target.style.boxShadow = 'none';
              }}
            />
            {errors.description && (
              <p style={{ 
                color: '#ef4444', 
                fontSize: '14px', 
                margin: '8px 0 0 0',
                fontWeight: '500'
              }}>
                {errors.description}
              </p>
            )}
            <p style={{ 
              margin: '4px 0 0 0', 
              fontSize: '12px', 
              color: '#6b7280',
              textAlign: 'right'
            }}>
              {description.length}/200 characters
            </p>
          </div>

          <div style={{ 
            marginBottom: '24px', 
            padding: '16px', 
            backgroundColor: '#f3f4f6', 
            borderRadius: '8px',
            border: '1px solid #e5e7eb'
          }}>
            <p style={{ 
              margin: '0 0 4px 0', 
              fontSize: '16px', 
              fontWeight: '600',
              color: '#111827'
            }}>
              Field Area: {area.toFixed(2)} square meters
            </p>
            <p style={{ 
              margin: 0, 
              fontSize: '14px', 
              color: '#6b7280',
              fontWeight: '500'
            }}>
              {(area * 0.000247105).toFixed(2)} acres
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={handleCancel}
              style={{
                padding: '12px 24px',
                border: '2px solid #d1d5db',
                borderRadius: '8px',
                backgroundColor: '#ffffff',
                color: '#374151',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: '600',
                transition: 'all 0.2s ease-in-out',
                minWidth: '100px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f9fafb';
                e.currentTarget.style.borderColor = '#9ca3af';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#ffffff';
                e.currentTarget.style.borderColor = '#d1d5db';
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                padding: '12px 24px',
                border: 'none',
                borderRadius: '8px',
                backgroundColor: '#007cbf',
                color: 'white',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: '600',
                transition: 'all 0.2s ease-in-out',
                minWidth: '120px',
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
              Create Field
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FieldCreationForm; 