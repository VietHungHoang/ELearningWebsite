import axiosInstance from "../../lib/axiosInstance.ts";
import type {ApiResponse} from "../../types/api.ts";

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
  const response = await axiosInstance.post<ApiResponse<LoginResponse>>('/auth/login', request);
  if (!response.data.success) {
    throw new Error(response.data.message);
  }
  return response.data.data;
};

export default { login };
