// API Response wrapper interface matching Java backend
export interface ApiResponse<T> {
  status: number;
  data: T;
  message: string;
}

// Category interface
export interface Category {
  id: number;
  name: string;
  description?: string;
  icon?: string; // icon key/name - backend returns key, frontend maps to actual icon
}

// Course interfaces  
export interface BasicCourseData {
  title: string;
  category: string;
  level: string;
}

export interface CreateCourseRequest {
  title: string;
  categoryId: number;
  level: string;
}

export interface Course {
  id: number;
  title: string;
  category: Category;
  level: string;
  createdAt?: string;
  updatedAt?: string;
}

// Common API types
export interface PaginationParams {
  page?: number;
  size?: number;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}