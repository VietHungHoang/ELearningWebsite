import axiosInstance from '../lib/axiosInstance';
import type { ApiResponse } from '../types/api';
import type { Notification } from '../types/notifications';

// TEMPORARY: Hardcode userId = 1001 để test
const getUserId = (): string => {
  return '1001';
};

class NotificationsService {
  async getNotifications(): Promise<Notification[]> {
    try {
      const userId = getUserId();
      const url = `/user/${userId}`;
      const response = await axiosInstance.get(url);
      const apiResponse = response.data as ApiResponse<Notification[]>;
      
      if (apiResponse.success === true && apiResponse.data) {
        return apiResponse.data;
      } else {
        throw new Error(apiResponse.message || 'Failed to fetch notifications');
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
      const response = await axiosInstance.get(url);
      const apiResponse = response.data as ApiResponse<Notification[]>;
      
      if (apiResponse.success === true && apiResponse.data) {
        return apiResponse.data;
      } else {
        throw new Error(apiResponse.message || 'Failed to load more notifications');
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
      const response = await axiosInstance.get(url);
      const apiResponse = response.data as ApiResponse<number>;
      
      if (apiResponse.success === true && typeof apiResponse.data === 'number') {
        return apiResponse.data;
      } else {
        throw new Error(apiResponse.message || 'Failed to fetch unread count');
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

      await axiosInstance.post(url);
      // POST requests for marking as read typically return success/error in ApiResponse format
      // If backend returns ApiResponse, we can check it here, but for now assume success
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  }

  async markAllAsRead(): Promise<void> {
    try {
      const userId = getUserId();
      const url = `/user/${userId}/mark-all-read`;

      await axiosInstance.post(url);
      // POST requests for marking all as read typically return success/error in ApiResponse format
      // If backend returns ApiResponse, we can check it here, but for now assume success
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  }
}

const notificationsService = new NotificationsService();
export default notificationsService;