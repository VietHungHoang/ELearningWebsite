import { notificationsAxiosInstance } from '../lib/axiosInstance';

export interface Notification {
  id: string;
  userId: number;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  read: boolean; // Backend uses 'read', not 'isRead'
  createdAt: string;
  metadata?: Record<string, unknown>;
}

// TEMPORARY: Hardcode userId = 1001 để test
const getUserId = (): string => {
  return '1001';
};

class NotificationsService {
  async getNotifications(): Promise<Notification[]> {
    try {
      const userId = getUserId();
      const url = `/user/${userId}`;
      
      const response = await notificationsAxiosInstance.get(url);

      // BE trả về ApiResponse<List<NotificationResponse>>
      if (response.status === 200 && response.data) {
        const responseData = response.data as Record<string, unknown>;
        
        // Check if response has data wrapper (ApiResponse format)
        if (responseData.data && Array.isArray(responseData.data)) {
          return responseData.data as Notification[];
        } else if (Array.isArray(responseData)) {
          return responseData as Notification[];
        } else {
          console.warn('Unexpected response format for notifications');
          return [];
        }
      } else {
        throw new Error('Failed to fetch notifications');
      }
    } catch (error) {
      console.error('Error fetching notifications from API:', error);
      throw error;
    }
  }

  async loadMoreNotifications(page: number, size: number): Promise<Notification[]> {
    try {
      const userId = getUserId();
      const url = `/user/${userId}?page=${page}&size=${size}`;
      
      const response = await notificationsAxiosInstance.get(url);

      if (response.status === 200 && response.data) {
        const responseData = response.data as Record<string, unknown>;
        
        if (responseData.data && Array.isArray(responseData.data)) {
          return responseData.data as Notification[];
        } else if (Array.isArray(responseData)) {
          return responseData as Notification[];
        } else {
          console.warn('Unexpected response format for notifications', responseData);
          return [];
        }
      } else {
        throw new Error('Failed to load more notifications');
      }
    } catch (error) {
      console.error('Error loading more notifications from API:', error);
      throw error;
    }
  }

  async getUnreadCount(): Promise<number> {
    try {
      const userId = getUserId();
      const url = `/user/${userId}/unread-count`;
      
      const response = await notificationsAxiosInstance.get(url);

      if (response.status === 200 && response.data) {
        const responseData = response.data as Record<string, unknown>;
        
        // BE trả về ApiResponse<Long>
        if (typeof responseData.data === 'number') {
          return responseData.data as number;
        }
        return 0;
      } else {
        throw new Error('Failed to fetch unread count');
      }
    } catch (error) {
      console.error('Error fetching unread count from API:', error);
      throw error;
    }
  }

  async markAsRead(notificationId: string): Promise<void> {
    try {
      const userId = getUserId();
      const url = `/${notificationId}/user/${userId}/mark-read`;
      
      await notificationsAxiosInstance.post(url);
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  }

  async markAllAsRead(): Promise<void> {
    try {
      const userId = getUserId();
      const url = `/user/${userId}/mark-all-read`;
      
      await notificationsAxiosInstance.post(url);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  }
}

const notificationsService = new NotificationsService();
export default notificationsService;