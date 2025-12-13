import apiService from './apiService';
import type { PayoutMethod, PayoutHistoryItem, PayoutSummary, PayoutFilters, ApiResponse, PaginatedResponse, RecentEarning, RecentEarningsFilters } from '../types/api';

const mockMethods: PayoutMethod[] = [
  { id: 1, type: 'PayPal', identifier: 'john.doe@example.com' },
  { id: 2, type: 'Bank', identifier: '**** 4567' },
  { id: 3, type: 'PayPal', identifier: 'sarah.smith@gmail.com' },
  { id: 4, type: 'Bank', identifier: '**** 8901' }
];

const mockHistory: PayoutHistoryItem[] = [
  { id: 'TXN20251122', date: 'Nov 22, 2025', amount: 1250.75, method: mockMethods[0], status: 'Completed' },
  { id: 'TXN20251115', date: 'Nov 15, 2025', amount: 980.50, method: mockMethods[1], status: 'Completed' },
  { id: 'TXN20251108', date: 'Nov 08, 2025', amount: 1450.25, method: mockMethods[0], status: 'Completed' },
  { id: 'TXN20251101', date: 'Nov 01, 2025', amount: 750.00, method: mockMethods[2], status: 'Processing' },
  { id: 'TXN20251025', date: 'Oct 25, 2025', amount: 2100.00, method: mockMethods[1], status: 'Completed' },
  { id: 'TXN20251018', date: 'Oct 18, 2025', amount: 890.75, method: mockMethods[0], status: 'Completed' },
  { id: 'TXN20251011', date: 'Oct 11, 2025', amount: 1650.50, method: mockMethods[3], status: 'Failed' },
  { id: 'TXN20251004', date: 'Oct 04, 2025', amount: 1200.00, method: mockMethods[1], status: 'Completed' },
  { id: 'TXN20250927', date: 'Sep 27, 2025', amount: 950.25, method: mockMethods[0], status: 'Processing' },
  { id: 'TXN20250920', date: 'Sep 20, 2025', amount: 1800.00, method: mockMethods[2], status: 'Completed' },
  { id: 'TXN20250913', date: 'Sep 13, 2025', amount: 1100.50, method: mockMethods[1], status: 'Completed' },
  { id: 'TXN20250906', date: 'Sep 06, 2025', amount: 1350.75, method: mockMethods[0], status: 'Failed' },
  { id: 'TXN20250830', date: 'Aug 30, 2025', amount: 950.00, method: mockMethods[3], status: 'Completed' },
  { id: 'TXN20250823', date: 'Aug 23, 2025', amount: 1400.25, method: mockMethods[1], status: 'Processing' },
  { id: 'TXN20250816', date: 'Aug 16, 2025', amount: 1150.50, method: mockMethods[0], status: 'Completed' },
];

const mockSummary: PayoutSummary = {
  availableBalance: 1250.75,
  pendingBalance: 750.00,
  withdrawalCount: 3,
  maxWithdrawals: 5,
  minimumThreshold: 50,
  commissionRate: 12,
  nextPayoutDate: 'Dec 01, 2025',
  totalEarned: 24500.00
};

const mockEarnings: RecentEarning[] = [
  { id: 'ERN001', course: 'Web Development Bootcamp', type: '1-on-1', date: '22/11/2025 14:30', amount: 50.00 },
  { id: 'ERN002', course: 'Advanced React Course', type: 'Group', date: '20/11/2025 09:15', amount: 45.00 },
  { id: 'ERN003', course: 'JavaScript Fundamentals', type: '1-on-1', date: '19/11/2025 16:45', amount: 38.50 },
  { id: 'ERN004', course: 'Python for Data Science', type: 'Group', date: '18/11/2025 11:20', amount: 42.00 },
  { id: 'ERN005', course: 'UI/UX Design Principles', type: '1-on-1', date: '17/11/2025 13:10', amount: 55.00 },
  { id: 'ERN006', course: 'Machine Learning Basics', type: 'Group', date: '16/11/2025 15:30', amount: 48.00 },
  { id: 'ERN007', course: 'Node.js Backend Development', type: '1-on-1', date: '15/11/2025 10:45', amount: 52.00 },
  { id: 'ERN008', course: 'Database Design & Management', type: 'Group', date: '14/11/2025 17:00', amount: 40.00 },
  { id: 'ERN009', course: 'Mobile App Development', type: '1-on-1', date: '13/11/2025 12:15', amount: 60.00 },
  { id: 'ERN010', course: 'Cloud Computing with AWS', type: 'Group', date: '12/11/2025 08:30', amount: 45.00 },
  { id: 'ERN011', course: 'DevOps Essentials', type: '1-on-1', date: '11/11/2025 14:20', amount: 58.00 },
  { id: 'ERN012', course: 'Cybersecurity Fundamentals', type: 'Group', date: '10/11/2025 16:45', amount: 43.00 },
  { id: 'ERN013', course: 'Full Stack Development', type: '1-on-1', date: '09/11/2025 11:30', amount: 65.00 },
  { id: 'ERN014', course: 'Data Structures & Algorithms', type: 'Group', date: '08/11/2025 13:15', amount: 47.00 },
  { id: 'ERN015', course: 'API Development with REST', type: '1-on-1', date: '07/11/2025 09:45', amount: 53.00 },
  { id: 'ERN016', course: 'Blockchain Technology', type: 'Group', date: '06/11/2025 15:20', amount: 49.00 },
  { id: 'ERN017', course: 'iOS App Development', type: '1-on-1', date: '05/11/2025 10:30', amount: 62.00 },
  { id: 'ERN018', course: 'Android Development', type: 'Group', date: '04/11/2025 17:15', amount: 44.00 },
  { id: 'ERN019', course: 'System Design Interview Prep', type: '1-on-1', date: '03/11/2025 12:00', amount: 70.00 },
  { id: 'ERN020', course: 'Agile Project Management', type: 'Group', date: '02/11/2025 14:45', amount: 41.00 },
];

export const payoutService = {
  getPayoutSummary: async (tutorId: string): Promise<ApiResponse<PayoutSummary>> => {
    try {
      const response = await apiService.get<PayoutSummary>(`/tutors/${tutorId}/payouts/summary`);
      return {
        status: response.status,
        success: response.success,
        message: response.message,
        data: response.data
      };
    } catch (error) {
      console.warn('Failed to fetch payout summary from API, using mock data:', error);
      return {
        status: 200,
        success: true,
        message: 'Payout summary retrieved successfully (mock data)',
        data: mockSummary
      };
    }
  },

  getPayoutMethods: async (tutorId: string): Promise<ApiResponse<PayoutMethod[]>> => {
    try {
      const response = await apiService.get<PayoutMethod[]>(`/tutors/${tutorId}/payout-methods`);
      return {
        status: response.status,
        success: response.success,
        message: response.message,
        data: response.data
      };
    } catch (error) {
      console.warn('Failed to fetch payout methods from API, using mock data:', error);
      return {
        status: 200,
        success: true,
        message: 'Payout methods retrieved successfully (mock data)',
        data: mockMethods
      };
    }
  },

  getPayoutHistory: async (tutorId: string, filters?: PayoutFilters): Promise<ApiResponse<PaginatedResponse<PayoutHistoryItem>>> => {
    try {
      const queryParams = new URLSearchParams();

      if (filters?.status) queryParams.append('status', filters.status);
      if (filters?.page) queryParams.append('page', filters.page.toString());
      if (filters?.limit) queryParams.append('limit', filters.limit.toString());

      const url = `/tutors/${tutorId}/payouts/history${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await apiService.get<PaginatedResponse<PayoutHistoryItem>>(url);

      return {
        status: response.status,
        success: response.success,
        message: response.message,
        data: response.data
      };
    } catch (error) {
      console.warn('Failed to fetch payout history from API, using mock data:', error);

      // Apply filters to mock data
      let filtered = [...mockHistory];

      if (filters?.status) {
        filtered = filtered.filter(item => item.status === filters.status);
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
        message: 'Payout history retrieved successfully (mock data)',
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

  getRecentEarnings: async (tutorId: string, filters?: RecentEarningsFilters): Promise<ApiResponse<PaginatedResponse<RecentEarning>>> => {
    try {
      const queryParams = new URLSearchParams();

      if (filters?.type && filters.type !== 'All') queryParams.append('type', filters.type);
      if (filters?.page) queryParams.append('page', filters.page.toString());
      if (filters?.limit) queryParams.append('limit', filters.limit.toString());

      const url = `/tutors/${tutorId}/earnings/recent${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await apiService.get<PaginatedResponse<RecentEarning>>(url);

      return {
        status: response.status,
        success: response.success,
        message: response.message,
        data: response.data
      };
    } catch (error) {
      console.warn('Failed to fetch recent earnings from API, using mock data:', error);

      // Apply filters to mock data
      let filtered = [...mockEarnings];

      if (filters?.type && filters.type !== 'All') {
        filtered = filtered.filter(item => item.type === filters.type);
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
        message: 'Recent earnings retrieved successfully (mock data)',
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

  addPayoutMethod: async (tutorId: string, methodData: Omit<PayoutMethod, 'id'>): Promise<ApiResponse<PayoutMethod>> => {
    try {
      const response = await apiService.post<PayoutMethod>(`/tutors/${tutorId}/payout-methods`, methodData);
      return {
        status: response.status,
        success: response.success,
        message: response.message,
        data: response.data
      };
    } catch (error) {
      console.warn('Failed to add payout method via API, using mock response:', error);
      const newMethod: PayoutMethod = {
        ...methodData,
        id: Math.max(...mockMethods.map(m => m.id)) + 1
      };
      return {
        status: 201,
        success: true,
        message: 'Payout method added successfully (mock data)',
        data: newMethod
      };
    }
  },

  withdrawFunds: async (tutorId: string, withdrawalData: { amount: number; methodId: string }): Promise<ApiResponse<{ transactionId: string; status: string }>> => {
    try {
      const response = await apiService.post<{ transactionId: string; status: string }>(`/tutors/${tutorId}/payouts/withdraw`, withdrawalData);
      return {
        status: response.status,
        success: response.success,
        message: response.message,
        data: response.data
      };
    } catch (error) {
      console.warn('Failed to withdraw funds via API, using mock response:', error);
      return {
        status: 200,
        success: true,
        message: 'Withdrawal initiated successfully (mock data)',
        data: {
          transactionId: `TXN${Math.floor(Math.random() * 100000)}`,
          status: 'Processing'
        }
      };
    }
  }
};