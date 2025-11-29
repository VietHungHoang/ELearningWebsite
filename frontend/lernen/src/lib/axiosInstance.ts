import axios, { type AxiosInstance, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios';

// Create axios instance with base configuration
const axiosInstance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081/api',
  // baseURL: import.meta.env.VITE_API_BASE_URL || 'https://lernen-api-gateway.onrender.com/api',
  timeout: 100000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Queue for failed requests during refresh
let isRefreshing = false;
let failedQueue: Array<{ resolve: (value?: unknown) => void; reject: (error: unknown) => void; config: InternalAxiosRequestConfig }> = [];

// Request interceptor to attach access token
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Exclude public endpoints like login and register
    if (!config.url?.includes('/auth/login') && !config.url?.includes('/auth/register')) {
      const token = localStorage.getItem('accessToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle token refresh on 401
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    // Response is kept as is, services will handle ApiResponse
    return response;
  },
  async (error) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Add to queue
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject, config: originalRequest });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
          // No refresh token, clear storage and redirect
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          window.location.href = '/login';
          return Promise.reject(error);
        }

        // Attempt to refresh token
        const response = await axios.post(`${axiosInstance.defaults.baseURL}/v1/auth/refresh-token`, {
          refreshToken,
        });

        const { accessToken, refreshToken: newRefreshToken } = response.data.data;

        // Update tokens in storage
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', newRefreshToken);

        // Process queued requests
        failedQueue.forEach(({ resolve, config }) => {
          config.headers.Authorization = `Bearer ${accessToken}`;
          resolve(axiosInstance(config));
        });
        failedQueue = [];

        isRefreshing = false;

        // Retry original request
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // Process queued requests with rejection
        failedQueue.forEach(({ reject }) => reject(refreshError));
        failedQueue = [];

        isRefreshing = false;

        // Refresh failed, clear storage and redirect
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;