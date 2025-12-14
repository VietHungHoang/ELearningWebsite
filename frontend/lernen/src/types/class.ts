import type { Student } from "./api";

export interface BookedSession {
    id: string;
    students: Student[];
    sessionDatetime: string;
    className: string;
    sessionType: '1-on-1' | 'Group' | 'Trial';
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

export interface GetBookedSessionsResponse {
    sessions: BookedSession[];
}