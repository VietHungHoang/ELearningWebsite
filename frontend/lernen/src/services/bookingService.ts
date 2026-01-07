import apiService from './apiService';

export interface BookingHistoryFilters {
  page?: number;
  limit?: number;
  status?: string;
}

export interface BookingHistoryItem {
  id: string;
  studentId: string;
  tutorId: string;
  classId?: string;
  sessionsPurchased: number;
  discount: number;
  pricePerSession: number;
  amount: number;
  paymentProvider: string;
  transactionId?: string;
  providerTransactionId?: string;
  schedule?: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  notes?: string;
  createdAt: string;
  updatedAt: string;
  tutorName?: string;
  className?: string;
  classType?: string;
}

const bookingService = {
  createBooking: async (bookingData: any) => {
    const response = await apiService.post('/v1/bookings', bookingData);
    return response.data; // assume has bookingId
  },

  getBookingHistory: async (filters?: BookingHistoryFilters) => {
    const queryParams = new URLSearchParams();

    if (filters?.page !== undefined) queryParams.append('page', filters.page.toString());
    if (filters?.limit) queryParams.append('limit', filters.limit.toString());
    if (filters?.status) queryParams.append('status', filters.status);

    const url = `/v1/bookings/me/history${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return await apiService.get<any>(url);
  }
};

export default bookingService;