import type { Notification } from '../types/notifications';

const API_BASE_URL ='http://ec2-13-236-4-126.ap-southeast-2.compute.amazonaws.com:8081';

interface SseConnectionOptions {
    onNotification: (notification: Notification) => void;
    onConnected?: () => void;
    onError?: (error: Event) => void;
    onDisconnect?: () => void;
}

class SseService {
    private eventSource: EventSource | null = null;
    private userId: string | null = null;
    private reconnectAttempts = 0;
    private maxReconnectAttempts = 5;
    private reconnectDelay = 3000; // 3 seconds
    private options: SseConnectionOptions | null = null;

    /**
     * Connect to SSE endpoint for real-time notifications
     */
    connect(userId: string, options: SseConnectionOptions): void {
        // Prevent duplicate connections
        if (this.eventSource && this.userId === userId) {
            console.log('[SSE] Already connected for user:', userId);
            return;
        }

        // Disconnect existing connection if any
        this.disconnect();

        this.userId = userId;
        this.options = options;
        this.reconnectAttempts = 0;

        this.createConnection();
    }

    private createConnection(): void {
        if (!this.userId || !this.options) return;

        const sseUrl = `${API_BASE_URL}/api/v1/sse/subscribe/${this.userId}`;
        console.log('[SSE] Connecting to:', sseUrl);

        this.eventSource = new EventSource(sseUrl);

        // Handle connection established
        this.eventSource.addEventListener('connected', (event: MessageEvent) => {
            console.log('[SSE] Connected:', event.data);
            this.reconnectAttempts = 0;
            this.options?.onConnected?.();
        });

        // Handle incoming notifications
        this.eventSource.addEventListener('notification', (event: MessageEvent) => {
            try {
                const notification: Notification = JSON.parse(event.data);
                console.log('[SSE] Received notification:', notification);
                this.options?.onNotification(notification);
            } catch (error) {
                console.error('[SSE] Failed to parse notification:', error);
            }
        });

        // Handle errors
        this.eventSource.onerror = (error: Event) => {
            console.error('[SSE] Connection error:', error);
            this.options?.onError?.(error);

            // Attempt reconnection
            if (this.reconnectAttempts < this.maxReconnectAttempts) {
                this.reconnectAttempts++;
                console.log(`[SSE] Reconnecting... attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts}`);

                this.eventSource?.close();
                setTimeout(() => this.createConnection(), this.reconnectDelay);
            } else {
                console.error('[SSE] Max reconnection attempts reached');
                this.disconnect();
                this.options?.onDisconnect?.();
            }
        };

        // Handle connection close
        this.eventSource.onopen = () => {
            console.log('[SSE] Connection opened');
        };
    }

    /**
     * Disconnect from SSE endpoint
     */
    disconnect(): void {
        if (this.eventSource) {
            console.log('[SSE] Disconnecting...');
            this.eventSource.close();
            this.eventSource = null;
            this.userId = null;
            this.options = null;
        }
    }

    /**
     * Check if currently connected
     */
    isConnected(): boolean {
        return this.eventSource !== null && this.eventSource.readyState === EventSource.OPEN;
    }

    /**
     * Get current user ID
     */
    getCurrentUserId(): string | null {
        return this.userId;
    }
}

// Singleton instance
const sseService = new SseService();
export default sseService;
