// Shared types for Tutor Dashboard

export interface Session {
    id: string;
    student: string;
    studentAvatar: string;
    course: string;
    topic: string;
    startTime: Date;
    duration: number;
    platform: 'Zoom' | 'Meet' | 'Teams';
    status: 'Confirmed' | 'Pending' | 'Rescheduled';
    isOnline?: boolean;
}

export interface Activity {
    id: string;
    type: 'enrollment' | 'review' | 'completion' | 'payment';
    title: string;
    description: string;
    timestamp: Date;
    metadata?: {
        rating?: number;
        amount?: number;
        studentName?: string;
        courseName?: string;
    };
}
