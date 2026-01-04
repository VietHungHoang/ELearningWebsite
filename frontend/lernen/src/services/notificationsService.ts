import apiService from './apiService';
import type { Notification, ViewNotificationBFFResponse } from '../types/notifications';

const getUserId = (): string => {
  // Get userId from localStorage (set by AuthContext on login)
  try {
    const authData = localStorage.getItem('auth');
    if (authData) {
      const parsed = JSON.parse(authData);
      return parsed.user?.id || '';
    }
  } catch (e) {
    console.error('Failed to get userId from localStorage:', e);
  }
  return '';
};

class NotificationsService {
  async getNotifications(): Promise<Notification[]> {
    try {
      const userId = getUserId();
      const response = await apiService.get<ViewNotificationBFFResponse>(`/v1/notifications/${userId}`, {
        page: 0,
        size: 3
      });

      if (response.success === true && response.data) {
        // Extract notifications from BFF response
        const notifications = response.data.notifications || [];
        return notifications;
      } else {
        throw new Error(response.message || 'Failed to fetch notifications');
      }
    } catch (error) {
      console.error('Error fetching notifications from API:', error);
      throw error;
    }
  }

  async loadMoreNotifications(page: number, size: number): Promise<Notification[]> {
    try {
      const userId = getUserId();
      const response = await apiService.get<ViewNotificationBFFResponse>(`/v1/notifications/${userId}`, {
        page,
        size
      });

      if (response.success === true && response.data) {
        // Extract notifications from BFF response
        const notifications = response.data.notifications || [];
        return notifications;
      } else {
        throw new Error(response.message || 'Failed to load more notifications');
      }
    } catch (error) {
      console.error('Error loading more notifications from API:', error);
      throw error;
    }
  }

  async getUnreadCount(): Promise<number> {
    try {
      const userId = getUserId();
      const response = await apiService.get<number>(`/v1/notifications/${userId}/unread-count`);
      if (response.success === true && typeof response.data === 'number') {
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to fetch unread count');
      }
    } catch (error) {
      console.error('Error fetching unread count from API:', error);
      throw error;
    }
  }

  async markAsRead(notificationId: string): Promise<void> {
    try {
      const userId = getUserId();
      await apiService.post<void>(`/v1/notifications/${notificationId}/${userId}/mark-read`);
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  }

  async markAllAsRead(): Promise<void> {
    try {
      const userId = getUserId();
      await apiService.post<void>(`/v1/notifications/${userId}/mark-all-read`);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  }
}

const notificationsService = new NotificationsService();
export default notificationsService;