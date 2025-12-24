import apiService from './apiService';
import type { PaymentRequest, PaymentResponse } from '../types/api';

const initiatePayment = async (request: PaymentRequest): Promise<PaymentResponse> => {
  const response = await apiService.post<PaymentResponse>('/v1/payments/initiate', request);
  console.log(response);
  if (response.status !== 200) {
    throw new Error(response.message);
  }
  return response.data;
};

const getPaymentStatus = async (paymentId: string): Promise<PaymentResponse> => {
  const response = await apiService.get<PaymentResponse>(`/payment/status/${paymentId}`);
  if (response.status !== 200) {
    throw new Error(response.message);
  }
  return response.data;
};

const confirmPayment = async (params: {
  orderId?: string;
  partnerCode?: string;
  orderInfo?: string;
  orderType?: string;
  resultCode?: string;
  message?: string;
  payType?: string;
  responseTime?: string;
  signature?: string;
}) => {
  const response = await apiService.post('/v1/payments/confirm', params);
  if (response.status !== 200) {
    throw new Error(response.message || 'Verification failed');
  }
  return response;
};

export default { initiatePayment, getPaymentStatus, verifyPayment: confirmPayment };