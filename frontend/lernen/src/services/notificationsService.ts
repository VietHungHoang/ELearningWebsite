import apiService from './apiService';
import type { Notification, ViewNotificationBFFResponse } from '../types/notifications';

class NotificationsService {
  async getNotifications(): Promise<Notification[]> {
    try {
      const response = await apiService.get<ViewNotificationBFFResponse>('/v1/notifications', {
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
      const response = await apiService.get<ViewNotificationBFFResponse>('/v1/notifications', {
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
      const response = await apiService.get<number>('/v1/notifications/unread-count');
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
      await apiService.post<void>(`/v1/notifications/${notificationId}/mark-read`);
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  }

  async markAllAsRead(): Promise<void> {
    try {
      await apiService.post<void>('/v1/notifications/mark-all-read');
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  }
}

const notificationsService = new NotificationsService();
export default notificationsService;