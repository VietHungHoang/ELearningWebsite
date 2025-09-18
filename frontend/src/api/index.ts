// Export all API services and client
export { apiClient } from './client';
export { categoryService } from './categoryService';

// Re-export types for convenience  
export type { ApiResponse, Category, BasicCourseData, CreateCourseRequest, Course } from '../types/api';