import { Client, type StompSubscription, type IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { type MessageResponse } from './chatService';

// WebSocket base URL
const WS_BASE_URL = import.meta.env.VITE_CHAT_WS_URL || 'http://localhost:8089/ws/chat';

export interface TypingIndicator {
    conversationId: string;
    userId: string;
    isTyping: boolean;
}

export interface ReadReceipt {
    conversationId: string;
    messageId: string;
    userId: string;
    readAt: string;
}

export interface PresenceStatus {
    userId: string;
    status: 'ONLINE' | 'OFFLINE' | 'AWAY';
    lastSeenAt?: string;
}

class ChatWebSocketService {
    private client: Client | null = null;
    private subscriptions: Map<string, StompSubscription> = new Map();
    private reconnectAttempts = 0;
    private maxReconnectAttempts = 5;
    private reconnectDelay = 3000;

    /**
     * Kết nối WebSocket
     */
    connect(userId: string, onConnected?: () => void, onError?: (error: Error) => void): void {
        if (this.client?.connected) {
            console.log('WebSocket already connected');
            return;
        }

        const token = localStorage.getItem('accessToken');
        if (!token) {
            console.error('No access token found');
            onError?.(new Error('No access token found'));
            return;
        }

        this.client = new Client({
            webSocketFactory: () => new SockJS(WS_BASE_URL) as any,
            connectHeaders: {
                Authorization: `Bearer ${token}`,
                'X-User-Id': userId,
            },
            debug: (str) => {
                console.log('STOMP Debug:', str);
            },
            reconnectDelay: this.reconnectDelay,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
            onConnect: () => {
                console.log('WebSocket connected');
                this.reconnectAttempts = 0;
                onConnected?.();
            },
            onStompError: (frame) => {
                console.error('STOMP error:', frame);
                onError?.(new Error(frame.headers['message'] || 'STOMP error'));
            },
            onWebSocketError: (event) => {
                console.error('WebSocket error:', event);
                onError?.(new Error('WebSocket connection error'));
            },
            onDisconnect: () => {
                console.log('WebSocket disconnected');
                this.handleReconnect(userId, onConnected, onError);
            },
        });

        this.client.activate();
    }

    /**
     * Xử lý reconnect
     */
    private handleReconnect(userId: string, onConnected?: () => void, onError?: (error: Error) => void): void {
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++;
            console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
            setTimeout(() => {
                this.connect(userId, onConnected, onError);
            }, this.reconnectDelay * this.reconnectAttempts);
        } else {
            console.error('Max reconnect attempts reached');
            onError?.(new Error('Failed to reconnect after maximum attempts'));
        }
    }

    /**
     * Ngắt kết nối
     */
    disconnect(): void {
        if (this.client) {
            this.subscriptions.forEach((subscription) => subscription.unsubscribe());
            this.subscriptions.clear();
            this.client.deactivate();
            this.client = null;
        }
    }

    /**
     * Subscribe để nhận tin nhắn từ conversation
     */
    subscribeToConversation(
        conversationId: string,
        onMessage: (message: MessageResponse) => void
    ): void {
        if (!this.client?.connected) {
            console.error('WebSocket not connected');
            return;
        }

        const topic = `/topic/conversation/${conversationId}`;
        const subscription = this.client.subscribe(topic, (message: IMessage) => {
            try {
                const parsedMessage = JSON.parse(message.body);
                onMessage(parsedMessage);
            } catch (error) {
                console.error('Error parsing message:', error);
            }
        });

        this.subscriptions.set(topic, subscription);
        console.log(`Subscribed to ${topic}`);
    }

    /**
     * Unsubscribe khỏi conversation
     */
    unsubscribeFromConversation(conversationId: string): void {
        const topic = `/topic/conversation/${conversationId}`;
        const subscription = this.subscriptions.get(topic);
        if (subscription) {
            subscription.unsubscribe();
            this.subscriptions.delete(topic);
            console.log(`Unsubscribed from ${topic}`);
        }
    }

    /**
     * Subscribe typing indicators
     */
    subscribeToTypingIndicators(
        conversationId: string,
        onTyping: (indicator: TypingIndicator) => void
    ): void {
        if (!this.client?.connected) {
            console.error('WebSocket not connected');
            return;
        }

        const topic = `/topic/conversation/${conversationId}/typing`;
        const subscription = this.client.subscribe(topic, (message: IMessage) => {
            try {
                const indicator = JSON.parse(message.body);
                onTyping(indicator);
            } catch (error) {
                console.error('Error parsing typing indicator:', error);
            }
        });

        this.subscriptions.set(topic, subscription);
    }

    /**
     * Subscribe read receipts
     */
    subscribeToReadReceipts(
        conversationId: string,
        onRead: (receipt: ReadReceipt) => void
    ): void {
        if (!this.client?.connected) {
            console.error('WebSocket not connected');
            return;
        }

        const topic = `/topic/conversation/${conversationId}/read`;
        const subscription = this.client.subscribe(topic, (message: IMessage) => {
            try {
                const receipt = JSON.parse(message.body);
                onRead(receipt);
            } catch (error) {
                console.error('Error parsing read receipt:', error);
            }
        });

        this.subscriptions.set(topic, subscription);
    }

    /**
     * Subscribe presence updates
     */
    subscribeToPresence(
        userId: string,
        onPresenceUpdate: (presence: PresenceStatus) => void
    ): void {
        if (!this.client?.connected) {
            console.error('WebSocket not connected');
            return;
        }

        const topic = `/user/${userId}/presence`;
        const subscription = this.client.subscribe(topic, (message: IMessage) => {
            try {
                const presence = JSON.parse(message.body);
                onPresenceUpdate(presence);
            } catch (error) {
                console.error('Error parsing presence update:', error);
            }
        });

        this.subscriptions.set(topic, subscription);
    }

    /**
     * Gửi tin nhắn qua WebSocket
     */
    sendMessage(conversationId: string, message: any): void {
        if (!this.client?.connected) {
            console.error('WebSocket not connected');
            return;
        }

        this.client.publish({
            destination: `/app/chat/${conversationId}`,
            body: JSON.stringify(message),
        });
    }

    /**
     * Gửi typing indicator
     */
    sendTypingIndicator(conversationId: string, isTyping: boolean): void {
        if (!this.client?.connected) {
            console.error('WebSocket not connected');
            return;
        }

        this.client.publish({
            destination: `/app/chat/${conversationId}/typing`,
            body: JSON.stringify({ isTyping }),
        });
    }

    /**
     * Mark message as read
     */
    markAsRead(conversationId: string, messageId: string): void {
        if (!this.client?.connected) {
            console.error('WebSocket not connected');
            return;
        }

        this.client.publish({
            destination: `/app/chat/${conversationId}/read`,
            body: JSON.stringify({ messageId }),
        });
    }

    /**
     * Kiểm tra trạng thái kết nối
     */
    isConnected(): boolean {
        return this.client?.connected || false;
    }
}

// Export singleton instance
const chatWebSocketService = new ChatWebSocketService();
export default chatWebSocketService;
