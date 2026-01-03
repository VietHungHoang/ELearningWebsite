import apiService from "./apiService";

// ==================== INTERFACES ====================

export interface UserInfo {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    avatarUrl?: string;
    role?: string;
}

// ==================== CACHE ====================

const userCache = new Map<string, UserInfo>();
const pendingRequests = new Map<string, Promise<UserInfo | null>>();

// ==================== API ====================

/**
 * Fetch user info from API
 */
const fetchUserFromAPI = async (userId: string): Promise<UserInfo | null> => {
    try {
        const response = await apiService.get<UserInfo>(`/v1/auth/users/${userId}`);
        if (response.success && response.data) {
            return response.data;
        }
        return null;
    } catch (error) {
        console.error(`Failed to fetch user ${userId}:`, error);
        return null;
    }
};

// ==================== CACHE SERVICE ====================

/**
 * Get user info with caching
 * Returns cached data if available, otherwise fetches from API
 */
const getUserInfo = async (userId: string): Promise<UserInfo | null> => {
    // Check cache first
    if (userCache.has(userId)) {
        return userCache.get(userId)!;
    }

    // Check if there's already a pending request for this user
    if (pendingRequests.has(userId)) {
        return pendingRequests.get(userId)!;
    }

    // Create new request
    const request = fetchUserFromAPI(userId).then(user => {
        if (user) {
            userCache.set(userId, user);
        }
        pendingRequests.delete(userId);
        return user;
    });

    pendingRequests.set(userId, request);
    return request;
};

/**
 * Get multiple users info with caching
 */
const getUsersInfo = async (userIds: string[]): Promise<Map<string, UserInfo>> => {
    const results = new Map<string, UserInfo>();
    const uncachedIds: string[] = [];

    // Check cache first
    for (const userId of userIds) {
        if (userCache.has(userId)) {
            results.set(userId, userCache.get(userId)!);
        } else {
            uncachedIds.push(userId);
        }
    }

    // Fetch uncached users in parallel
    if (uncachedIds.length > 0) {
        const fetchPromises = uncachedIds.map(async (userId) => {
            const user = await getUserInfo(userId);
            if (user) {
                results.set(userId, user);
            }
        });
        await Promise.all(fetchPromises);
    }

    return results;
};

/**
 * Get display name for a user
 */
const getDisplayName = (user: UserInfo | null): string => {
    if (!user) return 'Unknown';
    if (user.firstName && user.lastName) {
        return `${user.firstName} ${user.lastName}`;
    }
    if (user.firstName) return user.firstName;
    if (user.lastName) return user.lastName;
    if (user.email) return user.email.split('@')[0];
    return 'Unknown';
};

/**
 * Get avatar URL for a user
 */
const getAvatarUrl = (user: UserInfo | null, fallbackSeed?: string): string => {
    if (user?.avatarUrl) return user.avatarUrl;
    const seed = fallbackSeed || user?.id || 'default';
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`;
};

/**
 * Pre-fetch and cache user info
 */
const prefetchUsers = async (userIds: string[]): Promise<void> => {
    const uncachedIds = userIds.filter(id => !userCache.has(id));
    if (uncachedIds.length > 0) {
        await getUsersInfo(uncachedIds);
    }
};

/**
 * Clear cache (useful for logout)
 */
const clearCache = (): void => {
    userCache.clear();
    pendingRequests.clear();
};

/**
 * Set user info manually (e.g., from auth context)
 */
const setUserInfo = (user: UserInfo): void => {
    userCache.set(user.id, user);
};

// ==================== EXPORTS ====================

export default {
    getUserInfo,
    getUsersInfo,
    getDisplayName,
    getAvatarUrl,
    prefetchUsers,
    clearCache,
    setUserInfo,
};
