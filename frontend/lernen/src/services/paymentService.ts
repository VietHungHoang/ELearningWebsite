import apiService from './apiService';
import type { PaymentRequest, PaymentResponse } from '../types/api';

const initiatePayment = async (request: PaymentRequest): Promise<PaymentResponse> => {
  const response = await apiService.post<PaymentResponse>('/payment/initiate', request);
  if (!response.success) {
    throw new Error(response.message);
  }
  return response.data;
};

const getPaymentStatus = async (paymentId: string): Promise<PaymentResponse> => {
  const response = await apiService.get<PaymentResponse>(`/payment/status/${paymentId}`);
  if (!response.success) {
    throw new Error(response.message);
  }
  return response.data;
};

export default { initiatePayment, getPaymentStatus };