import pool from '../config/database';
import { User } from '../types';

export class UserRepository {
  async createUser(username: string): Promise<User> {
    const [result] = await pool.execute(
      'INSERT INTO users (username) VALUES (?)',
      [username]
    );
    
    const insertResult = result as any;
    return {
      id: insertResult.insertId,
      username,
      created_at: new Date()
    };
  }

  async getUserById(id: number): Promise<User | null> {
    const [rows] = await pool.execute(
      'SELECT * FROM users WHERE id = ?',
      [id]
    );
    
    const users = rows as User[];
    return users.length > 0 ? users[0] : null;
  }

  async getUserByUsername(username: string): Promise<User | null> {
    const [rows] = await pool.execute(
      'SELECT * FROM users WHERE username = ?',
      [username]
    );
    
    const users = rows as User[];
    return users.length > 0 ? users[0] : null;
  }

  async getDefaultUser(): Promise<User> {
    const user = await this.getUserByUsername('default_user');
    if (user) {
      return user;
    }
    
    // Create default user if it doesn't exist
    return await this.createUser('default_user');
  }
} 