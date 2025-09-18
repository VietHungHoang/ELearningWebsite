import type { ApiResponse, Category } from '../types/api';
import { apiClient } from './client';

export class CategoryService {
  // Get all categories
  async getCategories(): Promise<ApiResponse<Category[]>> {
    return apiClient.get<Category[]>('/course/category');
  }

  // Get category by ID
  async getCategoryById(id: number): Promise<ApiResponse<Category>> {
    return apiClient.get<Category>(`/course/category/${id}`);
  }
}

// Export singleton instance
export const categoryService = new CategoryService();
export default categoryService;