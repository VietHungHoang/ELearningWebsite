import apiService from './apiService';
import type { 
  ApiResponse,
  ScheduleViewMode,
  TutorAvailability,
  GetAvailabilityRequest,
  GetAvailabilityResponse,
  BulkUpdateAvailabilityRequest,
  BulkUpdateAvailabilityResponse,
  BookedSession,
  GetBookedSessionsRequest,
  GetBookedSessionsResponse
} from '../types/api';

/**
 * Get current timezone offset in minutes
 * Returns negative value for timezones ahead of UTC (e.g., -420 for GMT+7)
 * 
 * Examples:
 * - GMT+7 (Vietnam): -420
 * - GMT-5 (US Eastern): 300
 * - GMT+0 (UTC): 0
 */
export const getTimezoneOffset = (): number => {
  return new Date().getTimezoneOffset();
};

/**
 * Calculate date range for prefetching based on view mode
 * 
 * Strategy:
 * - Daily view: Fetch 3 days before + current day + 3 days after = 7 days
 * - Weekly view: Fetch 1 week before + current week + 1 week after = 3 weeks
 * - Monthly view: Fetch current month + next month = 2 months
 */
export const calculatePrefetchRange = (
  currentDate: Date, 
  viewMode: ScheduleViewMode
): { startDate: string; endDate: string } => {
  const start = new Date(currentDate);
  const end = new Date(currentDate);
  
  switch (viewMode) {
    case 'daily':
      // 3 days before, 3 days after
      start.setDate(start.getDate() - 3);
      end.setDate(end.getDate() + 3);
      break;
      
    case 'weekly':
      // 1 week before, 1 week after (total 3 weeks)
      start.setDate(start.getDate() - 7);
      end.setDate(end.getDate() + 14);
      break;
      
    case 'monthly':
      // Current month + next month
      start.setDate(1); // First day of current month
      end.setMonth(end.getMonth() + 2);
      end.setDate(0); // Last day of next month
      break;
  }
  
  return {
    startDate: start.toISOString().split('T')[0],
    endDate: end.toISOString().split('T')[0]
  };
};

// Mock data for development - recurring patterns
const mockAvailabilities: TutorAvailability[] = [
  {
    id: '550e8400-e29b-41d4-a716-446655440001',
    dayOfWeek: 1, // Monday
    startTime: '09:00',
    endTime: '12:00',
    effectiveStartDate: '2025-01-01',
    effectiveEndDate: undefined,
    status: 'AVAILABLE'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440002',
    dayOfWeek: 1, // Monday
    startTime: '14:00',
    endTime: '17:00',
    effectiveStartDate: '2025-01-01',
    effectiveEndDate: undefined,
    status: 'AVAILABLE'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440003',
    dayOfWeek: 3, // Wednesday
    startTime: '09:00',
    endTime: '17:00',
    effectiveStartDate: '2025-01-01',
    effectiveEndDate: undefined,
    status: 'AVAILABLE'
  }
];

// Mock booked sessions data
const mockBookedSessions: BookedSession[] = [
  {
    id: '650e8400-e29b-41d4-a716-446655440001',
    studentId: 'student-uuid-001',
    studentName: 'Sarah Chapman',
    studentAvatarUrl: 'https://picsum.photos/seed/sarah/48/48',
    sessionDatetime: '2025-11-24T09:00:00.000Z', // Monday Nov 24, 9 AM
    durationMinutes: 60,
    className: 'Mathematics Advanced',
    sessionType: '1-on-1',
    status: 'BOOKED',
    meetingUrl: 'https://zoom.us/j/123456789',
    notes: 'Review calculus topics',
    bookedAt: '2025-11-20T10:30:00.000Z',
    updatedAt: '2025-11-20T10:30:00.000Z'
  },
  {
    id: '650e8400-e29b-41d4-a716-446655440002',
    studentId: 'student-uuid-002',
    studentName: 'Ann Coleman',
    studentAvatarUrl: 'https://picsum.photos/seed/ann/48/48',
    sessionDatetime: '2025-11-24T14:00:00.000Z', // Monday Nov 24, 2 PM
    durationMinutes: 90,
    className: 'Physics Fundamentals',
    sessionType: '1-on-1',
    status: 'BOOKED',
    meetingUrl: 'https://meet.google.com/abc-defg-hij',
    notes: 'Lab work on optics',
    bookedAt: '2025-11-21T15:20:00.000Z',
    updatedAt: '2025-11-21T15:20:00.000Z'
  },
  {
    id: '650e8400-e29b-41d4-a716-446655440003',
    studentId: 'student-uuid-003',
    studentName: 'Judy Dixon',
    studentAvatarUrl: 'https://picsum.photos/seed/judy/48/48',
    sessionDatetime: '2025-11-26T10:00:00.000Z', // Wednesday Nov 26, 10 AM
    durationMinutes: 60,
    className: 'English Conversation',
    sessionType: 'Trial',
    status: 'PENDING',
    notes: 'First trial session',
    bookedAt: '2025-11-22T08:00:00.000Z',
    updatedAt: '2025-11-22T08:00:00.000Z'
  },
  {
    id: '650e8400-e29b-41d4-a716-446655440004',
    studentId: 'student-uuid-004',
    studentName: 'Michael Brown',
    studentAvatarUrl: 'https://picsum.photos/seed/michael/48/48',
    sessionDatetime: '2025-11-20T09:00:00.000Z', // Past session - Nov 20
    durationMinutes: 60,
    className: 'Chemistry Organic',
    sessionType: '1-on-1',
    status: 'CANCELLED',
    notes: 'Session was cancelled',
    bookedAt: '2025-11-18T12:00:00.000Z',
    updatedAt: '2025-11-20T10:00:00.000Z'
  }
];

export const scheduleService = {
  /**
   * Get tutor availability patterns
   * Backend returns recurring patterns, frontend generates actual time slots for display
   */
  getAvailability: async (
    request: GetAvailabilityRequest
  ): Promise<ApiResponse<GetAvailabilityResponse>> => {
    try {
      const params = new URLSearchParams({
        startDate: request.startDate,
        endDate: request.endDate
        // timezoneOffset removed - all times are UTC
      });
      
      return await apiService.get<GetAvailabilityResponse>(
        `/api/v1/tutors/${request.tutorId}/availability?${params.toString()}`
      );
    } catch (error) {
      console.warn('Failed to fetch availability from API, using mock data:', error);
      
      return {
        status: 200,
        success: true,
        message: 'Availability retrieved successfully',
        data: {
          availabilities: mockAvailabilities
        }
      };
    }
  },

  /**
   * Bulk update availability - ONLY ONE API CALL
   * - mode='this_period': Create temporary exceptions for this week/month only
   * - mode='recurring': Update recurring patterns (affects all future weeks/months)
   * 
   * Backend will handle:
   * - Delete availabilities with IDs in oldAvailabilityIds
   * - Insert new availabilities from newAvailabilities
   * - Manage exceptions if mode='this_period'
   */
  bulkUpdateAvailability: async (
    request: BulkUpdateAvailabilityRequest
  ): Promise<ApiResponse<BulkUpdateAvailabilityResponse>> => {
    try {
      return await apiService.post<BulkUpdateAvailabilityResponse>(
        `/api/v1/tutors/${request.tutorId}/availability/bulk`,
        request
      );
    } catch (error) {
      console.warn('Failed to bulk update availability from API, simulating success:', error);
      
      // Mock: Generate IDs for new availabilities
      const availabilitiesWithIds = request.newAvailabilities.map((availability, index) => ({
        ...availability,
        id: `550e8400-e29b-41d4-a716-${Date.now()}-${index}`
      }));
      
      return {
        status: 200,
        success: true,
        message: `Availability updated successfully (${request.mode})`,
        data: {
          availabilities: availabilitiesWithIds,
          message: `Updated ${request.newAvailabilities.length} availability patterns`
        }
      };
    }
  },

  /**
   * Get booked sessions for a date range
   * Returns actual sessions that students have booked with the tutor
   * 
   * This is separate from availability patterns - availability shows WHEN tutor is free,
   * booked sessions show WHICH slots are already taken by students
   */
  getBookedSessions: async (
    request: GetBookedSessionsRequest
  ): Promise<ApiResponse<GetBookedSessionsResponse>> => {
    try {
      const params = new URLSearchParams({
        startDate: request.startDate,
        endDate: request.endDate
        // timezoneOffset removed - all times are UTC
      });
      
      // Add status filter if provided
      if (request.statuses && request.statuses.length > 0) {
        params.append('statuses', request.statuses.join(','));
      }
      
      return await apiService.get<GetBookedSessionsResponse>(
        `/api/v1/tutors/${request.tutorId}/sessions/booked?${params.toString()}`
      );
    } catch (error) {
      console.warn('Failed to fetch booked sessions from API, using mock data:', error);
      
      // Filter mock data by date range and status
      const startDate = new Date(request.startDate);
      const endDate = new Date(request.endDate);
      
      let filteredSessions = mockBookedSessions.filter(session => {
        const sessionDate = new Date(session.sessionDatetime);
        return sessionDate >= startDate && sessionDate <= endDate;
      });
      
      // Filter by status if provided
      if (request.statuses && request.statuses.length > 0) {
        filteredSessions = filteredSessions.filter(session => 
          request.statuses!.includes(session.status)
        );
      }
      
      return {
        status: 200,
        success: true,
        message: 'Booked sessions retrieved successfully',
        data: {
          sessions: filteredSessions
        }
      };
    }
  }
};

export default scheduleService;
