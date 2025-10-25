import apiService from './apiService';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    role: 'Student' | 'Tutor' | 'Admin';
    name: string;
    email: string;
  };
}

const login = async (request: LoginRequest): Promise<LoginResponse> => {
  const response = await apiService.post<LoginResponse>('/auth/login', request);
  if (!response.success) {
    throw new Error(response.message);
  }
  return response.data;
};

export default { login };
