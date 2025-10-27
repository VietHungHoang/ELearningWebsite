import axios, {
  type AxiosInstance,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios';
import { store } from './store';
import { logout } from '../features/auth/store/authSlice';

/**
 * 🔧 Thiết lập interceptor cho một instance Axios
 */
const setupInterceptors = (instance: AxiosInstance) => {
  let isRefreshing = false;
  let failedQueue: Array<{
    resolve: (value?: unknown) => void;
    reject: (error: unknown) => void;
    config: InternalAxiosRequestConfig;
  }> = [];

  /**
   * 🟢 Request Interceptor
   * - Gắn access token vào header nếu có
   * - Bỏ qua các endpoint public như login / register
   */
  instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const isAuthEndpoint =
        config.url?.includes('/auth/login') || config.url?.includes('/auth/register');

      if (!isAuthEndpoint) {
        const token = localStorage.getItem('accessToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }

      return config;
    },
    (error) => Promise.reject(error)
  );

  /**
   * 🔴 Response Interceptor
   * - Tự động refresh token khi gặp lỗi 401
   * - Retry các request bị fail sau khi refresh thành công
   */
  instance.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error) => {
      const originalRequest = error.config as InternalAxiosRequestConfig & {
        _retry?: boolean;
      };

      // Xử lý lỗi 401 (Unauthorized)
      if (error.response?.status === 401 && !originalRequest._retry) {
        if (isRefreshing) {
          // Thêm request vào queue chờ refresh
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject, config: originalRequest });
          });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          const refreshToken = localStorage.getItem('refreshToken');
          if (!refreshToken) {
            store.dispatch(logout());
            return Promise.reject(error);
          }

          // 🔁 Gọi API refresh token
          const response = await axios.post(`${instance.defaults.baseURL}/auth/refresh`, {
            refreshToken,
          });

          const { accessToken, refreshToken: newRefreshToken } = response.data;

          // Lưu token mới
          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('refreshToken', newRefreshToken);

          // Retry các request trong queue
          failedQueue.forEach(({ resolve, config }) => {
            config.headers.Authorization = `Bearer ${accessToken}`;
            resolve(instance(config));
          });

          failedQueue = [];
          isRefreshing = false;

          // Retry request ban đầu
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return instance(originalRequest);
        } catch (refreshError) {
          // Nếu refresh fail → reject toàn bộ queue + logout
          failedQueue.forEach(({ reject }) => reject(refreshError));
          failedQueue = [];
          isRefreshing = false;

          store.dispatch(logout());
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    }
  );
};

/**
 * 🛒 Axios instance cho Cart Service (port 8080)
 */
const cartAxiosInstance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * 🔔 Axios instance cho Notification Service (port 8083)
 */
const notificationsAxiosInstance: AxiosInstance = axios.create({
  baseURL:
    import.meta.env.VITE_NOTIFICATIONS_API_BASE_URL ||
    'http://localhost:8083/api/notifications',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Áp dụng interceptor cho cả 2 instance
setupInterceptors(cartAxiosInstance);
setupInterceptors(notificationsAxiosInstance);

// Xuất instance mặc định và phụ
export default cartAxiosInstance;
export { notificationsAxiosInstance };
