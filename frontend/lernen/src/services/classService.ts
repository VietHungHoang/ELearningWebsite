import apiService from './apiService';
import type { Class, ClassDetail, ApiResponse, PaginatedResponse } from '../types/api';

const mockClasses: Class[] = [
  {
    id: '550e8400-e29b-41d4-a716-446655440100',
    courseTitle: 'Advanced Calculus II: A Deep Dive into Multivariable Functions and Vector Analysis',
    students: [{ id: '550e8400-e29b-41d4-a716-446655440000', name: 'Sarah Chapman', avatar: 'https://picsum.photos/seed/sarah/48/48' }],
    type: '1-on-1',
    status: 'Ongoing',
    schedules: [
      { day: 'Monday', time: '10:00 AM' },
      { day: 'Wednesday', time: '2:00 PM' }
    ],
    startDate: 'Oct 1, 2025',
    completedSessions: 8,
    totalSessions: 12,
    quizzes: [
      { id: '550e8400-e29b-41d4-a716-446655440200', title: 'Mid-term Exam', status: 'Completed' },
      { id: '550e8400-e29b-41d4-a716-446655440201', title: 'Final Exam', status: 'Pending' }
    ],
    materials: [
      { id: '550e8400-e29b-41d4-a716-446655440300', name: 'Chapter_3_Notes.pdf', type: 'PDF', date: '2025-10-15' },
      { id: '550e8400-e29b-41d4-a716-446655440301', name: 'Lecture_Recording_W4.mp4', type: 'Video', date: '2025-10-22' }
    ]
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440101',
    courseTitle: 'Intro to Creative Writing',
    students: [
      { id: '550e8400-e29b-41d4-a716-446655440001', name: 'Ann Coleman', avatar: 'https://picsum.photos/seed/ann/48/48' },
      { id: '550e8400-e29b-41d4-a716-446655440002', name: 'Judy Dixon', avatar: 'https://picsum.photos/seed/judy/48/48' },
      { id: '550e8400-e29b-41d4-a716-446655440003', name: 'Michael Brown', avatar: 'https://picsum.photos/seed/michael/48/48' },
    ],
    type: 'Group',
    status: 'Ongoing',
    schedules: [
      { day: 'Wednesday', time: '02:00 PM' },
      { day: 'Friday', time: '10:00 AM' }
    ],
    startDate: 'Sep 15, 2025',
    completedSessions: 6,
    totalSessions: 10,
    quizzes: [],
    materials: [{ id: '550e8400-e29b-41d4-a716-446655440302', name: 'Project_Brief.pdf', type: 'PDF', date: '2025-10-10' }]
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440102',
    courseTitle: 'Physics 101 Review',
    students: [{ id: '550e8400-e29b-41d4-a716-446655440004', name: 'David Wilson', avatar: 'https://picsum.photos/seed/david/48/48' }],
    type: '1-on-1',
    status: 'Completed',
    schedules: [
      { day: 'Friday', time: '04:00 PM' },
      { day: 'Saturday', time: '11:00 AM' }
    ],
    startDate: 'Aug 20, 2025',
    completedSessions: 15,
    totalSessions: 15,
    quizzes: [{ id: '550e8400-e29b-41d4-a716-446655440203', title: 'Final Physics Quiz', status: 'Completed' }],
    materials: []
  },
];

export interface ClassFilters {
  status?: 'Ongoing' | 'Completed';
  type?: '1-on-1' | 'Group';
  search?: string;
  page?: number;
  limit?: number;
}

export const classService = {
  getClassesByTutorId: async (tutorId: string, filters?: ClassFilters): Promise<ApiResponse<PaginatedResponse<Class>>> => {
    try {
      const queryParams = new URLSearchParams();

      if (filters?.status) queryParams.append('status', filters.status);
      if (filters?.type) queryParams.append('type', filters.type);
      if (filters?.search) queryParams.append('search', filters.search);
      if (filters?.page) queryParams.append('page', filters.page.toString());
      if (filters?.limit) queryParams.append('limit', filters.limit.toString());

      const url = `/tutors/${tutorId}/classes${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await apiService.get<PaginatedResponse<Class>>(url);

      return {
        status: response.status,
        success: response.success,
        message: response.message,
        data: response.data
      };
    } catch (error) {
      console.warn('Failed to fetch classes from API, using mock data:', error);

      // Apply filters to mock data
      let filtered = [...mockClasses];

      if (filters?.status) {
        filtered = filtered.filter(classItem => classItem.status === filters.status);
      }

      if (filters?.type) {
        filtered = filtered.filter(classItem => classItem.type === filters.type);
      }

      if (filters?.search) {
        const searchTerm = filters.search.toLowerCase();
        filtered = filtered.filter(classItem =>
          classItem.courseTitle.toLowerCase().includes(searchTerm) ||
          classItem.students.some(student => student.name.toLowerCase().includes(searchTerm))
        );
      }

      // Pagination logic
      const pageNumber = (filters?.page || 1) - 1; // Convert to 0-based indexing
      const pageSize = filters?.limit || 10;
      const totalElements = filtered.length;
      const totalPages = Math.ceil(totalElements / pageSize);
      const offset = pageNumber * pageSize;
      const startIndex = offset;
      const endIndex = startIndex + pageSize;
      const content = filtered.slice(startIndex, endIndex);

      return {
        status: 200,
        success: true,
        message: 'Classes retrieved successfully (mock data)',
        data: {
          content,
          pageable: {
            pageNumber,
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
          number: pageNumber,
          empty: content.length === 0
        }
      };
    }
  },

  getClassById: async (tutorId: string, classId: string): Promise<ApiResponse<Class>> => {
    try {
      const response = await apiService.get<Class>(`/tutors/${tutorId}/classes/${classId}`);
      return {
        status: response.status,
        success: response.success,
        message: response.message,
        data: response.data
      };
    } catch (error) {
      console.warn('Failed to fetch class from API, using mock data:', error);
      const classItem = mockClasses.find(c => c.id === classId);

      if (!classItem) {
        return {
          status: 404,
          success: false,
          message: 'Class not found',
          data: null as any
        };
      }

      return {
        status: 200,
        success: true,
        message: 'Class retrieved successfully (mock data)',
        data: classItem
      };
    }
  },

  getClassDetail: async (tutorId: string, classId: string): Promise<ApiResponse<ClassDetail>> => {
    try {
      const response = await apiService.get<ClassDetail>(`/tutors/${tutorId}/classes/${classId}/detail`);
      return {
        status: response.status,
        success: response.success,
        message: response.message,
        data: response.data
      };
    } catch (error) {
      console.warn('Failed to fetch class detail from API, using mock data:', error);
      const classItem = mockClasses.find(c => c.id === classId);

      if (!classItem) {
        return {
          status: 404,
          success: false,
          message: 'Class not found',
          data: null as any
        };
      }

      // Mock detailed data extending the basic class info
      const mockDetail: ClassDetail = {
        ...classItem,
        stats: {
          totalStudents: classItem.students.length,
          activeStudents: classItem.students.length,
          completedSessions: classItem.completedSessions,
          totalSessions: classItem.totalSessions,
          averageAttendance: 95,
          averageProgress: 75
        },
        sessions: [
          {
            id: '550e8400-e29b-41d4-a716-446655440400',
            date: '2025-11-18',
            time: '10:00 AM',
            duration: '60 min',
            topic: 'Quadratic Equations',
            attendance: classItem.students.map(student => ({
              studentId: student.id,
              status: 'Present' as const
            })),
            materials: classItem.materials.slice(0, 1)
          },
          {
            id: '550e8400-e29b-41d4-a716-446655440401',
            date: '2025-11-15',
            time: '2:00 PM',
            duration: '60 min',
            topic: 'Linear Functions',
            attendance: classItem.students.map(student => ({
              studentId: student.id,
              status: 'Present' as const
            })),
            materials: []
          }
        ],
        announcements: [
          {
            id: '550e8400-e29b-41d4-a716-446655440500',
            title: 'Upcoming Quiz',
            content: 'Please prepare for the upcoming quiz on multivariable functions.',
            date: '2025-11-10',
            author: 'Tutor'
          }
        ],
        assignments: [
          {
            id: '550e8400-e29b-41d4-a716-446655440600',
            title: 'Homework 3',
            description: 'Complete exercises 1-10 from chapter 3',
            dueDate: '2025-11-25',
            submissions: classItem.students.length - 1
          }
        ]
      };

      return {
        status: 200,
        success: true,
        message: 'Class detail retrieved successfully (mock data)',
        data: mockDetail
      };
    }
  }
};