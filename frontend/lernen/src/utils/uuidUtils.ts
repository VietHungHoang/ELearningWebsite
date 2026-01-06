/**
 * Generate a UUID v4 compatible with all browsers
 * Falls back to a custom implementation if crypto.randomUUID is not available
 */
export const generateUUID = (): string => {
    // Try to use crypto.randomUUID if available (modern browsers)
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        try {
            return crypto.randomUUID();
        } catch (error) {
            // Fall through to custom implementation
        }
    }

    // Fallback: Custom UUID v4 implementation
    // Format: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
};

