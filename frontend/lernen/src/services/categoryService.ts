import type { ApiResponse, Category, Subcategory } from '../types/api';
import apiService from './apiService';

// Mock data fallback
const mockCategories: Category[] = [
  { id: 'a3b4c5d6-e7f8-9012-6789-345678901234', name: 'Primary school (Grade 1 to 5)', nameVi: 'Tiểu học (Lớp 1-5)', nameEn: 'Primary school (Grade 1 to 5)' },
  { id: 'b4c5d6e7-f8a9-0123-7890-456789012345', name: 'Middle School (Grades 6-8)', nameVi: 'Trung học cơ sở (Lớp 6-8)', nameEn: 'Middle School (Grades 6-8)' },
  { id: 'c5d6e7f8-a9b0-1234-8901-567890123456', name: 'High School (Grades 9-10)', nameVi: 'Trung học phổ thông (Lớp 9-10)', nameEn: 'High School (Grades 9-10)' },
  { id: 'd6e7f8a9-b0c1-2345-9012-678901234567', name: 'Intermediate (Grades 11-12)', nameVi: 'Trung học phổ thông (Lớp 11-12)', nameEn: 'Intermediate (Grades 11-12)' },
  { id: 'e7f8a9b0-c1d2-3456-0123-789012345678', name: "Undergraduate (Bachelor's Degree)", nameVi: 'Đại học', nameEn: "Undergraduate (Bachelor's Degree)" },
  { id: 'f8a9b0c1-d2e3-4567-1234-890123456789', name: "Graduate (Masters degree)", nameVi: 'Sau đại học', nameEn: "Graduate (Masters degree)" }
];

const mockSubcategories: Subcategory[] = [
  { id: 'a9b0c1d2-e3f4-5678-2345-901234567890', categoryId: 'a3b4c5d6-e7f8-9012-6789-345678901234', name: 'Toán', nameVi: 'Toán', nameEn: 'Math' },
  { id: 'b0c1d2e3-f4a5-6789-3456-012345678901', categoryId: 'a3b4c5d6-e7f8-9012-6789-345678901234', name: 'Vật lý', nameVi: 'Vật lý', nameEn: 'Physics' },
  { id: 'c1d2e3f4-a5b6-7890-4567-123456789012', categoryId: 'a3b4c5d6-e7f8-9012-6789-345678901234', name: 'Hóa học', nameVi: 'Hóa học', nameEn: 'Chemistry' },
  { id: 'd2e3f4a5-b6c7-8901-5678-234567890123', categoryId: 'a3b4c5d6-e7f8-9012-6789-345678901234', name: 'Sinh học', nameVi: 'Sinh học', nameEn: 'Biology' },
  { id: 'e3f4a5b6-c7d8-9012-6789-345678901234', categoryId: 'a3b4c5d6-e7f8-9012-6789-345678901234', name: 'Văn học', nameVi: 'Văn học', nameEn: 'Literature' },
  { id: 'f4a5b6c7-d8e9-0123-7890-456789012345', categoryId: 'a3b4c5d6-e7f8-9012-6789-345678901234', name: 'Lịch sử', nameVi: 'Lịch sử', nameEn: 'History' },
  { id: 'a5b6c7d8-e9f0-1234-8901-567890123456', categoryId: 'a3b4c5d6-e7f8-9012-6789-345678901234', name: 'Địa lý', nameVi: 'Địa lý', nameEn: 'Geography' },
  { id: 'b6c7d8e9-f0a1-2345-9012-678901234567', categoryId: 'a3b4c5d6-e7f8-9012-6789-345678901234', name: 'Giáo dục công dân', nameVi: 'Giáo dục công dân', nameEn: 'Civic Education' },
  { id: 'c7d8e9f0-a1b2-3456-0123-789012345678', categoryId: 'a3b4c5d6-e7f8-9012-6789-345678901234', name: 'Tiếng Anh', nameVi: 'Tiếng Anh', nameEn: 'English' }
];

export const categoryService = {
  getCategories: async (): Promise<ApiResponse<Category[]>> => {
    try {
      return await apiService.get<Category[]>('/categories');
    } catch (error) {
      console.warn('Failed to fetch categories from API, using mock data:', error);
      // Fallback to mock data
      return {
        status: 200,
        success: true,
        message: 'Categories retrieved successfully (mock data)',
        data: mockCategories
      };
    }
  },

  getSubcategories: async (categoryId?: string): Promise<ApiResponse<Subcategory[]>> => {
    try {
      const url = categoryId ? `/subcategories?categoryId=${categoryId}` : '/subcategories';
      return await apiService.get<Subcategory[]>(url);
    } catch (error) {
      console.warn('Failed to fetch subcategories from API, using mock data:', error);
      // Fallback to mock data
      const data = categoryId 
        ? mockSubcategories.filter(sub => sub.categoryId === categoryId)
        : mockSubcategories;
      
      return {
        status: 200,
        success: true,
        message: 'Subcategories retrieved successfully (mock data)',
        data
      };
    }
  }
};
