import apiService from './apiService';
import type { LoginRequest, LoginResponse, SignUpRequest, SignUpResponse } from '../types/api';

const login = async (request: LoginRequest): Promise<LoginResponse> => {
  const response = await apiService.post<LoginResponse>('/auth/login', request);
  if (!response.success) {
    throw new Error(response.message);
  }
  return response.data;
};

const signup = async (request: SignUpRequest): Promise<SignUpResponse> => {
  const response = await apiService.post<SignUpResponse>('/auth/register', request);
  if (!response.success) {
    throw new Error(response.message);
  }
  return response.data;
};

export default { login, signup };
