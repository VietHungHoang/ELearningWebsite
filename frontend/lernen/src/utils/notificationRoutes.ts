/**
 * Notification URL Routing Configuration
 * 
 * Maps notification types to frontend routes based on metadata.
 * Backend sends `type` + `metadata`, frontend constructs the URL.
 */

type NotificationMetadata = Record<string, unknown>;

interface RouteConfig {
    pattern: (metadata: NotificationMetadata) => string;
    label?: string;
}

const notificationRoutes: Record<string, RouteConfig> = {
    // Payment events
    PAYMENT_SUCCESS: {
        pattern: (m) => `/my-classes/${m.classId || ''}`,
        label: 'View Class',
    },
    PAYMENT_FAILED: {
        pattern: (m) => `/checkout?retry=${m.bookingId || ''}`,
        label: 'Retry Payment',
    },

    // Booking events (for tutor)
    NEW_BOOKING_REQUEST: {
        pattern: (m) => `/tutor/requests/${m.bookingId || ''}`,
        label: 'View Request',
    },
    BOOKING_CONFIRMED: {
        pattern: (m) => `/my-classes/${m.classId || ''}`,
        label: 'View Class',
    },
    BOOKING_CANCELLED: {
        pattern: (m) => `/bookings/${m.bookingId || ''}`,
        label: 'View Details',
    },

    // Trial session events
    TRIAL_REQUEST: {
        pattern: (m) => `/tutor/trial-requests/${m.requestId || ''}`,
        label: 'View Trial Request',
    },
    TRIAL_APPROVED: {
        pattern: (m) => `/sessions/${m.sessionId || ''}`,
        label: 'View Session',
    },
    TRIAL_REJECTED: {
        pattern: (m) => `/tutors/${m.tutorId || ''}`,
        label: 'Find Another Tutor',
    },

    // Session events
    SESSION_REMINDER: {
        pattern: (m) => `/sessions/${m.sessionId || ''}`,
        label: 'Join Session',
    },
    SESSION_STARTED: {
        pattern: (m) => `/sessions/${m.sessionId || ''}`,
        label: 'Join Now',
    },
    SESSION_RESCHEDULED: {
        pattern: (m) => `/sessions/${m.sessionId || ''}`,
        label: 'View Details',
    },

    // Tutor approval (for tutor)
    TUTOR_APPROVED: {
        pattern: () => '/tutor/dashboard',
        label: 'Go to Dashboard',
    },
    TUTOR_REJECTED: {
        pattern: () => '/tutor/application',
        label: 'View Application',
    },

    // General/fallback
    SYSTEM: {
        pattern: () => '/notifications',
        label: 'View All',
    },
};

/**
 * Get the navigation URL for a notification based on its type and metadata.
 * Returns null if no route is configured for the notification type.
 */
export const getNotificationUrl = (type: string, metadata?: NotificationMetadata): string | null => {
    const config = notificationRoutes[type];
    if (!config) {
        console.warn(`No route configured for notification type: ${type}`);
        return null;
    }

    try {
        return config.pattern(metadata || {});
    } catch (error) {
        console.error(`Error generating URL for notification type ${type}:`, error);
        return null;
    }
};

/**
 * Get the action label for a notification type.
 */
export const getNotificationActionLabel = (type: string): string => {
    return notificationRoutes[type]?.label || 'View';
};

export default notificationRoutes;
