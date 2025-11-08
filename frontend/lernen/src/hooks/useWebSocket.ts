// import { createContext, useContext } from 'react';

// export interface WebSocketContextType {
//   notificationCount: number;
//   refreshNotificationCount: () => Promise<void>;
// }

// export const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

// export const useWebSocket = () => {
//   const context = useContext(WebSocketContext);
//   if (!context) {
//     throw new Error('useWebSocket must be used within a WebSocketProvider');
//   }
//   return context;
// };