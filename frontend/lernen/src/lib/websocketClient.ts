// // WebSocket client using SockJS + STOMP for real-time notifications
// import SockJS from 'sockjs-client';
// import { Client } from '@stomp/stompjs';

// let stompClient: Client | null = null;
// let reconnectAttempts = 0;
// let activeSubscription: ReturnType<Client['subscribe']> | null = null;
// const MAX_RECONNECT_ATTEMPTS = 5;
// const RECONNECT_DELAY = 3000;

// export interface WebSocketMessage {
//   type: string;
//   data: unknown;
// }

// type MessageHandler = (message: WebSocketMessage) => void;
// const messageHandlers: MessageHandler[] = [];

// /**
//  * Connect to WebSocket using STOMP protocol
//  * @param userId User ID to subscribe to
//  * @param onMessage Callback when message received
//  */
// export const connectWebSocket = (userId: string, onMessage: MessageHandler): void => {
//   try {
//     const wsUrl = `http://localhost:8083/ws-notifications`;
    
//     const socket = new SockJS(wsUrl);
//     stompClient = new Client({
//       webSocketFactory: () => socket,
//       reconnectDelay: RECONNECT_DELAY,
//       heartbeatIncoming: 4000,
//       heartbeatOutgoing: 4000,
//       onConnect: () => {
//         reconnectAttempts = 0;

        
//         // Add small delay to ensure subscription is ready before receiving messages
//         setTimeout(() => {
//           // Subscribe to user's notification topic
//           activeSubscription = stompClient?.subscribe(
//             `/topic/notifications/${userId}`,
//             (message) => {
//               try {
//                 const payload = JSON.parse(message.body) as WebSocketMessage;
//                 onMessage(payload);
                
//                 // Notify all handlers
//                 messageHandlers.forEach(handler => handler(payload));
//               } catch (error) {
//                 console.error('Error parsing WebSocket message:', error);
//               }
//             }
//           ) ?? null;
//         }, 100);
//       },
//       onDisconnect: () => {
//         reconnectAttempts = 0; // Reset attempts on disconnect
//       },
//       onStompError: () => {
//         // Implement reconnect logic
//         if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
//           reconnectAttempts++;
//           setTimeout(() => {
//             stompClient?.activate();
//           }, RECONNECT_DELAY);
//         }
//       },
//       onWebSocketError: (error) => {
//         console.error('WebSocket connection error:', error);
//       },
//     });

//     stompClient.activate();
//   } catch (error) {
//     console.error('WebSocket connection failed:', error);
//   }
// };

// /**
//  * Disconnect from WebSocket
//  */
// export const disconnectWebSocket = (): void => {
//   // Unsubscribe from active subscription
//   if (activeSubscription) {
//     activeSubscription.unsubscribe();
//     activeSubscription = null;
//   }
  
//   if (stompClient && stompClient.connected) {
//     stompClient.deactivate();
//     stompClient = null;
//   }
// };

// /**
//  * Send message through WebSocket
//  */
// export const sendWebSocketMessage = (destination: string, message: WebSocketMessage): void => {
//   if (stompClient && stompClient.connected) {
//     stompClient.publish({
//       destination: destination,
//       body: JSON.stringify(message),
//     });
//   } else {
//     console.warn('STOMP client is not connected');
//   }
// };

// /**
//  * Subscribe to WebSocket messages
//  */
// export const subscribeToWebSocket = (handler: MessageHandler): (() => void) => {
//   messageHandlers.push(handler);
  
//   // Return unsubscribe function
//   return () => {
//     const index = messageHandlers.indexOf(handler);
//     if (index > -1) {
//       messageHandlers.splice(index, 1);
//     }
//   };
// };
