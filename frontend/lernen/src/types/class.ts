export interface UserBasicInfoResponse {
    id: string;
    fullName: string;
    name?: string; // Alias for fullName, for backward compatibility
    avatarUrl?: string;
    enrollmentStatus?: EnrollmentStatus;
}

export type EnrollmentStatus = 'JOINED' | 'PENDING_PAYMENT' | 'ON_GOING' | 'COMPLETED';

export interface ClassBasicInfoResponse {
    id: string;
    title: string;
}

export interface ClassSchedule {
    dayOfWeek: number; // 1=Monday, 2=Tuesday, etc.
    time: string; // LocalTime format like "14:30" or "5:00 PM"
}

export type ClassStatus = 'ONGOING' | 'COMPLETED' | 'OPENING' | 'CANCELLED';

export interface ClassTable extends ClassBasicInfoResponse {
    students: UserBasicInfoResponse[];
    type: ClassType;
    status: ClassStatus;
    schedules: ClassSchedule[];
    startDate: string;
    completedSessions: number;
    totalSessions: number;
}

export interface ClassStudent {
    id: string;
    name: string;
    avatar: string;
}

export interface ClassQuiz {
    id: string;
    title: string;
    status: 'Completed' | 'Pending';
}

export interface ClassMaterial {
    id: string;
    name: string;
    type: 'PDF' | 'Video' | 'ZIP';
    date: string;
}

export interface ClassStats {
    totalStudents: number;
    activeStudents: number;
    completedSessions: number;
    totalSessions: number;
    averageAttendance: number;
    averageProgress: number;
}

export interface ClassSession {
    id: string;
    date: string;
    time: string;
    duration: string;
    topic: string;
    attendance: { studentId: string; status: 'Present' | 'Absent' | 'Late' }[];
    materials: ClassMaterial[];
}

export interface ClassDetail extends ClassTable {
    stats: ClassStats;
    sessions: ClassSession[];
    announcements: { id: string; title: string; content: string; date: string; author: string }[];
    assignments: { id: string; title: string; description: string; dueDate: string; submissions: number }[];
}

export type ClassType = 'ONE_ON_ONE' | 'GROUP' | 'TRIAL';


export interface Session {
    id: string;
    students: UserBasicInfoResponse[];
    tutor: UserBasicInfoResponse;
    sessionDatetime: string;
    classInfo: ClassBasicInfoResponse;
    className?: string; // Optional className field
    sessionType: ClassType;
    createdAt: string;
    updatedAt: string;
    meetingUrl?: string;
    notes?: string;
}

export interface GetBookedSessionsRequest {
    tutorId: string;
    startDate: string;
    endDate: string;
}

// Backend returns Session[] directly in data field, not wrapped
export type GetBookedSessionsResponse = Session[];