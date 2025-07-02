import { Request, Response } from 'express';
import { FieldService } from '../services/fieldService';
import { createFieldSchema, updateFieldSchema } from '../validation/fieldValidation';
import { ApiResponse } from '../types';

export class FieldController {
  private fieldService: FieldService;

  constructor() {
    this.fieldService = new FieldService();
  }

  async createField(req: Request, res: Response): Promise<void> {
    try {
      const validatedData = createFieldSchema.parse(req.body);
      const field = await this.fieldService.createField(validatedData);
      
      const response: ApiResponse = {
        success: true,
        data: field,
        message: 'Field created successfully'
      };
      
      res.status(201).json(response);
    } catch (error: any) {
      const response: ApiResponse = {
        success: false,
        error: error.message || 'Failed to create field'
      };
      
      res.status(400).json(response);
    }
  }

  async getAllFields(req: Request, res: Response): Promise<void> {
    try {
      const fields = await this.fieldService.getAllFields();
      
      const response: ApiResponse = {
        success: true,
        data: fields,
        message: 'Fields retrieved successfully'
      };
      
      res.status(200).json(response);
    } catch (error: any) {
      const response: ApiResponse = {
        success: false,
        error: error.message || 'Failed to retrieve fields'
      };
      
      res.status(500).json(response);
    }
  }

  async updateField(req: Request, res: Response): Promise<void> {
    try {
      const fieldId = parseInt(req.params.id);
      if (isNaN(fieldId)) {
        const response: ApiResponse = {
          success: false,
          error: 'Invalid field ID'
        };
        res.status(400).json(response);
        return;
      }

      const validatedData = updateFieldSchema.parse(req.body);
      const field = await this.fieldService.updateField(fieldId, validatedData);
      
      if (!field) {
        const response: ApiResponse = {
          success: false,
          error: 'Field not found'
        };
        res.status(404).json(response);
        return;
      }
      
      const response: ApiResponse = {
        success: true,
        data: field,
        message: 'Field updated successfully'
      };
      
      res.status(200).json(response);
    } catch (error: any) {
      const response: ApiResponse = {
        success: false,
        error: error.message || 'Failed to update field'
      };
      
      res.status(400).json(response);
    }
  }

  async deleteField(req: Request, res: Response): Promise<void> {
    try {
      const fieldId = parseInt(req.params.id);
      if (isNaN(fieldId)) {
        const response: ApiResponse = {
          success: false,
          error: 'Invalid field ID'
        };
        res.status(400).json(response);
        return;
      }

      const deleted = await this.fieldService.deleteField(fieldId);
      
      if (!deleted) {
        const response: ApiResponse = {
          success: false,
          error: 'Field not found'
        };
        res.status(404).json(response);
        return;
      }
      
      const response: ApiResponse = {
        success: true,
        message: 'Field deleted successfully'
      };
      
      res.status(200).json(response);
    } catch (error: any) {
      const response: ApiResponse = {
        success: false,
        error: error.message || 'Failed to delete field'
      };
      
      res.status(500).json(response);
    }
  }
} 