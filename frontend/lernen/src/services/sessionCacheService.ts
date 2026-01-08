/**
 * Session Cache Service
 * Caches session state (PRESENT status and Zoom links) to avoid unnecessary API calls
 */

interface CachedSessionState {
    sessionId: string;
    status: string; // PRESENT, BOOKED
    zoomJoinUrl: string;
    zoomPassword?: string;
    meetingLink: string;
    attendanceStatus: string;
    cachedAt: number; // timestamp
}

const CACHE_KEY_PREFIX = 'session_state_';
const CACHE_EXPIRY_MS = 24 * 60 * 60 * 1000; // 24 hours

export const sessionCacheService = {
    /**
     * Save session state to localStorage
     */
    saveSessionState: (
        sessionId: string,
        status: string,
        zoomJoinUrl: string,
        meetingLink: string,
        attendanceStatus: string,
        zoomPassword?: string
    ): void => {
        try {
            const cacheData: CachedSessionState = {
                sessionId,
                status,
                zoomJoinUrl,
                zoomPassword,
                meetingLink,
                attendanceStatus,
                cachedAt: Date.now(),
            };
            localStorage.setItem(
                `${CACHE_KEY_PREFIX}${sessionId}`,
                JSON.stringify(cacheData)
            );
        } catch (error) {
            console.error('Failed to cache session state:', error);
        }
    },

    /**
     * Get cached session state from localStorage
     * Returns null if not found or expired
     */
    getSessionState: (sessionId: string): CachedSessionState | null => {
        try {
            const cached = localStorage.getItem(`${CACHE_KEY_PREFIX}${sessionId}`);
            if (!cached) return null;

            const data: CachedSessionState = JSON.parse(cached);

            // Check if cache is expired
            const age = Date.now() - data.cachedAt;
            if (age > CACHE_EXPIRY_MS) {
                // Clear expired cache
                sessionCacheService.clearSessionState(sessionId);
                return null;
            }

            return data;
        } catch (error) {
            console.error('Failed to read cached session state:', error);
            return null;
        }
    },

    /**
     * Clear specific session state
     */
    clearSessionState: (sessionId: string): void => {
        try {
            localStorage.removeItem(`${CACHE_KEY_PREFIX}${sessionId}`);
        } catch (error) {
            console.error('Failed to clear session state:', error);
        }
    },

    /**
     * Clear all cached session states
     */
    clearAllStates: (): void => {
        try {
            const keys = Object.keys(localStorage);
            keys.forEach((key) => {
                if (key.startsWith(CACHE_KEY_PREFIX)) {
                    localStorage.removeItem(key);
                }
            });
        } catch (error) {
            console.error('Failed to clear all session states:', error);
        }
    },

    /**
     * Check if session has been joined (PRESENT status cached)
     */
    hasJoinedSession: (sessionId: string): boolean => {
        const cached = sessionCacheService.getSessionState(sessionId);
        return cached !== null && (cached.status === 'PRESENT' || cached.status === 'BOOKED');
    },

    /**
     * Get cached Zoom URL if available
     */
    getCachedZoomUrl: (sessionId: string): string | null => {
        const cached = sessionCacheService.getSessionState(sessionId);
        return cached?.zoomJoinUrl || cached?.meetingLink || null;
    },
};

export default sessionCacheService;
