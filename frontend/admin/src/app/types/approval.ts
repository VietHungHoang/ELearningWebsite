import { TutorLanguage, TutorSubject, Certification, CareerEntry, TutorSocial, TutorAvailability } from './instructor';

// Request status types
export type InstructorRequestStatus = 'PENDING' | 'REQUEST_CHANGES' | 'APPROVED' | 'REJECTED';

// InstructorRequest - for list view (minimal info)
export interface InstructorRequest {
    id: string;
    name: string;
    experience: number;
    languages: TutorLanguage[];
    subjects: TutorSubject[];
    certifications: Certification[];
    careerEntries: CareerEntry[];

    // Request info
    requestStatus: InstructorRequestStatus;
    submittedAt: string;
}

// InstructorRequestDetail - for detail view (complete info)
export interface InstructorRequestDetail extends InstructorRequest {
    // Additional basic info
    email: string;
    avatarUrl: string;
    countryCode: string;
    gender?: string;
    instructorLevel: string[];

    // Pricing
    initialPrice: number;
    timezone: string;

    // Additional info
    headline?: string;
    introduction?: string;
    videoUrl?: string;
    videoThumbnailUrl?: string;
    socialLinks: TutorSocial[];

    // Availability
    availableSchedule?: { [key: string]: string[] };
    availabilities?: TutorAvailability[];

    // Review info
    reason?: string;
    reviewedBy?: string;
    reviewedAt?: string;
}
