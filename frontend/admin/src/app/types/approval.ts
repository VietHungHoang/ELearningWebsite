import { TutorLanguage, TutorSubject, Certification, CareerEntry, TutorSocial, TutorAvailability } from './instructor';

// Request status types
export type InstructorRequestStatus = 'PENDING' | 'REQUEST_CHANGES' | 'APPROVED' | 'REJECTED';

// Backend API response structure
export interface InstructorRequestBackend {
    tutorId: string;
    email: string;
    fullName: string;
    avatarUrl: string | null;
    subjectIds: string[] | null;
    currentStep: number;
    status: InstructorRequestStatus;
    description: string | null;
    createdAt: string;
    updatedAt: string;
}

// InstructorRequest - for list view (minimal info)
export interface InstructorRequest {
    id: string;
    name: string;
    email?: string;
    avatarUrl?: string | null;
    experience?: number;
    languages?: TutorLanguage[];
    subjectIds?: string[];
    certifications?: Certification[];
    careerEntries?: CareerEntry[];
    currentStep?: number;
    description?: string | null;

    // Request info
    requestStatus: InstructorRequestStatus;
    submittedAt: string;
    updatedAt?: string;
}

// InstructorRequestDetail - for detail view (complete info)
export interface InstructorRequestDetail extends InstructorRequest {
    // Additional basic info
    email: string;
    avatarUrl: string;
    countryCode?: string;
    gender?: string;
    instructorLevel?: string[];

    // Pricing
    initialPrice?: number;
    timezone?: string;

    // Additional info
    headline?: string;
    introduction?: string;
    videoUrl?: string;
    videoThumbnailUrl?: string;
    socialLinks?: TutorSocial[];

    // Availability
    availableSchedule?: { [key: string]: string[] };
    availabilities?: TutorAvailability[];

    // Review info
    reason?: string;
    reviewedBy?: string;
    reviewedAt?: string;
}

// Mapper function to convert backend response to frontend format
export function mapBackendToInstructorRequest(backend: InstructorRequestBackend): InstructorRequest {
    return {
        id: backend.tutorId,
        name: backend.fullName,
        email: backend.email,
        avatarUrl: backend.avatarUrl,
        subjectIds: backend.subjectIds || [],
        currentStep: backend.currentStep,
        description: backend.description,
        requestStatus: backend.status,
        submittedAt: backend.createdAt,
        updatedAt: backend.updatedAt
    };
}
