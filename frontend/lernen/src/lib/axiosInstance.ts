import axios, { type AxiosInstance, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios';
import { store } from './store';
import { logout } from '../features/auth/store/authSlice';

// Helper function to setup interceptors
const setupInterceptors = (instance: AxiosInstance) => {
  let isRefreshing = false;
  let failedQueue: Array<{ resolve: (value?: unknown) => void; reject: (error: unknown) => void; config: InternalAxiosRequestConfig }> = [];

  // Request interceptor to attach access token
  instance.interceptors.request.use(
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
  instance.interceptors.response.use(
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
            // No refresh token, dispatch logout
            store.dispatch(logout());
            return Promise.reject(error);
          }

          // Attempt to refresh token
          const response = await axios.post(`${instance.defaults.baseURL}/auth/refresh`, {
            refreshToken,
          });

          const { accessToken, refreshToken: newRefreshToken } = response.data;

          // Update tokens in storage
          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('refreshToken', newRefreshToken);

          // Process queued requests
          failedQueue.forEach(({ resolve, config }) => {
            config.headers.Authorization = `Bearer ${accessToken}`;
            resolve(instance(config));
          });
          failedQueue = [];

          isRefreshing = false;

          // Retry original request
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return instance(originalRequest);
        } catch (refreshError) {
          // Process queued requests with rejection
          failedQueue.forEach(({ reject }) => reject(refreshError));
          failedQueue = [];

          isRefreshing = false;

          // Refresh failed, dispatch logout
          store.dispatch(logout());
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    }
  );
};

// Create axios instance for Cart BE on port 8080
const cartAxiosInstance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Create axios instance for Notifications BE on port 8083
const notificationsAxiosInstance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_NOTIFICATIONS_API_BASE_URL || 'http://localhost:8083/api/notifications',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Setup interceptors for both instances
setupInterceptors(cartAxiosInstance);
setupInterceptors(notificationsAxiosInstance);

export default cartAxiosInstance;
export { notificationsAxiosInstance };
