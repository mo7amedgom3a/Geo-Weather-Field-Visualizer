import { z } from 'zod';
import * as turf from '@turf/turf';
import { Feature, Polygon } from 'geojson';

// GeoJSON Polygon validation schema
const polygonSchema = z.object({
  type: z.literal('Polygon'),
  coordinates: z.array(z.array(z.array(z.number()).min(2).max(2))).min(1)
});

// GeoJSON Feature validation schema
const featureSchema = z.object({
  type: z.literal('Feature'),
  geometry: polygonSchema,
  properties: z.record(z.any()).optional()
}) as z.ZodType<Feature<Polygon>>;

// Create field validation schema
export const createFieldSchema = z.object({
  name: z.string().min(1, 'Name is required').max(20, 'Name must be 20 characters or less'),
  description: z.string().max(200, 'Description must be 200 characters or less'),
  geojson: featureSchema.refine((data) => {
    try {
      // Calculate area using Turf.js
      const area = turf.area(data);
      const acres = area * 0.000247105; // Convert square meters to acres
      return acres <= 100;
    } catch (error) {
      return false;
    }
  }, 'Field area must not exceed 100 acres')
});

// Update field validation schema
export const updateFieldSchema = z.object({
  name: z.string().min(1, 'Name is required').max(20, 'Name must be 20 characters or less').optional(),
  description: z.string().max(200, 'Description must be 200 characters or less').optional()
}).refine((data) => {
  return data.name !== undefined || data.description !== undefined;
}, 'At least one field (name or description) must be provided');

export type CreateFieldInput = z.infer<typeof createFieldSchema>;
export type UpdateFieldInput = z.infer<typeof updateFieldSchema>; 