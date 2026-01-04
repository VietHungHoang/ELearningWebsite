import React, { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { useAuth } from './AuthContext';
import sseService from '../services/sseService';
import notificationsService from '../services/notificationsService';
import type { Notification } from '../types/notifications';

interface NotificationContextType {
    notifications: Notification[];
    unreadCount: number;
    isConnected: boolean;
    addNotification: (notification: Notification) => void;
    markAsRead: (notificationId: string) => Promise<void>;
    markAllAsRead: () => Promise<void>;
    refreshNotifications: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

interface NotificationProviderProps {
    children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
    const { state } = useAuth();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isConnected, setIsConnected] = useState(false);

    // Add new notification to the top of the list
    const addNotification = useCallback((notification: Notification) => {
        setNotifications(prev => {
            // Avoid duplicates
            if (prev.some(n => n.id === notification.id)) {
                return prev;
            }
            return [notification, ...prev];
        });

        // Increment unread count if not read
        if (!notification.read) {
            setUnreadCount(prev => prev + 1);
        }
    }, []);

    // Mark single notification as read
    const markAsRead = useCallback(async (notificationId: string) => {
        try {
            await notificationsService.markAsRead(notificationId);
            setNotifications(prev =>
                prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
            );
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error('Failed to mark notification as read:', error);
        }
    }, []);

    // Mark all notifications as read
    const markAllAsRead = useCallback(async () => {
        try {
            await notificationsService.markAllAsRead();
            setNotifications(prev => prev.map(n => ({ ...n, read: true })));
            setUnreadCount(0);
        } catch (error) {
            console.error('Failed to mark all notifications as read:', error);
        }
    }, []);

    // Fetch notifications from server
    const refreshNotifications = useCallback(async () => {
        try {
            const fetchedNotifications = await notificationsService.getNotifications();
            // Sort by createdAt (newest first) and deduplicate
            const sorted = fetchedNotifications.sort(
                (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
            setNotifications(sorted);

            // Update unread count
            const count = await notificationsService.getUnreadCount();
            setUnreadCount(count);
        } catch (error) {
            console.error('Failed to refresh notifications:', error);
        }
    }, []);

    // Connect to SSE when user is authenticated
    useEffect(() => {
        if (state.isAuthenticated && state.user?.id) {
            const userId = state.user.id;

            // Initial fetch
            refreshNotifications();

            // Connect to SSE for real-time updates
            sseService.connect(userId, {
                onNotification: addNotification,
                onConnected: () => setIsConnected(true),
                onError: () => setIsConnected(false),
                onDisconnect: () => setIsConnected(false),
            });
        } else {
            // Disconnect when logged out
            sseService.disconnect();
            setIsConnected(false);
            setNotifications([]);
            setUnreadCount(0);
        }

        return () => {
            sseService.disconnect();
        };
    }, [state.isAuthenticated, state.user?.id, addNotification, refreshNotifications]);

    const value: NotificationContextType = {
        notifications,
        unreadCount,
        isConnected,
        addNotification,
        markAsRead,
        markAllAsRead,
        refreshNotifications,
    };

    return (
        <NotificationContext.Provider value={value}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotifications = (): NotificationContextType => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotifications must be used within a NotificationProvider');
    }
    return context;
};

export default NotificationContext;
