import apiService from './apiService';

export interface Notification {
  id: number;
  sender: string;
  time: string;
  isRead: boolean;
}

class NotificationsService {
  async getNotifications(): Promise<Notification[]> {
    try {
      // Try API call first
      const response = await apiService.get('/notifications');
      return response.data as Notification[];
    } catch (error) {
      console.warn('API call failed, using mock data:', error);
      // Fallback to mock data
      return [
        { id: 1, sender: 'Olivia Wilson', time: '3m', isRead: false },
        { id: 2, sender: 'William Moore', time: '3m', isRead: true },
        { id: 3, sender: 'Sophia Taylor', time: '4m', isRead: false },
      ];
    }
  }

  async loadMoreNotifications(page: number, perPage: number): Promise<Notification[]> {
    try {
      const response = await apiService.get(`/notifications?page=${page}&perPage=${perPage}`);
      return response.data as Notification[];
    } catch (error) {
      console.warn('API call failed, using mock data:', error);
      // Mock additional notifications
      const mockNotifications: Notification[] = [
        { id: 4, sender: 'James Anderson', time: '4m', isRead: true },
        { id: 5, sender: 'Isabella Thomas', time: '5m', isRead: false },
        { id: 6, sender: 'Logan Jackson', time: '5m', isRead: true },
      ];
      return mockNotifications.slice((page - 1) * perPage, page * perPage);
    }
  }
}

const notificationsService = new NotificationsService();
export default notificationsService;