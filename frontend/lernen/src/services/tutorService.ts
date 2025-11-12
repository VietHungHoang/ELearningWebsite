import type { ApiResponse, Location, Language, Tutor, TutorSearchFilters, PaginatedResponse, Category, Subcategory, FilterData } from '../types/api';
import apiService from './apiService';

// Mock data fallback
const mockTimezones: Location[] = [
  { id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', name: 'Việt Nam', offset: '+07:00' },
  { id: 'b2c3d4e5-f6a7-8901-bcde-f23456789012', name: 'United States (Eastern)', offset: '-05:00' },
  { id: 'c3d4e5f6-a7b8-9012-cdef-345678901234', name: 'Singapore', offset: '+08:00' },
  { id: 'd4e5f6a7-b8c9-0123-def0-456789012345', name: 'Japan', offset: '+09:00' },
  { id: 'e5f6a7b8-c9d0-1234-ef01-567890123456', name: 'Korea', offset: '+09:00' },
  { id: 'f6a7b8c9-d0e1-2345-f012-678901234567', name: 'Thailand', offset: '+07:00' },
  { id: 'a7b8c9d0-e1f2-3456-0123-789012345678', name: 'Australia (Sydney)', offset: '+10:00' },
  { id: 'b8c9d0e1-f2a3-4567-1234-890123456789', name: 'Canada (Eastern)', offset: '-05:00' },
  { id: 'c9d0e1f2-a3b4-5678-2345-901234567890', name: 'United Kingdom', offset: '+00:00' }
];

const mockLanguages: Language[] = [
  { id: 'd0e1f2a3-b4c5-6789-3456-012345678901', name: 'English', code: 'en' },
  { id: 'e1f2a3b4-c5d6-7890-4567-123456789012', name: 'Vietnamese', code: 'vi' },
  { id: 'f2a3b4c5-d6e7-8901-5678-234567890123', name: 'Japanese', code: 'ja' }
];

const mockCategories: Category[] = [
  { id: 'a3b4c5d6-e7f8-9012-6789-345678901234', name: 'Primary school (Grade 1 to 5)' },
  { id: 'b4c5d6e7-f8a9-0123-7890-456789012345', name: 'Middle School (Grades 6-8)' },
  { id: 'c5d6e7f8-a9b0-1234-8901-567890123456', name: 'High School (Grades 9-10)' },
  { id: 'd6e7f8a9-b0c1-2345-9012-678901234567', name: 'Intermediate (Grades 11-12)' },
  { id: 'e7f8a9b0-c1d2-3456-0123-789012345678', name: "Undergraduate (Bachelor's Degree)" },
  { id: 'f8a9b0c1-d2e3-4567-1234-890123456789', name: "Graduate (Masters degree)" }
];

const mockSubcategories: Subcategory[] = [
  { id: 'a9b0c1d2-e3f4-5678-2345-901234567890', categoryId: 'a3b4c5d6-e7f8-9012-6789-345678901234', name: 'Toán' },
  { id: 'b0c1d2e3-f4a5-6789-3456-012345678901', categoryId: 'a3b4c5d6-e7f8-9012-6789-345678901234', name: 'Vật lý' },
  { id: 'c1d2e3f4-a5b6-7890-4567-123456789012', categoryId: 'a3b4c5d6-e7f8-9012-6789-345678901234', name: 'Hóa học' },
  { id: 'd2e3f4a5-b6c7-8901-5678-234567890123', categoryId: 'a3b4c5d6-e7f8-9012-6789-345678901234', name: 'Sinh học' },
  { id: 'e3f4a5b6-c7d8-9012-6789-345678901234', categoryId: 'a3b4c5d6-e7f8-9012-6789-345678901234', name: 'Văn học' },
  { id: 'f4a5b6c7-d8e9-0123-7890-456789012345', categoryId: 'a3b4c5d6-e7f8-9012-6789-345678901234', name: 'Lịch sử' },
  { id: 'a5b6c7d8-e9f0-1234-8901-567890123456', categoryId: 'a3b4c5d6-e7f8-9012-6789-345678901234', name: 'Địa lý' },
  { id: 'b6c7d8e9-f0a1-2345-9012-678901234567', categoryId: 'a3b4c5d6-e7f8-9012-6789-345678901234', name: 'Giáo dục công dân' },
  { id: 'c7d8e9f0-a1b2-3456-0123-789012345678', categoryId: 'a3b4c5d6-e7f8-9012-6789-345678901234', name: 'Tiếng Anh' }
];

const mockTutors: Tutor[] = [
  {
    id: 'd8e9f0a1-b2c3-4567-1234-890123456789',
    name: 'Cynthia Hunter',
    avatarUrl: 'https://picsum.photos/seed/cynthia/80/80',
    isVerified: true,
    specialization: 'Empowering Students with Customized Learning Support',
    nationalityCode: 'US',
    currentSessionFee: 40.00,
    currency: 'USD',
    averageRating: 5.0,
    reviewCount: 1,
    languages: ['Armenian', 'Asturian'],
    categoryIds: ['550e8400-e29b-41d4-a716-446655440002'],
    teachesInGroups: true,
    maxGroupMembers: 5,
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    videoThumbnailUrl: 'https://picsum.photos/seed/video1/400/225',
    bio: 'Hi! I am Cynthia Hunter, a dedicated and experienced tutor with a passion for helping students excel in their academic pursuits. With expertise across a variety of subjects, including mathematics, science, and language arts, I create engaging and personalized learning experiences that cater to each student\'s unique needs and learning style.',
    studentCount: 45,
    sessionDurationMinutes: 120,
    bookedSessionsCount: 156
  },
  {
    id: 'e9f0a1b2-c3d4-5678-2345-901234567890',
    name: 'Antony Clara',
    avatarUrl: 'https://picsum.photos/seed/antony/80/80',
    isVerified: true,
    specialization: 'Unlocking Potential Through Customized Academic Guidance',
    nationalityCode: 'GB',
    currentSessionFee: 20.00,
    currency: 'GBP',
    averageRating: 5.0,
    reviewCount: 2,
    languages: ['Azerbaijani', 'Basque'],
    categoryIds: ['550e8400-e29b-41d4-a716-446655440002'],
    teachesInGroups: false,
    maxGroupMembers: 1,
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    videoThumbnailUrl: 'https://picsum.photos/seed/video2/400/225',
    bio: 'Hello! My name is Antony Clara, and I\'m a passionate tutor dedicated to helping students unlock their full academic potential. With a strong focus on creating engaging learning environments, I specialize in mathematics and science education, helping students build confidence and achieve their academic goals.',
    studentCount: 23,
    sessionDurationMinutes: 90,
    bookedSessionsCount: 89
  },
  {
    id: 'f0a1b2c3-d4e5-6789-3456-012345678901',
    name: 'John Smith',
    avatarUrl: 'https://picsum.photos/seed/john/80/80',
    isVerified: true,
    specialization: 'Mathematics Excellence Through Interactive Learning',
    nationalityCode: 'US',
    currentSessionFee: 35.00,
    currency: 'USD',
    averageRating: 4.8,
    reviewCount: 15,
    languages: ['English', 'Spanish'],
    categoryIds: ['550e8400-e29b-41d4-a716-446655440002'],
    teachesInGroups: true,
    maxGroupMembers: 8,
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    videoThumbnailUrl: 'https://picsum.photos/seed/video3/400/225',
    bio: 'Experienced mathematics tutor with 10+ years of teaching experience. I specialize in making complex mathematical concepts accessible and enjoyable for students of all levels. My approach combines traditional teaching methods with modern technology to create an engaging learning experience.',
    studentCount: 127,
    sessionDurationMinutes: 60,
    bookedSessionsCount: 234
  },
  {
    id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    name: 'Sarah Johnson',
    avatarUrl: 'https://picsum.photos/seed/sarah/80/80',
    isVerified: true,
    specialization: 'Science Education Specialist',
    nationalityCode: 'CA',
    currentSessionFee: 45.00,
    currency: 'CAD',
    averageRating: 4.9,
    reviewCount: 8,
    languages: ['English', 'French'],
    categoryIds: ['550e8400-e29b-41d4-a716-446655440002'],
    teachesInGroups: false,
    maxGroupMembers: 1,
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    videoThumbnailUrl: 'https://picsum.photos/seed/video4/400/225',
    bio: 'Passionate about making science accessible and exciting for all students. With a background in biology and chemistry, I help students develop a deep understanding of scientific concepts while fostering curiosity and critical thinking skills. I believe in hands-on learning and real-world applications.',
    studentCount: 89,
    sessionDurationMinutes: 75,
    bookedSessionsCount: 178
  },
  {
    id: 'b2c3d4e5-f6a7-8901-bcde-f23456789012',
    name: 'Michael Chen',
    avatarUrl: 'https://picsum.photos/seed/michael/80/80',
    isVerified: false,
    specialization: 'Language Learning Expert',
    nationalityCode: 'CN',
    currentSessionFee: 30.00,
    currency: 'USD',
    averageRating: 4.7,
    reviewCount: 22,
    languages: ['English', 'Mandarin', 'Japanese'],
    categoryIds: ['550e8400-e29b-41d4-a716-446655440002'],
    teachesInGroups: true,
    maxGroupMembers: 10,
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    videoThumbnailUrl: 'https://picsum.photos/seed/video5/400/225',
    bio: 'Native speaker with extensive experience teaching multiple languages. I specialize in immersive language learning techniques that help students achieve fluency quickly and naturally. My teaching philosophy emphasizes cultural understanding alongside linguistic proficiency.',
    studentCount: 156,
    sessionDurationMinutes: 45,
    bookedSessionsCount: 312
  }
];

export const tutorService = {
  searchTutors: async (filters: TutorSearchFilters): Promise<ApiResponse<PaginatedResponse<Tutor>>> => {
    try {
      const response = await apiService.post<PaginatedResponse<Tutor>>('/tutors/search', filters);
      return {
        status: response.status,
        success: response.success,
        message: response.message,
        data: response.data
      };
    } catch (error) {
      console.warn('Failed to search tutors from API, using mock data:', error);
      
      // Simple filtering logic for mock data
      let filtered = [...mockTutors];
      
      if (filters.minFee !== undefined || filters.maxFee !== undefined) {
        filtered = filtered.filter(tutor => {
          const fee = tutor.currentSessionFee;
          const minOk = filters.minFee === undefined || fee >= filters.minFee;
          const maxOk = filters.maxFee === undefined || fee <= filters.maxFee;
          return minOk && maxOk;
        });
      }
      
      if (filters.keyword) {
        const keyword = filters.keyword.toLowerCase();
        filtered = filtered.filter(tutor => 
          tutor.name.toLowerCase().includes(keyword) ||
          tutor.specialization.toLowerCase().includes(keyword) ||
          tutor.bio.toLowerCase().includes(keyword)
        );
      }
      
      // Pagination logic (Java Page<T> standard)
      const pageNumber = (filters.page || 1) - 1; // Convert to 0-based indexing
      const pageSize = filters.limit || 10;
      const totalElements = filtered.length;
      const totalPages = Math.ceil(totalElements / pageSize);
      const offset = pageNumber * pageSize;
      const startIndex = offset;
      const endIndex = startIndex + pageSize;
      const content = filtered.slice(startIndex, endIndex);
      
      return {
        status: 200,
        success: true,
        message: 'Tutors retrieved successfully (mock data)',
        data: {
          content, // Array of tutors
          pageable: {
            pageNumber, // 0-based page number
            pageSize,
            offset,
            paged: true
          },
          totalPages,
          totalElements,
          last: pageNumber === totalPages - 1,
          first: pageNumber === 0,
          numberOfElements: content.length,
          size: pageSize,
          number: pageNumber, // 0-based page number
          empty: content.length === 0
        }
      };
    }
  },

  getFilterData: async (): Promise<ApiResponse<FilterData>> => {
    try {
      return await apiService.get<FilterData>('/v1/common/tutor-filter');
    } catch (error) {
      console.warn('Failed to fetch filter data from API, using mock data:', error);
      return {
        status: 200,
        success: true,
        message: 'Filter data retrieved successfully (mock data)',
        data: {
          timezones: mockTimezones,
          languages: mockLanguages,
          categories: mockCategories
        }
      };
    }
  },

  getSubcategories: async (categoryId?: string): Promise<ApiResponse<Subcategory[]>> => {
    try {
      const url = categoryId ? `/subcategories?categoryId=${categoryId}` : '/subcategories';
      return await apiService.get<Subcategory[]>(url);
    } catch (error) {
      console.warn('Failed to fetch subcategories from API, using mock data:', error);
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
