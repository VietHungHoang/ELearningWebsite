import apiService from './apiService';

const bookingService = {
  createBooking: async (bookingData: any) => {
    const response = await apiService.post('/v1/bookings', bookingData);
    return response.data; // assume has bookingId
  },
};

export default bookingService;