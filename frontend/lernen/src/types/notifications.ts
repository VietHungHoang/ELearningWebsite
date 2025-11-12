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