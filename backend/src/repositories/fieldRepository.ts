import pool from '../config/database';
import { Field, CreateFieldRequest, UpdateFieldRequest } from '../types';

export class FieldRepository {
  async createField(userId: number, fieldData: CreateFieldRequest): Promise<Field> {
    const [result] = await pool.execute(
      'INSERT INTO fields (user_id, name, description, geojson) VALUES (?, ?, ?, ?)',
      [userId, fieldData.name, fieldData.description, JSON.stringify(fieldData.geojson)]
    );
    
    const insertResult = result as any;
    return {
      id: insertResult.insertId,
      user_id: userId,
      name: fieldData.name,
      description: fieldData.description,
      geojson: fieldData.geojson,
      created_at: new Date()
    };
  }

  async getAllFields(userId: number): Promise<Field[]> {
    const [rows] = await pool.execute(
      'SELECT * FROM fields WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    );
    
    const fields = rows as any[];
    return fields.map(field => ({
      ...field,
      geojson: JSON.parse(field.geojson),
      created_at: new Date(field.created_at)
    }));
  }

  async getFieldById(id: number, userId: number): Promise<Field | null> {
    const [rows] = await pool.execute(
      'SELECT * FROM fields WHERE id = ? AND user_id = ?',
      [id, userId]
    );
    
    const fields = rows as any[];
    if (fields.length === 0) return null;
    
    const field = fields[0];
    return {
      ...field,
      geojson: JSON.parse(field.geojson),
      created_at: new Date(field.created_at)
    };
  }

  async updateField(id: number, userId: number, updateData: UpdateFieldRequest): Promise<Field | null> {
    const field = await this.getFieldById(id, userId);
    if (!field) return null;

    const updates: string[] = [];
    const values: any[] = [];

    if (updateData.name !== undefined) {
      updates.push('name = ?');
      values.push(updateData.name);
    }

    if (updateData.description !== undefined) {
      updates.push('description = ?');
      values.push(updateData.description);
    }

    if (updates.length === 0) return field;

    values.push(id, userId);

    await pool.execute(
      `UPDATE fields SET ${updates.join(', ')} WHERE id = ? AND user_id = ?`,
      values
    );

    return await this.getFieldById(id, userId);
  }

  async deleteField(id: number, userId: number): Promise<boolean> {
    const [result] = await pool.execute(
      'DELETE FROM fields WHERE id = ? AND user_id = ?',
      [id, userId]
    );
    
    const deleteResult = result as any;
    return deleteResult.affectedRows > 0;
  }
} 