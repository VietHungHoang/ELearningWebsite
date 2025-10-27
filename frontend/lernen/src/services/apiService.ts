import axiosInstance from '../lib/axiosInstance';
import type { ApiResponse } from '../types/api';

// Generic API service class
class ApiService {
  // GET request
  async get<T>(url: string, params?: Record<string, unknown>): Promise<ApiResponse<T>> {
    // eslint-disable-next-line no-useless-catch
    try {
      const response = await axiosInstance.get(url, { params });
      return response.data; // Assuming backend returns ApiResponse<T>
    } catch (error) {
      throw error; // Let calling service handle error
    }
  }

  // POST request
  async post<T>(url: string, data?: unknown): Promise<ApiResponse<T>> {
    // eslint-disable-next-line no-useless-catch
    try {
      const response = await axiosInstance.post(url, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // PUT request
  async put<T>(url: string, data?: unknown): Promise<ApiResponse<T>> {
    // eslint-disable-next-line no-useless-catch
    try {
      const response = await axiosInstance.put(url, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // DELETE request
  async delete<T>(url: string): Promise<ApiResponse<T>> {
    // eslint-disable-next-line no-useless-catch
    try {
      const response = await axiosInstance.delete(url);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

// Export a singleton instance
const apiService = new ApiService();
export default apiService;