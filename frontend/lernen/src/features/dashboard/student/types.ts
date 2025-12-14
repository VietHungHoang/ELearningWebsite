// Shared types for Student Dashboard

export interface Booking {
    id: number;
    title: string;
    date: Date;
    durationHours: number;
    color: string;
    tutorName: string;
    tutorAvatar: string;
    status?: 'Confirmed' | 'Pending' | 'Completed' | 'Cancelled';
}

export interface StudentSession {
    id: string;
    tutor: string;
    tutorAvatar: string;
    course: string;
    topic: string;
    startTime: Date;
    duration: number;
    platform: 'Zoom' | 'Meet' | 'Teams';
    status: 'Confirmed' | 'Pending' | 'Rescheduled' | 'Completed';
    meetingLink?: string;
}

export interface StudentActivity {
    id: string;
    type: 'booking' | 'completion' | 'payment' | 'review';
    title: string;
    description: string;
    timestamp: Date;
    metadata?: {
        rating?: number;
        amount?: number;
        tutorName?: string;
        courseName?: string;
    };
}

