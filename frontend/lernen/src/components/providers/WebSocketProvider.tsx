import React, { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { connectWebSocket, disconnectWebSocket } from '../../lib/websocketClient';
import notificationsService from '../../services/notificationsService';

interface WebSocketContextType {
  notificationCount: number;
  refreshNotificationCount: () => Promise<void>;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
};

interface WebSocketProviderProps {
  children: ReactNode;
}

const WebSocketProvider: React.FC<WebSocketProviderProps> = ({ children }) => {
  const [notificationCount, setNotificationCount] = useState(0);

  const refreshNotificationCount = useCallback(async () => {
    try {
      const count = await notificationsService.getUnreadCount();
      setNotificationCount(count);
    } catch (error) {
      console.error('Failed to refresh notification count:', error);
    }
  }, []);

  useEffect(() => {
    // Initial load
    refreshNotificationCount();

    // Connect WebSocket for realtime updates
    const userId = '1001'; // TODO: Get from auth store
    connectWebSocket(userId, () => {
      // Refresh count when new notification arrives
      refreshNotificationCount();
    });

    // Cleanup on app unmount
    return () => {
      disconnectWebSocket();
    };
  }, [refreshNotificationCount]);

  const value = {
    notificationCount,
    refreshNotificationCount,
  };

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
};

export default WebSocketProvider;