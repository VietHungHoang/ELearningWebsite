export interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  createdAt: string;
  metadata?: Record<string, unknown>;
}

// BFF Response Types for Notifications

export interface ViewNotificationBFFResponse {
    userId: string;
    notifications: NotificationItemBFF[];
    totalCount: number;
    page: number;
    pageSize: number;
    unreadCount: number;
}

export interface NotificationItemBFF {
    id: string;
    type: string;
    title: string;
    message: string;
    read: boolean;
    createdAt: string;
    metadata: Record<string, unknown>;
}

export interface MarkAsReadBFFResponse {
    notificationId: string;
    userId: string;
    read: boolean;
    message: string;
}

export interface MarkAllAsReadBFFResponse {
    userId: string;
    updatedCount: number;
    message: string;
}