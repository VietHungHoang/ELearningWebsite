import apiService from './apiService';
import type { Student, ApiResponse, PaginatedResponse } from '../types/api';

const mockStudents: Student[] = [
  { id: '550e8400-e29b-41d4-a716-446655440000', name: 'Sarah Chapman', avatarUrl: 'https://picsum.photos/seed/sarah/48/48', registeredDate: 'Oct 15, 2025', email: 'sarah.c@example.com', enrollmentTypes: ['1-on-1', 'Trial'], status: 'Ongoing' },
  { id: '550e8400-e29b-41d4-a716-446655440001', name: 'Ann Coleman', avatarUrl: 'https://picsum.photos/seed/ann/48/48', registeredDate: 'Oct 12, 2025', email: 'ann.co@example.com', enrollmentTypes: ['Group'], status: 'Ongoing' },
  { id: '550e8400-e29b-41d4-a716-446655440002', name: 'Judy Dixon', avatarUrl: 'https://picsum.photos/seed/judy/48/48', registeredDate: 'Oct 10, 2025', email: 'judy.d@example.com', enrollmentTypes: ['Trial'], status: 'Completed' },
  { id: '550e8400-e29b-41d4-a716-446655440003', name: 'Michael Brown', avatarUrl: 'https://picsum.photos/seed/michael/48/48', registeredDate: 'Oct 08, 2025', email: 'michael.b@example.com', enrollmentTypes: ['Group', '1-on-1'], status: 'Ongoing' },
  { id: '550e8400-e29b-41d4-a716-446655440004', name: 'Jessica Miller', avatarUrl: 'https://picsum.photos/seed/jessica/48/48', registeredDate: 'Oct 05, 2025', email: 'jessica.m@example.com', enrollmentTypes: ['Trial'], status: 'Completed' },
  { id: '550e8400-e29b-41d4-a716-446655440005', name: 'David Wilson', avatarUrl: 'https://picsum.photos/seed/david/48/48', registeredDate: 'Oct 01, 2025', email: 'david.w@example.com', enrollmentTypes: ['1-on-1'], status: 'Ongoing' },
  { id: '550e8400-e29b-41d4-a716-446655440006', name: 'Emma Davis', avatarUrl: 'https://picsum.photos/seed/emma/48/48', registeredDate: 'Sep 28, 2025', email: 'emma.d@example.com', enrollmentTypes: ['Group', 'Trial'], status: 'Ongoing' },
  { id: '550e8400-e29b-41d4-a716-446655440007', name: 'James Garcia', avatarUrl: 'https://picsum.photos/seed/james/48/48', registeredDate: 'Sep 25, 2025', email: 'james.g@example.com', enrollmentTypes: ['1-on-1'], status: 'Completed' },
  { id: '550e8400-e29b-41d4-a716-446655440008', name: 'Olivia Martinez', avatarUrl: 'https://picsum.photos/seed/olivia/48/48', registeredDate: 'Sep 22, 2025', email: 'olivia.m@example.com', enrollmentTypes: ['Trial'], status: 'Ongoing' },
  { id: '550e8400-e29b-41d4-a716-446655440009', name: 'William Rodriguez', avatarUrl: 'https://picsum.photos/seed/william/48/48', registeredDate: 'Sep 20, 2025', email: 'william.r@example.com', enrollmentTypes: ['Group'], status: 'Ongoing' },
  { id: '550e8400-e29b-41d4-a716-446655440010', name: 'Sophia Lopez', avatarUrl: 'https://picsum.photos/seed/sophia/48/48', registeredDate: 'Sep 18, 2025', email: 'sophia.l@example.com', enrollmentTypes: ['1-on-1', 'Group'], status: 'Ongoing' },
  { id: '550e8400-e29b-41d4-a716-446655440011', name: 'Benjamin Gonzalez', avatarUrl: 'https://picsum.photos/seed/benjamin/48/48', registeredDate: 'Sep 15, 2025', email: 'benjamin.g@example.com', enrollmentTypes: ['Trial'], status: 'Completed' },
];

export interface StudentFilters {
  status?: 'Ongoing' | 'Completed';
  enrollmentType?: '1-on-1' | 'Group' | 'Trial';
  search?: string;
  page?: number;
  limit?: number;
}

export const studentService = {
  getStudentsByTutorId: async (tutorId: string, filters?: StudentFilters): Promise<ApiResponse<PaginatedResponse<Student>>> => {
    try {
      const queryParams = new URLSearchParams();

      if (filters?.status) queryParams.append('status', filters.status);
      if (filters?.enrollmentType) queryParams.append('enrollmentType', filters.enrollmentType);
      if (filters?.search) queryParams.append('search', filters.search);
      if (filters?.page) queryParams.append('page', filters.page.toString());
      if (filters?.limit) queryParams.append('limit', filters.limit.toString());

      const url = `/tutors/${tutorId}/students${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await apiService.get<PaginatedResponse<Student>>(url);

      return {
        status: response.status,
        success: response.success,
        message: response.message,
        data: response.data
      };
    } catch (error) {
      console.warn('Failed to fetch students from API, using mock data:', error);

      // Apply filters to mock data
      let filtered = [...mockStudents];

      if (filters?.status) {
        filtered = filtered.filter(student => student.status === filters.status);
      }

      if (filters?.enrollmentType) {
        filtered = filtered.filter(student =>
          student.enrollmentTypes.includes(filters.enrollmentType!)
        );
      }

      if (filters?.search) {
        const searchTerm = filters.search.toLowerCase();
        filtered = filtered.filter(student =>
          student.name.toLowerCase().includes(searchTerm) ||
          student.email.toLowerCase().includes(searchTerm)
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
        message: 'Students retrieved successfully (mock data)',
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

  getStudentById: async (tutorId: string, studentId: string): Promise<ApiResponse<Student>> => {
    try {
      const response = await apiService.get<Student>(`/tutors/${tutorId}/students/${studentId}`);
      return {
        status: response.status,
        success: response.success,
        message: response.message,
        data: response.data
      };
    } catch (error) {
      console.warn('Failed to fetch student from API, using mock data:', error);
      const student = mockStudents.find(s => s.id === studentId);

      if (!student) {
        return {
          status: 404,
          success: false,
          message: 'Student not found',
          data: null as any
        };
      }

      return {
        status: 200,
        success: true,
        message: 'Student retrieved successfully (mock data)',
        data: student
      };
    }
  },

  getStudentDetail: async (tutorId: string, studentId: string): Promise<ApiResponse<import('../types/api').StudentDetail>> => {
    try {
      const response = await apiService.get<import('../types/api').StudentDetail>(`/tutors/${tutorId}/students/${studentId}/detail`);
      return {
        status: response.status,
        success: response.success,
        message: response.message,
        data: response.data
      };
    } catch (error) {
      console.warn('Failed to fetch student detail from API, using mock data:', error);
      const student = mockStudents.find(s => s.id === studentId);

      if (!student) {
        return {
          status: 404,
          success: false,
          message: 'Student not found',
          data: null as any
        };
      }

      // Mock detailed data extending the basic student info
      const mockDetail: import('../types/api').StudentDetail = {
        ...student,
        stats: {
          sessionsCompleted: 8,
          totalSessions: 10,
          sessionsRemaining: 2,
          completionRate: 80,
          attendanceRate: 95,
          lastSessionDate: '2025-11-18',
        },
        contact: {
          phone: '+84 912 345 678',
          joinedDate: student.registeredDate,
        },
        class: {
          name: 'Math Advanced A1',
          instructor: 'You',
          schedule: 'Mon, Wed, Fri - 3:00 PM',
        },
        payment: {
          status: 'Paid',
          nextDueDate: '2025-12-01',
          totalPaid: '$240',
        },
        upcomingSessions: [
          { id: '550e8400-e29b-41d4-a716-446655440020', date: '2025-11-22', time: '15:00', duration: '60 min', topic: 'Calculus Introduction' },
          { id: '550e8400-e29b-41d4-a716-446655440021', date: '2025-11-24', time: '15:00', duration: '60 min', topic: 'Derivatives Practice' },
          { id: '550e8400-e29b-41d4-a716-446655440022', date: '2025-11-26', time: '15:00', duration: '60 min', topic: 'Integration Basics' },
        ],
        sessionHistory: [
          { id: '550e8400-e29b-41d4-a716-446655440030', date: '2025-11-18', duration: '60 min', attendance: 'Present', topic: 'Quadratic Equations' },
          { id: '550e8400-e29b-41d4-a716-446655440031', date: '2025-11-15', duration: '60 min', attendance: 'Present', topic: 'Linear Functions' },
          { id: '550e8400-e29b-41d4-a716-446655440032', date: '2025-11-13', duration: '60 min', attendance: 'Late (10 min)', topic: 'Polynomials' },
          { id: '550e8400-e29b-41d4-a716-446655440033', date: '2025-11-11', duration: '60 min', attendance: 'Present', topic: 'Factoring Review' },
        ],
        courses: [
          { title: 'Advanced Mathematics', progress: 75, type: '1-on-1' },
          { title: 'Physics Workshop', progress: 60, type: 'Group' },
          { title: 'Chemistry Fundamentals', progress: 90, type: 'Trial' },
        ],
        performance: {
          testScores: [85, 92, 88, 95, 90],
          homeworkCompletion: 95,
          averageScore: 90,
        },
        strengths: ['Problem Solving', 'Quick Learner', 'Consistent Attendance'],
        weaknesses: ['Needs more practice with word problems'],
        communications: [
          { id: '550e8400-e29b-41d4-a716-446655440040', date: '2025-11-19', type: 'Message', content: 'Discussed upcoming exam preparation' },
          { id: '550e8400-e29b-41d4-a716-446655440041', date: '2025-11-10', type: 'Email', content: 'Sent homework assignment guidelines' },
          { id: '550e8400-e29b-41d4-a716-446655440042', date: '2025-11-05', type: 'Message', content: 'Scheduled extra tutoring session' },
        ],
        tutorNotes: 'Great progress this month! Very engaged in class discussions.'
      };

      return {
        status: 200,
        success: true,
        message: 'Student detail retrieved successfully (mock data)',
        data: mockDetail
      };
    }
  }
};