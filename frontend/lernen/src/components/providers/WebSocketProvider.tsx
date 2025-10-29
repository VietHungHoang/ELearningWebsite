import React, { useEffect, useState, useCallback, type ReactNode } from 'react';
import { useSelector } from 'react-redux';
import { connectWebSocket, disconnectWebSocket } from '../../lib/websocketClient';
import notificationsService from '../../services/notificationsService';
import { WebSocketContext } from '../../hooks/useWebSocket';
import type { RootState, AuthState } from '../../lib/store';

interface WebSocketProviderProps {
  children: ReactNode;
}

const WebSocketProvider: React.FC<WebSocketProviderProps> = ({ children }) => {
  const [notificationCount, setNotificationCount] = useState(0);
  const user = useSelector((state: RootState) => (state.auth as AuthState).user);

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
    const userId = user?.id || '1001';
    connectWebSocket(userId, () => {
      // Refresh count when new notification arrives
      refreshNotificationCount();
    });

    // Cleanup on app unmount
    return () => {
      disconnectWebSocket();
    };
  }, [refreshNotificationCount, user?.id]);

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