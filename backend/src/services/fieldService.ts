import { FieldRepository } from '../repositories/fieldRepository';
import { UserRepository } from '../repositories/userRepository';
import { CreateFieldRequest, UpdateFieldRequest, Field } from '../types';

export class FieldService {
  private fieldRepository: FieldRepository;
  private userRepository: UserRepository;

  constructor() {
    this.fieldRepository = new FieldRepository();
    this.userRepository = new UserRepository();
  }

  async createField(fieldData: CreateFieldRequest): Promise<Field> {
    // Get default user for now (in a real app, this would come from authentication)
    const user = await this.userRepository.getDefaultUser();
    
    return await this.fieldRepository.createField(user.id, fieldData);
  }

  async getAllFields(): Promise<Field[]> {
    const user = await this.userRepository.getDefaultUser();
    return await this.fieldRepository.getAllFields(user.id); // get fields for the default user
  }

  async getFieldById(id: number): Promise<Field | null> {
    const user = await this.userRepository.getDefaultUser();
    return await this.fieldRepository.getFieldById(id, user.id);
  }

  async updateField(id: number, updateData: UpdateFieldRequest): Promise<Field | null> {
    const user = await this.userRepository.getDefaultUser();
    return await this.fieldRepository.updateField(id, user.id, updateData);
  }

  async deleteField(id: number): Promise<boolean> {
    const user = await this.userRepository.getDefaultUser();
    return await this.fieldRepository.deleteField(id, user.id);
  }
} 